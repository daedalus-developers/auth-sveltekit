<script lang="ts">
	import { cn } from '@utils';
	import { page } from '$app/stores';
	import { Button } from '@components/ui/button';
	import { cubicInOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import { lgScreen } from '@utils';
	import { settingsLinks } from '$lib/constants';

	let className: string | undefined | null = undefined;

	export { className as class };

	const [send, receive] = crossfade({
		duration: 250,
		easing: cubicInOut
	});
</script>

<nav class={cn('flex w-full flex-col space-x-2 lg:space-x-0 lg:space-y-1', className)}>
	{#each settingsLinks as item, index (item.title)}
		{#if index !== 0}
			{@const isActive = $page.url.pathname === item.href}

			<Button
				href={item.href}
				variant="ghost"
				class={cn(!isActive && 'hover:underline', 'relative justify-start hover:bg-transparent')}
				data-sveltekit-noscroll
			>
				{#if isActive}
					<div
						class="absolute inset-0 rounded-md bg-muted"
						in:send={{ key: 'active-sidebar-tab' }}
						out:receive={{ key: 'active-sidebar-tab' }}
					/>
				{/if}
				<div class="relative flex items-center text-center">
					<svelte:component
						this={item.icon}
						class={cn('text-muted-foreground', !lgScreen && 'h-64 w-64')}
					/>
					<span class={cn('ml-2', lgScreen ? '' : 'text-xl')}>
						{item.title}
					</span>
				</div>
			</Button>
		{/if}
	{/each}
</nav>
