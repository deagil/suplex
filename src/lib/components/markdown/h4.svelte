<script lang="ts">
	import { cn } from '$lib/utils';

	let { children, ...rest } = $props();
</script>

<h4 {...rest} class={cn('mb-2 mt-6 text-lg font-semibold', rest.class)}>
	{@render children?.()}
</h4>
