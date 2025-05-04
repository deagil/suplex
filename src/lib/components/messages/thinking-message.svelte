<script lang="ts">
	import SparklesIcon from '$lib/components/icons/sparkles.svelte';
	import { Check, MessageCircleWarning } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	export let phase: 'thinking' | 'finishing' = 'thinking';
	// export let responseType: 'default' | 'error' | 'info' = 'default';
	const thinkingMessages = ['...', '🤔', '🧠', '🧐', '💭'];

	const thinkingMessage =
		thinkingMessages[Math.floor(Math.random() * thinkingMessages.length)];
</script>

<div class="group/message mx-auto w-full max-w-3xl px-4" data-role="assistant">
	<div class="flex w-full flex-col items-start gap-2">
		<div
			class="flex size-8 shrink-0 items-center justify-center rounded-full bg-background ring-1 ring-border"
		>
			<!-- {#if responseType === 'error'}
				<Check size={14} />
			{:else if responseType === 'info'}
				<MessageCircleWarning size={14} />
			{:else}
				<SparklesIcon size={14} />
			{/if} -->
			<SparklesIcon size={14} />
		</div>
		<div class="flex w-full max-w-3xl flex-col gap-4 text-muted-foreground">
			{#if phase === 'thinking'}
				<!-- //random thinking message from a pool of options  -->
				<span transition:fade class="text-size-14">{thinkingMessage}</span>
			{:else if phase === 'finishing'}
				<span transition:fade>Got it!</span>
			{/if}
		</div>
	</div>
</div>
