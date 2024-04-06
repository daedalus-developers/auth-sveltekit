<script lang="ts">
	import Menu from 'lucide-svelte/icons/menu';
	// import Search from 'lucide-svelte/icons/search';
	// import { Input } from './ui/input';
	import LightSwitch from './light-switch.svelte';
	import Link from './link.svelte';
	import { Fingerprint } from 'lucide-svelte';
	import { cn, lgScreen } from '@utils';
	// import { debounce } from '@utils';
	import { fade, fly } from 'svelte/transition';
	import { page } from '$app/stores';
	import { setupViewTransition } from 'sveltekit-view-transition';
	import {
		PROTECTED_ROUTE_LINKS,
		navLinks,
		protectedRouteLinks as userLinks
	} from '$lib/constants';
	import UserDropdown from './modals/user-dropdown.svelte';
	import { Button } from './ui/button';
	import { Sheet, SheetClose, SheetContent, SheetTrigger } from './ui/sheet';

	let showHeader = true;
	let currentScrollPosition: number;
	// let lastScrollPosition = 0;

	$: pathname = $page.url.pathname;

	const { transition } = setupViewTransition();

	// const handleScroll = debounce(() => {
	// 	const scrollDirection = currentScrollPosition > lastScrollPosition ? 'down' : 'up';
	//
	// 	switch (scrollDirection) {
	// 		case 'down':
	// 			showHeader = false;
	// 			break;
	// 		case 'up':
	// 			showHeader = true;
	// 			break;
	// 	}
	//
	// 	if ($lgScreen) {
	// 		showHeader = true;
	// 	}
	//
	// 	lastScrollPosition = currentScrollPosition;
	// }, 200);

	const protectedRoutes: Array<string> = [
		...PROTECTED_ROUTE_LINKS.map((link) => link),
		'onboarding',
		'settings',
		'verify',
		'oauth'
	];

	$: protectedRoute = protectedRoutes.some((route) => pathname.includes(route));

	$: if (protectedRoute) {
		showHeader = false;
	} else {
		showHeader = true;
	}
</script>

<svelte:window bind:scrollY={currentScrollPosition} />

{#if showHeader}
	<header
		in:fly={{ y: 100, duration: 100 }}
		out:fade={{ duration: 100 }}
		use:transition={'header'}
		class={cn(
			'sticky top-0 flex h-16 items-center gap-4 px-4 lg:container',
			currentScrollPosition > 0 ? 'border-b bg-muted-foreground/5' : ''
		)}
	>
		<nav
			class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
		>
			<a
				href="/"
				class="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
			>
				<Fingerprint class="h-4 w-4 transition-all group-hover:scale-125" />
				<span class="sr-only">AuthKit</span>
			</a>
			<!-- {#each protectedNavLinks as { label, href }} -->
			<!-- 	<Link {href}>{label}</Link> -->
			<!-- {/each} -->
		</nav>
		<Sheet>
			<SheetTrigger asChild let:builder>
				<Button
					variant="outline"
					size="icon"
					class="shrink-0 border-transparent md:hidden"
					builders={[builder]}
				>
					<Menu class="h-5 w-5" />
					<span class="sr-only">Toggle navigation menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent side="left">
				<nav class="grid gap-6 text-lg font-medium">
					<a
						href="/"
						class="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
					>
						<Fingerprint class="h-4 w-4 transition-all group-hover:scale-125" />
						<span class="sr-only">AuthKit</span>
					</a>
					{#if $page.data.user}
						{#each userLinks as { label, href }}
							<SheetClose asChild let:builder>
								<Button
									builders={[builder]}
									{href}
									variant="link"
									class="flex justify-start px-0 text-lg text-muted-foreground hover:text-foreground"
									>{label}</Button
								>
							</SheetClose>
						{/each}
					{:else}
						{#each navLinks as { label, href }}
							{#if !$page.url.pathname.includes('verify')}
								<SheetClose asChild let:builder>
									<Button
										builders={[builder]}
										{href}
										variant="link"
										class="flex justify-start px-0 text-lg text-muted-foreground hover:text-foreground"
										>{label}</Button
									>
								</SheetClose>
							{/if}
						{/each}
					{/if}
					<SheetClose asChild let:builder>
						<LightSwitch
							builders={[builder]}
							variant="link"
							class="flex text-lg text-muted-foreground hover:text-foreground"
						/>
					</SheetClose>
				</nav>
			</SheetContent>
		</Sheet>
		<div class="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
			<div class="ml-auto">
				{#if $lgScreen && !protectedRoute && !$page.data.user}
					<div class="ml-auto inline-flex flex-1 items-center space-x-4 sm:flex-initial">
						{#each navLinks as { label, href }}
							{#if !$page.url.pathname.includes('verify')}
								<Link {href}>{label}</Link>
							{/if}
						{/each}
						<LightSwitch iconOnly variant="ghost" class="hover:bg-transparent" />
					</div>
				{/if}
			</div>
		</div>
		{#if $page.data.user}
			<UserDropdown />
		{/if}
	</header>
{/if}

<style>
	:global(::view-transition-old(header)),
	:global(::view-transition-new(header)) {
		animation-duration: 1s;
	}
</style>
