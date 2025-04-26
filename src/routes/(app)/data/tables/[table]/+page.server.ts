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
    const res = await fetch(`/api/supabase/table?table=${encodeURIComponent(params.table)}`);
    const { columns, rows, error } = await res.json();
    if (error) throw new Error(error);

    return { columns, rows, tableName: params.table };
}