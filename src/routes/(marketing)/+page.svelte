<script lang="ts">
	import * as Section from '$lib/components/landing/section';
	import { WebsiteName } from './../../config';
	import Features from './components/sections/features/features.svelte';
	import HeroSection from './components/sections/hero.svelte';
	import LogosCloud from './components/sections/logos-cloud.svelte';
	import Pricing from './components/sections/pricing.svelte';
	import Testimonials from './components/sections/testimonials.svelte';

	let { data } = $props();

	const { prices } = data;
</script>

<svelte:head>
	<title>{WebsiteName}</title>
</svelte:head>

<div class="mb-40 flex flex-col gap-8">
	<HeroSection />
	<div class="p-16">
		<Section.Root>
			<Section.Header>
				<Section.Title>The modern SAAS stack.</Section.Title>
				<Section.Description class="text-balance">
					One size doesn't fit all. Startups now rely on a variety of tools to
					manage their systems. Suplex is a low-code superconnector that lets
					you combine the powers of best-in-class tools in a single platform,
					without coding or technical expertise.
					<br />
					<br />
					Suplex doesn't replace your tools; it's the perfect tag team partner.
					<br />
					Build workflows, investigate errors, report on and query your data in one
					place.
					<br />
				</Section.Description>
			</Section.Header>
			<LogosCloud />
		</Section.Root>

		<Section.Root anchor="features">
			<Section.Header>
				<Section.Title>Features</Section.Title>
			</Section.Header>
			<Features />
		</Section.Root>
		<Section.Root>
			<Section.Header>
				<Section.Title>Testimonials</Section.Title>
			</Section.Header>
			<Testimonials />
		</Section.Root>
		<Section.Root anchor="pricing">
			<Section.Header>
				<Section.Title>Pricing</Section.Title>
				<Section.Description class="text-balance">
					Currently we support subscription based pricing out of the box.
					However, you can extend the boilerplate to support one-time or custom
					pricing models.
				</Section.Description>
			</Section.Header>
			<Pricing {prices} />
		</Section.Root>
	</div>
</div>
