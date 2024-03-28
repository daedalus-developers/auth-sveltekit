<script>
	import { confetti } from '@neoconfetti/svelte';
	import { Button } from '@components/ui/button';
	import { tick } from 'svelte';
	import { goto } from '$app/navigation';

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
		Setup MFA <a class="mx-2 underline" href="/settings/security">here</a>
	</p>
	<p class="py-10"></p>
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
