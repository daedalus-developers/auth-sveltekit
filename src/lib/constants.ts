import type { FEATURES, LinkWithIcon, PAYMENT_METHODS, TIERS } from '@types';
import AppWindowMacIcon from 'lucide-svelte/icons/app-window-mac';
import CreditCard from 'lucide-svelte/icons/credit-card';
import MonitorSmartphone from 'lucide-svelte/icons/monitor-smartphone';
import ScanFace from 'lucide-svelte/icons/scan-face';
import User from 'lucide-svelte/icons/user';
import ShieldCheck from 'lucide-svelte/icons/shield-check';
import Paypal from '@components/icons/paypal.svelte';
import PaymentCreditCard from '@components/icons/credit-card.svelte';
import Dashboard from 'lucide-svelte/icons/layout-dashboard';
import ShoppingCart from 'lucide-svelte/icons/shopping-cart';
import Package from 'lucide-svelte/icons/package';
import UsersRound from 'lucide-svelte/icons/users-round';
import LineChart from 'lucide-svelte/icons/line-chart';
import type { ComponentType } from 'svelte';
import { IconGoogle } from '@components';
import { capitalize } from '@utils';

type Feature = {
	name: (typeof FEATURES)[number];
	limit: number;
	enabled: boolean;
	frequency?: 'hourly' | 'daily';
};

export type TierFeature = {
	value: (typeof TIERS)[number];
	price?: number;
	features: Array<Feature>;
};

const freeTier: TierFeature = {
	value: 'Freemium',
	price: 0,
	features: [
		{
			name: 'Invoices',
			enabled: true,
			limit: 5
		},
		{
			name: 'Clients',
			enabled: true,
			limit: 5
		},
		{
			name: 'Products',
			enabled: true,
			limit: 10
		},
		{
			name: 'Projects',
			enabled: true,
			limit: 5
		},
		{
			name: 'Tasks per project',
			enabled: true,
			limit: 10
		},
		{
			name: 'AI Prompts',
			enabled: false,
			limit: 0,
			frequency: 'hourly'
		}
	]
};

const proTier: TierFeature = {
	value: 'Pro',
	price: 10,
	features: [
		...freeTier.features.map((feature) => {
			if (feature.name === 'AI Prompts') {
				return {
					...feature,
					limit: 5,
					enabled: true
				};
			}
			return {
				...feature,
				limit: feature.limit * 5
			};
		})
	]
};

const customTier: TierFeature = {
	value: 'Custom',
	features: [
		...proTier.features.map((feature) => {
			return {
				...feature,
				limit: feature.limit * 999
			};
		})
	]
};

export const TIERS_FEATURES: Array<TierFeature> = [
	{
		...freeTier
	},
	{
		...proTier
	},
	{
		...customTier
	}
] as const;

type PaymentMethodWithIcoon = {
	value: (typeof PAYMENT_METHODS)[number];
	icon: ComponentType;
	label: string;
};

export const PAYMENT_METHODS_WITH_ICONS: Array<PaymentMethodWithIcoon> = [
	{
		value: 'card',
		label: 'Credit/Debit card',
		icon: PaymentCreditCard
	},
	{
		value: 'google',
		label: 'Google Pay',
		icon: IconGoogle
	},
	{
		value: 'paypal',
		label: 'Paypal',
		icon: Paypal
	}
] as const;

type RouteLink = {
	label: string;
	href: string;
};

type RouteLinkWithIcon = RouteLink & {
	icon: ComponentType;
};

export const navLinks = [
	{ label: 'Signup', href: '/signup' },
	{ label: 'Login', href: '/login' }
];

export const PROTECTED_ROUTE_LINKS = [
	'dashboard',
	'products',
	'customers',
	'orders',
	'analytics'
] as const;

export const PROTECTED_ROUTE_LINKS_ICONS = [
	Dashboard,
	Package,
	UsersRound,
	ShoppingCart,
	LineChart
] as const;

export const protectedRouteLinks: Array<RouteLink> = [
	...PROTECTED_ROUTE_LINKS.map((link) => {
		return {
			label: capitalize(link),
			href: `/${link}`
		};
	})
];

export const protectedRouteLinksWithIcons: Array<RouteLinkWithIcon> = [
	...PROTECTED_ROUTE_LINKS.map((link, index) => {
		return {
			label: capitalize(link),
			href: `/${link}`,
			icon: PROTECTED_ROUTE_LINKS_ICONS[index]
		};
	})
];

export const SETTINGS_ROUTE_LINKS = [
	'profile',
	'billing',
	'security',
	'socials',
	'sessions',
	'preferences'
] as const;

export const SETTINGS_ROUTE_LINKS_ICONS = [
	User,
	CreditCard,
	ShieldCheck,
	ScanFace,
	MonitorSmartphone,
	AppWindowMacIcon
] as const;

export const settingsRouteLinksWithIcon: Array<RouteLinkWithIcon> = [
	{
		icon: User,
		label: 'Profile',
		href: '/settings/profile'
	},
	{
		icon: CreditCard,
		label: 'Billing',
		href: '/settings/billing'
	},
	{
		icon: ShieldCheck,
		label: 'Password and authentication',
		href: '/settings/security'
	},
	{
		icon: ScanFace,
		label: 'Connected Accounts',
		href: '/settings/socials'
	},
	{
		icon: MonitorSmartphone,
		label: 'Sessions',
		href: '/settings/sessions'
	},
	{
		icon: AppWindowMacIcon,
		label: 'Preferences',
		href: '/settings/preferences'
	}
];

export const settingsLinks: Array<LinkWithIcon> = [
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
