import type { LinkWithIcon } from '@types';

import AppWindowMacIcon from 'lucide-svelte/icons/app-window-mac';
import CreditCard from 'lucide-svelte/icons/credit-card';
import MonitorSmartphone from 'lucide-svelte/icons/monitor-smartphone';
import ScanFace from 'lucide-svelte/icons/scan-face';
import User from 'lucide-svelte/icons/user';
import ShieldCheck from 'lucide-svelte/icons/shield-check';
import Paypal from '@components/icons/paypal.svelte';
import PaymentCreditCard from '@components/icons/credit-card.svelte';
import Google from '@components/icons/google.svelte';

import type { ComponentType } from 'svelte';

export const MONTHS = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
] as const;

export const TIERS = ['Freemium', 'Pro', 'Custom'] as const;

export const FEATURES = [
	'Invoices',
	'Clients',
	'Products',
	'Projects',
	'Tasks per project',
	'AI Prompts'
] as const;

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

export const PAYMENT_METHODS = ['card', 'google', 'paypal'] as const;

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
		icon: Google
	},
	{
		value: 'paypal',
		label: 'Paypal',
		icon: Paypal
	}
] as const;

export const PAYMENT_OCCURENCE = ['weekly', 'monthly', 'annually'] as const;

export const navLinks = [
	{ label: 'Signup', href: '/signup' },
	{ label: 'Login', href: '/login' }
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
