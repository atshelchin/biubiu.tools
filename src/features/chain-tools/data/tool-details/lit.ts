import type { ToolDetail } from '../../types';

export const litDetail: ToolDetail = {
	about: {
		overview: `Lit Protocol is decentralized key management and programmable signing infrastructure. Their network of nodes collectively manages keys, enabling PKPs (Programmable Key Pairs) and access control.

Key features include decentralized signing (threshold cryptography), access control (blockchain-based conditions), and PKPs (keys controlled by code). Powerful primitives for advanced Web3 applications.

Lit enables use cases like: signing based on token ownership, time-locked decryption, cross-chain authentication. They're building the decentralized layer for key management and access control.`,
		features: [
			{ title: 'Decentralized Keys', description: 'Threshold crypto' },
			{ title: 'PKPs', description: 'Programmable keys' },
			{ title: 'Access Control', description: 'Blockchain conditions' },
			{ title: 'Cross-Chain', description: 'Multi-chain signing' },
			{ title: 'Encryption', description: 'Conditional decrypt' },
			{ title: 'Automation', description: 'Programmable signing' }
		],
		useCases: [
			{ title: 'Token Gating', description: 'NFT-based access' },
			{ title: 'Encryption', description: 'Conditional access' },
			{ title: 'Cross-Chain', description: 'Multi-chain auth' },
			{ title: 'Automation', description: 'Programmable signing' },
			{ title: 'PKP Wallets', description: 'Code-controlled' }
		]
	},
	faqs: [
		{
			question: 'What is Lit Protocol?',
			answer: `Lit is decentralized key management. Their node network collectively manages keys using threshold cryptography. Enables signing based on conditions, programmable keys (PKPs), and access control.`
		},
		{
			question: 'What are PKPs?',
			answer: `Programmable Key Pairs are keys controlled by code. Define conditions for when/how they sign. Enables automated, condition-based blockchain interactions without exposing private keys.`
		},
		{
			question: 'How does access control work?',
			answer: `Set conditions based on blockchain state: token ownership, DAO membership, on-chain data. Lit nodes verify conditions before allowing access/signing. Decentralized enforcement.`
		},
		{
			question: 'Use cases for Lit?',
			answer: `Token-gated content, cross-chain authentication, conditional encryption, automated signing, Web3 SSO. Any use case needing programmable or conditional key operations.`
		},
		{
			question: 'How decentralized is it?',
			answer: `Lit uses threshold cryptography across a node network. No single node has complete keys. Decentralization is core to security—keys only exist distributed across nodes.`
		}
	],
	cta: {
		ready: 'Ready for programmable keys?',
		button: 'Explore Lit',
		note: 'Decentralized key management'
	}
};
