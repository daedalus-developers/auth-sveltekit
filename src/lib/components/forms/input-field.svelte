<script lang="ts" context="module">
	import type { FormPath } from 'sveltekit-superforms';
	type T = Record<string, unknown>;
	type U = unknown;
</script>

<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
	import type { HTMLInputTypeAttribute } from 'svelte/elements';

	import type { FieldProps } from 'formsnap';
	import {
		FormControl,
		FormDescription,
		FormField,
		FormFieldErrors,
		FormLabel
	} from '@components/ui/form';
	import type { SuperForm } from 'sveltekit-superforms';
	import { Input } from '@components/ui/input';

	type $$Props = FieldProps<T, U> & {
		label: string;
		placeholder?: string;
		description?: string;
		value: T[U];
	};

	export let form: SuperForm<T>;
	export let name: U;
	export let label: string;

	export let value: T[U];
	export let placeholder: string | undefined = undefined;
	export let description: string | undefined = undefined;
	export let type: HTMLInputTypeAttribute = 'text';
</script>

<FormField {form} {name}>
	<FormControl let:attrs>
		<FormLabel>{label}</FormLabel>
		<Input {...attrs} bind:value {placeholder} {type} />
	</FormControl>
	{#if description}
		<FormDescription>{description}</FormDescription>
	{/if}
	<FormFieldErrors />
</FormField>
