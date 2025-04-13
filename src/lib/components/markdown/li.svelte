<script lang="ts">
	import { cn } from '$lib/utils';

	let { children, ...rest } = $props();
</script>

<li {...rest} class={cn('py-1', rest.class)}>
	{@render children?.()}
</li>
