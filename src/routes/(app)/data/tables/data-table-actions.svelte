<script lang="ts">
	import Ellipsis from '@lucide/svelte/icons/ellipsis';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import type { SvelteComponent } from 'svelte';

	type Action = {
		label: string;
		icon?: typeof SvelteComponent;
		onClick: (row: unknown) => void;
		show?: boolean | ((row: unknown) => boolean);
		group?: string;
	};

	const { actions, row }: { actions: Action[]; row: unknown } = $props();

	// Group actions by group property
	const grouped = actions
		.filter(
			(action) =>
				action.show === undefined ||
				(typeof action.show === 'function' ? action.show(row) : action.show),
		)
		.reduce(
			(acc, action) => {
				const group = action.group ?? 'Other';
				if (!acc[group]) acc[group] = [];
				acc[group].push(action);
				return acc;
			},
			{} as Record<string, Action[]>,
		);

	const groupOrder = ['', 'builder', 'admin']; // customize as needed
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<Button variant="outline">Actions</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		{#each groupOrder as group, i}
			{#if grouped[group]}
				<DropdownMenu.Group>
					{#if group != ''}
						<DropdownMenu.GroupHeading>
							{group.charAt(0).toUpperCase() + group.slice(1)} Actions
						</DropdownMenu.GroupHeading>
					{/if}
					{#each grouped[group] as action (action.label)}
						<DropdownMenu.Item onclick={() => action.onClick(row)}>
							{#if action.icon}
								<action.icon class="mr-2" />
							{/if}
							{action.label}
						</DropdownMenu.Item>
					{/each}
				</DropdownMenu.Group>
				{#if i < groupOrder.length - 1}
					<DropdownMenu.Separator />
				{/if}
			{/if}
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
