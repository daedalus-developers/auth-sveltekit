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
	import {
		Card,
		CardTitle,
		CardHeader,
		CardContent,
		CardDescription,
		CardFooter
	} from '@components/ui/card';
	import ListFilter from 'lucide-svelte/icons/list-filter';
	import File from 'lucide-svelte/icons/file';
	import TabSection from './tab-section.svelte';
	import CardSection from './card-section.svelte';
</script>

<div class="grid w-full gap-4 overflow-x-auto p-4 md:gap-8 md:px-6 lg:grid-cols-3 xl:grid-cols-3">
	<div class="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
		<div class="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
			<Card class="sm:col-span-2">
				<CardHeader class="pb-3">
					<CardTitle class="text-sm font-medium">Your Orders</CardTitle>
					<CardDescription class="max-w-lg text-balance leading-relaxed">
						Introducing Our Dynamic Orders Dashboard for Seamless Management and Insightful
						Analysis.
					</CardDescription>
				</CardHeader>
				<CardFooter>
					<Button>Create New Order</Button>
				</CardFooter>
			</Card>

			<Card>
				<CardHeader class="pb-2">
					<CardDescription>This week</CardDescription>
					<CardTitle class="text-4xl">$1329</CardTitle>
				</CardHeader>
				<CardContent>
					<div class="text-xs text-muted-foreground">+25% from last week</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader class="pb-2">
					<CardDescription>This month</CardDescription>
					<CardTitle class="text-4xl">$1329</CardTitle>
				</CardHeader>
				<CardContent>
					<div class="text-xs text-muted-foreground">+25% from last month</div>
				</CardContent>
			</Card>
		</div>
		<Tabs value="week">
			<div class="flex items-center">
				<TabsList>
					<TabsTrigger value="week">Week</TabsTrigger>
					<TabsTrigger value="month">Month</TabsTrigger>
					<TabsTrigger value="year">Year</TabsTrigger>
				</TabsList>
				<div class="ml-auto flex items-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild let:builder>
							<Button variant="outline" size="sm" class="h-7 gap-1 text-sm" builders={[builder]}>
								<ListFilter class="h-3.5 w-3.5" />
								<span class="sr-only sm:not-sr-only">Filter</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Filter by</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuCheckboxItem checked>Fulfilled</DropdownMenuCheckboxItem>
							<DropdownMenuCheckboxItem>Declined</DropdownMenuCheckboxItem>
							<DropdownMenuCheckboxItem>Refunded</DropdownMenuCheckboxItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<Button size="sm" variant="outline" class="h-7 gap-1 text-sm">
						<File class="h-3.5 w-3.5" />
						<span class="sr-only sm:not-sr-only">Export</span>
					</Button>
				</div>
			</div>
			<TabsContent value="week">
				<TabSection />
			</TabsContent>
		</Tabs>
	</div>
	<div>
		<CardSection />
	</div>
</div>
