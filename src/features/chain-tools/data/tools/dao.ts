/**
 * DAO Tools - Governance, voting, and DAO management
 */
import {
	Vote,
	Building2,
	Users,
	MessageSquare,
	Megaphone,
	Bell,
	ScrollText,
	Award,
	Settings
} from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const daoTools: ExternalTool[] = [
	// ========== Governance Platforms ==========
	{
		id: 'snapshot',
		name: 'Snapshot',
		descriptionKey: 'chain-tools.tools.snapshot.description',
		url: 'https://snapshot.org',
		icon: Vote,
		category: 'dao',
		tags: ['governance', 'voting', 'dao', 'gasless'],
		color: '#F3AD39'
	},
	{
		id: 'tally',
		name: 'Tally',
		descriptionKey: 'chain-tools.tools.tally.description',
		url: 'https://www.tally.xyz',
		icon: Vote,
		category: 'dao',
		tags: ['governance', 'dao', 'onchain-voting', 'proposals'],
		color: '#2D3748'
	},
	{
		id: 'aragon',
		name: 'Aragon',
		descriptionKey: 'chain-tools.tools.aragon.description',
		url: 'https://aragon.org',
		icon: Building2,
		category: 'dao',
		tags: ['dao', 'governance', 'create', 'framework'],
		color: '#00C2FF'
	},
	{
		id: 'colony',
		name: 'Colony',
		descriptionKey: 'chain-tools.tools.colony.description',
		url: 'https://colony.io',
		icon: Users,
		category: 'dao',
		tags: ['dao', 'organization', 'payroll', 'reputation'],
		color: '#6366F1'
	},

	// ========== DAO Dashboards ==========
	{
		id: 'boardroom',
		name: 'Boardroom',
		descriptionKey: 'chain-tools.tools.boardroom.description',
		url: 'https://boardroom.io',
		icon: Building2,
		category: 'dao',
		tags: ['governance', 'dashboard', 'proposals', 'delegate'],
		color: '#000000'
	},
	{
		id: 'karma',
		name: 'Karma',
		descriptionKey: 'chain-tools.tools.karma.description',
		url: 'https://www.karmahq.xyz',
		icon: Users,
		category: 'dao',
		tags: ['reputation', 'delegate', 'contribution'],
		color: '#6366F1'
	},

	// ========== Communication/Social ==========
	{
		id: 'lenster',
		name: 'Hey (Lenster)',
		descriptionKey: 'chain-tools.tools.lenster.description',
		url: 'https://hey.xyz',
		icon: MessageSquare,
		category: 'dao',
		tags: ['social', 'lens', 'decentralized', 'web3'],
		color: '#8B5CF6'
	},
	{
		id: 'farcaster',
		name: 'Warpcast (Farcaster)',
		descriptionKey: 'chain-tools.tools.farcaster.description',
		url: 'https://warpcast.com',
		icon: Megaphone,
		category: 'dao',
		tags: ['social', 'farcaster', 'decentralized', 'frames'],
		color: '#8465CB',
		isFeatured: true
	},
	{
		id: 'push',
		name: 'Push Protocol',
		descriptionKey: 'chain-tools.tools.push.description',
		url: 'https://push.org',
		icon: Bell,
		category: 'dao',
		tags: ['notifications', 'messaging', 'web3', 'communication'],
		color: '#DD44B9'
	},

	// ========== DAO Tooling ==========
	{
		id: 'daohaus',
		name: 'DAOhaus',
		descriptionKey: 'chain-tools.tools.daohaus.description',
		url: 'https://daohaus.club',
		icon: Building2,
		category: 'dao',
		tags: ['moloch', 'dao', 'community', 'grants'],
		color: '#EA1D76'
	},
	{
		id: 'charmverse',
		name: 'CharmVerse',
		descriptionKey: 'chain-tools.tools.charmverse.description',
		url: 'https://www.charmverse.io',
		icon: ScrollText,
		category: 'dao',
		tags: ['workspace', 'docs', 'bounties', 'community'],
		color: '#A855F7'
	},
	{
		id: 'wonderverse',
		name: 'Wonderverse',
		descriptionKey: 'chain-tools.tools.wonderverse.description',
		url: 'https://www.wonderverse.xyz',
		icon: Users,
		category: 'dao',
		tags: ['tasks', 'bounties', 'projects', 'contributors'],
		color: '#6366F1'
	},
	{
		id: 'coordinape',
		name: 'Coordinape',
		descriptionKey: 'chain-tools.tools.coordinape.description',
		url: 'https://coordinape.com',
		icon: Users,
		category: 'dao',
		tags: ['compensation', 'give', 'circles', 'contributors'],
		color: '#3B82F6'
	},
	{
		id: 'guild',
		name: 'Guild.xyz',
		descriptionKey: 'chain-tools.tools.guild.description',
		url: 'https://guild.xyz',
		icon: Users,
		category: 'dao',
		tags: ['access', 'roles', 'token-gating', 'community'],
		color: '#FECC00'
	},
	{
		id: 'jokerace',
		name: 'JokeRace',
		descriptionKey: 'chain-tools.tools.jokerace.description',
		url: 'https://jokerace.xyz',
		icon: Award,
		category: 'dao',
		tags: ['contests', 'voting', 'governance', 'fun'],
		color: '#FF6B6B'
	},

	// ========== More DAO Platforms ==========
	{
		id: 'commonwealth',
		name: 'Commonwealth',
		descriptionKey: 'chain-tools.tools.commonwealth.description',
		url: 'https://commonwealth.im',
		icon: Users,
		category: 'dao',
		tags: ['governance', 'discussion', 'community', 'forum'],
		color: '#6366F1'
	},
	{
		id: 'jokedao',
		name: 'JokeDAO',
		descriptionKey: 'chain-tools.tools.jokedao.description',
		url: 'https://www.jokedao.io',
		icon: Vote,
		category: 'dao',
		tags: ['governance', 'contests', 'voting', 'community'],
		color: '#EC4899'
	},
	{
		id: 'nouns-builder',
		name: 'Nouns Builder',
		descriptionKey: 'chain-tools.tools.nouns_builder.description',
		url: 'https://nouns.build',
		icon: Vote,
		category: 'dao',
		tags: ['dao', 'builder', 'nouns', 'governance'],
		chains: ['Ethereum', 'Base', 'Zora'],
		color: '#EF4444'
	},
	{
		id: 'hats-protocol',
		name: 'Hats Protocol',
		descriptionKey: 'chain-tools.tools.hats_protocol.description',
		url: 'https://www.hatsprotocol.xyz',
		icon: Users,
		category: 'dao',
		tags: ['roles', 'permissions', 'dao', 'organization'],
		color: '#8B5CF6'
	},
	{
		id: 'llama',
		name: 'Llama',
		descriptionKey: 'chain-tools.tools.llama.description',
		url: 'https://llama.xyz',
		icon: Building2,
		category: 'dao',
		tags: ['governance', 'operations', 'treasury', 'services'],
		color: '#3B82F6'
	},
	{
		id: 'utopia-dao',
		name: 'Utopia',
		descriptionKey: 'chain-tools.tools.utopia_dao.description',
		url: 'https://www.utopialabs.com',
		icon: Building2,
		category: 'dao',
		tags: ['payroll', 'treasury', 'operations', 'payments'],
		color: '#5856D6'
	},

	// ========== Solana DAO Tools ==========
	{
		id: 'realms-solana',
		name: 'Realms',
		descriptionKey: 'chain-tools.tools.realms_solana.description',
		url: 'https://realms.today',
		icon: Vote,
		category: 'dao',
		tags: ['solana', 'governance', 'treasury', 'voting'],
		chains: ['Solana'],
		color: '#14F195'
	},
	{
		id: 'squads-protocol',
		name: 'Squads',
		descriptionKey: 'chain-tools.tools.squads_protocol.description',
		url: 'https://squads.so',
		icon: Users,
		category: 'dao',
		tags: ['solana', 'multisig', 'treasury', 'teams'],
		chains: ['Solana'],
		color: '#F7931A'
	},
	{
		id: 'tribeca-dao',
		name: 'Tribeca',
		descriptionKey: 'chain-tools.tools.tribeca_dao.description',
		url: 'https://tribeca.so',
		icon: Vote,
		category: 'dao',
		tags: ['solana', 'governance', 've-tokens', 'protocol'],
		chains: ['Solana'],
		color: '#8B5CF6'
	},

	// ========== Governance Modules ==========
	{
		id: 'zodiac-gnosis',
		name: 'Zodiac',
		descriptionKey: 'chain-tools.tools.zodiac_gnosis.description',
		url: 'https://zodiac.wiki',
		icon: Settings,
		category: 'dao',
		tags: ['gnosis', 'modules', 'governance', 'composable'],
		chains: ['Ethereum', 'Gnosis'],
		color: '#04795B'
	},
	{
		id: 'hedgey-governance',
		name: 'Hedgey Governance',
		descriptionKey: 'chain-tools.tools.hedgey_governance.description',
		url: 'https://hedgey.finance/governance',
		icon: Vote,
		category: 'dao',
		tags: ['delegation', 'voting', 'tokens', 'governance'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum'],
		color: '#8B5CF6'
	},

	// ========== DAO Analytics & Tools ==========
	{
		id: 'daolens',
		name: 'DAOLens',
		descriptionKey: 'chain-tools.tools.daolens.description',
		url: 'https://daolens.com',
		icon: Users,
		category: 'dao',
		tags: ['analytics', 'contributors', 'discovery', 'insights'],
		color: '#3B82F6'
	},
	{
		id: 'senate-governance',
		name: 'Senate',
		descriptionKey: 'chain-tools.tools.senate_governance.description',
		url: 'https://senate.io',
		icon: Vote,
		category: 'dao',
		tags: ['aggregator', 'notifications', 'voting', 'tracking'],
		color: '#EF4444'
	},
	{
		id: 'kleros',
		name: 'Kleros',
		descriptionKey: 'chain-tools.tools.kleros.description',
		url: 'https://kleros.io',
		icon: Vote,
		category: 'dao',
		tags: ['arbitration', 'disputes', 'decentralized', 'court'],
		chains: ['Ethereum', 'Gnosis'],
		color: '#9B59B6'
	},
	{
		id: 'prop-house',
		name: 'Prop House',
		descriptionKey: 'chain-tools.tools.prop_house.description',
		url: 'https://prop.house',
		icon: Vote,
		category: 'dao',
		tags: ['funding', 'nouns', 'proposals', 'community'],
		chains: ['Ethereum'],
		color: '#EF4444'
	},

	// ========== Additional DAO Tools ==========
	{
		id: 'gardens-dao',
		name: 'Gardens',
		descriptionKey: 'chain-tools.tools.gardens_dao.description',
		url: 'https://gardens.fund',
		icon: Vote,
		category: 'dao',
		tags: ['conviction-voting', 'funding', 'community', 'governance'],
		chains: ['Gnosis', 'Polygon'],
		color: '#22C55E'
	},
	{
		id: 'dework',
		name: 'Dework',
		descriptionKey: 'chain-tools.tools.dework.description',
		url: 'https://dework.xyz',
		icon: Users,
		category: 'dao',
		tags: ['tasks', 'bounties', 'web3', 'kanban'],
		color: '#6366F1'
	},
	{
		id: 'clarity-dao',
		name: 'Clarity',
		descriptionKey: 'chain-tools.tools.clarity_dao.description',
		url: 'https://www.clarity.so',
		icon: ScrollText,
		category: 'dao',
		tags: ['workspace', 'docs', 'wiki', 'dao'],
		color: '#3B82F6'
	},
	{
		id: 'agora-governance',
		name: 'Agora',
		descriptionKey: 'chain-tools.tools.agora_governance.description',
		url: 'https://www.agora.xyz',
		icon: Vote,
		category: 'dao',
		tags: ['governance', 'onchain', 'voting', 'proposals'],
		color: '#000000'
	},
	{
		id: 'safe-dao',
		name: 'Safe',
		descriptionKey: 'chain-tools.tools.safe_dao.description',
		url: 'https://safe.global',
		icon: Building2,
		category: 'dao',
		tags: ['multisig', 'treasury', 'smart-accounts', 'security'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Base'],
		color: '#12A77F'
	},
	{
		id: 'orca-pod',
		name: 'Orca Protocol',
		descriptionKey: 'chain-tools.tools.orca_pod.description',
		url: 'https://www.orcaprotocol.org',
		icon: Users,
		category: 'dao',
		tags: ['pods', 'teams', 'governance', 'modular'],
		chains: ['Ethereum'],
		color: '#0EA5E9'
	},
	{
		id: 'layer3-bounties',
		name: 'Layer3 Bounties',
		descriptionKey: 'chain-tools.tools.layer3_bounties.description',
		url: 'https://layer3.xyz',
		icon: Award,
		category: 'dao',
		tags: ['bounties', 'quests', 'contributors', 'rewards'],
		color: '#6366F1'
	},
	{
		id: 'snapshot-x',
		name: 'Snapshot X',
		descriptionKey: 'chain-tools.tools.snapshot_x.description',
		url: 'https://snapshotx.xyz',
		icon: Vote,
		category: 'dao',
		tags: ['onchain-voting', 'starknet', 'governance', 'zk'],
		chains: ['Starknet', 'Ethereum'],
		color: '#F3AD39'
	},
	{
		id: 'decent-dao',
		name: 'Decent',
		descriptionKey: 'chain-tools.tools.decent_dao.description',
		url: 'https://www.decent-dao.org',
		icon: Building2,
		category: 'dao',
		tags: ['fractal', 'governance', 'modular', 'treasury'],
		chains: ['Ethereum', 'Polygon'],
		color: '#8B5CF6'
	},
	{
		id: 'otterspace-badges',
		name: 'Otterspace',
		descriptionKey: 'chain-tools.tools.otterspace_badges.description',
		url: 'https://www.otterspace.xyz',
		icon: Award,
		category: 'dao',
		tags: ['badges', 'soulbound', 'membership', 'reputation'],
		chains: ['Ethereum', 'Optimism', 'Polygon'],
		color: '#10B981'
	}
];
