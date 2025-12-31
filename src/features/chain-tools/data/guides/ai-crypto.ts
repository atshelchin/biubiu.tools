/**
 * AI-Crypto Category Guide Data
 * Long-form educational article about AI meets blockchain
 *
 * Content philosophy:
 * - Focus on understanding the convergence of AI and blockchain
 * - Include real examples of AI x Crypto projects
 * - Emphasize practical use cases and investment considerations
 * - Progressive learning from basics to advanced concepts
 */
import type { CategoryGuide } from '../../types';

export const aiCryptoGuide: CategoryGuide = {
	categoryId: 'ai-crypto',
	i18nKeyPrefix: 'routes/apps/chain-tools/ai-crypto/guide',
	estimatedReadTime: '18 min',

	sections: [
		// Part 1: Introduction
		{
			id: 'intro',
			titleKey: 'routes/apps/chain-tools/ai-crypto/guide.sections.intro.title',
			contentKey: 'routes/apps/chain-tools/ai-crypto/guide.sections.intro.content',
			toolMentions: [
				{ toolId: 'bittensor', context: 'decentralized AI network' },
				{ toolId: 'render-network', context: 'GPU infrastructure' }
			]
		},

		// Part 2: AI Infrastructure
		{
			id: 'ai-infrastructure',
			titleKey: 'routes/apps/chain-tools/ai-crypto/guide.sections.ai_infrastructure.title',
			contentKey: 'routes/apps/chain-tools/ai-crypto/guide.sections.ai_infrastructure.content',
			subsections: [
				{
					id: 'decentralized-compute',
					titleKey:
						'routes/apps/chain-tools/ai-crypto/guide.sections.ai_infrastructure.decentralized_compute.title',
					contentKey:
						'routes/apps/chain-tools/ai-crypto/guide.sections.ai_infrastructure.decentralized_compute.content',
					toolMentions: [
						{ toolId: 'akash-network', context: 'cloud compute marketplace' },
						{ toolId: 'render-network', context: 'GPU rendering network' },
						{ toolId: 'io-net', context: 'GPU compute network' }
					]
				},
				{
					id: 'gpu-networks',
					titleKey:
						'routes/apps/chain-tools/ai-crypto/guide.sections.ai_infrastructure.gpu_networks.title',
					contentKey:
						'routes/apps/chain-tools/ai-crypto/guide.sections.ai_infrastructure.gpu_networks.content',
					toolMentions: [
						{ toolId: 'render-network' },
						{ toolId: 'io-net' },
						{ toolId: 'nosana' },
						{ toolId: 'aethir' }
					]
				},
				{
					id: 'ai-inference',
					titleKey:
						'routes/apps/chain-tools/ai-crypto/guide.sections.ai_infrastructure.ai_inference.title',
					contentKey:
						'routes/apps/chain-tools/ai-crypto/guide.sections.ai_infrastructure.ai_inference.content',
					toolMentions: [
						{ toolId: 'ritual', context: 'AI coprocessor' },
						{ toolId: 'hyperbolic', context: 'inference API' }
					]
				}
			]
		},

		// Part 3: AI Agents
		{
			id: 'ai-agents',
			titleKey: 'routes/apps/chain-tools/ai-crypto/guide.sections.ai_agents.title',
			contentKey: 'routes/apps/chain-tools/ai-crypto/guide.sections.ai_agents.content',
			subsections: [
				{
					id: 'autonomous-agents',
					titleKey:
						'routes/apps/chain-tools/ai-crypto/guide.sections.ai_agents.autonomous_agents.title',
					contentKey:
						'routes/apps/chain-tools/ai-crypto/guide.sections.ai_agents.autonomous_agents.content',
					toolMentions: [
						{ toolId: 'ai16z', context: 'Eliza framework' },
						{ toolId: 'virtuals-protocol', context: 'AI agent platform' },
						{ toolId: 'autonolas', context: 'autonomous services' }
					]
				},
				{
					id: 'ai-daos',
					titleKey: 'routes/apps/chain-tools/ai-crypto/guide.sections.ai_agents.ai_daos.title',
					contentKey: 'routes/apps/chain-tools/ai-crypto/guide.sections.ai_agents.ai_daos.content',
					toolMentions: [
						{ toolId: 'fetch-ai', context: 'autonomous agents' },
						{ toolId: 'autonolas' }
					]
				},
				{
					id: 'agent-frameworks',
					titleKey:
						'routes/apps/chain-tools/ai-crypto/guide.sections.ai_agents.agent_frameworks.title',
					contentKey:
						'routes/apps/chain-tools/ai-crypto/guide.sections.ai_agents.agent_frameworks.content',
					toolMentions: [
						{ toolId: 'ai16z', context: 'Eliza framework' },
						{ toolId: 'theoriq', context: 'agent collectives' }
					]
				}
			]
		},

		// Part 4: Data Marketplaces
		{
			id: 'data-marketplace',
			titleKey: 'routes/apps/chain-tools/ai-crypto/guide.sections.data_marketplace.title',
			contentKey: 'routes/apps/chain-tools/ai-crypto/guide.sections.data_marketplace.content',
			subsections: [
				{
					id: 'data-tokenization',
					titleKey:
						'routes/apps/chain-tools/ai-crypto/guide.sections.data_marketplace.data_tokenization.title',
					contentKey:
						'routes/apps/chain-tools/ai-crypto/guide.sections.data_marketplace.data_tokenization.content',
					toolMentions: [
						{ toolId: 'ocean-protocol', context: 'data marketplace' },
						{ toolId: 'vana', context: 'data ownership' }
					]
				},
				{
					id: 'data-privacy',
					titleKey:
						'routes/apps/chain-tools/ai-crypto/guide.sections.data_marketplace.data_privacy.title',
					contentKey:
						'routes/apps/chain-tools/ai-crypto/guide.sections.data_marketplace.data_privacy.content',
					toolMentions: [
						{ toolId: 'phala-network', context: 'privacy compute' },
						{ toolId: 'nillion', context: 'private compute' }
					]
				}
			]
		},

		// Part 5: AI Models
		{
			id: 'ai-models',
			titleKey: 'routes/apps/chain-tools/ai-crypto/guide.sections.ai_models.title',
			contentKey: 'routes/apps/chain-tools/ai-crypto/guide.sections.ai_models.content',
			subsections: [
				{
					id: 'decentralized-training',
					titleKey:
						'routes/apps/chain-tools/ai-crypto/guide.sections.ai_models.decentralized_training.title',
					contentKey:
						'routes/apps/chain-tools/ai-crypto/guide.sections.ai_models.decentralized_training.content',
					toolMentions: [
						{ toolId: 'bittensor', context: 'decentralized ML network' },
						{ toolId: 'gensyn', context: 'distributed training' },
						{ toolId: 'flock-io', context: 'federated learning' }
					]
				},
				{
					id: 'model-marketplace',
					titleKey:
						'routes/apps/chain-tools/ai-crypto/guide.sections.ai_models.model_marketplace.title',
					contentKey:
						'routes/apps/chain-tools/ai-crypto/guide.sections.ai_models.model_marketplace.content',
					toolMentions: [
						{ toolId: 'singularitynet', context: 'AI services marketplace' },
						{ toolId: 'together-ai', context: 'model inference' }
					]
				},
				{
					id: 'zkml',
					titleKey: 'routes/apps/chain-tools/ai-crypto/guide.sections.ai_models.zkml.title',
					contentKey: 'routes/apps/chain-tools/ai-crypto/guide.sections.ai_models.zkml.content',
					toolMentions: [
						{ toolId: 'modulus-labs', context: 'ZKML proofs' },
						{ toolId: 'ezkl', context: 'ZK inference' },
						{ toolId: 'giza', context: 'ZKML on StarkNet' }
					]
				}
			]
		},

		// Part 6: AI Tools for Crypto
		{
			id: 'ai-tools-for-crypto',
			titleKey: 'routes/apps/chain-tools/ai-crypto/guide.sections.ai_tools_for_crypto.title',
			contentKey: 'routes/apps/chain-tools/ai-crypto/guide.sections.ai_tools_for_crypto.content',
			subsections: [
				{
					id: 'trading-bots',
					titleKey:
						'routes/apps/chain-tools/ai-crypto/guide.sections.ai_tools_for_crypto.trading_bots.title',
					contentKey:
						'routes/apps/chain-tools/ai-crypto/guide.sections.ai_tools_for_crypto.trading_bots.content',
					toolMentions: [
						{ toolId: 'numerai', context: 'data science hedge fund' },
						{ toolId: 'spectral-ai', context: 'onchain credit scoring' }
					]
				},
				{
					id: 'analytics',
					titleKey:
						'routes/apps/chain-tools/ai-crypto/guide.sections.ai_tools_for_crypto.analytics.title',
					contentKey:
						'routes/apps/chain-tools/ai-crypto/guide.sections.ai_tools_for_crypto.analytics.content',
					toolMentions: [
						{ toolId: 'defillama-ai', context: 'AI protocol tracking' },
						{ toolId: 'cookie-ai', context: 'agent analytics' }
					]
				},
				{
					id: 'security',
					titleKey:
						'routes/apps/chain-tools/ai-crypto/guide.sections.ai_tools_for_crypto.security.title',
					contentKey:
						'routes/apps/chain-tools/ai-crypto/guide.sections.ai_tools_for_crypto.security.content'
				}
			]
		},

		// Part 7: Investment Considerations
		{
			id: 'investment-considerations',
			titleKey: 'routes/apps/chain-tools/ai-crypto/guide.sections.investment_considerations.title',
			contentKey:
				'routes/apps/chain-tools/ai-crypto/guide.sections.investment_considerations.content',
			subsections: [
				{
					id: 'token-economics',
					titleKey:
						'routes/apps/chain-tools/ai-crypto/guide.sections.investment_considerations.token_economics.title',
					contentKey:
						'routes/apps/chain-tools/ai-crypto/guide.sections.investment_considerations.token_economics.content'
				},
				{
					id: 'risks',
					titleKey:
						'routes/apps/chain-tools/ai-crypto/guide.sections.investment_considerations.risks.title',
					contentKey:
						'routes/apps/chain-tools/ai-crypto/guide.sections.investment_considerations.risks.content'
				},
				{
					id: 'opportunities',
					titleKey:
						'routes/apps/chain-tools/ai-crypto/guide.sections.investment_considerations.opportunities.title',
					contentKey:
						'routes/apps/chain-tools/ai-crypto/guide.sections.investment_considerations.opportunities.content'
				}
			]
		}
	],

	// Glossary for quick reference
	glossary: [
		{
			id: 'decentralized-compute',
			termKey: 'routes/apps/chain-tools/ai-crypto/guide.glossary.decentralized_compute.term',
			definitionKey:
				'routes/apps/chain-tools/ai-crypto/guide.glossary.decentralized_compute.definition',
			relatedToolIds: ['akash-network', 'render-network', 'io-net']
		},
		{
			id: 'gpu-network',
			termKey: 'routes/apps/chain-tools/ai-crypto/guide.glossary.gpu_network.term',
			definitionKey: 'routes/apps/chain-tools/ai-crypto/guide.glossary.gpu_network.definition',
			relatedToolIds: ['render-network', 'io-net', 'aethir']
		},
		{
			id: 'ai-agent',
			termKey: 'routes/apps/chain-tools/ai-crypto/guide.glossary.ai_agent.term',
			definitionKey: 'routes/apps/chain-tools/ai-crypto/guide.glossary.ai_agent.definition',
			relatedToolIds: ['ai16z', 'virtuals-protocol', 'autonolas']
		},
		{
			id: 'data-marketplace',
			termKey: 'routes/apps/chain-tools/ai-crypto/guide.glossary.data_marketplace.term',
			definitionKey: 'routes/apps/chain-tools/ai-crypto/guide.glossary.data_marketplace.definition',
			relatedToolIds: ['ocean-protocol', 'vana']
		},
		{
			id: 'model-training',
			termKey: 'routes/apps/chain-tools/ai-crypto/guide.glossary.model_training.term',
			definitionKey: 'routes/apps/chain-tools/ai-crypto/guide.glossary.model_training.definition',
			relatedToolIds: ['bittensor', 'gensyn', 'flock-io']
		},
		{
			id: 'inference',
			termKey: 'routes/apps/chain-tools/ai-crypto/guide.glossary.inference.term',
			definitionKey: 'routes/apps/chain-tools/ai-crypto/guide.glossary.inference.definition',
			relatedToolIds: ['ritual', 'hyperbolic', 'together-ai']
		},
		{
			id: 'tokenized-compute',
			termKey: 'routes/apps/chain-tools/ai-crypto/guide.glossary.tokenized_compute.term',
			definitionKey:
				'routes/apps/chain-tools/ai-crypto/guide.glossary.tokenized_compute.definition',
			relatedToolIds: ['render-network', 'akash-network']
		},
		{
			id: 'ai-dao',
			termKey: 'routes/apps/chain-tools/ai-crypto/guide.glossary.ai_dao.term',
			definitionKey: 'routes/apps/chain-tools/ai-crypto/guide.glossary.ai_dao.definition',
			relatedToolIds: ['fetch-ai', 'autonolas']
		},
		{
			id: 'vector-database',
			termKey: 'routes/apps/chain-tools/ai-crypto/guide.glossary.vector_database.term',
			definitionKey: 'routes/apps/chain-tools/ai-crypto/guide.glossary.vector_database.definition',
			relatedToolIds: ['kip-protocol', 'sahara-ai']
		},
		{
			id: 'llm',
			termKey: 'routes/apps/chain-tools/ai-crypto/guide.glossary.llm.term',
			definitionKey: 'routes/apps/chain-tools/ai-crypto/guide.glossary.llm.definition',
			relatedToolIds: ['venice-ai', 'corcel']
		}
	],

	// Featured tools shown in sidebar/footer
	featuredToolIds: [
		'bittensor',
		'render-network',
		'akash-network',
		'ai16z',
		'ocean-protocol',
		'fetch-ai',
		'ritual',
		'worldcoin'
	],

	lastUpdated: '2025-12-31'
};
