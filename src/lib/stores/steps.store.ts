import { writable } from 'svelte/store';

type StepStore = {
	currentStep: number;
	totalSteps: number;
	progress: number;
	disableNext: boolean;
};

export const createStepsStore = (totalSteps: number = 5) => {
	const { update, subscribe } = writable<StepStore>({
		currentStep: 1,
		totalSteps,
		progress: 0,
		disableNext: true
	});

	const reset = () => {
		update((store) => ({
			...store,
			currentStep: 1,
			progress: 0
		}));
	};

	const calculateProgress = (currentStep: number, totalSteps: number) =>
		((currentStep - 1) / (totalSteps - 1)) * 100;

	const previousStep = () => {
		update((store) => {
			const nextStep = store.currentStep - 1;
			const progress = calculateProgress(nextStep, store.totalSteps);
			const disableNext = nextStep === store.totalSteps;
			return {
				...store,
				currentStep: nextStep,
				progress,
				disableNext
			};
		});
	};

	const nextStep = (skip: number = 0) => {
		update((store) => {
			const nextStep = store.currentStep + 1 + skip;
			const progress = calculateProgress(nextStep, store.totalSteps);
			const disableNext = nextStep === store.totalSteps;
			return {
				...store,
				currentStep: nextStep,
				progress,
				disableNext
			};
		});
	};

	const validateStep = (valid: boolean) => {
		update((store) => ({
			...store,
			disableNext: valid
		}));
	};

	return {
		subscribe,
		reset,
		nextStep,
		previousStep,
		validateStep
	};
};
