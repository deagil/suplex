import { json } from '@sveltejs/kit';

export async function GET({ locals }) {
    const supabase = locals.supabase;
    const sessionData = await locals.safeGetSession();
    const userId = sessionData.user?.id;

    if (!userId) {
        return json({ user: null });
    }

    const { data, error } = await supabase
        .from('user_services')
        .select('config')
        .eq('user_id', userId)
        .eq('app', 'supabase_token')
        .single();

    if (error || !data?.config?.access_token) {
        return json({ user: null });
    }

    // Optionally, fetch user info from Supabase Management API
    try {
        const res = await fetch('https://api.supabase.com/v1/organizations', {
            headers: {
                Authorization: `Bearer ${data.config.access_token}`
            }
        });
        if (res.ok) {
            const organizations = await res.json();
            //Fetched user info from Supabase: [ { id: 'nlvvykwzanwpkdrbfmok', name: 'Deagil Apps' } ]
            return json({ team: { name: organizations[0].name, id: organizations[0].id } });
        }
    } catch (e) {
        console.error('Error fetching user info:', e);
        // Handle error if needed
    }

    // If token exists but can't fetch user info, still consider connected
    return json({ team: { name: 'Connected Team' } });
}