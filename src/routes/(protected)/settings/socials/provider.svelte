<script lang="ts">
	import { capitalize } from '@utils';
	import type { OAuthProviderWithIcon } from '@types';
	import { CircleCheckBig } from 'lucide-svelte';
	import { Button } from '@components/ui/button';

	export let provider: OAuthProviderWithIcon;

	export let dispatch: () => void = () => {};
</script>

<div class="flex items-center justify-between space-x-3.5 border p-3">
	<div class="flex space-x-3.5">
		<svelte:component this={provider.icon} class="h-8 w-8" />
		<p>{capitalize(provider.name)}</p>
	</div>
	<div class="flex space-x-3.5">
		{#if provider.userId}
			<CircleCheckBig class="h-8 w-8 text-green-500" />
			<Button variant="secondary" on:click={dispatch}>Unlink</Button>
		{:else}
			<Button on:click={dispatch}>Connect</Button>
		{/if}
	</div>
</div>
