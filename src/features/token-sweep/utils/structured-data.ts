/**
 * Generate WebApplication structured data for SEO
 */
export function createWebAppData(params: {
	name: string;
	description: string;
	canonical: string;
	features: string[];
	ratingValue?: string;
	ratingCount?: string;
}) {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebApplication',
		name: params.name,
		applicationCategory: 'FinanceApplication',
		operatingSystem: 'Web Browser',
		description: params.description,
		url: params.canonical,
		author: {
			'@type': 'Organization',
			name: 'BiuBiu Tools',
			url: 'https://biubiu.tools'
		},
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD'
		},
		aggregateRating: {
			'@type': 'AggregateRating',
			ratingValue: params.ratingValue || '4.8',
			ratingCount: params.ratingCount || '127'
		},
		featureList: params.features
	};
}

export interface HowToStepData {
	name: string;
	text: string;
	description: string;
}

/**
 * Generate HowTo structured data for SEO
 */
export function createHowToData(params: {
	name: string;
	description: string;
	canonical: string;
	image: string;
	steps: HowToStepData[];
	totalTime?: string;
	tools?: string[];
}) {
	return {
		'@context': 'https://schema.org',
		'@type': 'HowTo',
		name: params.name,
		description: params.description,
		image: params.image,
		totalTime: params.totalTime || 'PT5M',
		estimatedCost: {
			'@type': 'MonetaryAmount',
			currency: 'USD',
			value: '0'
		},
		tool:
			params.tools?.map((toolName) => ({
				'@type': 'HowToTool',
				name: toolName
			})) || [],
		step: params.steps.map((step, index) => ({
			'@type': 'HowToStep',
			position: index + 1,
			name: step.name,
			text: step.text,
			url: `${params.canonical}#step-${index + 1}`,
			image: params.image
		}))
	};
}
