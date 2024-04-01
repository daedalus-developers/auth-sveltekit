<script lang="ts">
	import { Card, CardTitle, CardDescription, CardHeader, CardContent } from '@components/ui/card';
	import {
		Table,
		TableBody,
		TableHead,
		TableRow,
		TableCell,
		TableHeader
	} from '@components/ui/table';
	import { Button } from '@components/ui/button';
	import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';
	import { Badge } from '@components/ui/badge';
</script>

<Card class="xl:col-span-2">
	<CardHeader class="flex flex-row items-center">
		<div class="grid gap-2">
			<CardTitle>Transactions</CardTitle>
			<CardDescription>Recent transactions from your store.</CardDescription>
		</div>
		<Button href="##" size="sm" class="ml-auto gap-1">
			View All
			<ArrowUpRight class="h-4 w-4" />
		</Button>
	</CardHeader>
	<CardContent>
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Customer</TableHead>
					<TableHead class="xl:table.-column hidden">Type</TableHead>
					<TableHead class="xl:table.-column hidden">Status</TableHead>
					<TableHead class="xl:table.-column hidden">Date</TableHead>
					<TableHead class="text-right">Amount</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow>
					<TableCell>
						<div class="font-medium">Liam Johnson</div>
						<div class="hidden text-sm text-muted-foreground md:inline">liam@example.com</div>
					</TableCell>
					<TableCell class="xl:table.-column hidden">Sale</TableCell>
					<TableCell class="xl:table.-column hidden">
						<Badge class="text-xs" variant="outline">Approved</Badge>
					</TableCell>
					<TableCell class="md:table.-cell xl:table.-column hidden lg:hidden">2023-06-23</TableCell>
					<TableCell class="text-right">$250.00</TableCell>
				</TableRow>
				<TableRow>
					<TableCell>
						<div class="font-medium">Olivia Smith</div>
						<div class="hidden text-sm text-muted-foreground md:inline">olivia@example.com</div>
					</TableCell>
					<TableCell class="xl:table.-column hidden">Refund</TableCell>
					<TableCell class="xl:table.-column hidden">
						<Badge class="text-xs" variant="outline">Declined</Badge>
					</TableCell>
					<TableCell class="md:table.-cell xl:table.-column hidden lg:hidden">2023-06-24</TableCell>
					<TableCell class="text-right">$150.00</TableCell>
				</TableRow>
				<TableRow>
					<TableCell>
						<div class="font-medium">Noah Williams</div>
						<div class="hidden text-sm text-muted-foreground md:inline">noah@example.com</div>
					</TableCell>
					<TableCell class="xl:table.-column hidden">Subscription</TableCell>
					<TableCell class="xl:table.-column hidden">
						<Badge class="text-xs" variant="outline">Approved</Badge>
					</TableCell>
					<TableCell class="md:table.-cell xl:table.-column hidden lg:hidden">2023-06-25</TableCell>
					<TableCell class="text-right">$350.00</TableCell>
				</TableRow>
				<TableRow>
					<TableCell>
						<div class="font-medium">Emma Brown</div>
						<div class="hidden text-sm text-muted-foreground md:inline">emma@example.com</div>
					</TableCell>
					<TableCell class="xl:table.-column hidden">Sale</TableCell>
					<TableCell class="xl:table.-column hidden">
						<Badge class="text-xs" variant="outline">Approved</Badge>
					</TableCell>
					<TableCell class="md:table.-cell xl:table.-column hidden lg:hidden">2023-06-26</TableCell>
					<TableCell class="text-right">$450.00</TableCell>
				</TableRow>
				<TableRow>
					<TableCell>
						<div class="font-medium">Liam Johnson</div>
						<div class="hidden text-sm text-muted-foreground md:inline">liam@example.com</div>
					</TableCell>
					<TableCell class="xl:table.-column hidden">Sale</TableCell>
					<TableCell class="xl:table.-column hidden">
						<Badge class="text-xs" variant="outline">Approved</Badge>
					</TableCell>
					<TableCell class="md:table.-cell xl:table.-column hidden lg:hidden">2023-06-27</TableCell>
					<TableCell class="text-right">$550.00</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	</CardContent>
</Card>
