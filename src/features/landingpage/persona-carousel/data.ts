/**
 * Persona carousel data configuration
 * 人群轮播数据配置
 */

import type { Persona, CarouselConfig } from './types';

/** Default carousel configuration */
export const DEFAULT_CAROUSEL_CONFIG: CarouselConfig = {
	interval: 6000, // 6 seconds per slide (UX best practice for short headlines)
	resumeDelay: 5000, // Resume auto-play 5s after user stops interacting
	autoPlay: true
};

/** Persona definitions with pain points */
export const PERSONAS: Persona[] = [
	// Data Analyst - First priority
	{
		id: 'data-analyst',
		labelKey: 'persona.data_analyst.label',
		icon: 'BarChart3',
		theme: {
			accent: 'hsl(210, 100%, 50%)', // Blue
			gradientFrom: 'hsla(210, 100%, 50%, 0.15)',
			gradientTo: 'hsla(200, 100%, 60%, 0.05)',
			glow: 'hsla(210, 100%, 50%, 0.4)'
		},
		painPoints: [
			{
				titleKey: 'persona.data_analyst.pain_1.title',
				subtitleKey: 'persona.data_analyst.pain_1.subtitle',
				ctaKey: 'persona.data_analyst.pain_1.cta',
				link: '/apps/contract-events-scanner'
			},
			{
				titleKey: 'persona.data_analyst.pain_2.title',
				subtitleKey: 'persona.data_analyst.pain_2.subtitle',
				ctaKey: 'persona.data_analyst.pain_2.cta',
				link: '/apps/token-balance-scanner'
			},
			{
				titleKey: 'persona.data_analyst.pain_3.title',
				subtitleKey: 'persona.data_analyst.pain_3.subtitle',
				ctaKey: 'persona.data_analyst.pain_3.cta',
				link: '/apps/chain-tools'
			}
		],
		tagKeys: [
			'persona.data_analyst.tag_1',
			'persona.data_analyst.tag_2',
			'persona.data_analyst.tag_3'
		]
	},
	// Developer - Second priority
	{
		id: 'developer',
		labelKey: 'persona.developer.label',
		icon: 'Wrench',
		theme: {
			accent: 'hsl(270, 80%, 60%)', // Purple
			gradientFrom: 'hsla(270, 80%, 60%, 0.15)',
			gradientTo: 'hsla(240, 80%, 60%, 0.05)',
			glow: 'hsla(270, 80%, 60%, 0.4)'
		},
		painPoints: [
			{
				titleKey: 'persona.developer.pain_1.title',
				subtitleKey: 'persona.developer.pain_1.subtitle',
				ctaKey: 'persona.developer.pain_1.cta',
				link: '/apps/contract-deployer'
			},
			{
				titleKey: 'persona.developer.pain_2.title',
				subtitleKey: 'persona.developer.pain_2.subtitle',
				ctaKey: 'persona.developer.pain_2.cta',
				link: '/apps/wallet-generator'
			},
			{
				titleKey: 'persona.developer.pain_3.title',
				subtitleKey: 'persona.developer.pain_3.subtitle',
				ctaKey: 'persona.developer.pain_3.cta',
				link: '/apps/token-deployer'
			}
		],
		tagKeys: ['persona.developer.tag_1', 'persona.developer.tag_2', 'persona.developer.tag_3']
	},
	// Airdrop Hunter - Third priority (highest willingness to pay)
	{
		id: 'airdrop-hunter',
		labelKey: 'persona.airdrop_hunter.label',
		icon: 'Rocket',
		theme: {
			accent: 'hsl(160, 80%, 45%)', // Green (brand color)
			gradientFrom: 'hsla(160, 80%, 45%, 0.15)',
			gradientTo: 'hsla(180, 80%, 50%, 0.05)',
			glow: 'hsla(160, 80%, 45%, 0.4)'
		},
		painPoints: [
			{
				titleKey: 'persona.airdrop_hunter.pain_1.title',
				subtitleKey: 'persona.airdrop_hunter.pain_1.subtitle',
				ctaKey: 'persona.airdrop_hunter.pain_1.cta',
				link: '/apps/wallet-sweep'
			},
			{
				titleKey: 'persona.airdrop_hunter.pain_2.title',
				subtitleKey: 'persona.airdrop_hunter.pain_2.subtitle',
				ctaKey: 'persona.airdrop_hunter.pain_2.cta',
				link: '/apps/one-to-many-transfer'
			},
			{
				titleKey: 'persona.airdrop_hunter.pain_3.title',
				subtitleKey: 'persona.airdrop_hunter.pain_3.subtitle',
				ctaKey: 'persona.airdrop_hunter.pain_3.cta',
				link: '/apps/token-balance-scanner'
			}
		],
		tagKeys: [
			'persona.airdrop_hunter.tag_1',
			'persona.airdrop_hunter.tag_2',
			'persona.airdrop_hunter.tag_3'
		]
	}
];
