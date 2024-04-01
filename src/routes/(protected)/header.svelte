<script lang="ts">
	import Fingerprint from 'lucide-svelte/icons/fingerprint';
	import Search from 'lucide-svelte/icons/search';
	import Settings from 'lucide-svelte/icons/settings';
	import PanelLeft from 'lucide-svelte/icons/panel-left';
	import { Sheet, SheetTrigger, SheetClose, SheetContent } from '@components/ui/sheet';
	import { Navigation } from '@components/navigation';
	import { Input } from '@components/ui/input';
	import UserDropdown from '@components/modals/user-dropdown.svelte';
	import { Button } from '@components/ui/button';
	import { protectedRouteLinksWithIcons as links } from '$lib/constants';
	import { page } from '$app/stores';
	import { cn } from '@utils';
</script>

<header
	class="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"
>
	<Sheet>
		<SheetTrigger asChild let:builder>
			<Button builders={[builder]} size="icon" variant="outline" class="sm:hidden">
				<PanelLeft class="h-5 w-5" />
				<span class="sr-only">Toggle Menu</span>
			</Button>
		</SheetTrigger>
		<SheetContent side="left" class="sm:max-w-xs">
			<nav class="grid gap-6 text-lg font-medium">
				<a
					href="/"
					class="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
				>
					<Fingerprint class="h-4 w-4 transition-all group-hover:scale-110" />
					<span class="sr-only">AuthKit</span>
				</a>
				{#each links as { href, label, icon }}
					{@const isActive = $page.url.pathname === href}
					<SheetClose asChild let:builder>
						<a
							{href}
							class={cn(
								'flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground',
								isActive && 'text-foreground'
							)}
							use:builder.action
							{...builder}
						>
							<svelte:component this={icon} class="h-5 w-5" />
							{label}
						</a>
					</SheetClose>
				{/each}

				<SheetClose asChild let:builder>
					<a
						href="/settings"
						class={cn(
							'flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground',
							$page.url.pathname.includes('settings') && 'text-foreground'
						)}
						use:builder.action
						{...builder}
					>
						<Settings class="h-5 w-5" />
						Settings
					</a>
				</SheetClose>
			</nav>
		</SheetContent>
	</Sheet>
	<div class="hidden md:block">
		<Navigation />
	</div>
	<div class="relative ml-auto flex-1 md:grow-0">
		<Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
		<Input
			type="search"
			placeholder="Search..."
			class="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
		/>
	</div>
	<UserDropdown class="mt-3" />
</header>
