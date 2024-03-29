<script lang="ts">
	import OctagonAlert from 'lucide-svelte/icons/octagon-alert';
	import * as Alert from '@components/ui/alert';
	import Button from './ui/button/button.svelte';
	import X from 'lucide-svelte/icons/x';

	export let title: string = 'Heads up!';
	export let description: string = 'This is a default warning message';

	let discard = false;
</script>

{#if !discard}
	<Alert.Root>
		<OctagonAlert />
		<Alert.Title>{title}</Alert.Title>
		<Alert.Description>{description}</Alert.Description>
		<Button on:click={() => (discard = true)} size="sm" variant="link" class="-m-4 ml-auto flex">
			<X class="inline-flex h-4 w-4" />
		</Button>
	</Alert.Root>
{/if}
