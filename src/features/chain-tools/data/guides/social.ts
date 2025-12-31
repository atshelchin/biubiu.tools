/**
 * Social (Web3 Social) Category Guide Data
 * Long-form educational article with real examples and case studies
 *
 * Content philosophy:
 * - Focus on understanding decentralized social media evolution
 * - Include real examples of social protocols and platforms
 * - Emphasize ownership, monetization, and community building
 * - Progressive learning from basics to building your presence
 */
import type { CategoryGuide } from '../../types';

export const socialGuide: CategoryGuide = {
	categoryId: 'social',
	i18nKeyPrefix: 'routes/apps/chain-tools/social/guide',
	estimatedReadTime: '18 min',

	sections: [
		// Part 1: Introduction
		{
			id: 'intro',
			titleKey: 'routes/apps/chain-tools/social/guide.sections.intro.title',
			contentKey: 'routes/apps/chain-tools/social/guide.sections.intro.content',
			toolMentions: [
				{ toolId: 'lens-protocol', context: 'leading social protocol' },
				{ toolId: 'farcaster', context: 'decentralized social network' }
			]
		},

		// Part 2: Social Protocols
		{
			id: 'social-protocols',
			titleKey: 'routes/apps/chain-tools/social/guide.sections.social_protocols.title',
			contentKey: 'routes/apps/chain-tools/social/guide.sections.social_protocols.content',
			subsections: [
				{
					id: 'lens-protocol',
					titleKey:
						'routes/apps/chain-tools/social/guide.sections.social_protocols.lens_protocol.title',
					contentKey:
						'routes/apps/chain-tools/social/guide.sections.social_protocols.lens_protocol.content',
					toolMentions: [
						{ toolId: 'lens-protocol', context: 'composable social graph' },
						{ toolId: 'hey', context: 'Lens client' }
					]
				},
				{
					id: 'farcaster',
					titleKey:
						'routes/apps/chain-tools/social/guide.sections.social_protocols.farcaster.title',
					contentKey:
						'routes/apps/chain-tools/social/guide.sections.social_protocols.farcaster.content',
					toolMentions: [
						{ toolId: 'farcaster', context: 'sufficiently decentralized' },
						{ toolId: 'warpcast', context: 'main Farcaster client' }
					]
				},
				{
					id: 'cyberconnect',
					titleKey:
						'routes/apps/chain-tools/social/guide.sections.social_protocols.cyberconnect.title',
					contentKey:
						'routes/apps/chain-tools/social/guide.sections.social_protocols.cyberconnect.content',
					toolMentions: [{ toolId: 'cyberconnect', context: 'multi-chain social graph' }]
				}
			]
		},

		// Part 3: Decentralized Content
		{
			id: 'decentralized-content',
			titleKey: 'routes/apps/chain-tools/social/guide.sections.decentralized_content.title',
			contentKey: 'routes/apps/chain-tools/social/guide.sections.decentralized_content.content',
			subsections: [
				{
					id: 'publishing-platforms',
					titleKey:
						'routes/apps/chain-tools/social/guide.sections.decentralized_content.publishing_platforms.title',
					contentKey:
						'routes/apps/chain-tools/social/guide.sections.decentralized_content.publishing_platforms.content',
					toolMentions: [
						{ toolId: 'mirror', context: 'web3 publishing pioneer' },
						{ toolId: 'paragraph', context: 'web3 newsletters' }
					]
				},
				{
					id: 'video-streaming',
					titleKey:
						'routes/apps/chain-tools/social/guide.sections.decentralized_content.video_streaming.title',
					contentKey:
						'routes/apps/chain-tools/social/guide.sections.decentralized_content.video_streaming.content',
					toolMentions: [
						{ toolId: 'tape', context: 'decentralized video' },
						{ toolId: 'unlonely', context: 'live streaming' }
					]
				}
			]
		},

		// Part 4: Social Tokens
		{
			id: 'social-tokens',
			titleKey: 'routes/apps/chain-tools/social/guide.sections.social_tokens.title',
			contentKey: 'routes/apps/chain-tools/social/guide.sections.social_tokens.content',
			subsections: [
				{
					id: 'creator-coins',
					titleKey:
						'routes/apps/chain-tools/social/guide.sections.social_tokens.creator_coins.title',
					contentKey:
						'routes/apps/chain-tools/social/guide.sections.social_tokens.creator_coins.content',
					toolMentions: [
						{ toolId: 'friend-tech', context: 'social keys trading' },
						{ toolId: 'moxie', context: 'Farcaster fan tokens' }
					]
				},
				{
					id: 'community-tokens',
					titleKey:
						'routes/apps/chain-tools/social/guide.sections.social_tokens.community_tokens.title',
					contentKey:
						'routes/apps/chain-tools/social/guide.sections.social_tokens.community_tokens.content'
				}
			]
		},

		// Part 5: Messaging & Communication
		{
			id: 'messaging',
			titleKey: 'routes/apps/chain-tools/social/guide.sections.messaging.title',
			contentKey: 'routes/apps/chain-tools/social/guide.sections.messaging.content',
			subsections: [
				{
					id: 'xmtp',
					titleKey: 'routes/apps/chain-tools/social/guide.sections.messaging.xmtp.title',
					contentKey: 'routes/apps/chain-tools/social/guide.sections.messaging.xmtp.content',
					toolMentions: [{ toolId: 'xmtp', context: 'wallet-to-wallet messaging' }]
				},
				{
					id: 'push-protocol',
					titleKey: 'routes/apps/chain-tools/social/guide.sections.messaging.push_protocol.title',
					contentKey:
						'routes/apps/chain-tools/social/guide.sections.messaging.push_protocol.content',
					toolMentions: [{ toolId: 'push-protocol', context: 'web3 notifications' }]
				}
			]
		},

		// Part 6: SocialFi
		{
			id: 'social-fi',
			titleKey: 'routes/apps/chain-tools/social/guide.sections.social_fi.title',
			contentKey: 'routes/apps/chain-tools/social/guide.sections.social_fi.content',
			subsections: [
				{
					id: 'monetization',
					titleKey: 'routes/apps/chain-tools/social/guide.sections.social_fi.monetization.title',
					contentKey: 'routes/apps/chain-tools/social/guide.sections.social_fi.monetization.content'
				},
				{
					id: 'tips-subscriptions',
					titleKey:
						'routes/apps/chain-tools/social/guide.sections.social_fi.tips_subscriptions.title',
					contentKey:
						'routes/apps/chain-tools/social/guide.sections.social_fi.tips_subscriptions.content'
				}
			]
		},

		// Part 7: Building Your Presence
		{
			id: 'building-presence',
			titleKey: 'routes/apps/chain-tools/social/guide.sections.building_presence.title',
			contentKey: 'routes/apps/chain-tools/social/guide.sections.building_presence.content',
			subsections: [
				{
					id: 'choosing-platform',
					titleKey:
						'routes/apps/chain-tools/social/guide.sections.building_presence.choosing_platform.title',
					contentKey:
						'routes/apps/chain-tools/social/guide.sections.building_presence.choosing_platform.content'
				},
				{
					id: 'content-strategy',
					titleKey:
						'routes/apps/chain-tools/social/guide.sections.building_presence.content_strategy.title',
					contentKey:
						'routes/apps/chain-tools/social/guide.sections.building_presence.content_strategy.content'
				},
				{
					id: 'growing-audience',
					titleKey:
						'routes/apps/chain-tools/social/guide.sections.building_presence.growing_audience.title',
					contentKey:
						'routes/apps/chain-tools/social/guide.sections.building_presence.growing_audience.content'
				}
			]
		},

		// Part 8: Future of Social
		{
			id: 'future-of-social',
			titleKey: 'routes/apps/chain-tools/social/guide.sections.future_of_social.title',
			contentKey: 'routes/apps/chain-tools/social/guide.sections.future_of_social.content',
			subsections: [
				{
					id: 'interoperability',
					titleKey:
						'routes/apps/chain-tools/social/guide.sections.future_of_social.interoperability.title',
					contentKey:
						'routes/apps/chain-tools/social/guide.sections.future_of_social.interoperability.content'
				},
				{
					id: 'ai-integration',
					titleKey:
						'routes/apps/chain-tools/social/guide.sections.future_of_social.ai_integration.title',
					contentKey:
						'routes/apps/chain-tools/social/guide.sections.future_of_social.ai_integration.content'
				}
			]
		}
	],

	// Glossary for quick reference
	glossary: [
		{
			id: 'social-graph',
			termKey: 'routes/apps/chain-tools/social/guide.glossary.social_graph.term',
			definitionKey: 'routes/apps/chain-tools/social/guide.glossary.social_graph.definition',
			relatedToolIds: ['lens-protocol', 'farcaster', 'cyberconnect']
		},
		{
			id: 'composable',
			termKey: 'routes/apps/chain-tools/social/guide.glossary.composable.term',
			definitionKey: 'routes/apps/chain-tools/social/guide.glossary.composable.definition',
			relatedToolIds: ['lens-protocol']
		},
		{
			id: 'social-nft',
			termKey: 'routes/apps/chain-tools/social/guide.glossary.social_nft.term',
			definitionKey: 'routes/apps/chain-tools/social/guide.glossary.social_nft.definition',
			relatedToolIds: ['lens-protocol', 'farcaster']
		},
		{
			id: 'social-fi',
			termKey: 'routes/apps/chain-tools/social/guide.glossary.social_fi.term',
			definitionKey: 'routes/apps/chain-tools/social/guide.glossary.social_fi.definition',
			relatedToolIds: ['friend-tech', 'moxie']
		},
		{
			id: 'creator-economy',
			termKey: 'routes/apps/chain-tools/social/guide.glossary.creator_economy.term',
			definitionKey: 'routes/apps/chain-tools/social/guide.glossary.creator_economy.definition',
			relatedToolIds: ['mirror', 'paragraph']
		},
		{
			id: 'frames',
			termKey: 'routes/apps/chain-tools/social/guide.glossary.frames.term',
			definitionKey: 'routes/apps/chain-tools/social/guide.glossary.frames.definition',
			relatedToolIds: ['farcaster', 'warpcast']
		},
		{
			id: 'wallet-messaging',
			termKey: 'routes/apps/chain-tools/social/guide.glossary.wallet_messaging.term',
			definitionKey: 'routes/apps/chain-tools/social/guide.glossary.wallet_messaging.definition',
			relatedToolIds: ['xmtp', 'push-protocol']
		},
		{
			id: 'decentralized-identity',
			termKey: 'routes/apps/chain-tools/social/guide.glossary.decentralized_identity.term',
			definitionKey:
				'routes/apps/chain-tools/social/guide.glossary.decentralized_identity.definition',
			relatedToolIds: ['lens-protocol', 'farcaster', 'cyberconnect']
		},
		{
			id: 'attestations',
			termKey: 'routes/apps/chain-tools/social/guide.glossary.attestations.term',
			definitionKey: 'routes/apps/chain-tools/social/guide.glossary.attestations.definition',
			relatedToolIds: ['cyberconnect']
		},
		{
			id: 'content-nft',
			termKey: 'routes/apps/chain-tools/social/guide.glossary.content_nft.term',
			definitionKey: 'routes/apps/chain-tools/social/guide.glossary.content_nft.definition',
			relatedToolIds: ['mirror', 'zora-social']
		}
	],

	// Featured tools shown in sidebar/footer
	featuredToolIds: [
		'lens-protocol',
		'farcaster',
		'warpcast',
		'mirror',
		'xmtp',
		'push-protocol',
		'friend-tech',
		'moxie'
	],

	lastUpdated: '2025-12-31'
};
