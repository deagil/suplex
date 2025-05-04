import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { chatModels, DEFAULT_CHAT_MODEL } from '$lib/components/copilot/ai_models';

export const load: LayoutServerLoad = async ({
	cookies,
	locals: { safeGetSession },
	fetch
}) => {
	const { session } = await safeGetSession();
	if (!session) {
		redirect(303, '/login');
	}
	const user = {
		id: session.user.id,
		email: session.user.email
	};
	const sidebarCollapsed = cookies.get('sidebar:state') !== 'true';

	let modelId = cookies.get('selected-model');
	if (!modelId || !chatModels.find((model) => model.id === modelId)) {
		modelId = DEFAULT_CHAT_MODEL;
		cookies.set('selected-model', modelId, {
			path: '/',
			expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
			httpOnly: true,
			sameSite: 'lax'
		});
	}

	const chats = await fetch('/api/history').then(r => r.json());

	return {
		user,
		sidebarCollapsed,
		// Return a serializable value (modelId) instead of a class instance.
		selectedChatModel: modelId,
		chats
	};
};