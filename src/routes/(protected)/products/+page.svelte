<script>
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
	import ListFilter from 'lucide-svelte/icons/list-filter';
	import CirclePlus from 'lucide-svelte/icons/circle-plus';
	import File from 'lucide-svelte/icons/file';
	import TabSection from './tab-section.svelte';
</script>

<Tabs value="all">
	<div class="flex items-center">
		<TabsList>
			<TabsTrigger value="all">All</TabsTrigger>
			<TabsTrigger value="active">Active</TabsTrigger>
			<TabsTrigger value="draft">Draft</TabsTrigger>
			<TabsTrigger value="archived" class="hidden sm:flex">Archived</TabsTrigger>
		</TabsList>
		<div class="ml-auto flex items-center gap-2">
			<DropdownMenu>
				<DropdownMenuTrigger asChild let:builder>
					<Button builders={[builder]} variant="outline" size="sm" class="h-7 gap-1">
						<ListFilter class="h-3.5 w-3.5" />
						<span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> Filter </span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Filter by</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuCheckboxItem checked>Active</DropdownMenuCheckboxItem>
					<DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
					<DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<Button size="sm" variant="outline" class="h-7 gap-1">
				<File class="h-3.5 w-3.5" />
				<span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> Export </span>
			</Button>
			<Button size="sm" class="h-7 gap-1" href="/products/new">
				<CirclePlus class="h-3.5 w-3.5" />
				<span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> Add Product </span>
			</Button>
		</div>
	</div>
	<TabsContent value="all">
		<TabSection />
	</TabsContent>
</Tabs>
