import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Table } from './columns';

export const load: PageServerLoad = async ({
  fetch,
  locals: { safeGetSession },
}) => {
  const { user } = await safeGetSession();
  if (!user) {
    return redirect(303, '/login');
  }

  const res = await fetch('/api/supabase/tables');
  const { tables } = await res.json();
  return { tables: tables as Table[] };
}