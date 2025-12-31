/**
 * CEX (Centralized Exchange) Category Guide Data
 * Long-form educational article with real examples and case studies
 *
 * Content philosophy:
 * - Focus on understanding centralized exchanges and their role in crypto
 * - Include real-world examples and historical cases
 * - Emphasize security best practices and risk awareness
 * - Progressive learning from basics to advanced trading
 */
import type { CategoryGuide } from '../../types';

export const cexGuide: CategoryGuide = {
	categoryId: 'cex',
	i18nKeyPrefix: 'routes/apps/chain-tools/cex/guide',
	estimatedReadTime: '18 min',

	sections: [
		// Part 1: Introduction
		{
			id: 'intro',
			titleKey: 'routes/apps/chain-tools/cex/guide.sections.intro.title',
			contentKey: 'routes/apps/chain-tools/cex/guide.sections.intro.content',
			toolMentions: [
				{ toolId: 'binance', context: 'largest CEX by volume' },
				{ toolId: 'coinbase', context: 'regulated US exchange' }
			]
		},

		// Part 2: CEX Basics
		{
			id: 'cex-basics',
			titleKey: 'routes/apps/chain-tools/cex/guide.sections.cex_basics.title',
			contentKey: 'routes/apps/chain-tools/cex/guide.sections.cex_basics.content',
			subsections: [
				{
					id: 'how-they-work',
					titleKey: 'routes/apps/chain-tools/cex/guide.sections.cex_basics.how_they_work.title',
					contentKey: 'routes/apps/chain-tools/cex/guide.sections.cex_basics.how_they_work.content',
					toolMentions: [{ toolId: 'binance' }, { toolId: 'kraken' }]
				},
				{
					id: 'order-books',
					titleKey: 'routes/apps/chain-tools/cex/guide.sections.cex_basics.order_books.title',
					contentKey: 'routes/apps/chain-tools/cex/guide.sections.cex_basics.order_books.content'
				},
				{
					id: 'trading-fees',
					titleKey: 'routes/apps/chain-tools/cex/guide.sections.cex_basics.trading_fees.title',
					contentKey: 'routes/apps/chain-tools/cex/guide.sections.cex_basics.trading_fees.content',
					toolMentions: [{ toolId: 'binance' }, { toolId: 'coinbase' }]
				}
			]
		},

		// Part 3: CEX vs DEX
		{
			id: 'cex-vs-dex',
			titleKey: 'routes/apps/chain-tools/cex/guide.sections.cex_vs_dex.title',
			contentKey: 'routes/apps/chain-tools/cex/guide.sections.cex_vs_dex.content',
			subsections: [
				{
					id: 'liquidity-speed',
					titleKey: 'routes/apps/chain-tools/cex/guide.sections.cex_vs_dex.liquidity_speed.title',
					contentKey:
						'routes/apps/chain-tools/cex/guide.sections.cex_vs_dex.liquidity_speed.content'
				},
				{
					id: 'custody',
					titleKey: 'routes/apps/chain-tools/cex/guide.sections.cex_vs_dex.custody.title',
					contentKey: 'routes/apps/chain-tools/cex/guide.sections.cex_vs_dex.custody.content'
				},
				{
					id: 'privacy-kyc',
					titleKey: 'routes/apps/chain-tools/cex/guide.sections.cex_vs_dex.privacy_kyc.title',
					contentKey: 'routes/apps/chain-tools/cex/guide.sections.cex_vs_dex.privacy_kyc.content'
				}
			]
		},

		// Part 4: Choosing an Exchange
		{
			id: 'choosing-exchange',
			titleKey: 'routes/apps/chain-tools/cex/guide.sections.choosing_exchange.title',
			contentKey: 'routes/apps/chain-tools/cex/guide.sections.choosing_exchange.content',
			subsections: [
				{
					id: 'security-reputation',
					titleKey:
						'routes/apps/chain-tools/cex/guide.sections.choosing_exchange.security_reputation.title',
					contentKey:
						'routes/apps/chain-tools/cex/guide.sections.choosing_exchange.security_reputation.content',
					toolMentions: [{ toolId: 'kraken' }, { toolId: 'coinbase' }]
				},
				{
					id: 'jurisdiction',
					titleKey:
						'routes/apps/chain-tools/cex/guide.sections.choosing_exchange.jurisdiction.title',
					contentKey:
						'routes/apps/chain-tools/cex/guide.sections.choosing_exchange.jurisdiction.content'
				},
				{
					id: 'assets-features',
					titleKey:
						'routes/apps/chain-tools/cex/guide.sections.choosing_exchange.assets_features.title',
					contentKey:
						'routes/apps/chain-tools/cex/guide.sections.choosing_exchange.assets_features.content',
					toolMentions: [{ toolId: 'binance' }, { toolId: 'okx' }, { toolId: 'bybit' }]
				}
			]
		},

		// Part 5: Security Best Practices
		{
			id: 'security',
			titleKey: 'routes/apps/chain-tools/cex/guide.sections.security.title',
			contentKey: 'routes/apps/chain-tools/cex/guide.sections.security.content',
			subsections: [
				{
					id: 'two-factor-auth',
					titleKey: 'routes/apps/chain-tools/cex/guide.sections.security.two_factor_auth.title',
					contentKey: 'routes/apps/chain-tools/cex/guide.sections.security.two_factor_auth.content'
				},
				{
					id: 'withdrawal-whitelist',
					titleKey:
						'routes/apps/chain-tools/cex/guide.sections.security.withdrawal_whitelist.title',
					contentKey:
						'routes/apps/chain-tools/cex/guide.sections.security.withdrawal_whitelist.content'
				},
				{
					id: 'api-keys',
					titleKey: 'routes/apps/chain-tools/cex/guide.sections.security.api_keys.title',
					contentKey: 'routes/apps/chain-tools/cex/guide.sections.security.api_keys.content'
				},
				{
					id: 'cold-storage',
					titleKey: 'routes/apps/chain-tools/cex/guide.sections.security.cold_storage.title',
					contentKey: 'routes/apps/chain-tools/cex/guide.sections.security.cold_storage.content'
				}
			]
		},

		// Part 6: Trading Features
		{
			id: 'trading-features',
			titleKey: 'routes/apps/chain-tools/cex/guide.sections.trading_features.title',
			contentKey: 'routes/apps/chain-tools/cex/guide.sections.trading_features.content',
			subsections: [
				{
					id: 'spot-trading',
					titleKey:
						'routes/apps/chain-tools/cex/guide.sections.trading_features.spot_trading.title',
					contentKey:
						'routes/apps/chain-tools/cex/guide.sections.trading_features.spot_trading.content'
				},
				{
					id: 'margin-trading',
					titleKey:
						'routes/apps/chain-tools/cex/guide.sections.trading_features.margin_trading.title',
					contentKey:
						'routes/apps/chain-tools/cex/guide.sections.trading_features.margin_trading.content',
					toolMentions: [{ toolId: 'binance' }, { toolId: 'bybit' }]
				},
				{
					id: 'futures-derivatives',
					titleKey:
						'routes/apps/chain-tools/cex/guide.sections.trading_features.futures_derivatives.title',
					contentKey:
						'routes/apps/chain-tools/cex/guide.sections.trading_features.futures_derivatives.content',
					toolMentions: [{ toolId: 'binance' }, { toolId: 'okx' }]
				},
				{
					id: 'earn-products',
					titleKey:
						'routes/apps/chain-tools/cex/guide.sections.trading_features.earn_products.title',
					contentKey:
						'routes/apps/chain-tools/cex/guide.sections.trading_features.earn_products.content'
				}
			]
		},

		// Part 7: Risks and Historical Cases
		{
			id: 'risks',
			titleKey: 'routes/apps/chain-tools/cex/guide.sections.risks.title',
			contentKey: 'routes/apps/chain-tools/cex/guide.sections.risks.content',
			subsections: [
				{
					id: 'exchange-hacks',
					titleKey: 'routes/apps/chain-tools/cex/guide.sections.risks.exchange_hacks.title',
					contentKey: 'routes/apps/chain-tools/cex/guide.sections.risks.exchange_hacks.content',
					caseStudies: [
						{
							id: 'mt-gox',
							titleKey:
								'routes/apps/chain-tools/cex/guide.sections.risks.exchange_hacks.case_mtgox.title',
							descriptionKey:
								'routes/apps/chain-tools/cex/guide.sections.risks.exchange_hacks.case_mtgox.description',
							date: '2014-02-24',
							profit: '~850,000 BTC lost',
							sourceUrl: 'https://en.wikipedia.org/wiki/Mt._Gox'
						}
					]
				},
				{
					id: 'counterparty-risk',
					titleKey: 'routes/apps/chain-tools/cex/guide.sections.risks.counterparty_risk.title',
					contentKey: 'routes/apps/chain-tools/cex/guide.sections.risks.counterparty_risk.content',
					caseStudies: [
						{
							id: 'ftx-collapse',
							titleKey:
								'routes/apps/chain-tools/cex/guide.sections.risks.counterparty_risk.case_ftx.title',
							descriptionKey:
								'routes/apps/chain-tools/cex/guide.sections.risks.counterparty_risk.case_ftx.description',
							date: '2022-11-11',
							profit: '~$8B customer funds lost',
							sourceUrl: 'https://en.wikipedia.org/wiki/Bankruptcy_of_FTX'
						}
					]
				},
				{
					id: 'regulatory-risk',
					titleKey: 'routes/apps/chain-tools/cex/guide.sections.risks.regulatory_risk.title',
					contentKey: 'routes/apps/chain-tools/cex/guide.sections.risks.regulatory_risk.content'
				}
			]
		},

		// Part 8: API Trading
		{
			id: 'api-trading',
			titleKey: 'routes/apps/chain-tools/cex/guide.sections.api_trading.title',
			contentKey: 'routes/apps/chain-tools/cex/guide.sections.api_trading.content',
			subsections: [
				{
					id: 'getting-started',
					titleKey: 'routes/apps/chain-tools/cex/guide.sections.api_trading.getting_started.title',
					contentKey:
						'routes/apps/chain-tools/cex/guide.sections.api_trading.getting_started.content',
					toolMentions: [{ toolId: 'binance' }, { toolId: 'coinbase' }]
				},
				{
					id: 'rate-limits',
					titleKey: 'routes/apps/chain-tools/cex/guide.sections.api_trading.rate_limits.title',
					contentKey: 'routes/apps/chain-tools/cex/guide.sections.api_trading.rate_limits.content'
				},
				{
					id: 'best-practices',
					titleKey: 'routes/apps/chain-tools/cex/guide.sections.api_trading.best_practices.title',
					contentKey:
						'routes/apps/chain-tools/cex/guide.sections.api_trading.best_practices.content'
				}
			]
		}
	],

	// Glossary for quick reference
	glossary: [
		{
			id: 'order-book',
			termKey: 'routes/apps/chain-tools/cex/guide.glossary.order_book.term',
			definitionKey: 'routes/apps/chain-tools/cex/guide.glossary.order_book.definition',
			relatedToolIds: ['binance', 'kraken']
		},
		{
			id: 'market-maker',
			termKey: 'routes/apps/chain-tools/cex/guide.glossary.market_maker.term',
			definitionKey: 'routes/apps/chain-tools/cex/guide.glossary.market_maker.definition'
		},
		{
			id: 'taker-fee',
			termKey: 'routes/apps/chain-tools/cex/guide.glossary.taker_fee.term',
			definitionKey: 'routes/apps/chain-tools/cex/guide.glossary.taker_fee.definition'
		},
		{
			id: 'maker-fee',
			termKey: 'routes/apps/chain-tools/cex/guide.glossary.maker_fee.term',
			definitionKey: 'routes/apps/chain-tools/cex/guide.glossary.maker_fee.definition'
		},
		{
			id: 'spread',
			termKey: 'routes/apps/chain-tools/cex/guide.glossary.spread.term',
			definitionKey: 'routes/apps/chain-tools/cex/guide.glossary.spread.definition'
		},
		{
			id: 'slippage',
			termKey: 'routes/apps/chain-tools/cex/guide.glossary.slippage.term',
			definitionKey: 'routes/apps/chain-tools/cex/guide.glossary.slippage.definition'
		},
		{
			id: 'margin',
			termKey: 'routes/apps/chain-tools/cex/guide.glossary.margin.term',
			definitionKey: 'routes/apps/chain-tools/cex/guide.glossary.margin.definition',
			relatedToolIds: ['binance', 'bybit']
		},
		{
			id: 'liquidation',
			termKey: 'routes/apps/chain-tools/cex/guide.glossary.liquidation.term',
			definitionKey: 'routes/apps/chain-tools/cex/guide.glossary.liquidation.definition'
		},
		{
			id: 'kyc',
			termKey: 'routes/apps/chain-tools/cex/guide.glossary.kyc.term',
			definitionKey: 'routes/apps/chain-tools/cex/guide.glossary.kyc.definition',
			relatedToolIds: ['coinbase', 'kraken']
		},
		{
			id: 'aml',
			termKey: 'routes/apps/chain-tools/cex/guide.glossary.aml.term',
			definitionKey: 'routes/apps/chain-tools/cex/guide.glossary.aml.definition'
		},
		{
			id: 'cold-wallet',
			termKey: 'routes/apps/chain-tools/cex/guide.glossary.cold_wallet.term',
			definitionKey: 'routes/apps/chain-tools/cex/guide.glossary.cold_wallet.definition'
		},
		{
			id: 'hot-wallet',
			termKey: 'routes/apps/chain-tools/cex/guide.glossary.hot_wallet.term',
			definitionKey: 'routes/apps/chain-tools/cex/guide.glossary.hot_wallet.definition'
		}
	],

	// Featured tools shown in sidebar/footer
	featuredToolIds: ['binance', 'coinbase', 'kraken', 'okx', 'bybit', 'kucoin', 'gate-io', 'htx'],

	lastUpdated: '2025-12-31'
};
