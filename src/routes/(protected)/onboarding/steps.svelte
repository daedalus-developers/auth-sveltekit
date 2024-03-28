<script lang="ts">
	import { Button } from '@components/ui/button';
	import { Progress } from 'bits-ui';
	import { ArrowLeft, ArrowRight } from 'lucide-svelte';
	import { onBoardingStepStore as store } from '@stores';

	export let showPrevButton = false;
	export let showNextButton = false;
</script>

<div class="flex flex-col py-4 md:container">
	<div class="flex w-full justify-between">
		{#if showPrevButton}
			<Button
				variant="ghost"
				size="icon"
				on:click={() => store.previousStep()}
				disabled={$store.currentStep === 1}
			>
				<ArrowLeft />
				<p class="sr-only">Go Back</p>
			</Button>
		{/if}
		{#if showNextButton}
			<Button
				variant="ghost"
				size="icon"
				class="ml-auto"
				on:click={() => store.nextStep()}
				disabled={$store.disableNext}
			>
				<ArrowRight />
				<p class="sr-only">Next Step</p>
			</Button>
		{/if}
	</div>

	<div class="flex w-full">
		<Progress.Root
			bind:value={$store.progress}
			max={100}
			class="shadow-mini-inset bg-dark-10 relative h-2 w-[100%] overflow-hidden rounded-full"
		>
			<div
				class="shadow-mini-inset h-full w-full flex-1 rounded-full bg-foreground transition-all duration-1000 ease-in-out"
				style={`transform: translateX(-${100 - (100 * ($store.progress ?? 0)) / (100 ?? 1)}%)`}
			/>
		</Progress.Root>
	</div>
</div>
