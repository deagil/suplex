import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({
    fetch,
    locals: { safeGetSession },
    params
}) => {
    const { user } = await safeGetSession();
    if (!user) {
        return redirect(303, '/login');
    }

    console.log('Fetching record data for:', params.table, params.record);
    const res = await fetch(`/api/supabase/record?table=${encodeURIComponent(params.table)}&id=${encodeURIComponent(params.record)}`);

    if (!res.ok) {
        console.error('Error fetching record:', await res.text());
        return redirect(303, '/#');
    }

    const { rowData, recentChanges, tableConfig } = await res.json();

    if (!rowData) {
        console.error('Record not found');
        return redirect(303, '/#');
    }

    return {
        table: params.table,
        recordId: params.record,
        rowData,
        recentChanges,
        tableConfig
    };
};