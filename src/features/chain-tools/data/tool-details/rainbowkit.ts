import type { ToolDetail } from '../../types';

export const rainbowkitDetail: ToolDetail = {
	about: {
		overview: `RainbowKit is the best-in-class wallet connection UI for React dApps. Built for wagmi, it provides a beautiful, accessible connect button and wallet modal with zero configuration.

Just wrap your app and get a polished wallet connection experience. Supports all major wallets, handles connection states, and looks great on mobile. The team behind Rainbow wallet maintains it.

RainbowKit + wagmi is the standard stack for new React dApps. Custom themes, wallet customization, and enterprise features available. It's what you see on most modern dApps.`,
		features: [
			{ title: 'Beautiful UI', description: 'Polished design' },
			{ title: 'All Wallets', description: 'Major wallets supported' },
			{ title: 'wagmi Integration', description: 'Works seamlessly' },
			{ title: 'Customizable', description: 'Themes and options' },
			{ title: 'Mobile Ready', description: 'Responsive design' },
			{ title: 'Accessible', description: 'A11y compliant' }
		],
		useCases: [
			{ title: 'dApp Development', description: 'Wallet connection' },
			{ title: 'Quick Setup', description: 'Zero config start' },
			{ title: 'Custom Branding', description: 'Theme matching' },
			{ title: 'Multi-Wallet', description: 'Support all wallets' },
			{ title: 'Mobile dApps', description: 'Mobile-first' }
		]
	},
	faqs: [
		{
			question: 'What is RainbowKit?',
			answer: `RainbowKit is a React library for wallet connection UI. It gives you a connect button, wallet selection modal, and connection management out of the box. Built to work with wagmi hooks.`
		},
		{
			question: 'Which wallets are supported?',
			answer: `All major wallets: MetaMask, Coinbase Wallet, WalletConnect, Rainbow, and many more. Custom wallet lists are configurable. New wallets added regularly.`
		},
		{
			question: 'Do I need wagmi?',
			answer: `Yes, RainbowKit is built specifically for wagmi. It handles the UI layer while wagmi handles the logic. They're designed to work together—most projects use both.`
		},
		{
			question: 'Can I customize the look?',
			answer: `Yes. RainbowKit has built-in themes (light, dark, midnight) and supports custom themes. Colors, fonts, and border radius are all configurable to match your brand.`
		},
		{
			question: 'Is it free?',
			answer: `Yes, RainbowKit is free and open source. Enterprise features like custom branding and priority support are available separately. Most projects use the free version.`
		}
	],
	cta: {
		ready: 'Ready to add wallet connection?',
		button: 'Install RainbowKit',
		note: 'Beautiful wallet UI'
	}
};
