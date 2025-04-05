<script lang="ts">
	import { cn } from '$lib/utils';
	interface Props {
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let { ...props }: Props = $props();
</script>

<dd class={cn('text-muted-foreground', props.class)}>
	<p class="max-w-prose">{@render props.children?.()}</p>
</dd>
