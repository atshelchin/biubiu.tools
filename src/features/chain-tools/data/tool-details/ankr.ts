import type { ToolDetail } from '../../types';

export const ankrDetail: ToolDetail = {
	about: {
		overview: `Ankr provides decentralized RPC infrastructure for Web3. Their distributed node network offers reliable blockchain access across 45+ chains at competitive prices.

Unlike centralized providers, Ankr's network is distributed across independent node operators. This improves reliability and censorship resistance. Free tier available for testing, paid plans for production.

Ankr also offers staking services, AppChains, and gaming SDKs. They're positioned as comprehensive Web3 infrastructure beyond just RPC. Good option for multi-chain projects needing reliable endpoints.`,
		features: [
			{ title: 'Decentralized', description: 'Distributed nodes' },
			{ title: '45+ Chains', description: 'Multi-chain support' },
			{ title: 'Competitive Pricing', description: 'Cost effective' },
			{ title: 'Free Tier', description: 'Testing available' },
			{ title: 'Staking', description: 'Liquid staking' },
			{ title: 'Gaming SDK', description: 'Game development' }
		],
		useCases: [
			{ title: 'dApp Backend', description: 'RPC endpoints' },
			{ title: 'Multi-Chain', description: 'Cross-chain apps' },
			{ title: 'Cost Savings', description: 'Lower RPC costs' },
			{ title: 'Decentralization', description: 'No single point' },
			{ title: 'Game Development', description: 'Gaming SDKs' }
		]
	},
	faqs: [
		{
			question: 'What is Ankr?',
			answer: `Ankr provides decentralized RPC infrastructure—blockchain node access distributed across independent operators. Also offers staking, AppChains, and gaming tools. Comprehensive Web3 infrastructure.`
		},
		{
			question: 'Ankr vs Alchemy/Infura?',
			answer: `Ankr is more decentralized (distributed nodes vs centralized). Often cheaper. Supports more chains. Alchemy/Infura have more dev tools and debugging features. Choose based on needs.`
		},
		{
			question: 'Is there a free tier?',
			answer: `Yes. Public RPC endpoints are free with rate limits. Good for testing and small projects. Paid plans for higher throughput, dedicated nodes, and premium features.`
		},
		{
			question: 'What chains are supported?',
			answer: `45+ chains including Ethereum, BSC, Polygon, Arbitrum, Optimism, Avalanche, and more. Good L1 and L2 coverage. Check their docs for full list and specific chain features.`
		},
		{
			question: 'What is Ankr Staking?',
			answer: `Ankr offers liquid staking tokens for various chains. Stake ETH and get ankrETH. Provides staking yield while maintaining liquidity. Similar to Lido but with multi-chain options.`
		}
	],
	cta: {
		ready: 'Ready for decentralized RPC?',
		button: 'Try Ankr',
		note: 'Distributed infrastructure'
	}
};
