// See https://kit.svelte.dev/docs/types#app

import type { ResponseMessage } from '@types';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: import('lucia').User | null;
			session: import('lucia').Session | null;
		}
		interface PageData {
			flash?: { type: 'success' | 'error' | 'warning' | 'info'; message: string };
		}
		interface PageState {
			requireSudo?: boolean;
			showMfa?: boolean;
		}
		// interface Platform {}
		namespace Superforms {
			type Message = ResponseMessage;
		}
	}
}

export {};
