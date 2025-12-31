/**
 * Payments (Crypto Payments) Category Guide Data
 * Comprehensive guide covering crypto payments, fiat on/off-ramps, streaming payments, and merchant solutions
 *
 * Content philosophy:
 * - Focus on real-world payment use cases and adoption
 * - Cover the entire payment ecosystem from consumer to enterprise
 * - Include practical examples of payment implementations
 * - Progressive learning from basic concepts to advanced treasury management
 */
import type { CategoryGuide } from '../../types';

export const paymentsGuide: CategoryGuide = {
	categoryId: 'payments',
	i18nKeyPrefix: 'routes/apps/chain-tools/payments/guide',
	estimatedReadTime: '18 min',

	sections: [
		// Part 1: Introduction
		{
			id: 'intro',
			titleKey: 'routes/apps/chain-tools/payments/guide.sections.intro.title',
			contentKey: 'routes/apps/chain-tools/payments/guide.sections.intro.content',
			toolMentions: [
				{ toolId: 'moonpay', context: 'fiat on-ramp' },
				{ toolId: 'request-network', context: 'crypto invoicing' }
			]
		},

		// Part 2: Payment Rails
		{
			id: 'payment-rails',
			titleKey: 'routes/apps/chain-tools/payments/guide.sections.payment_rails.title',
			contentKey: 'routes/apps/chain-tools/payments/guide.sections.payment_rails.content',
			subsections: [
				{
					id: 'stablecoins',
					titleKey:
						'routes/apps/chain-tools/payments/guide.sections.payment_rails.stablecoins.title',
					contentKey:
						'routes/apps/chain-tools/payments/guide.sections.payment_rails.stablecoins.content',
					toolMentions: [
						{ toolId: 'usdc', context: 'regulated stablecoin' },
						{ toolId: 'circle', context: 'USDC issuer' }
					]
				},
				{
					id: 'layer2',
					titleKey: 'routes/apps/chain-tools/payments/guide.sections.payment_rails.layer2.title',
					contentKey:
						'routes/apps/chain-tools/payments/guide.sections.payment_rails.layer2.content',
					toolMentions: [
						{ toolId: 'arbitrum', context: 'low-cost payments' },
						{ toolId: 'optimism', context: 'fast settlements' },
						{ toolId: 'base', context: 'Coinbase L2' }
					]
				},
				{
					id: 'bitcoin-lightning',
					titleKey:
						'routes/apps/chain-tools/payments/guide.sections.payment_rails.bitcoin_lightning.title',
					contentKey:
						'routes/apps/chain-tools/payments/guide.sections.payment_rails.bitcoin_lightning.content'
				}
			]
		},

		// Part 3: Merchant Solutions
		{
			id: 'merchant-solutions',
			titleKey: 'routes/apps/chain-tools/payments/guide.sections.merchant_solutions.title',
			contentKey: 'routes/apps/chain-tools/payments/guide.sections.merchant_solutions.content',
			subsections: [
				{
					id: 'payment-gateways',
					titleKey:
						'routes/apps/chain-tools/payments/guide.sections.merchant_solutions.payment_gateways.title',
					contentKey:
						'routes/apps/chain-tools/payments/guide.sections.merchant_solutions.payment_gateways.content',
					toolMentions: [
						{ toolId: 'coinbase-commerce', context: 'e-commerce integration' },
						{ toolId: 'bitpay', context: 'merchant services' },
						{ toolId: 'nowpayments', context: 'multi-chain payments' }
					]
				},
				{
					id: 'pos-systems',
					titleKey:
						'routes/apps/chain-tools/payments/guide.sections.merchant_solutions.pos_systems.title',
					contentKey:
						'routes/apps/chain-tools/payments/guide.sections.merchant_solutions.pos_systems.content'
				},
				{
					id: 'invoicing',
					titleKey:
						'routes/apps/chain-tools/payments/guide.sections.merchant_solutions.invoicing.title',
					contentKey:
						'routes/apps/chain-tools/payments/guide.sections.merchant_solutions.invoicing.content',
					toolMentions: [
						{ toolId: 'request-network', context: 'decentralized invoicing' },
						{ toolId: 'utila-pay', context: 'crypto invoices' }
					]
				}
			]
		},

		// Part 4: Payroll & Streaming Payments
		{
			id: 'payroll-streaming',
			titleKey: 'routes/apps/chain-tools/payments/guide.sections.payroll_streaming.title',
			contentKey: 'routes/apps/chain-tools/payments/guide.sections.payroll_streaming.content',
			subsections: [
				{
					id: 'streaming-payments',
					titleKey:
						'routes/apps/chain-tools/payments/guide.sections.payroll_streaming.streaming_payments.title',
					contentKey:
						'routes/apps/chain-tools/payments/guide.sections.payroll_streaming.streaming_payments.content',
					toolMentions: [
						{ toolId: 'superfluid', context: 'real-time streaming' },
						{ toolId: 'sablier', context: 'token vesting' },
						{ toolId: 'llamapay', context: 'payroll streaming' }
					]
				},
				{
					id: 'payroll-management',
					titleKey:
						'routes/apps/chain-tools/payments/guide.sections.payroll_streaming.payroll_management.title',
					contentKey:
						'routes/apps/chain-tools/payments/guide.sections.payroll_streaming.payroll_management.content',
					toolMentions: [
						{ toolId: 'utopia-labs', context: 'DAO payroll' },
						{ toolId: 'parcel', context: 'batch payments' }
					]
				},
				{
					id: 'revenue-sharing',
					titleKey:
						'routes/apps/chain-tools/payments/guide.sections.payroll_streaming.revenue_sharing.title',
					contentKey:
						'routes/apps/chain-tools/payments/guide.sections.payroll_streaming.revenue_sharing.content',
					toolMentions: [
						{ toolId: 'splits', context: 'payment splits' },
						{ toolId: 'reveel', context: 'revenue distribution' }
					]
				}
			]
		},

		// Part 5: Fiat On/Off Ramps
		{
			id: 'fiat-ramps',
			titleKey: 'routes/apps/chain-tools/payments/guide.sections.fiat_ramps.title',
			contentKey: 'routes/apps/chain-tools/payments/guide.sections.fiat_ramps.content',
			subsections: [
				{
					id: 'onramps',
					titleKey: 'routes/apps/chain-tools/payments/guide.sections.fiat_ramps.onramps.title',
					contentKey: 'routes/apps/chain-tools/payments/guide.sections.fiat_ramps.onramps.content',
					toolMentions: [
						{ toolId: 'moonpay', context: 'card purchases' },
						{ toolId: 'transak', context: 'global coverage' },
						{ toolId: 'ramp', context: 'SDK integration' }
					]
				},
				{
					id: 'offramps',
					titleKey: 'routes/apps/chain-tools/payments/guide.sections.fiat_ramps.offramps.title',
					contentKey: 'routes/apps/chain-tools/payments/guide.sections.fiat_ramps.offramps.content',
					toolMentions: [
						{ toolId: 'spritz', context: 'bill payments' },
						{ toolId: 'monerium', context: 'IBAN transfers' }
					]
				},
				{
					id: 'crypto-cards',
					titleKey: 'routes/apps/chain-tools/payments/guide.sections.fiat_ramps.crypto_cards.title',
					contentKey:
						'routes/apps/chain-tools/payments/guide.sections.fiat_ramps.crypto_cards.content',
					toolMentions: [{ toolId: 'gnosis-pay', context: 'self-custody card' }]
				}
			]
		},

		// Part 6: Remittances & Cross-Border
		{
			id: 'remittances',
			titleKey: 'routes/apps/chain-tools/payments/guide.sections.remittances.title',
			contentKey: 'routes/apps/chain-tools/payments/guide.sections.remittances.content',
			subsections: [
				{
					id: 'use-cases',
					titleKey: 'routes/apps/chain-tools/payments/guide.sections.remittances.use_cases.title',
					contentKey:
						'routes/apps/chain-tools/payments/guide.sections.remittances.use_cases.content'
				},
				{
					id: 'advantages',
					titleKey: 'routes/apps/chain-tools/payments/guide.sections.remittances.advantages.title',
					contentKey:
						'routes/apps/chain-tools/payments/guide.sections.remittances.advantages.content'
				}
			]
		},

		// Part 7: Treasury Management
		{
			id: 'treasury',
			titleKey: 'routes/apps/chain-tools/payments/guide.sections.treasury.title',
			contentKey: 'routes/apps/chain-tools/payments/guide.sections.treasury.content',
			subsections: [
				{
					id: 'multi-sig',
					titleKey: 'routes/apps/chain-tools/payments/guide.sections.treasury.multi_sig.title',
					contentKey: 'routes/apps/chain-tools/payments/guide.sections.treasury.multi_sig.content',
					toolMentions: [
						{ toolId: 'safe', context: 'multi-sig wallet' },
						{ toolId: 'coinshift', context: 'treasury operations' }
					]
				},
				{
					id: 'batch-payments',
					titleKey: 'routes/apps/chain-tools/payments/guide.sections.treasury.batch_payments.title',
					contentKey:
						'routes/apps/chain-tools/payments/guide.sections.treasury.batch_payments.content',
					toolMentions: [{ toolId: 'parcel', context: 'batch transactions' }]
				}
			]
		},

		// Part 8: Compliance & Tax
		{
			id: 'compliance-tax',
			titleKey: 'routes/apps/chain-tools/payments/guide.sections.compliance_tax.title',
			contentKey: 'routes/apps/chain-tools/payments/guide.sections.compliance_tax.content',
			subsections: [
				{
					id: 'kyc-aml',
					titleKey: 'routes/apps/chain-tools/payments/guide.sections.compliance_tax.kyc_aml.title',
					contentKey:
						'routes/apps/chain-tools/payments/guide.sections.compliance_tax.kyc_aml.content',
					toolMentions: [{ toolId: 'sardine', context: 'fraud prevention' }]
				},
				{
					id: 'tax-reporting',
					titleKey:
						'routes/apps/chain-tools/payments/guide.sections.compliance_tax.tax_reporting.title',
					contentKey:
						'routes/apps/chain-tools/payments/guide.sections.compliance_tax.tax_reporting.content'
				},
				{
					id: 'best-practices',
					titleKey:
						'routes/apps/chain-tools/payments/guide.sections.compliance_tax.best_practices.title',
					contentKey:
						'routes/apps/chain-tools/payments/guide.sections.compliance_tax.best_practices.content'
				}
			]
		}
	],

	// Glossary for quick reference
	glossary: [
		{
			id: 'payment-rail',
			termKey: 'routes/apps/chain-tools/payments/guide.glossary.payment_rail.term',
			definitionKey: 'routes/apps/chain-tools/payments/guide.glossary.payment_rail.definition',
			relatedToolIds: ['arbitrum', 'optimism', 'base']
		},
		{
			id: 'streaming-payment',
			termKey: 'routes/apps/chain-tools/payments/guide.glossary.streaming_payment.term',
			definitionKey: 'routes/apps/chain-tools/payments/guide.glossary.streaming_payment.definition',
			relatedToolIds: ['superfluid', 'sablier', 'llamapay']
		},
		{
			id: 'invoice',
			termKey: 'routes/apps/chain-tools/payments/guide.glossary.invoice.term',
			definitionKey: 'routes/apps/chain-tools/payments/guide.glossary.invoice.definition',
			relatedToolIds: ['request-network', 'utila-pay']
		},
		{
			id: 'remittance',
			termKey: 'routes/apps/chain-tools/payments/guide.glossary.remittance.term',
			definitionKey: 'routes/apps/chain-tools/payments/guide.glossary.remittance.definition'
		},
		{
			id: 'pos',
			termKey: 'routes/apps/chain-tools/payments/guide.glossary.pos.term',
			definitionKey: 'routes/apps/chain-tools/payments/guide.glossary.pos.definition',
			relatedToolIds: ['bitpay']
		},
		{
			id: 'merchant',
			termKey: 'routes/apps/chain-tools/payments/guide.glossary.merchant.term',
			definitionKey: 'routes/apps/chain-tools/payments/guide.glossary.merchant.definition',
			relatedToolIds: ['coinbase-commerce', 'bitpay', 'nowpayments']
		},
		{
			id: 'payment-gateway',
			termKey: 'routes/apps/chain-tools/payments/guide.glossary.payment_gateway.term',
			definitionKey: 'routes/apps/chain-tools/payments/guide.glossary.payment_gateway.definition',
			relatedToolIds: ['coinbase-commerce', 'nowpayments']
		},
		{
			id: 'fiat-onramp',
			termKey: 'routes/apps/chain-tools/payments/guide.glossary.fiat_onramp.term',
			definitionKey: 'routes/apps/chain-tools/payments/guide.glossary.fiat_onramp.definition',
			relatedToolIds: ['moonpay', 'transak', 'ramp']
		},
		{
			id: 'fiat-offramp',
			termKey: 'routes/apps/chain-tools/payments/guide.glossary.fiat_offramp.term',
			definitionKey: 'routes/apps/chain-tools/payments/guide.glossary.fiat_offramp.definition',
			relatedToolIds: ['spritz', 'monerium']
		},
		{
			id: 'payment-token',
			termKey: 'routes/apps/chain-tools/payments/guide.glossary.payment_token.term',
			definitionKey: 'routes/apps/chain-tools/payments/guide.glossary.payment_token.definition'
		}
	],

	// Featured tools shown in sidebar/footer
	featuredToolIds: [
		'request-network',
		'superfluid',
		'sablier',
		'moonpay',
		'coinbase-commerce',
		'safe',
		'llamapay',
		'spritz'
	],

	lastUpdated: '2025-12-31'
};
