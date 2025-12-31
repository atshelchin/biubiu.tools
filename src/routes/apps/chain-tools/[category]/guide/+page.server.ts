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
			title: `${category.labelKey} Guide - Master the ${categoryId.toUpperCase()} Ecosystem`,
			description: `Comprehensive guide to ${categoryId}: fundamentals, ecosystem map, learning path, and quiz. Includes ${categoryTools.length}+ tools.`,
			keywords: `${categoryId}, ${categoryId} guide, ${categoryId} tutorial, ${categoryId} learning, web3, crypto`,
			canonical: `${url.origin}/apps/chain-tools/${categoryId}/guide`,
			type: 'website',
			image: '/og-chain-tools.png',
			locale
		},
		structuredData: [
			{
				'@context': 'https://schema.org',
				'@type': 'Course',
				name: `${categoryId.toUpperCase()} Complete Guide`,
				description: `Learn ${categoryId} from beginner to expert with our comprehensive guide.`,
				provider: {
					'@type': 'Organization',
					name: 'BiuBiu Tools'
				},
				hasCourseInstance: {
					'@type': 'CourseInstance',
					courseMode: 'online'
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
