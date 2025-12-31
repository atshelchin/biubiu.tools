/**
 * Web3 Teams Category Guide Data
 * Comprehensive guide on networking and building connections in Web3
 *
 * Content philosophy:
 * - Focus on practical, actionable networking strategies
 * - Include real examples and case studies from the Web3 industry
 * - Emphasize genuine relationship building over transactional networking
 * - Progressive approach from making first contact to maintaining long-term relationships
 */
import type { CategoryGuide } from '../../types';

export const web3TeamsGuide: CategoryGuide = {
	categoryId: 'web3-teams',
	i18nKeyPrefix: 'routes/apps/chain-tools/web3-teams/guide',
	estimatedReadTime: '22 min',

	sections: [
		// Part 1: Introduction
		{
			id: 'intro',
			titleKey: 'routes/apps/chain-tools/web3-teams/guide.sections.intro.title',
			contentKey: 'routes/apps/chain-tools/web3-teams/guide.sections.intro.content',
			toolMentions: [
				{ toolId: 'twitter', context: 'primary networking platform' },
				{ toolId: 'telegram', context: 'community communication' }
			]
		},

		// Part 2: Finding Key People
		{
			id: 'finding-people',
			titleKey: 'routes/apps/chain-tools/web3-teams/guide.sections.finding_people.title',
			contentKey: 'routes/apps/chain-tools/web3-teams/guide.sections.finding_people.content',
			subsections: [
				{
					id: 'identifying-targets',
					titleKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.finding_people.identifying_targets.title',
					contentKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.finding_people.identifying_targets.content',
					toolMentions: [{ toolId: 'twitter' }, { toolId: 'linkedin' }]
				},
				{
					id: 'research',
					titleKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.finding_people.research.title',
					contentKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.finding_people.research.content'
				},
				{
					id: 'understanding-interests',
					titleKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.finding_people.understanding_interests.title',
					contentKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.finding_people.understanding_interests.content'
				},
				{
					id: 'twitter-strategies',
					titleKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.finding_people.twitter_strategies.title',
					contentKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.finding_people.twitter_strategies.content',
					toolMentions: [{ toolId: 'twitter' }]
				}
			]
		},

		// Part 3: Making First Contact
		{
			id: 'first-contact',
			titleKey: 'routes/apps/chain-tools/web3-teams/guide.sections.first_contact.title',
			contentKey: 'routes/apps/chain-tools/web3-teams/guide.sections.first_contact.content',
			subsections: [
				{
					id: 'cold-dm-strategies',
					titleKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.first_contact.cold_dm_strategies.title',
					contentKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.first_contact.cold_dm_strategies.content',
					toolMentions: [{ toolId: 'twitter' }, { toolId: 'telegram' }]
				},
				{
					id: 'what-not-to-do',
					titleKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.first_contact.what_not_to_do.title',
					contentKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.first_contact.what_not_to_do.content'
				},
				{
					id: 'value-first',
					titleKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.first_contact.value_first.title',
					contentKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.first_contact.value_first.content'
				},
				{
					id: 'warm-intros',
					titleKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.first_contact.warm_intros.title',
					contentKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.first_contact.warm_intros.content'
				},
				{
					id: 'email-outreach',
					titleKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.first_contact.email_outreach.title',
					contentKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.first_contact.email_outreach.content'
				}
			]
		},

		// Part 4: Building Genuine Relationships
		{
			id: 'building-relationships',
			titleKey: 'routes/apps/chain-tools/web3-teams/guide.sections.building_relationships.title',
			contentKey:
				'routes/apps/chain-tools/web3-teams/guide.sections.building_relationships.content',
			subsections: [
				{
					id: 'connection-to-relationship',
					titleKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.building_relationships.connection_to_relationship.title',
					contentKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.building_relationships.connection_to_relationship.content'
				},
				{
					id: 'following-up',
					titleKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.building_relationships.following_up.title',
					contentKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.building_relationships.following_up.content'
				},
				{
					id: 'offering-help',
					titleKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.building_relationships.offering_help.title',
					contentKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.building_relationships.offering_help.content'
				},
				{
					id: 'long-term-maintenance',
					titleKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.building_relationships.long_term_maintenance.title',
					contentKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.building_relationships.long_term_maintenance.content'
				},
				{
					id: 'reciprocity',
					titleKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.building_relationships.reciprocity.title',
					contentKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.building_relationships.reciprocity.content'
				}
			]
		},

		// Part 5: Networking at Events
		{
			id: 'event-networking',
			titleKey: 'routes/apps/chain-tools/web3-teams/guide.sections.event_networking.title',
			contentKey: 'routes/apps/chain-tools/web3-teams/guide.sections.event_networking.content',
			subsections: [
				{
					id: 'conference-strategies',
					titleKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.event_networking.conference_strategies.title',
					contentKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.event_networking.conference_strategies.content',
					toolMentions: [{ toolId: 'luma' }, { toolId: 'lu-ma' }]
				},
				{
					id: 'hackathon-networking',
					titleKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.event_networking.hackathon_networking.title',
					contentKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.event_networking.hackathon_networking.content',
					toolMentions: [{ toolId: 'ethglobal' }, { toolId: 'devfolio' }]
				},
				{
					id: 'side-events',
					titleKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.event_networking.side_events.title',
					contentKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.event_networking.side_events.content',
					toolMentions: [{ toolId: 'luma' }]
				},
				{
					id: 'virtual-events',
					titleKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.event_networking.virtual_events.title',
					contentKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.event_networking.virtual_events.content',
					toolMentions: [{ toolId: 'twitter' }, { toolId: 'discord' }]
				},
				{
					id: 'post-event-followup',
					titleKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.event_networking.post_event_followup.title',
					contentKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.event_networking.post_event_followup.content'
				}
			]
		},

		// Part 6: Online Presence Building
		{
			id: 'online-presence',
			titleKey: 'routes/apps/chain-tools/web3-teams/guide.sections.online_presence.title',
			contentKey: 'routes/apps/chain-tools/web3-teams/guide.sections.online_presence.content',
			subsections: [
				{
					id: 'building-credibility',
					titleKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.online_presence.building_credibility.title',
					contentKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.online_presence.building_credibility.content',
					toolMentions: [{ toolId: 'twitter' }, { toolId: 'linkedin' }]
				},
				{
					id: 'public-contributions',
					titleKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.online_presence.public_contributions.title',
					contentKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.online_presence.public_contributions.content'
				},
				{
					id: 'thought-leadership',
					titleKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.online_presence.thought_leadership.title',
					contentKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.online_presence.thought_leadership.content',
					toolMentions: [{ toolId: 'twitter' }]
				},
				{
					id: 'being-discoverable',
					titleKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.online_presence.being_discoverable.title',
					contentKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.online_presence.being_discoverable.content'
				}
			]
		},

		// Part 7: Working with VCs and Investors
		{
			id: 'vcs-investors',
			titleKey: 'routes/apps/chain-tools/web3-teams/guide.sections.vcs_investors.title',
			contentKey: 'routes/apps/chain-tools/web3-teams/guide.sections.vcs_investors.content',
			subsections: [
				{
					id: 'how-vcs-evaluate',
					titleKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.vcs_investors.how_vcs_evaluate.title',
					contentKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.vcs_investors.how_vcs_evaluate.content'
				},
				{
					id: 'getting-warm-intros',
					titleKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.vcs_investors.getting_warm_intros.title',
					contentKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.vcs_investors.getting_warm_intros.content'
				},
				{
					id: 'what-investors-look-for',
					titleKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.vcs_investors.what_investors_look_for.title',
					contentKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.vcs_investors.what_investors_look_for.content'
				},
				{
					id: 'building-relationships-before-fundraising',
					titleKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.vcs_investors.building_relationships_before_fundraising.title',
					contentKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.vcs_investors.building_relationships_before_fundraising.content'
				}
			]
		},

		// Part 8: Team Building and Hiring
		{
			id: 'team-building',
			titleKey: 'routes/apps/chain-tools/web3-teams/guide.sections.team_building.title',
			contentKey: 'routes/apps/chain-tools/web3-teams/guide.sections.team_building.content',
			subsections: [
				{
					id: 'finding-cofounders',
					titleKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.team_building.finding_cofounders.title',
					contentKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.team_building.finding_cofounders.content',
					toolMentions: [{ toolId: 'ethglobal' }]
				},
				{
					id: 'hiring-in-web3',
					titleKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.team_building.hiring_in_web3.title',
					contentKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.team_building.hiring_in_web3.content'
				},
				{
					id: 'building-network-for-hiring',
					titleKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.team_building.building_network_for_hiring.title',
					contentKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.team_building.building_network_for_hiring.content'
				},
				{
					id: 'reference-checking',
					titleKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.team_building.reference_checking.title',
					contentKey:
						'routes/apps/chain-tools/web3-teams/guide.sections.team_building.reference_checking.content'
				}
			]
		}
	],

	// Glossary for quick reference
	glossary: [
		{
			id: 'networking',
			termKey: 'routes/apps/chain-tools/web3-teams/guide.glossary.networking.term',
			definitionKey: 'routes/apps/chain-tools/web3-teams/guide.glossary.networking.definition',
			relatedToolIds: ['twitter', 'linkedin', 'telegram']
		},
		{
			id: 'cold-dm',
			termKey: 'routes/apps/chain-tools/web3-teams/guide.glossary.cold_dm.term',
			definitionKey: 'routes/apps/chain-tools/web3-teams/guide.glossary.cold_dm.definition',
			relatedToolIds: ['twitter', 'telegram']
		},
		{
			id: 'warm-intro',
			termKey: 'routes/apps/chain-tools/web3-teams/guide.glossary.warm_intro.term',
			definitionKey: 'routes/apps/chain-tools/web3-teams/guide.glossary.warm_intro.definition'
		},
		{
			id: 'deal-flow',
			termKey: 'routes/apps/chain-tools/web3-teams/guide.glossary.deal_flow.term',
			definitionKey: 'routes/apps/chain-tools/web3-teams/guide.glossary.deal_flow.definition'
		},
		{
			id: 'portfolio-company',
			termKey: 'routes/apps/chain-tools/web3-teams/guide.glossary.portfolio_company.term',
			definitionKey:
				'routes/apps/chain-tools/web3-teams/guide.glossary.portfolio_company.definition'
		},
		{
			id: 'angel-investor',
			termKey: 'routes/apps/chain-tools/web3-teams/guide.glossary.angel_investor.term',
			definitionKey: 'routes/apps/chain-tools/web3-teams/guide.glossary.angel_investor.definition'
		},
		{
			id: 'syndicate',
			termKey: 'routes/apps/chain-tools/web3-teams/guide.glossary.syndicate.term',
			definitionKey: 'routes/apps/chain-tools/web3-teams/guide.glossary.syndicate.definition'
		},
		{
			id: 'founder-market-fit',
			termKey: 'routes/apps/chain-tools/web3-teams/guide.glossary.founder_market_fit.term',
			definitionKey:
				'routes/apps/chain-tools/web3-teams/guide.glossary.founder_market_fit.definition'
		},
		{
			id: 'thought-leadership',
			termKey: 'routes/apps/chain-tools/web3-teams/guide.glossary.thought_leadership.term',
			definitionKey:
				'routes/apps/chain-tools/web3-teams/guide.glossary.thought_leadership.definition',
			relatedToolIds: ['twitter', 'linkedin']
		},
		{
			id: 'personal-brand',
			termKey: 'routes/apps/chain-tools/web3-teams/guide.glossary.personal_brand.term',
			definitionKey: 'routes/apps/chain-tools/web3-teams/guide.glossary.personal_brand.definition',
			relatedToolIds: ['twitter', 'linkedin']
		},
		{
			id: 'community-builder',
			termKey: 'routes/apps/chain-tools/web3-teams/guide.glossary.community_builder.term',
			definitionKey:
				'routes/apps/chain-tools/web3-teams/guide.glossary.community_builder.definition',
			relatedToolIds: ['discord', 'telegram']
		},
		{
			id: 'ecosystem',
			termKey: 'routes/apps/chain-tools/web3-teams/guide.glossary.ecosystem.term',
			definitionKey: 'routes/apps/chain-tools/web3-teams/guide.glossary.ecosystem.definition'
		},
		{
			id: 'builder',
			termKey: 'routes/apps/chain-tools/web3-teams/guide.glossary.builder.term',
			definitionKey: 'routes/apps/chain-tools/web3-teams/guide.glossary.builder.definition',
			relatedToolIds: ['ethglobal', 'devfolio']
		}
	],

	// Featured tools shown in sidebar/footer
	featuredToolIds: [
		'twitter',
		'linkedin',
		'telegram',
		'discord',
		'luma',
		'lu-ma',
		'ethglobal',
		'devfolio'
	],

	lastUpdated: '2025-12-31'
};
