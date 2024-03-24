<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import * as AlertDialog from '@components/ui/alert-dialog';
	import { Button } from '@components/ui/button';
	import { toast } from 'svelte-sonner';

	// TODO: REFACTOR this into dynamically pushing inputs

	export let open = false;

	export let dispatch: () => void = () => {};

	export let action: string;

	export let title: string = 'You are about to do something irreversible';
</script>

<AlertDialog.Root bind:open closeOnOutsideClick={true}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>{title}</AlertDialog.Title>
			<AlertDialog.Description>
				<slot />
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action asChild>
				<form
					method="POST"
					{action}
					use:enhance={() => {
						return async ({ result }) => {
							switch (result.type) {
								case 'success':
									result.data && toast.success(String(result.data.message));
									dispatch();
									await invalidateAll();
									await applyAction(result);
									open = false;
									break;
								case 'failure':
									result.data && toast.warning(String(result.data.message));
									open = false;
									break;
								case 'error':
									result.error && toast.error(String(result.error.message));
									open = false;
									break;
								default:
									toast.message('Something went wrong');
							}
						};
					}}
				>
					<slot name="form" />
					<Button type="submit" class="w-full" variant="destructive">Confirm</Button>
				</form>
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
