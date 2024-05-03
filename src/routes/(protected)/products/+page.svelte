<script lang="ts">
	import { Button } from '@components/ui/button';
	import { TabsContent, Tabs, TabsList, TabsTrigger } from '@components/ui/tabs';
	import {
		DropdownMenu,
		DropdownMenuCheckboxItem,
		DropdownMenuContent,
		DropdownMenuLabel,
		DropdownMenuSeparator,
		DropdownMenuTrigger
	} from '@components/ui/dropdown-menu';
	import View from 'lucide-svelte/icons/view';
	import CirclePlus from 'lucide-svelte/icons/circle-plus';
	import ProductTable from './product-table.svelte';
	import type { PageServerData } from './$types';
	import { capitalize } from '@utils';
	import { PRODUCT_STATUS } from '$lib/constants';
	import { queryParam, ssp } from 'sveltekit-search-params';

	const statusFilterParam = queryParam('status', ssp.string('all'), {
		showDefaults: false
	});

	const VIEW_PARAMS = ['tabular', 'cards'] as const;

	const viewParam = queryParam('view', ssp.string('tabular'), {
		showDefaults: false
	});

	export let data: PageServerData;
</script>

<Tabs
	value="all"
	onValueChange={(value) => {
		$statusFilterParam = value ?? 'all';
	}}
>
	<div class="flex items-center">
		<TabsList>
			<TabsTrigger value="all">All</TabsTrigger>
			{#each PRODUCT_STATUS as status}
				<TabsTrigger value={status}>{capitalize(status)}</TabsTrigger>
			{/each}
		</TabsList>
		<div class="ml-auto flex items-center gap-2">
			<DropdownMenu>
				<DropdownMenuTrigger asChild let:builder>
					<Button builders={[builder]} variant="outline" size="sm" class="h-7 gap-1">
						<View class="h-3.5 w-3.5" />
						<span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> View </span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>View</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{#each VIEW_PARAMS as view}
						<DropdownMenuCheckboxItem
							checked={$viewParam === view}
							on:click={() => ($viewParam = view)}>{capitalize(view)}</DropdownMenuCheckboxItem
						>
					{/each}
				</DropdownMenuContent>
			</DropdownMenu>
			<Button size="sm" class="h-7 gap-1" href="/products/new">
				<CirclePlus class="h-3.5 w-3.5" />
				<span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> Add Product </span>
			</Button>
		</div>
	</div>
	<TabsContent value={$statusFilterParam ?? 'all'}>
		<ProductTable products={data.products} />
	</TabsContent>
</Tabs>
