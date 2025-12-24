/**
 * Jobs Tools - Web3 job platforms and career resources
 */
import { Briefcase, Users, Award, Globe, Building2, Code } from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const jobsTools: ExternalTool[] = [
	// ========== Major Web3 Job Platforms ==========
	{
		id: 'jobs-cryptocurrencyjobs',
		name: 'Cryptocurrency Jobs',
		descriptionKey: 'chain-tools.tools.jobs_cryptocurrencyjobs.description',
		url: 'https://cryptocurrencyjobs.co',
		icon: Briefcase,
		category: 'jobs',
		tags: ['jobs', 'crypto', 'remote', 'full-time'],
		color: '#3B82F6'
	},
	{
		id: 'jobs-web3career',
		name: 'Web3.career',
		descriptionKey: 'chain-tools.tools.jobs_web3career.description',
		url: 'https://web3.career',
		icon: Briefcase,
		category: 'jobs',
		tags: ['jobs', 'web3', 'remote', 'developer'],
		color: '#8B5CF6'
	},
	{
		id: 'jobs-cryptojobslist',
		name: 'Crypto Jobs List',
		descriptionKey: 'chain-tools.tools.jobs_cryptojobslist.description',
		url: 'https://cryptojobslist.com',
		icon: Briefcase,
		category: 'jobs',
		tags: ['jobs', 'crypto', 'blockchain', 'startup'],
		color: '#10B981'
	},
	{
		id: 'jobs-pompcryptojobs',
		name: 'Pomp Crypto Jobs',
		descriptionKey: 'chain-tools.tools.jobs_pompcryptojobs.description',
		url: 'https://pompcryptojobs.com',
		icon: Briefcase,
		category: 'jobs',
		tags: ['jobs', 'crypto', 'curated', 'quality'],
		color: '#F59E0B'
	},
	{
		id: 'jobs-useweb3',
		name: 'useWeb3',
		descriptionKey: 'chain-tools.tools.jobs_useweb3.description',
		url: 'https://useweb3.xyz/jobs',
		icon: Briefcase,
		category: 'jobs',
		tags: ['jobs', 'web3', 'developer', 'learning'],
		color: '#6366F1'
	},
	{
		id: 'jobs-remoteok-crypto',
		name: 'Remote OK Crypto',
		descriptionKey: 'chain-tools.tools.jobs_remoteok_crypto.description',
		url: 'https://remoteok.com/remote-crypto-jobs',
		icon: Briefcase,
		category: 'jobs',
		tags: ['jobs', 'remote', 'crypto', 'global'],
		color: '#EF4444'
	},
	{
		id: 'jobs-blockchaindevjobs',
		name: 'Blockchain Dev Jobs',
		descriptionKey: 'chain-tools.tools.jobs_blockchaindevjobs.description',
		url: 'https://blockchaindevjobs.com',
		icon: Code,
		category: 'jobs',
		tags: ['jobs', 'developer', 'blockchain', 'technical'],
		color: '#3B82F6'
	},
	{
		id: 'jobs-defi-jobs',
		name: 'DeFi Jobs',
		descriptionKey: 'chain-tools.tools.jobs_defi_jobs.description',
		url: 'https://defi.jobs',
		icon: Briefcase,
		category: 'jobs',
		tags: ['jobs', 'defi', 'finance', 'protocol'],
		color: '#10B981'
	},
	{
		id: 'jobs-builtin-blockchain',
		name: 'Built In Blockchain',
		descriptionKey: 'chain-tools.tools.jobs_builtin_blockchain.description',
		url: 'https://builtin.com/jobs/blockchain',
		icon: Briefcase,
		category: 'jobs',
		tags: ['jobs', 'blockchain', 'startup', 'tech'],
		color: '#000000'
	},

	// ========== DAO & Contributor Platforms ==========
	{
		id: 'jobs-dework',
		name: 'Dework',
		descriptionKey: 'chain-tools.tools.jobs_dework.description',
		url: 'https://dework.xyz',
		icon: Users,
		category: 'jobs',
		tags: ['bounty', 'dao', 'tasks', 'contributor'],
		color: '#6366F1'
	},
	{
		id: 'jobs-layer3',
		name: 'Layer3',
		descriptionKey: 'chain-tools.tools.jobs_layer3.description',
		url: 'https://layer3.xyz',
		icon: Award,
		category: 'jobs',
		tags: ['bounty', 'quests', 'learn-to-earn', 'contributor'],
		color: '#8B5CF6'
	},
	{
		id: 'jobs-gitcoin',
		name: 'Gitcoin',
		descriptionKey: 'chain-tools.tools.jobs_gitcoin.description',
		url: 'https://gitcoin.co',
		icon: Users,
		category: 'jobs',
		tags: ['bounty', 'grants', 'open-source', 'contributor'],
		color: '#00433B'
	},
	{
		id: 'jobs-coordinape',
		name: 'Coordinape',
		descriptionKey: 'chain-tools.tools.jobs_coordinape.description',
		url: 'https://coordinape.com',
		icon: Users,
		category: 'jobs',
		tags: ['dao', 'compensation', 'contributor', 'circles'],
		color: '#3B82F6'
	},
	{
		id: 'jobs-wonderverse',
		name: 'Wonderverse',
		descriptionKey: 'chain-tools.tools.jobs_wonderverse.description',
		url: 'https://www.wonderverse.xyz',
		icon: Users,
		category: 'jobs',
		tags: ['dao', 'tasks', 'bounty', 'projects'],
		color: '#A855F7'
	},
	{
		id: 'jobs-charmverse',
		name: 'CharmVerse',
		descriptionKey: 'chain-tools.tools.jobs_charmverse.description',
		url: 'https://www.charmverse.io',
		icon: Users,
		category: 'jobs',
		tags: ['dao', 'workspace', 'bounties', 'community'],
		color: '#8B5CF6'
	},
	{
		id: 'jobs-daolens',
		name: 'DAOLens',
		descriptionKey: 'chain-tools.tools.jobs_daolens.description',
		url: 'https://daolens.com',
		icon: Users,
		category: 'jobs',
		tags: ['dao', 'discovery', 'contributor', 'analytics'],
		color: '#3B82F6'
	},

	// ========== Freelance & Bounty Platforms ==========
	{
		id: 'jobs-immunefi',
		name: 'Immunefi',
		descriptionKey: 'chain-tools.tools.jobs_immunefi.description',
		url: 'https://immunefi.com',
		icon: Award,
		category: 'jobs',
		tags: ['bounty', 'security', 'bug-bounty', 'whitehat'],
		color: '#00D395'
	},
	{
		id: 'jobs-code4rena',
		name: 'Code4rena',
		descriptionKey: 'chain-tools.tools.jobs_code4rena.description',
		url: 'https://code4rena.com',
		icon: Award,
		category: 'jobs',
		tags: ['bounty', 'auditing', 'security', 'contests'],
		color: '#10B981'
	},
	{
		id: 'jobs-sherlock',
		name: 'Sherlock',
		descriptionKey: 'chain-tools.tools.jobs_sherlock.description',
		url: 'https://www.sherlock.xyz',
		icon: Award,
		category: 'jobs',
		tags: ['bounty', 'auditing', 'security', 'coverage'],
		color: '#000000'
	},
	{
		id: 'jobs-hackenproof',
		name: 'HackenProof',
		descriptionKey: 'chain-tools.tools.jobs_hackenproof.description',
		url: 'https://hackenproof.com',
		icon: Award,
		category: 'jobs',
		tags: ['bounty', 'security', 'bug-bounty', 'whitehat'],
		color: '#00C2FF'
	},
	{
		id: 'jobs-hats-finance',
		name: 'Hats Finance',
		descriptionKey: 'chain-tools.tools.jobs_hats_finance.description',
		url: 'https://hats.finance',
		icon: Award,
		category: 'jobs',
		tags: ['bounty', 'security', 'decentralized', 'audits'],
		color: '#F97316'
	},
	{
		id: 'jobs-cantina',
		name: 'Cantina',
		descriptionKey: 'chain-tools.tools.jobs_cantina.description',
		url: 'https://cantina.xyz',
		icon: Award,
		category: 'jobs',
		tags: ['bounty', 'security', 'auditing', 'spearbit'],
		color: '#1E40AF'
	},
	{
		id: 'jobs-ethbounties',
		name: 'ETH Bounties',
		descriptionKey: 'chain-tools.tools.jobs_ethbounties.description',
		url: 'https://bounties.ethereum.org',
		icon: Award,
		category: 'jobs',
		tags: ['bounty', 'ethereum', 'protocol', 'security'],
		color: '#627EEA'
	},

	// ========== Company Job Boards ==========
	{
		id: 'jobs-a16z-portfolio',
		name: 'a16z Portfolio Jobs',
		descriptionKey: 'chain-tools.tools.jobs_a16z_portfolio.description',
		url: 'https://jobs.a16z.com',
		icon: Building2,
		category: 'jobs',
		tags: ['jobs', 'vc-portfolio', 'startup', 'funded'],
		color: '#000000'
	},
	{
		id: 'jobs-paradigm-portfolio',
		name: 'Paradigm Portfolio',
		descriptionKey: 'chain-tools.tools.jobs_paradigm_portfolio.description',
		url: 'https://jobs.paradigm.xyz',
		icon: Building2,
		category: 'jobs',
		tags: ['jobs', 'vc-portfolio', 'crypto', 'funded'],
		color: '#000000'
	},
	{
		id: 'jobs-coinbase',
		name: 'Coinbase Careers',
		descriptionKey: 'chain-tools.tools.jobs_coinbase.description',
		url: 'https://www.coinbase.com/careers',
		icon: Building2,
		category: 'jobs',
		tags: ['jobs', 'exchange', 'corporate', 'crypto'],
		color: '#0052FF'
	},
	{
		id: 'jobs-binance',
		name: 'Binance Careers',
		descriptionKey: 'chain-tools.tools.jobs_binance.description',
		url: 'https://www.binance.com/en/careers',
		icon: Building2,
		category: 'jobs',
		tags: ['jobs', 'exchange', 'corporate', 'global'],
		color: '#F0B90B'
	},
	{
		id: 'jobs-consensys',
		name: 'ConsenSys Careers',
		descriptionKey: 'chain-tools.tools.jobs_consensys.description',
		url: 'https://consensys.io/careers',
		icon: Building2,
		category: 'jobs',
		tags: ['jobs', 'ethereum', 'infrastructure', 'corporate'],
		color: '#121212'
	},
	{
		id: 'jobs-chainlink-labs',
		name: 'Chainlink Labs',
		descriptionKey: 'chain-tools.tools.jobs_chainlink_labs.description',
		url: 'https://chainlinklabs.com/careers',
		icon: Building2,
		category: 'jobs',
		tags: ['jobs', 'oracles', 'infrastructure', 'corporate'],
		color: '#375BD2'
	},
	{
		id: 'jobs-ethereum-foundation',
		name: 'Ethereum Foundation',
		descriptionKey: 'chain-tools.tools.jobs_ethereum_foundation.description',
		url: 'https://ethereum.org/en/about/#open-jobs',
		icon: Building2,
		category: 'jobs',
		tags: ['jobs', 'ethereum', 'foundation', 'research'],
		color: '#627EEA'
	},
	{
		id: 'jobs-uniswap-labs',
		name: 'Uniswap Labs',
		descriptionKey: 'chain-tools.tools.jobs_uniswap_labs.description',
		url: 'https://boards.greenhouse.io/uniswaplabs',
		icon: Building2,
		category: 'jobs',
		tags: ['jobs', 'defi', 'protocol', 'dex'],
		color: '#FF007A'
	},
	{
		id: 'jobs-opensea',
		name: 'OpenSea Careers',
		descriptionKey: 'chain-tools.tools.jobs_opensea.description',
		url: 'https://opensea.io/careers',
		icon: Building2,
		category: 'jobs',
		tags: ['jobs', 'nft', 'marketplace', 'corporate'],
		color: '#2081E2'
	},
	{
		id: 'jobs-alchemy',
		name: 'Alchemy Careers',
		descriptionKey: 'chain-tools.tools.jobs_alchemy.description',
		url: 'https://www.alchemy.com/careers',
		icon: Building2,
		category: 'jobs',
		tags: ['jobs', 'infrastructure', 'api', 'developer-tools'],
		color: '#0C0C0E'
	},

	// ========== Internship & Entry-Level ==========
	{
		id: 'jobs-encode-club',
		name: 'Encode Club',
		descriptionKey: 'chain-tools.tools.jobs_encode_club.description',
		url: 'https://www.encode.club',
		icon: Users,
		category: 'jobs',
		tags: ['education', 'bootcamp', 'entry-level', 'hackathon'],
		color: '#8B5CF6'
	},
	{
		id: 'jobs-ethglobal-fellowship',
		name: 'ETHGlobal Fellowship',
		descriptionKey: 'chain-tools.tools.jobs_ethglobal_fellowship.description',
		url: 'https://ethglobal.com',
		icon: Users,
		category: 'jobs',
		tags: ['fellowship', 'hackathon', 'entry-level', 'mentorship'],
		color: '#000000'
	},
	{
		id: 'jobs-developer-dao',
		name: 'Developer DAO',
		descriptionKey: 'chain-tools.tools.jobs_developer_dao.description',
		url: 'https://developerdao.com',
		icon: Users,
		category: 'jobs',
		tags: ['dao', 'education', 'community', 'entry-level'],
		color: '#000000'
	},
	{
		id: 'jobs-buildspace-n-w',
		name: 'Buildspace Nights & Weekends',
		descriptionKey: 'chain-tools.tools.jobs_buildspace_n_w.description',
		url: 'https://buildspace.so',
		icon: Users,
		category: 'jobs',
		tags: ['education', 'building', 'community', 'projects'],
		color: '#4ADE80'
	},

	// ========== Chinese Job Platforms ==========
	{
		id: 'jobs-abcde',
		name: 'ABCDE Capital Jobs',
		descriptionKey: 'chain-tools.tools.jobs_abcde.description',
		url: 'https://abcde.aborsecom/jobs',
		icon: Globe,
		category: 'jobs',
		tags: ['chinese', 'jobs', 'vc-portfolio', 'asia'],
		color: '#000000'
	},
	{
		id: 'jobs-foresight-ventures',
		name: 'Foresight Ventures Jobs',
		descriptionKey: 'chain-tools.tools.jobs_foresight_ventures.description',
		url: 'https://foresightventures.com/careers',
		icon: Globe,
		category: 'jobs',
		tags: ['chinese', 'jobs', 'vc-portfolio', 'asia'],
		color: '#6366F1'
	},
	{
		id: 'jobs-hashkey',
		name: 'HashKey Careers',
		descriptionKey: 'chain-tools.tools.jobs_hashkey.description',
		url: 'https://hashkey.com/careers',
		icon: Globe,
		category: 'jobs',
		tags: ['chinese', 'jobs', 'exchange', 'hong-kong'],
		color: '#3B82F6'
	},
	{
		id: 'jobs-okx',
		name: 'OKX Careers',
		descriptionKey: 'chain-tools.tools.jobs_okx.description',
		url: 'https://www.okx.com/careers',
		icon: Globe,
		category: 'jobs',
		tags: ['chinese', 'jobs', 'exchange', 'global'],
		color: '#000000'
	},
	{
		id: 'jobs-huobi',
		name: 'HTX Careers',
		descriptionKey: 'chain-tools.tools.jobs_huobi.description',
		url: 'https://www.htx.com/careers',
		icon: Globe,
		category: 'jobs',
		tags: ['chinese', 'jobs', 'exchange', 'asia'],
		color: '#1A62FF'
	},

	// ========== Networking & Career Resources ==========
	{
		id: 'jobs-crypto-careers',
		name: 'Crypto Careers',
		descriptionKey: 'chain-tools.tools.jobs_crypto_careers.description',
		url: 'https://www.crypto-careers.com',
		icon: Briefcase,
		category: 'jobs',
		tags: ['jobs', 'networking', 'career', 'community'],
		color: '#8B5CF6'
	},
	{
		id: 'jobs-otta-web3',
		name: 'Otta Web3',
		descriptionKey: 'chain-tools.tools.jobs_otta_web3.description',
		url: 'https://otta.com/jobs/web3',
		icon: Briefcase,
		category: 'jobs',
		tags: ['jobs', 'startup', 'curated', 'matching'],
		color: '#4ADE80'
	},
	{
		id: 'jobs-angellist-crypto',
		name: 'AngelList Crypto',
		descriptionKey: 'chain-tools.tools.jobs_angellist_crypto.description',
		url: 'https://wellfound.com/crypto',
		icon: Briefcase,
		category: 'jobs',
		tags: ['jobs', 'startup', 'equity', 'funding'],
		color: '#000000'
	},
	{
		id: 'jobs-linkedin-web3',
		name: 'LinkedIn Web3',
		descriptionKey: 'chain-tools.tools.jobs_linkedin_web3.description',
		url: 'https://www.linkedin.com/jobs/web3-jobs',
		icon: Briefcase,
		category: 'jobs',
		tags: ['jobs', 'networking', 'professional', 'mainstream'],
		color: '#0A66C2'
	}
];
