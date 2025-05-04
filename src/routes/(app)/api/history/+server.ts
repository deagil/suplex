import { getChatsByUserId } from '$lib/server/ai/chat_queries';
import { error } from '@sveltejs/kit';

export async function GET({ locals }) {
	const { user } = await locals.safeGetSession();
	if (!user) {
		return error(401, 'Unauthorized');
	}
	try {
		const chats = await getChatsByUserId({ id: user.id, supabaseClient: locals.supabase });
		return new Response(JSON.stringify(chats), { status: 200 });
	} catch (e) {
		console.error('Error fetching chats:', e);
		return error(500, e.message); // or error(500, 'Failed to fetch chats');
	}
}