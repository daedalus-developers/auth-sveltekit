<script>
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuGroup,
		DropdownMenuItem,
		DropdownMenuLabel,
		DropdownMenuSeparator,
		DropdownMenuTrigger
	} from '@components/ui/dropdown-menu';
	import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
	import LightSwitch from '@components/light-switch.svelte';
	import LogoutFormDialog from './logout-form-dialog.svelte';
	import { Button } from '@components/ui/button';
	import { protectedNavLinks } from '$lib/constants';
	import { page } from '$app/stores';

	const initials = $page.data?.user?.email?.charAt(0).toUpperCase() ?? 'U';
	let showLogoutDialog = false;
</script>

<LogoutFormDialog bind:open={showLogoutDialog} />
<DropdownMenu>
	<DropdownMenuTrigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} class="relative h-8 w-8 rounded-full">
			<Avatar>
				<AvatarImage src={$page.data.user.avatar ?? ''} alt="@shadcn" />
				<AvatarFallback>{initials}</AvatarFallback>
			</Avatar>
			<span class="sr-only">Toggle user menu</span>
		</Button>
	</DropdownMenuTrigger>
	<DropdownMenuContent class="w-56" align="end">
		<DropdownMenuLabel class="font-normal">
			<div class="flex flex-col space-y-1">
				<p class="text-sm font-medium leading-none">
					{$page.data?.user?.name ?? $page.data?.user?.email}
				</p>
				<p class="text-xs leading-none text-muted-foreground">{$page.data?.user?.email}</p>
			</div>
		</DropdownMenuLabel>
		<DropdownMenuSeparator />
		<DropdownMenuGroup>
			{#each protectedNavLinks as { href, label }}
				<DropdownMenuItem class="py-0">
					<Button
						variant="ghost"
						{href}
						class="m-0 flex w-full justify-start p-0 text-sm text-muted-foreground hover:bg-transparent hover:text-foreground"
					>
						{label}
					</Button>
				</DropdownMenuItem>
			{/each}
		</DropdownMenuGroup>
		<DropdownMenuSeparator />

		<DropdownMenuGroup>
			<DropdownMenuItem class="py-0">
				<LightSwitch
					variant="ghost"
					class="flex w-full text-xs font-normal text-muted-foreground hover:bg-transparent hover:text-foreground"
				/>
			</DropdownMenuItem>
			<DropdownMenuItem class="py-0">
				<Button
					on:click={() => {
						showLogoutDialog = true;
					}}
					variant="ghost"
					class="m-0 flex w-full justify-start p-0 text-sm text-muted-foreground hover:bg-transparent hover:text-foreground"
				>
					Logout
				</Button>
			</DropdownMenuItem>
		</DropdownMenuGroup>
	</DropdownMenuContent>
</DropdownMenu>
