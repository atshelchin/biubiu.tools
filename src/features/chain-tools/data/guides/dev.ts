/**
 * Dev Category Guide Data
 * Comprehensive guide to Web3 development tools and frameworks
 *
 * Content philosophy:
 * - Cover the complete developer toolchain from IDE to deployment
 * - Compare different frameworks and their use cases
 * - Include practical guidance for setting up development environments
 * - Progressive learning from basics to advanced smart contract development
 */
import type { CategoryGuide } from '../../types';

export const devGuide: CategoryGuide = {
	categoryId: 'dev',
	i18nKeyPrefix: 'routes/apps/chain-tools/dev/guide',
	estimatedReadTime: '25 min',

	sections: [
		// Part 1: Introduction to Web3 Development
		{
			id: 'intro',
			titleKey: 'routes/apps/chain-tools/dev/guide.sections.intro.title',
			contentKey: 'routes/apps/chain-tools/dev/guide.sections.intro.content',
			toolMentions: [
				{ toolId: 'remix', context: 'beginner-friendly IDE' },
				{ toolId: 'hardhat', context: 'professional development' }
			]
		},
		{
			id: 'dev-basics',
			titleKey: 'routes/apps/chain-tools/dev/guide.sections.dev_basics.title',
			contentKey: 'routes/apps/chain-tools/dev/guide.sections.dev_basics.content',
			subsections: [
				{
					id: 'what-is-smart-contract',
					titleKey: 'routes/apps/chain-tools/dev/guide.sections.dev_basics.what_is.title',
					contentKey: 'routes/apps/chain-tools/dev/guide.sections.dev_basics.what_is.content'
				},
				{
					id: 'dev-environment',
					titleKey: 'routes/apps/chain-tools/dev/guide.sections.dev_basics.environment.title',
					contentKey: 'routes/apps/chain-tools/dev/guide.sections.dev_basics.environment.content',
					toolMentions: [
						{ toolId: 'chainlist', context: 'network configuration' },
						{ toolId: 'remix', context: 'browser-based IDE' }
					]
				},
				{
					id: 'testnet-faucets',
					titleKey: 'routes/apps/chain-tools/dev/guide.sections.dev_basics.testnets.title',
					contentKey: 'routes/apps/chain-tools/dev/guide.sections.dev_basics.testnets.content'
				}
			]
		},

		// Part 2: Development Frameworks
		{
			id: 'frameworks',
			titleKey: 'routes/apps/chain-tools/dev/guide.sections.frameworks.title',
			contentKey: 'routes/apps/chain-tools/dev/guide.sections.frameworks.content',
			subsections: [
				{
					id: 'hardhat',
					titleKey: 'routes/apps/chain-tools/dev/guide.sections.frameworks.hardhat.title',
					contentKey: 'routes/apps/chain-tools/dev/guide.sections.frameworks.hardhat.content',
					toolMentions: [{ toolId: 'hardhat', context: 'JavaScript/TypeScript framework' }]
				},
				{
					id: 'foundry',
					titleKey: 'routes/apps/chain-tools/dev/guide.sections.frameworks.foundry.title',
					contentKey: 'routes/apps/chain-tools/dev/guide.sections.frameworks.foundry.content',
					toolMentions: [{ toolId: 'foundry', context: 'Rust-based framework' }]
				},
				{
					id: 'remix',
					titleKey: 'routes/apps/chain-tools/dev/guide.sections.frameworks.remix.title',
					contentKey: 'routes/apps/chain-tools/dev/guide.sections.frameworks.remix.content',
					toolMentions: [{ toolId: 'remix', context: 'browser IDE' }]
				},
				{
					id: 'comparison',
					titleKey: 'routes/apps/chain-tools/dev/guide.sections.frameworks.comparison.title',
					contentKey: 'routes/apps/chain-tools/dev/guide.sections.frameworks.comparison.content'
				}
			]
		},

		// Part 3: Smart Contract Languages
		{
			id: 'languages',
			titleKey: 'routes/apps/chain-tools/dev/guide.sections.languages.title',
			contentKey: 'routes/apps/chain-tools/dev/guide.sections.languages.content',
			subsections: [
				{
					id: 'solidity',
					titleKey: 'routes/apps/chain-tools/dev/guide.sections.languages.solidity.title',
					contentKey: 'routes/apps/chain-tools/dev/guide.sections.languages.solidity.content',
					toolMentions: [
						{ toolId: 'solidity-lang', context: 'official documentation' },
						{ toolId: 'solidity-by-example', context: 'code examples' }
					]
				},
				{
					id: 'vyper',
					titleKey: 'routes/apps/chain-tools/dev/guide.sections.languages.vyper.title',
					contentKey: 'routes/apps/chain-tools/dev/guide.sections.languages.vyper.content',
					toolMentions: [{ toolId: 'vyper-lang', context: 'Python-like EVM language' }]
				},
				{
					id: 'other-languages',
					titleKey: 'routes/apps/chain-tools/dev/guide.sections.languages.others.title',
					contentKey: 'routes/apps/chain-tools/dev/guide.sections.languages.others.content',
					toolMentions: [
						{ toolId: 'cairo-lang', context: 'StarkNet development' },
						{ toolId: 'move-lang', context: 'Sui/Aptos development' },
						{ toolId: 'anchor-lang', context: 'Solana development' }
					]
				}
			]
		},

		// Part 4: Frontend Integration
		{
			id: 'frontend',
			titleKey: 'routes/apps/chain-tools/dev/guide.sections.frontend.title',
			contentKey: 'routes/apps/chain-tools/dev/guide.sections.frontend.content',
			subsections: [
				{
					id: 'web3-libraries',
					titleKey: 'routes/apps/chain-tools/dev/guide.sections.frontend.libraries.title',
					contentKey: 'routes/apps/chain-tools/dev/guide.sections.frontend.libraries.content',
					toolMentions: [
						{ toolId: 'ethers-js', context: 'classic library' },
						{ toolId: 'viem', context: 'modern TypeScript alternative' }
					]
				},
				{
					id: 'react-hooks',
					titleKey: 'routes/apps/chain-tools/dev/guide.sections.frontend.hooks.title',
					contentKey: 'routes/apps/chain-tools/dev/guide.sections.frontend.hooks.content',
					toolMentions: [{ toolId: 'wagmi', context: 'React hooks for Ethereum' }]
				},
				{
					id: 'wallet-connection',
					titleKey: 'routes/apps/chain-tools/dev/guide.sections.frontend.wallet.title',
					contentKey: 'routes/apps/chain-tools/dev/guide.sections.frontend.wallet.content',
					toolMentions: [
						{ toolId: 'rainbowkit', context: 'beautiful wallet modal' },
						{ toolId: 'web3modal', context: 'WalletConnect solution' }
					]
				}
			]
		},

		// Part 5: Node Providers & Infrastructure
		{
			id: 'infrastructure',
			titleKey: 'routes/apps/chain-tools/dev/guide.sections.infrastructure.title',
			contentKey: 'routes/apps/chain-tools/dev/guide.sections.infrastructure.content',
			subsections: [
				{
					id: 'rpc-providers',
					titleKey: 'routes/apps/chain-tools/dev/guide.sections.infrastructure.rpc.title',
					contentKey: 'routes/apps/chain-tools/dev/guide.sections.infrastructure.rpc.content',
					toolMentions: [
						{ toolId: 'alchemy', context: 'enterprise RPC' },
						{ toolId: 'infura', context: 'reliable infrastructure' },
						{ toolId: 'quicknode', context: 'multi-chain support' }
					]
				},
				{
					id: 'indexers',
					titleKey: 'routes/apps/chain-tools/dev/guide.sections.infrastructure.indexers.title',
					contentKey: 'routes/apps/chain-tools/dev/guide.sections.infrastructure.indexers.content',
					toolMentions: [
						{ toolId: 'the-graph', context: 'subgraph indexing' },
						{ toolId: 'goldsky', context: 'real-time streaming' },
						{ toolId: 'envio', context: 'HyperSync indexing' }
					]
				},
				{
					id: 'data-apis',
					titleKey: 'routes/apps/chain-tools/dev/guide.sections.infrastructure.apis.title',
					contentKey: 'routes/apps/chain-tools/dev/guide.sections.infrastructure.apis.content',
					toolMentions: [
						{ toolId: 'moralis', context: 'NFT and DeFi APIs' },
						{ toolId: 'covalent', context: 'unified blockchain API' }
					]
				}
			]
		},

		// Part 6: Testing & Debugging
		{
			id: 'testing',
			titleKey: 'routes/apps/chain-tools/dev/guide.sections.testing.title',
			contentKey: 'routes/apps/chain-tools/dev/guide.sections.testing.content',
			subsections: [
				{
					id: 'unit-testing',
					titleKey: 'routes/apps/chain-tools/dev/guide.sections.testing.unit.title',
					contentKey: 'routes/apps/chain-tools/dev/guide.sections.testing.unit.content',
					toolMentions: [
						{ toolId: 'foundry', context: 'Forge testing' },
						{ toolId: 'hardhat', context: 'Chai/Mocha testing' }
					]
				},
				{
					id: 'debugging',
					titleKey: 'routes/apps/chain-tools/dev/guide.sections.testing.debugging.title',
					contentKey: 'routes/apps/chain-tools/dev/guide.sections.testing.debugging.content',
					toolMentions: [{ toolId: 'tenderly', context: 'transaction simulation' }]
				},
				{
					id: 'fuzz-testing',
					titleKey: 'routes/apps/chain-tools/dev/guide.sections.testing.fuzz.title',
					contentKey: 'routes/apps/chain-tools/dev/guide.sections.testing.fuzz.content',
					toolMentions: [{ toolId: 'foundry', context: 'built-in fuzzer' }]
				}
			]
		},

		// Part 7: Contract Verification & Deployment
		{
			id: 'deployment',
			titleKey: 'routes/apps/chain-tools/dev/guide.sections.deployment.title',
			contentKey: 'routes/apps/chain-tools/dev/guide.sections.deployment.content',
			subsections: [
				{
					id: 'verification',
					titleKey: 'routes/apps/chain-tools/dev/guide.sections.deployment.verification.title',
					contentKey: 'routes/apps/chain-tools/dev/guide.sections.deployment.verification.content',
					toolMentions: [
						{ toolId: 'sourcify', context: 'decentralized verification' },
						{ toolId: 'etherscan', context: 'contract verification' }
					]
				},
				{
					id: 'deployment-strategies',
					titleKey: 'routes/apps/chain-tools/dev/guide.sections.deployment.strategies.title',
					contentKey: 'routes/apps/chain-tools/dev/guide.sections.deployment.strategies.content'
				},
				{
					id: 'upgradeability',
					titleKey: 'routes/apps/chain-tools/dev/guide.sections.deployment.upgrades.title',
					contentKey: 'routes/apps/chain-tools/dev/guide.sections.deployment.upgrades.content'
				}
			]
		},

		// Part 8: Oracles & External Data
		{
			id: 'oracles',
			titleKey: 'routes/apps/chain-tools/dev/guide.sections.oracles.title',
			contentKey: 'routes/apps/chain-tools/dev/guide.sections.oracles.content',
			subsections: [
				{
					id: 'price-feeds',
					titleKey: 'routes/apps/chain-tools/dev/guide.sections.oracles.price_feeds.title',
					contentKey: 'routes/apps/chain-tools/dev/guide.sections.oracles.price_feeds.content',
					toolMentions: [
						{ toolId: 'chainlink', context: 'industry standard oracle' },
						{ toolId: 'pyth', context: 'high-frequency price feeds' }
					]
				},
				{
					id: 'vrf',
					titleKey: 'routes/apps/chain-tools/dev/guide.sections.oracles.vrf.title',
					contentKey: 'routes/apps/chain-tools/dev/guide.sections.oracles.vrf.content',
					toolMentions: [{ toolId: 'chainlink', context: 'VRF service' }]
				}
			]
		},

		// Part 9: Learning Resources
		{
			id: 'learning',
			titleKey: 'routes/apps/chain-tools/dev/guide.sections.learning.title',
			contentKey: 'routes/apps/chain-tools/dev/guide.sections.learning.content',
			subsections: [
				{
					id: 'tutorials',
					titleKey: 'routes/apps/chain-tools/dev/guide.sections.learning.tutorials.title',
					contentKey: 'routes/apps/chain-tools/dev/guide.sections.learning.tutorials.content',
					toolMentions: [
						{ toolId: 'crypto-zombies', context: 'gamified learning' },
						{ toolId: 'speedrun-ethereum', context: 'challenge-based learning' },
						{ toolId: 'solidity-by-example', context: 'code examples' }
					]
				},
				{
					id: 'starter-kits',
					titleKey: 'routes/apps/chain-tools/dev/guide.sections.learning.starters.title',
					contentKey: 'routes/apps/chain-tools/dev/guide.sections.learning.starters.content',
					toolMentions: [
						{ toolId: 'scaffold-eth', context: 'rapid prototyping' },
						{ toolId: 'thirdweb', context: 'full-stack SDK' }
					]
				},
				{
					id: 'documentation',
					titleKey: 'routes/apps/chain-tools/dev/guide.sections.learning.docs.title',
					contentKey: 'routes/apps/chain-tools/dev/guide.sections.learning.docs.content',
					toolMentions: [
						{ toolId: 'solidity-lang', context: 'official Solidity docs' },
						{ toolId: 'evm-codes', context: 'EVM opcode reference' }
					]
				}
			]
		}
	],

	// Glossary for quick reference
	glossary: [
		{
			id: 'abi',
			termKey: 'routes/apps/chain-tools/dev/guide.glossary.abi.term',
			definitionKey: 'routes/apps/chain-tools/dev/guide.glossary.abi.definition',
			relatedToolIds: ['abi-ninja', 'etherscan']
		},
		{
			id: 'bytecode',
			termKey: 'routes/apps/chain-tools/dev/guide.glossary.bytecode.term',
			definitionKey: 'routes/apps/chain-tools/dev/guide.glossary.bytecode.definition'
		},
		{
			id: 'evm',
			termKey: 'routes/apps/chain-tools/dev/guide.glossary.evm.term',
			definitionKey: 'routes/apps/chain-tools/dev/guide.glossary.evm.definition',
			relatedToolIds: ['evm-codes']
		},
		{
			id: 'gas',
			termKey: 'routes/apps/chain-tools/dev/guide.glossary.gas.term',
			definitionKey: 'routes/apps/chain-tools/dev/guide.glossary.gas.definition'
		},
		{
			id: 'opcode',
			termKey: 'routes/apps/chain-tools/dev/guide.glossary.opcode.term',
			definitionKey: 'routes/apps/chain-tools/dev/guide.glossary.opcode.definition',
			relatedToolIds: ['evm-codes']
		},
		{
			id: 'rpc',
			termKey: 'routes/apps/chain-tools/dev/guide.glossary.rpc.term',
			definitionKey: 'routes/apps/chain-tools/dev/guide.glossary.rpc.definition',
			relatedToolIds: ['alchemy', 'infura', 'quicknode']
		},
		{
			id: 'subgraph',
			termKey: 'routes/apps/chain-tools/dev/guide.glossary.subgraph.term',
			definitionKey: 'routes/apps/chain-tools/dev/guide.glossary.subgraph.definition',
			relatedToolIds: ['the-graph', 'goldsky']
		},
		{
			id: 'function-selector',
			termKey: 'routes/apps/chain-tools/dev/guide.glossary.selector.term',
			definitionKey: 'routes/apps/chain-tools/dev/guide.glossary.selector.definition',
			relatedToolIds: ['ethereum-signature-db']
		},
		{
			id: 'proxy',
			termKey: 'routes/apps/chain-tools/dev/guide.glossary.proxy.term',
			definitionKey: 'routes/apps/chain-tools/dev/guide.glossary.proxy.definition'
		},
		{
			id: 'oracle',
			termKey: 'routes/apps/chain-tools/dev/guide.glossary.oracle.term',
			definitionKey: 'routes/apps/chain-tools/dev/guide.glossary.oracle.definition',
			relatedToolIds: ['chainlink', 'pyth']
		},
		{
			id: 'testnet',
			termKey: 'routes/apps/chain-tools/dev/guide.glossary.testnet.term',
			definitionKey: 'routes/apps/chain-tools/dev/guide.glossary.testnet.definition',
			relatedToolIds: ['chainlist']
		},
		{
			id: 'mainnet',
			termKey: 'routes/apps/chain-tools/dev/guide.glossary.mainnet.term',
			definitionKey: 'routes/apps/chain-tools/dev/guide.glossary.mainnet.definition'
		}
	],

	// Featured tools shown in sidebar/footer
	featuredToolIds: [
		'hardhat',
		'foundry',
		'remix',
		'viem',
		'wagmi',
		'alchemy',
		'the-graph',
		'chainlink'
	],

	lastUpdated: '2025-12-31'
};
