/**
 * NFT Category Guide Data
 * Comprehensive NFT education from collecting to creating and earning
 *
 * Content philosophy:
 * - Focus on practical knowledge for collectors and creators
 * - Include real market examples and case studies
 * - Cover the full ecosystem: marketplaces, tools, NFT-Fi
 * - Emphasize both opportunities and risks
 */
import type { CategoryGuide } from '../../types';

export const nftGuide: CategoryGuide = {
	categoryId: 'nft',
	i18nKeyPrefix: 'routes/apps/chain-tools/nft/guide',
	estimatedReadTime: '25 min',

	sections: [
		// Part 1: Understanding NFTs
		{
			id: 'intro',
			titleKey: 'routes/apps/chain-tools/nft/guide.sections.intro.title',
			contentKey: 'routes/apps/chain-tools/nft/guide.sections.intro.content',
			toolMentions: [
				{ toolId: 'opensea', context: 'largest NFT marketplace' },
				{ toolId: 'etherscan', context: 'verify ownership' }
			]
		},
		{
			id: 'nft-standards',
			titleKey: 'routes/apps/chain-tools/nft/guide.sections.nft_standards.title',
			contentKey: 'routes/apps/chain-tools/nft/guide.sections.nft_standards.content',
			subsections: [
				{
					id: 'erc721',
					titleKey: 'routes/apps/chain-tools/nft/guide.sections.nft_standards.erc721.title',
					contentKey: 'routes/apps/chain-tools/nft/guide.sections.nft_standards.erc721.content'
				},
				{
					id: 'erc1155',
					titleKey: 'routes/apps/chain-tools/nft/guide.sections.nft_standards.erc1155.title',
					contentKey: 'routes/apps/chain-tools/nft/guide.sections.nft_standards.erc1155.content'
				},
				{
					id: 'metadata',
					titleKey: 'routes/apps/chain-tools/nft/guide.sections.nft_standards.metadata.title',
					contentKey: 'routes/apps/chain-tools/nft/guide.sections.nft_standards.metadata.content'
				}
			]
		},

		// Part 2: NFT Marketplaces
		{
			id: 'marketplaces',
			titleKey: 'routes/apps/chain-tools/nft/guide.sections.marketplaces.title',
			contentKey: 'routes/apps/chain-tools/nft/guide.sections.marketplaces.content',
			subsections: [
				{
					id: 'general-marketplaces',
					titleKey:
						'routes/apps/chain-tools/nft/guide.sections.marketplaces.general_marketplaces.title',
					contentKey:
						'routes/apps/chain-tools/nft/guide.sections.marketplaces.general_marketplaces.content',
					toolMentions: [
						{ toolId: 'opensea', context: 'beginner-friendly' },
						{ toolId: 'blur', context: 'pro-trader features' },
						{ toolId: 'magic-eden', context: 'multi-chain support' }
					]
				},
				{
					id: 'specialized-marketplaces',
					titleKey:
						'routes/apps/chain-tools/nft/guide.sections.marketplaces.specialized_marketplaces.title',
					contentKey:
						'routes/apps/chain-tools/nft/guide.sections.marketplaces.specialized_marketplaces.content',
					toolMentions: [
						{ toolId: 'foundation', context: 'curated art' },
						{ toolId: 'zora', context: 'creator-first' },
						{ toolId: 'sound-xyz', context: 'music NFTs' }
					]
				},
				{
					id: 'aggregators',
					titleKey: 'routes/apps/chain-tools/nft/guide.sections.marketplaces.aggregators.title',
					contentKey: 'routes/apps/chain-tools/nft/guide.sections.marketplaces.aggregators.content',
					toolMentions: [
						{ toolId: 'gem', context: 'bulk buying' },
						{ toolId: 'reservoir', context: 'API aggregation' }
					]
				}
			]
		},

		// Part 3: Collecting NFTs
		{
			id: 'collecting',
			titleKey: 'routes/apps/chain-tools/nft/guide.sections.collecting.title',
			contentKey: 'routes/apps/chain-tools/nft/guide.sections.collecting.content',
			subsections: [
				{
					id: 'finding-projects',
					titleKey: 'routes/apps/chain-tools/nft/guide.sections.collecting.finding_projects.title',
					contentKey:
						'routes/apps/chain-tools/nft/guide.sections.collecting.finding_projects.content',
					toolMentions: [
						{ toolId: 'icy-tools', context: 'trending mints' },
						{ toolId: 'mintfun', context: 'free mint discovery' }
					]
				},
				{
					id: 'due-diligence',
					titleKey: 'routes/apps/chain-tools/nft/guide.sections.collecting.due_diligence.title',
					contentKey:
						'routes/apps/chain-tools/nft/guide.sections.collecting.due_diligence.content',
					toolMentions: [{ toolId: 'nftnerds', context: 'analytics and rarity' }]
				},
				{
					id: 'minting-strategies',
					titleKey:
						'routes/apps/chain-tools/nft/guide.sections.collecting.minting_strategies.title',
					contentKey:
						'routes/apps/chain-tools/nft/guide.sections.collecting.minting_strategies.content',
					toolMentions: [{ toolId: 'premint', context: 'allowlist registration' }]
				}
			]
		},

		// Part 4: Creating NFTs
		{
			id: 'creating',
			titleKey: 'routes/apps/chain-tools/nft/guide.sections.creating.title',
			contentKey: 'routes/apps/chain-tools/nft/guide.sections.creating.content',
			subsections: [
				{
					id: 'minting-options',
					titleKey: 'routes/apps/chain-tools/nft/guide.sections.creating.minting_options.title',
					contentKey:
						'routes/apps/chain-tools/nft/guide.sections.creating.minting_options.content',
					toolMentions: [
						{ toolId: 'manifold', context: 'custom smart contracts' },
						{ toolId: 'zora', context: 'free minting' },
						{ toolId: 'highlight', context: 'multi-chain minting' }
					]
				},
				{
					id: 'collection-launch',
					titleKey: 'routes/apps/chain-tools/nft/guide.sections.creating.collection_launch.title',
					contentKey:
						'routes/apps/chain-tools/nft/guide.sections.creating.collection_launch.content',
					toolMentions: [
						{ toolId: 'bueno', context: 'generative art' },
						{ toolId: 'transient-labs', context: 'advanced contracts' }
					]
				},
				{
					id: 'royalties',
					titleKey: 'routes/apps/chain-tools/nft/guide.sections.creating.royalties.title',
					contentKey: 'routes/apps/chain-tools/nft/guide.sections.creating.royalties.content'
				}
			]
		},

		// Part 5: NFT-Fi (NFT Finance)
		{
			id: 'nft-fi',
			titleKey: 'routes/apps/chain-tools/nft/guide.sections.nft_fi.title',
			contentKey: 'routes/apps/chain-tools/nft/guide.sections.nft_fi.content',
			subsections: [
				{
					id: 'nft-lending',
					titleKey: 'routes/apps/chain-tools/nft/guide.sections.nft_fi.nft_lending.title',
					contentKey: 'routes/apps/chain-tools/nft/guide.sections.nft_fi.nft_lending.content',
					toolMentions: [
						{ toolId: 'nftfi', context: 'P2P lending' },
						{ toolId: 'arcade', context: 'wrapped collections' },
						{ toolId: 'unlockd', context: 'instant liquidity' }
					]
				},
				{
					id: 'fractionalization',
					titleKey: 'routes/apps/chain-tools/nft/guide.sections.nft_fi.fractionalization.title',
					contentKey:
						'routes/apps/chain-tools/nft/guide.sections.nft_fi.fractionalization.content',
					toolMentions: [
						{ toolId: 'nftx', context: 'vault tokens' },
						{ toolId: 'floor-protocol', context: 'micro-tokens' },
						{ toolId: 'tessera', context: 'collective ownership' }
					]
				},
				{
					id: 'nft-amm',
					titleKey: 'routes/apps/chain-tools/nft/guide.sections.nft_fi.nft_amm.title',
					contentKey: 'routes/apps/chain-tools/nft/guide.sections.nft_fi.nft_amm.content',
					toolMentions: [
						{ toolId: 'sudoswap', context: 'bonding curves' },
						{ toolId: 'caviar', context: 'floor liquidity' }
					]
				}
			]
		},

		// Part 6: Trading Strategies
		{
			id: 'trading',
			titleKey: 'routes/apps/chain-tools/nft/guide.sections.trading.title',
			contentKey: 'routes/apps/chain-tools/nft/guide.sections.trading.content',
			subsections: [
				{
					id: 'floor-trading',
					titleKey: 'routes/apps/chain-tools/nft/guide.sections.trading.floor_trading.title',
					contentKey: 'routes/apps/chain-tools/nft/guide.sections.trading.floor_trading.content',
					toolMentions: [{ toolId: 'blur', context: 'floor sweeping' }]
				},
				{
					id: 'trait-sniping',
					titleKey: 'routes/apps/chain-tools/nft/guide.sections.trading.trait_sniping.title',
					contentKey: 'routes/apps/chain-tools/nft/guide.sections.trading.trait_sniping.content',
					toolMentions: [{ toolId: 'nftnerds', context: 'rarity analysis' }]
				},
				{
					id: 'flipping',
					titleKey: 'routes/apps/chain-tools/nft/guide.sections.trading.flipping.title',
					contentKey: 'routes/apps/chain-tools/nft/guide.sections.trading.flipping.content',
					caseStudies: [
						{
							id: 'blur-season-2',
							titleKey:
								'routes/apps/chain-tools/nft/guide.sections.trading.flipping.case_blur.title',
							descriptionKey:
								'routes/apps/chain-tools/nft/guide.sections.trading.flipping.case_blur.description',
							date: '2023-02-14',
							profit: 'Varied by activity',
							sourceUrl: 'https://blur.io/airdrop',
							relatedToolIds: ['blur']
						}
					]
				}
			]
		},

		// Part 7: Security & Best Practices
		{
			id: 'security',
			titleKey: 'routes/apps/chain-tools/nft/guide.sections.security.title',
			contentKey: 'routes/apps/chain-tools/nft/guide.sections.security.content',
			subsections: [
				{
					id: 'wallet-security',
					titleKey: 'routes/apps/chain-tools/nft/guide.sections.security.wallet_security.title',
					contentKey:
						'routes/apps/chain-tools/nft/guide.sections.security.wallet_security.content',
					toolMentions: [
						{ toolId: 'delegate-cash', context: 'safe delegation' },
						{ toolId: 'warm-xyz', context: 'wallet linking' }
					]
				},
				{
					id: 'scam-prevention',
					titleKey: 'routes/apps/chain-tools/nft/guide.sections.security.scam_prevention.title',
					contentKey:
						'routes/apps/chain-tools/nft/guide.sections.security.scam_prevention.content',
					caseStudies: [
						{
							id: 'bayc-phishing',
							titleKey:
								'routes/apps/chain-tools/nft/guide.sections.security.scam_prevention.case_bayc.title',
							descriptionKey:
								'routes/apps/chain-tools/nft/guide.sections.security.scam_prevention.case_bayc.description',
							date: '2022-04-25',
							profit: '~$3M stolen',
							sourceUrl: 'https://www.theverge.com/2022/4/25/23041415/bored-ape-yacht-club-nft-hack-instagram',
							relatedToolIds: ['opensea']
						}
					]
				},
				{
					id: 'verification',
					titleKey: 'routes/apps/chain-tools/nft/guide.sections.security.verification.title',
					contentKey: 'routes/apps/chain-tools/nft/guide.sections.security.verification.content',
					toolMentions: [{ toolId: 'tokenproof', context: 'token gating' }]
				}
			]
		},

		// Part 8: Multi-Chain NFTs
		{
			id: 'multi-chain',
			titleKey: 'routes/apps/chain-tools/nft/guide.sections.multi_chain.title',
			contentKey: 'routes/apps/chain-tools/nft/guide.sections.multi_chain.content',
			subsections: [
				{
					id: 'solana-nfts',
					titleKey: 'routes/apps/chain-tools/nft/guide.sections.multi_chain.solana_nfts.title',
					contentKey:
						'routes/apps/chain-tools/nft/guide.sections.multi_chain.solana_nfts.content',
					toolMentions: [
						{ toolId: 'tensor', context: 'Solana trading' },
						{ toolId: 'magic-eden', context: 'Solana marketplace' }
					]
				},
				{
					id: 'bitcoin-ordinals',
					titleKey:
						'routes/apps/chain-tools/nft/guide.sections.multi_chain.bitcoin_ordinals.title',
					contentKey:
						'routes/apps/chain-tools/nft/guide.sections.multi_chain.bitcoin_ordinals.content',
					toolMentions: [
						{ toolId: 'ordinals-market', context: 'Ordinals marketplace' },
						{ toolId: 'magic-eden-ordinals', context: 'Ordinals trading' }
					]
				},
				{
					id: 'l2-nfts',
					titleKey: 'routes/apps/chain-tools/nft/guide.sections.multi_chain.l2_nfts.title',
					contentKey: 'routes/apps/chain-tools/nft/guide.sections.multi_chain.l2_nfts.content',
					toolMentions: [{ toolId: 'decent-xyz', context: 'cross-chain minting' }]
				}
			]
		}
	],

	// Glossary for quick reference
	glossary: [
		{
			id: 'floor-price',
			termKey: 'routes/apps/chain-tools/nft/guide.glossary.floor_price.term',
			definitionKey: 'routes/apps/chain-tools/nft/guide.glossary.floor_price.definition',
			relatedToolIds: ['opensea', 'blur']
		},
		{
			id: 'rarity',
			termKey: 'routes/apps/chain-tools/nft/guide.glossary.rarity.term',
			definitionKey: 'routes/apps/chain-tools/nft/guide.glossary.rarity.definition',
			relatedToolIds: ['nftnerds']
		},
		{
			id: 'mint',
			termKey: 'routes/apps/chain-tools/nft/guide.glossary.mint.term',
			definitionKey: 'routes/apps/chain-tools/nft/guide.glossary.mint.definition',
			relatedToolIds: ['manifold', 'zora']
		},
		{
			id: 'allowlist',
			termKey: 'routes/apps/chain-tools/nft/guide.glossary.allowlist.term',
			definitionKey: 'routes/apps/chain-tools/nft/guide.glossary.allowlist.definition',
			relatedToolIds: ['premint']
		},
		{
			id: 'airdrop',
			termKey: 'routes/apps/chain-tools/nft/guide.glossary.airdrop.term',
			definitionKey: 'routes/apps/chain-tools/nft/guide.glossary.airdrop.definition'
		},
		{
			id: 'royalties',
			termKey: 'routes/apps/chain-tools/nft/guide.glossary.royalties.term',
			definitionKey: 'routes/apps/chain-tools/nft/guide.glossary.royalties.definition',
			relatedToolIds: ['opensea', 'blur']
		},
		{
			id: 'pfp',
			termKey: 'routes/apps/chain-tools/nft/guide.glossary.pfp.term',
			definitionKey: 'routes/apps/chain-tools/nft/guide.glossary.pfp.definition'
		},
		{
			id: 'reveal',
			termKey: 'routes/apps/chain-tools/nft/guide.glossary.reveal.term',
			definitionKey: 'routes/apps/chain-tools/nft/guide.glossary.reveal.definition'
		},
		{
			id: 'sweep',
			termKey: 'routes/apps/chain-tools/nft/guide.glossary.sweep.term',
			definitionKey: 'routes/apps/chain-tools/nft/guide.glossary.sweep.definition',
			relatedToolIds: ['blur', 'gem']
		},
		{
			id: 'ordinals',
			termKey: 'routes/apps/chain-tools/nft/guide.glossary.ordinals.term',
			definitionKey: 'routes/apps/chain-tools/nft/guide.glossary.ordinals.definition',
			relatedToolIds: ['ordinals-market', 'magic-eden-ordinals']
		}
	],

	// Featured tools shown in sidebar/footer
	featuredToolIds: [
		'opensea',
		'blur',
		'magic-eden',
		'manifold',
		'nftfi',
		'sudoswap',
		'zora',
		'tensor'
	],

	lastUpdated: '2025-12-31'
};
