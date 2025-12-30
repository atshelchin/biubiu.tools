/**
 * Identity Tools - DID, credentials, and reputation systems
 */
import { Globe, BadgeCheck, Trophy, Award, Eye, Users, Fingerprint } from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const identityTools: ExternalTool[] = [
	// ========== Domain Name Services ==========
	{
		id: 'ens',
		name: 'ENS',
		descriptionKey: 'chain-tools.identity.tools.ens.description',
		url: 'https://ens.domains',
		icon: Globe,
		category: 'identity',
		tags: ['domain', 'naming', 'ethereum', 'identity'],
		chains: ['Ethereum'],
		color: '#5298FF',
		isFeatured: true
	},
	{
		id: 'unstoppable-domains',
		name: 'Unstoppable Domains',
		descriptionKey: 'chain-tools.identity.tools.unstoppable_domains.description',
		url: 'https://unstoppabledomains.com',
		icon: Globe,
		category: 'identity',
		tags: ['domain', 'nft', 'multi-chain', 'identity'],
		chains: ['Ethereum', 'Polygon'],
		color: '#0D67FE'
	},
	{
		id: 'space-id',
		name: 'SPACE ID',
		descriptionKey: 'chain-tools.identity.tools.space_id.description',
		url: 'https://space.id',
		icon: Globe,
		category: 'identity',
		tags: ['domain', 'bnb', 'arbitrum', 'multi-chain'],
		chains: ['BSC', 'Arbitrum', 'Ethereum'],
		color: '#2B6AFF'
	},
	{
		id: 'dotbit',
		name: '.bit',
		descriptionKey: 'chain-tools.identity.tools.dotbit.description',
		url: 'https://did.id',
		icon: Globe,
		category: 'identity',
		tags: ['domain', 'cross-chain', 'nervos'],
		chains: ['Ethereum', 'BSC', 'Polygon', 'Nervos'],
		color: '#22C55E'
	},

	// ========== Identity Verification ==========
	{
		id: 'gitcoin-passport',
		name: 'Gitcoin Passport',
		descriptionKey: 'chain-tools.identity.tools.gitcoin_passport.description',
		url: 'https://passport.gitcoin.co',
		icon: BadgeCheck,
		category: 'identity',
		tags: ['sybil', 'identity', 'stamps', 'verification'],
		chains: ['Ethereum', 'Optimism'],
		color: '#02E2AC'
	},
	{
		id: 'worldcoin',
		name: 'Worldcoin',
		descriptionKey: 'chain-tools.identity.tools.worldcoin.description',
		url: 'https://worldcoin.org',
		icon: Eye,
		category: 'identity',
		tags: ['identity', 'proof-of-personhood', 'biometric'],
		chains: ['Optimism', 'Ethereum'],
		color: '#000000'
	},
	{
		id: 'civic',
		name: 'Civic',
		descriptionKey: 'chain-tools.identity.tools.civic.description',
		url: 'https://www.civic.com',
		icon: BadgeCheck,
		category: 'identity',
		tags: ['kyc', 'identity', 'verification', 'compliance'],
		chains: ['Ethereum', 'Solana', 'Polygon'],
		color: '#3AB03E'
	},

	// ========== Credentials & Quests ==========
	{
		id: 'galxe',
		name: 'Galxe',
		descriptionKey: 'chain-tools.identity.tools.galxe.description',
		url: 'https://galxe.com',
		icon: Trophy,
		category: 'identity',
		tags: ['credentials', 'campaigns', 'oat', 'quest'],
		chains: ['Ethereum', 'Polygon', 'BSC', 'Arbitrum', 'Optimism'],
		color: '#000000'
	},
	{
		id: 'layer3',
		name: 'Layer3',
		descriptionKey: 'chain-tools.identity.tools.layer3.description',
		url: 'https://layer3.xyz',
		icon: Trophy,
		category: 'identity',
		tags: ['quests', 'learn-to-earn', 'credentials', 'onboarding'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base'],
		color: '#6366F1'
	},
	{
		id: 'poap',
		name: 'POAP',
		descriptionKey: 'chain-tools.identity.tools.poap.description',
		url: 'https://poap.xyz',
		icon: Award,
		category: 'identity',
		tags: ['attendance', 'badge', 'nft', 'proof'],
		chains: ['Gnosis', 'Ethereum'],
		color: '#6534FF'
	},
	{
		id: 'galxe-passport',
		name: 'Galxe Passport',
		descriptionKey: 'chain-tools.identity.tools.galxe_passport.description',
		url: 'https://galxe.com/passport',
		icon: BadgeCheck,
		category: 'identity',
		tags: ['sybil', 'verification', 'passport', 'identity'],
		color: '#000000'
	},

	// ========== Reputation Systems ==========
	{
		id: 'degenscore',
		name: 'DegenScore',
		descriptionKey: 'chain-tools.identity.tools.degenscore.description',
		url: 'https://degenscore.com',
		icon: Award,
		category: 'identity',
		tags: ['reputation', 'score', 'on-chain', 'beacon'],
		chains: ['Ethereum'],
		color: '#FF6B00'
	},
	{
		id: 'talent-protocol',
		name: 'Talent Protocol',
		descriptionKey: 'chain-tools.identity.tools.talent_protocol.description',
		url: 'https://talentprotocol.com',
		icon: Users,
		category: 'identity',
		tags: ['builder-score', 'reputation', 'talent'],
		chains: ['Base', 'Ethereum'],
		color: '#6366F1'
	},

	// ========== Badges & Credentials ==========
	{
		id: 'phi',
		name: 'Phi',
		descriptionKey: 'chain-tools.identity.tools.phi.description',
		url: 'https://philand.xyz',
		icon: Globe,
		category: 'identity',
		tags: ['metaverse', 'identity', 'land', 'credentials'],
		color: '#3B82F6'
	},
	{
		id: 'otterspace',
		name: 'Otterspace',
		descriptionKey: 'chain-tools.identity.tools.otterspace.description',
		url: 'https://otterspace.xyz',
		icon: BadgeCheck,
		category: 'identity',
		tags: ['badges', 'soulbound', 'membership', 'dao'],
		color: '#10B981'
	},
	{
		id: 'disco',
		name: 'Disco',
		descriptionKey: 'chain-tools.identity.tools.disco.description',
		url: 'https://disco.xyz',
		icon: Fingerprint,
		category: 'identity',
		tags: ['credentials', 'data-backpack', 'identity', 'verifiable'],
		color: '#8B5CF6'
	},

	// ========== Privacy & ZK Identity ==========
	{
		id: 'holonym',
		name: 'Holonym',
		descriptionKey: 'chain-tools.identity.tools.holonym.description',
		url: 'https://holonym.id',
		icon: Fingerprint,
		category: 'identity',
		tags: ['privacy', 'identity', 'zk', 'verification'],
		color: '#14B8A6'
	},
	{
		id: 'anima',
		name: 'Anima',
		descriptionKey: 'chain-tools.identity.tools.anima.description',
		url: 'https://anima.io',
		icon: Fingerprint,
		category: 'identity',
		tags: ['biometric', 'identity', 'verification', 'sybil'],
		color: '#6366F1'
	},
	{
		id: 'polygon-id',
		name: 'Polygon ID',
		descriptionKey: 'chain-tools.identity.tools.polygon_id.description',
		url: 'https://polygon.technology/polygon-id',
		icon: Fingerprint,
		category: 'identity',
		tags: ['zk', 'credentials', 'privacy', 'verification'],
		chains: ['Polygon'],
		color: '#8247E5'
	},
	{
		id: 'sismo-protocol',
		name: 'Sismo',
		descriptionKey: 'chain-tools.identity.tools.sismo_protocol.description',
		url: 'https://sismo.io',
		icon: Fingerprint,
		category: 'identity',
		tags: ['zk-badges', 'privacy', 'attestations', 'proofs'],
		color: '#6366F1'
	},
	{
		id: 'clique-protocol',
		name: 'Clique',
		descriptionKey: 'chain-tools.identity.tools.clique_protocol.description',
		url: 'https://clique.social',
		icon: Fingerprint,
		category: 'identity',
		tags: ['oracle', 'identity', 'attestations', 'web2-web3'],
		color: '#000000'
	},
	{
		id: 'masa-protocol',
		name: 'Masa',
		descriptionKey: 'chain-tools.identity.tools.masa_protocol.description',
		url: 'https://masa.finance',
		icon: Fingerprint,
		category: 'identity',
		tags: ['soulbound', 'credit', 'identity', 'data'],
		color: '#22C55E'
	},
	{
		id: 'reclaim-protocol',
		name: 'Reclaim Protocol',
		descriptionKey: 'chain-tools.identity.tools.reclaim_protocol.description',
		url: 'https://reclaimprotocol.org',
		icon: Fingerprint,
		category: 'identity',
		tags: ['zk-proofs', 'credentials', 'https', 'verification'],
		color: '#3B82F6'
	},
	{
		id: 'humanity-protocol',
		name: 'Humanity Protocol',
		descriptionKey: 'chain-tools.identity.tools.humanity_protocol.description',
		url: 'https://humanity.org',
		icon: Fingerprint,
		category: 'identity',
		tags: ['proof-of-humanity', 'palm', 'biometric', 'sybil'],
		color: '#EC4899'
	},
	{
		id: 'rarimo',
		name: 'Rarimo',
		descriptionKey: 'chain-tools.identity.tools.rarimo.description',
		url: 'https://rarimo.com',
		icon: Fingerprint,
		category: 'identity',
		tags: ['passport', 'zk', 'cross-chain', 'identity'],
		color: '#8B5CF6'
	},
	{
		id: 'spruce-id',
		name: 'SpruceID',
		descriptionKey: 'chain-tools.identity.tools.spruce_id.description',
		url: 'https://spruceid.com',
		icon: Fingerprint,
		category: 'identity',
		tags: ['sign-in', 'ethereum', 'siwe', 'authentication'],
		color: '#14B8A6'
	},
	{
		id: 'verax',
		name: 'Verax',
		descriptionKey: 'chain-tools.identity.tools.verax.description',
		url: 'https://verax.linea.build',
		icon: BadgeCheck,
		category: 'identity',
		tags: ['attestations', 'registry', 'linea', 'on-chain'],
		chains: ['Linea'],
		color: '#61DFFF'
	},

	// ========== Additional Identity Tools ==========
	{
		id: 'bns',
		name: 'BNS (Base Name Service)',
		descriptionKey: 'chain-tools.identity.tools.bns.description',
		url: 'https://base.org/names',
		icon: Globe,
		category: 'identity',
		tags: ['domain', 'base', 'coinbase', 'naming'],
		chains: ['Base'],
		color: '#0052FF'
	},
	{
		id: 'linea-name-service',
		name: 'Linea Name Service',
		descriptionKey: 'chain-tools.identity.tools.linea_name_service.description',
		url: 'https://lineans.app',
		icon: Globe,
		category: 'identity',
		tags: ['domain', 'linea', 'naming', 'identity'],
		chains: ['Linea'],
		color: '#61DFFF'
	},
	{
		id: 'bonfida-sns',
		name: 'Bonfida (SNS)',
		descriptionKey: 'chain-tools.identity.tools.bonfida_sns.description',
		url: 'https://www.sns.id',
		icon: Globe,
		category: 'identity',
		tags: ['domain', 'solana', 'naming', 'sol'],
		chains: ['Solana'],
		color: '#14F195'
	},
	{
		id: 'eas',
		name: 'EAS (Ethereum Attestation Service)',
		descriptionKey: 'chain-tools.identity.tools.eas.description',
		url: 'https://attest.sh',
		icon: BadgeCheck,
		category: 'identity',
		tags: ['attestations', 'on-chain', 'verification', 'schema'],
		chains: ['Ethereum', 'Base', 'Optimism', 'Arbitrum'],
		color: '#1E40AF'
	},
	{
		id: 'zkpass',
		name: 'zkPass',
		descriptionKey: 'chain-tools.identity.tools.zkpass.description',
		url: 'https://zkpass.org',
		icon: Fingerprint,
		category: 'identity',
		tags: ['zk-proofs', 'privacy', 'verification', 'oracle'],
		color: '#6366F1'
	},
	{
		id: 'clr-fund',
		name: 'clr.fund',
		descriptionKey: 'chain-tools.identity.tools.clr_fund.description',
		url: 'https://clr.fund',
		icon: BadgeCheck,
		category: 'identity',
		tags: ['quadratic-funding', 'maci', 'sybil', 'grants'],
		chains: ['Ethereum', 'Arbitrum'],
		color: '#22C55E'
	},
	{
		id: 'privado-id',
		name: 'Privado ID',
		descriptionKey: 'chain-tools.identity.tools.privado_id.description',
		url: 'https://iden3.io',
		icon: Fingerprint,
		category: 'identity',
		tags: ['zk', 'identity', 'iden3', 'self-sovereign'],
		color: '#8B5CF6'
	},
	{
		id: 'guild-xyz',
		name: 'Guild.xyz',
		descriptionKey: 'chain-tools.identity.tools.guild_xyz.description',
		url: 'https://guild.xyz',
		icon: Users,
		category: 'identity',
		tags: ['access', 'roles', 'token-gating', 'membership'],
		color: '#10B981'
	},
	{
		id: 'brightid',
		name: 'BrightID',
		descriptionKey: 'chain-tools.identity.tools.brightid.description',
		url: 'https://brightid.org',
		icon: Eye,
		category: 'identity',
		tags: ['sybil', 'social-graph', 'verification', 'unique-human'],
		color: '#F59E0B'
	},
	{
		id: 'nomis',
		name: 'Nomis',
		descriptionKey: 'chain-tools.identity.tools.nomis.description',
		url: 'https://nomis.cc',
		icon: Award,
		category: 'identity',
		tags: ['reputation', 'score', 'on-chain', 'multi-chain'],
		color: '#3B82F6'
	}
];
