<script lang="ts">
	import * as LogosCloud from '$lib/components/landing/logos-cloud';
	import SupabaseLogo from '~icons/simple-icons/supabase';
	import Zapier from '~icons/simple-icons/zapier';
	import PosthogLogo from '~icons/simple-icons/posthog';
	import SentryLogo from '~icons/simple-icons/sentry';
	import TallyLogo from './tally-logo.svelte';
	import TwentyLogo from './twenty-logo.svelte';
	import NotionLogo from '~icons/simple-icons/notion';
	import ResendLogo from '~icons/simple-icons/resend';
	import {
		Tooltip,
		TooltipTrigger,
		TooltipContent,
		TooltipProvider,
	} from '$lib/components/ui/tooltip/index.js';
</script>

<!-- No need to define the logos array, just map over it to generate the cloud -->
<TooltipProvider>
	<LogosCloud.Root class="justify-around pb-40 text-center">
		{#each [{ name: 'Supabase', role: 'Database', href: 'https://supabase.com', component: SupabaseLogo, available: true }, { name: 'Zapier', role: 'Automation', href: 'https://zapier.com', component: Zapier, available: true }, { name: 'Tally', role: 'Forms', href: 'https://tally.so', component: TallyLogo, available: true }, { name: 'Sentry', role: 'Logging', href: 'https://sentry.io', component: SentryLogo, available: false }, { name: 'Notion', role: 'Docs', href: 'https://notion.so', component: NotionLogo, available: false }, { name: 'PostHog', role: 'Analytics', href: 'https://posthog.com', component: PosthogLogo, available: false }, { name: 'Twenty', role: 'CRM', href: 'https://twenty.com', component: TwentyLogo, available: false }, { name: 'Resend', role: 'Email', href: 'https://resend.com', component: ResendLogo, available: false }] as logo}
			{#if logo.available}
				<LogosCloud.Logo href={logo.href}>
					<svelte:component this={logo.component} />
					<p class="text-balance pt-3 text-sm">{logo.name}</p>
					<p class="text-balance pt-1 text-xs text-muted-foreground">
						{logo.role}
					</p>
				</LogosCloud.Logo>
			{:else}
				<Tooltip>
					<TooltipTrigger>
						<span>
							<span class="">
								<!-- pointer-events-none opacity-60 -->
								<LogosCloud.Logo href={logo.href}>
									<svelte:component this={logo.component} />
									<p class="text-balance pt-3 text-sm">{logo.name}</p>
									<p class="text-balance pt-1 text-xs text-muted-foreground">
										{logo.role}
									</p>
								</LogosCloud.Logo>
							</span>
						</span>
					</TooltipTrigger>
					<TooltipContent>{logo.name} support coming later</TooltipContent>
				</Tooltip>
			{/if}
		{/each}
	</LogosCloud.Root>
</TooltipProvider>
