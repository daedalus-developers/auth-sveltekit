<script lang="ts">
	import { cn } from '@utils/ui.js';
	import Check from 'lucide-svelte/icons/check';
	import { Select as SelectPrimitive } from 'bits-ui';

	type $$Props = SelectPrimitive.ItemProps & {
		labelOnly?: boolean;
	};
	type $$Events = SelectPrimitive.ItemEvents;

	let className: $$Props['class'] = undefined;
	export let value: $$Props['value'];
	export let label: $$Props['label'] = undefined;
	export let disabled: $$Props['disabled'] = undefined;
	export let labelOnly: $$Props['labelOnly'] = true;
	export { className as class };
</script>

<SelectPrimitive.Item
	{value}
	{disabled}
	{label}
	class={cn(
		'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5   text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50',
		className,
		labelOnly ? 'pl-8 pr-2' : ''
	)}
	{...$$restProps}
	on:click
	on:keydown
	on:focusin
	on:focusout
	on:pointerleave
	on:pointermove
>
	{#if labelOnly}
		<span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
			<SelectPrimitive.ItemIndicator>
				<Check class="h-4 w-4" />
			</SelectPrimitive.ItemIndicator>
		</span>
	{/if}
	<slot>
		{label ? label : value}
	</slot>
</SelectPrimitive.Item>
