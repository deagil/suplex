import { getMessagesByChatId } from '$lib/server/ai/chat_queries';

export async function GET({ params, locals }) {
    console.log('[GET] /api/chat/messages', { params });
    const { user } = await locals.safeGetSession();
    if (!user) return new Response('Unauthorized', { status: 401 });
    if (!params.id) return new Response('Chat ID is required', { status: 400 });
    const chatId = params.id;
    const messages = await getMessagesByChatId({ supabaseClient: locals.supabase, id: chatId });
    return new Response(JSON.stringify(messages), { status: 200 });
}