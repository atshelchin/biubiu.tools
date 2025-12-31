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
	const canonical = `https://biubiu.tools/${locale}/apps/chain-tools/${categoryId}/guide/glossary`;

	// Get all term names for SEO
	const termNames = guide.glossary.map((g) => g.id.replace(/-/g, ' ').toUpperCase());

	return {
		guide,
		category: serializableCategory,
		tools: serializableTools,
		meta: {
			title: `DeFi Glossary - ${guide.glossary.length} Key Terms Explained`,
			description: `DeFi glossary with ${guide.glossary.length} essential terms: ${termNames.slice(0, 5).join(', ')}, and more. Clear definitions with related tools.`,
			keywords: `defi glossary, defi terms, defi definitions, ${termNames.slice(0, 10).join(', ').toLowerCase()}`,
			canonical,
			type: 'website' as const,
			image: 'https://biubiu.tools/og-chain-tools.png',
			locale
		},
		structuredData: [
			{
				'@context': 'https://schema.org',
				'@type': 'DefinedTermSet',
				name: 'DeFi Glossary',
				description: 'Essential DeFi terminology explained',
				hasDefinedTerm: guide.glossary.map((term) => ({
					'@type': 'DefinedTerm',
					name: term.id,
					description: term.definitionKey
				}))
			}
		]
	};
};
