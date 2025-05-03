import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getUserSupabaseAccessToken } from '$lib/server/supabase_tokens';

export const load: PageServerLoad = async ({ fetch, params, locals, cookies }) => {
    const { table } = params;

    const { user } = await locals.safeGetSession();
    if (!user) throw redirect(303, '/login');

    const projectId = cookies.get('supabase_project_id');
    if (!projectId) throw redirect(303, '/');

    const accessToken = await getUserSupabaseAccessToken(locals);
    if (!accessToken) throw redirect(303, '/');

    const apiUrl = `https://api.supabase.com/v1/projects/${projectId}/database/query`;

    // SQL to fetch table config
    const configSql = `
    SELECT name, label, description
    FROM public.vh_tables
    WHERE name = '${table}'
    LIMIT 1;
  `;

    const configRes = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: configSql }),
    });

    if (!configRes.ok) throw new Error(await configRes.text());
    const [tableConfig] = await configRes.json();

    // SQL to fetch columns from information_schema
    const columnsSql = `
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = '${table}' AND table_schema = 'public'
    ORDER BY ordinal_position;
  `;

    const columnMetaRes = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: columnsSql }),
    });

    if (!columnMetaRes.ok) throw new Error(await columnMetaRes.text());
    const columnMetadata = await columnMetaRes.json();

    // SQL to fetch extended column config
    const customConfigSql = `
    SELECT * FROM public.vh_table_columns
    WHERE table_name = '${table}';
  `;

    const customConfigRes = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: customConfigSql }),
    });

    const customConfigs = customConfigRes.ok ? await customConfigRes.json() : [];

    // Merge columnMetadata with matching config
    const columns = columnMetadata.map((col: any) => {
        const custom = customConfigs.find((c: any) => c.column_name === col.column_name);
        return { ...col, ...custom };
    });

    return {
        table,
        columns,
        user_facing_name: tableConfig?.user_facing_name ?? table,
        table_description: tableConfig?.description ?? '',
        audit_logging_enabled: tableConfig?.audit_logging_enabled ?? false,
    };
};
