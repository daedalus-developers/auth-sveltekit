<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { replaceState } from '$app/navigation';
	import { Button } from './ui/button';
	import { toast } from 'svelte-sonner';

	export let dispatch: () => void = () => {};
	export let disabled = false;
	export let variant: 'ghost' | 'secondary' = 'secondary';
	export let action = '?/totpSetup';
</script>

<form
	method="POST"
	class="w-full"
	{action}
	use:enhance={() => {
		return async ({ result }) => {
			switch (result.type) {
				case 'success':
					if (result.data?.requireSudo) {
						replaceState('', {
							requireSudo: true,
							showMfa: true
						});
					} else {
						await applyAction(result);
						dispatch();
					}
					break;
				case 'failure':
					if (result.data) toast.error(String(result.data.message));
					break;
			}
		};
	}}
>
	<Button type="submit" {variant} class="w-full" size="sm" {disabled}>
		<slot />
	</Button>
</form>
