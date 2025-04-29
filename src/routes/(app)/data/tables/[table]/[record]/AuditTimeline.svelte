<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	export let change: any;
	export let expanded: boolean = false;
	export let toggle: () => void;
</script>

<div class="rounded-md border bg-muted p-2">
	<div class="text-xs text-gray-500">
		{new Date(change.created_at).toLocaleString()}
	</div>
	<div class="mt-1 text-sm font-bold">{change.operation}</div>
	<div class="mt-1 text-sm">{change.summary || 'Change detected'}</div>
	<div class="mt-2 flex gap-2">
		<Button size="sm" variant="outline" onclick={toggle}>
			{expanded ? 'Hide' : 'Show'} Details
		</Button>
	</div>
	{#if expanded}
		<ul class="mt-2 list-disc pl-4 text-xs">
			{#each change.detailedSummary as line}
				<li>{line}</li>
			{/each}
		</ul>
	{/if}
</div>
