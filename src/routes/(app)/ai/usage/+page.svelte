<script lang="ts">
	import type { PageData } from './$types';
	import { Progress } from '$lib/components/ui/progress';
	import * as RadioGroup from '$lib/components/ui/radio-group';

	import {
		Card,
		CardHeader,
		CardTitle,
		CardContent,
		CardFooter,
		CardDescription,
	} from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';

	let { data }: { data: PageData } = $props();
	let usage = data.usage || [];

	let totalCost = $derived.by(() => {
		let cost = 0;
		for (const u of usage) {
			cost += Number(u.cost_usd || 0);
		}
		return cost;
	});

	let totalTokens = $derived.by(() => {
		let tokens = 0;
		for (const u of usage) {
			tokens += Number(u.tokens || 0);
		}
		return tokens;
	});

	let byFeature = $derived.by(() => {
		let features: Record<string, { cost: number; count: number }> = {};
		for (const u of usage) {
			if (!features[u.feature]) features[u.feature] = { cost: 0, count: 0 };
			features[u.feature].cost += Number(u.cost_usd || 0);
			features[u.feature].count += 1;
		}
		return features;
	});

	// Budget and payment method logic
	let budgets = [10, 25, 50, 100];
	let selectedBudget = $state(budgets[1]); // Default to $10

	let percentUsed = $derived.by(() =>
		Math.min(100, (totalCost / selectedBudget) * 100),
	);

	let billingModes = [
		{ value: 'pay_as_you_go', label: 'Pay as you go' },
		{ value: 'just_in_time', label: 'Just-in-time' },
		{ value: 'regular_topup', label: 'Regular top-up' },
	];
	let selectedBillingMode = $state('pay_as_you_go');
	let topupAmount = $state(10);

	function saveBillingSettings() {
		// TODO: Implement API call to save billing mode and top-up amount
		alert(
			`Saved: ${selectedBillingMode} mode` +
				(selectedBillingMode !== 'pay_as_you_go'
					? `, $${topupAmount} top-up`
					: ''),
		);
	}
</script>

<svelte:head>
	<title>AI Usage Dashboard</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
		<Card>
			<CardHeader>
				<CardTitle>Total Cost</CardTitle>
			</CardHeader>
			<CardContent>
				<span class="text-2xl font-bold">${totalCost.toFixed(4)}</span>
			</CardContent>
		</Card>
		<Card>
			<CardHeader>
				<CardTitle>Total Tokens</CardTitle>
			</CardHeader>
			<CardContent>
				<span class="text-2xl font-bold">{totalTokens}</span>
			</CardContent>
		</Card>
		<Card>
			<CardHeader>
				<CardTitle>Features Used</CardTitle>
			</CardHeader>
			<CardContent>
				<ul>
					{#each Object.entries(byFeature) as [feature, stats]}
						<li>{feature}: {stats.count} calls (${stats.cost.toFixed(4)})</li>
					{/each}
				</ul>
			</CardContent>
		</Card>
	</div>

	<!-- AI Usage Controls -->
	<Card>
		<CardHeader>
			<CardTitle>AI Usage Budget</CardTitle>
			<CardDescription
				>Select your monthly AI budget. Usage statistics below are relative to
				this budget.</CardDescription
			>
		</CardHeader>
		<CardContent>
			<RadioGroup.Root
				value={selectedBudget}
				on:change={(e) => (selectedBudget = +e.detail)}
				class="grid grid-cols-4 gap-4"
			>
				{#each budgets as budget}
					<Label
						class="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
					>
						<RadioGroup.Item
							value={String(budget)}
							class="sr-only"
							aria-label={`$${budget} Budget`}
						/>
						<span class="text-lg font-semibold">${budget}</span>
						<span class="text-xs text-muted-foreground">per month</span>
					</Label>
				{/each}
			</RadioGroup.Root>
			<div class="mt-6">
				<Label class="mb-2 block"
					>Usage: {percentUsed.toFixed(1)}% of ${selectedBudget} budget</Label
				>
				<Progress value={percentUsed} max={100} class="h-4" />
			</div>
		</CardContent>
	</Card>

	<!-- Billing Controls -->
	<Card>
		<CardHeader>
			<CardTitle>Billing Mode</CardTitle>
			<CardDescription>
				Choose how your AI usage is billed. You can change this at any time.
			</CardDescription>
		</CardHeader>
		<CardContent class="grid gap-6">
			<RadioGroup.Root
				value={selectedBillingMode}
				onchange={(e) => console.log(e)}
				class="grid grid-cols-3 gap-4"
			>
				<Label
					class="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
					for="payg"
				>
					<RadioGroup.Item
						value="pay_as_you_go"
						id="payg"
						class="sr-only"
						aria-label="Pay as you go"
					/>
					<span class="mb-2 text-lg font-semibold">Pay as you go</span>
					<span class="text-center text-xs text-muted-foreground">
						Your account can run out of funds and must be manually refilled.
					</span>
				</Label>
				<Label
					class="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
					for="jit"
				>
					<RadioGroup.Item
						value="just_in_time"
						id="jit"
						class="sr-only"
						aria-label="Just-in-time"
					/>
					<span class="mb-2 text-lg font-semibold">Just-in-time</span>
					<span class="text-center text-xs text-muted-foreground">
						Account is automatically topped up when running low.
					</span>
				</Label>
				<Label
					class="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
					for="regular"
				>
					<RadioGroup.Item
						value="regular_topup"
						id="regular"
						class="sr-only"
						aria-label="Regular top-up"
					/>
					<span class="mb-2 text-lg font-semibold">Regular top-up</span>
					<span class="text-center text-xs text-muted-foreground">
						Your account is topped up on a regular schedule (e.g. monthly).
					</span>
				</Label>
			</RadioGroup.Root>

			{#if selectedBillingMode === 'just_in_time' || selectedBillingMode === 'regular_topup'}
				<div class="mt-4 grid gap-2">
					<Label for="topup-amount">Top-up Amount</Label>
					<Input
						id="topup-amount"
						type="number"
						min="1"
						bind:value={topupAmount}
						placeholder="Enter top-up amount in USD"
					/>
				</div>
			{/if}

			{#if selectedBillingMode === 'pay_as_you_go'}
				<div class="mt-4 text-xs text-muted-foreground">
					You will need to manually add funds when your balance runs out.
				</div>
			{/if}
		</CardContent>
		<CardFooter>
			<Button class="w-full" onclick={saveBillingSettings}
				>Save Billing Settings</Button
			>
		</CardFooter>
	</Card>
</div>
