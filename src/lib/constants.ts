import type { LinkWithIcon } from '@types';
import {
	AppWindowMacIcon,
	CreditCard,
	MonitorSmartphone,
	ScanFace,
	Settings,
	ShieldCheck,
	User
} from 'lucide-svelte';

export const navLinks = [
	{ label: 'Signup', href: '/signup' },
	{ label: 'Login', href: '/login' }
];

export const settingsLinks: Array<LinkWithIcon> = [
	{
		icon: Settings,
		title: 'Settings',
		href: '/settings'
	},
	{
		icon: User,
		title: 'Profile',
		href: '/settings/profile'
	},
	{
		icon: CreditCard,
		title: 'Billing',
		href: '/settings/billing'
	},
	{
		icon: ShieldCheck,
		title: 'Password and authentication',
		href: '/settings/security'
	},
	{
		icon: ScanFace,
		title: 'Connected Accounts',
		href: '/settings/socials'
	},
	{
		icon: MonitorSmartphone,
		title: 'Sessions',
		href: '/settings/sessions'
	},
	{
		icon: AppWindowMacIcon,
		title: 'Preferences',
		href: '/settings/preferences'
	}
];
