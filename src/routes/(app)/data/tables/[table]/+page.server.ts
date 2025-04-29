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

    // Use params.table to fetch the correct table
    console.log('Fetching table data for:', params.table);
    const res = await fetch(`/api/supabase/table?table=${encodeURIComponent(params.table)}`);
    const { columns, rows, error } = await res.json();
    if (res.status !== 200) {
        console.error('Error fetching table data:', error);
        return redirect(303, '/#');
    }
    if (error) throw new Error(error);

    return { columns, rows, tableName: params.table };
}