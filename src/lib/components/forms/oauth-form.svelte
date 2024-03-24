<script lang="ts">
	import Google from '@components/icons/google.svelte';
	import Github from '@components/icons/github.svelte';
	import { Button } from '@components/ui/button';
	import { goto } from '$app/navigation';
	import { LoaderCircle } from 'lucide-svelte';

	let loading = false;

	const handleClick = (href: string) => {
		loading = true;
		goto(href);
	};
</script>

<div class="flex w-full flex-col gap-y-2 py-2 text-center">
	<div class="relative">
		<div class="absolute inset-0 flex items-center">
			<span class="w-full border-t" />
		</div>
		<div class="relative flex justify-center text-sm uppercase tracking-wider">
			<span class="bg-background px-2"> Or continue with </span>
		</div>
	</div>
	{#if loading}
		<LoaderCircle class="mx-auto h-10 w-10 animate-spin" />
	{:else}
		<Button class="w-full" on:click={() => handleClick('/auth/google')}>
			<Google class="mr-2 h-4 w-4" />
			Google
		</Button>
		<Button class="w-full" on:click={() => handleClick('/auth/github')}>
			<Github class="mr-2 h-4 w-4" />
			Github
		</Button>
	{/if}
</div>
