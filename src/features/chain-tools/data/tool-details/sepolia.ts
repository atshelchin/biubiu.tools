import type { ToolDetail } from '../../types';

export const sepoliaDetail: ToolDetail = {
	about: {
		overview: `Sepolia is Ethereum's primary testnet for application development. It's the recommended network for testing smart contracts and dApps before mainnet deployment.

The testnet is stable, well-supported by tools, and has consistent block times. Major wallets, block explorers, and development frameworks all support Sepolia. Get test ETH from faucets.

For most dApp developers, Sepolia is the right choice. It mirrors mainnet behavior reliably. Holesky exists for staking tests; Sepolia is for everything else.`,
		features: [
			{ title: 'Application Testing', description: 'dApp development' },
			{ title: 'Stable Network', description: 'Reliable uptime' },
			{ title: 'Tool Support', description: 'All major tools' },
			{ title: 'Free ETH', description: 'Faucet available' },
			{ title: 'Mainnet Parity', description: 'Same behavior' },
			{ title: 'EF Maintained', description: 'Official testnet' }
		],
		useCases: [
			{ title: 'Smart Contract Testing', description: 'Deploy and test' },
			{ title: 'dApp Development', description: 'Frontend testing' },
			{ title: 'Integration Testing', description: 'End-to-end tests' },
			{ title: 'Learning', description: 'Practice development' },
			{ title: 'CI/CD', description: 'Automated testing' }
		]
	},
	faqs: [
		{
			question: 'What is Sepolia?',
			answer: `Sepolia is Ethereum's recommended testnet for dApp development. Deploy contracts, test frontend integration, and verify behavior before mainnet. Stable and well-supported.`
		},
		{
			question: 'How do I get Sepolia ETH?',
			answer: `Use faucets—Alchemy, Infura, and others offer Sepolia faucets. Some require Alchemy account or mainnet balance proof. Check the Ethereum docs for current working faucets.`
		},
		{
			question: 'Sepolia vs Goerli?',
			answer: `Goerli is deprecated. Sepolia is the current recommended testnet for applications. Migrate any Goerli projects to Sepolia. Same tooling, just different network.`
		},
		{
			question: 'Which tools support Sepolia?',
			answer: `All major tools: MetaMask, Hardhat, Foundry, Etherscan, Alchemy, Infura. Sepolia is the standard testnet—expect full support from any Ethereum tool.`
		},
		{
			question: 'Is Sepolia reliable?',
			answer: `Yes. Sepolia is stable with consistent block times. Maintained by the Ethereum Foundation and client teams. Suitable for serious testing and CI/CD pipelines.`
		}
	],
	cta: {
		ready: 'Ready to test on Sepolia?',
		button: 'Get Test ETH',
		note: 'Ethereum application testnet'
	}
};
