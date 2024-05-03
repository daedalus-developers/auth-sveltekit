<script>
	import { invalidateAll } from '$app/navigation';
	import TopCard from './top-card.svelte';
	import BodyCard from './body-card.svelte';
</script>

<svelte:window
	on:focus={async () => {
		await invalidateAll();
	}}
/>
<div class="space-y-4 overflow-x-auto px-4 py-4 md:px-6">
	<div class="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
		<TopCard />
		<TopCard />
		<TopCard />
	</div>
	<div class="grid gap-4 md:gap-6 lg:grid-cols-2 xl:grid-cols-3">
		<BodyCard />
		<BodyCard />
	</div>
</div>
