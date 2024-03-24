<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';
	import { cn, lgScreen } from '@utils';

	import { toggleMode, mode } from 'mode-watcher';

	export let iconOnly = false;
</script>

<Button
	on:click={toggleMode}
	variant="outline"
	class="flex w-full justify-between border-transparent px-2 font-normal"
	size={iconOnly ? 'icon' : 'default'}
>
	<span class={cn(iconOnly ? 'sr-only' : '')}>Toggle theme</span>
	<span class={cn('ml-auto', !$lgScreen ? 'text-muted-foreground' : '')}>
		{#if $mode === 'light'}
			<Sun class="h-[1.2rem] w-[1.2rem] transition-all" />
		{:else}
			<Moon class="h-[1.2rem] w-[1.2rem] transition-all" />
		{/if}
	</span>
</Button>
