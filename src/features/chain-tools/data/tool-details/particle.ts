import type { ToolDetail } from '../../types';

export const particleDetail: ToolDetail = {
	about: {
		overview: `Particle Network is building chain abstraction infrastructure. Their vision: users interact with one account across all chains, without thinking about which network they're on.

Key products include Particle Wallet (social login + smart accounts) and Universal Accounts (chain-abstracted accounts). They're pushing beyond simple AA to true cross-chain UX.

Particle emphasizes developer experience with comprehensive SDKs and documentation. They support EVM chains and are expanding. A vision for the future of multi-chain interaction.`,
		features: [
			{ title: 'Chain Abstraction', description: 'Cross-chain UX' },
			{ title: 'Universal Accounts', description: 'One account' },
			{ title: 'Social Login', description: 'Easy onboarding' },
			{ title: 'Smart Accounts', description: 'AA support' },
			{ title: 'Multi-Chain', description: 'Many networks' },
			{ title: 'Developer SDKs', description: 'Easy integration' }
		],
		useCases: [
			{ title: 'Multi-Chain Apps', description: 'Unified UX' },
			{ title: 'Consumer Apps', description: 'Simple onboarding' },
			{ title: 'Gaming', description: 'Cross-chain assets' },
			{ title: 'DeFi', description: 'Chain-abstracted' },
			{ title: 'NFT Apps', description: 'Multi-chain NFTs' }
		]
	},
	faqs: [
		{
			question: 'What is Particle Network?',
			answer: `Particle Network builds chain abstraction infrastructure. Their goal: one account works across all chains. Users don't think about networks—apps handle chain switching invisibly.`
		},
		{
			question: 'What are Universal Accounts?',
			answer: `Universal Accounts work across multiple chains with one address and unified balance. No bridging, no chain switching for users. The system handles cross-chain complexity.`
		},
		{
			question: 'How is this different from bridges?',
			answer: `Bridges move assets between chains. Particle abstracts chains entirely—users have one account that works everywhere. The UX goal is hiding chain existence from users.`
		},
		{
			question: 'Which chains are supported?',
			answer: `Multiple EVM chains with expansion planned. They're building toward broad chain coverage. Check their docs for current support and roadmap.`
		},
		{
			question: 'Is it production ready?',
			answer: `Parts of their stack are in production. Universal Accounts is newer. They're iterating toward their vision. Evaluate for your specific needs and timeline.`
		}
	],
	cta: {
		ready: 'Ready for chain abstraction?',
		button: 'Explore Particle',
		note: 'Chain abstraction infrastructure'
	}
};
