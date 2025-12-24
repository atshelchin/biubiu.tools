/**
 * Bridge Tools - Cross-chain bridges and interoperability solutions
 */
import { ArrowLeftRight, Globe, RefreshCw, CircuitBoard, Zap, Shield } from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const bridgeTools: ExternalTool[] = [
	// ========== Major Bridges ==========
	{
		id: 'across',
		name: 'Across Protocol',
		descriptionKey: 'chain-tools.tools.across.description',
		url: 'https://across.to',
		icon: ArrowLeftRight,
		category: 'bridge',
		tags: ['bridge', 'cross-chain', 'fast', 'cheap'],
		chains: ['Ethereum', 'Arbitrum', 'Optimism', 'Polygon', 'Base'],
		color: '#6CF9D8',
		isFeatured: true
	},
	{
		id: 'stargate',
		name: 'Stargate',
		descriptionKey: 'chain-tools.tools.stargate.description',
		url: 'https://stargate.finance',
		icon: Globe,
		category: 'bridge',
		tags: ['bridge', 'omnichain', 'layerzero'],
		chains: ['Ethereum', 'Arbitrum', 'Optimism', 'Polygon', 'Avalanche'],
		color: '#8B5CF6'
	},
	{
		id: 'orbiter',
		name: 'Orbiter Finance',
		descriptionKey: 'chain-tools.tools.orbiter.description',
		url: 'https://www.orbiter.finance',
		icon: RefreshCw,
		category: 'bridge',
		tags: ['bridge', 'l2', 'rollup', 'fast'],
		chains: ['Ethereum', 'Arbitrum', 'Optimism', 'zkSync', 'Base'],
		color: '#9D4EDD'
	},

	// ========== L2 Bridges ==========
	{
		id: 'hop',
		name: 'Hop Protocol',
		descriptionKey: 'chain-tools.tools.hop.description',
		url: 'https://hop.exchange',
		icon: ArrowLeftRight,
		category: 'bridge',
		tags: ['bridge', 'l2', 'rollup', 'fast'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism'],
		color: '#B32EFF',
		isFeatured: true
	},
	{
		id: 'synapse',
		name: 'Synapse',
		descriptionKey: 'chain-tools.tools.synapse.description',
		url: 'https://synapseprotocol.com',
		icon: RefreshCw,
		category: 'bridge',
		tags: ['bridge', 'cross-chain', 'multi-chain'],
		chains: ['Ethereum', 'Arbitrum', 'Avalanche', 'BSC'],
		color: '#FF00FF'
	},
	{
		id: 'cbridge',
		name: 'cBridge',
		descriptionKey: 'chain-tools.tools.cbridge.description',
		url: 'https://cbridge.celer.network',
		icon: ArrowLeftRight,
		category: 'bridge',
		tags: ['bridge', 'celer', 'fast', 'cheap'],
		chains: ['Ethereum', 'BSC', 'Polygon', 'Arbitrum'],
		color: '#46C9E5'
	},
	{
		id: 'multichain',
		name: 'Multichain',
		descriptionKey: 'chain-tools.tools.multichain.description',
		url: 'https://multichain.org',
		icon: Globe,
		category: 'bridge',
		tags: ['bridge', 'router', 'multi-chain'],
		chains: ['Ethereum', 'BSC', 'Fantom', 'Avalanche'],
		color: '#463DE3'
	},

	// ========== Messaging Bridges ==========
	{
		id: 'wormhole',
		name: 'Wormhole',
		descriptionKey: 'chain-tools.tools.wormhole.description',
		url: 'https://wormhole.com',
		icon: CircuitBoard,
		category: 'bridge',
		tags: ['bridge', 'messaging', 'cross-chain'],
		chains: ['Ethereum', 'Solana', 'BSC', 'Avalanche'],
		color: '#FFFFFF'
	},
	{
		id: 'socket',
		name: 'Socket (Bungee)',
		descriptionKey: 'chain-tools.tools.socket.description',
		url: 'https://bungee.exchange',
		icon: Zap,
		category: 'bridge',
		tags: ['aggregator', 'bridge', 'best-route'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism'],
		color: '#8247E5'
	},
	{
		id: 'rhino',
		name: 'rhino.fi',
		descriptionKey: 'chain-tools.tools.rhino.description',
		url: 'https://rhino.fi',
		icon: Shield,
		category: 'bridge',
		tags: ['bridge', 'aggregator', 'self-custodial'],
		chains: ['Ethereum', 'Arbitrum', 'zkSync', 'Linea'],
		color: '#5C45FF'
	},

	// ========== Bridge Aggregators ==========
	{
		id: 'li-fi',
		name: 'LI.FI',
		descriptionKey: 'chain-tools.tools.li_fi.description',
		url: 'https://li.fi',
		icon: ArrowLeftRight,
		category: 'bridge',
		tags: ['aggregator', 'bridge', 'multi-chain', 'swap'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'BSC', 'Avalanche'],
		color: '#BF40BF'
	},
	{
		id: 'bungee',
		name: 'Bungee',
		descriptionKey: 'chain-tools.tools.bungee.description',
		url: 'https://bungee.exchange',
		icon: ArrowLeftRight,
		category: 'bridge',
		tags: ['aggregator', 'bridge', 'refuel', 'multi-chain'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'BSC'],
		color: '#6366F1'
	},
	{
		id: 'jumper',
		name: 'Jumper',
		descriptionKey: 'chain-tools.tools.jumper.description',
		url: 'https://jumper.exchange',
		icon: ArrowLeftRight,
		category: 'bridge',
		tags: ['aggregator', 'bridge', 'lifi', 'multi-chain'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'BSC', 'Base'],
		color: '#8B5CF6'
	},

	// ========== Specialized Bridges ==========
	{
		id: 'hyphen',
		name: 'Hyphen (Biconomy)',
		descriptionKey: 'chain-tools.tools.hyphen.description',
		url: 'https://hyphen.biconomy.io',
		icon: Zap,
		category: 'bridge',
		tags: ['bridge', 'instant', 'low-fee'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism'],
		color: '#FF4E17'
	},
	{
		id: 'connext',
		name: 'Connext',
		descriptionKey: 'chain-tools.tools.connext.description',
		url: 'https://bridge.connext.network',
		icon: ArrowLeftRight,
		category: 'bridge',
		tags: ['bridge', 'trustless', 'xchain'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'BSC'],
		color: '#8247E5'
	},
	{
		id: 'debridge',
		name: 'deBridge',
		descriptionKey: 'chain-tools.tools.debridge.description',
		url: 'https://debridge.finance',
		icon: ArrowLeftRight,
		category: 'bridge',
		tags: ['bridge', 'cross-chain', 'liquidity'],
		chains: ['Ethereum', 'BSC', 'Polygon', 'Arbitrum', 'Solana'],
		color: '#7E5FFF'
	},
	{
		id: 'allbridge',
		name: 'Allbridge',
		descriptionKey: 'chain-tools.tools.allbridge.description',
		url: 'https://allbridge.io',
		icon: Globe,
		category: 'bridge',
		tags: ['bridge', 'stablecoin', 'multi-chain'],
		chains: ['Ethereum', 'BSC', 'Polygon', 'Solana', 'Tron'],
		color: '#1B68D1'
	},
	{
		id: 'portal',
		name: 'Portal Bridge',
		descriptionKey: 'chain-tools.tools.portal.description',
		url: 'https://portalbridge.com',
		icon: CircuitBoard,
		category: 'bridge',
		tags: ['bridge', 'wormhole', 'multi-chain'],
		chains: ['Ethereum', 'Solana', 'BSC', 'Polygon'],
		color: '#FFFFFF'
	},
	{
		id: 'squid',
		name: 'Squid Router',
		descriptionKey: 'chain-tools.tools.squid.description',
		url: 'https://www.squidrouter.com',
		icon: ArrowLeftRight,
		category: 'bridge',
		tags: ['bridge', 'axelar', 'cross-chain-swap'],
		chains: ['Ethereum', 'Polygon', 'Avalanche', 'Arbitrum'],
		color: '#FF0080'
	},
	{
		id: 'owlto',
		name: 'Owlto Finance',
		descriptionKey: 'chain-tools.tools.owlto.description',
		url: 'https://owlto.finance',
		icon: ArrowLeftRight,
		category: 'bridge',
		tags: ['bridge', 'l2', 'fast', 'cheap'],
		chains: ['Ethereum', 'Arbitrum', 'Optimism', 'zkSync', 'Base', 'Linea'],
		color: '#F7931A'
	},
	{
		id: 'superbridge',
		name: 'Superbridge',
		descriptionKey: 'chain-tools.tools.superbridge.description',
		url: 'https://superbridge.app',
		icon: ArrowLeftRight,
		category: 'bridge',
		tags: ['bridge', 'optimism', 'base', 'l2'],
		chains: ['Ethereum', 'Optimism', 'Base'],
		color: '#EF4444'
	},
	{
		id: 'relay',
		name: 'Relay',
		descriptionKey: 'chain-tools.tools.relay.description',
		url: 'https://relay.link',
		icon: Zap,
		category: 'bridge',
		tags: ['bridge', 'instant', 'cross-chain', 'fast'],
		chains: ['Ethereum', 'Base', 'Zora', 'Optimism'],
		color: '#3B82F6'
	},
	{
		id: 'symbiosis',
		name: 'Symbiosis',
		descriptionKey: 'chain-tools.tools.symbiosis.description',
		url: 'https://symbiosis.finance',
		icon: ArrowLeftRight,
		category: 'bridge',
		tags: ['bridge', 'dex', 'cross-chain', 'liquidity'],
		chains: ['Ethereum', 'BSC', 'Polygon', 'Avalanche', 'Arbitrum'],
		color: '#00FF94'
	},
	{
		id: 'dln',
		name: 'DLN',
		descriptionKey: 'chain-tools.tools.dln.description',
		url: 'https://dln.trade',
		icon: ArrowLeftRight,
		category: 'bridge',
		tags: ['bridge', 'debridge', 'cross-chain', 'limit-orders'],
		chains: ['Ethereum', 'BSC', 'Polygon', 'Arbitrum', 'Solana'],
		color: '#BF40BF'
	},
	{
		id: 'circle-cctp',
		name: 'Circle CCTP',
		descriptionKey: 'chain-tools.tools.circle_cctp.description',
		url: 'https://www.circle.com/en/cross-chain-transfer-protocol',
		icon: ArrowLeftRight,
		category: 'bridge',
		tags: ['bridge', 'usdc', 'native', 'burn-mint'],
		chains: ['Ethereum', 'Avalanche', 'Arbitrum', 'Optimism', 'Base'],
		color: '#2775CA'
	},

	// ========== New Bridge Tools ==========
	{
		id: 'debridge-dln',
		name: 'deBridge DLN',
		descriptionKey: 'chain-tools.tools.debridge_dln.description',
		url: 'https://dln.trade',
		icon: ArrowLeftRight,
		category: 'bridge',
		tags: ['cross-chain', 'limit-orders', 'trading', 'defi'],
		chains: ['Ethereum', 'Solana', 'Arbitrum', 'Polygon', 'BNB Chain'],
		color: '#8B5CF6'
	},
	{
		id: 'meson-finance',
		name: 'Meson',
		descriptionKey: 'chain-tools.tools.meson_finance.description',
		url: 'https://meson.fi',
		icon: ArrowLeftRight,
		category: 'bridge',
		tags: ['stablecoin', 'cross-chain', 'fast', 'low-fee'],
		chains: ['Ethereum', 'BNB Chain', 'Polygon', 'Arbitrum', 'Avalanche'],
		color: '#22C55E'
	},
	{
		id: 'layerswap',
		name: 'Layerswap',
		descriptionKey: 'chain-tools.tools.layerswap.description',
		url: 'https://layerswap.io',
		icon: ArrowLeftRight,
		category: 'bridge',
		tags: ['cex-to-l2', 'bridge', 'exchanges', 'onramp'],
		chains: ['Ethereum', 'Arbitrum', 'Optimism', 'zkSync', 'StarkNet'],
		color: '#F97316'
	},
	{
		id: 'router-protocol',
		name: 'Router Protocol',
		descriptionKey: 'chain-tools.tools.router_protocol.description',
		url: 'https://routerprotocol.com',
		icon: ArrowLeftRight,
		category: 'bridge',
		tags: ['cross-chain', 'intent', 'nitro', 'omnichain'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Avalanche', 'BNB Chain'],
		color: '#00D395'
	},
	{
		id: 'nitro-bridge',
		name: 'Nitro Bridge',
		descriptionKey: 'chain-tools.tools.nitro_bridge.description',
		url: 'https://app.routernitro.com',
		icon: ArrowLeftRight,
		category: 'bridge',
		tags: ['intent', 'fast', 'cross-chain', 'router'],
		chains: ['Ethereum', 'Arbitrum', 'Optimism', 'Polygon'],
		color: '#10B981'
	},
	{
		id: 'portal-bridge-wormhole',
		name: 'Portal Bridge',
		descriptionKey: 'chain-tools.tools.portal_bridge_wormhole.description',
		url: 'https://portalbridge.com',
		icon: ArrowLeftRight,
		category: 'bridge',
		tags: ['wormhole', 'cross-chain', 'nft', 'multichain'],
		chains: ['Ethereum', 'Solana', 'Terra', 'Polygon', 'BNB Chain'],
		color: '#7C3AED'
	},
	{
		id: 'celer-im',
		name: 'Celer IM',
		descriptionKey: 'chain-tools.tools.celer_im.description',
		url: 'https://im.celer.network',
		icon: ArrowLeftRight,
		category: 'bridge',
		tags: ['messaging', 'cross-chain', 'dapps', 'interoperability'],
		chains: ['Ethereum', 'BNB Chain', 'Polygon', 'Arbitrum', 'Optimism'],
		color: '#48B8D0'
	},
	{
		id: 'multichain-anycall',
		name: 'Multichain AnyCall',
		descriptionKey: 'chain-tools.tools.multichain_anycall.description',
		url: 'https://app.multichain.org',
		icon: ArrowLeftRight,
		category: 'bridge',
		tags: ['cross-chain', 'messaging', 'multichain', 'contracts'],
		chains: ['Ethereum', 'Fantom', 'BSC', 'Polygon', 'Avalanche'],
		color: '#5F6BFB'
	},
	{
		id: 'hyperlane-bridge',
		name: 'Hyperlane',
		descriptionKey: 'chain-tools.tools.hyperlane_bridge.description',
		url: 'https://hyperlane.xyz',
		icon: ArrowLeftRight,
		category: 'bridge',
		tags: ['messaging', 'permissionless', 'modular', 'security'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Celo'],
		color: '#2563EB'
	},
	{
		id: 'connext-amarok',
		name: 'Connext Amarok',
		descriptionKey: 'chain-tools.tools.connext_amarok.description',
		url: 'https://bridge.connext.network',
		icon: ArrowLeftRight,
		category: 'bridge',
		tags: ['trust-minimized', 'cross-chain', 'modular', 'messaging'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Gnosis'],
		color: '#00C2FF'
	}
];
