<script lang="ts">
	import type { PageData } from './$types';
	import {
		Card,
		CardHeader,
		CardTitle,
		CardContent,
	} from '$lib/components/ui/card';
	import {
		Table,
		TableHead,
		TableRow,
		TableHeader,
		TableBody,
		TableCell,
	} from '$lib/components/ui/table';
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

	<Card>
		<CardHeader>
			<CardTitle>Recent Usage</CardTitle>
		</CardHeader>
		<CardContent>
			<Table>
				<TableHead>
					<TableRow>
						<TableHeader>Date</TableHeader>
						<TableHeader>Feature</TableHeader>
						<TableHeader>Model</TableHeader>
						<TableHeader>Tokens</TableHeader>
						<TableHeader>Cost (USD)</TableHeader>
					</TableRow>
				</TableHead>
				<TableBody>
					{#each usage.slice(0, 20) as u}
						<TableRow>
							<TableCell>{new Date(u.created_at).toLocaleString()}</TableCell>
							<TableCell>{u.feature}</TableCell>
							<TableCell>{u.model}</TableCell>
							<TableCell>{u.tokens}</TableCell>
							<TableCell>${Number(u.cost_usd).toFixed(4)}</TableCell>
						</TableRow>
					{/each}
				</TableBody>
			</Table>
		</CardContent>
	</Card>
</div>
