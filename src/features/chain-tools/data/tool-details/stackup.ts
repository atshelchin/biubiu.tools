import type { ToolDetail } from '../../types';

export const stackupDetail: ToolDetail = {
	about: {
		overview: `Stackup provides account abstraction infrastructure with a focus on simplicity. Their bundler and paymaster services make ERC-4337 accessible to all developers.

Key offerings include hosted bundlers, verifying paymasters, and a user-friendly dashboard. Stackup emphasizes developer experience—getting AA working quickly without deep ERC-4337 knowledge.

They also contribute to the AA ecosystem with open-source tools and educational content. Good choice for teams wanting straightforward AA integration without complexity.`,
		features: [
			{ title: 'Bundler API', description: 'Hosted service' },
			{ title: 'Paymaster', description: 'Gas sponsorship' },
			{ title: 'Dashboard', description: 'Easy management' },
			{ title: 'Multi-Chain', description: 'Many networks' },
			{ title: 'Simple SDK', description: 'Easy integration' },
			{ title: 'Open Source', description: 'Community tools' }
		],
		useCases: [
			{ title: 'Quick AA Setup', description: 'Fast integration' },
			{ title: 'Gas Sponsorship', description: 'Gasless apps' },
			{ title: 'Bundler Service', description: 'Reliable backend' },
			{ title: 'Learning AA', description: 'Simple start' },
			{ title: 'Production Apps', description: 'Scalable infra' }
		]
	},
	faqs: [
		{
			question: 'What is Stackup?',
			answer: `Stackup provides ERC-4337 bundler and paymaster services. They focus on simplicity—easy APIs, good documentation, and a management dashboard. Makes AA accessible without deep expertise.`
		},
		{
			question: 'How is Stackup different?',
			answer: `Stackup emphasizes developer experience and simplicity. While others focus on advanced features, Stackup prioritizes getting started quickly. Good for teams new to account abstraction.`
		},
		{
			question: 'What chains are supported?',
			answer: `Multiple EVM chains including Ethereum, Polygon, Arbitrum, Optimism, and others. Check their documentation for the current list. They add new chains based on demand.`
		},
		{
			question: 'Is there documentation?',
			answer: `Yes, Stackup has comprehensive docs and tutorials. They invest in education—good starting point for learning ERC-4337. Their guides explain concepts alongside implementation.`
		},
		{
			question: 'Pricing model?',
			answer: `Free tier for development. Production pricing based on bundler operations and paymaster usage. Transparent pricing on their website. Competitive with other AA providers.`
		}
	],
	cta: {
		ready: 'Ready to start with AA?',
		button: 'Try Stackup',
		note: 'Simple AA infrastructure'
	}
};
