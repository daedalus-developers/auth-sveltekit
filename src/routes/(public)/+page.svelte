<script>
	import Feature from '@components/feature.svelte';
	import { DotsBackground } from '@components/ui/backgrounds';
	import KeySquare from 'lucide-svelte/icons/key-square';
	import RectangleEllipsis from 'lucide-svelte/icons/rectangle-ellipsis';
	import ShieldEllipsis from 'lucide-svelte/icons/shield-ellipsis';

	import { lgScreen } from '@utils';
</script>

{#if $lgScreen}
	<DotsBackground />
{/if}
<div class="hero-gradient"></div>
<div class="mx-auto flex max-w-7xl flex-col items-center justify-center">
	<div class="mx-auto grid gap-y-6">
		<h1 class="z-50 py-36 text-5xl font-bold md:text-9xl">Auth Kit</h1>
	</div>
	<div class="relative py-4">
		<div class="flex flex-col items-center justify-center">
			<div class="mx-16 grid max-w-7xl gap-x-4 gap-y-6 md:grid-cols-2">
				<Feature title="Username or Email and password">
					<slot slot="icon">
						<RectangleEllipsis />
					</slot>
					Either Use your unique username or email and password to to authenticate.
				</Feature>

				<Feature title="One Time Password">
					<slot slot="icon">
						<KeySquare />
					</slot>
					A 6 digit one time password can be sent to your email to authenticate.
				</Feature>

				<Feature title="Anti Brute Force & Spam">
					<slot slot="icon">
						<ShieldEllipsis />
					</slot>
					Only 5 failed login attempts are allowed every 15 minute, same goes with sending OTP to avoid
					spam.
				</Feature>

				<Feature title="Account Linking">
					Registered through social accounts? No problem, after using this on signup you will be
					asked if you want to login through username or email with password afterwards
				</Feature>

				<Feature title="Multi Factor Authentication">
					Using Authenticator App like bitwarden, google authenticator or 1password. Email OTP is
					enabled upon registration.
				</Feature>

				<Feature title="Sudo Access Mode">
					When doing an important action and you didn't recently login. a dialog will display to
					confirm your identity.
				</Feature>

				<Feature title="Passkeys">
					WIP.
					<br />
					Will be implemented according to the
					<a href="https://www.w3.org/TR/webauthn-2/">W3C Recommendation</a>
				</Feature>
			</div>
		</div>
	</div>
</div>
