<script lang="ts">
	import { cn } from '$lib/utils';

	let { children, ...rest } = $props();
</script>

<h6 {...rest} class={cn('mb-2 mt-6 text-sm font-semibold', rest.class)}>
	{@render children?.()}
</h6>
