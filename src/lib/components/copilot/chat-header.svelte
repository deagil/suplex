<script lang="ts">
	import { useSidebar } from '../ui/sidebar';
	import SidebarToggle from './sidebar-toggle.svelte';
	import { innerWidth } from 'svelte/reactivity/window';
	import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
	import { Button } from '../ui/button';
	import PlusIcon from '../icons/plus.svelte';
	import SparklesIcon from '../icons/sparkles.svelte';
	import { goto } from '$app/navigation';
	import ModelSelector from './model-selector.svelte';
	// Removed Drizzle-specific types; using generic types instead.
	let {
		user,
		chat,
		readonly,
	}: {
		user?: any;
		chat?: any;
		readonly: boolean;
	} = $props();
	import VisibilitySelector from './visibility-selector.svelte';
	import VercelIcon from '../icons/vercel.svelte';

	const sidebar = useSidebar();
</script>

<header
	class="sticky top-0 flex items-center gap-2 rounded-lg bg-background p-2"
>
	{#if true}
		<Tooltip>
			<TooltipTrigger>
				{#snippet child({ props })}
					<Button
						{...props}
						variant="outline"
						class="order-2 ml-auto px-2 md:order-1 md:ml-0 md:h-fit md:px-2"
						onclick={() => {
							goto('/', {
								invalidateAll: true,
							});
						}}
					>
						<SparklesIcon />
						<span class="md:sr-only">New Chat</span>
					</Button>
				{/snippet}
			</TooltipTrigger>
			<TooltipContent>New Chat</TooltipContent>
		</Tooltip>
	{/if}

	{#if !readonly}
		<ModelSelector class="order-1 md:order-2" />
	{/if}

	{#if !readonly && chat}
		<VisibilitySelector {chat} class="order-1 md:order-3" />
	{/if}
</header>
