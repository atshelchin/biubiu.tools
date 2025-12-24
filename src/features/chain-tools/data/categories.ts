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
	Newspaper,
	MessageCircle,
	Briefcase,
	CircleDollarSign,
	Activity,
	Coins,
	Landmark,
	Gift,
	Globe,
	Crown,
	Zap,
	Lock,
	Building2,
	Bot,
	Repeat,
	Flame,
	Scale,
	Users,
	Star,
	Megaphone
} from '@lucide/svelte';
import type { Category, CategoryId } from '../types';

export const categories: Category[] = [
	{ id: 'featured', labelKey: 'chain-tools.categories.featured', color: '#F59E0B', icon: Award },
	{ id: 'defi', labelKey: 'chain-tools.categories.defi', color: '#10B981', icon: TrendingUp },
	{ id: 'nft', labelKey: 'chain-tools.categories.nft', color: '#EC4899', icon: Image },
	{
		id: 'analytics',
		labelKey: 'chain-tools.categories.analytics',
		color: '#3B82F6',
		icon: BarChart3
	},
	{ id: 'security', labelKey: 'chain-tools.categories.security', color: '#EF4444', icon: Shield },
	{
		id: 'bridge',
		labelKey: 'chain-tools.categories.bridge',
		color: '#8B5CF6',
		icon: ArrowLeftRight
	},
	{ id: 'wallet', labelKey: 'chain-tools.categories.wallet', color: '#F59E0B', icon: Wallet },
	{ id: 'explorer', labelKey: 'chain-tools.categories.explorer', color: '#06B6D4', icon: Search },
	{ id: 'dev', labelKey: 'chain-tools.categories.dev', color: '#6366F1', icon: Code },
	{ id: 'dao', labelKey: 'chain-tools.categories.dao', color: '#A855F7', icon: Vote },
	{ id: 'infra', labelKey: 'chain-tools.categories.infra', color: '#14B8A6', icon: Server },
	{ id: 'launchpad', labelKey: 'chain-tools.categories.launchpad', color: '#F97316', icon: Rocket },
	{
		id: 'identity',
		labelKey: 'chain-tools.categories.identity',
		color: '#06B6D4',
		icon: Fingerprint
	},
	{ id: 'social', labelKey: 'chain-tools.categories.social', color: '#8B5CF6', icon: Share2 },
	{ id: 'l2', labelKey: 'chain-tools.categories.l2', color: '#3B82F6', icon: Layers2 },
	{ id: 'gamefi', labelKey: 'chain-tools.categories.gamefi', color: '#EC4899', icon: Gamepad2 },
	{
		id: 'payments',
		labelKey: 'chain-tools.categories.payments',
		color: '#10B981',
		icon: CreditCard
	},
	{ id: 'funding', labelKey: 'chain-tools.categories.funding', color: '#F59E0B', icon: Banknote },
	{ id: 'news', labelKey: 'chain-tools.categories.news', color: '#EF4444', icon: Newspaper },
	{
		id: 'community',
		labelKey: 'chain-tools.categories.community',
		color: '#5865F2',
		icon: MessageCircle
	},
	{ id: 'jobs', labelKey: 'chain-tools.categories.jobs', color: '#22C55E', icon: Briefcase },
	{
		id: 'stablecoin',
		labelKey: 'chain-tools.categories.stablecoin',
		color: '#10B981',
		icon: CircleDollarSign
	},
	{ id: 'oracle', labelKey: 'chain-tools.categories.oracle', color: '#6366F1', icon: Activity },
	{ id: 'dao-token', labelKey: 'chain-tools.categories.dao_token', color: '#A855F7', icon: Coins },
	{
		id: 'whale-address',
		labelKey: 'chain-tools.categories.whale_address',
		color: '#0EA5E9',
		icon: Landmark
	},
	{
		id: 'airdrop-token',
		labelKey: 'chain-tools.categories.airdrop_token',
		color: '#F59E0B',
		icon: Gift
	},
	{ id: 'non-evm', labelKey: 'chain-tools.categories.non_evm', color: '#8B5CF6', icon: Globe },
	{
		id: 'legendary-token',
		labelKey: 'chain-tools.categories.legendary_token',
		color: '#F59E0B',
		icon: Crown
	},
	{ id: 'mev', labelKey: 'chain-tools.categories.mev', color: '#EF4444', icon: Zap },
	{ id: 'privacy', labelKey: 'chain-tools.categories.privacy', color: '#6B7280', icon: Lock },
	{ id: 'rwa', labelKey: 'chain-tools.categories.rwa', color: '#0EA5E9', icon: Building2 },
	{ id: 'ai-crypto', labelKey: 'chain-tools.categories.ai_crypto', color: '#8B5CF6', icon: Bot },
	{ id: 'restaking', labelKey: 'chain-tools.categories.restaking', color: '#6366F1', icon: Repeat },
	{ id: 'cex', labelKey: 'chain-tools.categories.cex', color: '#3B82F6', icon: Building2 },
	{
		id: 'gas-burner',
		labelKey: 'chain-tools.categories.gas_burner',
		color: '#EF4444',
		icon: Flame
	},
	{ id: 'trends', labelKey: 'chain-tools.categories.trends', color: '#8B5CF6', icon: TrendingUp },
	{
		id: 'web3-teams',
		labelKey: 'chain-tools.categories.web3_teams',
		color: '#10B981',
		icon: Users
	},
	{
		id: 'regulation',
		labelKey: 'chain-tools.categories.regulation',
		color: '#6366F1',
		icon: Scale
	},
	{
		id: 'influencer',
		labelKey: 'chain-tools.categories.influencer',
		color: '#F59E0B',
		icon: Star
	},
	{
		id: 'product-hunt',
		labelKey: 'chain-tools.categories.product_hunt',
		color: '#DA552F',
		icon: Megaphone
	}
];

/**
 * Get category by ID
 */
export function getCategoryById(id: CategoryId): Category | undefined {
	return categories.find((c) => c.id === id);
}
