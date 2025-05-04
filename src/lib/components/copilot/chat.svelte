<script lang="ts">
	import { Chat } from '@ai-sdk/svelte';
	import type { Attachment } from 'ai';
	// Removed Drizzle-specific types; if needed, define your own User/Chat interfaces.
	// import type { Chat as DbChat, User } from '$lib/server/db/schema';
	import { ChatHistory } from '$lib/hooks/chat-history.svelte';
	import ChatHeader from './chat-header.svelte';
	import Messages from './messages.svelte';
	import MultimodalInput from './multimodal-input.svelte';
	import { untrack } from 'svelte';
	import type { UIMessage } from '@ai-sdk/svelte';
	import { toast } from 'svelte-sonner';

	// Replace these with your own types if necessary.
	let {
		user,
		chat,
		readonly,
		initialMessages,
	}: {
		user?: any;
		chat?: any;
		initialMessages: UIMessage[];
		readonly: boolean;
	} = $props();

	console.log('[Chat] Initial props:', {
		user,
		chat,
		readonly,
		initialMessages,
	});

	const chatHistory = ChatHistory.fromContext();

	console.log('[Chat] ChatHistory from context:', chatHistory);

	$effect(() => {
		console.log('[Chat] chat prop changed:', chat);
		console.log('[Chat] chatHistory.chats:', chatHistory.chats);
	});

	const chatClient = $derived(
		new Chat({
			id: chat?.id,
			initialMessages: untrack(() => initialMessages),
			sendExtraMessageFields: true,
			generateId: crypto.randomUUID.bind(crypto),
			onFinish: async () => {
				console.log('[Chat] onFinish: refetching chatHistory...');
				await chatHistory.refetch();
				console.log(
					'[Chat] onFinish: chatHistory.chats after refetch:',
					chatHistory.chats,
				);
			},
			onError: (error) => {
				try {
					const jsonError = JSON.parse(error.message);
					toast.error(
						typeof jsonError === 'object' &&
							jsonError !== null &&
							'message' in jsonError
							? jsonError.message
							: error.message,
					);
				} catch {
					toast.error(error.message);
				}
			},
		}),
	);

	let attachments = $state<Attachment[]>([]);
</script>

<!-- //add rounded corners  -->
<div class="flex h-dvh min-w-0 flex-col rounded-xl bg-background">
	<ChatHeader {user} {chat} {readonly} />
	<Messages
		{readonly}
		loading={chatClient.status === 'streaming' ||
			chatClient.status === 'submitted'}
		messages={chatClient.messages}
	/>

	<form
		class="mx-auto flex w-full gap-2 rounded-xl bg-background px-4 pb-4 md:max-w-3xl md:pb-6"
	>
		{#if !readonly}
			<MultimodalInput {attachments} {user} {chatClient} class="flex-1" />
		{/if}
	</form>
</div>

<!-- TODO -->
<!-- <Artifact
	chatId={id}
	{input}
	{setInput}
	{handleSubmit}
	{isLoading}
	{stop}
	{attachments}
	{setAttachments}
	{append}
	{messages}
	{setMessages}
	{reload}
	{votes}
	{readonly}
/> -->
