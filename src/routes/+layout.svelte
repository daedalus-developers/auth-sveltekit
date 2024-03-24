<script>
	import '../app.pcss';
	import '@fontsource-variable/montserrat';
	import { Toaster } from '@components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import { setupViewTransition } from 'sveltekit-view-transition';
	import { Header } from '@components';
	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/stores';
	import { toast } from 'svelte-sonner';
	const flash = getFlash(page);

	$: if ($flash) {
		switch ($flash.type) {
			case 'success':
				toast.success($flash.message);
				break;
			case 'error':
				toast.error($flash.message);
				break;
			case 'warning':
				toast.warning($flash.message);
				break;
			case 'info':
				toast.info($flash.message);
				break;
			default:
				toast.message($flash.message);
		}

		$flash = undefined;
	}

	setupViewTransition();
</script>

<ModeWatcher />
<Toaster richColors />
<Header />
<main class="flex-1">
	<slot />
</main>
