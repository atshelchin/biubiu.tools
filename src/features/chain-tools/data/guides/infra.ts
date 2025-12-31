/**
 * Infrastructure Category Guide Data
 * Comprehensive guide to blockchain infrastructure services
 *
 * Content philosophy:
 * - Focus on practical infrastructure choices for developers
 * - Cover RPC providers, node services, storage, and APIs
 * - Emphasize reliability, performance, and cost considerations
 * - Include real-world setup examples and best practices
 */
import type { CategoryGuide } from '../../types';

export const infraGuide: CategoryGuide = {
	categoryId: 'infra',
	i18nKeyPrefix: 'routes/apps/chain-tools/infra/guide',
	estimatedReadTime: '18 min',

	sections: [
		// Part 1: Understanding Infrastructure
		{
			id: 'intro',
			titleKey: 'routes/apps/chain-tools/infra/guide.sections.intro.title',
			contentKey: 'routes/apps/chain-tools/infra/guide.sections.intro.content',
			toolMentions: [
				{ toolId: 'alchemy', context: 'comprehensive infrastructure' },
				{ toolId: 'infura', context: 'reliable RPC provider' }
			]
		},

		// Part 2: RPC Providers
		{
			id: 'rpc-providers',
			titleKey: 'routes/apps/chain-tools/infra/guide.sections.rpc_providers.title',
			contentKey: 'routes/apps/chain-tools/infra/guide.sections.rpc_providers.content',
			subsections: [
				{
					id: 'what-is-rpc',
					titleKey: 'routes/apps/chain-tools/infra/guide.sections.rpc_providers.what_is_rpc.title',
					contentKey:
						'routes/apps/chain-tools/infra/guide.sections.rpc_providers.what_is_rpc.content'
				},
				{
					id: 'provider-comparison',
					titleKey:
						'routes/apps/chain-tools/infra/guide.sections.rpc_providers.provider_comparison.title',
					contentKey:
						'routes/apps/chain-tools/infra/guide.sections.rpc_providers.provider_comparison.content',
					toolMentions: [
						{ toolId: 'alchemy', context: 'premium features' },
						{ toolId: 'infura', context: 'industry standard' },
						{ toolId: 'quicknode', context: 'performance focus' },
						{ toolId: 'ankr', context: 'decentralized option' }
					]
				},
				{
					id: 'choosing-provider',
					titleKey:
						'routes/apps/chain-tools/infra/guide.sections.rpc_providers.choosing_provider.title',
					contentKey:
						'routes/apps/chain-tools/infra/guide.sections.rpc_providers.choosing_provider.content'
				}
			]
		},

		// Part 3: Node Services
		{
			id: 'node-services',
			titleKey: 'routes/apps/chain-tools/infra/guide.sections.node_services.title',
			contentKey: 'routes/apps/chain-tools/infra/guide.sections.node_services.content',
			subsections: [
				{
					id: 'running-nodes',
					titleKey:
						'routes/apps/chain-tools/infra/guide.sections.node_services.running_nodes.title',
					contentKey:
						'routes/apps/chain-tools/infra/guide.sections.node_services.running_nodes.content'
				},
				{
					id: 'node-as-service',
					titleKey:
						'routes/apps/chain-tools/infra/guide.sections.node_services.node_as_service.title',
					contentKey:
						'routes/apps/chain-tools/infra/guide.sections.node_services.node_as_service.content',
					toolMentions: [
						{ toolId: 'quicknode', context: 'managed nodes' },
						{ toolId: 'chainstack', context: 'enterprise solutions' }
					]
				}
			]
		},

		// Part 4: Data Availability & APIs
		{
			id: 'data-apis',
			titleKey: 'routes/apps/chain-tools/infra/guide.sections.data_apis.title',
			contentKey: 'routes/apps/chain-tools/infra/guide.sections.data_apis.content',
			subsections: [
				{
					id: 'indexing-querying',
					titleKey:
						'routes/apps/chain-tools/infra/guide.sections.data_apis.indexing_querying.title',
					contentKey:
						'routes/apps/chain-tools/infra/guide.sections.data_apis.indexing_querying.content',
					toolMentions: [
						{ toolId: 'the-graph', context: 'decentralized indexing' },
						{ toolId: 'moralis', context: 'ready-made APIs' }
					]
				},
				{
					id: 'api-providers',
					titleKey: 'routes/apps/chain-tools/infra/guide.sections.data_apis.api_providers.title',
					contentKey:
						'routes/apps/chain-tools/infra/guide.sections.data_apis.api_providers.content',
					toolMentions: [{ toolId: 'alchemy', context: 'enhanced APIs' }]
				}
			]
		},

		// Part 5: Decentralized Storage
		{
			id: 'storage',
			titleKey: 'routes/apps/chain-tools/infra/guide.sections.storage.title',
			contentKey: 'routes/apps/chain-tools/infra/guide.sections.storage.content',
			subsections: [
				{
					id: 'ipfs',
					titleKey: 'routes/apps/chain-tools/infra/guide.sections.storage.ipfs.title',
					contentKey: 'routes/apps/chain-tools/infra/guide.sections.storage.ipfs.content',
					toolMentions: [{ toolId: 'ipfs', context: 'content-addressed storage' }]
				},
				{
					id: 'permanent-storage',
					titleKey: 'routes/apps/chain-tools/infra/guide.sections.storage.permanent_storage.title',
					contentKey:
						'routes/apps/chain-tools/infra/guide.sections.storage.permanent_storage.content',
					toolMentions: [
						{ toolId: 'arweave', context: 'permanent storage' },
						{ toolId: 'filecoin', context: 'decentralized storage market' }
					]
				}
			]
		},

		// Part 6: Messaging & Communication
		{
			id: 'messaging',
			titleKey: 'routes/apps/chain-tools/infra/guide.sections.messaging.title',
			contentKey: 'routes/apps/chain-tools/infra/guide.sections.messaging.content',
			subsections: [
				{
					id: 'notifications',
					titleKey: 'routes/apps/chain-tools/infra/guide.sections.messaging.notifications.title',
					contentKey:
						'routes/apps/chain-tools/infra/guide.sections.messaging.notifications.content',
					toolMentions: [{ toolId: 'push-protocol', context: 'web3 notifications' }]
				},
				{
					id: 'messaging-protocols',
					titleKey:
						'routes/apps/chain-tools/infra/guide.sections.messaging.messaging_protocols.title',
					contentKey:
						'routes/apps/chain-tools/infra/guide.sections.messaging.messaging_protocols.content',
					toolMentions: [{ toolId: 'xmtp', context: 'encrypted messaging' }]
				}
			]
		},

		// Part 7: Monitoring & Observability
		{
			id: 'monitoring',
			titleKey: 'routes/apps/chain-tools/infra/guide.sections.monitoring.title',
			contentKey: 'routes/apps/chain-tools/infra/guide.sections.monitoring.content',
			subsections: [
				{
					id: 'observability',
					titleKey: 'routes/apps/chain-tools/infra/guide.sections.monitoring.observability.title',
					contentKey:
						'routes/apps/chain-tools/infra/guide.sections.monitoring.observability.content',
					toolMentions: [{ toolId: 'tenderly', context: 'monitoring and debugging' }]
				},
				{
					id: 'alerts',
					titleKey: 'routes/apps/chain-tools/infra/guide.sections.monitoring.alerts.title',
					contentKey: 'routes/apps/chain-tools/infra/guide.sections.monitoring.alerts.content'
				}
			]
		},

		// Part 8: Best Practices
		{
			id: 'best-practices',
			titleKey: 'routes/apps/chain-tools/infra/guide.sections.best_practices.title',
			contentKey: 'routes/apps/chain-tools/infra/guide.sections.best_practices.content',
			subsections: [
				{
					id: 'redundancy',
					titleKey: 'routes/apps/chain-tools/infra/guide.sections.best_practices.redundancy.title',
					contentKey:
						'routes/apps/chain-tools/infra/guide.sections.best_practices.redundancy.content'
				},
				{
					id: 'cost-optimization',
					titleKey:
						'routes/apps/chain-tools/infra/guide.sections.best_practices.cost_optimization.title',
					contentKey:
						'routes/apps/chain-tools/infra/guide.sections.best_practices.cost_optimization.content'
				}
			]
		}
	],

	// Glossary for quick reference
	glossary: [
		{
			id: 'rpc',
			termKey: 'routes/apps/chain-tools/infra/guide.glossary.rpc.term',
			definitionKey: 'routes/apps/chain-tools/infra/guide.glossary.rpc.definition',
			relatedToolIds: ['alchemy', 'infura', 'quicknode']
		},
		{
			id: 'node',
			termKey: 'routes/apps/chain-tools/infra/guide.glossary.node.term',
			definitionKey: 'routes/apps/chain-tools/infra/guide.glossary.node.definition',
			relatedToolIds: ['quicknode', 'chainstack']
		},
		{
			id: 'archive-node',
			termKey: 'routes/apps/chain-tools/infra/guide.glossary.archive_node.term',
			definitionKey: 'routes/apps/chain-tools/infra/guide.glossary.archive_node.definition',
			relatedToolIds: ['alchemy', 'quicknode']
		},
		{
			id: 'light-client',
			termKey: 'routes/apps/chain-tools/infra/guide.glossary.light_client.term',
			definitionKey: 'routes/apps/chain-tools/infra/guide.glossary.light_client.definition'
		},
		{
			id: 'ipfs',
			termKey: 'routes/apps/chain-tools/infra/guide.glossary.ipfs.term',
			definitionKey: 'routes/apps/chain-tools/infra/guide.glossary.ipfs.definition',
			relatedToolIds: ['ipfs']
		},
		{
			id: 'data-availability',
			termKey: 'routes/apps/chain-tools/infra/guide.glossary.data_availability.term',
			definitionKey: 'routes/apps/chain-tools/infra/guide.glossary.data_availability.definition'
		},
		{
			id: 'latency',
			termKey: 'routes/apps/chain-tools/infra/guide.glossary.latency.term',
			definitionKey: 'routes/apps/chain-tools/infra/guide.glossary.latency.definition',
			relatedToolIds: ['quicknode']
		},
		{
			id: 'redundancy',
			termKey: 'routes/apps/chain-tools/infra/guide.glossary.redundancy.term',
			definitionKey: 'routes/apps/chain-tools/infra/guide.glossary.redundancy.definition'
		},
		{
			id: 'api-key',
			termKey: 'routes/apps/chain-tools/infra/guide.glossary.api_key.term',
			definitionKey: 'routes/apps/chain-tools/infra/guide.glossary.api_key.definition',
			relatedToolIds: ['alchemy', 'infura', 'moralis']
		},
		{
			id: 'rate-limit',
			termKey: 'routes/apps/chain-tools/infra/guide.glossary.rate_limit.term',
			definitionKey: 'routes/apps/chain-tools/infra/guide.glossary.rate_limit.definition'
		}
	],

	// Featured tools shown in sidebar/footer
	featuredToolIds: [
		'alchemy',
		'infura',
		'quicknode',
		'the-graph',
		'moralis',
		'ipfs',
		'arweave',
		'push-protocol'
	],

	lastUpdated: '2025-12-31'
};
