export const csr = false;

import { redirect, error } from '@sveltejs/kit';
import { ok, safeTry } from 'neverthrow';
import {
	createDataStreamResponse,
	streamText,
	smoothStream,
} from 'ai';
import { myProvider } from '$lib/server/ai/models';
import { systemPrompt } from '$lib/server/ai/prompts.js';
import { generateTitleFromUserMessage } from '$lib/server/ai/utils';
import {
	getChatById,
	saveChat,
	saveMessages,
	deleteChatById,
} from '$lib/server/ai/chat_queries';
import {
	getMostRecentUserMessage,
	getTrailingMessageId,
} from '$lib/utils/chat';
import type { UIMessage } from 'ai';

export async function POST({ request, locals, cookies }) {
	// Fetch the current user from the session
	const { safeGetSession, supabase } = locals;
	const { user } = await safeGetSession();
	if (!user) return redirect(303, '/login');

	const { id, messages }: { id: string; messages: UIMessage[] } = await request.json();
	const selectedChatModel = cookies.get('selected-model');
	if (!selectedChatModel) {
		error(400, 'No chat model selected');
	}

	const userMessage = getMostRecentUserMessage(messages);
	if (!userMessage) {
		error(400, 'No user message found');
	}

	// For authenticated users, attempt to fetch (or create) their chat, then save the message.
	await safeTry(async function* () {
		let chat;
		try {
			chat = await getChatById({ supabaseClient: supabase, id });
			yield;
		} catch (e: { message: string }) {
			// If not found, assume DbEntityNotFoundError and create new chat.
			if (e.message.includes('No rows')) {
				const titleResult = await generateTitleFromUserMessage({ message: userMessage });
				const title = titleResult.unwrapOr('New Chat');
				chat = await saveChat({ supabaseClient: supabase, id, userId: user.id, title });
			} else {
				throw e;
			}
		}

		if (chat.user_id !== user.id) {
			error(403, 'Forbidden');
		}

		await saveMessages({
			supabaseClient: supabase,
			messages: [
				{
					chat_id: id,
					id: userMessage.id,
					role: 'user',
					parts: userMessage.parts,
					attachments: userMessage.experimental_attachments ?? [],
					created_at: new Date().toISOString(),
				},
			],
		});

		return ok(undefined);
	}).orElse(() => error(500, 'An error occurred while processing your request'));

	// Return a data stream response using your language model provider.
	return createDataStreamResponse({
		execute: (dataStream) => {
			const result = streamText({
				model: myProvider.languageModel(selectedChatModel),
				system: systemPrompt({ selectedChatModel }),
				messages,
				maxSteps: 5,
				experimental_activeTools: [],
				experimental_transform: smoothStream({ chunking: 'word' }),
				experimental_generateMessageId: crypto.randomUUID.bind(crypto),
				onFinish: async ({ response }) => {
					if (!user) return;
					const assistantId = getTrailingMessageId({
						messages: response.messages.filter((message) => message.role === 'assistant'),
					});

					if (!assistantId) {
						throw new Error('No assistant message found!');
					}

					// Append assistant message and save it.
					await saveMessages({
						supabaseClient: supabase,
						messages: [
							{
								id: assistantId,
								chatId: id,
								role: 'assistant',
								parts: response.messages.find((msg) => msg.id === assistantId)?.parts,
								attachments:
									response.messages.find((msg) => msg.id === assistantId)?.experimental_attachments ?? [],
								created_at: new Date().toISOString(),
							},
						],
					});
				},
				experimental_telemetry: {
					isEnabled: true,
					functionId: 'stream-text',
				},
			});

			result.consumeStream();
			result.mergeIntoDataStream(dataStream, { sendReasoning: true });
		},
		onError: (e) => {
			console.error(e);
			return 'Oops!';
		},
	});
}

export async function DELETE({ request, locals }) {
	const { safeGetSession, supabase } = locals;
	const { user } = await safeGetSession();
	if (!user) return redirect(303, '/login');

	const { id }: { id: string } = await request.json();

	return await getChatById({ supabaseClient: supabase, id })
		.then((chat) => {
			if (chat.user_id !== user.id) {
				throw error(403, 'Forbidden');
			}
			return deleteChatById({ supabaseClient: supabase, id });
		})
		.then(() => new Response('Chat deleted', { status: 200 }))
		.catch((err) => error(500, 'An error occurred while processing your request'));
}