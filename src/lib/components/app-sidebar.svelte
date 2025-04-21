<script lang="ts" module>
	import Bot from '@lucide/svelte/icons/bot';
	import ChartPie from '@lucide/svelte/icons/chart-pie';
	import Construction from '@lucide/svelte/icons/construction';
	import Shapes from '@lucide/svelte/icons/shapes';
	import LifeBuoy from '@lucide/svelte/icons/life-buoy';
	import Map from '@lucide/svelte/icons/map';
	import FileText from '@lucide/svelte/icons/file-text';
	import Send from '@lucide/svelte/icons/send';
	import Settings2 from '@lucide/svelte/icons/settings-2';
	import Sparkles from './icons/sparkles.svelte';
	import MessagesSquare from '@lucide/svelte/icons/messages-square';
	import Database from '@lucide/svelte/icons/database';

	const data = {
		user: {
			name: 'shadcn',
			email: 'm@example.com',
			avatar: '/images/profile.jpeg',
		},
		navMain: [
			{
				title: 'Activity',
				url: '/activity',
				icon: MessagesSquare,
				isActive: true,
			},
			{
				title: 'Data',
				url: '#',
				icon: Database,
				isActive: true,
				items: [
					{
						title: 'Tables',
						url: '/data/tables',
					},
					{
						title: 'Forms',
						url: '#',
					},
					{
						title: 'Parameters',
						url: '#',
					},
				],
			},
			{
				title: 'Automation',
				url: '#',
				icon: Bot,
				items: [
					{
						title: 'Hooks',
						url: '#',
					},
					{
						title: 'Functions',
						url: '#',
					},
					{
						title: 'Workflows',
						url: '#',
					},
				],
			},
			{
				title: 'AI',
				url: '#',
				icon: Sparkles,
				items: [
					{
						title: 'Agents',
						url: '#',
					},
					{
						title: 'Models',
						url: '#',
					},
					{
						title: 'Usage',
						url: '#',
					},
				],
			},
			{
				title: 'Access',
				url: '#',
				icon: Construction,
				items: [
					{
						title: 'Teams',
						url: '#',
					},
					{
						title: 'Roles',
						url: '#',
					},
					{
						title: 'Policies',
						url: '#',
					},
				],
			},
			{
				title: 'Integrations',
				url: '#',
				icon: Shapes,
				items: [
					{
						title: 'Supabase',
						url: '#',
					},
					{
						title: 'Tally Forms',
						url: '#',
					},
					{
						title: 'Zapier',
						url: '#',
					},
					{
						title: 'OpenAI',
						url: '#',
					},
				],
			},
			{
				title: 'Settings',
				url: '#',
				icon: Settings2,
				items: [
					{
						title: 'Profile',
						url: '#',
					},
					{
						title: 'Team',
						url: '#',
					},
					{
						title: 'Billing',
						url: '#',
					},
					{
						title: 'Security',
						url: '#',
					},
				],
			},
		],
		navSecondary: [
			{
				title: 'Support',
				url: '#',
				icon: LifeBuoy,
			},
			{
				title: 'Feedback',
				url: '#',
				icon: Send,
			},
		],
		projects: [
			{
				name: 'Email Templates',
				url: '#',
				icon: FileText,
			},
			{
				name: 'Reports',
				url: '#',
				icon: ChartPie,
			},
			{
				name: 'Travel',
				url: '#',
				icon: Map,
			},
		],
	};
</script>

<script lang="ts">
	import NavMain from '$lib/components/nav-main.svelte';
	import NavProjects from '$lib/components/nav-projects.svelte';
	import NavSecondary from '$lib/components/nav-secondary.svelte';
	import NavUser from '$lib/components/nav-user.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import Command from '@lucide/svelte/icons/command';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root bind:ref variant="inset" collapsible="icon" {...restProps}>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton size="lg">
					{#snippet child({ props })}
						<a href="##" {...props}>
							<div
								class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
							>
								<Command class="size-4" />
							</div>
							<div class="grid flex-1 text-left text-sm leading-tight">
								<span class="truncate font-semibold">Acme Inc</span>
								<span class="truncate text-xs">Enterprise</span>
							</div>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} />
		<NavProjects projects={data.projects} />
		<NavSecondary items={data.navSecondary} class="mt-auto" />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser user={data.user} />
	</Sidebar.Footer>
</Sidebar.Root>
