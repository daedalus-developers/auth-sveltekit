<script lang="ts">
	import { LoaderCircle } from 'lucide-svelte';
	import { onMount, onDestroy } from 'svelte';

	export let duration: Date;
	export let remainingTime: number;
	let timerInterval: ReturnType<typeof setInterval>;

	let formattedTime: string;

	function startTimer() {
		timerInterval = setInterval(() => {
			const currentTime = new Date().getTime();
			remainingTime = duration.getTime() - currentTime;

			if (remainingTime <= 0) {
				clearInterval(timerInterval);
				remainingTime = 0;
			}
		}, 1000);
	}

	$: {
		const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
		const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

		if (days > 0) {
			formattedTime = `${days.toString().padStart(2, '0')}d`;
		}

		if (hours > 0 || days > 0) {
			formattedTime += `${hours.toString().padStart(2, '0')}h`;
		}

		formattedTime = `${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
	}

	onMount(() => {
		startTimer();
	});

	onDestroy(() => {
		clearInterval(timerInterval);
	});
</script>

{#if remainingTime > 0}
	<p class="tracking-wider underline underline-offset-4">{formattedTime}</p>
{:else}
	<LoaderCircle class="animate-spin" />
{/if}
