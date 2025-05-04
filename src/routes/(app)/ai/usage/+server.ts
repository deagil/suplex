import { json } from '@sveltejs/kit';

// GET: fetch usage data (optionally filter by user, date, etc)
export async function GET({ locals, url }) {
    const { user } = await locals.safeGetSession();
    if (!user?.id) return json({ error: 'Unauthorized' }, { status: 401 });

    // Optional: filter by user, date, etc
    const userId = url.searchParams.get('user_id') || user.id;
    const { data, error } = await locals.supabase
        .from('ai_usage')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    if (error) return json({ error: error.message }, { status: 500 });
    return json({ usage: data });
}

// POST: log a new usage event
export async function POST({ request, locals }) {
    const { user } = await locals.safeGetSession();
    if (!user?.id) return json({ error: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    const { feature, cost_usd, tokens, model, metadata } = body;
    if (!feature || !cost_usd) return json({ error: 'Missing required fields' }, { status: 400 });
    const { error } = await locals.supabase
        .from('ai_usage')
        .insert({
            user_id: user.id,
            feature,
            cost_usd,
            tokens,
            model,
            metadata
        });
    if (error) return json({ error: error.message }, { status: 500 });
    return json({ success: true });
}
