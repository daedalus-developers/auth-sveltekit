<script lang="ts">
	import {
		AlertDialog,
		AlertDialogAction,
		AlertDialogCancel,
		AlertDialogContent,
		AlertDialogDescription,
		AlertDialogFooter,
		AlertDialogHeader,
		AlertDialogTitle
	} from '@components/ui/alert-dialog';
	import { enhance } from '$app/forms';
	import { Button } from '@components/ui/button';

	export let open = false;
</script>

<AlertDialog bind:open closeOnOutsideClick={true}>
	<AlertDialogContent>
		<AlertDialogHeader>
			<AlertDialogTitle>You are about to sign out</AlertDialogTitle>
			<AlertDialogDescription>
				This action removes your session into this device.
			</AlertDialogDescription>
		</AlertDialogHeader>
		<AlertDialogFooter>
			<AlertDialogCancel>Cancel</AlertDialogCancel>
			<AlertDialogAction asChild>
				<form method="POST" action="/auth/?/signout" use:enhance>
					<Button type="submit" class="w-full" variant="destructive">Confirm</Button>
				</form>
			</AlertDialogAction>
		</AlertDialogFooter>
	</AlertDialogContent>
</AlertDialog>
