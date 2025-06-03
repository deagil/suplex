<script lang="ts">
	import * as Features from '$lib/components/landing/features';
	import { Button } from '$lib/components/ui/button';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { cn } from '$lib/utils';
	import LucideChevronDown from 'virtual:icons/lucide/chevron-down';
	import BotMessageSquare from '~icons/lucide/bot-message-square';
	import TableProperties from '@lucide/svelte/icons/table-properties';
	import LucideLockKeyhole from '~icons/lucide/lock-keyhole';
	import BookMarked from '~icons/lucide/book-marked';
	import Themes from './showcases/Themes.svelte';
	import DataViz from './showcases/dataviz/DataViz.svelte';
	import Book from '@lucide/svelte/icons/book';
	import Dummychat from './showcases/copilot/dummychat.svelte';
	// import { sheetPrompt } from '$lib/server/ai/prompts';
	const features = [
		// {
		// 	icon: PaletteIcon,
		// 	title: 'Themeable + Mode Switcher',
		// 	description:
		// 		"You can copy-paste any of the shadcn's premade themes, or create your own tweaking a few CSS variables. Any theme can be toggled between light and dark mode.",
		// 	showcase: Themes,
		// },
		{
			title: 'Data Viewer',
			icon: TableProperties,
			description:
				'Your app will designed to work on any device, from mobile to desktop. This includes the marketing site, the app itself, and any other pages.',
			showcase: DataViz,
		},
		{
			icon: BotMessageSquare,
			title: 'A copilot but Air Traffic Control',
			description:
				'Bring your own LLM (or use ours) and query across all of your tools with centralised billing and usage insights. Chat to your data, and get answers in seconds. Give your workflows some reasoning power. Configure and equip your own AI agents to work for you.',
			showcase: Dummychat,
		},
		{
			icon: BookMarked,
			title: 'Never forget a function',
			description:
				'Documentation is automatically generated for youin the background, so you can focus on building',
		},
		{
			icon: LucideLockKeyhole,
			title: `Security that isn't built on vibes.`,
			description:
				"The authentification system is already set up thanks to the Supabase Auth. There are login and register page as well as user settings page. You can also add social logins like Google, Facebook, and Github. We've also implemented advanced features like email verification, password reset, account deletion.",
		},
	];

	const SHOW_BASE = 3;

	let expanded: boolean = $state(false);
</script>

<Collapsible.Root class="mx-auto max-w-screen-lg" bind:open={expanded}>
	<Features.Root>
		{#each [...features].splice(0, SHOW_BASE) as { title, icon, description, showcase }}
			<Features.FeatureItem
				class="mb-4 flex min-h-80 flex-nowrap items-start gap-4"
			>
				{@const SvelteComponent = icon}
				<SvelteComponent class="size-10 flex-shrink-0 fill-primary" />
				<div>
					<Features.Term class="mb-3 leading-none">
						<span>{title}</span>
					</Features.Term>
					<Features.Description class="hyphens-auto text-justify">
						{description}
					</Features.Description>
				</div>
			</Features.FeatureItem>
			<Features.FeatureShowcase
				class="flex flex-col items-center justify-start"
			>
				{#if showcase}
					{@const SvelteComponent_1 = showcase}
					<SvelteComponent_1 />
				{:else}
					<div
						class="h-full min-h-80 w-full rounded-lg bg-black opacity-5 dark:bg-white"
					></div>
				{/if}
			</Features.FeatureShowcase>
		{/each}
	</Features.Root>
	<div class="flex items-center p-10">
		<Collapsible.Trigger>
			<Button class="mx-auto place-self-center text-center" variant="link">
				Show {#if expanded}less{:else}more{/if} features
				<LucideChevronDown
					class={cn(
						'ms-2 size-4 transition-transform',
						expanded && '-rotate-180',
					)}
				/>
			</Button>
		</Collapsible.Trigger>
	</div>
	<Collapsible.Content>
		<Features.Root>
			{#each [...features].splice(SHOW_BASE) as { title, icon, description }}
				<Features.FeatureItem>
					{@const SvelteComponent_2 = icon}
					<div class="mb-4 flex flex-nowrap items-start gap-4">
						<SvelteComponent_2 class="h-8 w-8 flex-shrink-0 fill-primary" />
						<Features.Term>{title}</Features.Term>
					</div>
					<Features.Description class="hyphens-auto text-justify">
						{description}
					</Features.Description>
				</Features.FeatureItem>
				<Features.FeatureShowcase>
					<div
						class="h-full min-h-80 w-full rounded-lg bg-white opacity-5"
					></div>
				</Features.FeatureShowcase>
			{/each}
		</Features.Root>
	</Collapsible.Content>
</Collapsible.Root>
