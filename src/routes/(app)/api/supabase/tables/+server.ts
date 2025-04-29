import { json } from '@sveltejs/kit';
import { getUserSupabaseAccessToken } from '$lib/server/supabase_tokens';

const debug = false;
function log(...args: any[]) {
    if (debug) console.log('[tables]', ...args);
}

export async function GET(event) {
    return getAllTables(event);
}

/**
 * Fetches all tables from the Supabase database.
 * @param {Object} event - The event object containing request details.
 * @returns {Promise<Response>} - A JSON response with the list of tables or an error message.
 */
async function getAllTables({ locals, cookies, url }) {
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

    const tableFilter = url.searchParams.get('name');
    const sqlQuery = getTablesQuery(tableFilter);

    const apiUrl = `https://api.supabase.com/v1/projects/${projectId}/database/query`;

    log('Making Supabase query with SQL:', sqlQuery.trim());

    const res = await fetch(apiUrl, {
        body: JSON.stringify({ query: sqlQuery }),
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) {
        const err = await res.text();
        log('Failed to fetch tables:', err);
        return json({ error: `Failed to fetch tables: ${err}` }, { status: 500 });
    }

    const tables = await res.json();
    log('Received tables response:', tables);
    return json({ tables });
}

/**
 * Generates the SQL query to fetch table information from the Supabase database.
 * @param {string|null} filterName - Optional filter for table name.
 * @returns {string} - The SQL query string.
 */
function getTablesQuery(filterName: string | null) {
    return `
    SELECT
      c.relname AS name,
      obj_description(c.oid) AS description,
      c.reltuples AS row_estimate,
      pg_size_pretty(pg_total_relation_size(c.oid)) AS total_size_pretty,
      pg_relation_size(c.oid) AS table_bytes,
      pg_total_relation_size(c.oid) AS total_bytes,
      c.relrowsecurity AS rls_enabled
    FROM
      pg_class c
      LEFT JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE
      c.relkind = 'r'
      AND n.nspname = 'public'
      AND c.relname NOT LIKE 'vh_%'
      ${filterName ? `AND c.relname = '${filterName}'` : ''}
    ORDER BY
      c.relname;
  `;
}