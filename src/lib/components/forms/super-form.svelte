<script lang="ts" context="module">
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let data: SuperValidated<T>;
	export let dataType: 'form' | 'json' = 'form';
	export let invalidateAll = true; // set to false to keep form data using muliple forms on a page
	export let debug = false;

	export let dispatch: () => void = () => {};
	export let cancelDispatch: () => void = () => {};

	export const superform = superForm(data, {
		dataType,
		invalidateAll,
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
		}
	});

	const { form, message, delayed, errors, allErrors, enhance } = superform;
</script>

<form method="POST" use:enhance {...$$restProps}>
	<slot
		{superform}
		form={$form}
		message={$message}
		errors={$errors}
		allErrors={$allErrors}
		delayed={$delayed}
	/>
</form>

{#if debug}
	<SuperDebug data={$form}></SuperDebug>
{/if}
