import type { ToolDetail } from '../../types';

export const blocknativeDetail: ToolDetail = {
	about: {
		overview: `Blocknative provides mempool monitoring and transaction management tools. They specialize in pre-chain data—seeing and understanding transactions before they're confirmed.

Their products include mempool explorers, transaction simulation, and gas estimation APIs. Critical infrastructure for traders, MEV searchers, and anyone needing transaction visibility.

Blocknative also offers Web3-onboard, a popular wallet connection library. The company bridges traditional infrastructure with blockchain-specific needs like mempool access.`,
		features: [
			{ title: 'Mempool Access', description: 'Pre-chain data' },
			{ title: 'Transaction Simulation', description: 'Preview outcomes' },
			{ title: 'Gas Estimation', description: 'Accurate pricing' },
			{ title: 'Web3-Onboard', description: 'Wallet connection' },
			{ title: 'Notifications', description: 'TX monitoring' },
			{ title: 'API Access', description: 'Developer tools' }
		],
		useCases: [
			{ title: 'MEV', description: 'Transaction monitoring' },
			{ title: 'Trading', description: 'Pre-chain visibility' },
			{ title: 'Gas Optimization', description: 'Better estimates' },
			{ title: 'dApp Development', description: 'TX management' },
			{ title: 'Wallet Integration', description: 'Web3-onboard' }
		]
	},
	faqs: [
		{
			question: 'What is Blocknative?',
			answer: `Blocknative provides mempool infrastructure—access to pending transactions before confirmation. They offer APIs for gas estimation, transaction simulation, and mempool monitoring. Also maintain Web3-onboard.`
		},
		{
			question: 'What is mempool monitoring?',
			answer: `The mempool contains pending transactions. Seeing them enables: predicting gas prices, simulating outcomes, detecting MEV opportunities. Blocknative streams this data in real-time.`
		},
		{
			question: 'What is Web3-Onboard?',
			answer: `Web3-Onboard is Blocknative's wallet connection library. Similar to RainbowKit but framework-agnostic. Supports 35+ wallets, hardware wallets, and account abstraction. Popular alternative.`
		},
		{
			question: 'Who uses Blocknative?',
			answer: `MEV searchers, trading protocols, DeFi apps needing gas estimates, and anyone wanting pre-chain visibility. Aave, Balancer, and many others use their infrastructure.`
		},
		{
			question: 'Is there a free tier?',
			answer: `Some products have free tiers with limits. Serious usage requires paid plans. Contact sales for enterprise needs. Web3-Onboard is open source and free.`
		}
	],
	cta: {
		ready: 'Ready for mempool access?',
		button: 'Explore Blocknative',
		note: 'Mempool infrastructure'
	}
};
