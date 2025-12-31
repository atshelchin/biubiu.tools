import type { ToolDetail } from '../../types';

export const viemDetail: ToolDetail = {
	about: {
		overview: `viem is the modern TypeScript interface for Ethereum. It's the low-level library that powers wagmi—smaller, faster, and more modular than ethers.js with first-class TypeScript support.

Built by the wagmi team, viem provides everything you need for Ethereum development: wallet interactions, contract calls, transaction handling, and encoding/decoding. The API is intuitive and tree-shakeable.

viem is becoming the default choice for new TypeScript Ethereum projects. Better bundle sizes, stricter types, and cleaner abstractions than legacy libraries.`,
		features: [
			{ title: 'TypeScript-First', description: 'Strict types' },
			{ title: 'Modular', description: 'Tree-shakeable' },
			{ title: 'Small Bundle', description: 'Minimal size' },
			{ title: 'Fast', description: 'Optimized performance' },
			{ title: 'Modern API', description: 'Clean abstractions' },
			{ title: 'wagmi Foundation', description: 'Powers wagmi' }
		],
		useCases: [
			{ title: 'dApp Development', description: 'Ethereum apps' },
			{ title: 'Contract Interaction', description: 'Read and write' },
			{ title: 'Transaction Handling', description: 'Send and track' },
			{ title: 'Data Encoding', description: 'ABI encoding' },
			{ title: 'Wallet Integration', description: 'Connect wallets' }
		]
	},
	faqs: [
		{
			question: 'What is viem?',
			answer: `viem is the low-level TypeScript library for Ethereum. It handles contract calls, transactions, encoding, and wallet connections. Think of it as the modern replacement for ethers.js with better TypeScript and smaller bundles.`
		},
		{
			question: 'viem vs ethers.js?',
			answer: `viem is smaller (35kb vs 120kb+), has stricter TypeScript, and is more modular. ethers.js has longer history and more examples online. For new projects, viem is generally preferred. Migration guides exist.`
		},
		{
			question: 'viem vs wagmi?',
			answer: `viem is the low-level Ethereum library. wagmi builds React hooks on top of viem. Use wagmi for React apps, viem directly for non-React projects or custom needs. They work together.`
		},
		{
			question: 'How do I migrate from ethers?',
			answer: `viem has migration guides in their docs. Most concepts map directly—providers become clients, Contract becomes getContract. The API is similar but cleaner. Gradual migration is possible.`
		},
		{
			question: 'Is viem production-ready?',
			answer: `Yes. viem powers major dApps through wagmi. It's maintained by experienced developers and has comprehensive test coverage. Production use is widespread and growing.`
		}
	],
	cta: {
		ready: 'Ready to use viem?',
		button: 'Get Started',
		note: 'Modern Ethereum library'
	}
};
