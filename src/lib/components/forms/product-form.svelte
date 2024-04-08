<script lang="ts">
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import type { ProductFormSchema } from '@types';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import {
		FormButton,
		FormField,
		FormControl,
		FormLabel,
		FormFieldErrors,
		Fieldset,
		FormDescription
	} from '@components/ui/form';
	import { Input } from '@components/ui/input';
	import { Textarea } from '@components/ui/textarea';
	import { page } from '$app/stores';
	import { Button, buttonVariants } from '@components/ui/button';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import { Badge } from '@components/ui/badge';
	import {
		Card,
		CardContent,
		CardFooter,
		CardDescription,
		CardHeader,
		CardTitle
	} from '@components/ui/card';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '@components/ui/table';
	import { Check, ChevronsUpDown, CirclePlus, Upload } from 'lucide-svelte';
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
		SelectValue
	} from '@components/ui/select';
	import { capitalize, cn, mdScreen } from '@utils';
	import Trash from 'lucide-svelte/icons/trash-2';
	import { Separator } from '@components/ui/separator';
	import { tick } from 'svelte';
	import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover';
	import {
		Command,
		CommandEmpty,
		CommandGroup,
		CommandInput,
		CommandItem
	} from '@components/ui/command';
	import { PRODUCT_STATUS } from '$lib/constants';

	let data: SuperValidated<Infer<ProductFormSchema>> = $page.data.productForm;
	export { data as form };

	export let showCategoryForm = false;

	export let dispatch: () => void = () => {};

	export let cancelDispatch: () => void = () => {};

	const form = superForm(data, {
		dataType: 'json',
		onUpdated({ form }) {
			if (form.message) {
				switch (form.message.type) {
					case 'success':
						{
							toast.success(form.message.text);
							if (form.message.data && form.message.data?.redirect) {
								goto(String(form.message.data?.redirect));
							}
							dispatch();
						}
						break;
					case 'error': {
						if (form.message.data && form.message.data?.redirect) {
							goto(String(form.message.data?.redirect));
						}
						cancelDispatch();
					}
				}
			}
		},
		resetForm: false
	});

	const { form: formData, message, delayed, errors, enhance, capture, restore } = form;

	export const snapshot = { capture, restore };

	const removeVariant = (index: number) => {
		if ($formData.variants.length > 1) {
			const variants = $formData.variants.filter((_, i) => i !== index);
			$formData.variants = [...variants];
		} else {
			const firstIndex = {
				sku: $formData.variants[0].sku,
				price: $formData.variants[0].price,
				quantity: $formData.variants[0].quantity
			};

			$formData.variants = [firstIndex];
		}
	};

	const addVariant = () => {
		$formData.variants = [
			...$formData.variants,
			{ sku: `Variant - ${$formData.variants.length + 1}`, price: '0', quantity: '0' }
		];
	};

	let categories = $page.data.categories as Array<{ value: string; label: string }>;

	let productStatusOptions = PRODUCT_STATUS.map((value) => ({ value, label: capitalize(value) }));

	let openCategoryPopup = false;

	function closeAndFocusTrigger(triggerId: string) {
		openCategoryPopup = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}

	$: selectedStatus = $formData.status
		? {
				label: capitalize($formData.status),
				value: $formData.status
			}
		: undefined;
</script>

<form action="/products?/newProduct" method="POST" use:enhance>
	<div class="mx-auto grid flex-1 auto-rows-max gap-4">
		<div class="flex items-center gap-4">
			<Button variant="outline" size="icon" class="h-7 w-7" href="/products">
				<ChevronLeft class="h-4 w-4" />
				<span class="sr-only">Back</span>
			</Button>
			<h1 class="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
				{$formData.id ? $formData.name : 'New Product'}
			</h1>
			{#if $formData.id && $formData.variants.map((variant) => variant.quantity !== '0')}
				<Badge variant="outline" class="ml-auto sm:ml-0">In stock</Badge>
			{/if}
			<div class="hidden items-center gap-2 md:ml-auto md:flex">
				{#if $formData.id}
					<Button variant="outline" size="sm">Discard</Button>
				{/if}
				<FormButton size="sm" type="submit">
					{$formData.id ? 'Update Product' : 'Save Product'}
				</FormButton>
			</div>
		</div>
		<div class="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
			<div class="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
				<div class="w-[90vw] md:w-full">
					<Card class="">
						<CardHeader>
							<CardTitle>Product Details</CardTitle>
							<CardDescription>....</CardDescription>
						</CardHeader>
						<CardContent>
							<div class="grid gap-6">
								<FormField {form} name="name">
									<FormControl let:attrs>
										<FormLabel>Name</FormLabel>
										<Input {...attrs} bind:value={$formData.name} />
									</FormControl>
									<FormFieldErrors />
								</FormField>
								<FormField {form} name="description">
									<FormControl let:attrs>
										<FormLabel>Description</FormLabel>
										<Textarea {...attrs} bind:value={$formData.description} />
									</FormControl>
									<FormFieldErrors />
								</FormField>
							</div>
						</CardContent>
					</Card>
				</div>
				<div class="w-[90vw] md:w-full">
					<Card>
						<CardHeader>
							<CardTitle>Stock</CardTitle>
							<CardDescription
								>This section lets you add stocks and variants of the product</CardDescription
							>
						</CardHeader>
						<CardContent>
							{#if !$mdScreen}
								<Fieldset {form} name="variants">
									{#each $formData.variants as _, index}
										{#if index !== 0}
											<div class="py-4">
												<Separator class="mb-4" />
											</div>
											<FormField {form} name={`variants[${index}].sku`}>
												<FormControl let:attrs>
													<Input
														class="hidden"
														{...attrs}
														disabled
														bind:value={$formData.variants[index].sku}
													/>
													<div class="flex justify-between">
														{$formData.variants[index].sku}
														{#if index !== 0}
															<Button
																variant="destructive"
																size="sm"
																on:click={() => removeVariant(index)}
															>
																<Trash />
															</Button>
														{/if}
													</div>
												</FormControl>
												<FormFieldErrors />
												<FormDescription>
													This field is dynamic it will be changed when you save
												</FormDescription>
											</FormField>
										{/if}
										<FormField {form} name={`variants[${index}].price`}>
											<FormControl let:attrs>
												<FormLabel>Price</FormLabel>
												<Input {...attrs} bind:value={$formData.variants[index].price} />
											</FormControl>
											<FormFieldErrors />
										</FormField>
										<FormField {form} name={`variants[${index}].quantity`}>
											<FormControl let:attrs>
												<FormLabel>Quantity</FormLabel>
												<Input {...attrs} bind:value={$formData.variants[index].quantity} />
											</FormControl>
											<FormFieldErrors />
										</FormField>
										{#if $formData.variants.length > 1}
											<FormField {form} name={`variants[${index}].name`}>
												<FormControl let:attrs>
													<FormLabel>Name</FormLabel>
													<Input {...attrs} bind:value={$formData.variants[index].name} />
												</FormControl>
												<FormFieldErrors />
												<FormDescription>
													Consider this as a variant name e.g. Color can be Red, Blue
												</FormDescription>
											</FormField>
											<FormField {form} name={`variants[${index}].value`}>
												<FormControl let:attrs>
													<FormLabel>Value</FormLabel>
													<Input {...attrs} bind:value={$formData.variants[index].value} />
												</FormControl>
												<FormFieldErrors />
												<FormDescription>
													This is to distinguish variants with the same name e.g SIZE can be
													XS,S,M,L
												</FormDescription>
											</FormField>
										{/if}
									{/each}
								</Fieldset>
							{:else}
								<Table>
									<TableHeader>
										<TableHead>SKU</TableHead>
										<TableHead>Stock</TableHead>
										<TableHead>Price</TableHead>
										{#if $formData.variants.length > 1}
											<TableHead>Name</TableHead>
											<TableHead>Value</TableHead>
											<TableHead class="w-[100px]"></TableHead>
										{/if}
									</TableHeader>
									<TableBody>
										{#each $formData.variants as _, index}
											<TableRow>
												<TableCell class="font-semibold">
													<Fieldset {form} name="variants">
														<FormField {form} name="variants[{index}].sku">
															<FormControl let:attrs>
																{$formData.variants[index].sku}
															</FormControl>
															<FormFieldErrors />
														</FormField>
													</Fieldset>
												</TableCell>
												<TableCell>
													<Fieldset {form} name="variants">
														<FormField {form} name="variants[{index}].price">
															<FormControl let:attrs>
																<Input
																	{...attrs}
																	bind:value={$formData.variants[index].price}
																	type="number"
																/>
															</FormControl>
															<FormFieldErrors />
														</FormField>
													</Fieldset>
												</TableCell>
												<TableCell>
													<Fieldset {form} name="variants">
														<FormField {form} name="variants[{index}].quantity">
															<FormControl let:attrs>
																<Input
																	{...attrs}
																	bind:value={$formData.variants[index].quantity}
																	type="number"
																/>
															</FormControl>
															<FormFieldErrors />
														</FormField>
													</Fieldset>
												</TableCell>
												{#if $formData.variants.length > 1}
													<TableCell>
														<Fieldset {form} name="variants">
															<FormField {form} name="variants[{index}].name">
																<FormControl let:attrs>
																	<Input {...attrs} bind:value={$formData.variants[index].name} />
																</FormControl>
																<FormFieldErrors />
															</FormField>
														</Fieldset>
													</TableCell>
													<TableCell>
														<Fieldset {form} name="variants">
															<FormField {form} name="variants[{index}].value">
																<FormControl let:attrs>
																	<Input {...attrs} bind:value={$formData.variants[index].value} />
																</FormControl>
																<FormFieldErrors />
															</FormField>
														</Fieldset>
													</TableCell>
													{#if index !== 0}
														<TableCell>
															<button on:click|preventDefault={async () => removeVariant(index)}>
																<Trash />
															</button>
														</TableCell>
													{/if}
												{/if}
											</TableRow>
										{/each}
									</TableBody>
								</Table>
							{/if}
						</CardContent>
						<CardFooter class="justify-center border-t p-4">
							<Button size="sm" variant="ghost" class="gap-1" on:click={async () => addVariant()}>
								<CirclePlus class="h-3.5 w-3.5" />
								{#if $formData.variants.length === 0}
									Add Stock
								{:else}
									Add Variant
								{/if}
							</Button>
						</CardFooter>
					</Card>
				</div>
				<Card>
					<CardHeader>
						<CardTitle>Product Category</CardTitle>
					</CardHeader>
					<CardContent>
						<div class="grid items-center gap-6 md:grid-cols-2">
							<FormField {form} name="category" class="flex flex-col">
								<Popover
									bind:open={openCategoryPopup}
									let:ids
									onOpenChange={async () =>
										(categories = await fetch('/api/products/categories')
											.then((response) => response.json())
											.then((data) => data.categories))}
								>
									<FormControl let:attrs>
										<FormLabel>Category</FormLabel>
										<PopoverTrigger
											class={cn(
												buttonVariants({ variant: 'outline' }),
												'justify-between',
												!$formData.category && 'text-muted-foreground'
											)}
											role="combobox"
											{...attrs}
										>
											{categories.find((f) => f.value === $formData.category)?.label ??
												'Select Category'}
											<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
										</PopoverTrigger>
										<input hidden bind:value={$formData.category} name={attrs.name} />
									</FormControl>
									<PopoverContent class={cn(`w-[80%] md:w-[27%]`, 'p-0')}>
										<Command>
											<CommandInput autofocus placeholder="Search category..." class="h-9" />
											<CommandEmpty>Category not found.</CommandEmpty>
											<CommandGroup>
												{#each categories as category}
													<CommandItem
														bind:value={$formData.category}
														onSelect={() => {
															$formData.category = category.value;
															closeAndFocusTrigger(ids.trigger);
														}}
													>
														{category.label}
														<Check
															class={cn(
																'ml-auto h-4 w-4',
																category.value !== $formData.category && 'text-transparent'
															)}
														/>
													</CommandItem>
												{/each}
											</CommandGroup>
										</Command>
									</PopoverContent>
								</Popover>
								<FormDescription>
									You can also create a new category, if you can't find the one you're looking for.
								</FormDescription>
								<FormFieldErrors />
							</FormField>
							<div class="justify-self-end">
								<Button on:click={() => (showCategoryForm = true)}>New Category</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
			<div class="grid auto-rows-max items-start gap-4 lg:gap-8">
				<Card>
					<CardHeader>
						<CardTitle>Product Status</CardTitle>
					</CardHeader>
					<CardContent>
						<div class="grid gap-6">
							<div class="grid gap-3">
								<FormField {form} name="status">
									<FormControl let:attrs>
										<FormLabel>Status</FormLabel>
										<Select
											selected={selectedStatus}
											onSelectedChange={(v) => {
												v && ($formData.status = v.value);
											}}
										>
											<SelectTrigger {...attrs}>
												<SelectValue placeholder="Select status" />
											</SelectTrigger>
											<SelectContent>
												{#each productStatusOptions as status}
													<SelectItem value={status.value} label={status.label} />
												{/each}
											</SelectContent>
										</Select>
									</FormControl>
									<FormDescription>
										Status of the product wether its active, archived or a draft
									</FormDescription>
								</FormField>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card class="overflow-hidden">
					<CardHeader>
						<CardTitle>Product Images</CardTitle>
						<CardDescription>Lipsum dolor sit amet, consectetur adipiscing elit</CardDescription>
					</CardHeader>
					<CardContent>
						<div class="grid gap-2">
							<button
								class="flex aspect-square w-full items-center justify-center rounded-md border border-dashed"
							>
								<Upload class="h-4 w-4 text-muted-foreground" />
								<span class="sr-only">Upload</span>
							</button>
						</div>
					</CardContent>
				</Card>
				{#if $formData.id}
					<Card>
						<CardHeader>
							<CardTitle>Archive Product</CardTitle>
							<CardDescription>Lipsum dolor sit amet, consectetur adipiscing elit.</CardDescription>
						</CardHeader>
						<CardContent>
							<div></div>
							<Button size="sm" variant="secondary">Archive Product</Button>
						</CardContent>
					</Card>
				{/if}
			</div>
			<div class="flex items-center justify-center gap-2 md:hidden">
				{#if $formData.id}
					<Button variant="outline" size="sm">Discard</Button>
				{/if}
				<FormButton type="submit" size="sm">Save Product</FormButton>
			</div>
		</div>
	</div>
</form>
