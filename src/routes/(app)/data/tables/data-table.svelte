<script lang="ts" generics="TData, TValue">
	// This Svelte component renders a data table with pagination, sorting, and filtering capabilities.
	import {
		// Importing types for column definitions, pagination state, sorting state, column filters state, and visibility state from the table-core library.
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
		// Importing functions to create a Svelte table and a render component for table cells.
		createSvelteTable,
		FlexRender,
	} from '$lib/components/ui/data-table/index.js';
	import * as Table from '$lib/components/ui/table/index.js'; // Importing table components.
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js'; // Importing dropdown menu components.
	import Button from '$lib/components/ui/button/button.svelte'; // Importing button component.
	import Input from '$lib/components/ui/input/input.svelte'; // Importing input component for filtering.

	// Type definition for the properties of the DataTable component, including columns and data.
	type DataTableProps<TData, TValue> = {
		columns: ColumnDef<TData, TValue>[];
		data: TData[];
	};

	// Destructuring props to get columns and data for the table.
	let { columns, data }: DataTableProps<TData, TValue> = $props();

	// State management variables for pagination, sorting, column filters, and column visibility.
	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 }); // Initial pagination state.
	let sorting = $state<SortingState>([]); // Initial sorting state.
	let columnFilters = $state<ColumnFiltersState>([]); // Initial column filters state.
	let columnVisibility = $state<VisibilityState>({}); // Initial column visibility state.

	// Creating the Svelte table with configuration for data, columns, and state management.
	const table = createSvelteTable({
		get data() {
			return data; // Getter for the table data.
		},
		columns, // Columns configuration.
		getCoreRowModel: getCoreRowModel(), // Core row model for data handling.
		getPaginationRowModel: getPaginationRowModel(), // Pagination row model for handling pagination.
		getSortedRowModel: getSortedRowModel(), // Sorted row model for handling sorting.
		getFilteredRowModel: getFilteredRowModel(), // Filtered row model for handling filtering.
		onPaginationChange: (updater) => {
			// Handler for pagination changes.
			if (typeof updater === 'function') {
				pagination = updater(pagination); // Update pagination state if updater is a function.
			} else {
				pagination = updater; // Directly set pagination state if updater is not a function.
			}
		},
		onSortingChange: (updater) => {
			// Handler for sorting changes.
			if (typeof updater === 'function') {
				sorting = updater(sorting); // Update sorting state if updater is a function.
			} else {
				sorting = updater; // Directly set sorting state if updater is not a function.
			}
		},
		onColumnFiltersChange: (updater) => {
			// Handler for column filter changes.
			if (typeof updater === 'function') {
				columnFilters = updater(columnFilters); // Update column filters state if updater is a function.
			} else {
				columnFilters = updater; // Directly set column filters state if updater is not a function.
			}
		},
		onColumnVisibilityChange: (updater) => {
			// Handler for column visibility changes.
			if (typeof updater === 'function') {
				columnVisibility = updater(columnVisibility); // Update column visibility state if updater is a function.
			} else {
				columnVisibility = updater; // Directly set column visibility state if updater is not a function.
			}
		},
		state: {
			// Exposing state variables for pagination, sorting, column filters, and visibility.
			get pagination() {
				return pagination; // Getter for pagination state.
			},
			get sorting() {
				return sorting; // Getter for sorting state.
			},
			get columnFilters() {
				return columnFilters; // Getter for column filters state.
			},
			get columnVisibility() {
				return columnVisibility; // Getter for column visibility state.
			},
		},
	});
</script>

<div>
	<!-- Input for filtering table rows based on email addresses. -->
	<div class="flex items-center py-4">
		<Input
			placeholder="Filter emails..."
			value={table.getColumn('email')?.getFilterValue() as string}
			onchange={(e) =>
				table.getColumn('email')?.setFilterValue(e.currentTarget.value)}
			oninput={(e) =>
				table.getColumn('email')?.setFilterValue(e.currentTarget.value)}
			class="max-w-sm"
		/>
		<!-- Dropdown menu for managing column visibility. -->
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button {...props} variant="outline" class="ml-auto">Columns</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				<!-- Looping through all columns to create checkbox items for visibility control. -->
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
						<!-- Displaying column ID for visibility toggle. -->
					</DropdownMenu.CheckboxItem>
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
	<!-- Table structure for displaying data with headers and rows. -->
	<div class="rounded-md border">
		<Table.Root>
			<Table.Header>
				<!-- Rendering header groups for the table. -->
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
				<!-- Rendering rows of data in the table. -->
				{#each table.getRowModel().rows as row (row.id)}
					<Table.Row data-state={row.getIsSelected() && 'selected'}>
						{#each row.getVisibleCells() as cell (cell.id)}
							<Table.Cell>
								<FlexRender
									content={cell.column.columnDef.cell}
									context={cell.getContext()}
								/>
							</Table.Cell>
						{/each}
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={columns.length} class="h-24 text-center">
							No results. <!-- Message displayed when there are no results to show. -->
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	<!-- Pagination controls for navigating through pages of data. -->
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
