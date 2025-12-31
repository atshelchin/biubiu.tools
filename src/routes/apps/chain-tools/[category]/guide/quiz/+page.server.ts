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
	const canonical = `https://biubiu.tools/${locale}/apps/chain-tools/${categoryId}/guide/quiz`;

	// Get difficulty from URL params
	const difficulty = url.searchParams.get('difficulty') || null;

	// Count questions by difficulty
	const beginnerCount = guide.quiz.questions.filter((q) => q.difficulty === 'beginner').length;
	const intermediateCount = guide.quiz.questions.filter(
		(q) => q.difficulty === 'intermediate'
	).length;
	const expertCount = guide.quiz.questions.filter((q) => q.difficulty === 'expert').length;

	return {
		guide,
		category: serializableCategory,
		tools: serializableTools,
		initialDifficulty: difficulty,
		questionCounts: {
			beginner: beginnerCount,
			intermediate: intermediateCount,
			expert: expertCount,
			total: guide.quiz.questions.length
		},
		meta: {
			title: `DeFi Quiz - Test Your Knowledge`,
			description: `Test your DeFi knowledge with ${guide.quiz.questions.length} questions. Beginner, intermediate, and expert levels. Earn achievements!`,
			keywords: `defi quiz, defi test, test defi knowledge, defi certification, defi exam`,
			canonical,
			type: 'website' as const,
			image: 'https://biubiu.tools/og-chain-tools.png',
			locale
		},
		structuredData: [
			{
				'@context': 'https://schema.org',
				'@type': 'Quiz',
				name: 'DeFi Mastery Quiz',
				description: 'Test your decentralized finance knowledge',
				educationalLevel: ['Beginner', 'Intermediate', 'Expert'],
				numberOfQuestions: guide.quiz.questions.length
			}
		]
	};
};
