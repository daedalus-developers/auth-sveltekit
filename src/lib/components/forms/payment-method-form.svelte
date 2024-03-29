<script lang="ts">
	import * as Card from '@components/ui/card';
	import { Input } from '@components/ui/input';
	import * as RadioGroup from '@components/ui/radio-group';
	import * as Select from '@components/ui/select';
	import * as Form from '$lib/components/ui/form/index.js';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { page } from '$app/stores';
	import { type PaymentFormSchema } from '@types';
	import { MONTHS, PAYMENT_METHODS_WITH_ICONS } from '$lib/constants';
	import { DisclaimerAlert } from '@components';
	import { onBoardingStepStore as store } from '@stores';
	import { toast } from 'svelte-sonner';
	import { Button } from '@components/ui/button';

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

<Card.Root class="border-0">
	<form method="POST" use:enhance action="/settings?/updatePaymentMethod">
		<Card.Header class="pb-2">
			<Card.Title>Payment Method</Card.Title>
			<Card.Description class="flex flex-col gap-y-2">
				<p>Add a new payment method to your account.</p>
				<DisclaimerAlert
					title="This is only a demo"
					description="Everything you do here is not gonna be persisted on our database, this will only be stored in the cookies"
				/>
			</Card.Description>
		</Card.Header>
		<Card.Content class="grid gap-6">
			<Form.Field {form} name="method">
				<RadioGroup.Root bind:value={$formData.method} class="grid grid-cols-3 gap-4">
					{#each PAYMENT_METHODS_WITH_ICONS as method}
						<Form.Control let:attrs>
							<Form.Label
								class="flex flex-col items-center justify-between rounded-md 
              border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground 
              [&:has([data-state=checked])]:border-primary"
							>
								<svelte:component this={method.icon} class="mb-2 h-8 w-8" />
								<p class="hidden md:block">
									{method.label}
								</p>
								<RadioGroup.Item value={method.value} {...attrs} class="sr-only" />
							</Form.Label>
						</Form.Control>
					{/each}
				</RadioGroup.Root>
			</Form.Field>
			{#if $formData.method === 'card' && $formData.card}
				<div class="space-y-3.5">
					<div class="grid gap-2">
						<Form.Field {form} name="card.name">
							<Form.Control let:attrs>
								<Form.Label>Name</Form.Label>
								<Input class="text-base" {...attrs} type="text" bind:value={$formData.card.name} />
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>

					<div class="grid gap-2">
						<Form.Field {form} name="card.number">
							<Form.Control let:attrs>
								<Form.Label>Number</Form.Label>
								<Input
									class="text-base"
									{...attrs}
									type="text"
									bind:value={$formData.card.number}
								/>
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>

					<div class="grid grid-cols-3 gap-2 md:gap-4">
						<div class="col-span-2 grid">
							<p class="col-span-1">Expires</p>
							<div class="col-span-1 grid grid-cols-2 gap-2 md:gap-4">
								<div class="col-span-1">
									<Form.Field {form} name="card.month">
										<Form.Control let:attrs>
											<Form.Label>Month</Form.Label>
											{#if $formData.card && $formData.card.month}
												<Select.Root
													selected={selectedMonth}
													onSelectedChange={(v) => {
														$formData.card && v && ($formData.card.month = v.value);
													}}
												>
													<Select.Trigger {...attrs}>
														<Select.Value placeholder="Month" />
													</Select.Trigger>
													<Select.Content>
														{#each MONTHS as month}
															<Select.Item class="text-xs md:text-sm" value={month} label={month}
																>{month}</Select.Item
															>
														{/each}
													</Select.Content>
												</Select.Root>
												<input hidden bind:value={$formData.card.month} name={attrs.name} />
											{/if}
										</Form.Control>
									</Form.Field>
								</div>
								<div class="col-span-1">
									<Form.Field {form} name="card.year">
										<Form.Control let:attrs>
											<Form.Label>Year</Form.Label>

											{#if $formData.card && $formData.card.year}
												<Select.Root
													selected={selectedYear}
													onSelectedChange={(v) => {
														$formData.card && v && ($formData.card.year = v.value);
													}}
												>
													<Select.Trigger {...attrs}>
														<Select.Value placeholder="Month" />
													</Select.Trigger>
													<Select.Content>
														{#each { length: 10 } as _, i}
															<p class="hidden">{_}</p>
															<Select.Item
																labelOnly
																value={new Date().getFullYear() + i}
																label={`${new Date().getFullYear() + i}`}
															>
																{new Date().getFullYear() + i}
															</Select.Item>
														{/each}
													</Select.Content>
												</Select.Root>
												<input hidden bind:value={$formData.card.year} name={attrs.name} />
											{/if}
										</Form.Control>
									</Form.Field>
								</div>
							</div>
						</div>
						<div class="col-span-1 pt-8">
							<Form.Field {form} name="card.cvc">
								<Form.Control let:attrs>
									<Form.Label>CVC</Form.Label>
									<Input class="text-base" {...attrs} type="text" bind:value={$formData.card.cvc} />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</div>
					</div>
				</div>
			{:else}
				<Form.Field {form} name="account">
					<Form.Control let:attrs>
						<Form.Label>Account</Form.Label>
						<Input
							class="text-base"
							{...attrs}
							autofocus
							type="text"
							bind:value={$formData.account}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			{/if}
		</Card.Content>
		<Card.Footer>
			<Form.Button class="w-full" disabled={disableSubmit}>
				{onboarding ? 'Continue' : 'Add'}
			</Form.Button>
		</Card.Footer>
	</form>
</Card.Root>

{#if onboarding}
	<div class="flex justify-end py-2">
		<Button variant="ghost" class="" on:click={() => store.nextStep(1)}>Skip</Button>
	</div>
{/if}
