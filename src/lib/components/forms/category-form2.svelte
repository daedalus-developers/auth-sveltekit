<script lang="ts">
	import type { CategoryFormSchema } from '@types';
	import { type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { page } from '$app/stores';
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
	import SuperForm from './super-form.svelte';

	let data: SuperValidated<Infer<CategoryFormSchema>> = $page.data.categoryForm;

	let categories: Array<{ value: string; label: string }> = $page.data.categories;
</script>

<Card class="border-transparent">
	<SuperForm {data} let:superForm let:formData>
		<CardHeader>
			<CardTitle>New Category</CardTitle>
			<CardDescription>Create new category nad optionally select its parent</CardDescription>
		</CardHeader>
		<CardContent class="space-y-3.5">
			<InputField form={superForm} name="name" label="Category Name" bind:value={formData.name} />
			<ComboBoxField
				form={superForm}
				name="parent"
				options={categories}
				label="Parent Category"
				bind:value={formData.parent}
				bind:itemValue={formData.parent}
				placeholder="Select Category"
				description="This is optional you can choose a parent category, if you want the product to be on a subcategory"
			/>
		</CardContent>
		<CardFooter>
			<FormButton type="submit" class="w-full">Save Category</FormButton>
		</CardFooter>
	</SuperForm>
</Card>
