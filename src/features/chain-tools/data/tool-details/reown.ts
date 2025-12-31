import type { ToolDetail } from '../../types';

export const reownDetail: ToolDetail = {
	about: {
		overview: `Reown (formerly WalletConnect) provides the protocol for connecting wallets to dApps. Their standard enables any wallet to connect to any app—the universal wallet connection layer.

WalletConnect v2 introduced multi-chain support, session management, and improved security. It's the standard used by most mobile wallets and many dApps for remote wallet connections.

Reown also offers AppKit (formerly Web3Modal), a wallet connection UI that supports WalletConnect and many other connection methods. The company behind the protocol now offers full-stack solutions.`,
		features: [
			{ title: 'WalletConnect', description: 'Connection protocol' },
			{ title: 'Multi-Chain', description: 'Cross-chain sessions' },
			{ title: 'AppKit', description: 'Connection UI' },
			{ title: 'Mobile Support', description: 'Native wallets' },
			{ title: 'Standard Protocol', description: 'Universal' },
			{ title: 'Session Management', description: 'Persistent' }
		],
		useCases: [
			{ title: 'dApp Connection', description: 'Wallet linking' },
			{ title: 'Mobile Wallets', description: 'Remote signing' },
			{ title: 'Multi-Chain', description: 'Cross-chain dApps' },
			{ title: 'Wallet Developers', description: 'Protocol support' },
			{ title: 'dApp Developers', description: 'AppKit UI' }
		]
	},
	faqs: [
		{
			question: 'What is Reown?',
			answer: `Reown (formerly WalletConnect) provides the protocol connecting wallets to dApps. When you scan a QR code with your mobile wallet, that's WalletConnect. They also offer AppKit for connection UI.`
		},
		{
			question: 'What is WalletConnect?',
			answer: `WalletConnect is the open protocol for wallet-dApp connections. It works across wallets and apps—a universal standard. V2 supports multi-chain and improved security.`
		},
		{
			question: 'What is AppKit?',
			answer: `AppKit (formerly Web3Modal) is a wallet connection UI component. Supports WalletConnect, injected wallets, and others. Drop-in solution for connecting wallets in dApps.`
		},
		{
			question: 'Is WalletConnect free?',
			answer: `The protocol is free and open source. Reown offers cloud services for relay servers. Free tier available; paid tiers for production. AppKit has similar model.`
		},
		{
			question: 'Why the rebrand?',
			answer: `WalletConnect Inc became Reown to reflect expanded offerings beyond the protocol. WalletConnect protocol keeps its name; Reown is the company offering full solutions.`
		}
	],
	cta: {
		ready: 'Ready to connect wallets?',
		button: 'Explore Reown',
		note: 'Wallet connection protocol'
	}
};
