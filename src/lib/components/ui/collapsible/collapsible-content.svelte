<script lang="ts">
	import { Collapsible as CollapsiblePrimitive } from 'bits-ui';
	
	type $$Props = CollapsiblePrimitive.ContentProps;

	interface Props {
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let { children, ...rest }: Props = $props();
</script>

<CollapsiblePrimitive.Content {...rest}>
	{@render children?.()}
</CollapsiblePrimitive.Content>
