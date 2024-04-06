<script lang="ts" context="module">
	import type { FormPath } from 'sveltekit-superforms';

	type T = Record<string, unknown>;

	type U = unknown;
</script>

<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
	import {
		Command,
		CommandEmpty,
		CommandGroup,
		CommandInput,
		CommandItem
	} from '@components/ui/command';

	import { buttonVariants } from '@components/ui/button';

	import { cn } from '@utils';

	import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover';

	import { tick } from 'svelte';
	import { Check, ChevronsUpDown } from 'lucide-svelte';
	import type { FieldProps } from 'formsnap';
	import {
		FormControl,
		FormDescription,
		FormField,
		FormFieldErrors,
		FormLabel
	} from '@components/ui/form';
	import type { SuperForm } from 'sveltekit-superforms';

	type $$Props = FieldProps<T, U> & {
		label: string;
		placeholder?: string;
		description?: string;
		itemValue: string | undefined;
		value: T[U];
		options: { label: string; value: T[U] }[];
	};

	export let form: SuperForm<T>;
	export let name: U;
	export let label: string;

	export let options: { label: string; value: T[U] }[] = [];
	export let value: T[U];
	export let placeholder: string | undefined = undefined;
	export let description: string | undefined = undefined;
	export let itemValue: string | undefined = undefined;

	let open = false;

	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
</script>

<FormField {form} {name} class="flex flex-col">
	<Popover bind:open let:ids>
		<FormControl let:attrs>
			<FormLabel>{label}</FormLabel>
			<PopoverTrigger
				class={cn(
					buttonVariants({ variant: 'outline' }),
					'justify-between',
					!value && 'text-muted-foreground'
				)}
				role="combobox"
				{...attrs}
			>
				{options.find((f) => f.value === value)?.label ?? placeholder}
				<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
			</PopoverTrigger>
			<input hidden bind:value name={attrs.name} />
		</FormControl>
		<!-- TODO: Fix this -->
		<PopoverContent class={cn(`h-[60%] w-[80%] md:w-[85%]`, 'p-0')}>
			<Command>
				<CommandInput autofocus {placeholder} class="h-9" />
				<CommandEmpty>{label} not found.</CommandEmpty>
				<CommandGroup>
					{#each options.reverse() as option}
						<CommandItem
							bind:value={itemValue}
							onSelect={() => {
								value = option.value;
								closeAndFocusTrigger(ids.trigger);
							}}
						>
							{option.label}
							<Check
								class={cn('ml-auto h-4 w-4', option.value !== itemValue && 'text-transparent')}
							/>
						</CommandItem>
					{/each}
				</CommandGroup>
			</Command>
		</PopoverContent>
	</Popover>
	{#if description}
		<FormDescription>{description}</FormDescription>
	{/if}
	<FormFieldErrors />
</FormField>
