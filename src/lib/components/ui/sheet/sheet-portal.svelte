<script lang="ts">
	import { Dialog as SheetPrimitive } from 'bits-ui';
	
	type $$Props = SheetPrimitive.PortalProps;

	interface Props {
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let { class: className = undefined, children, ...rest }: Props = $props();
	
</script>

<SheetPrimitive.Portal {...rest}>
	{@render children?.()}
</SheetPrimitive.Portal>
