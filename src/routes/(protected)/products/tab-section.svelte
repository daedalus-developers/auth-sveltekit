<script lang="ts">
	import {
		Card,
		CardTitle,
		CardDescription,
		CardHeader,
		CardContent,
		CardFooter
	} from '@components/ui/card';
	import {
		Table,
		TableBody,
		TableHead,
		TableRow,
		TableCell,
		TableHeader
	} from '@components/ui/table';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuLabel,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from '@components/ui/dropdown-menu';
	import { Button } from '@components/ui/button';
	import { Badge } from '@components/ui/badge';
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
</script>

<Card>
	<CardHeader>
		<CardTitle>Products</CardTitle>
		<CardDescription>Manage your products and view their sales performance.</CardDescription>
	</CardHeader>
	<CardContent>
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead class="hidden w-[100px] sm:table-cell">
						<span class="sr-only">Image</span>
					</TableHead>
					<TableHead>Name</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Price</TableHead>
					<TableHead class="hidden md:table-cell">Total Sales</TableHead>
					<TableHead class="hidden md:table-cell">Created at</TableHead>
					<TableHead>
						<span class="sr-only">Actions</span>
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow>
					<TableCell class="hidden sm:table-cell">
						<img
							alt="alt"
							class="aspect-square rounded-md object-cover"
							height="64"
							src="/images/placeholder.svg"
							width="64"
						/>
					</TableCell>
					<TableCell class="font-medium">Laser Lemonade Machine</TableCell>
					<TableCell>
						<Badge variant="outline">Draft</Badge>
					</TableCell>
					<TableCell>$499.99</TableCell>
					<TableCell class="hidden md:table-cell">25</TableCell>
					<TableCell class="hidden md:table-cell">2023-07-12 10:42 AM</TableCell>
					<TableCell>
						<DropdownMenu>
							<DropdownMenuTrigger asChild let:builder>
								<Button aria-haspopup="true" size="icon" variant="ghost" builders={[builder]}>
									<Ellipsis class="h-4 w-4" />
									<span class="sr-only">Toggle menu</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>Actions</DropdownMenuLabel>
								<DropdownMenuItem>Edit</DropdownMenuItem>
								<DropdownMenuItem>Delete</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	</CardContent>
	<CardFooter>
		<div class="text-xs text-muted-foreground">
			Showing <strong>1-10</strong> of <strong>32</strong> products
		</div>
	</CardFooter>
</Card>
