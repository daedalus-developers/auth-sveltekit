<script lang="ts">
	import { page } from '$app/stores';
	import SuperForm from './super-form.svelte';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import type { CategoryFormSchema } from '@types';
	import TextField from './text-field.svelte';
	import { Input } from '@components/ui/input';

	let data: SuperValidated<Infer<CategoryFormSchema>> = $page.data.categoryForm;
	export { data as form };

	const form = superForm(data);
</script>

<SuperForm {data} {form}>
	<TextField {form} name="name">
		<Input />
	</TextField>
</SuperForm>
