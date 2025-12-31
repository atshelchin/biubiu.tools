/**
 * Identity (Decentralized Identity) Category Guide Data
 * Long-form educational article covering decentralized identity systems
 *
 * Content philosophy:
 * - Focus on understanding self-sovereign identity principles
 * - Include real examples of identity solutions and use cases
 * - Emphasize practical applications (login, airdrops, governance)
 * - Progressive learning from basics to advanced privacy concepts
 */
import type { CategoryGuide } from '../../types';

export const identityGuide: CategoryGuide = {
	categoryId: 'identity',
	i18nKeyPrefix: 'routes/apps/chain-tools/identity/guide',
	estimatedReadTime: '18 min',

	sections: [
		// Part 1: Understanding Decentralized Identity
		{
			id: 'intro',
			titleKey: 'routes/apps/chain-tools/identity/guide.sections.intro.title',
			contentKey: 'routes/apps/chain-tools/identity/guide.sections.intro.content',
			toolMentions: [
				{ toolId: 'ens', context: 'human-readable addresses' },
				{ toolId: 'gitcoin-passport', context: 'identity verification' }
			]
		},
		{
			id: 'why-decentralized-identity',
			titleKey: 'routes/apps/chain-tools/identity/guide.sections.why_decentralized_identity.title',
			contentKey:
				'routes/apps/chain-tools/identity/guide.sections.why_decentralized_identity.content',
			subsections: [
				{
					id: 'ownership',
					titleKey:
						'routes/apps/chain-tools/identity/guide.sections.why_decentralized_identity.ownership.title',
					contentKey:
						'routes/apps/chain-tools/identity/guide.sections.why_decentralized_identity.ownership.content'
				},
				{
					id: 'portability',
					titleKey:
						'routes/apps/chain-tools/identity/guide.sections.why_decentralized_identity.portability.title',
					contentKey:
						'routes/apps/chain-tools/identity/guide.sections.why_decentralized_identity.portability.content'
				}
			]
		},

		// Part 2: Naming Services
		{
			id: 'naming-services',
			titleKey: 'routes/apps/chain-tools/identity/guide.sections.naming_services.title',
			contentKey: 'routes/apps/chain-tools/identity/guide.sections.naming_services.content',
			subsections: [
				{
					id: 'ens',
					titleKey: 'routes/apps/chain-tools/identity/guide.sections.naming_services.ens.title',
					contentKey: 'routes/apps/chain-tools/identity/guide.sections.naming_services.ens.content',
					toolMentions: [{ toolId: 'ens', context: 'Ethereum name service' }]
				},
				{
					id: 'multi-chain',
					titleKey:
						'routes/apps/chain-tools/identity/guide.sections.naming_services.multi_chain.title',
					contentKey:
						'routes/apps/chain-tools/identity/guide.sections.naming_services.multi_chain.content',
					toolMentions: [
						{ toolId: 'unstoppable-domains', context: 'cross-chain domains' },
						{ toolId: 'space-id', context: 'multi-chain naming' },
						{ toolId: 'bns', context: 'Base naming' }
					]
				},
				{
					id: 'lens-handles',
					titleKey:
						'routes/apps/chain-tools/identity/guide.sections.naming_services.lens_handles.title',
					contentKey:
						'routes/apps/chain-tools/identity/guide.sections.naming_services.lens_handles.content'
				}
			]
		},

		// Part 3: Credentials & Attestations
		{
			id: 'credentials-attestations',
			titleKey: 'routes/apps/chain-tools/identity/guide.sections.credentials_attestations.title',
			contentKey:
				'routes/apps/chain-tools/identity/guide.sections.credentials_attestations.content',
			subsections: [
				{
					id: 'proof-of-humanity',
					titleKey:
						'routes/apps/chain-tools/identity/guide.sections.credentials_attestations.proof_of_humanity.title',
					contentKey:
						'routes/apps/chain-tools/identity/guide.sections.credentials_attestations.proof_of_humanity.content',
					toolMentions: [
						{ toolId: 'worldcoin', context: 'biometric verification' },
						{ toolId: 'gitcoin-passport', context: 'social verification' },
						{ toolId: 'brightid', context: 'social graph verification' }
					]
				},
				{
					id: 'attestation-systems',
					titleKey:
						'routes/apps/chain-tools/identity/guide.sections.credentials_attestations.attestation_systems.title',
					contentKey:
						'routes/apps/chain-tools/identity/guide.sections.credentials_attestations.attestation_systems.content',
					toolMentions: [
						{ toolId: 'eas', context: 'Ethereum Attestation Service' },
						{ toolId: 'verax', context: 'Linea attestations' }
					]
				},
				{
					id: 'verifiable-credentials',
					titleKey:
						'routes/apps/chain-tools/identity/guide.sections.credentials_attestations.verifiable_credentials.title',
					contentKey:
						'routes/apps/chain-tools/identity/guide.sections.credentials_attestations.verifiable_credentials.content',
					toolMentions: [
						{ toolId: 'disco', context: 'data backpack' },
						{ toolId: 'civic', context: 'KYC credentials' }
					]
				}
			]
		},

		// Part 4: Reputation Systems
		{
			id: 'reputation-systems',
			titleKey: 'routes/apps/chain-tools/identity/guide.sections.reputation_systems.title',
			contentKey: 'routes/apps/chain-tools/identity/guide.sections.reputation_systems.content',
			subsections: [
				{
					id: 'on-chain-reputation',
					titleKey:
						'routes/apps/chain-tools/identity/guide.sections.reputation_systems.on_chain_reputation.title',
					contentKey:
						'routes/apps/chain-tools/identity/guide.sections.reputation_systems.on_chain_reputation.content',
					toolMentions: [
						{ toolId: 'degenscore', context: 'DeFi activity score' },
						{ toolId: 'nomis', context: 'multi-chain reputation' },
						{ toolId: 'talent-protocol', context: 'builder reputation' }
					]
				},
				{
					id: 'poaps-badges',
					titleKey:
						'routes/apps/chain-tools/identity/guide.sections.reputation_systems.poaps_badges.title',
					contentKey:
						'routes/apps/chain-tools/identity/guide.sections.reputation_systems.poaps_badges.content',
					toolMentions: [
						{ toolId: 'poap', context: 'proof of attendance' },
						{ toolId: 'galxe', context: 'credentials platform' },
						{ toolId: 'layer3', context: 'quest platform' }
					]
				},
				{
					id: 'soulbound-tokens',
					titleKey:
						'routes/apps/chain-tools/identity/guide.sections.reputation_systems.soulbound_tokens.title',
					contentKey:
						'routes/apps/chain-tools/identity/guide.sections.reputation_systems.soulbound_tokens.content',
					toolMentions: [{ toolId: 'otterspace', context: 'non-transferable badges' }]
				}
			]
		},

		// Part 5: Privacy-Preserving Identity
		{
			id: 'privacy-preserving-identity',
			titleKey: 'routes/apps/chain-tools/identity/guide.sections.privacy_preserving_identity.title',
			contentKey:
				'routes/apps/chain-tools/identity/guide.sections.privacy_preserving_identity.content',
			subsections: [
				{
					id: 'zk-identity',
					titleKey:
						'routes/apps/chain-tools/identity/guide.sections.privacy_preserving_identity.zk_identity.title',
					contentKey:
						'routes/apps/chain-tools/identity/guide.sections.privacy_preserving_identity.zk_identity.content',
					toolMentions: [
						{ toolId: 'polygon-id', context: 'ZK-based identity' },
						{ toolId: 'privado-id', context: 'self-sovereign identity' },
						{ toolId: 'zkpass', context: 'ZK verification' }
					]
				},
				{
					id: 'selective-disclosure',
					titleKey:
						'routes/apps/chain-tools/identity/guide.sections.privacy_preserving_identity.selective_disclosure.title',
					contentKey:
						'routes/apps/chain-tools/identity/guide.sections.privacy_preserving_identity.selective_disclosure.content',
					toolMentions: [
						{ toolId: 'sismo-protocol', context: 'ZK badges' },
						{ toolId: 'holonym', context: 'privacy-first verification' }
					]
				},
				{
					id: 'zk-kyc',
					titleKey:
						'routes/apps/chain-tools/identity/guide.sections.privacy_preserving_identity.zk_kyc.title',
					contentKey:
						'routes/apps/chain-tools/identity/guide.sections.privacy_preserving_identity.zk_kyc.content'
				}
			]
		},

		// Part 6: Identity Aggregation
		{
			id: 'identity-aggregation',
			titleKey: 'routes/apps/chain-tools/identity/guide.sections.identity_aggregation.title',
			contentKey: 'routes/apps/chain-tools/identity/guide.sections.identity_aggregation.content',
			subsections: [
				{
					id: 'linking-identities',
					titleKey:
						'routes/apps/chain-tools/identity/guide.sections.identity_aggregation.linking_identities.title',
					contentKey:
						'routes/apps/chain-tools/identity/guide.sections.identity_aggregation.linking_identities.content',
					toolMentions: [{ toolId: 'clique-protocol', context: 'identity oracle' }]
				},
				{
					id: 'cross-chain',
					titleKey:
						'routes/apps/chain-tools/identity/guide.sections.identity_aggregation.cross_chain.title',
					contentKey:
						'routes/apps/chain-tools/identity/guide.sections.identity_aggregation.cross_chain.content',
					toolMentions: [{ toolId: 'rarimo', context: 'cross-chain identity' }]
				}
			]
		},

		// Part 7: Use Cases
		{
			id: 'use-cases',
			titleKey: 'routes/apps/chain-tools/identity/guide.sections.use_cases.title',
			contentKey: 'routes/apps/chain-tools/identity/guide.sections.use_cases.content',
			subsections: [
				{
					id: 'web3-login',
					titleKey: 'routes/apps/chain-tools/identity/guide.sections.use_cases.web3_login.title',
					contentKey:
						'routes/apps/chain-tools/identity/guide.sections.use_cases.web3_login.content',
					toolMentions: [{ toolId: 'spruce-id', context: 'Sign-In with Ethereum' }]
				},
				{
					id: 'airdrops',
					titleKey: 'routes/apps/chain-tools/identity/guide.sections.use_cases.airdrops.title',
					contentKey: 'routes/apps/chain-tools/identity/guide.sections.use_cases.airdrops.content',
					toolMentions: [
						{ toolId: 'gitcoin-passport', context: 'Sybil resistance' },
						{ toolId: 'galxe-passport', context: 'identity verification' }
					]
				},
				{
					id: 'governance',
					titleKey: 'routes/apps/chain-tools/identity/guide.sections.use_cases.governance.title',
					contentKey:
						'routes/apps/chain-tools/identity/guide.sections.use_cases.governance.content',
					toolMentions: [{ toolId: 'guild-xyz', context: 'token-gated access' }]
				},
				{
					id: 'social-networks',
					titleKey:
						'routes/apps/chain-tools/identity/guide.sections.use_cases.social_networks.title',
					contentKey:
						'routes/apps/chain-tools/identity/guide.sections.use_cases.social_networks.content'
				}
			]
		}
	],

	// Glossary for quick reference
	glossary: [
		{
			id: 'ens',
			termKey: 'routes/apps/chain-tools/identity/guide.glossary.ens.term',
			definitionKey: 'routes/apps/chain-tools/identity/guide.glossary.ens.definition',
			relatedToolIds: ['ens']
		},
		{
			id: 'did',
			termKey: 'routes/apps/chain-tools/identity/guide.glossary.did.term',
			definitionKey: 'routes/apps/chain-tools/identity/guide.glossary.did.definition',
			relatedToolIds: ['polygon-id', 'privado-id']
		},
		{
			id: 'soulbound-token',
			termKey: 'routes/apps/chain-tools/identity/guide.glossary.soulbound_token.term',
			definitionKey: 'routes/apps/chain-tools/identity/guide.glossary.soulbound_token.definition',
			relatedToolIds: ['otterspace', 'masa-protocol']
		},
		{
			id: 'attestation',
			termKey: 'routes/apps/chain-tools/identity/guide.glossary.attestation.term',
			definitionKey: 'routes/apps/chain-tools/identity/guide.glossary.attestation.definition',
			relatedToolIds: ['eas', 'verax', 'sismo-protocol']
		},
		{
			id: 'credential',
			termKey: 'routes/apps/chain-tools/identity/guide.glossary.credential.term',
			definitionKey: 'routes/apps/chain-tools/identity/guide.glossary.credential.definition',
			relatedToolIds: ['disco', 'civic', 'polygon-id']
		},
		{
			id: 'reputation-score',
			termKey: 'routes/apps/chain-tools/identity/guide.glossary.reputation_score.term',
			definitionKey: 'routes/apps/chain-tools/identity/guide.glossary.reputation_score.definition',
			relatedToolIds: ['degenscore', 'nomis', 'talent-protocol']
		},
		{
			id: 'poap',
			termKey: 'routes/apps/chain-tools/identity/guide.glossary.poap.term',
			definitionKey: 'routes/apps/chain-tools/identity/guide.glossary.poap.definition',
			relatedToolIds: ['poap']
		},
		{
			id: 'proof-of-humanity',
			termKey: 'routes/apps/chain-tools/identity/guide.glossary.proof_of_humanity.term',
			definitionKey: 'routes/apps/chain-tools/identity/guide.glossary.proof_of_humanity.definition',
			relatedToolIds: ['worldcoin', 'brightid', 'humanity-protocol']
		},
		{
			id: 'kyc',
			termKey: 'routes/apps/chain-tools/identity/guide.glossary.kyc.term',
			definitionKey: 'routes/apps/chain-tools/identity/guide.glossary.kyc.definition',
			relatedToolIds: ['civic', 'holonym']
		},
		{
			id: 'self-sovereign-identity',
			termKey: 'routes/apps/chain-tools/identity/guide.glossary.self_sovereign_identity.term',
			definitionKey:
				'routes/apps/chain-tools/identity/guide.glossary.self_sovereign_identity.definition',
			relatedToolIds: ['privado-id', 'polygon-id', 'spruce-id']
		}
	],

	// Featured tools shown in sidebar/footer
	featuredToolIds: [
		'ens',
		'gitcoin-passport',
		'worldcoin',
		'eas',
		'poap',
		'polygon-id',
		'galxe',
		'degenscore'
	],

	lastUpdated: '2025-12-31'
};
