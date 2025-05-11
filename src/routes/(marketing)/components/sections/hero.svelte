<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import GitHubIcon from 'virtual:icons/lucide/github';
	import HeroAnimation from '../HeroAnimation.svelte';
	import TallyLogo from './tally-logo.svelte';
</script>

<section
	class="hero relative z-0 h-screen w-full overflow-hidden bg-black pt-20"
>
	<!-- The hero image, always 100% height, auto width, centered -->
	<img
		src="/images/marketing/hero_image.png"
		alt="Hero"
		class="absolute inset-y-0 right-0 h-full object-cover"
		style="
			-webkit-mask-image: linear-gradient(to right, transparent, black 20%, black);
			mask-image: linear-gradient(to right, transparent, black 20%, black);
			z-index: 1;
		"
		draggable="false"
	/>

	<!-- Content goes here, above the image -->
	<div
		class="absolute left-0 top-[56%] z-20 flex flex-col px-4 text-white md:px-16"
		style="transform: translateY(-50%);"
	>
		<h1
			class={cn(
				'font-retro tracking-t text-shadow-xl bg-clip-text text-4xl tracking-tight md:text-8xl',
			)}
		>
			Stop fighting your tools.
		</h1>
		<h1
			class={cn(
				'font-retro tracking-t text-shadow-xl bg-clip-text text-4xl tracking-tight md:text-8xl',
			)}
		>
			Suplex them.
		</h1>
		<p class="mt-4 md:text-xl lg:text-2xl xl:text-3xl [&_a]:underline">
			Suplex is a platform for managing and querying data across your tools
		</p>
		<p class="md:text-xl lg:text-2xl xl:text-3xl [&_a]:underline">
			— with documentation, logging and AI built in.
		</p>
		<div class="mt-6 flex flex-col items-start space-y-4">
			<!-- <Button href="/login" size="lg">Join the waitlist</Button> -->
			<Button
				data-tally-open="nPg0Mb"
				data-tally-layout="modal"
				data-tally-hide-title="1"
				data-tally-auto-close="3000"
				data-tally-width="500"
				variant="secondary"
				href="https://github.com/kizivat/saas-kit"
				target="_blank"
				size="lg"
				class="flex flex-nowrap gap-2 bg-white text-black hover:bg-white/80"
			>
				<TallyLogo class="h-4 w-4" />
				Join Early Access
			</Button>
		</div>
	</div>

	<HeroAnimation />
</section>

<HeroAnimation />
