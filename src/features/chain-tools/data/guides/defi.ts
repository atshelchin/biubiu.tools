/**
 * DeFi Category Guide Data
 * Complete learning guide for the DeFi category
 */
import type { CategoryGuide } from '../../types';

export const defiGuide: CategoryGuide = {
	categoryId: 'defi',
	i18nKeyPrefix: 'routes/apps/chain-tools/guide/defi',
	fundamentalsCount: 5,

	// Sub-categories within DeFi
	ecosystemSubCategories: [
		{
			id: 'dex',
			labelKey: 'routes/apps/chain-tools/guide/defi.ecosystem.dex.label',
			descriptionKey: 'routes/apps/chain-tools/guide/defi.ecosystem.dex.description',
			toolIds: ['uniswap', 'curve', 'balancer', 'sushiswap', 'pancakeswap', '1inch', 'paraswap']
		},
		{
			id: 'lending',
			labelKey: 'routes/apps/chain-tools/guide/defi.ecosystem.lending.label',
			descriptionKey: 'routes/apps/chain-tools/guide/defi.ecosystem.lending.description',
			toolIds: ['aave', 'compound', 'morpho', 'euler', 'benqi']
		},
		{
			id: 'stablecoin',
			labelKey: 'routes/apps/chain-tools/guide/defi.ecosystem.stablecoin.label',
			descriptionKey: 'routes/apps/chain-tools/guide/defi.ecosystem.stablecoin.description',
			toolIds: ['makerdao', 'frax', 'liquity', 'usdc', 'usdt']
		},
		{
			id: 'yield',
			labelKey: 'routes/apps/chain-tools/guide/defi.ecosystem.yield.label',
			descriptionKey: 'routes/apps/chain-tools/guide/defi.ecosystem.yield.description',
			toolIds: ['yearn', 'convex', 'pendle', 'beefy']
		},
		{
			id: 'derivatives',
			labelKey: 'routes/apps/chain-tools/guide/defi.ecosystem.derivatives.label',
			descriptionKey: 'routes/apps/chain-tools/guide/defi.ecosystem.derivatives.description',
			toolIds: ['gmx', 'dydx', 'synthetix', 'gains-network']
		},
		{
			id: 'aggregator',
			labelKey: 'routes/apps/chain-tools/guide/defi.ecosystem.aggregator.label',
			descriptionKey: 'routes/apps/chain-tools/guide/defi.ecosystem.aggregator.description',
			toolIds: ['1inch', 'paraswap', 'cowswap', 'zapper', 'defillama']
		}
	],

	// Core projects that users must know
	coreProjects: [
		// Tier 1: Must Know
		{
			toolId: 'uniswap',
			significanceKey: 'routes/apps/chain-tools/guide/defi.core.uniswap',
			tier: 1
		},
		{
			toolId: 'aave',
			significanceKey: 'routes/apps/chain-tools/guide/defi.core.aave',
			tier: 1
		},
		{
			toolId: 'makerdao',
			significanceKey: 'routes/apps/chain-tools/guide/defi.core.makerdao',
			tier: 1
		},
		{
			toolId: 'curve',
			significanceKey: 'routes/apps/chain-tools/guide/defi.core.curve',
			tier: 1
		},
		// Tier 2: Should Know
		{
			toolId: 'compound',
			significanceKey: 'routes/apps/chain-tools/guide/defi.core.compound',
			tier: 2
		},
		{
			toolId: 'yearn',
			significanceKey: 'routes/apps/chain-tools/guide/defi.core.yearn',
			tier: 2
		},
		{
			toolId: '1inch',
			significanceKey: 'routes/apps/chain-tools/guide/defi.core.1inch',
			tier: 2
		},
		{
			toolId: 'gmx',
			significanceKey: 'routes/apps/chain-tools/guide/defi.core.gmx',
			tier: 2
		},
		// Tier 3: Nice to Know
		{
			toolId: 'convex',
			significanceKey: 'routes/apps/chain-tools/guide/defi.core.convex',
			tier: 3
		},
		{
			toolId: 'pendle',
			significanceKey: 'routes/apps/chain-tools/guide/defi.core.pendle',
			tier: 3
		}
	],

	// Learning path with phases
	learningPath: [
		{
			id: 'phase-1',
			titleKey: 'routes/apps/chain-tools/guide/defi.learning.phase1.title',
			descriptionKey: 'routes/apps/chain-tools/guide/defi.learning.phase1.description',
			estimatedDays: '3-5',
			tasks: [
				{
					id: 'task-1-1',
					actionKey: 'routes/apps/chain-tools/guide/defi.learning.phase1.task1',
					type: 'read'
				},
				{
					id: 'task-1-2',
					actionKey: 'routes/apps/chain-tools/guide/defi.learning.phase1.task2',
					type: 'read'
				},
				{
					id: 'task-1-3',
					actionKey: 'routes/apps/chain-tools/guide/defi.learning.phase1.task3',
					type: 'practice',
					toolId: 'uniswap'
				},
				{
					id: 'task-1-4',
					actionKey: 'routes/apps/chain-tools/guide/defi.learning.phase1.task4',
					type: 'research',
					toolId: 'uniswap'
				},
				{
					id: 'task-1-5',
					actionKey: 'routes/apps/chain-tools/guide/defi.learning.phase1.task5',
					type: 'research',
					toolId: 'aave'
				},
				{
					id: 'task-1-6',
					actionKey: 'routes/apps/chain-tools/guide/defi.learning.phase1.task6',
					type: 'quiz'
				}
			],
			coreToolIds: ['uniswap', 'aave', 'usdc']
		},
		{
			id: 'phase-2',
			titleKey: 'routes/apps/chain-tools/guide/defi.learning.phase2.title',
			descriptionKey: 'routes/apps/chain-tools/guide/defi.learning.phase2.description',
			estimatedDays: '7-10',
			tasks: [
				{
					id: 'task-2-1',
					actionKey: 'routes/apps/chain-tools/guide/defi.learning.phase2.task1',
					type: 'research',
					toolId: 'uniswap'
				},
				{
					id: 'task-2-2',
					actionKey: 'routes/apps/chain-tools/guide/defi.learning.phase2.task2',
					type: 'research',
					toolId: 'curve'
				},
				{
					id: 'task-2-3',
					actionKey: 'routes/apps/chain-tools/guide/defi.learning.phase2.task3',
					type: 'research',
					toolId: '1inch'
				},
				{
					id: 'task-2-4',
					actionKey: 'routes/apps/chain-tools/guide/defi.learning.phase2.task4',
					type: 'research',
					toolId: 'compound'
				},
				{
					id: 'task-2-5',
					actionKey: 'routes/apps/chain-tools/guide/defi.learning.phase2.task5',
					type: 'read'
				},
				{
					id: 'task-2-6',
					actionKey: 'routes/apps/chain-tools/guide/defi.learning.phase2.task6',
					type: 'research',
					toolId: 'makerdao'
				},
				{
					id: 'task-2-7',
					actionKey: 'routes/apps/chain-tools/guide/defi.learning.phase2.task7',
					type: 'quiz'
				}
			],
			coreToolIds: ['curve', '1inch', 'compound', 'makerdao', 'dydx']
		},
		{
			id: 'phase-3',
			titleKey: 'routes/apps/chain-tools/guide/defi.learning.phase3.title',
			descriptionKey: 'routes/apps/chain-tools/guide/defi.learning.phase3.description',
			estimatedDays: '5-7',
			tasks: [
				{
					id: 'task-3-1',
					actionKey: 'routes/apps/chain-tools/guide/defi.learning.phase3.task1',
					type: 'research',
					toolId: 'yearn'
				},
				{
					id: 'task-3-2',
					actionKey: 'routes/apps/chain-tools/guide/defi.learning.phase3.task2',
					type: 'research',
					toolId: 'convex'
				},
				{
					id: 'task-3-3',
					actionKey: 'routes/apps/chain-tools/guide/defi.learning.phase3.task3',
					type: 'research',
					toolId: 'gmx'
				},
				{
					id: 'task-3-4',
					actionKey: 'routes/apps/chain-tools/guide/defi.learning.phase3.task4',
					type: 'read'
				},
				{
					id: 'task-3-5',
					actionKey: 'routes/apps/chain-tools/guide/defi.learning.phase3.task5',
					type: 'read'
				}
			],
			coreToolIds: ['yearn', 'convex', 'gmx', 'dydx']
		},
		{
			id: 'phase-4',
			titleKey: 'routes/apps/chain-tools/guide/defi.learning.phase4.title',
			descriptionKey: 'routes/apps/chain-tools/guide/defi.learning.phase4.description',
			estimatedDays: 'Ongoing',
			tasks: [
				{
					id: 'task-4-1',
					actionKey: 'routes/apps/chain-tools/guide/defi.learning.phase4.task1',
					type: 'research'
				},
				{
					id: 'task-4-2',
					actionKey: 'routes/apps/chain-tools/guide/defi.learning.phase4.task2',
					type: 'practice'
				},
				{
					id: 'task-4-3',
					actionKey: 'routes/apps/chain-tools/guide/defi.learning.phase4.task3',
					type: 'quiz'
				}
			],
			coreToolIds: []
		}
	],

	// Glossary terms
	glossary: [
		{
			id: 'amm',
			termKey: 'routes/apps/chain-tools/guide/defi.glossary.amm.term',
			definitionKey: 'routes/apps/chain-tools/guide/defi.glossary.amm.definition',
			relatedToolIds: ['uniswap', 'curve', 'balancer'],
			relatedTermIds: ['liquidity-pool', 'slippage']
		},
		{
			id: 'tvl',
			termKey: 'routes/apps/chain-tools/guide/defi.glossary.tvl.term',
			definitionKey: 'routes/apps/chain-tools/guide/defi.glossary.tvl.definition',
			relatedToolIds: ['defillama']
		},
		{
			id: 'liquidity-pool',
			termKey: 'routes/apps/chain-tools/guide/defi.glossary.liquidity_pool.term',
			definitionKey: 'routes/apps/chain-tools/guide/defi.glossary.liquidity_pool.definition',
			relatedToolIds: ['uniswap', 'curve'],
			relatedTermIds: ['amm', 'impermanent-loss']
		},
		{
			id: 'impermanent-loss',
			termKey: 'routes/apps/chain-tools/guide/defi.glossary.impermanent_loss.term',
			definitionKey: 'routes/apps/chain-tools/guide/defi.glossary.impermanent_loss.definition',
			relatedToolIds: ['uniswap'],
			relatedTermIds: ['liquidity-pool', 'amm']
		},
		{
			id: 'flash-loan',
			termKey: 'routes/apps/chain-tools/guide/defi.glossary.flash_loan.term',
			definitionKey: 'routes/apps/chain-tools/guide/defi.glossary.flash_loan.definition',
			relatedToolIds: ['aave', 'dydx']
		},
		{
			id: 'collateral',
			termKey: 'routes/apps/chain-tools/guide/defi.glossary.collateral.term',
			definitionKey: 'routes/apps/chain-tools/guide/defi.glossary.collateral.definition',
			relatedToolIds: ['aave', 'compound', 'makerdao']
		},
		{
			id: 'liquidation',
			termKey: 'routes/apps/chain-tools/guide/defi.glossary.liquidation.term',
			definitionKey: 'routes/apps/chain-tools/guide/defi.glossary.liquidation.definition',
			relatedToolIds: ['aave', 'compound', 'makerdao'],
			relatedTermIds: ['collateral', 'health-factor']
		},
		{
			id: 'health-factor',
			termKey: 'routes/apps/chain-tools/guide/defi.glossary.health_factor.term',
			definitionKey: 'routes/apps/chain-tools/guide/defi.glossary.health_factor.definition',
			relatedToolIds: ['aave'],
			relatedTermIds: ['liquidation', 'collateral']
		},
		{
			id: 'apy',
			termKey: 'routes/apps/chain-tools/guide/defi.glossary.apy.term',
			definitionKey: 'routes/apps/chain-tools/guide/defi.glossary.apy.definition',
			relatedTermIds: ['apr']
		},
		{
			id: 'apr',
			termKey: 'routes/apps/chain-tools/guide/defi.glossary.apr.term',
			definitionKey: 'routes/apps/chain-tools/guide/defi.glossary.apr.definition',
			relatedTermIds: ['apy']
		},
		{
			id: 'slippage',
			termKey: 'routes/apps/chain-tools/guide/defi.glossary.slippage.term',
			definitionKey: 'routes/apps/chain-tools/guide/defi.glossary.slippage.definition',
			relatedToolIds: ['uniswap', '1inch'],
			relatedTermIds: ['amm']
		},
		{
			id: 'yield-farming',
			termKey: 'routes/apps/chain-tools/guide/defi.glossary.yield_farming.term',
			definitionKey: 'routes/apps/chain-tools/guide/defi.glossary.yield_farming.definition',
			relatedToolIds: ['yearn', 'convex'],
			relatedTermIds: ['apy', 'liquidity-pool']
		},
		{
			id: 'governance-token',
			termKey: 'routes/apps/chain-tools/guide/defi.glossary.governance_token.term',
			definitionKey: 'routes/apps/chain-tools/guide/defi.glossary.governance_token.definition',
			relatedToolIds: ['uniswap', 'aave', 'compound']
		},
		{
			id: 'cdp',
			termKey: 'routes/apps/chain-tools/guide/defi.glossary.cdp.term',
			definitionKey: 'routes/apps/chain-tools/guide/defi.glossary.cdp.definition',
			relatedToolIds: ['makerdao'],
			relatedTermIds: ['collateral']
		},
		{
			id: 'oracle',
			termKey: 'routes/apps/chain-tools/guide/defi.glossary.oracle.term',
			definitionKey: 'routes/apps/chain-tools/guide/defi.glossary.oracle.definition',
			relatedToolIds: ['chainlink']
		}
	],

	// Tool relations for ecosystem graph
	relations: [
		// Fork relations
		{ sourceId: 'uniswap', targetId: 'sushiswap', type: 'fork' },
		{ sourceId: 'compound', targetId: 'benqi', type: 'fork' },
		// Competition
		{ sourceId: 'aave', targetId: 'compound', type: 'competitor' },
		{ sourceId: 'uniswap', targetId: 'curve', type: 'competitor' },
		{ sourceId: 'gmx', targetId: 'dydx', type: 'competitor' },
		// Dependencies
		{ sourceId: 'yearn', targetId: 'curve', type: 'depends_on' },
		{ sourceId: 'convex', targetId: 'curve', type: 'built_on' },
		{ sourceId: 'aave', targetId: 'chainlink', type: 'depends_on' },
		{ sourceId: 'makerdao', targetId: 'chainlink', type: 'depends_on' },
		// Integrations
		{ sourceId: '1inch', targetId: 'uniswap', type: 'integrates' },
		{ sourceId: '1inch', targetId: 'curve', type: 'integrates' },
		{ sourceId: '1inch', targetId: 'sushiswap', type: 'integrates' }
	],

	// Quiz questions
	quiz: {
		categoryId: 'defi',
		questions: [
			// Beginner questions
			{
				id: 'q1',
				type: 'single_choice',
				difficulty: 'beginner',
				questionKey: 'routes/apps/chain-tools/guide/defi.quiz.q1.question',
				optionKeys: [
					'routes/apps/chain-tools/guide/defi.quiz.q1.option1',
					'routes/apps/chain-tools/guide/defi.quiz.q1.option2',
					'routes/apps/chain-tools/guide/defi.quiz.q1.option3',
					'routes/apps/chain-tools/guide/defi.quiz.q1.option4'
				],
				correctAnswers: [0],
				explanationKey: 'routes/apps/chain-tools/guide/defi.quiz.q1.explanation',
				relatedToolIds: ['uniswap', 'curve'],
				tags: ['dex', 'amm', 'basics']
			},
			{
				id: 'q2',
				type: 'single_choice',
				difficulty: 'beginner',
				questionKey: 'routes/apps/chain-tools/guide/defi.quiz.q2.question',
				optionKeys: [
					'routes/apps/chain-tools/guide/defi.quiz.q2.option1',
					'routes/apps/chain-tools/guide/defi.quiz.q2.option2',
					'routes/apps/chain-tools/guide/defi.quiz.q2.option3',
					'routes/apps/chain-tools/guide/defi.quiz.q2.option4'
				],
				correctAnswers: [1],
				explanationKey: 'routes/apps/chain-tools/guide/defi.quiz.q2.explanation',
				relatedToolIds: ['defillama'],
				tags: ['metrics', 'basics']
			},
			{
				id: 'q3',
				type: 'true_false',
				difficulty: 'beginner',
				questionKey: 'routes/apps/chain-tools/guide/defi.quiz.q3.question',
				optionKeys: [
					'routes/apps/chain-tools/guide/defi.quiz.q3.option1',
					'routes/apps/chain-tools/guide/defi.quiz.q3.option2'
				],
				correctAnswers: [0],
				explanationKey: 'routes/apps/chain-tools/guide/defi.quiz.q3.explanation',
				relatedToolIds: ['aave'],
				tags: ['lending', 'flash-loan']
			},
			// Intermediate questions
			{
				id: 'q4',
				type: 'single_choice',
				difficulty: 'intermediate',
				questionKey: 'routes/apps/chain-tools/guide/defi.quiz.q4.question',
				optionKeys: [
					'routes/apps/chain-tools/guide/defi.quiz.q4.option1',
					'routes/apps/chain-tools/guide/defi.quiz.q4.option2',
					'routes/apps/chain-tools/guide/defi.quiz.q4.option3',
					'routes/apps/chain-tools/guide/defi.quiz.q4.option4'
				],
				correctAnswers: [2],
				explanationKey: 'routes/apps/chain-tools/guide/defi.quiz.q4.explanation',
				relatedToolIds: ['curve'],
				tags: ['dex', 'stablecoin', 'curve']
			},
			{
				id: 'q5',
				type: 'single_choice',
				difficulty: 'intermediate',
				questionKey: 'routes/apps/chain-tools/guide/defi.quiz.q5.question',
				optionKeys: [
					'routes/apps/chain-tools/guide/defi.quiz.q5.option1',
					'routes/apps/chain-tools/guide/defi.quiz.q5.option2',
					'routes/apps/chain-tools/guide/defi.quiz.q5.option3',
					'routes/apps/chain-tools/guide/defi.quiz.q5.option4'
				],
				correctAnswers: [1],
				explanationKey: 'routes/apps/chain-tools/guide/defi.quiz.q5.explanation',
				relatedToolIds: ['uniswap'],
				tags: ['dex', 'uniswap', 'v3']
			},
			{
				id: 'q6',
				type: 'multiple_choice',
				difficulty: 'intermediate',
				questionKey: 'routes/apps/chain-tools/guide/defi.quiz.q6.question',
				optionKeys: [
					'routes/apps/chain-tools/guide/defi.quiz.q6.option1',
					'routes/apps/chain-tools/guide/defi.quiz.q6.option2',
					'routes/apps/chain-tools/guide/defi.quiz.q6.option3',
					'routes/apps/chain-tools/guide/defi.quiz.q6.option4'
				],
				correctAnswers: [0, 2, 3],
				explanationKey: 'routes/apps/chain-tools/guide/defi.quiz.q6.explanation',
				relatedToolIds: ['usdc', 'makerdao', 'frax'],
				tags: ['stablecoin']
			},
			// Expert questions
			{
				id: 'q7',
				type: 'single_choice',
				difficulty: 'expert',
				questionKey: 'routes/apps/chain-tools/guide/defi.quiz.q7.question',
				optionKeys: [
					'routes/apps/chain-tools/guide/defi.quiz.q7.option1',
					'routes/apps/chain-tools/guide/defi.quiz.q7.option2',
					'routes/apps/chain-tools/guide/defi.quiz.q7.option3',
					'routes/apps/chain-tools/guide/defi.quiz.q7.option4'
				],
				correctAnswers: [2],
				explanationKey: 'routes/apps/chain-tools/guide/defi.quiz.q7.explanation',
				relatedToolIds: ['convex', 'curve'],
				tags: ['yield', 'curve-wars']
			},
			{
				id: 'q8',
				type: 'single_choice',
				difficulty: 'expert',
				questionKey: 'routes/apps/chain-tools/guide/defi.quiz.q8.question',
				optionKeys: [
					'routes/apps/chain-tools/guide/defi.quiz.q8.option1',
					'routes/apps/chain-tools/guide/defi.quiz.q8.option2',
					'routes/apps/chain-tools/guide/defi.quiz.q8.option3',
					'routes/apps/chain-tools/guide/defi.quiz.q8.option4'
				],
				correctAnswers: [0],
				explanationKey: 'routes/apps/chain-tools/guide/defi.quiz.q8.explanation',
				relatedToolIds: ['uniswap'],
				tags: ['amm', 'math', 'impermanent-loss']
			}
		],
		achievements: [
			{
				minScore: 0.9,
				titleKey: 'routes/apps/chain-tools/guide/defi.quiz.achievement.master',
				badge: '🏆'
			},
			{
				minScore: 0.7,
				titleKey: 'routes/apps/chain-tools/guide/defi.quiz.achievement.advanced',
				badge: '⭐'
			},
			{
				minScore: 0.5,
				titleKey: 'routes/apps/chain-tools/guide/defi.quiz.achievement.intermediate',
				badge: '📚'
			},
			{
				minScore: 0,
				titleKey: 'routes/apps/chain-tools/guide/defi.quiz.achievement.beginner',
				badge: '🌱'
			}
		]
	},

	lastUpdated: '2024-12-31'
};
