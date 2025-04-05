<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { HTMLLiAttributes } from 'svelte/elements';
	import ChevronRight from '~icons/lucide/chevron-right';

	type $$Props = HTMLLiAttributes & {
		el?: HTMLLIElement;
	};

	interface Props {
		el?: $$Props['el'];
		class?: $$Props['class'];
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let { el = $bindable(undefined), class: className = undefined, children, ...rest }: Props = $props();
	
</script>

<li
	role="presentation"
	aria-hidden="true"
	class={cn('[&>svg]:size-3.5', className)}
	bind:this={el}
	{...rest}
>
	{#if children}{@render children()}{:else}
		<ChevronRight />
	{/if}
</li>
