<script lang="ts">
	import { Input } from '@components/ui/input';
	import {
		FormField,
		FormControl,
		FormLabel,
		FormFieldErrors,
		FormButton
	} from '$lib/components/ui/form';
	import {
		Select,
		SelectValue,
		SelectTrigger,
		SelectContent,
		SelectItem
	} from '@components/ui/select';
	import { RadioGroup, RadioGroupItem } from '@components/ui/radio-group';
	import {
		Card,
		CardHeader,
		CardTitle,
		CardDescription,
		CardContent,
		CardFooter
	} from '@components/ui/card';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { page } from '$app/stores';
	import { type PaymentFormSchema } from '@types';
	import { MONTHS } from '@types';
	import { DisclaimerAlert } from '@components';
	import { onBoardingStepStore as store } from '@stores';
	import { toast } from 'svelte-sonner';
	import { Button } from '@components/ui/button';
	import { PAYMENT_METHODS_WITH_ICONS } from '$lib/constants';

	$: onboarding = $page.url.pathname.includes('onboarding');

	let data: SuperValidated<Infer<PaymentFormSchema>> = $page.data.paymentForm;
	export { data as form };

	const form = superForm(data, {
		dataType: 'json',
		resetForm: true,
		onUpdate({ result, form }) {
			if (result.type === 'success') {
				if (onboarding) {
					store.nextStep();
				} else {
					toast.success(form.message?.text ?? '');
				}
			} else if (result.type === 'failure') {
				if (form.message?.type === 'error') toast.error(form.message.text);
				else toast.success(form.message?.text ?? '');
			}
		}
	});

	const { form: formData, enhance, tainted, isTainted, delayed, capture, restore } = form;

	export const snapshot = { capture, restore };

	$: disableSubmit = !isTainted($tainted) || $delayed;

	let selectedMonth = {
		label: 'January',
		value: 'January' as (typeof MONTHS)[number]
	};

	let selectedYear = {
		label: new Date().getFullYear().toString(),
		value: new Date().getFullYear()
	};

	$: if ($formData.card) {
		selectedYear = {
			label: String($formData.card.year),
			value: $formData.card.year
		};
		selectedMonth = {
			label: $formData.card.month,
			value: $formData.card.month
		};
	}
</script>

<Card class="border-0">
	<form method="POST" use:enhance action="/settings?/updatePaymentMethod">
		<CardHeader class="pb-2">
			<CardTitle>Payment Method</CardTitle>
			<CardDescription class="flex flex-col gap-y-2">
				<p>Add a new payment method to your account.</p>
				<DisclaimerAlert
					title="This is only a demo"
					description="Everything you do here is not gonna be persisted on our database, this will only be stored in the cookies"
				/>
			</CardDescription>
		</CardHeader>
		<CardContent class="grid gap-6">
			<FormField {form} name="method">
				<RadioGroup bind:value={$formData.method} class="grid grid-cols-3 gap-4">
					{#each PAYMENT_METHODS_WITH_ICONS as method}
						<FormControl let:attrs>
							<FormLabel
								class="flex flex-col items-center justify-between rounded-md 
              border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground 
              [&:has([data-state=checked])]:border-primary"
							>
								<svelte:component this={method.icon} class="mb-2 h-8 w-8" />
								<p class="hidden md:block">
									{method.label}
								</p>
								<RadioGroupItem value={method.value} {...attrs} class="sr-only" />
							</FormLabel>
						</FormControl>
					{/each}
				</RadioGroup>
			</FormField>
			{#if $formData.method === 'card' && $formData.card}
				<div class="space-y-3.5">
					<div class="grid gap-2">
						<FormField {form} name="card.name">
							<FormControl let:attrs>
								<FormLabel>Name</FormLabel>
								<Input class="text-base" {...attrs} type="text" bind:value={$formData.card.name} />
							</FormControl>
							<FormFieldErrors />
						</FormField>
					</div>

					<div class="grid gap-2">
						<FormField {form} name="card.number">
							<FormControl let:attrs>
								<FormLabel>Number</FormLabel>
								<Input
									class="text-base"
									{...attrs}
									type="text"
									bind:value={$formData.card.number}
								/>
							</FormControl>
							<FormFieldErrors />
						</FormField>
					</div>

					<div class="grid grid-cols-3 gap-2 md:gap-4">
						<div class="col-span-2 grid">
							<p class="col-span-1">Expires</p>
							<div class="col-span-1 grid grid-cols-2 gap-2 md:gap-4">
								<div class="col-span-1">
									<FormField {form} name="card.month">
										<FormControl let:attrs>
											<FormLabel>Month</FormLabel>
											{#if $formData.card && $formData.card.month}
												<Select
													selected={selectedMonth}
													onSelectedChange={(v) => {
														$formData.card && v && ($formData.card.month = v.value);
													}}
												>
													<SelectTrigger {...attrs}>
														<SelectValue placeholder="Month" />
													</SelectTrigger>
													<SelectContent>
														{#each MONTHS as month}
															<SelectItem class="text-xs md:text-sm" value={month} label={month}
																>{month}</SelectItem
															>
														{/each}
													</SelectContent>
												</Select>
												<input hidden bind:value={$formData.card.month} name={attrs.name} />
											{/if}
										</FormControl>
									</FormField>
								</div>
								<div class="col-span-1">
									<FormField {form} name="card.year">
										<FormControl let:attrs>
											<FormLabel>Year</FormLabel>

											{#if $formData.card && $formData.card.year}
												<Select
													selected={selectedYear}
													onSelectedChange={(v) => {
														$formData.card && v && ($formData.card.year = v.value);
													}}
												>
													<SelectTrigger {...attrs}>
														<SelectValue placeholder="Month" />
													</SelectTrigger>
													<SelectContent>
														{#each { length: 10 } as _, i}
															<p class="hidden">{_}</p>
															<SelectItem
																value={new Date().getFullYear() + i}
																label={`${new Date().getFullYear() + i}`}
															>
																{new Date().getFullYear() + i}
															</SelectItem>
														{/each}
													</SelectContent>
												</Select>
												<input hidden bind:value={$formData.card.year} name={attrs.name} />
											{/if}
										</FormControl>
									</FormField>
								</div>
							</div>
						</div>
						<div class="col-span-1 pt-8">
							<FormField {form} name="card.cvc">
								<FormControl let:attrs>
									<FormLabel>CVC</FormLabel>
									<Input class="text-base" {...attrs} type="text" bind:value={$formData.card.cvc} />
								</FormControl>
								<FormFieldErrors />
							</FormField>
						</div>
					</div>
				</div>
			{:else}
				<FormField {form} name="account">
					<FormControl let:attrs>
						<FormLabel>Account</FormLabel>
						<Input
							class="text-base"
							{...attrs}
							autofocus
							type="text"
							bind:value={$formData.account}
						/>
					</FormControl>
					<FormFieldErrors />
				</FormField>
			{/if}
		</CardContent>
		<CardFooter>
			<FormButton class="w-full" disabled={disableSubmit}>
				{onboarding ? 'Continue' : 'Add'}
			</FormButton>
		</CardFooter>
	</form>
</Card>

{#if onboarding}
	<div class="flex justify-end py-2">
		<Button variant="ghost" class="" on:click={() => store.nextStep()}>Skip</Button>
	</div>
{/if}
