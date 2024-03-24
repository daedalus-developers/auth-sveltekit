<script lang="ts">
	import type { PageServerData } from './$types';

	export let data: PageServerData;
	const { user } = data;
</script>

<div class="flex flex-col items-center justify-center gap-y-4">
	<h1>Welcome back, {user.email}</h1>
</div>
