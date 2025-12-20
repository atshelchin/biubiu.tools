/**
 * Category definitions with i18n keys and colors
 */
import {
	Award,
	TrendingUp,
	Image,
	BarChart3,
	Shield,
	ArrowLeftRight,
	Wallet,
	Search,
	Code,
	Vote,
	Server,
	Rocket,
	Fingerprint,
	Share2,
	Layers2,
	Gamepad2,
	CreditCard,
	Banknote,
	Newspaper
} from '@lucide/svelte';
import type { Category, CategoryId } from '../types';

export const categories: Category[] = [
	{ id: 'featured', labelKey: 'chain_tools.categories.featured', color: '#F59E0B', icon: Award },
	{ id: 'defi', labelKey: 'chain_tools.categories.defi', color: '#10B981', icon: TrendingUp },
	{ id: 'nft', labelKey: 'chain_tools.categories.nft', color: '#EC4899', icon: Image },
	{
		id: 'analytics',
		labelKey: 'chain_tools.categories.analytics',
		color: '#3B82F6',
		icon: BarChart3
	},
	{ id: 'security', labelKey: 'chain_tools.categories.security', color: '#EF4444', icon: Shield },
	{
		id: 'bridge',
		labelKey: 'chain_tools.categories.bridge',
		color: '#8B5CF6',
		icon: ArrowLeftRight
	},
	{ id: 'wallet', labelKey: 'chain_tools.categories.wallet', color: '#F59E0B', icon: Wallet },
	{ id: 'explorer', labelKey: 'chain_tools.categories.explorer', color: '#06B6D4', icon: Search },
	{ id: 'dev', labelKey: 'chain_tools.categories.dev', color: '#6366F1', icon: Code },
	{ id: 'dao', labelKey: 'chain_tools.categories.dao', color: '#A855F7', icon: Vote },
	{ id: 'infra', labelKey: 'chain_tools.categories.infra', color: '#14B8A6', icon: Server },
	{ id: 'launchpad', labelKey: 'chain_tools.categories.launchpad', color: '#F97316', icon: Rocket },
	{
		id: 'identity',
		labelKey: 'chain_tools.categories.identity',
		color: '#06B6D4',
		icon: Fingerprint
	},
	{ id: 'social', labelKey: 'chain_tools.categories.social', color: '#8B5CF6', icon: Share2 },
	{ id: 'l2', labelKey: 'chain_tools.categories.l2', color: '#3B82F6', icon: Layers2 },
	{ id: 'gamefi', labelKey: 'chain_tools.categories.gamefi', color: '#EC4899', icon: Gamepad2 },
	{
		id: 'payments',
		labelKey: 'chain_tools.categories.payments',
		color: '#10B981',
		icon: CreditCard
	},
	{ id: 'funding', labelKey: 'chain_tools.categories.funding', color: '#F59E0B', icon: Banknote },
	{ id: 'news', labelKey: 'chain_tools.categories.news', color: '#EF4444', icon: Newspaper }
];

/**
 * Get category by ID
 */
export function getCategoryById(id: CategoryId): Category | undefined {
	return categories.find((c) => c.id === id);
}
