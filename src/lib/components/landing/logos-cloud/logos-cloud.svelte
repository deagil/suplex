<script lang="ts">
	import { cn } from '$lib/utils.js';
	interface Props {
		children?: import('svelte').Snippet;
		[key: string]: any;
	}

	let { ...props }: Props = $props();
</script>

<ul
	class={cn('flex flex-wrap items-center justify-center gap-12', props.class)}
>
	{@render props.children?.()}
</ul>
