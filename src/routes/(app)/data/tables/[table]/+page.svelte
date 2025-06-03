<script lang="ts">
	import DataTable from '../data-table.svelte';
	import { renderComponent } from '$lib/components/ui/data-table/index.js';
	import { generateColumns } from '../columns';
	import DataTableActions from '../data-table-actions.svelte';
	import { page } from '$app/state';
	import {
		Clipboard,
		Wrench,
		FilePlus2,
		TextSearch,
		PencilLine,
	} from '@lucide/svelte/icons';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	let { data } = $props();
	const columns = generateColumns(data.columns);
	const table = data.tableName;
	const columnsWithActions = [
		...columns,
		{
			id: 'actions',
			header: 'Actions',
			cell: ({ row }) =>
				renderComponent(DataTableActions, {
					row: row.original,
					actions: getActionsForRow(row.original),
				}),
			enableSorting: false,
			enableHiding: false,
		},
	];
	const userRole = 'admin'; // or get from session

	function getActionsForRow(row: object) {
		// Return an array of actions based on row/user/role/etc
		return [
			{
				label: 'View Record',
				icon: TextSearch,
				onClick: handleEdit,
				show: userRole === 'admin',
				group: '',
			},
			{
				label: 'Edit Record',
				icon: PencilLine,
				onClick: handleEdit,
				show: userRole === 'admin',
				group: '',
			},
			{
				label: 'Copy record ID',
				icon: Clipboard,
				onClick: handleCopy,
				show: row.id ? true : false,
				group: 'builder',
			},
			{
				label: 'Copy creation timestamp',
				icon: FilePlus2,
				onClick: handleCopy,
				show: row.created_at ? true : false,
				group: 'builder',
			},
		];
	}

	function handleCopy(row: object) {
		console.log(`Copying ${row.first_name}'s ID:`, row.id);
		navigator.clipboard.writeText(row.id);
		toast(`Copied ID ${row.id} to clipboard.`);
	}

	function handleEdit(row: object) {
		/* ... */
	}

	function handleRowClick(row: { name: any }) {
		// navigate to the table detail page
		goto(`/data/tables/${table}/${row.id}`);
	}
</script>

<DataTable
	columns={columnsWithActions}
	data={data.rows}
	onRowClick={handleRowClick}
/>
