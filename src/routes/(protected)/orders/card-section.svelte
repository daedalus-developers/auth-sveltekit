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
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuSeparator,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from '@components/ui/dropdown-menu';
	import { Pagination, PaginationContent, PaginationItem } from '@components/ui/pagination';
	import { Button } from '@components/ui/button';
	import {
		Copy,
		Truck,
		EllipsisVertical,
		ChevronRight,
		ChevronLeft,
		CreditCard
	} from 'lucide-svelte';
	import { Separator } from '@components/ui/separator';
</script>

<Card class="overflow-hidden">
	<CardHeader class="flex flex-row items-start bg-muted/50">
		<div class="grid gap-0.5">
			<CardTitle class="group flex items-center gap-2 text-lg">
				Order ID: Oe31b70H
				<Button
					size="icon"
					variant="outline"
					class="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
				>
					<Copy class="h-3 w-3" />
					<span class="sr-only">Copy Order ID</span>
				</Button>
			</CardTitle>
			<CardDescription>Date: November 23, 2023</CardDescription>
		</div>
		<div class="ml-auto flex items-center gap-1">
			<Button size="sm" variant="outline" class="h-8 gap-1">
				<Truck class="h-3.5 w-3.5" />
				<span class="lg:sr-only xl:not-sr-only xl:whitespace-nowrap"> Track Order </span>
			</Button>
			<DropdownMenu>
				<DropdownMenuTrigger asChild let:builder>
					<Button builders={[builder]} size="icon" variant="outline" class="h-8 w-8">
						<EllipsisVertical class="h-3.5 w-3.5" />
						<span class="sr-only">More</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem>Edit</DropdownMenuItem>
					<DropdownMenuItem>Export</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem>Trash</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	</CardHeader>
	<CardContent class="p-6 text-sm">
		<div class="grid gap-3">
			<div class="font-semibold">Order Details</div>
			<ul class="grid gap-3">
				<li class="flex items-center justify-between">
					<span class="text-muted-foreground">
						Glimmer Lamps x <span>2</span>
					</span>
					<span>$250.00</span>
				</li>
				<li class="flex items-center justify-between">
					<span class="text-muted-foreground">
						Aqua Filters x <span>1</span>
					</span>
					<span>$49.00</span>
				</li>
			</ul>
			<Separator class="my-2" />
			<ul class="grid gap-3">
				<li class="flex items-center justify-between">
					<span class="text-muted-foreground">Subtotal</span>
					<span>$299.00</span>
				</li>
				<li class="flex items-center justify-between">
					<span class="text-muted-foreground">Shipping</span>
					<span>$5.00</span>
				</li>
				<li class="flex items-center justify-between">
					<span class="text-muted-foreground">Tax</span>
					<span>$25.00</span>
				</li>
				<li class="flex items-center justify-between font-semibold">
					<span class="text-muted-foreground">Total</span>
					<span>$329.00</span>
				</li>
			</ul>
		</div>
		<Separator class="my-4" />
		<div class="grid grid-cols-2 gap-4">
			<div class="grid gap-3">
				<div class="font-semibold">Shipping Information</div>
				<address class="grid gap-0.5 not-italic text-muted-foreground">
					<span>Liam Johnson</span>
					<span>1234 Main St.</span>
					<span>Anytown, CA 12345</span>
				</address>
			</div>
			<div class="grid auto-rows-max gap-3">
				<div class="font-semibold">Billing Information</div>
				<div class="text-muted-foreground">Same as shipping address</div>
			</div>
		</div>
		<Separator class="my-4" />
		<div class="grid gap-3">
			<div class="font-semibold">Customer Information</div>
			<dl class="grid gap-3">
				<div class="flex items-center justify-between">
					<dt class="text-muted-foreground">Customer</dt>
					<dd>Liam Johnson</dd>
				</div>
				<div class="flex items-center justify-between">
					<dt class="text-muted-foreground">Email</dt>
					<dd>
						<a href="mailto:">liam@acme.com</a>
					</dd>
				</div>
				<div class="flex items-center justify-between">
					<dt class="text-muted-foreground">Phone</dt>
					<dd>
						<a href="tel:">+1 234 567 890</a>
					</dd>
				</div>
			</dl>
		</div>
		<Separator class="my-4" />
		<div class="grid gap-3">
			<div class="font-semibold">Payment Information</div>
			<dl class="grid gap-3">
				<div class="flex items-center justify-between">
					<dt class="flex items-center gap-1 text-muted-foreground">
						<CreditCard class="h-4 w-4" />
						Visa
					</dt>
					<dd>**** **** **** 4532</dd>
				</div>
			</dl>
		</div>
	</CardContent>
	<CardFooter class="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
		<div class="text-xs text-muted-foreground">
			Updated <time dateTime="2023-11-23">November 23, 2023</time>
		</div>
		<Pagination count={10} class="ml-auto mr-0 w-auto">
			<PaginationContent>
				<PaginationItem>
					<Button size="icon" variant="outline" class="h-6 w-6">
						<ChevronLeft class="h-3.5 w-3.5" />
						<span class="sr-only">Previous Order</span>
					</Button>
				</PaginationItem>
				<PaginationItem>
					<Button size="icon" variant="outline" class="h-6 w-6">
						<ChevronRight class="h-3.5 w-3.5" />
						<span class="sr-only">Next Order</span>
					</Button>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	</CardFooter>
</Card>
