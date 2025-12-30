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
		descriptionKey: 'chain-tools.privacy.tools.zcash.description',
		url: 'https://z.cash',
		icon: Shield,
		category: 'privacy',
		tags: ['privacy', 'zk-snark', 'shielded', 'chain'],
		chains: ['Zcash'],
		color: '#F4B728'
	},
	{
		id: 'monero',
		name: 'Monero',
		descriptionKey: 'chain-tools.privacy.tools.monero.description',
		url: 'https://getmonero.org',
		icon: Lock,
		category: 'privacy',
		tags: ['privacy', 'ring-signatures', 'stealth', 'chain'],
		chains: ['Monero'],
		color: '#FF6600'
	},
	{
		id: 'secret-network',
		name: 'Secret Network',
		descriptionKey: 'chain-tools.privacy.tools.secret_network.description',
		url: 'https://scrt.network',
		icon: Key,
		category: 'privacy',
		tags: ['privacy', 'secret', 'cosmos', 'tee'],
		chains: ['Secret Network'],
		color: '#1B1B1B'
	},
	{
		id: 'oasis-network',
		name: 'Oasis Network',
		descriptionKey: 'chain-tools.privacy.tools.oasis_network.description',
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
		descriptionKey: 'chain-tools.privacy.tools.mina_protocol.description',
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
		descriptionKey: 'chain-tools.privacy.tools.firo.description',
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
		descriptionKey: 'chain-tools.privacy.tools.iron_fish.description',
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
		descriptionKey: 'chain-tools.privacy.tools.aztec_connect.description',
		url: 'https://aztec.network',
		icon: Shield,
		category: 'privacy',
		tags: ['privacy', 'zk', 'rollup', 'ethereum'],
		chains: ['Ethereum'],
		color: '#5952CC'
	},
	{
		id: 'railgun',
		name: 'Railgun',
		descriptionKey: 'chain-tools.privacy.tools.railgun.description',
		url: 'https://railgun.org',
		icon: Lock,
		category: 'privacy',
		tags: ['privacy', 'zk', 'defi', 'shielded'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'BSC'],
		color: '#2C2C2C'
	},
	{
		id: 'umbra-cash',
		name: 'Umbra',
		descriptionKey: 'chain-tools.privacy.tools.umbra_cash.description',
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
		descriptionKey: 'chain-tools.privacy.tools.nocturne.description',
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
		descriptionKey: 'chain-tools.privacy.tools.penumbra.description',
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
		descriptionKey: 'chain-tools.privacy.tools.namada.description',
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
		descriptionKey: 'chain-tools.privacy.tools.frame_privacy.description',
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
		descriptionKey: 'chain-tools.privacy.tools.brave_wallet.description',
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
		descriptionKey: 'chain-tools.privacy.tools.cake_wallet.description',
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
		descriptionKey: 'chain-tools.privacy.tools.privacy_pools.description',
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
		descriptionKey: 'chain-tools.privacy.tools.zk_email.description',
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
		descriptionKey: 'chain-tools.privacy.tools.semaphore.description',
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
		descriptionKey: 'chain-tools.privacy.tools.worldcoin_privacy.description',
		url: 'https://worldcoin.org/world-id',
		icon: Eye,
		category: 'privacy',
		tags: ['privacy', 'identity', 'zk', 'biometric'],
		chains: ['Ethereum', 'Optimism'],
		color: '#000000'
	}
];
