<script lang="ts">
	import { Button } from '@components/ui/button';
	import { onBoardingStepStore as store } from '@stores';
	import { cn, lgScreen } from '@utils';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { tierForm, type TierFormSchema } from '@types';
	import { TIERS, FEATURES, PAYMENT_OCCURENCE } from '@types';
	import { IconTierDiamond } from '@components/icons';
	import { ScrollArea } from '@components/ui/scroll-area';
	import { DisclaimerAlert } from '@components';
	import { toast } from 'svelte-sonner';
	import { zod } from 'sveltekit-superforms/adapters';
	import { TIERS_FEATURES } from '$lib/constants';
	import { FormField, FormControl, FormLabel, FormButton } from '$lib/components/ui/form';
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
	import {
		Table,
		TableBody,
		TableHead,
		TableHeader,
		TableRow,
		TableCell,
		TableCaption
	} from '@components/ui/table';

	$: pathname = $page.url.pathname;

	onMount(() => {
		if (pathname.includes('onboarding')) store.validateStep(true);
	});

	$: if (pathname.includes('onboarding')) store.validateStep(true);

	let data: SuperValidated<Infer<TierFormSchema>> = $page.data.tierForm;
	export { data as form };

	const form = superForm(data, {
		dataType: 'json',
		resetForm: true,
		validators: zod(tierForm),
		onUpdate({ result, form }) {
			if (result.type === 'success') {
				if ($page.url.pathname.includes('onboarding')) {
					store.nextStep();
				} else {
					toast.success(form.message?.text ?? '');
				}
			} else if (result.type === 'failure') {
				if (form.message) toast.error(form.message.text);
			}
		}
	});

	const { form: formData, enhance, tainted, isTainted, delayed, capture, restore } = form;

	export const snapshot = { capture, restore };

	$: disableSubmit = !isTainted($tainted) || $delayed;

	$: selectedOccurence = $formData.occurence
		? {
				label: $formData.occurence,
				value: $formData.occurence
			}
		: undefined;
</script>

<Card class="border-0">
	<form method="POST" use:enhance action="/settings?/updateTierSubscription">
		<CardHeader class="pb-2">
			<CardTitle>Tier</CardTitle>
			<CardDescription class="flex flex-col gap-y-2">
				<p>Select a Subscription Plan</p>
				<DisclaimerAlert
					title="This is only a demo"
					description="Everything you do here is not gonna be persisted on our database, this will only be stored in the cookies"
				/>
			</CardDescription>
		</CardHeader>
		<CardContent class="grid grid-cols-1 md:gap-6 lg:grid-cols-4">
			<FormField {form} name="tier">
				<RadioGroup
					bind:value={$formData.tier}
					class="col-span-1 grid h-full w-full grid-cols-3 items-center justify-between lg:grid-cols-1"
				>
					{#each TIERS as tier}
						<FormControl let:attrs>
							<FormLabel
								class="flex flex-col items-center justify-between rounded-md 
              border-2 border-muted bg-popover p-4  hover:bg-accent hover:text-accent-foreground 
              [&:has([data-state=checked])]:border-primary 
              [&:nth-child(1)]:text-green-400 [&:nth-child(2)]:text-purple-400 [&:nth-child(3)]:text-cyan-400 [&:nth-child(4)]:text-fuchsia-400"
							>
								<IconTierDiamond class="mb-2 h-10 w-10" />
								<p class="dark:text-white">
									{tier}
								</p>
								<RadioGroupItem value={tier} {...attrs} class="sr-only" />
							</FormLabel>
						</FormControl>
					{/each}
				</RadioGroup>
			</FormField>
			<div class="col-span-4 md:col-span-3">
				<ScrollArea orientation="both" class="py-4">
					<Table>
						<TableCaption
							><div>
								<p class="text-lg">
									For more details check our pricing and features <Button
										variant="link"
										href="/pricing">here</Button
									>
								</p>
							</div></TableCaption
						>
						<TableHeader class="md:text-xl">
							<TableRow>
								<TableHead>Feature</TableHead>
								{#if $lgScreen}
									{#each TIERS_FEATURES as tier (tier.value)}
										<TableHead
											class={cn(
												`md:text-xl`,
												$formData.tier === tier.value ? 'md:bg-indigo-200 md:text-black' : ''
											)}
										>
											{tier.value}
											<IconTierDiamond class="inline-flex" />
										</TableHead>
									{/each}
								{:else}
									<TableHead class="md:text-xl">{$formData.tier}</TableHead>
								{/if}
							</TableRow>
						</TableHeader>
						<TableBody>
							{#each FEATURES as feature}
								<TableRow>
									<TableCell class="line-clamp-1">{feature}</TableCell>
									{#each TIERS_FEATURES as tier}
										{@const name = tier.features.find((f) => f.name === feature)?.name}
										{@const limit = tier.features.find((f) => f.name === feature)?.limit}
										{@const frequency = tier.features.find((f) => f.name === feature)?.frequency}
										{#if $lgScreen}
											{#if name}
												<TableCell
													class={cn(
														$formData.tier === tier.value ? 'md:bg-indigo-200 md:text-black' : ''
													)}
												>
													{#if limit}
														{limit > 999 ? 'Unlimited' : limit}
													{/if}
													{#if frequency}
														{`/  ${frequency}`}
													{/if}
												</TableCell>
											{/if}
										{:else if tier.value === $formData.tier}
											{#if name}
												<TableCell>
													{#if limit}
														{limit > 999 ? 'Unlimited' : limit}
													{/if}
													{#if frequency}
														{`/  ${frequency}`}
													{/if}
												</TableCell>
											{/if}
										{/if}
									{/each}
								</TableRow>
							{/each}
							<TableRow class="text-lg">
								<TableCell>Price</TableCell>
								{#each TIERS_FEATURES as tier}
									{#if $lgScreen}
										<TableCell
											class={cn($formData.tier === tier.value ? 'bg-indigo-200 text-black' : '')}
										>
											{tier.price === 0 ? 'Free' : tier.price ? `${tier.price}$` : '$$$'}
										</TableCell>
									{:else if tier.value === $formData.tier}
										<TableCell>
											{tier.price === 0 ? 'Free' : tier.price ? `${tier.price}$` : '$$$'}
										</TableCell>
									{/if}
								{/each}
							</TableRow>
						</TableBody>
					</Table>
				</ScrollArea>
			</div>
			<div class="col-span-4 justify-end">
				<FormField {form} name="occurence">
					<FormControl let:attrs>
						<FormLabel>Billing Cyle</FormLabel>
						<Select
							selected={selectedOccurence}
							onSelectedChange={(v) => {
								v && ($formData.occurence = v.value);
							}}
						>
							<SelectTrigger {...attrs}>
								<SelectValue placeholder="Month" />
							</SelectTrigger>
							<SelectContent>
								{#each PAYMENT_OCCURENCE as occurence}
									<SelectItem value={occurence} label={occurence}>
										{occurence}
									</SelectItem>
								{/each}
							</SelectContent>
						</Select>
						<input hidden bind:value={$formData.occurence} name={attrs.name} />
					</FormControl>
				</FormField>
			</div>
		</CardContent>
		<CardFooter>
			<FormButton disabled={disableSubmit} class="w-full"
				>{pathname.includes('onboarding') ? 'Continue' : 'Update'}
			</FormButton>
		</CardFooter>
	</form>
</Card>

{#if pathname.includes('onboarding')}
	<div class="flex justify-end py-2">
		<Button variant="ghost" class="" on:click={() => store.nextStep(1)}>Skip</Button>
	</div>
{/if}
