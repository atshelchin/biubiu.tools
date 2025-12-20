/**
 * Mainstream & Future Wallet Tools
 *
 * Categories:
 * - Browser Extension Wallets
 * - Mobile Wallets
 * - Hardware Wallets
 * - Smart Contract Wallets (AA)
 * - Multi-sig Wallets
 * - Future Wallet Innovations
 */
import {
	Wallet,
	Smartphone,
	Shield,
	Key,
	Cpu,
	Zap,
	Globe,
	Lock,
	Fingerprint,
	Layers
} from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const walletMainstreamTools: ExternalTool[] = [
	// ========== Browser Extension Wallets ==========
	{
		id: 'metamask-wallet',
		name: 'MetaMask',
		descriptionKey: 'chain_tools.tools.metamask_wallet.description',
		url: 'https://metamask.io',
		icon: Wallet,
		category: 'wallet-mainstream',
		tags: ['wallet', 'browser', 'extension', 'evm'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'BSC', 'Avalanche'],
		color: '#E2761B'
	},
	{
		id: 'phantom-wallet',
		name: 'Phantom',
		descriptionKey: 'chain_tools.tools.phantom_wallet.description',
		url: 'https://phantom.app',
		icon: Wallet,
		category: 'wallet-mainstream',
		tags: ['wallet', 'solana', 'ethereum', 'polygon'],
		chains: ['Solana', 'Ethereum', 'Polygon'],
		color: '#AB9FF2'
	},
	{
		id: 'rabby-wallet',
		name: 'Rabby Wallet',
		descriptionKey: 'chain_tools.tools.rabby_wallet.description',
		url: 'https://rabby.io',
		icon: Wallet,
		category: 'wallet-mainstream',
		tags: ['wallet', 'browser', 'security', 'debank'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism'],
		color: '#7C3AED'
	},
	{
		id: 'coinbase-wallet',
		name: 'Coinbase Wallet',
		descriptionKey: 'chain_tools.tools.coinbase_wallet.description',
		url: 'https://www.coinbase.com/wallet',
		icon: Wallet,
		category: 'wallet-mainstream',
		tags: ['wallet', 'coinbase', 'self-custody'],
		chains: ['Ethereum', 'Polygon', 'Solana', 'Base'],
		color: '#0052FF'
	},
	{
		id: 'okx-wallet',
		name: 'OKX Wallet',
		descriptionKey: 'chain_tools.tools.okx_wallet.description',
		url: 'https://www.okx.com/web3',
		icon: Wallet,
		category: 'wallet-mainstream',
		tags: ['wallet', 'okx', 'multi-chain', 'defi'],
		chains: ['Ethereum', 'Solana', 'Bitcoin', 'Polygon'],
		color: '#000000'
	},
	{
		id: 'trust-wallet',
		name: 'Trust Wallet',
		descriptionKey: 'chain_tools.tools.trust_wallet.description',
		url: 'https://trustwallet.com',
		icon: Smartphone,
		category: 'wallet-mainstream',
		tags: ['wallet', 'mobile', 'binance', 'multi-chain'],
		chains: ['Ethereum', 'BSC', 'Polygon', 'Solana'],
		color: '#3375BB',
		isFeatured: true
	},
	{
		id: 'rainbow-wallet',
		name: 'Rainbow',
		descriptionKey: 'chain_tools.tools.rainbow_wallet.description',
		url: 'https://rainbow.me',
		icon: Wallet,
		category: 'wallet-mainstream',
		tags: ['wallet', 'ethereum', 'nft', 'mobile'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base'],
		color: '#001E59'
	},
	{
		id: 'zerion-wallet',
		name: 'Zerion',
		descriptionKey: 'chain_tools.tools.zerion_wallet.description',
		url: 'https://zerion.io',
		icon: Wallet,
		category: 'wallet-mainstream',
		tags: ['wallet', 'portfolio', 'defi', 'tracking'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism'],
		color: '#2962EF'
	},
	{
		id: 'frame-wallet',
		name: 'Frame',
		descriptionKey: 'chain_tools.tools.frame_wallet.description',
		url: 'https://frame.sh',
		icon: Wallet,
		category: 'wallet-mainstream',
		tags: ['wallet', 'desktop', 'hardware', 'privacy'],
		chains: ['Ethereum'],
		color: '#1A1A2E'
	},
	// ========== Hardware Wallets ==========
	{
		id: 'ledger-wallet',
		name: 'Ledger',
		descriptionKey: 'chain_tools.tools.ledger_wallet.description',
		url: 'https://www.ledger.com',
		icon: Shield,
		category: 'wallet-mainstream',
		tags: ['wallet', 'hardware', 'cold-storage', 'security'],
		chains: ['Ethereum', 'Bitcoin', 'Solana', 'Polygon'],
		color: '#000000'
	},
	{
		id: 'trezor-wallet',
		name: 'Trezor',
		descriptionKey: 'chain_tools.tools.trezor_wallet.description',
		url: 'https://trezor.io',
		icon: Shield,
		category: 'wallet-mainstream',
		tags: ['wallet', 'hardware', 'open-source', 'bitcoin'],
		chains: ['Ethereum', 'Bitcoin'],
		color: '#00854D'
	},
	{
		id: 'keystone-wallet',
		name: 'Keystone',
		descriptionKey: 'chain_tools.tools.keystone_wallet.description',
		url: 'https://keyst.one',
		icon: Shield,
		category: 'wallet-mainstream',
		tags: ['wallet', 'hardware', 'air-gapped', 'qr-code'],
		chains: ['Ethereum', 'Bitcoin', 'Solana'],
		color: '#2C3E50'
	},
	{
		id: 'gridplus-wallet',
		name: 'GridPlus Lattice1',
		descriptionKey: 'chain_tools.tools.gridplus_wallet.description',
		url: 'https://gridplus.io',
		icon: Shield,
		category: 'wallet-mainstream',
		tags: ['wallet', 'hardware', 'enterprise', 'lattice'],
		chains: ['Ethereum'],
		color: '#00D395'
	},
	{
		id: 'tangem-wallet',
		name: 'Tangem',
		descriptionKey: 'chain_tools.tools.tangem_wallet.description',
		url: 'https://tangem.com',
		icon: Key,
		category: 'wallet-mainstream',
		tags: ['wallet', 'hardware', 'card', 'nfc'],
		chains: ['Ethereum', 'Bitcoin', 'Solana'],
		color: '#000000'
	},
	// ========== Smart Contract Wallets (Account Abstraction) ==========
	{
		id: 'safe-wallet',
		name: 'Safe (Gnosis Safe)',
		descriptionKey: 'chain_tools.tools.safe_wallet.description',
		url: 'https://safe.global',
		icon: Lock,
		category: 'wallet-mainstream',
		tags: ['wallet', 'multisig', 'smart-contract', 'dao'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Gnosis'],
		color: '#12FF80'
	},
	{
		id: 'argent-wallet',
		name: 'Argent',
		descriptionKey: 'chain_tools.tools.argent_wallet.description',
		url: 'https://www.argent.xyz',
		icon: Zap,
		category: 'wallet-mainstream',
		tags: ['wallet', 'smart-contract', 'social-recovery', 'starknet'],
		chains: ['Ethereum', 'StarkNet'],
		color: '#FF875B'
	},
	{
		id: 'sequence-wallet',
		name: 'Sequence',
		descriptionKey: 'chain_tools.tools.sequence_wallet.description',
		url: 'https://sequence.xyz',
		icon: Layers,
		category: 'wallet-mainstream',
		tags: ['wallet', 'smart-contract', 'gaming', 'embedded'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum'],
		color: '#4F46E5'
	},
	{
		id: 'privy-wallet',
		name: 'Privy',
		descriptionKey: 'chain_tools.tools.privy_wallet.description',
		url: 'https://privy.io',
		icon: Fingerprint,
		category: 'wallet-mainstream',
		tags: ['wallet', 'embedded', 'social-login', 'auth'],
		chains: ['Ethereum', 'Polygon', 'Base'],
		color: '#6366F1'
	},
	{
		id: 'dynamic-wallet',
		name: 'Dynamic',
		descriptionKey: 'chain_tools.tools.dynamic_wallet.description',
		url: 'https://dynamic.xyz',
		icon: Zap,
		category: 'wallet-mainstream',
		tags: ['wallet', 'embedded', 'multi-wallet', 'onboarding'],
		chains: ['Ethereum', 'Solana', 'Polygon'],
		color: '#8B5CF6'
	},
	{
		id: 'web3auth-wallet',
		name: 'Web3Auth',
		descriptionKey: 'chain_tools.tools.web3auth_wallet.description',
		url: 'https://web3auth.io',
		icon: Key,
		category: 'wallet-mainstream',
		tags: ['wallet', 'mpc', 'social-login', 'key-management'],
		chains: ['Ethereum', 'Solana', 'Polygon'],
		color: '#0364FF'
	},
	{
		id: 'particle-wallet',
		name: 'Particle Network',
		descriptionKey: 'chain_tools.tools.particle_wallet.description',
		url: 'https://particle.network',
		icon: Globe,
		category: 'wallet-mainstream',
		tags: ['wallet', 'chain-abstraction', 'universal', 'aa'],
		chains: ['Ethereum', 'Solana', 'BSC'],
		color: '#7C3AED'
	},
	{
		id: 'zerodev-wallet',
		name: 'ZeroDev',
		descriptionKey: 'chain_tools.tools.zerodev_wallet.description',
		url: 'https://zerodev.app',
		icon: Cpu,
		category: 'wallet-mainstream',
		tags: ['wallet', 'account-abstraction', 'erc4337', 'sdk'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism'],
		color: '#000000'
	},
	{
		id: 'biconomy-wallet',
		name: 'Biconomy',
		descriptionKey: 'chain_tools.tools.biconomy_wallet.description',
		url: 'https://biconomy.io',
		icon: Zap,
		category: 'wallet-mainstream',
		tags: ['wallet', 'account-abstraction', 'gasless', 'sdk'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum'],
		color: '#FF4E17'
	},
	{
		id: 'alchemy-aa',
		name: 'Alchemy Account Kit',
		descriptionKey: 'chain_tools.tools.alchemy_aa.description',
		url: 'https://www.alchemy.com/account-kit',
		icon: Cpu,
		category: 'wallet-mainstream',
		tags: ['wallet', 'account-abstraction', 'embedded', 'alchemy'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism'],
		color: '#0052FF'
	},
	// ========== Bitcoin & Multi-chain Wallets ==========
	{
		id: 'unisat-wallet',
		name: 'UniSat',
		descriptionKey: 'chain_tools.tools.unisat_wallet.description',
		url: 'https://unisat.io',
		icon: Wallet,
		category: 'wallet-mainstream',
		tags: ['wallet', 'bitcoin', 'ordinals', 'brc20'],
		chains: ['Bitcoin'],
		color: '#F7931A'
	},
	{
		id: 'xverse-wallet',
		name: 'Xverse',
		descriptionKey: 'chain_tools.tools.xverse_wallet.description',
		url: 'https://www.xverse.app',
		icon: Wallet,
		category: 'wallet-mainstream',
		tags: ['wallet', 'bitcoin', 'stacks', 'ordinals'],
		chains: ['Bitcoin', 'Stacks'],
		color: '#EE7A30'
	},
	{
		id: 'leather-wallet',
		name: 'Leather (Hiro)',
		descriptionKey: 'chain_tools.tools.leather_wallet.description',
		url: 'https://leather.io',
		icon: Wallet,
		category: 'wallet-mainstream',
		tags: ['wallet', 'bitcoin', 'stacks', 'defi'],
		chains: ['Bitcoin', 'Stacks'],
		color: '#12100F'
	},
	// ========== Cosmos & Multi-chain ==========
	{
		id: 'keplr-wallet',
		name: 'Keplr',
		descriptionKey: 'chain_tools.tools.keplr_wallet.description',
		url: 'https://www.keplr.app',
		icon: Wallet,
		category: 'wallet-mainstream',
		tags: ['wallet', 'cosmos', 'ibc', 'staking'],
		chains: ['Cosmos Hub', 'Osmosis', 'Celestia'],
		color: '#5F38FB'
	},
	{
		id: 'leap-wallet',
		name: 'Leap Wallet',
		descriptionKey: 'chain_tools.tools.leap_wallet.description',
		url: 'https://leapwallet.io',
		icon: Wallet,
		category: 'wallet-mainstream',
		tags: ['wallet', 'cosmos', 'ibc', 'mobile'],
		chains: ['Cosmos Hub', 'Osmosis', 'Injective'],
		color: '#29A874'
	},
	// ========== Future Wallet Innovations ==========
	{
		id: 'passport-wallet',
		name: 'Passport (Foundation)',
		descriptionKey: 'chain_tools.tools.passport_wallet.description',
		url: 'https://foundationdevices.com/passport',
		icon: Shield,
		category: 'wallet-mainstream',
		tags: ['wallet', 'hardware', 'bitcoin', 'open-source'],
		chains: ['Bitcoin'],
		color: '#000000'
	},
	{
		id: 'seedsigner-wallet',
		name: 'SeedSigner',
		descriptionKey: 'chain_tools.tools.seedsigner_wallet.description',
		url: 'https://seedsigner.com',
		icon: Cpu,
		category: 'wallet-mainstream',
		tags: ['wallet', 'hardware', 'diy', 'bitcoin', 'air-gapped'],
		chains: ['Bitcoin'],
		color: '#F7931A'
	},
	{
		id: 'fireblocks-wallet',
		name: 'Fireblocks',
		descriptionKey: 'chain_tools.tools.fireblocks_wallet.description',
		url: 'https://www.fireblocks.com',
		icon: Shield,
		category: 'wallet-mainstream',
		tags: ['wallet', 'institutional', 'mpc', 'custody'],
		chains: ['Ethereum', 'Bitcoin', 'Solana'],
		color: '#FF6B00'
	},
	{
		id: 'anchorage-wallet',
		name: 'Anchorage Digital',
		descriptionKey: 'chain_tools.tools.anchorage_wallet.description',
		url: 'https://www.anchorage.com',
		icon: Lock,
		category: 'wallet-mainstream',
		tags: ['wallet', 'institutional', 'custody', 'bank'],
		chains: ['Ethereum', 'Bitcoin', 'Solana'],
		color: '#5B47DB'
	},
	{
		id: 'bitgo-wallet',
		name: 'BitGo',
		descriptionKey: 'chain_tools.tools.bitgo_wallet.description',
		url: 'https://www.bitgo.com',
		icon: Shield,
		category: 'wallet-mainstream',
		tags: ['wallet', 'institutional', 'custody', 'multisig'],
		chains: ['Ethereum', 'Bitcoin'],
		color: '#00629B'
	}
];
