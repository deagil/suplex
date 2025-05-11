<script lang="ts">
	import DummyDatatable from './data-table.svelte';

	const sourceLogosAvailable = {
		zapier: true,
		supabase: true,
		hubspot: false,
	};

	const columns = [
		{ accessorKey: 'id', header: 'ID' },
		{ accessorKey: 'name', header: 'Name' },
		{ accessorKey: 'source', header: 'System' },
		{ accessorKey: 'last_run', header: 'Last Ran' },
		{ accessorKey: 'status', header: 'On' },
	];

	const rows = [
		{
			id: 1,
			name: 'Copy to Sheet',
			source: 'Zapier',
			last_run: '2023-10-01',
			status: sourceLogosAvailable.zapier,
		},
		{
			id: 2,
			name: 'Update DB',
			source: 'Supabase',
			last_run: '2023-10-02',
			status: sourceLogosAvailable.supabase,
		},
		{
			id: 3,
			name: 'New lead',
			source: 'Hubspot',
			last_run: '2023-10-03',
			status: sourceLogosAvailable.hubspot,
		},
	];
</script>

<DummyDatatable {columns} {rows} />
