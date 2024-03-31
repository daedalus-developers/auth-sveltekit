<script lang="ts">
	import { Button } from '@components/ui/button';
	import { goto } from '$app/navigation';
	import { LoaderCircle } from 'lucide-svelte';
	import { OAUTH_PROVIDERS } from '@types';
	import { capitalize } from '@utils';

	let loading = false;
</script>

<div class="flex w-full flex-col gap-y-2 py-2 text-center">
	<div class="relative">
		<div class="absolute inset-0 flex items-center">
			<span class="w-full border-t" />
		</div>
		<div class="relative flex justify-center text-sm uppercase tracking-wider">
			<span class="bg-background px-2"> Or continue with </span>
		</div>
	</div>
	{#if loading}
		<LoaderCircle class="mx-auto h-10 w-10 animate-spin" />
	{:else}
		{#each OAUTH_PROVIDERS as provider}
			<Button
				class="w-full"
				on:click={() => {
					loading = true;
					goto(`/oauth/${provider.name}/verify`);
				}}
			>
				<svelte:component this={provider.icon} class="mr-2 h-4 w-4" />
				{capitalize(provider.name)}
			</Button>
		{/each}
	{/if}
</div>
