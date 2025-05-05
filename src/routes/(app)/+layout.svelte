<script lang="ts">
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import Breadcrumbs from './components/breadcrumbs.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import Chat from '$lib/components/copilot/chat.svelte';
	import { ChatHistory } from '$lib/hooks/chat-history.svelte';
	import { onMount } from 'svelte';
	let { data, children } = $props();

	const chatHistory = new ChatHistory(Promise.resolve(data.chats));
	chatHistory.setContext();

	let selectedChat = $state(null);
	let messages = $state([]);

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

<Toaster richColors position="top-center" />
<Sidebar.Provider>
	<AppSidebar side="left" />
	<Sidebar.Inset class="flex w-3/4 flex-col">
		<div class="flex flex-1 flex-col p-4 pt-0">
			<!-- Main content: 3/4 -->
			<div class="flex flex-col p-1">
				<header class="flex h-16 shrink-0 items-center gap-4">
					<div class="flex items-center gap-2 px-4">
						<Sidebar.Trigger class="-ml-1" />
						<Separator orientation="vertical" class="mr-2 h-4" />
						<Breadcrumbs />
					</div>
				</header>
				{@render children?.()}
			</div>
			<!-- Sidebar: 1/4 -->
		</div>
	</Sidebar.Inset>
	<div class="flex w-1/4 flex-col overflow-hidden rounded-lg bg-primary p-2">
		<!-- Chat area, scrollable -->
		<div class="min-h-0 flex-1 overflow-y-auto bg-primary">
			<Chat
				chat={selectedChat}
				initialMessages={messages}
				readonly={false}
				user={data.user}
				onSelectChat={handleSelectChat}
			/>
		</div>
	</div>
</Sidebar.Provider>
