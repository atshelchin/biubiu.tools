import type { ToolDetail } from '../../types';

export const dynamicDetail: ToolDetail = {
	about: {
		overview: `Dynamic is an enterprise-grade Web3 authentication platform. They provide embeddable wallets, multi-chain support, and advanced user management for serious dApps.

Beyond simple wallet connection, Dynamic offers user dashboards, wallet linking, NFT gating, and analytics. They're focused on the full user lifecycle, not just login.

Dynamic is popular with companies building production applications. Strong focus on security, compliance, and enterprise features. Good choice for teams needing more than basic auth.`,
		features: [
			{ title: 'Embedded Wallets', description: 'Managed keys' },
			{ title: 'Social Login', description: 'Email, OAuth' },
			{ title: 'User Management', description: 'Dashboard' },
			{ title: 'Multi-Chain', description: 'EVM and Solana' },
			{ title: 'NFT Gating', description: 'Token access' },
			{ title: 'Analytics', description: 'User insights' }
		],
		useCases: [
			{ title: 'Enterprise Apps', description: 'Production-grade' },
			{ title: 'User Onboarding', description: 'Smooth flow' },
			{ title: 'Access Control', description: 'Token gating' },
			{ title: 'Multi-Chain', description: 'Cross-chain auth' },
			{ title: 'Compliance', description: 'Enterprise needs' }
		]
	},
	faqs: [
		{
			question: 'What is Dynamic?',
			answer: `Dynamic is enterprise Web3 authentication. Embedded wallets, social login, user management, and analytics. More than just wallet connection—full user lifecycle management.`
		},
		{
			question: 'Dynamic vs Privy?',
			answer: `Both offer embedded wallets and social login. Dynamic has stronger enterprise features—user management dashboard, analytics, compliance tools. Privy is simpler and developer-focused.`
		},
		{
			question: 'What chains are supported?',
			answer: `EVM chains (Ethereum, Polygon, Arbitrum, etc.) and Solana. They support wallet connection and embedded wallets across multiple ecosystems. Check docs for full list.`
		},
		{
			question: 'What is NFT gating?',
			answer: `Control access based on NFT/token ownership. Users must hold specific tokens to access features. Dynamic provides built-in gating rules. Common for membership and access control.`
		},
		{
			question: 'Enterprise features?',
			answer: `User management dashboard, analytics, compliance tools, SSO, and priority support. Designed for companies building production applications with real business requirements.`
		}
	],
	cta: {
		ready: 'Ready for enterprise auth?',
		button: 'Explore Dynamic',
		note: 'Enterprise Web3 auth'
	}
};
