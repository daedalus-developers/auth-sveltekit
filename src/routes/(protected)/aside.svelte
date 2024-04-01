<script lang="ts">
	import Fingerprint from 'lucide-svelte/icons/fingerprint';
	import Settings from 'lucide-svelte/icons/settings';
	import { Tooltip, TooltipTrigger, TooltipContent } from '@components/ui/tooltip';
	import { protectedRouteLinksWithIcons as links } from '$lib/constants';
</script>

<aside class="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
	<nav class="flex flex-col items-center gap-4 px-2 sm:py-5">
		<a
			href="/"
			class="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
		>
			<Fingerprint class="h-4 w-4 transition-all group-hover:scale-110" />
			<span class="sr-only">AuthKit</span>
		</a>
		{#each links as { href, label, icon }}
			<Tooltip>
				<TooltipTrigger asChild let:builder>
					<a
						{href}
						class="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
						use:builder.action
						{...builder}
					>
						<svelte:component this={icon} class="h-5 w-5" />
						<span class="sr-only">{label}</span>
					</a>
				</TooltipTrigger>
				<TooltipContent side="right">{label}</TooltipContent>
			</Tooltip>
		{/each}
	</nav>
	<nav class="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
		<Tooltip>
			<TooltipTrigger asChild let:builder>
				<a
					href="/settings"
					class="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
					use:builder.action
					{...builder}
				>
					<Settings class="h-5 w-5" />
					<span class="sr-only">Settings</span>
				</a>
			</TooltipTrigger>
			<TooltipContent side="right">Settings</TooltipContent>
		</Tooltip>
	</nav>
</aside>
