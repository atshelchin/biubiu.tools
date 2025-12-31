import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getCategoryGuide } from '@/features/chain-tools/data/guides';
import { categories, tools } from '@/features/chain-tools/data';
import type {
	CategoryId,
	SerializableCategory,
	SerializableExternalTool
} from '@/features/chain-tools/types';

export const load: PageServerLoad = async ({ params, url }) => {
	const categoryId = params.category as CategoryId;

	// Get guide data
	const guide = getCategoryGuide(categoryId);
	if (!guide) {
		throw error(404, `No guide found for category: ${categoryId}`);
	}

	// Get category data
	const category = categories.find((c) => c.id === categoryId);
	if (!category) {
		throw error(404, `Category not found: ${categoryId}`);
	}

	// Serialize category (remove icon component)
	const serializableCategory: SerializableCategory = {
		id: category.id,
		labelKey: category.labelKey,
		color: category.color
	};

	// Get tools for this category
	const categoryTools = tools.filter((t) => t.category === categoryId);
	const serializableTools: SerializableExternalTool[] = categoryTools.map((tool) => ({
		id: tool.id,
		name: tool.name,
		descriptionKey: tool.descriptionKey,
		url: tool.url,
		category: tool.category,
		tags: tool.tags,
		chains: tool.chains,
		color: tool.color,
		isFeatured: tool.isFeatured
	}));

	// Build canonical URL
	const locale = url.pathname.split('/')[1] || 'en';
	const canonical = `https://biubiu.tools/${locale}/apps/chain-tools/${categoryId}/guide/ecosystem`;

	return {
		guide,
		category: serializableCategory,
		tools: serializableTools,
		meta: {
			title: `DeFi Ecosystem Map - Explore DEX, Lending, Yield & More`,
			description: `Explore the DeFi ecosystem: DEX protocols, lending platforms, stablecoins, yield aggregators, and derivatives. Understand how they interconnect.`,
			keywords: `defi ecosystem, defi map, defi protocols, dex protocols, defi lending, yield farming, defi derivatives`,
			canonical,
			type: 'website' as const,
			image: 'https://biubiu.tools/og-chain-tools.png',
			locale
		},
		structuredData: [
			{
				'@context': 'https://schema.org',
				'@type': 'Article',
				headline: 'DeFi Ecosystem Map - Explore the Decentralized Finance Landscape',
				description: 'Comprehensive overview of the DeFi ecosystem sectors',
				author: {
					'@type': 'Organization',
					name: 'BiuBiu Tools'
				},
				publisher: {
					'@type': 'Organization',
					name: 'BiuBiu Tools'
				},
				dateModified: guide.lastUpdated
			}
		]
	};
};
