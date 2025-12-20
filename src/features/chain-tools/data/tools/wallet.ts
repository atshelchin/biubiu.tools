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
		color: '#10B981'
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
		color: '#F59E0B'
	},
	{
		id: 'biubiu-wallet-generator',
		name: 'Wallet Generator',
		descriptionKey: 'chain_tools.tools.biubiu_wallet_generator.description',
		url: '/apps/wallet-generator',
		icon: KeyRound,
		category: 'wallet',
		tags: ['generator', 'mnemonic', 'hd-wallet', 'batch', 'biubiu'],
		color: '#8B5CF6'
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
		color: '#3B82F6'
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
		color: '#8697FF',
		isFeatured: true
	},
	{
		id: 'rainbow',
		name: 'Rainbow',
		descriptionKey: 'chain_tools.tools.rainbow.description',
		url: 'https://rainbow.me',
		icon: Wallet,
		category: 'wallet',
		tags: ['wallet', 'mobile', 'ethereum', 'nft'],
		color: '#FF4BA6',
		isFeatured: true
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
		color: '#000000',
		isFeatured: true
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
	},

	// ========== Additional Wallets ==========
	{
		id: 'core-wallet',
		name: 'Core Wallet',
		descriptionKey: 'chain_tools.tools.core_wallet.description',
		url: 'https://core.app',
		icon: Wallet,
		category: 'wallet',
		tags: ['avalanche', 'multichain', 'browser', 'mobile'],
		chains: ['Avalanche', 'Ethereum', 'Bitcoin'],
		color: '#E84142'
	},
	{
		id: 'enkrypt-wallet',
		name: 'Enkrypt',
		descriptionKey: 'chain_tools.tools.enkrypt_wallet.description',
		url: 'https://enkrypt.com',
		icon: Wallet,
		category: 'wallet',
		tags: ['multichain', 'browser', 'mew', 'polkadot'],
		chains: ['Ethereum', 'Polkadot', 'Bitcoin'],
		color: '#C549FF'
	},
	{
		id: 'talisman-wallet',
		name: 'Talisman',
		descriptionKey: 'chain_tools.tools.talisman_wallet.description',
		url: 'https://talisman.xyz',
		icon: Wallet,
		category: 'wallet',
		tags: ['polkadot', 'ethereum', 'browser', 'portfolio'],
		chains: ['Polkadot', 'Kusama', 'Ethereum'],
		color: '#D5FF5C'
	},
	{
		id: 'subwallet',
		name: 'SubWallet',
		descriptionKey: 'chain_tools.tools.subwallet.description',
		url: 'https://subwallet.app',
		icon: Wallet,
		category: 'wallet',
		tags: ['polkadot', 'substrate', 'browser', 'mobile'],
		chains: ['Polkadot', 'Kusama', 'Astar'],
		color: '#004BFF'
	},
	{
		id: 'polkadot-js',
		name: 'Polkadot.js',
		descriptionKey: 'chain_tools.tools.polkadot_js.description',
		url: 'https://polkadot.js.org/extension',
		icon: Wallet,
		category: 'wallet',
		tags: ['polkadot', 'substrate', 'browser', 'official'],
		chains: ['Polkadot', 'Kusama'],
		color: '#E6007A'
	},
	{
		id: 'nami-wallet',
		name: 'Nami',
		descriptionKey: 'chain_tools.tools.nami_wallet.description',
		url: 'https://namiwallet.io',
		icon: Wallet,
		category: 'wallet',
		tags: ['cardano', 'browser', 'defi', 'nft'],
		chains: ['Cardano'],
		color: '#349EA3'
	},
	{
		id: 'eternl-wallet',
		name: 'Eternl',
		descriptionKey: 'chain_tools.tools.eternl_wallet.description',
		url: 'https://eternl.io',
		icon: Wallet,
		category: 'wallet',
		tags: ['cardano', 'browser', 'staking', 'defi'],
		chains: ['Cardano'],
		color: '#1A44B7'
	},
	{
		id: 'yoroi-wallet',
		name: 'Yoroi',
		descriptionKey: 'chain_tools.tools.yoroi_wallet.description',
		url: 'https://yoroi-wallet.com',
		icon: Wallet,
		category: 'wallet',
		tags: ['cardano', 'browser', 'mobile', 'emurgo'],
		chains: ['Cardano'],
		color: '#3154CB'
	},
	{
		id: 'temple-wallet',
		name: 'Temple Wallet',
		descriptionKey: 'chain_tools.tools.temple_wallet.description',
		url: 'https://templewallet.com',
		icon: Wallet,
		category: 'wallet',
		tags: ['tezos', 'browser', 'defi', 'nft'],
		chains: ['Tezos'],
		color: '#0D61FF'
	},
	{
		id: 'kukai-wallet',
		name: 'Kukai',
		descriptionKey: 'chain_tools.tools.kukai_wallet.description',
		url: 'https://wallet.kukai.app',
		icon: Wallet,
		category: 'wallet',
		tags: ['tezos', 'browser', 'social-login', 'nft'],
		chains: ['Tezos'],
		color: '#476DFF'
	},
	{
		id: 'petra-wallet',
		name: 'Petra',
		descriptionKey: 'chain_tools.tools.petra_wallet.description',
		url: 'https://petra.app',
		icon: Wallet,
		category: 'wallet',
		tags: ['aptos', 'browser', 'mobile', 'official'],
		chains: ['Aptos'],
		color: '#FF5733'
	},
	{
		id: 'martian-wallet',
		name: 'Martian',
		descriptionKey: 'chain_tools.tools.martian_wallet.description',
		url: 'https://martianwallet.xyz',
		icon: Wallet,
		category: 'wallet',
		tags: ['aptos', 'sui', 'browser', 'mobile'],
		chains: ['Aptos', 'Sui'],
		color: '#00D1A0'
	},
	{
		id: 'sui-wallet',
		name: 'Sui Wallet',
		descriptionKey: 'chain_tools.tools.sui_wallet.description',
		url: 'https://suiwallet.com',
		icon: Wallet,
		category: 'wallet',
		tags: ['sui', 'browser', 'mobile', 'official'],
		chains: ['Sui'],
		color: '#6FBCF0'
	},
	{
		id: 'suiet-wallet',
		name: 'Suiet',
		descriptionKey: 'chain_tools.tools.suiet_wallet.description',
		url: 'https://suiet.app',
		icon: Wallet,
		category: 'wallet',
		tags: ['sui', 'browser', 'open-source'],
		chains: ['Sui'],
		color: '#8DD4F5'
	},
	{
		id: 'tonkeeper',
		name: 'Tonkeeper',
		descriptionKey: 'chain_tools.tools.tonkeeper.description',
		url: 'https://tonkeeper.com',
		icon: Wallet,
		category: 'wallet',
		tags: ['ton', 'mobile', 'browser', 'staking'],
		chains: ['TON'],
		color: '#0088CC'
	},
	{
		id: 'tonhub',
		name: 'Tonhub',
		descriptionKey: 'chain_tools.tools.tonhub.description',
		url: 'https://tonhub.com',
		icon: Wallet,
		category: 'wallet',
		tags: ['ton', 'mobile', 'staking', 'whales'],
		chains: ['TON'],
		color: '#0098EA'
	},
	{
		id: 'mytonwallet',
		name: 'MyTonWallet',
		descriptionKey: 'chain_tools.tools.mytonwallet.description',
		url: 'https://mytonwallet.io',
		icon: Wallet,
		category: 'wallet',
		tags: ['ton', 'browser', 'desktop', 'open-source'],
		chains: ['TON'],
		color: '#0088CC'
	},
	{
		id: 'sender-wallet',
		name: 'Sender Wallet',
		descriptionKey: 'chain_tools.tools.sender_wallet.description',
		url: 'https://sender.org',
		icon: Wallet,
		category: 'wallet',
		tags: ['near', 'browser', 'mobile', 'defi'],
		chains: ['NEAR'],
		color: '#00C08B'
	},
	{
		id: 'meteor-wallet',
		name: 'Meteor Wallet',
		descriptionKey: 'chain_tools.tools.meteor_wallet.description',
		url: 'https://meteorwallet.app',
		icon: Wallet,
		category: 'wallet',
		tags: ['near', 'browser', 'defi', 'nft'],
		chains: ['NEAR'],
		color: '#000000'
	},
	{
		id: 'here-wallet',
		name: 'HERE Wallet',
		descriptionKey: 'chain_tools.tools.here_wallet.description',
		url: 'https://herewallet.app',
		icon: Wallet,
		category: 'wallet',
		tags: ['near', 'mobile', 'hot', 'staking'],
		chains: ['NEAR'],
		color: '#2B2F44'
	},
	{
		id: 'coin98-wallet',
		name: 'Coin98',
		descriptionKey: 'chain_tools.tools.coin98_wallet.description',
		url: 'https://coin98.com',
		icon: Wallet,
		category: 'wallet',
		tags: ['multichain', 'defi', 'browser', 'mobile'],
		chains: ['Ethereum', 'Solana', 'BSC', 'Polygon'],
		color: '#D9B432'
	},
	{
		id: 'bitget-wallet',
		name: 'Bitget Wallet',
		descriptionKey: 'chain_tools.tools.bitget_wallet.description',
		url: 'https://web3.bitget.com',
		icon: Wallet,
		category: 'wallet',
		tags: ['multichain', 'swap', 'browser', 'mobile'],
		chains: ['Ethereum', 'Solana', 'BSC', 'Polygon'],
		color: '#00F0FF'
	},
	{
		id: 'safepal-wallet',
		name: 'SafePal',
		descriptionKey: 'chain_tools.tools.safepal_wallet.description',
		url: 'https://safepal.com',
		icon: Lock,
		category: 'wallet',
		tags: ['hardware', 'software', 'multichain', 'binance'],
		chains: ['Ethereum', 'Solana', 'BSC', 'Bitcoin'],
		color: '#4A22E7'
	},
	{
		id: 'onekey-wallet',
		name: 'OneKey',
		descriptionKey: 'chain_tools.tools.onekey_wallet.description',
		url: 'https://onekey.so',
		icon: Lock,
		category: 'wallet',
		tags: ['hardware', 'open-source', 'multichain', 'browser'],
		chains: ['Ethereum', 'Bitcoin', 'Solana'],
		color: '#00B812'
	},
	{
		id: 'ellipal-wallet',
		name: 'ELLIPAL',
		descriptionKey: 'chain_tools.tools.ellipal_wallet.description',
		url: 'https://ellipal.com',
		icon: Lock,
		category: 'wallet',
		tags: ['hardware', 'air-gapped', 'cold-storage', 'multichain'],
		chains: ['Ethereum', 'Bitcoin'],
		color: '#F7931A'
	},
	{
		id: 'dcent-wallet',
		name: "D'CENT",
		descriptionKey: 'chain_tools.tools.dcent_wallet.description',
		url: 'https://dcentwallet.com',
		icon: Lock,
		category: 'wallet',
		tags: ['hardware', 'biometric', 'multichain', 'mobile'],
		chains: ['Ethereum', 'Bitcoin', 'Polygon'],
		color: '#1A73E8'
	},
	{
		id: 'coolwallet',
		name: 'CoolWallet',
		descriptionKey: 'chain_tools.tools.coolwallet.description',
		url: 'https://coolwallet.io',
		icon: Lock,
		category: 'wallet',
		tags: ['hardware', 'card', 'bluetooth', 'mobile'],
		chains: ['Ethereum', 'Bitcoin', 'Solana'],
		color: '#4D9EFF'
	},
	{
		id: 'imtoken',
		name: 'imToken',
		descriptionKey: 'chain_tools.tools.imtoken.description',
		url: 'https://token.im',
		icon: Wallet,
		category: 'wallet',
		tags: ['mobile', 'multichain', 'defi', 'asia'],
		chains: ['Ethereum', 'BSC', 'Polygon'],
		color: '#0080FF'
	},
	{
		id: 'tokenpocket',
		name: 'TokenPocket',
		descriptionKey: 'chain_tools.tools.tokenpocket.description',
		url: 'https://tokenpocket.pro',
		icon: Wallet,
		category: 'wallet',
		tags: ['mobile', 'multichain', 'defi', 'dapp-browser'],
		chains: ['Ethereum', 'BSC', 'Tron', 'EOS'],
		color: '#2980FE'
	},
	{
		id: 'math-wallet',
		name: 'Math Wallet',
		descriptionKey: 'chain_tools.tools.math_wallet.description',
		url: 'https://mathwallet.org',
		icon: Wallet,
		category: 'wallet',
		tags: ['multichain', 'browser', 'mobile', 'cloud'],
		chains: ['Ethereum', 'BSC', 'Polkadot', 'Solana'],
		color: '#000000'
	},
	{
		id: 'alpha-wallet',
		name: 'AlphaWallet',
		descriptionKey: 'chain_tools.tools.alpha_wallet.description',
		url: 'https://alphawallet.com',
		icon: Wallet,
		category: 'wallet',
		tags: ['mobile', 'ethereum', 'tokenscript', 'open-source'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum'],
		color: '#009AE5'
	},
	{
		id: 'status-wallet',
		name: 'Status',
		descriptionKey: 'chain_tools.tools.status_wallet.description',
		url: 'https://status.app',
		icon: Wallet,
		category: 'wallet',
		tags: ['mobile', 'messenger', 'privacy', 'ethereum'],
		chains: ['Ethereum', 'Optimism', 'Arbitrum'],
		color: '#4360DF'
	},
	{
		id: 'unstoppable-wallet',
		name: 'Unstoppable Wallet',
		descriptionKey: 'chain_tools.tools.unstoppable_wallet.description',
		url: 'https://unstoppable.money',
		icon: Wallet,
		category: 'wallet',
		tags: ['mobile', 'privacy', 'defi', 'analytics'],
		chains: ['Ethereum', 'Bitcoin', 'BSC'],
		color: '#FFCA28'
	},
	{
		id: 'exodus-wallet-ext',
		name: 'Exodus Extension',
		descriptionKey: 'chain_tools.tools.exodus_wallet_ext.description',
		url: 'https://exodus.com/browser-extension',
		icon: Wallet,
		category: 'wallet',
		tags: ['browser', 'multichain', 'swap', 'portfolio'],
		chains: ['Ethereum', 'Solana', 'Bitcoin'],
		color: '#7B3FE4'
	},
	{
		id: 'myetherwallet',
		name: 'MyEtherWallet',
		descriptionKey: 'chain_tools.tools.myetherwallet.description',
		url: 'https://myetherwallet.com',
		icon: Wallet,
		category: 'wallet',
		tags: ['ethereum', 'web', 'mobile', 'enkrypt'],
		chains: ['Ethereum'],
		color: '#1EB8FC'
	},
	{
		id: 'mycrypto',
		name: 'MyCrypto',
		descriptionKey: 'chain_tools.tools.mycrypto.description',
		url: 'https://mycrypto.com',
		icon: Wallet,
		category: 'wallet',
		tags: ['ethereum', 'web', 'desktop', 'security'],
		chains: ['Ethereum'],
		color: '#007896'
	},
	{
		id: 'atomic-wallet',
		name: 'Atomic Wallet',
		descriptionKey: 'chain_tools.tools.atomic_wallet.description',
		url: 'https://atomicwallet.io',
		icon: Wallet,
		category: 'wallet',
		tags: ['desktop', 'mobile', 'swap', 'staking'],
		chains: ['Ethereum', 'Bitcoin', 'Solana'],
		color: '#2E3148'
	},
	{
		id: 'guarda-wallet',
		name: 'Guarda',
		descriptionKey: 'chain_tools.tools.guarda_wallet.description',
		url: 'https://guarda.com',
		icon: Wallet,
		category: 'wallet',
		tags: ['multichain', 'web', 'desktop', 'mobile'],
		chains: ['Ethereum', 'Bitcoin', 'BSC'],
		color: '#00C3A5'
	},
	{
		id: 'edge-wallet',
		name: 'Edge',
		descriptionKey: 'chain_tools.tools.edge_wallet.description',
		url: 'https://edge.app',
		icon: Wallet,
		category: 'wallet',
		tags: ['mobile', 'multichain', 'privacy', 'swap'],
		chains: ['Ethereum', 'Bitcoin', 'Monero'],
		color: '#0D2145'
	},
	{
		id: 'crypto-com-defi',
		name: 'Crypto.com DeFi Wallet',
		descriptionKey: 'chain_tools.tools.crypto_com_defi.description',
		url: 'https://crypto.com/defi-wallet',
		icon: Wallet,
		category: 'wallet',
		tags: ['mobile', 'defi', 'cronos', 'staking'],
		chains: ['Ethereum', 'Cronos', 'Cosmos'],
		color: '#002D74'
	},
	{
		id: 'lobstr-wallet',
		name: 'LOBSTR',
		descriptionKey: 'chain_tools.tools.lobstr_wallet.description',
		url: 'https://lobstr.co',
		icon: Wallet,
		category: 'wallet',
		tags: ['stellar', 'mobile', 'web', 'trading'],
		chains: ['Stellar'],
		color: '#000000'
	},
	{
		id: 'freighter-wallet',
		name: 'Freighter',
		descriptionKey: 'chain_tools.tools.freighter_wallet.description',
		url: 'https://freighter.app',
		icon: Wallet,
		category: 'wallet',
		tags: ['stellar', 'browser', 'soroban'],
		chains: ['Stellar'],
		color: '#7B61FF'
	},
	{
		id: 'tronlink',
		name: 'TronLink',
		descriptionKey: 'chain_tools.tools.tronlink.description',
		url: 'https://tronlink.org',
		icon: Wallet,
		category: 'wallet',
		tags: ['tron', 'browser', 'mobile', 'official'],
		chains: ['Tron'],
		color: '#FF0000'
	},
	{
		id: 'multis',
		name: 'Multis',
		descriptionKey: 'chain_tools.tools.multis.description',
		url: 'https://multis.co',
		icon: Lock,
		category: 'wallet',
		tags: ['multisig', 'business', 'ethereum', 'payroll'],
		chains: ['Ethereum'],
		color: '#5850EC'
	},
	{
		id: 'squads',
		name: 'Squads',
		descriptionKey: 'chain_tools.tools.squads.description',
		url: 'https://squads.so',
		icon: Lock,
		category: 'wallet',
		tags: ['multisig', 'solana', 'treasury', 'dao'],
		chains: ['Solana'],
		color: '#FDD835'
	},
	{
		id: 'den-wallet',
		name: 'Den',
		descriptionKey: 'chain_tools.tools.den_wallet.description',
		url: 'https://onchainden.com',
		icon: Lock,
		category: 'wallet',
		tags: ['smart-wallet', 'automation', 'defi', 'ethereum'],
		chains: ['Ethereum', 'Arbitrum', 'Optimism'],
		color: '#6366F1'
	},
	{
		id: 'instadapp',
		name: 'Instadapp',
		descriptionKey: 'chain_tools.tools.instadapp.description',
		url: 'https://instadapp.io',
		icon: Settings,
		category: 'wallet',
		tags: ['smart-wallet', 'defi', 'automation', 'aggregator'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism'],
		color: '#3F75FF'
	},
	{
		id: 'fuelet-wallet',
		name: 'Fuelet',
		descriptionKey: 'chain_tools.tools.fuelet_wallet.description',
		url: 'https://fuelet.app',
		icon: Wallet,
		category: 'wallet',
		tags: ['fuel', 'browser', 'mobile', 'modular'],
		chains: ['Fuel'],
		color: '#00F58C'
	},
	{
		id: 'fuel-wallet',
		name: 'Fuel Wallet',
		descriptionKey: 'chain_tools.tools.fuel_wallet.description',
		url: 'https://wallet.fuel.network',
		icon: Wallet,
		category: 'wallet',
		tags: ['fuel', 'browser', 'official', 'modular'],
		chains: ['Fuel'],
		color: '#04F182'
	},
	{
		id: 'braavos-wallet',
		name: 'Braavos',
		descriptionKey: 'chain_tools.tools.braavos_wallet.description',
		url: 'https://braavos.app',
		icon: Wallet,
		category: 'wallet',
		tags: ['starknet', 'browser', 'mobile', 'smart-wallet'],
		chains: ['StarkNet'],
		color: '#E69A00'
	}
];
