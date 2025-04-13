<script lang="ts">
	import { cn } from '$lib/utils';

	let { children, ...rest } = $props();
</script>

<a
	{...rest}
	class={cn('text-blue-500 hover:underline', rest.class)}
	target="_blank"
	rel="noopener noreferrer"
>
	{@render children?.()}
</a>
