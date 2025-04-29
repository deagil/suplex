<script lang="ts">
	import {
		Card,
		CardHeader,
		CardTitle,
		CardContent,
	} from '$lib/components/ui/card';
	// import { Button } from '$lib/components/ui/button';
	// import { goto } from '$app/navigation';

	export let title: string;
	// export let backHref: string = '';
</script>

<Card class="shadow-md">
	<CardHeader class="flex flex-row items-center justify-between space-y-0">
		<CardTitle class="text-lg font-bold">{title}</CardTitle>
		<div class="flex items-center space-x-2">
			<slot name="actions" />
		</div>
	</CardHeader>

	<CardContent class="space-y-4">
		<slot />
	</CardContent>

	<!-- {#if backHref}
      <CardFooter class="justify-end">
        <Button variant="secondary" onclick={() => goto(backHref)}>Back</Button>
      </CardFooter>
    {/if} -->
</Card>
