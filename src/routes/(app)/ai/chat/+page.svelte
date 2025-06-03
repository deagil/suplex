<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { ChatHistory } from '$lib/hooks/chat-history.svelte';
	import Chat from '$lib/components/copilot/chat.svelte';
	import { onMount } from 'svelte';

	const chatHistory = new ChatHistory(Promise.resolve(data.chats));
	chatHistory.setContext();

	let selectedChat = $state(null);
	let messages = $state([]);
	let { data } = $props();

	async function fetchMessages(chatId: string) {
		const res = await fetch(`/api/chat/messages/${chatId}`);
		if (res.ok) {
			messages = await res.json();
		}
	}

	async function handleSelectChat(chatId: string) {
		const chat = chatHistory.chats.find((c) => c.id === chatId);
		if (chat) {
			selectedChat = { ...chat };
			await fetchMessages(chatId);
			// Force reactivity
			selectedChat = { ...selectedChat };
			messages = [...messages];
		}
	}

	onMount(() => {
		if (selectedChat) fetchMessages(selectedChat.id);
	});
</script>

<svelte:head>
	<title>Chat</title>
</svelte:head>

<Chat
	chat={selectedChat}
	initialMessages={messages}
	readonly={false}
	user={data.user}
	onSelectChat={handleSelectChat}
/>
