<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '@utils/ui.js';

	type $$Props = HTMLAttributes<HTMLLIElement>;
	let className: $$Props['class'] = undefined;

	export { className as class };
</script>

<li class={cn('', className)} {...$$restProps}>
	<slot />
</li>
