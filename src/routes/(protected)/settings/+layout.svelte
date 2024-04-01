<script lang="ts">
	import { cn } from '@utils';
	import { page } from '$app/stores';
	import { settingsLinks } from '$lib/constants';
</script>

<div class="mx-auto grid w-full max-w-7xl gap-2 px-4">
	<h1 class="text-3xl font-semibold">Settings</h1>
</div>

<div
	class="mx-auto grid w-full max-w-7xl items-start gap-6 px-4 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]"
>
	<nav class="grid gap-4 text-sm text-muted-foreground">
		{#each settingsLinks as { href, icon, title }}
			{@const isActive = $page.url.pathname === href}
			<div>
				<svelte:component
					this={icon}
					class={cn('inline-flex h-4 w-4', isActive ? 'text-primary' : '')}
				/>
				<a {href} class={isActive ? 'font-semibold text-primary' : ''}>{title}</a>
			</div>
		{/each}
	</nav>
	<div class="grid gap-6">
		<slot />
	</div>
</div>
