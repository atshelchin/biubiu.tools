/**
 * Privacy Tools - Privacy-preserving protocols and mixers
 *
 * Categories:
 * - Privacy Chains
 * - Privacy Protocols
 * - Privacy Wallets
 * - ZK Privacy Tools
 */
import {
	Lock,
	Shield,
	Eye,
	EyeOff,
	Key,
	Globe,
	Wallet,
	Network,
	Fingerprint,
	FileKey
} from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const privacyTools: ExternalTool[] = [
	// ========== Privacy Chains ==========
	{
		id: 'zcash',
		name: 'Zcash',
		descriptionKey: 'chain_tools.tools.zcash.description',
		url: 'https://z.cash',
		icon: Shield,
		category: 'privacy',
		tags: ['privacy', 'zk-snark', 'shielded', 'chain'],
		chains: ['Zcash'],
		color: '#F4B728',
		isFeatured: true
	},
	{
		id: 'monero',
		name: 'Monero',
		descriptionKey: 'chain_tools.tools.monero.description',
		url: 'https://getmonero.org',
		icon: Lock,
		category: 'privacy',
		tags: ['privacy', 'ring-signatures', 'stealth', 'chain'],
		chains: ['Monero'],
		color: '#FF6600',
		isFeatured: true
	},
	{
		id: 'secret-network',
		name: 'Secret Network',
		descriptionKey: 'chain_tools.tools.secret_network.description',
		url: 'https://scrt.network',
		icon: Key,
		category: 'privacy',
		tags: ['privacy', 'secret', 'cosmos', 'tee'],
		chains: ['Secret Network'],
		color: '#1B1B1B',
		isFeatured: true
	},
	{
		id: 'oasis-network',
		name: 'Oasis Network',
		descriptionKey: 'chain_tools.tools.oasis_network.description',
		url: 'https://oasisprotocol.org',
		icon: Globe,
		category: 'privacy',
		tags: ['privacy', 'confidential', 'tee', 'data'],
		chains: ['Oasis'],
		color: '#0092F6'
	},
	{
		id: 'mina-protocol',
		name: 'Mina Protocol',
		descriptionKey: 'chain_tools.tools.mina_protocol.description',
		url: 'https://minaprotocol.com',
		icon: Shield,
		category: 'privacy',
		tags: ['privacy', 'zk', 'succinct', 'lightweight'],
		chains: ['Mina'],
		color: '#00D1AE'
	},
	{
		id: 'firo',
		name: 'Firo',
		descriptionKey: 'chain_tools.tools.firo.description',
		url: 'https://firo.org',
		icon: Lock,
		category: 'privacy',
		tags: ['privacy', 'lelantus', 'spark', 'chain'],
		chains: ['Firo'],
		color: '#9B1C1C'
	},
	{
		id: 'iron-fish',
		name: 'Iron Fish',
		descriptionKey: 'chain_tools.tools.iron_fish.description',
		url: 'https://ironfish.network',
		icon: Shield,
		category: 'privacy',
		tags: ['privacy', 'zk', 'encrypted', 'chain'],
		chains: ['Iron Fish'],
		color: '#1D2B3A'
	},
	// ========== Privacy Protocols ==========
	{
		id: 'aztec-connect',
		name: 'Aztec',
		descriptionKey: 'chain_tools.tools.aztec_connect.description',
		url: 'https://aztec.network',
		icon: Shield,
		category: 'privacy',
		tags: ['privacy', 'zk', 'rollup', 'ethereum'],
		chains: ['Ethereum'],
		color: '#5952CC',
		isFeatured: true
	},
	{
		id: 'railgun',
		name: 'Railgun',
		descriptionKey: 'chain_tools.tools.railgun.description',
		url: 'https://railgun.org',
		icon: Lock,
		category: 'privacy',
		tags: ['privacy', 'zk', 'defi', 'shielded'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'BSC'],
		color: '#2C2C2C',
		isFeatured: true
	},
	{
		id: 'umbra-cash',
		name: 'Umbra',
		descriptionKey: 'chain_tools.tools.umbra_cash.description',
		url: 'https://app.umbra.cash',
		icon: EyeOff,
		category: 'privacy',
		tags: ['privacy', 'stealth', 'addresses', 'payments'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism'],
		color: '#7B61FF'
	},
	{
		id: 'nocturne',
		name: 'Nocturne',
		descriptionKey: 'chain_tools.tools.nocturne.description',
		url: 'https://nocturne.xyz',
		icon: EyeOff,
		category: 'privacy',
		tags: ['privacy', 'account', 'abstraction', 'zk'],
		chains: ['Ethereum'],
		color: '#1A1A2E'
	},
	{
		id: 'penumbra',
		name: 'Penumbra',
		descriptionKey: 'chain_tools.tools.penumbra.description',
		url: 'https://penumbra.zone',
		icon: Shield,
		category: 'privacy',
		tags: ['privacy', 'cosmos', 'shielded', 'ibc'],
		chains: ['Penumbra'],
		color: '#3D3D3D'
	},
	{
		id: 'namada',
		name: 'Namada',
		descriptionKey: 'chain_tools.tools.namada.description',
		url: 'https://namada.net',
		icon: Shield,
		category: 'privacy',
		tags: ['privacy', 'cosmos', 'shielded', 'multichain'],
		chains: ['Namada'],
		color: '#FFFF00'
	},
	// ========== Privacy Wallets ==========
	{
		id: 'frame-privacy',
		name: 'Frame',
		descriptionKey: 'chain_tools.tools.frame_privacy.description',
		url: 'https://frame.sh',
		icon: Wallet,
		category: 'privacy',
		tags: ['privacy', 'wallet', 'desktop', 'hardware'],
		chains: ['Ethereum'],
		color: '#00B2FF'
	},
	{
		id: 'brave-wallet',
		name: 'Brave Wallet',
		descriptionKey: 'chain_tools.tools.brave_wallet.description',
		url: 'https://brave.com/wallet',
		icon: Wallet,
		category: 'privacy',
		tags: ['privacy', 'wallet', 'browser', 'integrated'],
		chains: ['Ethereum', 'Solana'],
		color: '#FB542B'
	},
	{
		id: 'cake-wallet',
		name: 'Cake Wallet',
		descriptionKey: 'chain_tools.tools.cake_wallet.description',
		url: 'https://cakewallet.com',
		icon: Wallet,
		category: 'privacy',
		tags: ['privacy', 'monero', 'bitcoin', 'mobile'],
		chains: ['Monero', 'Bitcoin'],
		color: '#0BA4E8'
	},
	// ========== ZK Tools ==========
	{
		id: 'tornado-cash-classic',
		name: 'Privacy Pools',
		descriptionKey: 'chain_tools.tools.privacy_pools.description',
		url: 'https://privacypools.com',
		icon: Network,
		category: 'privacy',
		tags: ['privacy', 'mixer', 'zk', 'compliance'],
		chains: ['Ethereum'],
		color: '#94FF94'
	},
	{
		id: 'zk-email',
		name: 'ZK Email',
		descriptionKey: 'chain_tools.tools.zk_email.description',
		url: 'https://prove.email',
		icon: FileKey,
		category: 'privacy',
		tags: ['privacy', 'zk', 'email', 'proof'],
		chains: ['Ethereum'],
		color: '#6366F1'
	},
	{
		id: 'semaphore',
		name: 'Semaphore',
		descriptionKey: 'chain_tools.tools.semaphore.description',
		url: 'https://semaphore.pse.dev',
		icon: Fingerprint,
		category: 'privacy',
		tags: ['privacy', 'zk', 'identity', 'voting'],
		chains: ['Ethereum'],
		color: '#8B5CF6'
	},
	{
		id: 'worldcoin-privacy',
		name: 'World ID',
		descriptionKey: 'chain_tools.tools.worldcoin_privacy.description',
		url: 'https://worldcoin.org/world-id',
		icon: Eye,
		category: 'privacy',
		tags: ['privacy', 'identity', 'zk', 'biometric'],
		chains: ['Ethereum', 'Optimism'],
		color: '#000000'
	}
];
