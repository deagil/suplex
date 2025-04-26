<script lang="ts">
	import { goto } from '$app/navigation';
	import DataTable from './data-table.svelte';
	const columns = [
		{ accessorKey: 'name', header: 'Name' },
		{ accessorKey: 'description', header: 'Description' },
		{ accessorKey: 'row_estimate', header: 'Row Estimate' },
		{ accessorKey: 'total_size_pretty', header: 'Table Size' },
		{ accessorKey: 'rls_enabled', header: 'RLS Enabled' },
	];
	let { data } = $props();
	function handleRowClick(row: { name: any }) {
		// navigate to the table detail page
		goto(`/data/tables/${row.name}`);
	}
</script>

<DataTable
	{columns}
	data={data.tables}
	filterColumns={['name']}
	onRowClick={handleRowClick}
/>
