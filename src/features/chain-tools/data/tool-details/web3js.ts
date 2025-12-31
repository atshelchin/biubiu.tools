import type { ToolDetail } from '../../types';

export const web3jsDetail: ToolDetail = {
	about: {
		overview: `web3.js is the original JavaScript library for Ethereum. Created by the Ethereum Foundation, it's been the standard library for years and powers countless dApps and tools.

The library handles everything: wallet connections, contract interactions, transactions, and Ethereum data. It's battle-tested with extensive documentation and community examples.

While newer alternatives like viem exist, web3.js remains widely used. Version 4.x brought TypeScript improvements and modern updates. Many tutorials and existing codebases use web3.js.`,
		features: [
			{ title: 'Battle-Tested', description: 'Years of production' },
			{ title: 'Full Featured', description: 'Complete Ethereum API' },
			{ title: 'TypeScript', description: 'v4.x support' },
			{ title: 'EF Maintained', description: 'Foundation backed' },
			{ title: 'Documentation', description: 'Extensive docs' },
			{ title: 'Community', description: 'Large ecosystem' }
		],
		useCases: [
			{ title: 'dApp Development', description: 'Ethereum apps' },
			{ title: 'Contract Interaction', description: 'Read and write' },
			{ title: 'Legacy Projects', description: 'Existing codebases' },
			{ title: 'Learning', description: 'Many tutorials' },
			{ title: 'Node.js', description: 'Backend development' }
		]
	},
	faqs: [
		{
			question: 'What is web3.js?',
			answer: `web3.js is the original JavaScript Ethereum library by the Ethereum Foundation. It provides APIs for everything Ethereum: accounts, contracts, transactions, and more. The standard library for years.`
		},
		{
			question: 'web3.js vs ethers.js vs viem?',
			answer: `web3.js is oldest and most documented. ethers.js became popular for cleaner API. viem is newest with best TypeScript. All work—choose based on project needs and team familiarity.`
		},
		{
			question: 'Should I use web3.js for new projects?',
			answer: `For new projects, viem/ethers are often preferred for better DX. web3.js is fine if you're familiar with it or maintaining existing code. The 4.x version improved significantly.`
		},
		{
			question: 'Is web3.js still maintained?',
			answer: `Yes. The Ethereum Foundation and ChainSafe maintain it actively. Version 4.x brought major improvements including better TypeScript. It's not abandoned—just has newer competitors.`
		},
		{
			question: 'How do I learn web3.js?',
			answer: `Official docs at docs.web3js.org. Many tutorials exist since it's been around longest. Start with connecting to Ethereum, then contracts. Plenty of Stack Overflow answers available.`
		}
	],
	cta: {
		ready: 'Ready to use web3.js?',
		button: 'View Documentation',
		note: 'Original Ethereum library'
	}
};
