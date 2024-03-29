<script lang="ts">
	import type { OAuthProviderWithIcon } from '@types';
	import { CircleCheckBig } from 'lucide-svelte';
	import { Button } from '@components/ui/button';

	export let provider: OAuthProviderWithIcon;

	export let dispatch: () => void = () => {};
</script>

<div class="flex items-center justify-between space-x-3.5 border p-3">
	<div class="flex items-center space-x-3.5">
		<svelte:component this={provider.icon} class="h-4 w-4 md:h-8 md:w-8" />
		<p>
			{#if provider.providerAccountId}
				<span class="text-sm md:text-lg">{provider.providerAccountId}</span>
			{/if}
		</p>
	</div>
	<div class="flex items-center space-x-3.5">
		{#if provider.userId}
			<CircleCheckBig class="h-4 w-4 text-green-500 md:h-8  md:w-8" />
			<Button variant="secondary" on:click={dispatch}>Unlink</Button>
		{:else}
			<Button on:click={dispatch}>Connect</Button>
		{/if}
	</div>
</div>
