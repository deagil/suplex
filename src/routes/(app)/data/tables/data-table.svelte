<script lang="ts" generics="TData, TValue">
	import {
		type ColumnDef,
		type PaginationState,
		type SortingState,
		type ColumnFiltersState,
		type VisibilityState,
		getCoreRowModel,
		getSortedRowModel,
		getPaginationRowModel,
		getFilteredRowModel,
	} from '@tanstack/table-core';
	import {
		createSvelteTable,
		FlexRender,
	} from '$lib/components/ui/data-table/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';

	const {
		columns,
		data,
		filterColumns = [],
		onRowClick = null,
		rowActions = null,
	} = $props<{
		columns: ColumnDef<TData, TValue>[];
		data: TData[];
		filterColumns?: string[];
		onRowClick?: ((row: TData) => void) | null;
		rowActions?: ((row: TData) => any) | null;
	}>();

	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let columnVisibility = $state<VisibilityState>({});

	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onPaginationChange: (updater) => {
			pagination =
				typeof updater === 'function' ? updater(pagination) : updater;
		},
		onSortingChange: (updater) => {
			sorting = typeof updater === 'function' ? updater(sorting) : updater;
		},
		onColumnFiltersChange: (updater) => {
			columnFilters =
				typeof updater === 'function' ? updater(columnFilters) : updater;
		},
		onColumnVisibilityChange: (updater) => {
			columnVisibility =
				typeof updater === 'function' ? updater(columnVisibility) : updater;
		},
		state: {
			get pagination() {
				return pagination;
			},
			get sorting() {
				return sorting;
			},
			get columnFilters() {
				return columnFilters;
			},
			get columnVisibility() {
				return columnVisibility;
			},
		},
	});
</script>

<div>
	<!-- Filtering UI: only show for specified columns -->
	{#each filterColumns as col}
		<Input
			placeholder={`Filter ${col}...`}
			value={table.getColumn(col)?.getFilterValue() as string}
			oninput={(e) =>
				table.getColumn(col)?.setFilterValue(e.currentTarget.value)}
			class="mr-2 max-w-sm"
		/>
	{/each}

	<!-- Column visibility dropdown -->
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			<Button variant="outline" class="ml-auto">Columns</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end">
			{#each table
				.getAllColumns()
				.filter((col) => col.getCanHide()) as column (column.id)}
				<DropdownMenu.CheckboxItem
					class="capitalize"
					bind:checked={
						() => column.getIsVisible(), (v) => column.toggleVisibility(!!v)
					}
				>
					{column.id}
				</DropdownMenu.CheckboxItem>
			{/each}
		</DropdownMenu.Content>
	</DropdownMenu.Root>

	<!-- Table -->
	<div
		class="mt-2 rounded-md border border-slate-200 shadow-sm dark:border-slate-700"
	>
		<Table.Root>
			<Table.Header>
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							<Table.Head>
								{#if !header.isPlaceholder}
									<FlexRender
										content={header.column.columnDef.header}
										context={header.getContext()}
									/>
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>
			<Table.Body>
				{#each table.getRowModel().rows as row (row.id)}
					<Table.Row
						data-state={row.getIsSelected() && 'selected'}
						class="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
						onclick={() => (onRowClick ? onRowClick(row.original) : null)}
					>
						{#each row.getVisibleCells() as cell (cell.id)}
							<Table.Cell>
								<FlexRender
									content={cell.column.columnDef.cell}
									context={cell.getContext()}
								/>
							</Table.Cell>
						{/each}
						{#if rowActions}
							<Table.Cell>
								{@html rowActions(row.original)}
							</Table.Cell>
						{/if}
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={columns.length} class="h-24 text-center">
							No results.
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>

	<!-- Pagination controls -->
	<div class="flex items-center justify-end space-x-2 py-4">
		<Button
			variant="outline"
			size="sm"
			onclick={() => table.previousPage()}
			disabled={!table.getCanPreviousPage()}
		>
			Previous
		</Button>
		<Button
			variant="outline"
			size="sm"
			onclick={() => table.nextPage()}
			disabled={!table.getCanNextPage()}
		>
			Next
		</Button>
	</div>
</div>
