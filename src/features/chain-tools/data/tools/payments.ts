/**
 * Payments Tools - Crypto payments, fiat on-ramps, and streaming payments
 */
import {
	CreditCard,
	ArrowUpDown,
	Receipt,
	Droplets,
	Building2,
	Banknote,
	RefreshCw
} from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const paymentsTools: ExternalTool[] = [
	// ========== Fiat On-ramps ==========
	{
		id: 'moonpay',
		name: 'MoonPay',
		descriptionKey: 'chain_tools.tools.moonpay.description',
		url: 'https://www.moonpay.com',
		icon: CreditCard,
		category: 'payments',
		tags: ['fiat', 'on-ramp', 'off-ramp', 'card'],
		chains: ['Ethereum', 'Bitcoin', 'Solana', 'Polygon'],
		color: '#7D00FF'
	},
	{
		id: 'transak',
		name: 'Transak',
		descriptionKey: 'chain_tools.tools.transak.description',
		url: 'https://transak.com',
		icon: CreditCard,
		category: 'payments',
		tags: ['fiat', 'on-ramp', 'off-ramp', 'sdk'],
		chains: ['Ethereum', 'Polygon', 'BSC', 'Solana'],
		color: '#0052FF'
	},
	{
		id: 'ramp',
		name: 'Ramp',
		descriptionKey: 'chain_tools.tools.ramp.description',
		url: 'https://ramp.network',
		icon: ArrowUpDown,
		category: 'payments',
		tags: ['fiat', 'on-ramp', 'sdk', 'non-custodial'],
		chains: ['Ethereum', 'Polygon', 'Solana', 'Avalanche'],
		color: '#21BF73'
	},
	{
		id: 'onmeta',
		name: 'Onmeta',
		descriptionKey: 'chain_tools.tools.onmeta.description',
		url: 'https://onmeta.in',
		icon: CreditCard,
		category: 'payments',
		tags: ['fiat', 'on-ramp', 'india', 'upi'],
		chains: ['Ethereum', 'Polygon', 'BSC'],
		color: '#6366F1'
	},
	{
		id: 'poko-pay',
		name: 'Poko',
		descriptionKey: 'chain_tools.tools.poko_pay.description',
		url: 'https://poko.com',
		icon: CreditCard,
		category: 'payments',
		tags: ['onramp', 'emerging-markets', 'local', 'fiat'],
		color: '#EC4899'
	},

	// ========== Payment Processors ==========
	{
		id: 'coinbase-commerce',
		name: 'Coinbase Commerce',
		descriptionKey: 'chain_tools.tools.coinbase_commerce.description',
		url: 'https://commerce.coinbase.com',
		icon: CreditCard,
		category: 'payments',
		tags: ['checkout', 'ecommerce', 'crypto', 'merchants'],
		color: '#0052FF'
	},
	{
		id: 'bitpay',
		name: 'BitPay',
		descriptionKey: 'chain_tools.tools.bitpay.description',
		url: 'https://bitpay.com',
		icon: CreditCard,
		category: 'payments',
		tags: ['merchant', 'payments', 'card', 'invoice'],
		chains: ['Bitcoin', 'Ethereum', 'Polygon'],
		color: '#1A3B5D'
	},
	{
		id: 'nowpayments',
		name: 'NOWPayments',
		descriptionKey: 'chain_tools.tools.nowpayments.description',
		url: 'https://nowpayments.io',
		icon: CreditCard,
		category: 'payments',
		tags: ['checkout', 'api', 'multichain', 'merchants'],
		color: '#10B981'
	},
	{
		id: 'sphere-pay',
		name: 'Sphere',
		descriptionKey: 'chain_tools.tools.sphere_pay.description',
		url: 'https://spherepay.co',
		icon: CreditCard,
		category: 'payments',
		tags: ['payments', 'api', 'solana', 'merchants'],
		chains: ['Solana'],
		color: '#F97316'
	},
	{
		id: 'helio-pay',
		name: 'Helio',
		descriptionKey: 'chain_tools.tools.helio_pay.description',
		url: 'https://hel.io',
		icon: CreditCard,
		category: 'payments',
		tags: ['checkout', 'solana', 'links', 'subscriptions'],
		chains: ['Solana', 'Ethereum', 'Polygon'],
		color: '#FF6B35'
	},

	// ========== Invoicing & B2B ==========
	{
		id: 'request-network',
		name: 'Request Network',
		descriptionKey: 'chain_tools.tools.request_network.description',
		url: 'https://request.network',
		icon: Receipt,
		category: 'payments',
		tags: ['invoicing', 'crypto-payments', 'b2b', 'accounting'],
		chains: ['Ethereum', 'Polygon', 'Gnosis'],
		color: '#00E6A0'
	},
	{
		id: 'loopcrypto',
		name: 'Loop Crypto',
		descriptionKey: 'chain_tools.tools.loopcrypto.description',
		url: 'https://loopcrypto.xyz',
		icon: Receipt,
		category: 'payments',
		tags: ['subscriptions', 'recurring', 'billing', 'automation'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum'],
		color: '#6366F1'
	},

	// ========== Streaming Payments ==========
	{
		id: 'superfluid',
		name: 'Superfluid',
		descriptionKey: 'chain_tools.tools.superfluid.description',
		url: 'https://superfluid.finance',
		icon: Droplets,
		category: 'payments',
		tags: ['streaming', 'real-time', 'subscriptions', 'payroll'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'BSC'],
		color: '#12141E'
	},
	{
		id: 'sablier',
		name: 'Sablier',
		descriptionKey: 'chain_tools.tools.sablier.description',
		url: 'https://sablier.com',
		icon: Droplets,
		category: 'payments',
		tags: ['streaming', 'vesting', 'payroll', 'lockup'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base'],
		color: '#F77423'
	},
	{
		id: 'zebec-pay',
		name: 'Zebec',
		descriptionKey: 'chain_tools.tools.zebec_pay.description',
		url: 'https://zebec.io',
		icon: CreditCard,
		category: 'payments',
		tags: ['streaming', 'payroll', 'continuous', 'solana'],
		chains: ['Solana', 'BNB Chain'],
		color: '#00D4FF'
	},
	{
		id: 'mean-finance',
		name: 'Mean Finance',
		descriptionKey: 'chain_tools.tools.mean_finance.description',
		url: 'https://mean.finance',
		icon: RefreshCw,
		category: 'payments',
		tags: ['dca', 'streaming', 'treasury', 'multichain'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism'],
		color: '#14B8A6'
	},

	// ========== Treasury & Payroll ==========
	{
		id: 'coinshift',
		name: 'Coinshift',
		descriptionKey: 'chain_tools.tools.coinshift.description',
		url: 'https://coinshift.xyz',
		icon: Building2,
		category: 'payments',
		tags: ['treasury', 'multi-sig', 'payroll', 'invoicing'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism'],
		color: '#5856D6'
	},
	{
		id: 'utopia-labs',
		name: 'Utopia Labs',
		descriptionKey: 'chain_tools.tools.utopia_labs.description',
		url: 'https://www.utopialabs.com',
		icon: Building2,
		category: 'payments',
		tags: ['payroll', 'dao', 'treasury', 'operations'],
		chains: ['Ethereum', 'Polygon', 'Optimism'],
		color: '#7C3AED'
	},
	{
		id: 'utila-pay',
		name: 'Utila',
		descriptionKey: 'chain_tools.tools.utila_pay.description',
		url: 'https://utila.io',
		icon: CreditCard,
		category: 'payments',
		tags: ['treasury', 'payroll', 'invoices', 'business'],
		color: '#6366F1'
	},

	// ========== Crypto Cards ==========
	{
		id: 'gnosis-pay',
		name: 'Gnosis Pay',
		descriptionKey: 'chain_tools.tools.gnosis_pay.description',
		url: 'https://gnosispay.com',
		icon: CreditCard,
		category: 'payments',
		tags: ['card', 'visa', 'self-custody', 'spend'],
		chains: ['Gnosis'],
		color: '#04795B'
	},
	{
		id: 'gnosis-card',
		name: 'Gnosis Card',
		descriptionKey: 'chain_tools.tools.gnosis_card.description',
		url: 'https://gnosispay.com',
		icon: CreditCard,
		category: 'payments',
		tags: ['card', 'visa', 'defi', 'spend'],
		chains: ['Gnosis'],
		color: '#04795B'
	},
	{
		id: 'holyheld',
		name: 'Holyheld',
		descriptionKey: 'chain_tools.tools.holyheld.description',
		url: 'https://holyheld.com',
		icon: CreditCard,
		category: 'payments',
		tags: ['card', 'defi', 'yield', 'spend'],
		color: '#000000'
	},
	{
		id: 'fusepay',
		name: 'Fuse Pay',
		descriptionKey: 'chain_tools.tools.fusepay.description',
		url: 'https://fuse.io/fuse-pay',
		icon: CreditCard,
		category: 'payments',
		tags: ['card', 'fuse', 'spend', 'crypto'],
		chains: ['Fuse'],
		color: '#B4F9A1'
	},

	// ========== Off-ramps ==========
	{
		id: 'spritz',
		name: 'Spritz',
		descriptionKey: 'chain_tools.tools.spritz.description',
		url: 'https://spritz.finance',
		icon: Banknote,
		category: 'payments',
		tags: ['bill-pay', 'off-ramp', 'ach', 'fiat'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'BSC'],
		color: '#00D4AA'
	},
	{
		id: 'monerium',
		name: 'Monerium',
		descriptionKey: 'chain_tools.tools.monerium.description',
		url: 'https://monerium.com',
		icon: Banknote,
		category: 'payments',
		tags: ['eure', 'iban', 'fiat', 'regulated'],
		chains: ['Ethereum', 'Polygon', 'Gnosis'],
		color: '#1E40AF'
	},

	// ========== Revenue Sharing ==========
	{
		id: 'reveel',
		name: 'Reveel',
		descriptionKey: 'chain_tools.tools.reveel.description',
		url: 'https://reveel.co',
		icon: Banknote,
		category: 'payments',
		tags: ['revenue-share', 'splits', 'royalties', 'automation'],
		chains: ['Ethereum', 'Polygon', 'Optimism'],
		color: '#8B5CF6'
	},
	{
		id: 'splits',
		name: '0xSplits',
		descriptionKey: 'chain_tools.tools.splits.description',
		url: 'https://splits.org',
		icon: Banknote,
		category: 'payments',
		tags: ['revenue-share', 'splits', 'payments', 'automation'],
		chains: ['Ethereum', 'Polygon', 'Optimism', 'Base', 'Arbitrum'],
		color: '#000000'
	},

	// ========== Additional Payment Tools ==========
	{
		id: 'wyre',
		name: 'Wyre',
		descriptionKey: 'chain_tools.tools.wyre.description',
		url: 'https://www.sendwyre.com',
		icon: CreditCard,
		category: 'payments',
		tags: ['fiat', 'api', 'on-ramp', 'compliance'],
		chains: ['Ethereum', 'Bitcoin', 'Polygon'],
		color: '#00C389'
	},
	{
		id: 'banxa',
		name: 'Banxa',
		descriptionKey: 'chain_tools.tools.banxa.description',
		url: 'https://banxa.com',
		icon: CreditCard,
		category: 'payments',
		tags: ['fiat', 'on-ramp', 'off-ramp', 'global'],
		chains: ['Ethereum', 'BSC', 'Polygon', 'Solana'],
		color: '#1E40AF'
	},
	{
		id: 'simplex',
		name: 'Simplex',
		descriptionKey: 'chain_tools.tools.simplex.description',
		url: 'https://www.simplex.com',
		icon: CreditCard,
		category: 'payments',
		tags: ['fiat', 'on-ramp', 'card', 'instant'],
		chains: ['Bitcoin', 'Ethereum', 'BSC'],
		color: '#0066FF'
	},
	{
		id: 'sardine',
		name: 'Sardine',
		descriptionKey: 'chain_tools.tools.sardine.description',
		url: 'https://sardine.ai',
		icon: CreditCard,
		category: 'payments',
		tags: ['fraud', 'compliance', 'on-ramp', 'kyc'],
		color: '#FF6B35'
	},
	{
		id: 'coinflow',
		name: 'Coinflow',
		descriptionKey: 'chain_tools.tools.coinflow.description',
		url: 'https://coinflow.cash',
		icon: CreditCard,
		category: 'payments',
		tags: ['checkout', 'solana', 'nft', 'payments'],
		chains: ['Solana'],
		color: '#14F195'
	},
	{
		id: 'slash-fi',
		name: 'Slash',
		descriptionKey: 'chain_tools.tools.slash_fi.description',
		url: 'https://slash.fi',
		icon: CreditCard,
		category: 'payments',
		tags: ['checkout', 'stablecoins', 'merchants', 'payments'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum'],
		color: '#6366F1'
	},
	{
		id: 'alchemy-pay',
		name: 'Alchemy Pay',
		descriptionKey: 'chain_tools.tools.alchemy_pay.description',
		url: 'https://alchemypay.org',
		icon: CreditCard,
		category: 'payments',
		tags: ['fiat', 'gateway', 'global', 'hybrid'],
		chains: ['Ethereum', 'BSC', 'Polygon'],
		color: '#3B82F6'
	},
	{
		id: 'llamapay',
		name: 'LlamaPay',
		descriptionKey: 'chain_tools.tools.llamapay.description',
		url: 'https://llamapay.io',
		icon: Droplets,
		category: 'payments',
		tags: ['streaming', 'payroll', 'treasury', 'vesting'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism'],
		color: '#10B981'
	},
	{
		id: 'hedgey',
		name: 'Hedgey',
		descriptionKey: 'chain_tools.tools.hedgey.description',
		url: 'https://hedgey.finance',
		icon: Droplets,
		category: 'payments',
		tags: ['vesting', 'lockups', 'token-grants', 'streaming'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Base'],
		color: '#8B5CF6'
	},
	{
		id: 'parcel',
		name: 'Parcel',
		descriptionKey: 'chain_tools.tools.parcel.description',
		url: 'https://parcel.money',
		icon: Building2,
		category: 'payments',
		tags: ['treasury', 'payroll', 'gnosis-safe', 'batch'],
		chains: ['Ethereum', 'Polygon', 'Gnosis'],
		color: '#F59E0B'
	}
];
