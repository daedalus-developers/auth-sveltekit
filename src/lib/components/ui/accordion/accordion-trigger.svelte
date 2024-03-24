<script lang="ts">
	import { Accordion as AccordionPrimitive } from 'bits-ui';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import { cn } from '@utils';

	type $$Props = AccordionPrimitive.TriggerProps & {
		showIcon?: boolean;
	};
	type $$Events = AccordionPrimitive.TriggerEvents;

	let className: $$Props['class'] = undefined;

	export let showIcon: $$Props['showIcon'] = true;

	export let level: AccordionPrimitive.HeaderProps['level'] = 3;
	export { className as class };
</script>

<AccordionPrimitive.Header {level} class="flex">
	<AccordionPrimitive.Trigger
		class={cn(
			'flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
			className
		)}
		{...$$restProps}
		on:click
	>
		<slot />
		{#if showIcon}
			<ChevronDown class="h-4 w-4 transition-transform duration-200" />
		{/if}
	</AccordionPrimitive.Trigger>
</AccordionPrimitive.Header>
