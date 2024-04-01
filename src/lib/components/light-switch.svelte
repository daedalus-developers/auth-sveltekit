<script lang="ts">
	import { Button as ButtonPrimitive } from 'bits-ui';
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';
	import { cn, lgScreen } from '@utils';
	import { buttonVariants, type Props, type Events } from '@components/ui/button';

	type $$Props = Props & {
		iconOnly?: boolean;
	};
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Events = Events;

	let className: $$Props['class'] = undefined;
	export let variant: $$Props['variant'] = 'default';
	export let size: $$Props['size'] = 'default';
	export let builders: $$Props['builders'] = [];
	export { className as class };

	import { toggleMode, mode } from 'mode-watcher';

	export let iconOnly = false;
</script>

<ButtonPrimitive.Root
	{builders}
	class={cn(buttonVariants({ variant, size, className }), 'px-0')}
	type="button"
	{...$$restProps}
	on:click={toggleMode}
	on:keydown
>
	<span class={cn('', iconOnly ? 'sr-only' : '')}>Toggle theme</span>
	<span class={cn('ml-auto mr-4', !$lgScreen ? '' : '')}>
		{#if $mode === 'light'}
			<Sun class="h-[1.2rem] w-[1.2rem] transition-all" />
		{:else}
			<Moon class="h-[1.2rem] w-[1.2rem] transition-all" />
		{/if}
	</span>
</ButtonPrimitive.Root>
