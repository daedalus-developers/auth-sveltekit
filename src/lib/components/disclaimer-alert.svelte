<script lang="ts">
	import OctagonAlert from 'lucide-svelte/icons/octagon-alert';
	import * as Alert from '@components/ui/alert';

	export let title: string = 'Heads up!';
	export let description: string = 'This is a default warning message';
</script>

<Alert.Root>
	<OctagonAlert />
	<Alert.Title>{title}</Alert.Title>
	<Alert.Description>{description}</Alert.Description>
</Alert.Root>
