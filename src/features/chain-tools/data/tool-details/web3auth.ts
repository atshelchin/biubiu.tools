import type { ToolDetail } from '../../types';

export const web3authDetail: ToolDetail = {
	about: {
		overview: `Web3Auth is a wallet infrastructure provider using MPC (multi-party computation) for key management. Users log in with social accounts and get a wallet—no seed phrases, no extensions needed.

The technology splits private keys across multiple parties so no single entity has full access. This enables social login security while maintaining non-custodial principles.

Web3Auth supports many chains and integrates with popular frameworks. They offer both plug-and-play solutions and customizable SDKs. Popular choice for mainstream consumer apps.`,
		features: [
			{ title: 'MPC Security', description: 'Split key management' },
			{ title: 'Social Login', description: 'Google, Twitter, etc.' },
			{ title: 'Non-Custodial', description: 'User-controlled' },
			{ title: 'Multi-Chain', description: 'EVM, Solana, etc.' },
			{ title: 'Customizable', description: 'White-label' },
			{ title: 'Plugin System', description: 'Extensible' }
		],
		useCases: [
			{ title: 'Consumer Apps', description: 'Mass adoption' },
			{ title: 'Gaming', description: 'Seamless wallets' },
			{ title: 'Enterprise', description: 'White-label' },
			{ title: 'Mobile Apps', description: 'Native SDKs' },
			{ title: 'Multi-Chain', description: 'Cross-ecosystem' }
		]
	},
	faqs: [
		{
			question: 'What is Web3Auth?',
			answer: `Web3Auth provides wallet infrastructure using MPC. Users log in with social accounts (Google, Twitter) and get a wallet automatically. Keys are split so no party has full control. Non-custodial social login.`
		},
		{
			question: 'What is MPC?',
			answer: `Multi-party computation splits private keys across multiple parties. Even if one party is compromised, the key is safe. Web3Auth uses this to enable social login without seed phrases.`
		},
		{
			question: 'Is it really non-custodial?',
			answer: `Yes, in the MPC model. Web3Auth never has your complete key—only key shares. You control the final key through your social login. True non-custody with social login UX.`
		},
		{
			question: 'Web3Auth vs Privy?',
			answer: `Both offer social login wallets. Web3Auth uses MPC for key management; Privy uses different approaches. Web3Auth is more customizable; Privy has simpler integration. Both are solid.`
		},
		{
			question: 'Which chains are supported?',
			answer: `Broad support: Ethereum, Polygon, Solana, and many others. They support most major L1s and L2s. Check documentation for current chain support and specific features.`
		}
	],
	cta: {
		ready: 'Ready for social login?',
		button: 'Try Web3Auth',
		note: 'MPC wallet infrastructure'
	}
};
