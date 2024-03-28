<script lang="ts">
	import * as Card from '@components/ui/card';
	import { Input } from '@components/ui/input';
	import * as RadioGroup from '@components/ui/radio-group';
	import * as Select from '@components/ui/select';
	import * as Form from '$lib/components/ui/form/index.js';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { page } from '$app/stores';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { type PaymentFormSchema, paymentForm } from '@types';
	import { MONTHS, PAYMENT_METHODS_WITH_ICONS } from '$lib/constants';
	import { DisclaimerAlert } from '@components';

	$: pathname = $page.url.pathname.includes('onboarding');

	let data: SuperValidated<Infer<PaymentFormSchema>> = $page.data.paymentForm;
	export { data as form };

	const form = superForm(data, {
		dataType: 'json',
		validators: zodClient(paymentForm)
	});

	const { form: formData, enhance } = form;

	$: selectedMonth = $formData.card.month
		? {
				label: $formData.card.month,
				value: $formData.card.month
			}
		: undefined;

	$: selectedYear = $formData.card.year
		? {
				label: String($formData.card.year),
				value: $formData.card.year
			}
		: undefined;
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
			{#if $formData.method === 'card'}
				<div class="space-y-3.5">
					<div class="grid gap-2">
						<Form.Field {form} name="card.name">
							<Form.Control let:attrs>
								<Form.Label>Name</Form.Label>
								<Input class="text-base" {...attrs} type="text" bind:value={$formData.card.name} />
							</Form.Control>
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
						</Form.Field>
					</div>
					<div class="grid grid-cols-3 gap-4">
						<div class="grid gap-2">
							<Form.Field {form} name="card.month">
								<Form.Control let:attrs>
									<Form.Label>Expires</Form.Label>
									<Select.Root
										selected={selectedMonth}
										onSelectedChange={(v) => {
											v && ($formData.card.month = v.value);
										}}
									>
										<Select.Trigger {...attrs}>
											<Select.Value placeholder="Month" />
										</Select.Trigger>
										<Select.Content>
											{#each MONTHS as month}
												<Select.Item value={month} label={month}>{month}</Select.Item>
											{/each}
										</Select.Content>
									</Select.Root>
									<input hidden bind:value={$formData.card.month} name={attrs.name} />
								</Form.Control>
							</Form.Field>
						</div>

						<div class="grid gap-2">
							<Form.Field {form} name="card.year">
								<Form.Control let:attrs>
									<Form.Label>Expires</Form.Label>
									<Select.Root
										selected={selectedYear}
										onSelectedChange={(v) => {
											v && ($formData.card.year = v.value);
										}}
									>
										<Select.Trigger {...attrs}>
											<Select.Value placeholder="Month" />
										</Select.Trigger>
										<Select.Content>
											{#each { length: 10 } as _, i}
												<p class="hidden">{_}</p>
												<Select.Item
													value={`${new Date().getFullYear() + i}`}
													label={`${new Date().getFullYear() + i}`}
												>
													{new Date().getFullYear() + i}
												</Select.Item>
											{/each}
										</Select.Content>
									</Select.Root>
									<input hidden bind:value={$formData.card.year} name={attrs.name} />
								</Form.Control>
							</Form.Field>
						</div>
						<div class="grid gap-2">
							<Form.Field {form} name="card.cvc">
								<Form.Control let:attrs>
									<Form.Label>CVC</Form.Label>
									<Input class="text-base" {...attrs} type="text" bind:value={$formData.card.cvc} />
								</Form.Control>
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
				</Form.Field>
			{/if}
		</Card.Content>
		<Card.Footer>
			<Form.Button class="w-full">
				{pathname ? 'Continue' : 'Save'}
			</Form.Button>
		</Card.Footer>
	</form>
</Card.Root>
