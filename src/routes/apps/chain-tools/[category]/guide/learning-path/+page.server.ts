import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getCategoryGuide } from '@/features/chain-tools/data/guides';
import { categories } from '@/features/chain-tools/data/categories';
import { allTools } from '@/features/chain-tools/data/tools';
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
	const categoryTools = allTools.filter((t) => t.category === categoryId);
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
	const canonical = `https://biubiu.tools/${locale}/apps/chain-tools/${categoryId}/guide/learning-path`;

	// Calculate total tasks
	const totalTasks = guide.learningPath.reduce((acc, phase) => acc + phase.tasks.length, 0);

	return {
		guide,
		category: serializableCategory,
		tools: serializableTools,
		totalTasks,
		meta: {
			title: `DeFi Learning Path - Step by Step Guide to Mastery`,
			description: `Structured DeFi learning path with ${guide.learningPath.length} phases and ${totalTasks} practical tasks. From beginner to expert.`,
			keywords: `defi learning path, defi tutorial, learn defi step by step, defi course, defi training`,
			canonical,
			type: 'website' as const,
			image: 'https://biubiu.tools/og-chain-tools.png',
			locale
		},
		structuredData: [
			{
				'@context': 'https://schema.org',
				'@type': 'Course',
				name: 'DeFi Learning Path',
				description: 'Structured path to DeFi mastery',
				provider: {
					'@type': 'Organization',
					name: 'BiuBiu Tools'
				},
				hasCourseInstance: guide.learningPath.map((phase, index) => ({
					'@type': 'CourseInstance',
					name: `Phase ${index + 1}`,
					courseWorkload: `PT${phase.estimatedDays.replace('-', 'D')}D`
				}))
			}
		]
	};
};
