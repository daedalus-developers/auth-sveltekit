<script lang="ts">
	import { OAUTH_PROVIDERS, type OAuthProviderWithIcon, type OAuthProviders } from '@types';
	import Provider from './provider.svelte';
	import { Separator } from '@components/ui/separator';
	import * as AlertDialog from '@components/ui/alert-dialog';
	import { Button } from '@components/ui/button';
	import { capitalize } from '@utils';
	import { superForm } from 'sveltekit-superforms';
	import { toast } from 'svelte-sonner';
	import { page, navigating } from '$app/stores';
	import { goto, invalidateAll } from '$app/navigation';

	import { LoaderCircle } from 'lucide-svelte';

	let providers: Array<OAuthProviderWithIcon> = [...OAUTH_PROVIDERS.map((provider) => provider)];

	let open = false;
	let action: 'link' | 'unlink' = 'link';
	let dialogTitle: string = '';
	let dialogDescription: string = '';

	const form = superForm($page.data.form, {
		async onUpdated({ form }) {
			if (form.message) {
				switch (form.message.type) {
					case 'success':
						{
							open = false;
							toast.success(form.message.text);
							await invalidateAll();
						}
						break;
					case 'error':
						{
							open = false;
							toast.error(form.message.text);
							await invalidateAll();
						}
						break;
				}
			}
		},
		resetForm: false
	});

	const { form: fields, enhance, delayed } = form;

	const handleAction = (a: typeof action, provider: string) => {
		action = a;
		open = true;
		$fields.userId = $page.data.user.id;
		$fields.provider = provider as OAuthProviders;
		if (action === 'link') {
			dialogTitle = `You are about to be redirected to ${capitalize(provider)}'s OAuth page`;
			dialogDescription = `This does not removes your session if something goes wrong, Please make sure your email is verified on ${capitalize(provider)}'s.`;
		} else {
			dialogTitle = `Are you sure you want to unlink your account to ${capitalize(provider)}'s `;
			dialogDescription = `This will not delete your account. You can re-link it on this page.`;
		}
	};

	$: {
		providers = providers.map((provider) => {
			const userProvider = $page.data.oAuthAccounts.find(
				(userProvider: { provider: string }) => userProvider.provider === provider.name
			);
			return {
				...provider,
				providerAccountId: userProvider?.providerAccountId,
				userId: userProvider?.userId
			};
		});
	}
</script>

<div class="flex flex-col gap-y-4">
	<h3 class="pt-4 text-2xl">Connected Social Accounts</h3>
	<Separator class="w-[100%]" />
	<div class="flex flex-col gap-y-4">
		{#each providers as provider, index (index)}
			{#if provider.userId}
				<Provider
					{provider}
					dispatch={() => {
						handleAction('unlink', provider.name);
					}}
				/>
			{:else}
				<Provider
					{provider}
					dispatch={() => {
						handleAction('link', provider.name);
					}}
				/>
			{/if}
		{/each}
	</div>
</div>

<AlertDialog.Root bind:open closeOnOutsideClick={true}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>{dialogTitle}</AlertDialog.Title>
			<AlertDialog.Description>
				{dialogDescription}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action asChild>
				{#if $delayed || $navigating}
					<LoaderCircle class="h-10 w-10 animate-spin" />
				{:else if action === 'unlink'}
					<form method="POST" action={`?/${action}`} use:enhance>
						<input class="hidden" name="userId" bind:value={$fields.userId} />
						<input class="hidden" name="provider" bind:value={$fields.provider} />
						<Button type="submit" class="w-full" variant="destructive">Confirm</Button>
					</form>
				{:else}
					<Button
						on:click={() => {
							goto(`/oauth/${$fields.provider}/verify`);
						}}>Continue</Button
					>
				{/if}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
