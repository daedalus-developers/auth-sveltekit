<script lang="ts">
	import { cn } from '@utils/ui';
	import type { PageServerData } from './$types';
	import { formatDistanceToNow } from 'date-fns';
	import { page } from '$app/stores';

	export let data: PageServerData;
</script>

<div class="flex flex-col space-y-3.5">
	<h2 class="text-lg">Sessions</h2>
	{#await data.userSessions then sessions}
		{#each sessions as session}
			<div
				class={cn(
					'flex items-center justify-between space-x-3.5 p-3 py-4',
					session.id === $page.data.currentSession?.id ? 'border border-green-700' : 'border'
				)}
			>
				<div class="flex space-x-3.5">
					<p>{session.id}</p>
				</div>
				<div class="flex space-x-3.5">
					<p>Expires {formatDistanceToNow(session.expiresAt, { addSuffix: true })}</p>
				</div>
			</div>
		{/each}
	{/await}
</div>
