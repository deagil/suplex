import { json } from '@sveltejs/kit';
import { getUserSupabaseAccessToken } from '$lib/server/supabase_tokens';

/**
 * Fetches column metadata for a specific table.
 */
export async function GET({ url, locals, cookies }) {
  const table = url.searchParams.get('table');

  console.log('Fetching column data for table:', table);

  if (!table) {
    return json({ error: 'Missing table name' }, { status: 400 });
  }

  const { user } = await locals.safeGetSession();
  if (!user?.id) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const projectId = cookies.get('supabase_project_id');
  if (!projectId) {
    return json({ error: 'No project selected' }, { status: 400 });
  }

  const accessToken = await getUserSupabaseAccessToken(locals);
  if (!accessToken) {
    return json({ error: 'No Supabase access token' }, { status: 401 });
  }
  // 1. Fetch columns metadata
  const sqlQuery = `
    SELECT
      cols.column_name AS name,
      cols.data_type,
      cols.is_nullable = 'YES' AS is_nullable,
      cols.column_default AS default,
      pgd.description AS description
    FROM
      information_schema.columns cols
      LEFT JOIN pg_class c ON c.relname = cols.table_name
      LEFT JOIN pg_namespace n ON n.nspname = cols.table_schema AND n.oid = c.relnamespace
      LEFT JOIN pg_description pgd ON pgd.objoid = c.oid AND pgd.objsubid = cols.ordinal_position
    WHERE
      cols.table_schema = 'public'
      AND cols.table_name = '${table}'
    ORDER BY
      cols.ordinal_position;
  `;

  const apiUrl = `https://api.supabase.com/v1/projects/${projectId}/database/query`;

  const columnsRes = await fetch(apiUrl, {
    body: JSON.stringify({ query: sqlQuery }),
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });
  if (!columnsRes.ok) {
    const err = await columnsRes.text();
    return json({ error: `Failed to fetch column metadata: ${err}` }, { status: 500 });
  }
  const columns = await columnsRes.json();

  console.log('Fetched columns:', columns);

  const rowsSql = `SELECT * FROM public.${table} LIMIT 100;`;
  const rowsRes = await fetch(apiUrl, {
    body: JSON.stringify({ query: rowsSql }),
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });
  if (!rowsRes.ok) {
    const err = await rowsRes.text();
    return json({ error: `Failed to fetch table rows: ${err}` }, { status: 500 });
  }
  const rows = await rowsRes.json();

  // console.log('Fetched columns:', columns);
  // console.log('Fetched rows:', rows);
  return json({ columns, rows });
}