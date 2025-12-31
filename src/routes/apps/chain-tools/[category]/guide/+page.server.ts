import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getCategoryGuide } from '@/features/chain-tools/data/guides';
import { getCategoryById } from '@/features/chain-tools/data/categories';
import { allTools } from '@/features/chain-tools/data/tools';
import type {
	CategoryId,
	CategoryGuidePageData,
	SerializableExternalTool
} from '@/features/chain-tools/types';

export const load: PageServerLoad = async ({ params, url }) => {
	const categoryId = params.category as CategoryId;

	// Check if category exists
	const category = getCategoryById(categoryId);
	if (!category) {
		throw error(404, 'Category not found');
	}

	// Check if guide exists for this category
	const guide = getCategoryGuide(categoryId);
	if (!guide) {
		throw error(404, 'Guide not found for this category');
	}

	// Get all tools for this category
	const categoryTools = allTools.filter((tool) => tool.category === categoryId);

	// Serialize tools (remove icon component)
	const serializedTools: SerializableExternalTool[] = categoryTools.map(
		({ icon: _toolIcon, ...tool }) => {
			void _toolIcon; // Suppress unused variable warning
			return tool;
		}
	);

	// Serialize category (remove icon component)
	const { icon: _icon, ...serializedCategory } = category;
	void _icon; // Suppress unused variable warning

	// Get locale from URL
	const locale = url.pathname.startsWith('/zh/') ? 'zh' : 'en';

	// Build page data
	const pageData: CategoryGuidePageData = {
		guide,
		category: serializedCategory,
		tools: serializedTools,
		meta: {
			title: `${categoryId.toUpperCase()} Complete Guide - From Basics to Advanced Strategies`,
			description: `Master ${categoryId} with our comprehensive guide. Learn core concepts, discover earning opportunities, and explore real case studies. ${guide.estimatedReadTime} read.`,
			keywords: `${categoryId}, ${categoryId} guide, ${categoryId} tutorial, ${categoryId} earning, ${categoryId} arbitrage, web3, crypto, defi`,
			canonical: `${url.origin}/apps/chain-tools/${categoryId}/guide`,
			type: 'website',
			image: '/og-chain-tools.png',
			locale
		},
		structuredData: [
			{
				'@context': 'https://schema.org',
				'@type': 'Article',
				headline: `${categoryId.toUpperCase()} Complete Guide`,
				description: `Comprehensive guide to ${categoryId} with real examples and case studies.`,
				author: {
					'@type': 'Organization',
					name: 'BiuBiu Tools'
				},
				dateModified: guide.lastUpdated,
				publisher: {
					'@type': 'Organization',
					name: 'BiuBiu Tools'
				}
			},
			{
				'@context': 'https://schema.org',
				'@type': 'FAQPage',
				mainEntity: guide.glossary.slice(0, 5).map((term) => ({
					'@type': 'Question',
					name: term.termKey,
					acceptedAnswer: {
						'@type': 'Answer',
						text: term.definitionKey
					}
				}))
			}
		]
	};

	return pageData;
};
