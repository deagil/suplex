<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Card,
		CardHeader,
		CardContent,
		CardFooter,
	} from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Alert } from '$lib/components/ui/alert';

	let loading = true;
	let status: string | null = null;
	let error: string | null = null;
	let connected = false;
	let supabaseOrganization: { name?: string; id?: string } | null = null;

	// On mount, check if the user is already connected
	onMount(async () => {
		loading = true;
		status = null;
		error = null;
		const res = await fetch('/api/supabase/check');
		if (res.ok) {
			const { team } = await res.json();
			if (team) {
				connected = true;
				supabaseOrganization = team;
			}
		} else {
			error = 'Failed to check Supabase connection';
		}
		loading = false;
	});

	async function connectSupabase() {
		loading = true;
		status = null;
		error = null;
		try {
			const res = await fetch('/api/supabase/connect/url');
			if (res.ok) {
				const { authorizationUrl } = await res.json();
				window.location.href = authorizationUrl;
			} else {
				error = 'Failed to initiate Supabase connection';
			}
		} catch (e) {
			error = 'Failed to initiate Supabase connection';
		}
		loading = false;
	}
</script>

<svelte:head>
	<title>Connect Your Supabase Account</title>
</svelte:head>

<div class="flex min-h-[100vh] flex-col items-center justify-center py-8">
	<Card class="w-full max-w-xl">
		<CardHeader>
			<div class="flex flex-col items-center gap-4">
				<img
					src="/images/supabase-logo.png"
					alt="Supabase logo"
					class="h-12 w-12"
				/>
				<h1 class="text-2xl font-bold">Connect Your Supabase Account</h1>
				<p class="text-center text-muted-foreground">
					To get an overview of your projects and use all our features, please
					connect your Supabase account.
				</p>
			</div>
		</CardHeader>
		<CardContent class="flex flex-col items-center gap-6">
			{#if connected && supabaseOrganization}
				<Alert variant="default" class="w-full text-center">
					Connected as {supabaseOrganization.name} ({supabaseOrganization.id})
				</Alert>
			{:else if loading}
				<Alert variant="default" class="w-full text-center">
					Checking Supabase connection...
				</Alert>
			{:else if !loading}
				<Button
					onclick={connectSupabase}
					disabled={loading}
					class="mx-auto flex min-w-[180px] max-w-[260px] cursor-pointer items-center justify-center border-none bg-transparent p-0"
					aria-label="Connect Supabase"
					type="button"
				>
					<img
						src="/images/supabase-connect-dark.svg"
						alt="Connect Supabase"
						class="min-w-[180px] max-w-[260px]"
					/>
				</Button>
			{/if}
			{#if status}
				<Alert variant="default" class="w-full">{status}</Alert>
			{:else if error}
				<Alert variant="destructive" class="w-full">{error}</Alert>
			{/if}
		</CardContent>
		<CardFooter />
	</Card>
</div>
