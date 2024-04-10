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
	import type { PageServerData } from './$types';
	import { formatRelative } from 'date-fns';
	import { unslugifyString } from '@utils';
	type ProductsData = PageServerData['products'];

	export let products: ProductsData;

	type Products = Awaited<ProductsData>;

	const getPriceRange = (variants: Products[0]['variants']) => {
		if (variants.length === 0) return 'N/A';

		if (variants.length === 1) return `${variants[0].price}`;

		const prices = variants.map((data) => data.price) as [];

		return `${Math.min(...prices)} - ${Math.max(...prices)}`;
	};
</script>

<Card>
	<CardHeader>
		<CardTitle>Products</CardTitle>
		<CardDescription>Manage your products and view their sales performance.</CardDescription>
	</CardHeader>
	{#await products}
		Loading Products...
	{:then products}
		<CardContent>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Price</TableHead>
						<TableHead class="hidden md:table-cell">Category</TableHead>
						<TableHead class="hidden md:table-cell">Total Sales</TableHead>
						<TableHead class="hidden md:table-cell">Created</TableHead>
						<TableHead>
							<span class="sr-only">Actions</span>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{#each products as product}
						{@const price = getPriceRange(product.variants)}
						<TableRow>
							<TableCell class="font-medium">{product.name}</TableCell>
							<TableCell>
								<Badge variant="outline">{product.status}</Badge>
							</TableCell>
							<TableCell>$ {price}</TableCell>
							<TableCell class="hidden md:table-cell">{unslugifyString(product.category)}</TableCell
							>
							<TableCell class="hidden md:table-cell">0</TableCell>
							<TableCell class="hidden md:table-cell">
								{formatRelative(product.createdAt, new Date())}
							</TableCell>
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
					{/each}
				</TableBody>
			</Table>
		</CardContent>
		<CardFooter>
			<div class="text-xs text-muted-foreground">
				<!-- Showing <strong>1-10</strong> of <strong>{products.length}</strong> products -->
				Toal of <strong>{products.length}</strong> products
			</div>
		</CardFooter>
	{/await}
</Card>
