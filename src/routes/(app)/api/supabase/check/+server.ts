import { json } from '@sveltejs/kit';
import { getUserSupabaseAccessToken } from '$lib/server/supabase_tokens';

export async function GET({ locals }) {

    const { user } = await locals.safeGetSession();
    if (!user?.id) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }
    // console.log('User session validated for user:', user.id);

    // const projectId = cookies.get('supabase_project_id');
    // if (!projectId) {
    //     return json({ error: 'No project selected' }, { status: 400 });
    // }

    const accessToken = await getUserSupabaseAccessToken(locals);

    if (!accessToken) {
        return json({ error: 'No Supabase access token' }, { status: 401 });
    }
    // console.log('Retrieved project ID and access token', { projectId, accessTokenExists: !!accessToken });

    // Optionally, fetch user info from Supabase Management API
    try {
        const res = await fetch('https://api.supabase.com/v1/organizations', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res.ok) {
            const organizations = await res.json();
            //Fetched user info from Supabase: [ { id: 'nlvvykwzanwpkdrbfmok', name: 'Deagil Apps' } ]
            return json({ team: { name: organizations[0].name, id: organizations[0].id } });
        }
        console.log(res);
    } catch (e) {
        console.error('Error fetching user info:', e);
        // Handle error if needed
    }

    // If token exists but can't fetch user info, still consider connected
    return json({ team: { name: 'Connected Team' } });
}