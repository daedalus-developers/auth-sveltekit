<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '@utils';

	export let href: string = '';
</script>

<a
	{href}
	class={cn(
		'text-md  w-full tracking-tight text-muted-foreground transition-colors hover:text-blue-600 hover:underline hover:underline-offset-4',
		$page.url.pathname === href ? 'font-bold text-teal-400' : ''
	)}
>
	<slot />
</a>
