<script lang="ts">
	import * as Card from '@components/ui/card';
	import { Button } from '@components/ui/button';
	import { Label } from '@components/ui/label';
	import { Input } from '@components/ui/input';
	import * as RadioGroup from '@components/ui/radio-group';
	import * as Select from '@components/ui/select';
	import Paypal from '@components/icons/paypal.svelte';
	import CreditCard from '@components/icons/credit-card.svelte';
	import Google from '@components/icons/google.svelte';
	import type { PaymentMethod } from '@types';

	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	let selectedPaymentMethod: PaymentMethod = 'card';
</script>

<Card.Root class="border-0">
	<Card.Header>
		<Card.Title>Payment Method</Card.Title>
		<Card.Description>Add a new payment method to your account.</Card.Description>
	</Card.Header>
	<Card.Content class="grid gap-6">
		<RadioGroup.Root bind:value={selectedPaymentMethod} class="grid grid-cols-3 gap-4">
			<Label
				for="card"
				class="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
			>
				<RadioGroup.Item value="card" id="card" class="sr-only" aria-label="Card" />
				<CreditCard class="mb-3 h-6 w-6" />
				Card
			</Label>
			<Label
				for="paypal"
				class="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
			>
				<RadioGroup.Item value="paypal" id="paypal" class="sr-only" aria-label="Paypal" />
				<Paypal class="mb-3 h-6 w-6" />
				Paypal
			</Label>
			<Label
				for="google"
				class="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
			>
				<RadioGroup.Item value="google" id="google" class="sr-only" aria-label="google" />
				<Google />
				Google Pay
			</Label>
		</RadioGroup.Root>
		{#if selectedPaymentMethod === 'card'}
			<div class="space-y-3.5">
				<div class="grid gap-2">
					<Label for="name">Name</Label>
					<Input id="name" placeholder="First Last" />
				</div>
				<div class="grid gap-2">
					<Label for="number">Card number</Label>
					<Input id="number" placeholder="" />
				</div>
				<div class="grid grid-cols-3 gap-4">
					<div class="grid gap-2">
						<Label for="month">Expires</Label>
						<Select.Root>
							<Select.Trigger id="month" aria-label="Month">
								<Select.Value placeholder="Month" />
							</Select.Trigger>
							<Select.Content>
								{#each months as month, i}
									<Select.Item value={i + 1} label={month}>{month}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>
					<div class="grid gap-2">
						<Label for="year">Year</Label>
						<Select.Root>
							<Select.Trigger id="year" aria-label="Year">
								<Select.Value placeholder="Year" />
							</Select.Trigger>
							<Select.Content>
								{#each { length: 10 } as _, i}
									<Select.Item
										value={`${new Date().getFullYear() + i}`}
										label={`${new Date().getFullYear() + i}`}
									>
										{new Date().getFullYear() + i}
									</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>
					<div class="grid gap-2">
						<Label for="cvc">CVC</Label>
						<Input id="cvc" placeholder="CVC" />
					</div>
				</div>
			</div>
		{/if}
	</Card.Content>
	<Card.Footer>
		<Button class="w-full">Continue</Button>
	</Card.Footer>
</Card.Root>
