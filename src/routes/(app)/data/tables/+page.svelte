<script lang="ts">
	import DataTable from './data-table.svelte';
	import { columns } from './columns.js';

	let { data } = $props();
	console.log('data is', data);
</script>

<DataTable data={data.payments} {columns} />
