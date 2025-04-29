import { json } from '@sveltejs/kit';
import { getUserSupabaseAccessToken } from '$lib/server/supabase_tokens';

const debug = false;
function log(...args: any[]) {
    if (debug) console.log('[record]', ...args);
}

export async function GET(event) {
    return getRecordDetails(event);
}

/**
 * Fetches a single record, audit log, and table config for detailed dashboards.
 * @param {Object} event - The event object containing request details.
 */
async function getRecordDetails({ locals, cookies, url }) {
    const { user } = await locals.safeGetSession();
    if (!user?.id) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }
    log('User session validated for user:', user.id);

    const projectId = cookies.get('supabase_project_id');
    if (!projectId) {
        return json({ error: 'No project selected' }, { status: 400 });
    }

    const accessToken = await getUserSupabaseAccessToken(locals);
    if (!accessToken) {
        return json({ error: 'No Supabase access token' }, { status: 401 });
    }
    log('Retrieved project ID and access token', { projectId, accessTokenExists: !!accessToken });

    const table = url.searchParams.get('table');
    const id = url.searchParams.get('id');

    if (!table || !id) {
        return json({ error: 'Missing table or id' }, { status: 400 });
    }

    const apiUrl = `https://api.supabase.com/v1/projects/${projectId}/database/query`;

    // Prepare SQL queries
    const recordSql = `
    SELECT * FROM public."${table}"
    WHERE id = '${id.replace(/'/g, "''")}'
    LIMIT 1;
  `;

    const auditSql = `
    SELECT * FROM public.vh_audit_log
    WHERE record_table = '${table.replace(/'/g, "''")}'
      AND record_id = '${id.replace(/'/g, "''")}'
    ORDER BY created_at DESC
    LIMIT 5;
  `;

    const configSql = `
    SELECT * FROM public.vh_tables
    WHERE name = '${table.replace(/'/g, "''")}'
    LIMIT 1;
  `;

    try {
        // Fetch main record
        log('Fetching record with SQL:', recordSql.trim());
        const recordRes = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: recordSql })
        });

        if (!recordRes.ok) {
            const err = await recordRes.text();
            log('Failed to fetch record:', err);
            return json({ error: `Failed to fetch record: ${err}` }, { status: 500 });
        }

        const recordData = await recordRes.json();
        const rowData = recordData[0] || null;

        // Fetch recent audit log
        log('Fetching audit log with SQL:', auditSql.trim());
        const auditRes = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: auditSql })
        });

        if (!auditRes.ok) {
            const err = await auditRes.text();
            log('Failed to fetch audit log:', err);
            return json({ error: `Failed to fetch audit log: ${err}` }, { status: 500 });
        }

        const auditData = await auditRes.json();

        // Fetch table config
        log('Fetching table config with SQL:', configSql.trim());
        const configRes = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: configSql })
        });

        if (!configRes.ok) {
            const err = await configRes.text();
            log('Failed to fetch table config:', err);
            return json({ error: `Failed to fetch table config: ${err}` }, { status: 500 });
        }

        const configData = await configRes.json();
        const tableConfig = configData[0] || null;

        // Return combined result
        return json({
            table,
            recordId: id,
            rowData,
            recentChanges: auditData,
            tableConfig
        });

    } catch (err) {
        console.error('Unexpected error fetching record details:', err);
        return json({ error: 'Failed to load record details' }, { status: 500 });
    }
}