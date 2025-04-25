<script lang="ts">
	import Ellipsis from '@lucide/svelte/icons/ellipsis';
	import { toast } from 'svelte-sonner';
	import { Wrench, Clipboard } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	let { id }: { id: string } = $props();

	function handleCopy(id: string) {
		navigator.clipboard.writeText(id);
		toast(`Copied ID ${id} to clipboard`);
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<Button variant="outline" class="">
			<Ellipsis />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading>Actions</DropdownMenu.GroupHeading>
			<DropdownMenu.Item onclick={() => handleCopy(id)}>
				<Clipboard />
				Copy record ID
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item><Wrench />Table Config</DropdownMenu.Item>
		<DropdownMenu.Item>View payment details</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
