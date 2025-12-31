import type { ToolDetail } from '../../types';

export const pimlicoDetail: ToolDetail = {
	about: {
		overview: `Pimlico provides ERC-4337 infrastructure—bundlers and paymasters that power account abstraction. They're the backend that makes smart accounts work reliably at scale.

Their bundler aggregates user operations and submits them to the network. Their paymaster enables gas sponsorship—you pay for users' gas. Critical infrastructure for AA-powered dApps.

Pimlico focuses on reliability and performance. They support multiple chains and handle the complexity of bundling, gas estimation, and mempool management. The plumbing that makes AA possible.`,
		features: [
			{ title: 'Bundler', description: 'UserOp aggregation' },
			{ title: 'Paymaster', description: 'Gas sponsorship' },
			{ title: 'Multi-Chain', description: 'Many networks' },
			{ title: 'Reliable', description: 'Production-grade' },
			{ title: 'Permissionless', description: 'Open SDK' },
			{ title: 'Alto Bundler', description: 'Open source' }
		],
		useCases: [
			{ title: 'AA Infrastructure', description: 'Backend services' },
			{ title: 'Gas Sponsorship', description: 'Pay user gas' },
			{ title: 'Bundler Service', description: 'UserOp submission' },
			{ title: 'Multi-Chain AA', description: 'Cross-chain' },
			{ title: 'Production Apps', description: 'Reliable infra' }
		]
	},
	faqs: [
		{
			question: 'What is Pimlico?',
			answer: `Pimlico provides ERC-4337 infrastructure—bundlers and paymasters. Bundlers aggregate and submit user operations. Paymasters sponsor gas. They're the backend that makes account abstraction work.`
		},
		{
			question: 'What is a bundler?',
			answer: `In ERC-4337, bundlers collect user operations from many users, bundle them into a transaction, and submit to the network. Pimlico runs reliable bundlers so you don't have to.`
		},
		{
			question: 'What is a paymaster?',
			answer: `Paymasters pay for users' gas. You deposit funds, set policies, and Pimlico's paymaster covers gas for qualifying transactions. Enables gasless UX for your users.`
		},
		{
			question: 'Pimlico vs ZeroDev?',
			answer: `ZeroDev is a higher-level SDK for building smart accounts. Pimlico provides infrastructure (bundlers/paymasters). You can use Pimlico's infra with ZeroDev's SDK—they complement each other.`
		},
		{
			question: 'Is there a free tier?',
			answer: `Yes, Pimlico has a free tier for development and testing. Production usage requires paid plans. Pricing based on bundler calls and paymaster usage.`
		}
	],
	cta: {
		ready: 'Ready for AA infrastructure?',
		button: 'Get Started',
		note: 'Bundlers and paymasters'
	}
};
