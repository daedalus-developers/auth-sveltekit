<script lang="ts">
	import { cn } from '@utils/ui';
	import type { PageServerData } from './$types';
	import { page } from '$app/stores';
	import { formatUserAgent } from '@utils';

	// TODO: Integrate leaflet.js
	// https://leafletjs.com/reference.html

	export let data: PageServerData;
</script>

<div class="flex flex-col space-y-3.5">
	<h2 class="text-lg">Sessions</h2>
	{#await data.sessions}
		Loading ....
	{:then sessions}
		{#each sessions as session}
			{@const userSession = session.session}
			{@const sessionDetails = session.session_details}
			{#if sessionDetails}
				<div
					class={cn(
						'flex items-center justify-between space-x-3.5 rounded-lg p-3 py-4',
						userSession.id === $page.data.currentSession?.id ? 'border border-green-400' : 'border'
					)}
				>
					<div class="flex space-x-3.5">
						<p>{formatUserAgent(sessionDetails.userAgent)}</p>
						<p>{sessionDetails.city},{sessionDetails.stateProvince} - {sessionDetails.country}</p>
					</div>
					<div class="flex space-x-3.5">
						<p>{sessionDetails.ipAddress}</p>
					</div>
				</div>
			{/if}
		{/each}
	{/await}
</div>
