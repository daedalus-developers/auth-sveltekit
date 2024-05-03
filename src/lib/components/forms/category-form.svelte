<script lang="ts">
	import type { CategoryFormSchema, SelectType } from '@types';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { page } from '$app/stores';
	import { toast } from 'svelte-sonner';
	import { FormButton } from '@components/ui/form';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '@components/ui/card';
	import ComboBoxField from './combo-box-field.svelte';
	import InputField from './input-field.svelte';

	let data: SuperValidated<Infer<CategoryFormSchema>> = $page.data.categoryForm;

	let categories: Array<{ value: string; label: string }> = $page.data.categories;

	export let dispatch: () => void = () => {};
	export let cancelDispatch: () => void = () => {};

	const form = superForm(data, {
		invalidateAll: false,
		onUpdated({ form }) {
			if (form.message) {
				switch (form.message.type) {
					case 'success':
						if (form.message.data) {
							categories = form.message.data.categories as Array<{ value: string; label: string }>;
						}
						toast.success(form.message.text);
						dispatch();
						break;
					case 'error':
						toast.error(form.message.text);
						cancelDispatch();
				}
			}
		},
		resetForm: false
	});

	const { form: formData, enhance } = form;
</script>

<Card class="border-transparent">
	<form method="POST" action="/products?/newCategory" use:enhance>
		<CardHeader>
			<CardTitle>New Category</CardTitle>
			<CardDescription>Create new category nad optionally select its parent</CardDescription>
		</CardHeader>
		<CardContent class="space-y-3.5">
			<InputField {form} name="name" label="Category Name" bind:value={$formData.name} />
			<ComboBoxField
				{form}
				name="parent"
				options={categories}
				label="Parent Category"
				bind:value={$formData.parent}
				bind:itemValue={$formData.parent}
				placeholder="Select Category"
				description="This is optional you can choose a parent category, if you want the product to be on a subcategory"
			/>
		</CardContent>
		<CardFooter>
			<FormButton type="submit" class="w-full">Save Category</FormButton>
		</CardFooter>
	</form>
</Card>
