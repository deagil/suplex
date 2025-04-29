import { json } from '@sveltejs/kit';
import { getUserSupabaseAccessToken } from '$lib/server/supabase_tokens';

/**
 * Fetches rows from a specific table, optionally filtered and sorted.
 */
export async function GET({ url, locals, cookies }) {
    const table = url.searchParams.get('table');
    const select = url.searchParams.get('select');
    const limitParam = url.searchParams.get('limit');
    const offsetParam = url.searchParams.get('offset');
    const orderBy = url.searchParams.get('orderBy');
    const orderDirection = url.searchParams.get('orderDirection')?.toUpperCase();

    // Parse limit and offset safely with defaults
    const limit = Number.isInteger(parseInt(limitParam || '')) && parseInt(limitParam || '') > 0 ? parseInt(limitParam || '') : 100;
    const offset = Number.isInteger(parseInt(offsetParam || '')) && parseInt(offsetParam || '') >= 0 ? parseInt(offsetParam || '') : 0;

    // Extract filters from query parameters in the form filter[column]=value
    const filters = [];
    for (const [key, value] of url.searchParams.entries()) {
        const filterMatch = key.match(/^filter\[(.+)\]$/);
        if (filterMatch && value !== null) {
            const columnName = filterMatch[1];
            // Validate column name
            if (!/^[a-zA-Z0-9_]+$/.test(columnName)) {
                return json({ error: `Invalid filter column name: ${columnName}` }, { status: 400 });
            }
            filters.push({ column: columnName, value });
        }
    }

    const { user } = await locals.safeGetSession();
    if (!user?.id) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }
    // console.log('User session validated for user:', user.id);

    const projectId = cookies.get('supabase_project_id');
    if (!projectId) {
        return json({ error: 'No project selected' }, { status: 400 });
    }

    const accessToken = await getUserSupabaseAccessToken(locals);
    if (!accessToken) {
        return json({ error: 'No Supabase access token' }, { status: 401 });
    }
    // console.log('Retrieved project ID and access token', { projectId, accessTokenExists: !!accessToken });

    if (!table) {
        return json({ error: 'Missing table name' }, { status: 400 });
    }

    // Validate table name
    if (!/^[a-zA-Z0-9_]+$/.test(table)) {
        return json({ error: 'Invalid table name' }, { status: 400 });
    }

    // Validate and parse select columns
    let columns = '*';
    if (select) {
        const fields = select.split(',').map(c => c.trim());
        if (!fields.every(f => /^[a-zA-Z0-9_]+$/.test(f))) {
            return json({ error: 'Invalid select columns' }, { status: 400 });
        }
        columns = fields.map(f => `"${f}"`).join(', ');
    }

    // Build WHERE clause from filters
    let whereClause = '';
    if (filters.length > 0) {
        const conditions = filters.map(({ column, value }) => {
            // Escape single quotes in value
            const safeValue = value.replace(/'/g, "''");
            return `"${column}" = '${safeValue}'`;
        });
        whereClause = `WHERE ${conditions.join(' AND ')}`;
    }

    // Validate orderBy column if provided
    let orderClause = '';
    if (orderBy) {
        if (!/^[a-zA-Z0-9_]+$/.test(orderBy)) {
            return json({ error: 'Invalid orderBy column' }, { status: 400 });
        }
        // Validate orderDirection
        const direction = orderDirection === 'DESC' ? 'DESC' : 'ASC'; // default to ASC if invalid or missing
        orderClause = `ORDER BY "${orderBy}" ${direction}`;
    }

    /**
     * NOTE: Dynamic SQL construction here carries risks of SQL injection.
     * We validate inputs against strict regex patterns to mitigate risk,
     * but true SQL injection safety requires server-side parameterized queries.
     * Supabase Management API only allows raw SQL, so caution is advised.
     */

    // Final SQL query construction
    const rowsSql = `
    SELECT ${columns} FROM public.${table}
    ${whereClause}
    ${orderClause}
    LIMIT ${limit}
    OFFSET ${offset};
    `;

    const apiUrl = `https://api.supabase.com/v1/projects/${projectId}/database/query`;

    const rowsRes = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: rowsSql })
    });

    if (!rowsRes.ok) {
        const err = await rowsRes.text();
        return json({ error: `Failed to fetch table rows: ${err}` }, { status: 500 });
    }

    const rows = await rowsRes.json();
    return json({ rows });
}