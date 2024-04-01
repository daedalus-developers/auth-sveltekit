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
<div class="space-y-4 px-2">
	<div class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
		<TopCard />
		<TopCard />
		<TopCard />
	</div>
	<div class="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
		<BodyCard />
		<BodyCard />
	</div>
</div>
