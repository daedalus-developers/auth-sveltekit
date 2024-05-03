<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '@utils';
	import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover';
	import {
		Command,
		CommandEmpty,
		CommandGroup,
		CommandInput,
		CommandItem
	} from '@components/ui/command';
	import { page } from '$app/stores';

	let categories = $page.data.categories as Array<{ value: string; label: string }>;

	let open = false;
	let value = '';

	$: selectedValue = categories.find((f) => f.value === value)?.label ?? 'Select category...';

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
</script>

<Popover bind:open let:ids>
	<PopoverTrigger asChild let:builder>
		<Button
			builders={[builder]}
			variant="outline"
			role="combobox"
			aria-expanded={open}
			class="w-[200px] justify-between"
		>
			{selectedValue}
			<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
		</Button>
	</PopoverTrigger>
	<PopoverContent class="w-[200px] p-0">
		<Command>
			<CommandInput class="border-transparent" placeholder="Search Category..." />
			<CommandEmpty>Category not found.</CommandEmpty>
			<CommandGroup>
				{#each categories as category}
					<CommandItem
						value={category.value}
						onSelect={(currentValue) => {
							value = currentValue;
							closeAndFocusTrigger(ids.trigger);
						}}
					>
						<Check class={cn('mr-2 h-4 w-4', value !== category.value && 'text-transparent')} />
						{category.label}
					</CommandItem>
				{/each}
			</CommandGroup>
		</Command>
	</PopoverContent>
</Popover>
