import type { ToolDetail } from '../../types';

export const poktDetail: ToolDetail = {
	about: {
		overview: `Pocket Network (POKT) is the decentralized RPC protocol. Node operators stake POKT tokens to serve RPC requests, creating a permissionless, censorship-resistant infrastructure layer.

Unlike centralized providers, Pocket has no single point of failure. Thousands of nodes compete to serve requests. The protocol automatically routes to available nodes and handles failover.

POKT token holders can stake to earn rewards for running nodes or delegate to existing operators. The network serves billions of relays monthly across multiple chains. True Web3 infrastructure.`,
		features: [
			{ title: 'Decentralized', description: 'Thousands of nodes' },
			{ title: 'Permissionless', description: 'Anyone can run' },
			{ title: 'POKT Token', description: 'Stake to earn' },
			{ title: 'Multi-Chain', description: 'Many networks' },
			{ title: 'Censorship Resistant', description: 'No single point' },
			{ title: 'High Volume', description: 'Billions of relays' }
		],
		useCases: [
			{ title: 'dApp Infrastructure', description: 'Decentralized RPC' },
			{ title: 'Node Operation', description: 'Run and earn' },
			{ title: 'Staking', description: 'Delegate POKT' },
			{ title: 'Censorship Resistance', description: 'Unstoppable access' },
			{ title: 'Multi-Chain Apps', description: 'Cross-chain RPC' }
		]
	},
	faqs: [
		{
			question: 'What is Pocket Network?',
			answer: `Pocket Network is decentralized RPC infrastructure. Node operators stake POKT to serve blockchain data. Apps pay POKT for access. It's like Uber for blockchain nodes—permissionless and distributed.`
		},
		{
			question: 'How is it different from Alchemy?',
			answer: `Alchemy is a company running centralized servers. Pocket is a protocol with independent node operators. More censorship resistant but potentially variable quality. Different trust models.`
		},
		{
			question: 'How do I use Pocket?',
			answer: `Use the Pocket Portal for easy access—sign up and get endpoints. For direct protocol access, stake POKT tokens. Many projects use Pocket through aggregators like Ankr.`
		},
		{
			question: 'Can I run a node?',
			answer: `Yes. Stake minimum POKT (amount varies), run node software, and earn rewards for serving requests. Technical requirements exist. Many delegate instead of running personally.`
		},
		{
			question: 'Which chains are supported?',
			answer: `Ethereum, Polygon, BSC, Harmony, and many more. Coverage depends on node operator support. Major chains have good coverage; smaller chains may have less.`
		}
	],
	cta: {
		ready: 'Ready for decentralized RPC?',
		button: 'Explore Pocket',
		note: 'Decentralized infrastructure'
	}
};
