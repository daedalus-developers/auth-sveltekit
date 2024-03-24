<script lang="ts">
	import type { OtpProvider, TwoFactorMethods } from '@types';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { Button } from '@components/ui/button';
	import { KeySquare, MailCheck, RectangleEllipsis, Smartphone } from 'lucide-svelte';
	import { replaceState } from '$app/navigation';
	import { CountdownTimer } from '@components';

	export let method: TwoFactorMethods;
	export let provider: OtpProvider;

	let duration = new Date(Date.now() + 5 * 60 * 500);
	let remainingTime = 0;

	$: showTimer = remainingTime > 0;

	$: disableSendOTP = false;
</script>

{#if $page.data.user}
	<div class="border border-muted bg-secondary bg-opacity-50 p-1 text-center">
		<p>
			Signed in as
			<span class="font-semibold underline underline-offset-2">{$page.data.user?.email} </span>
		</p>
	</div>
{/if}

<div class="flex justify-center gap-y-1 text-center">
	{#if method === 'otp'}
		<div class="flex flex-col">
			{#if provider === 'email'}
				<div class="flex justify-center">
					<p class="twoFactorInfo">Check email for code</p>
					<MailCheck class="twoFactorIcon" />
				</div>
				<div class="flex items-center gap-x-1 text-sm">
					{#if showTimer}
						New Code expires in
						<CountdownTimer {duration} bind:remainingTime />
					{:else if disableSendOTP}
						<p class="py-2 text-destructive">
							You have sent too many invalid OTPs, Try again in 15mins.
						</p>
					{:else}
						Expired Code or No OTP Yet?
						<form
							method="POST"
							action="?/sendOTP"
							use:enhance={() => {
								return ({ result }) => {
									if (result.type === 'success') {
										replaceState('', {
											showMfa: true
										});
										showTimer = true;
									} else {
										replaceState('', {
											showMfa: true
										});
										disableSendOTP = true;
									}
								};
							}}
						>
							<Button
								variant="ghost"
								type="submit"
								disabled={disableSendOTP}
								size="sm"
								class="-p-1 px-2 underline underline-offset-2"
							>
								Send new OTP
							</Button>
						</form>
					{/if}
				</div>
			{:else}
				<div class="flex justify-center">
					<p class="twoFactorInfo">Check SMS for code</p>
					<Smartphone class="twoFactorIcon" />
				</div>
				<p class="text-sm">
					Expired Code?
					<Button variant="ghost" size="sm" class="-p-1 underline underline-offset-2">
						Send new OTP
					</Button>
				</p>
			{/if}
		</div>
	{:else if method === 'password'}
		<div class="flex justify-center">
			<p class="twoFactorInfo">Enter your password</p>
			<RectangleEllipsis class="twoFactorIcon" />
		</div>
	{:else}
		<p class="twoFactorInfo">Authentication Code</p>
		<KeySquare class="twoFactorIcon inline-block" />
	{/if}
</div>

<style lang="postcss">
	:global(.twoFactorIcon) {
		@apply ml-2 h-6 w-6 text-muted-foreground;
	}
	:global(.twoFactorInfo) {
		@apply text-center font-semibold tracking-tight transition-colors;
	}
</style>
