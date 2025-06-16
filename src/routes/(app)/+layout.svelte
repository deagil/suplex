<script lang="ts">
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import Breadcrumbs from './components/breadcrumbs.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import Chat from '$lib/components/copilot/chat.svelte';
	import { ChatHistory } from '$lib/hooks/chat-history.svelte';
	import { onMount } from 'svelte';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu/index.js';
	import { cn } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

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

	const components: { title: string; href: string; description: string }[] = [
		{
			title: 'Alert Dialog',
			href: '/docs/primitives/alert-dialog',
			description:
				'A modal dialog that interrupts the user with important content and expects a response.',
		},
		{
			title: 'Hover Card',
			href: '/docs/primitives/hover-card',
			description:
				'For sighted users to preview content available behind a link.',
		},
		{
			title: 'Progress',
			href: '/docs/primitives/progress',
			description:
				'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
		},
		{
			title: 'Scroll-area',
			href: '/docs/primitives/scroll-area',
			description: 'Visually or semantically separates content.',
		},
		{
			title: 'Tabs',
			href: '/docs/primitives/tabs',
			description:
				'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
		},
		{
			title: 'Tooltip',
			href: '/docs/primitives/tooltip',
			description:
				'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
		},
	];

	type ListItemProps = HTMLAttributes<HTMLAnchorElement> & {
		title: string;
		href: string;
		content: string;
	};

	onMount(() => {
		if (selectedChat) fetchMessages(selectedChat.id);
	});
</script>

{#snippet ListItem({
	title,
	content,
	href,
	class: className,
	...restProps
}: ListItemProps)}
	<li>
		<NavigationMenu.Link>
			{#snippet child()}
				<a
					{href}
					class={cn(
						'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
						className,
					)}
					{...restProps}
				>
					<div class="text-sm font-medium leading-none">{title}</div>
					<p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
						{content}
					</p>
				</a>
			{/snippet}
		</NavigationMenu.Link>
	</li>
{/snippet}

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
