<script lang="ts">
	export let columns: { accessorKey: string; header: string }[] = [];
	export let rows: Record<string, any>[] = [];
	import ZapierLogo from '~icons/simple-icons/zapier.svg';
	import SupabaseLogo from '~icons/simple-icons/supabase.svg';
	import HubspotLogo from '~icons/simple-icons/hubspot.svg';

	const getLogoComponent = (value: string) => {
		if (value === 'Zapier') return ZapierLogo;
		if (value === 'Supabase') return SupabaseLogo;
		if (value === 'Hubspot') return HubspotLogo;
		return null;
	};
</script>

<div
	class="overflow-x-auto rounded-xl border border-border bg-background shadow-lg"
>
	<table class="min-w-full divide-y divide-border">
		<thead class="bg-muted">
			<tr>
				{#each columns as col}
					<th
						class="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
					>
						{col.header}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody class="divide-y divide-border">
			{#each rows as row}
				<tr class="transition-colors hover:bg-muted">
					{#each columns as col}
						<td class="px-4 py-3 text-sm">
							{#if col.accessorKey === 'source' && getLogoComponent(row[col.accessorKey])}
								<div class="flex items-center gap-2">
									<svelte:component
										this={getLogoComponent(row[col.accessorKey])}
										class="inline-block h-5 w-5"
									/>
									<span>{row[col.accessorKey]}</span>
								</div>
							{:else if col.accessorKey === 'status'}
								{row[col.accessorKey] ? '✅' : '❌'}
							{:else}
								{row[col.accessorKey]}
							{/if}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
