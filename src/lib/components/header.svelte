<script lang="ts">
	import LightSwitch from './light-switch.svelte';
	import Link from './link.svelte';
	import UserDropdown from './user-dropdown.svelte';
	import { Fingerprint } from 'lucide-svelte';
	import { cn, lgScreen } from '@utils';
	import { debounce } from '@utils';
	import { fade, fly } from 'svelte/transition';
	import { page } from '$app/stores';
	import { setupViewTransition } from 'sveltekit-view-transition';
	import LinksDropdown from './links-dropdown.svelte';
	import { navLinks } from '$lib/constants';

	let showHeader = true;
	let currentScrollPosition: number;
	let lastScrollPosition = 0;

	const { transition } = setupViewTransition();

	const handleScroll = debounce(() => {
		const scrollDirection = currentScrollPosition > lastScrollPosition ? 'down' : 'up';

		switch (scrollDirection) {
			case 'down':
				showHeader = false;
				break;
			case 'up':
				showHeader = true;
				break;
		}

		if ($lgScreen) {
			showHeader = true;
		}

		lastScrollPosition = currentScrollPosition;
	}, 200);
</script>

<svelte:window bind:scrollY={currentScrollPosition} on:scroll={handleScroll} />
{#if showHeader}
	<header
		in:fly={{ y: 100, duration: 100 }}
		out:fade={{ duration: 100 }}
		use:transition={'header'}
		class={cn(
			$lgScreen
				? 'container sticky top-0 z-50'
				: 'fixed bottom-0 z-50 w-full bg-muted bg-opacity-50',
			currentScrollPosition > 0 ? 'z-50 bg-muted bg-opacity-50' : ''
		)}
	>
		<nav class="relative z-50 flex py-2">
			<a
				class="inline-flex items-center gap-x-2 text-2xl font-black tracking-wide lg:text-3xl"
				href="/"
			>
				<Fingerprint class="ml-2 h-8 w-8 md:ml-0" />
				{#if $lgScreen}
					Auth Kit
				{/if}
			</a>
			<div class="ml-auto flex items-center gap-x-4">
				{#if $page.data.user}
					<div class="mr-4">
						<UserDropdown />
					</div>
				{:else if $lgScreen}
					{#each navLinks as { label, href }}
						{#if !$page.url.pathname.includes('verify')}
							<Link {href}>{label}</Link>
						{/if}
					{/each}
					<LightSwitch iconOnly />
				{:else}
					<LinksDropdown />
				{/if}
			</div>
		</nav>
	</header>
{/if}

<style>
	:global(::view-transition-old(header)),
	:global(::view-transition-new(header)) {
		animation-duration: 1s;
	}
</style>
