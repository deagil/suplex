import { json } from '@sveltejs/kit';
import { getUserSupabaseAccessToken } from '$lib/server/supabase_tokens'

export async function GET({ locals }) {
    const accessToken = await getUserSupabaseAccessToken(locals); // implement this
    if (!accessToken) {
        return json({ projects: [] }, { status: 401 });
    }
    const res = await fetch('https://api.supabase.com/v1/projects', {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!res.ok) return json({ projects: [] }, { status: 500 });
    const projects = await res.json();
    return json({ projects });
}