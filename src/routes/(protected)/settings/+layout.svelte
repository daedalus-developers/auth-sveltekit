<script lang="ts">
	import Sidebar from './sidebar.svelte';
	import { ArrowLeft } from 'lucide-svelte';
	import { Button } from '@components/ui/button';
	import { Separator } from '@components/ui/separator';
	import { cn, lgScreen } from '@utils';
	import { page } from '$app/stores';
</script>

<div class={cn('flex flex-col py-2', $lgScreen ? 'container' : 'mx-4')}>
	<div class="flex w-full flex-col">
		<div class="space-y-0.5">
			<h2 class="scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
				Hey, {$page.data.user.email}
			</h2>
			<p class="text-muted-foreground">Manage account related settings here</p>
		</div>
		<Separator class="my-4" />
	</div>
	<div class="flex">
		{#if $lgScreen}
			<div class="flex w-[25%]">
				<Sidebar />
			</div>
		{/if}
		<div class={cn('flex w-full flex-col space-y-4', $lgScreen && 'container')}>
			{#if !$lgScreen && $page.url.pathname !== '/settings'}
				<Button variant="link" class="-ml-4 justify-start text-lg" href="/settings">
					<ArrowLeft /> Go Back
				</Button>
			{/if}
			<slot />
		</div>
	</div>
</div>
