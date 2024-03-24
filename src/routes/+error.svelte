<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { UndrawNotFound } from '@components';
	import { fade } from 'svelte/transition';

	onMount(() => {
		setTimeout(() => {
			window.history.back();
		}, 2500);
	});
</script>

<div class="mx-auto flex flex-col items-center justify-center py-12">
	{#key $page.status}
		<h1 in:fade class="mb-4 text-7xl font-extrabold text-destructive lg:text-9xl">
			{$page.status}
		</h1>
		<p class="mb-4 text-3xl tracking-tight md:text-4xl">{$page?.error?.message}</p>
		{#if $page?.status === 404}
			<p class="mb-4 text-xl">It seems that you are navigating on an unknown route.</p>
		{:else if $page?.status === 401}
			<p class="mb-4 text-xl">You have no permission to access this page. Sorry</p>
		{:else}
			<p class="mb-4 text-xl">
				Maybe it's time to try something else? redirecting you to your previous page.
			</p>
		{/if}
		<div class="h-1/2 w-1/2">
			<a href="/">
				<UndrawNotFound />
			</a>
		</div>
	{/key}
</div>
