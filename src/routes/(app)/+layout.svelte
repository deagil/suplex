<!-- <script lang="ts">
	import Home from '~icons/lucide/home';
	import PanelLeft from '~icons/lucide/panel-left';
	import Settings from '~icons/lucide/settings';

	import Logo from '$lib/components/Logo.svelte';
	import PersonalMenu from '$lib/components/personal-menu.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import Breadcrumbs from './components/breadcrumbs.svelte';
	import NavLink from './components/nav-link.svelte';

	let { data, children } = $props();
</script>

<div class="flex min-h-screen w-full flex-col bg-muted/40">
	<aside
		class="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex"
	>
		<nav class="flex flex-col items-center gap-4 px-2 sm:py-5">
			<a
				href="/"
				class="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 md:h-8 md:w-8"
			>
				<Logo />
				<span class="sr-only">SaaS Kit</span>
			</a>
			<Tooltip.Root>
				<Tooltip.Trigger asChild >
					{#snippet children({ builder })}
										<NavLink
							href="/dashboard"
							class="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
							activeClass="bg-accent text-accent-foreground"
							{builder}
						>
							<Home class="h-5 w-5" />
							<span class="sr-only">Dashboard</span>
						</NavLink>
														{/snippet}
								</Tooltip.Trigger>
				<Tooltip.Content side="right">Dashboard</Tooltip.Content>
			</Tooltip.Root>
		</nav>
		<nav class="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
			<Tooltip.Root>
				<Tooltip.Trigger asChild >
					{#snippet children({ builder })}
										<NavLink
							href="/settings"
							class="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
							activeClass="bg-accent text-accent-foreground"
							{builder}
						>
							<Settings class="h-5 w-5" />
							<span class="sr-only">Settings</span>
						</NavLink>
														{/snippet}
								</Tooltip.Trigger>
				<Tooltip.Content side="right">Settings</Tooltip.Content>
			</Tooltip.Root>
		</nav>
	</aside>
	<div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
		<header
			class="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"
		>
			<Sheet.Root>
				<Sheet.Trigger asChild >
					{#snippet children({ builder })}
										<Button
							builders={[builder]}
							size="icon"
							variant="outline"
							class="sm:hidden"
						>
							<PanelLeft class="h-5 w-5" />
							<span class="sr-only">Toggle Menu</span>
						</Button>
														{/snippet}
								</Sheet.Trigger>
				<Sheet.Content side="left" class="sm:max-w-xs">
					<nav class="grid gap-6 text-lg font-medium">
						<a
							href="##"
							class="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
						>
							<Logo />
							<span class="sr-only">SaaS Kit</span>
						</a>
						<a
							href="##"
							class="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
						>
							<Home class="h-5 w-5" />
							Dashboard
						</a>
					</nav>
				</Sheet.Content>
			</Sheet.Root>
			<Breadcrumbs />
			 <div class="relative ml-auto flex-1 md:grow-0">
				<Search
					class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
				/>
				<Input
					type="search"
					placeholder="Search..."
					class="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
				/>
			</div> 
			<PersonalMenu user={data.user} />
		</header>
		<main class="flex flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
			{@render children?.()}
		</main>
	</div>
</div> -->

<script lang="ts">
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import Breadcrumbs from './components/breadcrumbs.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import FloatingSidebar from '$lib/components/floating-sidebar.svelte';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import Chat from '$lib/components/copilot/chat.svelte';
	let { data, children } = $props();

	// console.log('layout props', data);
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
		<div class="flex-1 overflow-y-auto bg-primary">
			<Chat />
		</div>
	</div>
</Sidebar.Provider>
