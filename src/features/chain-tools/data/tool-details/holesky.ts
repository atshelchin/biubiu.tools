import type { ToolDetail } from '../../types';

export const holeskyDetail: ToolDetail = {
	about: {
		overview: `Holesky is Ethereum's primary testnet for staking and infrastructure testing. Launched in 2023 to replace Goerli, it has a much larger ETH supply for testing staking scenarios.

The testnet mirrors Ethereum mainnet consensus and execution. It's where staking protocols, validators, and infrastructure test before mainnet deployment. Essential for proof-of-stake development.

Holesky faucets provide free test ETH. The network is maintained by client teams and the Ethereum Foundation. For application testing, Sepolia is also available—Holesky focuses on staking and validators.`,
		features: [
			{ title: 'Staking Testnet', description: 'PoS testing' },
			{ title: 'Large ETH Supply', description: 'Abundant test ETH' },
			{ title: 'Mainnet Mirror', description: 'Same consensus' },
			{ title: 'Validator Testing', description: 'Infrastructure dev' },
			{ title: 'Free Faucets', description: 'Test ETH available' },
			{ title: 'EF Maintained', description: 'Official testnet' }
		],
		useCases: [
			{ title: 'Staking Development', description: 'PoS protocols' },
			{ title: 'Validator Testing', description: 'Node operators' },
			{ title: 'Infrastructure', description: 'Client testing' },
			{ title: 'Protocol Testing', description: 'New features' },
			{ title: 'Learning', description: 'Practice staking' }
		]
	},
	faqs: [
		{
			question: 'What is Holesky?',
			answer: `Holesky is Ethereum's testnet for staking and infrastructure testing. Replaced Goerli in 2023. Has abundant test ETH for staking scenarios. Where validators and protocols test before mainnet.`
		},
		{
			question: 'Holesky vs Sepolia?',
			answer: `Holesky for staking/validator/infrastructure testing—has lots of ETH for staking. Sepolia for application testing—more stable, less resource-intensive. Use whichever fits your testing needs.`
		},
		{
			question: 'How do I get Holesky ETH?',
			answer: `Use faucets—PoW faucets, staking faucets, or community faucets. Holesky has much more ETH available than Goerli did. Check Ethereum docs for current faucet links.`
		},
		{
			question: 'Why was Goerli replaced?',
			answer: `Goerli had limited ETH supply, making staking tests difficult. Holesky has 1.6 billion test ETH—enough for large-scale staking tests. Purpose-built for Ethereum's PoS era.`
		},
		{
			question: 'Can I test applications on Holesky?',
			answer: `Yes, but Sepolia is often better for app testing. Holesky is optimized for staking tests. For smart contract development, either works—Sepolia may be more convenient.`
		}
	],
	cta: {
		ready: 'Ready to test on Holesky?',
		button: 'Get Test ETH',
		note: 'Ethereum staking testnet'
	}
};
