<script lang="ts">
	import { Separator } from '@components/ui/separator';
	import ChangePasswordForm from './change-password-form.svelte';
	import TwoFactorSection from './two-factor-section.svelte';
</script>

<div class="flex flex-col gap-y-8">
	<div>
		<h2
			class="mt-10 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
		>
			Change Password
		</h2>
		<Separator />
		<div class="my-4 flex w-full items-center justify-center">
			<ChangePasswordForm />
		</div>
	</div>
	<div class="space-y-3.5">
		<h2
			class="mt-10 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
		>
			Two-factor authentication
		</h2>
		<Separator />
		<TwoFactorSection />
	</div>

	<div>
		<h2
			class="mt-10 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
		>
			Passkeys
		</h2>
		<Separator />
		<div class="my-4">wip</div>
	</div>
</div>
