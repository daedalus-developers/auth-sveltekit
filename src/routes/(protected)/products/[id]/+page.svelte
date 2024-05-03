<script lang="ts">
	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>

{#await data.product}
	Loading...
{:then product}
	<pre>
  {JSON.stringify(product)}
  </pre>
{/await}
