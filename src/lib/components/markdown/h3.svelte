<script lang="ts">
	import { cn } from '$lib/utils';

	let { children, ...rest } = $props();
</script>

<h3 {...rest} class={cn('mb-2 mt-6 text-xl font-semibold', rest.class)}>
	{@render children?.()}
</h3>
