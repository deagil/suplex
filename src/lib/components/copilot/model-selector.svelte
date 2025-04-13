<script lang="ts">
	import { Button } from '../ui/button';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger,
	} from '../ui/dropdown-menu';
	import CheckCircleFillIcon from '../icons/check-circle-fill.svelte';
	import ChevronDownIcon from '../icons/chevron-down.svelte';
	import { cn } from '$lib/utils';
	import { chatModels } from '$lib/components/copilot/ai_models';
	import type { ClassValue } from 'svelte/elements';
	import { SelectedModel } from '$lib/hooks/selected-model.svelte';

	let {
		class: c,
	}: {
		class: ClassValue;
	} = $props();

	let open = $state(false);
	const selectedChatModel = SelectedModel.fromContext();
	const selectedChatModelDetails = $derived(() => {
		const selectedId = selectedChatModel?.value ?? chatModels[0]?.id;
		return chatModels.find((model) => model.id === selectedId) || chatModels[0];
	});
</script>

<DropdownMenu {open} onOpenChange={(val) => (open = val)}>
	<DropdownMenuTrigger>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="outline"
				class={cn(
					'w-fit data-[state=open]:bg-accent data-[state=open]:text-accent-foreground md:h-[34px] md:px-2',
					c,
				)}
			>
				{selectedChatModelDetails?.name}
				<ChevronDownIcon />
			</Button>
		{/snippet}
	</DropdownMenuTrigger>
	<DropdownMenuContent align="start" class="min-w-[300px]">
		{#each chatModels as chatModel (chatModel.id)}
			<DropdownMenuItem
				onSelect={() => {
					open = false;
					selectedChatModel.value = chatModel.id;
				}}
				class="group/item flex flex-row items-center justify-between gap-4"
				data-active={chatModel.id === selectedChatModel.value}
			>
				<div class="flex flex-col items-start gap-1">
					<div>{chatModel.name}</div>
					<div class="text-xs text-muted-foreground">
						{chatModel.description}
					</div>
				</div>

				<div
					class="text-foreground opacity-0 group-data-[active=true]/item:opacity-100 dark:text-foreground"
				>
					<CheckCircleFillIcon />
				</div>
			</DropdownMenuItem>
		{/each}
	</DropdownMenuContent>
</DropdownMenu>
