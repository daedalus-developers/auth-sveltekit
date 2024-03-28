<script>
	import { confetti } from '@neoconfetti/svelte';
	import { Button } from '@components/ui/button';
	import { tick } from 'svelte';
	import { goto } from '$app/navigation';
	import Fingerprint from 'lucide-svelte/icons/fingerprint';

	let showConfetti = false;
</script>

{#if showConfetti}
	<div class="flex items-center justify-center">
		<div use:confetti />
	</div>
{/if}
<div class="container flex flex-col items-center justify-center space-y-14">
	<p class="pt-11">You may choose to also set up your account further</p>
	<p class="py-4">
		Click <a href="/settings" class="text-blue-500 hover:text-blue-600">here</a> to setup further.
	</p>
	<p class="py-10"></p>
	<Fingerprint class="h-64 w-64" />
	<Button
		class="my-10"
		on:click={async () => {
			showConfetti = false;
			await tick();
			showConfetti = true;
			setTimeout(() => {
				goto('/dashboard');
			}, 2500);
		}}
	>
		Continue
	</Button>
</div>
