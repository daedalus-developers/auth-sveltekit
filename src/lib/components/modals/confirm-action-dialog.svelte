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
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { Button } from '@components/ui/button';
	import { toast } from 'svelte-sonner';

	// TODO: REFACTOR this into dynamically pushing inputs

	export let open = false;

	export let dispatch: () => void = () => {};

	export let action: string;

	export let title: string = 'You are about to do something irreversible';
</script>

<div class="p-12">
	<AlertDialog bind:open closeOnOutsideClick={true}>
		<AlertDialogContent>
			<AlertDialogHeader>
				<AlertDialogTitle>{title}</AlertDialogTitle>
				<AlertDialogDescription>
					<slot />
				</AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogFooter>
				<AlertDialogCancel>Cancel</AlertDialogCancel>
				<AlertDialogAction asChild>
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
				</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	</AlertDialog>
</div>
