/**
 * Wallet Tools - Cryptocurrency wallets and portfolio trackers
 */
import {
	Wallet,
	Lock,
	KeyRound,
	ArrowLeftRight,
	SendHorizontal,
	ScanSearch,
	Settings
} from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const walletTools: ExternalTool[] = [
	// ========== BiuBiu Internal Tools ==========
	{
		id: 'biubiu-wallet-sweep',
		name: 'Wallet Sweep',
		descriptionKey: 'chain_tools.tools.biubiu_wallet_sweep.description',
		url: '/apps/wallet-sweep',
		icon: ArrowLeftRight,
		category: 'wallet',
		tags: ['sweep', 'batch', 'transfer', 'consolidate', 'biubiu'],
		chains: ['Ethereum', 'Polygon', 'BSC', 'Base', 'Arbitrum'],
		color: '#10B981',
		isFeatured: true
	},
	{
		id: 'biubiu-one-to-many',
		name: 'One-to-Many Transfer',
		descriptionKey: 'chain_tools.tools.biubiu_one_to_many.description',
		url: '/apps/one-to-many-transfer',
		icon: SendHorizontal,
		category: 'wallet',
		tags: ['airdrop', 'batch', 'transfer', 'distribution', 'biubiu'],
		chains: ['Ethereum', 'Polygon', 'BSC', 'Base', 'Arbitrum'],
		color: '#F59E0B',
		isFeatured: true
	},
	{
		id: 'biubiu-wallet-generator',
		name: 'Wallet Generator',
		descriptionKey: 'chain_tools.tools.biubiu_wallet_generator.description',
		url: '/apps/wallet-generator',
		icon: KeyRound,
		category: 'wallet',
		tags: ['generator', 'mnemonic', 'hd-wallet', 'batch', 'biubiu'],
		color: '#8B5CF6',
		isFeatured: true
	},
	{
		id: 'biubiu-balance-scanner',
		name: 'Balance Scanner',
		descriptionKey: 'chain_tools.tools.biubiu_balance_scanner.description',
		url: '/apps/token-balance-scanner',
		icon: ScanSearch,
		category: 'wallet',
		tags: ['balance', 'scanner', 'batch', 'portfolio', 'biubiu'],
		chains: ['Ethereum', 'Polygon', 'BSC', 'Base', 'Arbitrum'],
		color: '#3B82F6',
		isFeatured: true
	},

	// ========== Portfolio Trackers ==========
	{
		id: 'debank',
		name: 'DeBank',
		descriptionKey: 'chain_tools.tools.debank.description',
		url: 'https://debank.com',
		icon: Wallet,
		category: 'wallet',
		tags: ['portfolio', 'tracker', 'defi', 'nft'],
		color: '#FE815F'
	},
	{
		id: 'zapper',
		name: 'Zapper',
		descriptionKey: 'chain_tools.tools.zapper.description',
		url: 'https://zapper.xyz',
		icon: Wallet,
		category: 'wallet',
		tags: ['portfolio', 'tracker', 'defi', 'nft'],
		color: '#784FFE'
	},
	{
		id: 'zerion',
		name: 'Zerion',
		descriptionKey: 'chain_tools.tools.zerion.description',
		url: 'https://zerion.io',
		icon: Wallet,
		category: 'wallet',
		tags: ['wallet', 'portfolio', 'defi', 'nft'],
		color: '#2962FF'
	},

	// ========== Browser Extension Wallets ==========
	{
		id: 'metamask',
		name: 'MetaMask',
		descriptionKey: 'chain_tools.tools.metamask.description',
		url: 'https://metamask.io',
		icon: Wallet,
		category: 'wallet',
		tags: ['wallet', 'extension', 'mobile', 'popular'],
		color: '#F6851B',
		isFeatured: true
	},
	{
		id: 'rabby',
		name: 'Rabby Wallet',
		descriptionKey: 'chain_tools.tools.rabby.description',
		url: 'https://rabby.io',
		icon: Wallet,
		category: 'wallet',
		tags: ['wallet', 'extension', 'multi-chain', 'debank'],
		color: '#8697FF'
	},
	{
		id: 'rainbow',
		name: 'Rainbow',
		descriptionKey: 'chain_tools.tools.rainbow.description',
		url: 'https://rainbow.me',
		icon: Wallet,
		category: 'wallet',
		tags: ['wallet', 'mobile', 'ethereum', 'nft'],
		color: '#FF4BA6'
	},
	{
		id: 'frame',
		name: 'Frame',
		descriptionKey: 'chain_tools.tools.frame.description',
		url: 'https://frame.sh',
		icon: Wallet,
		category: 'wallet',
		tags: ['wallet', 'desktop', 'hardware', 'security'],
		color: '#2D2D2D'
	},

	// ========== Multi-sig & Smart Wallets ==========
	{
		id: 'safe',
		name: 'Safe (Gnosis)',
		descriptionKey: 'chain_tools.tools.safe.description',
		url: 'https://safe.global',
		icon: Lock,
		category: 'wallet',
		tags: ['multisig', 'smart-wallet', 'treasury'],
		color: '#12FF80',
		isFeatured: true
	},
	{
		id: 'ambire',
		name: 'Ambire Wallet',
		descriptionKey: 'chain_tools.tools.ambire.description',
		url: 'https://ambire.com',
		icon: Wallet,
		category: 'wallet',
		tags: ['smart-wallet', 'email-login', 'gasless', 'multi-chain'],
		color: '#8B5CF6'
	},
	{
		id: 'obvious',
		name: 'Obvious',
		descriptionKey: 'chain_tools.tools.obvious.description',
		url: 'https://obvious.technology',
		icon: Wallet,
		category: 'wallet',
		tags: ['smart-wallet', 'account-abstraction', 'social-recovery'],
		color: '#000000'
	},
	{
		id: 'soul-wallet',
		name: 'Soul Wallet',
		descriptionKey: 'chain_tools.tools.soul_wallet.description',
		url: 'https://soulwallet.io',
		icon: Wallet,
		category: 'wallet',
		tags: ['smart-wallet', 'erc-4337', 'account-abstraction', 'modular'],
		color: '#6366F1'
	},
	{
		id: 'patch-wallet',
		name: 'Patch Wallet',
		descriptionKey: 'chain_tools.tools.patch_wallet.description',
		url: 'https://patchwallet.com',
		icon: Wallet,
		category: 'wallet',
		tags: ['smart-wallet', 'social', 'email', 'embedded'],
		color: '#10B981'
	},

	// ========== Account Abstraction Infrastructure ==========
	{
		id: 'pimlico',
		name: 'Pimlico',
		descriptionKey: 'chain_tools.tools.pimlico.description',
		url: 'https://pimlico.io',
		icon: Settings,
		category: 'wallet',
		tags: ['bundler', 'paymaster', 'erc-4337', 'infrastructure'],
		color: '#8B5CF6'
	},
	{
		id: 'stackup',
		name: 'Stackup',
		descriptionKey: 'chain_tools.tools.stackup.description',
		url: 'https://stackup.sh',
		icon: Settings,
		category: 'wallet',
		tags: ['bundler', 'paymaster', 'erc-4337', 'sdk'],
		color: '#3B82F6'
	},
	{
		id: 'biconomy',
		name: 'Biconomy',
		descriptionKey: 'chain_tools.tools.biconomy.description',
		url: 'https://biconomy.io',
		icon: Settings,
		category: 'wallet',
		tags: ['account-abstraction', 'gasless', 'sdk', 'paymaster'],
		color: '#FF4E17'
	},
	{
		id: 'alchemy-aa',
		name: 'Alchemy Account Kit',
		descriptionKey: 'chain_tools.tools.alchemy_aa.description',
		url: 'https://accountkit.alchemy.com',
		icon: Settings,
		category: 'wallet',
		tags: ['account-abstraction', 'sdk', 'smart-wallet', 'infrastructure'],
		color: '#0C5ADB'
	},
	{
		id: 'zerodev',
		name: 'ZeroDev',
		descriptionKey: 'chain_tools.tools.zerodev.description',
		url: 'https://zerodev.app',
		icon: Settings,
		category: 'wallet',
		tags: ['account-abstraction', 'sdk', 'kernel', 'modular'],
		color: '#6366F1'
	},
	{
		id: 'particle-network',
		name: 'Particle Network',
		descriptionKey: 'chain_tools.tools.particle_network.description',
		url: 'https://particle.network',
		icon: Settings,
		category: 'wallet',
		tags: ['wallet-as-a-service', 'social-login', 'sdk', 'embedded'],
		color: '#9945FF'
	},

	// ========== Embedded Wallet Providers ==========
	{
		id: 'privy',
		name: 'Privy',
		descriptionKey: 'chain_tools.tools.privy.description',
		url: 'https://www.privy.io',
		icon: KeyRound,
		category: 'wallet',
		tags: ['embedded', 'social-login', 'onboarding'],
		color: '#6D28D9'
	},
	{
		id: 'dynamic',
		name: 'Dynamic',
		descriptionKey: 'chain_tools.tools.dynamic.description',
		url: 'https://www.dynamic.xyz',
		icon: KeyRound,
		category: 'wallet',
		tags: ['embedded', 'authentication', 'multi-wallet'],
		color: '#6366F1'
	},

	// ========== Hardware Wallets ==========
	{
		id: 'ledger',
		name: 'Ledger',
		descriptionKey: 'chain_tools.tools.ledger.description',
		url: 'https://www.ledger.com',
		icon: Lock,
		category: 'wallet',
		tags: ['hardware', 'cold-storage', 'security'],
		color: '#000000'
	},
	{
		id: 'trezor',
		name: 'Trezor',
		descriptionKey: 'chain_tools.tools.trezor.description',
		url: 'https://trezor.io',
		icon: Lock,
		category: 'wallet',
		tags: ['hardware', 'cold-storage', 'security'],
		color: '#000000'
	},

	// ========== Mobile & Desktop Wallets ==========
	{
		id: 'coinbase-wallet',
		name: 'Coinbase Wallet',
		descriptionKey: 'chain_tools.tools.coinbase_wallet.description',
		url: 'https://www.coinbase.com/wallet',
		icon: Wallet,
		category: 'wallet',
		tags: ['wallet', 'extension', 'mobile', 'defi'],
		color: '#0052FF'
	},
	{
		id: 'trust-wallet',
		name: 'Trust Wallet',
		descriptionKey: 'chain_tools.tools.trust_wallet.description',
		url: 'https://trustwallet.com',
		icon: Wallet,
		category: 'wallet',
		tags: ['wallet', 'mobile', 'multi-chain'],
		color: '#0500FF'
	},
	{
		id: 'argent',
		name: 'Argent',
		descriptionKey: 'chain_tools.tools.argent.description',
		url: 'https://www.argent.xyz',
		icon: Wallet,
		category: 'wallet',
		tags: ['wallet', 'smart-wallet', 'recovery', 'starknet'],
		color: '#FF875B'
	},
	{
		id: 'sequence',
		name: 'Sequence',
		descriptionKey: 'chain_tools.tools.sequence.description',
		url: 'https://sequence.xyz',
		icon: Wallet,
		category: 'wallet',
		tags: ['wallet', 'smart-wallet', 'gaming', 'embedded'],
		color: '#000000'
	},

	// ========== Solana & Multi-chain Wallets ==========
	{
		id: 'phantom-wallet',
		name: 'Phantom',
		descriptionKey: 'chain_tools.tools.phantom_wallet.description',
		url: 'https://phantom.app',
		icon: Wallet,
		category: 'wallet',
		tags: ['solana', 'ethereum', 'multichain', 'browser'],
		chains: ['Solana', 'Ethereum', 'Polygon', 'Bitcoin'],
		color: '#AB9FF2'
	},
	{
		id: 'backpack-wallet',
		name: 'Backpack',
		descriptionKey: 'chain_tools.tools.backpack_wallet.description',
		url: 'https://backpack.app',
		icon: Wallet,
		category: 'wallet',
		tags: ['solana', 'xnft', 'multichain', 'browser'],
		chains: ['Solana', 'Ethereum'],
		color: '#E33E3E'
	},
	{
		id: 'exodus-wallet',
		name: 'Exodus',
		descriptionKey: 'chain_tools.tools.exodus_wallet.description',
		url: 'https://exodus.com',
		icon: Wallet,
		category: 'wallet',
		tags: ['multichain', 'desktop', 'mobile', 'swap'],
		color: '#1F2235'
	},
	{
		id: 'solflare',
		name: 'Solflare',
		descriptionKey: 'chain_tools.tools.solflare.description',
		url: 'https://solflare.com',
		icon: Wallet,
		category: 'wallet',
		tags: ['solana', 'staking', 'browser', 'mobile'],
		chains: ['Solana'],
		color: '#FC7227'
	},

	// ========== Cosmos & IBC Wallets ==========
	{
		id: 'keplr-wallet',
		name: 'Keplr',
		descriptionKey: 'chain_tools.tools.keplr_wallet.description',
		url: 'https://keplr.app',
		icon: Wallet,
		category: 'wallet',
		tags: ['cosmos', 'ibc', 'staking', 'browser'],
		chains: ['Cosmos', 'Osmosis', 'Juno', 'Celestia'],
		color: '#5F4AE8'
	},
	{
		id: 'leap-wallet',
		name: 'Leap Wallet',
		descriptionKey: 'chain_tools.tools.leap_wallet.description',
		url: 'https://leapwallet.io',
		icon: Wallet,
		category: 'wallet',
		tags: ['cosmos', 'ibc', 'mobile', 'browser'],
		chains: ['Cosmos', 'Sei', 'Celestia', 'dYdX'],
		color: '#29A874'
	},

	// ========== Other Wallets ==========
	{
		id: 'xdefi-wallet',
		name: 'XDEFI',
		descriptionKey: 'chain_tools.tools.xdefi_wallet.description',
		url: 'https://xdefi.io',
		icon: Wallet,
		category: 'wallet',
		tags: ['multichain', 'defi', 'browser', 'swap'],
		chains: ['Ethereum', 'BNB Chain', 'Polygon', 'Avalanche', 'Bitcoin'],
		color: '#0052FF'
	},
	{
		id: 'brave-wallet',
		name: 'Brave Wallet',
		descriptionKey: 'chain_tools.tools.brave_wallet.description',
		url: 'https://brave.com/wallet',
		icon: Wallet,
		category: 'wallet',
		tags: ['browser', 'privacy', 'multichain', 'built-in'],
		chains: ['Ethereum', 'Solana', 'Polygon'],
		color: '#FB542B'
	},
	{
		id: 'block-wallet',
		name: 'BlockWallet',
		descriptionKey: 'chain_tools.tools.block_wallet.description',
		url: 'https://blockwallet.io',
		icon: Wallet,
		category: 'wallet',
		tags: ['privacy', 'browser', 'evm', 'non-custodial'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism'],
		color: '#000000'
	},
	{
		id: 'okx-wallet',
		name: 'OKX Wallet',
		descriptionKey: 'chain_tools.tools.okx_wallet.description',
		url: 'https://okx.com/web3',
		icon: Wallet,
		category: 'wallet',
		tags: ['multichain', 'defi', 'nft', 'browser'],
		chains: ['Ethereum', 'Solana', 'Bitcoin', 'TON', 'Tron'],
		color: '#000000'
	}
];
