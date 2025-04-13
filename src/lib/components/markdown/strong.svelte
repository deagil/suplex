<script lang="ts">
	import { cn } from '$lib/utils';

	let { children, ...rest } = $props();
</script>

<span {...rest} class={cn('font-semibold', rest.class)}>
	{@render children?.()}
</span>
