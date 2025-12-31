import type { ToolDetail } from '../../types';

export const sourcifyDetail: ToolDetail = {
	about: {
		overview: `Sourcify is the decentralized smart contract verification service. It verifies that deployed bytecode matches source code, enabling anyone to read and trust smart contracts.

Unlike Etherscan verification, Sourcify is open source and decentralized. It stores verified sources on IPFS, making them permanently available. The service supports full and partial matching.

Sourcify is integrated into block explorers and development tools. Verify once, available everywhere. Critical infrastructure for smart contract transparency and the foundation for trustless contract interaction.`,
		features: [
			{ title: 'Decentralized', description: 'IPFS storage' },
			{ title: 'Open Source', description: 'Transparent process' },
			{ title: 'Multi-Chain', description: 'EVM networks' },
			{ title: 'Full Match', description: 'Exact verification' },
			{ title: 'Partial Match', description: 'Bytecode matching' },
			{ title: 'API Access', description: 'Developer integration' }
		],
		useCases: [
			{ title: 'Contract Verification', description: 'Prove source code' },
			{ title: 'Transparency', description: 'Open source contracts' },
			{ title: 'Tool Integration', description: 'Add to your tools' },
			{ title: 'Decentralized Storage', description: 'IPFS permanence' },
			{ title: 'Multi-Chain Projects', description: 'One verification' }
		]
	},
	faqs: [
		{
			question: 'What is Sourcify?',
			answer: `Sourcify is smart contract source code verification. It confirms deployed bytecode matches the source code you claim. Open source and decentralized—stores verified code on IPFS.`
		},
		{
			question: 'Sourcify vs Etherscan verification?',
			answer: `Etherscan is centralized and chain-specific. Sourcify is decentralized, stores on IPFS, and works across chains. Verify once, available everywhere. Both are valuable—Sourcify is more open.`
		},
		{
			question: 'What is full vs partial match?',
			answer: `Full match: exact same compiler settings and metadata. Partial match: bytecode matches but metadata differs. Full match proves exact source; partial proves functional equivalence.`
		},
		{
			question: 'How do I verify with Sourcify?',
			answer: `Use their web interface, API, or integrated tools (Hardhat, Foundry plugins). Upload source files and metadata. Verification is automatic if files match deployed bytecode.`
		},
		{
			question: 'Why is decentralized verification important?',
			answer: `Centralized verification can be censored or go down. Sourcify stores on IPFS—permanent and censorship-resistant. True transparency for smart contract trust.`
		}
	],
	cta: {
		ready: 'Ready to verify contracts?',
		button: 'Use Sourcify',
		note: 'Decentralized verification'
	}
};
