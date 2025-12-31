import type { ToolDetail } from '../../types';

export const privyDetail: ToolDetail = {
	about: {
		overview: `Privy is the authentication library for Web3. They make it easy to onboard users with email, social login, or wallets—and optionally create embedded wallets for a seamless experience.

The library handles the complexity of wallet connection while supporting progressive Web3 adoption. Users can start with email and later link a self-custody wallet. Best-in-class onboarding UX.

Privy is popular with consumer apps that need mainstream-friendly authentication. Supports embedded wallets (Privy manages keys) or external wallets (MetaMask, etc.). Flexible for any use case.`,
		features: [
			{ title: 'Social Login', description: 'Email, Google, etc.' },
			{ title: 'Embedded Wallets', description: 'No seed phrases' },
			{ title: 'External Wallets', description: 'MetaMask support' },
			{ title: 'Progressive Web3', description: 'Gradual adoption' },
			{ title: 'React SDK', description: 'Easy integration' },
			{ title: 'Multi-Chain', description: 'Many networks' }
		],
		useCases: [
			{ title: 'Consumer Apps', description: 'Mainstream UX' },
			{ title: 'Onboarding', description: 'Email signup' },
			{ title: 'Gaming', description: 'No friction' },
			{ title: 'NFT Apps', description: 'Easy minting' },
			{ title: 'Hybrid Auth', description: 'Web2 + Web3' }
		]
	},
	faqs: [
		{
			question: 'What is Privy?',
			answer: `Privy is Web3 authentication. Users sign in with email, Google, or Twitter—Privy can create an embedded wallet automatically. Or users connect existing wallets. Bridges Web2 and Web3 UX.`
		},
		{
			question: 'What are embedded wallets?',
			answer: `Privy can create wallets for users who sign in with email/social. No seed phrases—Privy secures the keys. Users can export later if they want self-custody. Great for onboarding.`
		},
		{
			question: 'Privy vs RainbowKit?',
			answer: `RainbowKit is wallet connection UI—users must have a wallet. Privy handles full authentication including creating embedded wallets for users without one. Different use cases.`
		},
		{
			question: 'Is Privy secure?',
			answer: `Privy uses secure key management (HSMs, MPC) for embedded wallets. Users can link multiple auth methods for recovery. Security is core to their offering—they handle real value.`
		},
		{
			question: 'Pricing?',
			answer: `Free tier for development and small apps. Production pricing based on monthly active users. Enterprise plans for large-scale apps. Check their pricing page for current rates.`
		}
	],
	cta: {
		ready: 'Ready for easy onboarding?',
		button: 'Try Privy',
		note: 'Web3 authentication'
	}
};
