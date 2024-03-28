<script lang="ts">
	import * as Card from '@components/ui/card';
	import * as Table from '@components/ui/table';
	import { Button } from '@components/ui/button';
	import * as Form from '$lib/components/ui/form/index.js';
	import * as RadioGroup from '@components/ui/radio-group';
	import { onBoardingStepStore as store } from '@stores';
	import { lgScreen } from '@utils';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { type TierFormSchema, tierForm } from '@types';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { TIERS, FEATURES, TIERS_FEATURES } from '$lib/constants';
	import { IconTierDiamond } from '@components/icons';
	import { ScrollArea } from '@components/ui/scroll-area';
	import { DisclaimerAlert } from '@components';

	$: pathname = $page.url.pathname;

	onMount(() => {
		if (pathname.includes('onboarding')) store.validateStep(true);
	});

	$: if (pathname.includes('onboarding')) store.validateStep(true);

	let data: SuperValidated<Infer<TierFormSchema>> = $page.data.tierForm;
	export { data as form };

	const form = superForm(data, {
		validators: zodClient(tierForm)
	});

	const { form: formData, enhance } = form;
</script>

<Card.Root class="border-0">
	<form method="POST" use:enhance action="/settings?/updateTierSubscription">
		<Card.Header class="pb-2">
			<Card.Title>Tier</Card.Title>
			<Card.Description class="flex flex-col gap-y-2">
				<p>Select a Subscription Plan</p>
				<DisclaimerAlert
					title="This is only a demo"
					description="Everything you do here is not gonna be persisted on our database, this will only be stored in the cookies"
				/>
			</Card.Description>
		</Card.Header>
		<Card.Content class="grid grid-cols-1 md:gap-6 lg:grid-cols-4">
			<Form.Field {form} name="tier">
				<RadioGroup.Root
					bind:value={$formData.tier}
					class="grid h-full w-full grid-cols-3 items-center justify-center lg:grid-cols-1"
				>
					{#each TIERS as tier}
						<Form.Control let:attrs>
							<Form.Label
								class="flex flex-col items-center justify-between rounded-md 
              border-2 border-muted bg-popover p-4  hover:bg-accent hover:text-accent-foreground 
              [&:has([data-state=checked])]:border-primary 
              [&:nth-child(1)]:text-green-400 [&:nth-child(2)]:text-purple-400 [&:nth-child(3)]:text-cyan-400 [&:nth-child(4)]:text-fuchsia-400"
							>
								<IconTierDiamond class="mb-2 h-10 w-10" />
								<p class="dark:text-white">
									{tier}
								</p>
								<RadioGroup.Item value={tier} {...attrs} class="sr-only" />
							</Form.Label>
						</Form.Control>
					{/each}
				</RadioGroup.Root>
			</Form.Field>
			<div class="col-span-3">
				<ScrollArea orientation="both" class="py-4">
					<Table.Root>
						<Table.Caption
							><div>
								<p class="text-lg">
									For more details check our pricing and features <Button
										variant="link"
										href="/pricing">here</Button
									>
								</p>
							</div></Table.Caption
						>
						<Table.Header class="md:text-xl">
							<Table.Row>
								<Table.Head>Feature</Table.Head>
								{#if $lgScreen}
									{#each TIERS_FEATURES as tier}
										<Table.Head class="md:text-xl">{tier.value}</Table.Head>
									{/each}
								{:else}
									<Table.Head class="md:text-xl">{$formData.tier}</Table.Head>
								{/if}
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each FEATURES as feature}
								<Table.Row>
									<Table.Cell class="line-clamp-1">{feature}</Table.Cell>
									{#each TIERS_FEATURES as tier}
										{@const name = tier.features.find((f) => f.name === feature)?.name}
										{@const limit = tier.features.find((f) => f.name === feature)?.limit}
										{@const frequency = tier.features.find((f) => f.name === feature)?.frequency}
										{#if $lgScreen}
											{#if name}
												<Table.Cell>
													{#if limit}
														{limit > 999 ? 'Unlimited' : limit}
													{/if}
													{#if frequency}
														{`/  ${frequency}`}
													{/if}
												</Table.Cell>
											{/if}
										{:else if tier.value === $formData.tier}
											{#if name}
												<Table.Cell>
													{#if limit}
														{limit > 999 ? 'Unlimited' : limit}
													{/if}
													{#if frequency}
														{`/  ${frequency}`}
													{/if}
												</Table.Cell>
											{/if}
										{/if}
									{/each}
								</Table.Row>
							{/each}
							<Table.Row class="text-lg">
								<Table.Cell>Price</Table.Cell>
								{#each TIERS_FEATURES as tier}
									{#if $lgScreen}
										<Table.Cell>
											{tier.price === 0 ? 'Free' : tier.price ? `${tier.price}$` : '$$$'}
										</Table.Cell>
									{:else if tier.value === $formData.tier}
										<Table.Cell>
											{tier.price === 0 ? 'Free' : tier.price ? `${tier.price}$` : '$$$'}
										</Table.Cell>
									{/if}
								{/each}
							</Table.Row>
						</Table.Body>
					</Table.Root>
				</ScrollArea>
			</div>
		</Card.Content>
		<Card.Footer>
			<Button class="w-full">{pathname.includes('onboarding') ? 'Continue' : 'Save'}</Button>
		</Card.Footer>
	</form>
</Card.Root>

{#if pathname.includes('onboarding')}
	<div class="container flex justify-end">
		<Button variant="secondary" on:click={() => store.nextStep(1)}>Skip</Button>
	</div>
{/if}
