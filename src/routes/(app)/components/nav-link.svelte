<script lang="ts">
	import { page } from '$app/state';
	import { cn } from '$lib/utils';

	interface Props {
		href: string;
		activeClass: string;
		class?: string;
		children?: import('svelte').Snippet;
		[key: string]: any;
	}

	let {
		href,
		activeClass,
		class: cls = '',
		children,
		...rest
	}: Props = $props();

	let active = $derived(page.url.pathname.startsWith(href));
</script>

<a {href} class={cn(cls, active && activeClass)} {...rest}>
	{@render children?.()}
</a>
