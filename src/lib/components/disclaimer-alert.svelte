<script lang="ts">
	import { Alert, AlertDescription, AlertTitle } from '@components/ui/alert';
	import OctagonAlert from 'lucide-svelte/icons/octagon-alert';
	import Button from './ui/button/button.svelte';
	import X from 'lucide-svelte/icons/x';

	export let title: string = 'Heads up!';
	export let description: string = 'This is a default warning message';

	let discard = false;
</script>

{#if !discard}
	<Alert>
		<OctagonAlert />
		<AlertTitle>{title}</AlertTitle>
		<AlertDescription>{description}</AlertDescription>
		<Button on:click={() => (discard = true)} size="sm" variant="link" class="-m-4 ml-auto flex">
			<X class="inline-flex h-4 w-4" />
		</Button>
	</Alert>
{/if}
