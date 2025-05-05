<script lang="ts">
	import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
	import { Button } from '../ui/button';
	import { RefreshCcw } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	// Removed Drizzle-specific types; using generic types instead.
	let {
		user,
		chat,
		readonly,
		onSelectChat,
	}: {
		user?: any;
		chat?: any;
		readonly: boolean;
		onSelectChat?: (chatId: string) => void;
	} = $props();
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger,
	} from '../ui/dropdown-menu';
	import ChevronDownIcon from '../icons/chevron-down.svelte';
	import { ChatHistory } from '$lib/hooks/chat-history.svelte';

	// Use safe context access
	let chatHistory: ChatHistory | null = $state(null);
	if (typeof ChatHistory?.fromContext === 'function') {
		try {
			chatHistory = ChatHistory.fromContext();
		} catch (e) {
			chatHistory = null;
		}
	}

	// Get the current chat title from chatHistory if available, fallback to chat.title
	const currentChat = $derived.by(
		() => chatHistory?.getChatDetails(chat?.id) ?? chat,
	);
	const chatTitle = $derived.by(() => currentChat?.title ?? 'Chat');

	function handleSelectChat(chatId: string) {
		if (chatId !== chat?.id && typeof onSelectChat === 'function') {
			onSelectChat(chatId);
		}
	}

	function handleNewChat() {
		goto('/app/ai'); // Adjust route as needed for new chat
	}

	$effect(() => {
		console.log('[ChatHeader] chatHistory:', chatHistory);
		console.log('[ChatHeader] chat:', chat);
		console.log('[ChatHeader] currentChat:', currentChat);
		console.log('[ChatHeader] chatTitle:', chatTitle);
		if (chatHistory) {
			console.log('[ChatHeader] chatHistory.chats:', chatHistory.chats);
		}
	});
</script>

<header
	class="sticky top-0 flex items-center gap-2 rounded-lg bg-background p-2"
>
	<!-- New Chat Button -->
	<Tooltip>
		<TooltipTrigger>
			{#snippet child({ props })}
				<Button
					{...props}
					variant="outline"
					class="order-2 ml-auto px-2 md:order-1 md:ml-0 md:h-fit md:px-2"
					onclick={handleNewChat}
				>
					<RefreshCcw />
					<span class="md:sr-only">New Chat</span>
				</Button>
			{/snippet}
		</TooltipTrigger>
		<TooltipContent>New Chat</TooltipContent>
	</Tooltip>

	<!-- Chat Title Dropdown -->
	{#if chatHistory && chatHistory.chats.length > 0}
		{console.log(
			'[ChatHeader] Rendering chat history dropdown. chatHistory.chats:',
			chatHistory.chats,
			'chat:',
			chat,
		)}
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Button
					variant="ghost"
					class="order-1 flex items-center gap-2 px-2 text-lg font-semibold md:order-2"
				>
					{#if chat}
						{chatTitle}
					{:else}
						Chat
					{/if}
					<ChevronDownIcon />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="start"
				class="max-h-80 min-w-[220px] overflow-y-auto"
			>
				{#each chatHistory.chats as prevChat (prevChat.id)}
					{console.log('[ChatHeader] Dropdown item:', prevChat)}
					<DropdownMenuItem
						onclick={() => handleSelectChat(prevChat.id)}
						class="flex items-center gap-2"
						data-active={prevChat.id === chat?.id}
					>
						<span class="truncate">{prevChat.title}</span>
						{#if prevChat.id === chat?.id}
							<span class="ml-auto text-xs text-muted-foreground"
								>(Current)</span
							>
						{/if}
					</DropdownMenuItem>
				{/each}
			</DropdownMenuContent>
		</DropdownMenu>
	{/if}

	<!-- {#if !readonly}
		<ModelSelector class="order-1 md:order-3" />
	{/if}

	{#if !readonly && chat}
		<VisibilitySelector {chat} class="order-1 md:order-4" />
	{/if} -->
</header>
