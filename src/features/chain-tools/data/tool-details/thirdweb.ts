import type { ToolDetail } from '../../types';

export const thirdwebDetail: ToolDetail = {
	about: {
		overview: `thirdweb is the complete Web3 development platform. They provide SDKs, smart contracts, infrastructure, and tools to build dApps without worrying about blockchain complexity.

Their pre-built contracts cover NFTs, tokens, marketplaces, and more—deploy with one click. SDKs for React, Unity, and mobile make integration simple. Infrastructure handles wallets, storage, and RPC.

thirdweb abstracts complexity for developers. Instead of learning every blockchain detail, use their APIs. Popular for NFT projects, games, and rapid development. Strong focus on developer experience.`,
		features: [
			{ title: 'Pre-built Contracts', description: 'One-click deploy' },
			{ title: 'Multi-Platform SDKs', description: 'React, Unity, Mobile' },
			{ title: 'Wallet Infrastructure', description: 'Embedded wallets' },
			{ title: 'Storage', description: 'IPFS integration' },
			{ title: 'Dashboard', description: 'Manage everything' },
			{ title: 'Multi-Chain', description: '700+ chains' }
		],
		useCases: [
			{ title: 'NFT Projects', description: 'Minting and sales' },
			{ title: 'Web3 Games', description: 'Unity SDK' },
			{ title: 'Token Launches', description: 'Easy deployment' },
			{ title: 'Rapid Development', description: 'Quick prototypes' },
			{ title: 'Mobile dApps', description: 'Mobile SDKs' }
		]
	},
	faqs: [
		{
			question: 'What is thirdweb?',
			answer: `thirdweb is a Web3 development platform. Pre-built contracts, SDKs, and infrastructure to build dApps fast. Less blockchain complexity—focus on your product instead.`
		},
		{
			question: 'What can I build with thirdweb?',
			answer: `NFT collections, token drops, marketplaces, gaming items, DAOs—anything with blockchain needs. Their contracts and SDKs cover common use cases. Custom contracts also supported.`
		},
		{
			question: 'Is thirdweb free?',
			answer: `Core tools are free. No fees on their contracts. Paid features for advanced needs like embedded wallets, higher limits, and enterprise support. Generous free tier for most projects.`
		},
		{
			question: 'thirdweb vs building from scratch?',
			answer: `thirdweb trades flexibility for speed. Great for common patterns and rapid development. Complex custom logic might need raw development. Many start with thirdweb then customize.`
		},
		{
			question: 'Which platforms are supported?',
			answer: `React, Next.js, Unity, Unreal, React Native, and more. TypeScript SDK for backend. Comprehensive platform coverage—unusual for Web3 tools. Check docs for full list.`
		}
	],
	cta: {
		ready: 'Ready to build faster?',
		button: 'Start with thirdweb',
		note: 'Complete Web3 platform'
	}
};
