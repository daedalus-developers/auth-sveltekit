<script lang="ts">
	import { ScrollArea } from 'bits-ui';
	import WelcomeOnBoard from './welcome-onboard.svelte';
	import FinishOnboard from './finish-onboard.svelte';
	import Steps from './steps.svelte';
	import { cn, lgScreen } from '@utils';
	import { onMount } from 'svelte';
	import { onBoardingStepStore as store } from '@stores';
	import { fade, fly } from 'svelte/transition';
	import { Button } from '@components/ui/button';
	import { ArrowLeft } from 'lucide-svelte';
	import { AccountForm, TierForm, PaymentMethodForm } from '@components';

	let scrollContainer: HTMLDivElement;

	let scrolled: boolean = true;

	const setScrolledPosition = () => {
		if (scrollContainer) {
			scrolled =
				Math.abs(
					scrollContainer.scrollHeight - scrollContainer.clientHeight - scrollContainer.scrollTop
				) <= 1
					? false
					: true;
		}
	};

	onMount(() => {
		store.reset();

		if (scrollContainer) {
			scrollContainer.addEventListener('scroll', setScrolledPosition);

			return () => {
				scrollContainer.removeEventListener('scroll', setScrolledPosition);
			};
		}
	});

	$: {
		if (scrollContainer) {
			setScrolledPosition();
			store.validateStep(scrolled);
		} else {
			store.validateStep(true);
		}
	}
</script>

<div class={cn($lgScreen ? 'container' : 'mx-4')}>
	<ScrollArea.Root class="relative h-[80vh]">
		<ScrollArea.Viewport class="h-full w-full" bind:el={scrollContainer}>
			<ScrollArea.Content>
				{#if $store.currentStep !== 1}
					<div class="md:container">
						<Button
							variant="ghost"
							size="icon"
							on:click={() => store.previousStep()}
							disabled={$store.currentStep === 1}
						>
							<ArrowLeft />
							<p class="sr-only">Go Back</p>
						</Button>
					</div>
				{/if}

				{#if $store.currentStep === 1}
					<div in:fly={{ y: 200, duration: 250 }} out:fade={{ duration: 200 }}>
						<WelcomeOnBoard />
					</div>
				{:else if $store.currentStep === 2}
					<div
						in:fly={{ y: 200, duration: 250 }}
						out:fade={{ duration: 200 }}
						class="flex flex-col md:container md:w-3/4"
					>
						<h2 class="py-4 text-center text-3xl font-bold">Account</h2>
						<AccountForm />
					</div>
				{:else if $store.currentStep === 3}
					<div class="flex flex-col md:container md:w-3/4">
						<h2 class="py-4 text-center text-3xl font-bold">Select Plan</h2>
						<TierForm />
					</div>
				{:else if $store.currentStep === 4}
					<div in:fly={{ y: 200, duration: 250 }} out:fade={{ duration: 200 }}>
						<div class="flex flex-col md:container md:w-3/4">
							<h2 class="py-4 text-center text-3xl font-bold">Choose Payment Method</h2>
							<PaymentMethodForm />
						</div>
					</div>
				{:else if $store.currentStep === 5}
					<div class="flex flex-col md:container md:w-3/4">
						<FinishOnboard />
					</div>
				{/if}
			</ScrollArea.Content>
		</ScrollArea.Viewport>
		<ScrollArea.Scrollbar
			orientation="vertical"
			class="hover:bg-dark-10 flex h-full w-1 touch-none select-none rounded-full border-l border-l-transparent p-px transition-all hover:w-3"
		>
			<ScrollArea.Thumb
				class="relative flex-1 rounded-full bg-muted-foreground opacity-40 transition-opacity hover:opacity-100"
			/>
		</ScrollArea.Scrollbar>
		<ScrollArea.Corner />
	</ScrollArea.Root>
	<div class="py-4">
		<Steps showNextButton />
	</div>
</div>
