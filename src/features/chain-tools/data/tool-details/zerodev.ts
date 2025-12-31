import type { ToolDetail } from '../../types';

export const zerodevDetail: ToolDetail = {
	about: {
		overview: `ZeroDev is the leading account abstraction SDK. They make it easy to build smart accounts with ERC-4337—enabling gasless transactions, batched operations, and programmable wallets.

ZeroDev provides Kernel, a modular smart account that developers can customize. Their SDK handles the complexity of bundlers, paymasters, and user operations. Focus on your app, not AA infrastructure.

Key features include session keys (delegated permissions), passkey authentication, and gas sponsorship. ZeroDev is powering the next generation of user-friendly dApps with invisible wallet experiences.`,
		features: [
			{ title: 'Smart Accounts', description: 'ERC-4337' },
			{ title: 'Gasless TX', description: 'Sponsored gas' },
			{ title: 'Session Keys', description: 'Delegated perms' },
			{ title: 'Passkeys', description: 'Biometric auth' },
			{ title: 'Modular', description: 'Kernel accounts' },
			{ title: 'Multi-Chain', description: 'Many networks' }
		],
		useCases: [
			{ title: 'Gasless dApps', description: 'Sponsor user gas' },
			{ title: 'Gaming', description: 'Session keys' },
			{ title: 'Onboarding', description: 'No seed phrases' },
			{ title: 'Batched TX', description: 'Multi-call' },
			{ title: 'Social Login', description: 'Web2 UX' }
		]
	},
	faqs: [
		{
			question: 'What is ZeroDev?',
			answer: `ZeroDev is an account abstraction SDK built on ERC-4337. It lets you create smart contract wallets with features like gasless transactions, session keys, and passkey login. Makes dApps feel like normal apps.`
		},
		{
			question: 'What is account abstraction?',
			answer: `Account abstraction (AA) replaces EOAs with smart contract wallets. Enables gas sponsorship, batched transactions, social recovery, and programmable security. ERC-4337 is the standard; ZeroDev implements it.`
		},
		{
			question: 'What are session keys?',
			answer: `Session keys let users grant limited permissions to apps—like "approve up to 10 USDC for this game." Users don't sign every transaction. Enables gaming-like UX for blockchain apps.`
		},
		{
			question: 'How do passkeys work?',
			answer: `Users authenticate with Face ID or fingerprint instead of seed phrases. ZeroDev uses passkeys to secure smart accounts. No more 12-word phrases for mainstream users.`
		},
		{
			question: 'Is ZeroDev free?',
			answer: `They have a generous free tier for development and small apps. Production usage has paid tiers. Gas sponsorship costs depend on your paymaster setup.`
		}
	],
	cta: {
		ready: 'Ready for account abstraction?',
		button: 'Start Building',
		note: 'Smart account SDK'
	}
};
