/**
 * Legendary Token Category Guide Data
 * Educational deep dive into crypto history and legendary token stories
 *
 * Content philosophy:
 * - Learn from history to understand the present
 * - Focus on real stories, real events, real lessons
 * - Cover both successes and failures
 * - Extract timeless principles from legendary projects
 */
import type { CategoryGuide } from '../../types';

export const legendaryTokenGuide: CategoryGuide = {
	categoryId: 'legendary-token',
	i18nKeyPrefix: 'routes/apps/chain-tools/legendary-token/guide',
	estimatedReadTime: '25 min',

	sections: [
		// Part 1: Introduction
		{
			id: 'intro',
			titleKey: 'routes/apps/chain-tools/legendary-token/guide.sections.intro.title',
			contentKey: 'routes/apps/chain-tools/legendary-token/guide.sections.intro.content'
		},

		// Part 2: Bitcoin - The Origin
		{
			id: 'bitcoin',
			titleKey: 'routes/apps/chain-tools/legendary-token/guide.sections.bitcoin.title',
			contentKey: 'routes/apps/chain-tools/legendary-token/guide.sections.bitcoin.content',
			toolMentions: [{ toolId: 'bitcoin', context: 'the original cryptocurrency' }],
			subsections: [
				{
					id: 'satoshi',
					titleKey: 'routes/apps/chain-tools/legendary-token/guide.sections.bitcoin.satoshi.title',
					contentKey:
						'routes/apps/chain-tools/legendary-token/guide.sections.bitcoin.satoshi.content'
				},
				{
					id: 'milestones',
					titleKey:
						'routes/apps/chain-tools/legendary-token/guide.sections.bitcoin.milestones.title',
					contentKey:
						'routes/apps/chain-tools/legendary-token/guide.sections.bitcoin.milestones.content'
				},
				{
					id: 'impact',
					titleKey: 'routes/apps/chain-tools/legendary-token/guide.sections.bitcoin.impact.title',
					contentKey:
						'routes/apps/chain-tools/legendary-token/guide.sections.bitcoin.impact.content'
				}
			]
		},

		// Part 3: Ethereum - The Platform
		{
			id: 'ethereum',
			titleKey: 'routes/apps/chain-tools/legendary-token/guide.sections.ethereum.title',
			contentKey: 'routes/apps/chain-tools/legendary-token/guide.sections.ethereum.content',
			toolMentions: [{ toolId: 'ethereum', context: 'smart contract platform' }],
			subsections: [
				{
					id: 'vitalik-vision',
					titleKey:
						'routes/apps/chain-tools/legendary-token/guide.sections.ethereum.vitalik_vision.title',
					contentKey:
						'routes/apps/chain-tools/legendary-token/guide.sections.ethereum.vitalik_vision.content'
				},
				{
					id: 'dao-hack',
					titleKey:
						'routes/apps/chain-tools/legendary-token/guide.sections.ethereum.dao_hack.title',
					contentKey:
						'routes/apps/chain-tools/legendary-token/guide.sections.ethereum.dao_hack.content'
				},
				{
					id: 'pos-transition',
					titleKey:
						'routes/apps/chain-tools/legendary-token/guide.sections.ethereum.pos_transition.title',
					contentKey:
						'routes/apps/chain-tools/legendary-token/guide.sections.ethereum.pos_transition.content'
				}
			]
		},

		// Part 4: DeFi Summer Pioneers
		{
			id: 'defi-summer',
			titleKey: 'routes/apps/chain-tools/legendary-token/guide.sections.defi_summer.title',
			contentKey: 'routes/apps/chain-tools/legendary-token/guide.sections.defi_summer.content',
			subsections: [
				{
					id: 'compound',
					titleKey:
						'routes/apps/chain-tools/legendary-token/guide.sections.defi_summer.compound.title',
					contentKey:
						'routes/apps/chain-tools/legendary-token/guide.sections.defi_summer.compound.content',
					toolMentions: [{ toolId: 'compound', context: 'yield farming origin' }]
				},
				{
					id: 'uniswap',
					titleKey:
						'routes/apps/chain-tools/legendary-token/guide.sections.defi_summer.uniswap.title',
					contentKey:
						'routes/apps/chain-tools/legendary-token/guide.sections.defi_summer.uniswap.content',
					toolMentions: [{ toolId: 'uniswap', context: 'AMM innovation' }]
				},
				{
					id: 'aave',
					titleKey: 'routes/apps/chain-tools/legendary-token/guide.sections.defi_summer.aave.title',
					contentKey:
						'routes/apps/chain-tools/legendary-token/guide.sections.defi_summer.aave.content',
					toolMentions: [{ toolId: 'aave', context: 'flash loans pioneer' }]
				}
			]
		},

		// Part 5: NFT Revolution
		{
			id: 'nft-revolution',
			titleKey: 'routes/apps/chain-tools/legendary-token/guide.sections.nft_revolution.title',
			contentKey: 'routes/apps/chain-tools/legendary-token/guide.sections.nft_revolution.content',
			subsections: [
				{
					id: 'cryptopunks',
					titleKey:
						'routes/apps/chain-tools/legendary-token/guide.sections.nft_revolution.cryptopunks.title',
					contentKey:
						'routes/apps/chain-tools/legendary-token/guide.sections.nft_revolution.cryptopunks.content'
				},
				{
					id: 'bayc',
					titleKey:
						'routes/apps/chain-tools/legendary-token/guide.sections.nft_revolution.bayc.title',
					contentKey:
						'routes/apps/chain-tools/legendary-token/guide.sections.nft_revolution.bayc.content'
				},
				{
					id: 'opensea',
					titleKey:
						'routes/apps/chain-tools/legendary-token/guide.sections.nft_revolution.opensea.title',
					contentKey:
						'routes/apps/chain-tools/legendary-token/guide.sections.nft_revolution.opensea.content',
					toolMentions: [{ toolId: 'opensea', context: 'NFT marketplace leader' }]
				}
			]
		},

		// Part 6: Layer 2 & Alt-L1 Stories
		{
			id: 'l2-altl1',
			titleKey: 'routes/apps/chain-tools/legendary-token/guide.sections.l2_altl1.title',
			contentKey: 'routes/apps/chain-tools/legendary-token/guide.sections.l2_altl1.content',
			subsections: [
				{
					id: 'solana',
					titleKey: 'routes/apps/chain-tools/legendary-token/guide.sections.l2_altl1.solana.title',
					contentKey:
						'routes/apps/chain-tools/legendary-token/guide.sections.l2_altl1.solana.content',
					toolMentions: [{ toolId: 'solana', context: 'high-performance L1' }]
				},
				{
					id: 'arbitrum-optimism',
					titleKey:
						'routes/apps/chain-tools/legendary-token/guide.sections.l2_altl1.arbitrum_optimism.title',
					contentKey:
						'routes/apps/chain-tools/legendary-token/guide.sections.l2_altl1.arbitrum_optimism.content',
					toolMentions: [
						{ toolId: 'arbitrum', context: 'Ethereum L2 rollup' },
						{ toolId: 'optimism', context: 'Ethereum L2 rollup' }
					]
				}
			]
		},

		// Part 7: Failures & Lessons
		{
			id: 'failures',
			titleKey: 'routes/apps/chain-tools/legendary-token/guide.sections.failures.title',
			contentKey: 'routes/apps/chain-tools/legendary-token/guide.sections.failures.content',
			subsections: [
				{
					id: 'luna-ust',
					titleKey:
						'routes/apps/chain-tools/legendary-token/guide.sections.failures.luna_ust.title',
					contentKey:
						'routes/apps/chain-tools/legendary-token/guide.sections.failures.luna_ust.content',
					caseStudies: [
						{
							id: 'luna-collapse',
							titleKey:
								'routes/apps/chain-tools/legendary-token/guide.sections.failures.luna_ust.case_study.title',
							descriptionKey:
								'routes/apps/chain-tools/legendary-token/guide.sections.failures.luna_ust.case_study.description',
							date: '2022-05-09',
							profit: '-$40 billion in market cap'
						}
					]
				},
				{
					id: 'ftx',
					titleKey: 'routes/apps/chain-tools/legendary-token/guide.sections.failures.ftx.title',
					contentKey: 'routes/apps/chain-tools/legendary-token/guide.sections.failures.ftx.content'
				},
				{
					id: 'hacks-rugs',
					titleKey:
						'routes/apps/chain-tools/legendary-token/guide.sections.failures.hacks_rugs.title',
					contentKey:
						'routes/apps/chain-tools/legendary-token/guide.sections.failures.hacks_rugs.content'
				}
			]
		},

		// Part 8: What Made Them Legendary
		{
			id: 'legendary-factors',
			titleKey: 'routes/apps/chain-tools/legendary-token/guide.sections.legendary_factors.title',
			contentKey:
				'routes/apps/chain-tools/legendary-token/guide.sections.legendary_factors.content',
			subsections: [
				{
					id: 'innovation',
					titleKey:
						'routes/apps/chain-tools/legendary-token/guide.sections.legendary_factors.innovation.title',
					contentKey:
						'routes/apps/chain-tools/legendary-token/guide.sections.legendary_factors.innovation.content'
				},
				{
					id: 'community',
					titleKey:
						'routes/apps/chain-tools/legendary-token/guide.sections.legendary_factors.community.title',
					contentKey:
						'routes/apps/chain-tools/legendary-token/guide.sections.legendary_factors.community.content'
				},
				{
					id: 'lessons',
					titleKey:
						'routes/apps/chain-tools/legendary-token/guide.sections.legendary_factors.lessons.title',
					contentKey:
						'routes/apps/chain-tools/legendary-token/guide.sections.legendary_factors.lessons.content'
				}
			]
		}
	],

	// Glossary for quick reference
	glossary: [
		{
			id: 'genesis-block',
			termKey: 'routes/apps/chain-tools/legendary-token/guide.glossary.genesis_block.term',
			definitionKey:
				'routes/apps/chain-tools/legendary-token/guide.glossary.genesis_block.definition',
			relatedToolIds: ['bitcoin']
		},
		{
			id: 'whitepaper',
			termKey: 'routes/apps/chain-tools/legendary-token/guide.glossary.whitepaper.term',
			definitionKey: 'routes/apps/chain-tools/legendary-token/guide.glossary.whitepaper.definition',
			relatedToolIds: ['bitcoin', 'ethereum']
		},
		{
			id: 'ico',
			termKey: 'routes/apps/chain-tools/legendary-token/guide.glossary.ico.term',
			definitionKey: 'routes/apps/chain-tools/legendary-token/guide.glossary.ico.definition',
			relatedToolIds: ['ethereum']
		},
		{
			id: 'hard-fork',
			termKey: 'routes/apps/chain-tools/legendary-token/guide.glossary.hard_fork.term',
			definitionKey: 'routes/apps/chain-tools/legendary-token/guide.glossary.hard_fork.definition',
			relatedToolIds: ['ethereum']
		},
		{
			id: 'defi-summer',
			termKey: 'routes/apps/chain-tools/legendary-token/guide.glossary.defi_summer.term',
			definitionKey:
				'routes/apps/chain-tools/legendary-token/guide.glossary.defi_summer.definition',
			relatedToolIds: ['uniswap', 'aave', 'compound']
		},
		{
			id: 'yield-farming',
			termKey: 'routes/apps/chain-tools/legendary-token/guide.glossary.yield_farming.term',
			definitionKey:
				'routes/apps/chain-tools/legendary-token/guide.glossary.yield_farming.definition',
			relatedToolIds: ['compound', 'aave']
		},
		{
			id: 'nft',
			termKey: 'routes/apps/chain-tools/legendary-token/guide.glossary.nft.term',
			definitionKey: 'routes/apps/chain-tools/legendary-token/guide.glossary.nft.definition',
			relatedToolIds: ['opensea']
		},
		{
			id: 'blue-chip',
			termKey: 'routes/apps/chain-tools/legendary-token/guide.glossary.blue_chip.term',
			definitionKey: 'routes/apps/chain-tools/legendary-token/guide.glossary.blue_chip.definition',
			relatedToolIds: ['opensea']
		},
		{
			id: 'l1',
			termKey: 'routes/apps/chain-tools/legendary-token/guide.glossary.l1.term',
			definitionKey: 'routes/apps/chain-tools/legendary-token/guide.glossary.l1.definition',
			relatedToolIds: ['ethereum', 'solana']
		},
		{
			id: 'l2',
			termKey: 'routes/apps/chain-tools/legendary-token/guide.glossary.l2.term',
			definitionKey: 'routes/apps/chain-tools/legendary-token/guide.glossary.l2.definition',
			relatedToolIds: ['arbitrum', 'optimism']
		},
		{
			id: 'rollup',
			termKey: 'routes/apps/chain-tools/legendary-token/guide.glossary.rollup.term',
			definitionKey: 'routes/apps/chain-tools/legendary-token/guide.glossary.rollup.definition',
			relatedToolIds: ['arbitrum', 'optimism']
		},
		{
			id: 'stablecoin',
			termKey: 'routes/apps/chain-tools/legendary-token/guide.glossary.stablecoin.term',
			definitionKey: 'routes/apps/chain-tools/legendary-token/guide.glossary.stablecoin.definition'
		},
		{
			id: 'depeg',
			termKey: 'routes/apps/chain-tools/legendary-token/guide.glossary.depeg.term',
			definitionKey: 'routes/apps/chain-tools/legendary-token/guide.glossary.depeg.definition'
		},
		{
			id: 'rug-pull',
			termKey: 'routes/apps/chain-tools/legendary-token/guide.glossary.rug_pull.term',
			definitionKey: 'routes/apps/chain-tools/legendary-token/guide.glossary.rug_pull.definition',
			relatedToolIds: ['defillama']
		}
	],

	// Featured tools shown in sidebar/footer
	featuredToolIds: [
		'bitcoin',
		'ethereum',
		'uniswap',
		'aave',
		'opensea',
		'solana',
		'arbitrum',
		'defillama'
	],

	lastUpdated: '2025-12-31'
};
