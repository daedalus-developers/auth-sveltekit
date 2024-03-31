<script lang="ts">
	import { enhance } from '$app/forms';
	import * as AlertDialog from '@components/ui/alert-dialog';
	import { Button } from '@components/ui/button';

	export let open = false;
</script>

<AlertDialog.Root bind:open closeOnOutsideClick={true}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>You are about to sign out</AlertDialog.Title>
			<AlertDialog.Description>
				This action removes your session into this device.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action asChild>
				<form method="POST" action="/auth/?/signout" use:enhance>
					<Button type="submit" class="w-full" variant="destructive">Confirm</Button>
				</form>
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
