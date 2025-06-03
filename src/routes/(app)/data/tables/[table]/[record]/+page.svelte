<script lang="ts">
	import {
		Card,
		CardHeader,
		CardTitle,
		CardContent,
	} from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import RecordCard from './RecordCard.svelte';
	import AuditTimeline from './AuditTimeline.svelte';
	import Link from '@lucide/svelte/icons/link';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { page } from '$app/state';
	import { toast } from 'svelte-sonner';

	let { data } = $props();
	console.log('Data:', data);
	let { table, recordId, rowData, recentChanges, tableConfig } = data;

	let expandedChanges = $state({});
	let formValues = $state({});

	$effect(() => {
		for (const [col, val] of Object.entries(rowData)) {
			formValues[col] = val;
		}
	});

	function getInputType(column: string) {
		const columnType = tableConfig?.model?.[column]?.data_type || 'text';
		if (columnType.includes('timestamp') || columnType === 'date')
			return 'datetime-local';
		if (columnType === 'boolean') return 'checkbox';
		return 'text';
	}

	function formatDisplayValue(column: string, value: any) {
		const inputType = getInputType(column);
		if (inputType === 'checkbox') return !!value;
		if (inputType === 'datetime-local' && value) {
			const d = new Date(value);
			return d.toISOString().slice(0, 16);
		}
		return value ?? '';
	}

	function toggleExpand(changeId: string) {
		expandedChanges[changeId] = !expandedChanges[changeId];
	}

	function shortSummary(before: any, after: any) {
		const keys = new Set([
			...Object.keys(before || {}),
			...Object.keys(after || {}),
		]);
		const changed = Array.from(keys).filter((k) => before?.[k] !== after?.[k]);
		if (changed.length === 0) return 'No changes.';
		if (changed.length === 1) return `${changed[0]} changed.`;
		return `${changed.length} fields changed.`;
	}

	function renderChangeSummary(before: any, after: any) {
		const keys = new Set([
			...Object.keys(before || {}),
			...Object.keys(after || {}),
		]);
		return Array.from(keys)
			.map((key) => {
				const oldVal = before?.[key];
				const newVal = after?.[key];
				if (oldVal === newVal) return null;
				return `${key}: ${oldVal ?? '∅'} → ${newVal ?? '∅'}`;
			})
			.filter(Boolean);
	}
</script>

<div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
	<!-- Main Section -->
	<div class="col-span-2 space-y-4">
		<RecordCard title="{tableConfig?.label || table} Record">
			<div slot="actions" class="flex items-center space-x-2">
				<Tooltip.Provider>
					<Tooltip.Root>
						<Tooltip.Trigger
							><Button
								variant="ghost"
								size="icon"
								onclick={() => {
									navigator.clipboard.writeText(page.url.pathname);
									toast.info('Copied link to current page.');
								}}
							>
								<Link />
							</Button></Tooltip.Trigger
						>
						<Tooltip.Content>
							<p>Copy link to record</p>
						</Tooltip.Content>
					</Tooltip.Root>
				</Tooltip.Provider>
			</div>
			{#each Object.entries(formValues) as [column, value]}
				<div class="mb-2 pb-1">
					<label
						class="mb-1 block text-sm font-semibold text-muted-foreground"
						for={'input-' + column}
					>
						{tableConfig?.model?.[column]?.label || column}
					</label>
					<input
						id={'input-' + column}
						type="text"
						class="w-full rounded-md bg-muted p-3 text-sm"
						value={value ?? ''}
						readonly
					/>
				</div>
			{/each}
		</RecordCard>

		<Card>
			<CardHeader>
				<CardTitle>Related Records</CardTitle>
			</CardHeader>
			<CardContent>
				<p class="text-sm text-muted-foreground">
					Placeholder for foreign-key related records.
				</p>
			</CardContent>
		</Card>
	</div>

	<!-- Sidebar Section -->
	<div class="col-span-1 space-y-4">
		<RecordCard title="Recent Changes">
			{#if recentChanges.length > 0}
				{#each recentChanges as change (change.id)}
					<AuditTimeline
						change={{
							...change,
							detailedSummary: renderChangeSummary(
								change.record_before,
								change.record_after,
							),
						}}
						expanded={expandedChanges[change.id]}
						toggle={() => toggleExpand(change.id)}
					/>
				{/each}
			{:else}
				<p class="text-sm text-muted-foreground">No recent changes.</p>
			{/if}
		</RecordCard>

		<Card>
			<CardHeader>
				<CardTitle>Previous Workflows</CardTitle>
			</CardHeader>
			<CardContent>
				<p class="text-sm text-muted-foreground">(Placeholder: no data yet)</p>
			</CardContent>
		</Card>

		<Card>
			<CardHeader>
				<CardTitle>Scheduled Workflows</CardTitle>
			</CardHeader>
			<CardContent>
				<p class="text-sm text-muted-foreground">
					(Placeholder: not yet implemented)
				</p>
			</CardContent>
		</Card>
	</div>
</div>
