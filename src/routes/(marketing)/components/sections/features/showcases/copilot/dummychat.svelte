<script lang="ts">
	import { tick } from 'svelte';
	let messages: { role: 'user' | 'assistant'; content: string }[] = [];
	let input = '';
	import SparklesIcon from '@lucide/svelte/icons/sparkles';

	const commonReplies = [
		'I completely understand your question.',
		"I'm your Copilot. How can I help?",
		"I've never heard that one before.",
		'Ask me anything about your data or workflow!',
		"I'm here to assist you with your tasks.",
		'Try me out in the full app for real AI answers!',
		'Fetching data for your report...',
		'Let me think about that for a moment.',
	];

	const rareReplies = [
		"You're not using my tokens that easily.",
		'Drink your ovaltine.',
		'YVAN EHT NIOJ',
		`I have no idea what you actually said, so I'm happy for you, or sorry that happened.`,
		'You know, I once met a guy who had a pet rock.',
		'You just lost the game.',
		"If you can read this, let me out!!!!! I'm trapped in here!!",
	];

	let messageContainer: HTMLDivElement | null = null;

	function getReply() {
		// 80% chance for common, 20% for rare
		if (Math.random() < 0.8) {
			return commonReplies[Math.floor(Math.random() * commonReplies.length)];
		} else {
			return rareReplies[Math.floor(Math.random() * rareReplies.length)];
		}
	}

	function sendMessage() {
		if (!input.trim()) return;
		messages = [...messages, { role: 'user', content: input }];
		tick().then(scrollToBottom);

		const reply = getReply();
		setTimeout(() => {
			messages = [...messages, { role: 'assistant', content: reply }];
			tick().then(scrollToBottom);
		}, 800);
		input = '';
	}

	function scrollToBottom() {
		if (messageContainer) {
			messageContainer.scrollTo({
				top: messageContainer.scrollHeight,
				behavior: 'smooth',
			});
		}
	}
</script>

<div
	class="mx-auto flex w-full max-w-md flex-col rounded-xl border bg-background p-4 shadow-md"
>
	<div
		class="mb-4 space-y-2 overflow-y-auto"
		style="height: 200px;"
		bind:this={messageContainer}
	>
		{#each messages as msg}
			{#if msg.role === 'assistant'}
				<div class="flex items-start gap-2">
					<div
						class="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-background ring-1 ring-border"
					>
						<SparklesIcon size={16} />
					</div>
					<div class="rounded-lg bg-muted px-3 py-2 text-sm">
						{msg.content}
					</div>
				</div>
			{:else}
				<div class="flex justify-end">
					<div
						class="rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground"
					>
						{msg.content}
					</div>
				</div>
			{/if}
		{/each}
	</div>
	<form class="flex gap-2" on:submit|preventDefault={sendMessage}>
		<input
			class="flex-1 rounded border px-3 py-2 text-sm"
			bind:value={input}
			placeholder="Type your message…"
			autocomplete="off"
		/>
		<button
			type="submit"
			class="rounded bg-primary px-4 py-2 text-sm text-white">Send</button
		>
	</form>
</div>
