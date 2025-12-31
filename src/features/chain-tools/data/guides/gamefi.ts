/**
 * GameFi Category Guide Data
 * Comprehensive guide to blockchain gaming, play-to-earn, and gaming infrastructure
 *
 * Content philosophy:
 * - Focus on understanding gaming economics and sustainability
 * - Include real examples of successful games and their mechanics
 * - Emphasize earning strategies and risk awareness
 * - Progressive learning from casual games to advanced strategies
 */
import type { CategoryGuide } from '../../types';

export const gamefiGuide: CategoryGuide = {
	categoryId: 'gamefi',
	i18nKeyPrefix: 'routes/apps/chain-tools/gamefi/guide',
	estimatedReadTime: '18 min',

	sections: [
		// Part 1: Understanding GameFi
		{
			id: 'intro',
			titleKey: 'routes/apps/chain-tools/gamefi/guide.sections.intro.title',
			contentKey: 'routes/apps/chain-tools/gamefi/guide.sections.intro.content',
			toolMentions: [
				{ toolId: 'immutable', context: 'gaming infrastructure' },
				{ toolId: 'ronin', context: 'Axie Infinity chain' }
			]
		},

		// Part 2: Game Types
		{
			id: 'game-types',
			titleKey: 'routes/apps/chain-tools/gamefi/guide.sections.game_types.title',
			contentKey: 'routes/apps/chain-tools/gamefi/guide.sections.game_types.content',
			subsections: [
				{
					id: 'play-to-earn',
					titleKey: 'routes/apps/chain-tools/gamefi/guide.sections.game_types.play_to_earn.title',
					contentKey:
						'routes/apps/chain-tools/gamefi/guide.sections.game_types.play_to_earn.content',
					toolMentions: [
						{ toolId: 'axie-infinity', context: 'pioneering P2E' },
						{ toolId: 'pixels', context: 'casual farming' }
					]
				},
				{
					id: 'move-to-earn',
					titleKey: 'routes/apps/chain-tools/gamefi/guide.sections.game_types.move_to_earn.title',
					contentKey:
						'routes/apps/chain-tools/gamefi/guide.sections.game_types.move_to_earn.content',
					toolMentions: [
						{ toolId: 'stepn', context: 'fitness rewards' },
						{ toolId: 'sweat-economy', context: 'NEAR-based M2E' }
					]
				},
				{
					id: 'fully-onchain',
					titleKey: 'routes/apps/chain-tools/gamefi/guide.sections.game_types.fully_onchain.title',
					contentKey:
						'routes/apps/chain-tools/gamefi/guide.sections.game_types.fully_onchain.content',
					toolMentions: [{ toolId: 'pirate-nation', context: 'fully on-chain RPG' }]
				}
			]
		},

		// Part 3: Game Assets
		{
			id: 'game-assets',
			titleKey: 'routes/apps/chain-tools/gamefi/guide.sections.game_assets.title',
			contentKey: 'routes/apps/chain-tools/gamefi/guide.sections.game_assets.content',
			subsections: [
				{
					id: 'nfts-in-gaming',
					titleKey: 'routes/apps/chain-tools/gamefi/guide.sections.game_assets.nfts.title',
					contentKey: 'routes/apps/chain-tools/gamefi/guide.sections.game_assets.nfts.content',
					toolMentions: [
						{ toolId: 'gods-unchained', context: 'tradeable cards' },
						{ toolId: 'axie-infinity', context: 'breeding NFTs' }
					]
				},
				{
					id: 'token-economics',
					titleKey: 'routes/apps/chain-tools/gamefi/guide.sections.game_assets.tokens.title',
					contentKey: 'routes/apps/chain-tools/gamefi/guide.sections.game_assets.tokens.content'
				}
			]
		},

		// Part 4: Major Games
		{
			id: 'major-games',
			titleKey: 'routes/apps/chain-tools/gamefi/guide.sections.major_games.title',
			contentKey: 'routes/apps/chain-tools/gamefi/guide.sections.major_games.content',
			subsections: [
				{
					id: 'axie-infinity',
					titleKey: 'routes/apps/chain-tools/gamefi/guide.sections.major_games.axie.title',
					contentKey: 'routes/apps/chain-tools/gamefi/guide.sections.major_games.axie.content',
					toolMentions: [
						{ toolId: 'axie-infinity' },
						{ toolId: 'ronin', context: 'dedicated chain' }
					]
				},
				{
					id: 'gods-unchained',
					titleKey:
						'routes/apps/chain-tools/gamefi/guide.sections.major_games.gods_unchained.title',
					contentKey:
						'routes/apps/chain-tools/gamefi/guide.sections.major_games.gods_unchained.content',
					toolMentions: [{ toolId: 'gods-unchained' }, { toolId: 'immutable' }]
				},
				{
					id: 'illuvium',
					titleKey: 'routes/apps/chain-tools/gamefi/guide.sections.major_games.illuvium.title',
					contentKey: 'routes/apps/chain-tools/gamefi/guide.sections.major_games.illuvium.content',
					toolMentions: [{ toolId: 'illuvium' }]
				},
				{
					id: 'bigtime',
					titleKey: 'routes/apps/chain-tools/gamefi/guide.sections.major_games.bigtime.title',
					contentKey: 'routes/apps/chain-tools/gamefi/guide.sections.major_games.bigtime.content',
					toolMentions: [{ toolId: 'bigtime' }]
				}
			]
		},

		// Part 5: Gaming Infrastructure
		{
			id: 'gaming-infrastructure',
			titleKey: 'routes/apps/chain-tools/gamefi/guide.sections.infrastructure.title',
			contentKey: 'routes/apps/chain-tools/gamefi/guide.sections.infrastructure.content',
			subsections: [
				{
					id: 'immutable',
					titleKey: 'routes/apps/chain-tools/gamefi/guide.sections.infrastructure.immutable.title',
					contentKey:
						'routes/apps/chain-tools/gamefi/guide.sections.infrastructure.immutable.content',
					toolMentions: [{ toolId: 'immutable' }]
				},
				{
					id: 'ronin',
					titleKey: 'routes/apps/chain-tools/gamefi/guide.sections.infrastructure.ronin.title',
					contentKey: 'routes/apps/chain-tools/gamefi/guide.sections.infrastructure.ronin.content',
					toolMentions: [{ toolId: 'ronin' }]
				},
				{
					id: 'gaming-l2s',
					titleKey: 'routes/apps/chain-tools/gamefi/guide.sections.infrastructure.gaming_l2s.title',
					contentKey:
						'routes/apps/chain-tools/gamefi/guide.sections.infrastructure.gaming_l2s.content',
					toolMentions: [
						{ toolId: 'beam', context: 'Avalanche subnet' },
						{ toolId: 'xai', context: 'Arbitrum Orbit' }
					]
				}
			]
		},

		// Part 6: Guilds and Scholarships
		{
			id: 'guilds-scholarships',
			titleKey: 'routes/apps/chain-tools/gamefi/guide.sections.guilds.title',
			contentKey: 'routes/apps/chain-tools/gamefi/guide.sections.guilds.content',
			subsections: [
				{
					id: 'ygg',
					titleKey: 'routes/apps/chain-tools/gamefi/guide.sections.guilds.ygg.title',
					contentKey: 'routes/apps/chain-tools/gamefi/guide.sections.guilds.ygg.content',
					toolMentions: [{ toolId: 'ygg' }]
				},
				{
					id: 'scholarship-model',
					titleKey: 'routes/apps/chain-tools/gamefi/guide.sections.guilds.scholarship.title',
					contentKey: 'routes/apps/chain-tools/gamefi/guide.sections.guilds.scholarship.content'
				}
			]
		},

		// Part 7: Earning Strategies
		{
			id: 'earning-strategies',
			titleKey: 'routes/apps/chain-tools/gamefi/guide.sections.earning.title',
			contentKey: 'routes/apps/chain-tools/gamefi/guide.sections.earning.content',
			subsections: [
				{
					id: 'playing',
					titleKey: 'routes/apps/chain-tools/gamefi/guide.sections.earning.playing.title',
					contentKey: 'routes/apps/chain-tools/gamefi/guide.sections.earning.playing.content'
				},
				{
					id: 'trading',
					titleKey: 'routes/apps/chain-tools/gamefi/guide.sections.earning.trading.title',
					contentKey: 'routes/apps/chain-tools/gamefi/guide.sections.earning.trading.content',
					toolMentions: [{ toolId: 'fractal', context: 'game NFT marketplace' }]
				},
				{
					id: 'breeding',
					titleKey: 'routes/apps/chain-tools/gamefi/guide.sections.earning.breeding.title',
					contentKey: 'routes/apps/chain-tools/gamefi/guide.sections.earning.breeding.content'
				},
				{
					id: 'land-ownership',
					titleKey: 'routes/apps/chain-tools/gamefi/guide.sections.earning.land.title',
					contentKey: 'routes/apps/chain-tools/gamefi/guide.sections.earning.land.content',
					toolMentions: [
						{ toolId: 'sandbox', context: 'virtual land' },
						{ toolId: 'decentraland', context: 'metaverse real estate' }
					]
				}
			]
		},

		// Part 8: Risks and Sustainability
		{
			id: 'risks-sustainability',
			titleKey: 'routes/apps/chain-tools/gamefi/guide.sections.risks.title',
			contentKey: 'routes/apps/chain-tools/gamefi/guide.sections.risks.content',
			subsections: [
				{
					id: 'economic-sustainability',
					titleKey: 'routes/apps/chain-tools/gamefi/guide.sections.risks.sustainability.title',
					contentKey: 'routes/apps/chain-tools/gamefi/guide.sections.risks.sustainability.content'
				},
				{
					id: 'game-death-spirals',
					titleKey: 'routes/apps/chain-tools/gamefi/guide.sections.risks.death_spiral.title',
					contentKey: 'routes/apps/chain-tools/gamefi/guide.sections.risks.death_spiral.content'
				},
				{
					id: 'regulatory-risks',
					titleKey: 'routes/apps/chain-tools/gamefi/guide.sections.risks.regulatory.title',
					contentKey: 'routes/apps/chain-tools/gamefi/guide.sections.risks.regulatory.content'
				},
				{
					id: 'smart-evaluation',
					titleKey: 'routes/apps/chain-tools/gamefi/guide.sections.risks.evaluation.title',
					contentKey: 'routes/apps/chain-tools/gamefi/guide.sections.risks.evaluation.content'
				}
			]
		}
	],

	// Glossary for quick reference
	glossary: [
		{
			id: 'play-to-earn',
			termKey: 'routes/apps/chain-tools/gamefi/guide.glossary.play_to_earn.term',
			definitionKey: 'routes/apps/chain-tools/gamefi/guide.glossary.play_to_earn.definition',
			relatedToolIds: ['axie-infinity', 'pixels', 'illuvium']
		},
		{
			id: 'game-nft',
			termKey: 'routes/apps/chain-tools/gamefi/guide.glossary.game_nft.term',
			definitionKey: 'routes/apps/chain-tools/gamefi/guide.glossary.game_nft.definition',
			relatedToolIds: ['gods-unchained', 'axie-infinity', 'immutable']
		},
		{
			id: 'in-game-token',
			termKey: 'routes/apps/chain-tools/gamefi/guide.glossary.in_game_token.term',
			definitionKey: 'routes/apps/chain-tools/gamefi/guide.glossary.in_game_token.definition',
			relatedToolIds: ['axie-infinity', 'stepn']
		},
		{
			id: 'guild',
			termKey: 'routes/apps/chain-tools/gamefi/guide.glossary.guild.term',
			definitionKey: 'routes/apps/chain-tools/gamefi/guide.glossary.guild.definition',
			relatedToolIds: ['ygg']
		},
		{
			id: 'scholarship',
			termKey: 'routes/apps/chain-tools/gamefi/guide.glossary.scholarship.term',
			definitionKey: 'routes/apps/chain-tools/gamefi/guide.glossary.scholarship.definition',
			relatedToolIds: ['ygg', 'axie-infinity']
		},
		{
			id: 'fully-onchain-game',
			termKey: 'routes/apps/chain-tools/gamefi/guide.glossary.fully_onchain.term',
			definitionKey: 'routes/apps/chain-tools/gamefi/guide.glossary.fully_onchain.definition',
			relatedToolIds: ['pirate-nation']
		},
		{
			id: 'gaming-l2',
			termKey: 'routes/apps/chain-tools/gamefi/guide.glossary.gaming_l2.term',
			definitionKey: 'routes/apps/chain-tools/gamefi/guide.glossary.gaming_l2.definition',
			relatedToolIds: ['immutable', 'ronin', 'beam', 'xai']
		},
		{
			id: 'breeding',
			termKey: 'routes/apps/chain-tools/gamefi/guide.glossary.breeding.term',
			definitionKey: 'routes/apps/chain-tools/gamefi/guide.glossary.breeding.definition',
			relatedToolIds: ['axie-infinity']
		},
		{
			id: 'land',
			termKey: 'routes/apps/chain-tools/gamefi/guide.glossary.land.term',
			definitionKey: 'routes/apps/chain-tools/gamefi/guide.glossary.land.definition',
			relatedToolIds: ['sandbox', 'decentraland']
		},
		{
			id: 'game-economy',
			termKey: 'routes/apps/chain-tools/gamefi/guide.glossary.game_economy.term',
			definitionKey: 'routes/apps/chain-tools/gamefi/guide.glossary.game_economy.definition'
		}
	],

	// Featured tools shown in sidebar/footer
	featuredToolIds: [
		'immutable',
		'ronin',
		'axie-infinity',
		'gods-unchained',
		'illuvium',
		'bigtime',
		'ygg',
		'stepn'
	],

	lastUpdated: '2025-12-31'
};
