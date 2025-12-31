/**
 * Jobs Category Guide Data
 * Complete Web3 career and recruitment guide for job seekers and recruiters
 *
 * Content philosophy:
 * - Serve both job seekers and recruiters
 * - Cover technical and non-technical roles
 * - Focus on Web3-specific career aspects (tokens, remote, DAO)
 * - Practical advice for skills, job search, and hiring
 * - Address the unique Web3 job market dynamics
 */
import type { CategoryGuide } from '../../types';

export const jobsGuide: CategoryGuide = {
	categoryId: 'jobs',
	i18nKeyPrefix: 'routes/apps/chain-tools/jobs/guide',
	estimatedReadTime: '20 min',

	sections: [
		// Part 1: Introduction to Web3 Careers
		{
			id: 'intro',
			titleKey: 'routes/apps/chain-tools/jobs/guide.sections.intro.title',
			contentKey: 'routes/apps/chain-tools/jobs/guide.sections.intro.content',
			toolMentions: [
				{ toolId: 'crypto-jobs', context: 'largest Web3 job board' },
				{ toolId: 'web3-career', context: 'curated opportunities' }
			]
		},

		// Part 2: Job Categories in Web3
		{
			id: 'job-categories',
			titleKey: 'routes/apps/chain-tools/jobs/guide.sections.job_categories.title',
			contentKey: 'routes/apps/chain-tools/jobs/guide.sections.job_categories.content',
			subsections: [
				{
					id: 'developer-roles',
					titleKey:
						'routes/apps/chain-tools/jobs/guide.sections.job_categories.developer_roles.title',
					contentKey:
						'routes/apps/chain-tools/jobs/guide.sections.job_categories.developer_roles.content'
				},
				{
					id: 'non-dev-roles',
					titleKey:
						'routes/apps/chain-tools/jobs/guide.sections.job_categories.non_dev_roles.title',
					contentKey:
						'routes/apps/chain-tools/jobs/guide.sections.job_categories.non_dev_roles.content'
				}
			]
		},

		// Part 3: Skills in Demand
		{
			id: 'skills',
			titleKey: 'routes/apps/chain-tools/jobs/guide.sections.skills.title',
			contentKey: 'routes/apps/chain-tools/jobs/guide.sections.skills.content',
			subsections: [
				{
					id: 'technical-skills',
					titleKey: 'routes/apps/chain-tools/jobs/guide.sections.skills.technical_skills.title',
					contentKey:
						'routes/apps/chain-tools/jobs/guide.sections.skills.technical_skills.content'
				},
				{
					id: 'soft-skills',
					titleKey: 'routes/apps/chain-tools/jobs/guide.sections.skills.soft_skills.title',
					contentKey: 'routes/apps/chain-tools/jobs/guide.sections.skills.soft_skills.content'
				}
			]
		},

		// Part 4: Finding Jobs in Web3
		{
			id: 'finding-jobs',
			titleKey: 'routes/apps/chain-tools/jobs/guide.sections.finding_jobs.title',
			contentKey: 'routes/apps/chain-tools/jobs/guide.sections.finding_jobs.content',
			subsections: [
				{
					id: 'job-boards',
					titleKey:
						'routes/apps/chain-tools/jobs/guide.sections.finding_jobs.job_boards.title',
					contentKey:
						'routes/apps/chain-tools/jobs/guide.sections.finding_jobs.job_boards.content',
					toolMentions: [
						{ toolId: 'crypto-jobs', context: 'comprehensive listings' },
						{ toolId: 'web3-career', context: 'curated positions' },
						{ toolId: 'angel-list', context: 'startup jobs' }
					]
				},
				{
					id: 'networking',
					titleKey:
						'routes/apps/chain-tools/jobs/guide.sections.finding_jobs.networking.title',
					contentKey:
						'routes/apps/chain-tools/jobs/guide.sections.finding_jobs.networking.content',
					toolMentions: [
						{ toolId: 'linkedin', context: 'professional network' },
						{ toolId: 'twitter', context: 'Web3 community hub' }
					]
				},
				{
					id: 'dao-contributor',
					titleKey:
						'routes/apps/chain-tools/jobs/guide.sections.finding_jobs.dao_contributor.title',
					contentKey:
						'routes/apps/chain-tools/jobs/guide.sections.finding_jobs.dao_contributor.content',
					toolMentions: [
						{ toolId: 'dework', context: 'DAO task management' },
						{ toolId: 'layer3', context: 'quests & bounties' },
						{ toolId: 'gitcoin', context: 'grants & bounties' }
					]
				}
			]
		},

		// Part 5: Building Your Web3 Profile
		{
			id: 'building-profile',
			titleKey: 'routes/apps/chain-tools/jobs/guide.sections.building_profile.title',
			contentKey: 'routes/apps/chain-tools/jobs/guide.sections.building_profile.content',
			subsections: [
				{
					id: 'portfolio',
					titleKey:
						'routes/apps/chain-tools/jobs/guide.sections.building_profile.portfolio.title',
					contentKey:
						'routes/apps/chain-tools/jobs/guide.sections.building_profile.portfolio.content',
					toolMentions: [
						{ toolId: 'github', context: 'showcase code' },
						{ toolId: 'buildspace', context: 'learn & build' }
					]
				},
				{
					id: 'contributions',
					titleKey:
						'routes/apps/chain-tools/jobs/guide.sections.building_profile.contributions.title',
					contentKey:
						'routes/apps/chain-tools/jobs/guide.sections.building_profile.contributions.content'
				},
				{
					id: 'hackathons',
					titleKey:
						'routes/apps/chain-tools/jobs/guide.sections.building_profile.hackathons.title',
					contentKey:
						'routes/apps/chain-tools/jobs/guide.sections.building_profile.hackathons.content'
				}
			]
		},

		// Part 6: Interview Process
		{
			id: 'interview-process',
			titleKey: 'routes/apps/chain-tools/jobs/guide.sections.interview_process.title',
			contentKey: 'routes/apps/chain-tools/jobs/guide.sections.interview_process.content',
			subsections: [
				{
					id: 'technical-interviews',
					titleKey:
						'routes/apps/chain-tools/jobs/guide.sections.interview_process.technical_interviews.title',
					contentKey:
						'routes/apps/chain-tools/jobs/guide.sections.interview_process.technical_interviews.content'
				},
				{
					id: 'culture-fit',
					titleKey:
						'routes/apps/chain-tools/jobs/guide.sections.interview_process.culture_fit.title',
					contentKey:
						'routes/apps/chain-tools/jobs/guide.sections.interview_process.culture_fit.content'
				},
				{
					id: 'compensation',
					titleKey:
						'routes/apps/chain-tools/jobs/guide.sections.interview_process.compensation.title',
					contentKey:
						'routes/apps/chain-tools/jobs/guide.sections.interview_process.compensation.content'
				}
			]
		},

		// Part 7: For Recruiters
		{
			id: 'for-recruiters',
			titleKey: 'routes/apps/chain-tools/jobs/guide.sections.for_recruiters.title',
			contentKey: 'routes/apps/chain-tools/jobs/guide.sections.for_recruiters.content',
			subsections: [
				{
					id: 'finding-talent',
					titleKey:
						'routes/apps/chain-tools/jobs/guide.sections.for_recruiters.finding_talent.title',
					contentKey:
						'routes/apps/chain-tools/jobs/guide.sections.for_recruiters.finding_talent.content',
					toolMentions: [
						{ toolId: 'github', context: 'developer search' },
						{ toolId: 'linkedin', context: 'professional recruiting' }
					]
				},
				{
					id: 'evaluating-candidates',
					titleKey:
						'routes/apps/chain-tools/jobs/guide.sections.for_recruiters.evaluating_candidates.title',
					contentKey:
						'routes/apps/chain-tools/jobs/guide.sections.for_recruiters.evaluating_candidates.content'
				},
				{
					id: 'competitive-offers',
					titleKey:
						'routes/apps/chain-tools/jobs/guide.sections.for_recruiters.competitive_offers.title',
					contentKey:
						'routes/apps/chain-tools/jobs/guide.sections.for_recruiters.competitive_offers.content'
				}
			]
		},

		// Part 8: Remote Work Culture
		{
			id: 'remote-work',
			titleKey: 'routes/apps/chain-tools/jobs/guide.sections.remote_work.title',
			contentKey: 'routes/apps/chain-tools/jobs/guide.sections.remote_work.content',
			subsections: [
				{
					id: 'async-communication',
					titleKey:
						'routes/apps/chain-tools/jobs/guide.sections.remote_work.async_communication.title',
					contentKey:
						'routes/apps/chain-tools/jobs/guide.sections.remote_work.async_communication.content'
				},
				{
					id: 'time-zones',
					titleKey: 'routes/apps/chain-tools/jobs/guide.sections.remote_work.time_zones.title',
					contentKey:
						'routes/apps/chain-tools/jobs/guide.sections.remote_work.time_zones.content'
				},
				{
					id: 'dao-models',
					titleKey: 'routes/apps/chain-tools/jobs/guide.sections.remote_work.dao_models.title',
					contentKey:
						'routes/apps/chain-tools/jobs/guide.sections.remote_work.dao_models.content'
				}
			]
		}
	],

	// Glossary for quick reference
	glossary: [
		{
			id: 'smart-contract-developer',
			termKey: 'routes/apps/chain-tools/jobs/guide.glossary.smart_contract_developer.term',
			definitionKey:
				'routes/apps/chain-tools/jobs/guide.glossary.smart_contract_developer.definition'
		},
		{
			id: 'defi-developer',
			termKey: 'routes/apps/chain-tools/jobs/guide.glossary.defi_developer.term',
			definitionKey: 'routes/apps/chain-tools/jobs/guide.glossary.defi_developer.definition'
		},
		{
			id: 'frontend-developer',
			termKey: 'routes/apps/chain-tools/jobs/guide.glossary.frontend_developer.term',
			definitionKey: 'routes/apps/chain-tools/jobs/guide.glossary.frontend_developer.definition'
		},
		{
			id: 'full-stack',
			termKey: 'routes/apps/chain-tools/jobs/guide.glossary.full_stack.term',
			definitionKey: 'routes/apps/chain-tools/jobs/guide.glossary.full_stack.definition'
		},
		{
			id: 'devrel',
			termKey: 'routes/apps/chain-tools/jobs/guide.glossary.devrel.term',
			definitionKey: 'routes/apps/chain-tools/jobs/guide.glossary.devrel.definition'
		},
		{
			id: 'community-manager',
			termKey: 'routes/apps/chain-tools/jobs/guide.glossary.community_manager.term',
			definitionKey: 'routes/apps/chain-tools/jobs/guide.glossary.community_manager.definition'
		},
		{
			id: 'tokenomics',
			termKey: 'routes/apps/chain-tools/jobs/guide.glossary.tokenomics.term',
			definitionKey: 'routes/apps/chain-tools/jobs/guide.glossary.tokenomics.definition'
		},
		{
			id: 'vesting',
			termKey: 'routes/apps/chain-tools/jobs/guide.glossary.vesting.term',
			definitionKey: 'routes/apps/chain-tools/jobs/guide.glossary.vesting.definition'
		},
		{
			id: 'cliff',
			termKey: 'routes/apps/chain-tools/jobs/guide.glossary.cliff.term',
			definitionKey: 'routes/apps/chain-tools/jobs/guide.glossary.cliff.definition'
		},
		{
			id: 'remote-first',
			termKey: 'routes/apps/chain-tools/jobs/guide.glossary.remote_first.term',
			definitionKey: 'routes/apps/chain-tools/jobs/guide.glossary.remote_first.definition'
		},
		{
			id: 'async',
			termKey: 'routes/apps/chain-tools/jobs/guide.glossary.async.term',
			definitionKey: 'routes/apps/chain-tools/jobs/guide.glossary.async.definition'
		},
		{
			id: 'contributor',
			termKey: 'routes/apps/chain-tools/jobs/guide.glossary.contributor.term',
			definitionKey: 'routes/apps/chain-tools/jobs/guide.glossary.contributor.definition'
		},
		{
			id: 'bounty',
			termKey: 'routes/apps/chain-tools/jobs/guide.glossary.bounty.term',
			definitionKey: 'routes/apps/chain-tools/jobs/guide.glossary.bounty.definition',
			relatedToolIds: ['gitcoin', 'dework', 'layer3']
		},
		{
			id: 'hackathon',
			termKey: 'routes/apps/chain-tools/jobs/guide.glossary.hackathon.term',
			definitionKey: 'routes/apps/chain-tools/jobs/guide.glossary.hackathon.definition',
			relatedToolIds: ['buildspace']
		}
	],

	// Featured tools shown in sidebar/footer
	featuredToolIds: [
		'crypto-jobs',
		'web3-career',
		'angel-list',
		'linkedin',
		'gitcoin',
		'dework',
		'layer3',
		'buildspace'
	],

	lastUpdated: '2025-12-31'
};
