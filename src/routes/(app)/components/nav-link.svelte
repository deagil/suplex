<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';
	import type { Builder } from 'bits-ui';

	interface Props {
		href: string;
		activeClass: string;
		builder?: Builder | undefined;
		class?: string;
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let {
		href,
		activeClass,
		builder = undefined,
		class: cls = '',
		children,
		...rest
	}: Props = $props();
	

	let active = $derived($page.url.pathname.startsWith(href));
</script>

{#if builder}
	<a
		{href}
		class={cn(cls, active && activeClass)}
		{...rest}
		use:builder.action
		{...builder}
	>
		{@render children?.()}
	</a>
{:else}
	<a {href} class={cn(cls, active && activeClass)} {...rest}>
		{@render children?.()}
	</a>
{/if}
