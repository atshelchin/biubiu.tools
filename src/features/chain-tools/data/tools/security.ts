/**
 * Security Tools - Auditing, monitoring, and protection services
 */
import { Shield, Lock, Bug, Code, Eye, FileSearch, FileCode, Bell } from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const securityTools: ExternalTool[] = [
	// ========== Approval & Permission Management ==========
	{
		id: 'revoke',
		name: 'Revoke.cash',
		descriptionKey: 'chain-tools.tools.revoke.description',
		url: 'https://revoke.cash',
		icon: Shield,
		category: 'security',
		tags: ['approvals', 'revoke', 'security', 'permissions'],
		chains: ['Ethereum', 'Polygon', 'BSC', 'Arbitrum', 'Optimism'],
		color: '#E53E3E'
	},
	{
		id: 'pocket-universe',
		name: 'Pocket Universe',
		descriptionKey: 'chain-tools.tools.pocket_universe.description',
		url: 'https://www.pocketuniverse.app',
		icon: Lock,
		category: 'security',
		tags: ['simulation', 'security', 'extension', 'protection'],
		color: '#7C3AED'
	},

	// ========== Audit Firms ==========
	{
		id: 'slither',
		name: 'Slither',
		descriptionKey: 'chain-tools.tools.slither.description',
		url: 'https://github.com/crytic/slither',
		icon: Bug,
		category: 'security',
		tags: ['audit', 'static-analysis', 'security', 'solidity'],
		color: '#6366F1'
	},
	{
		id: 'mythx',
		name: 'MythX',
		descriptionKey: 'chain-tools.tools.mythx.description',
		url: 'https://mythx.io',
		icon: Shield,
		category: 'security',
		tags: ['audit', 'security', 'analysis', 'smart-contract'],
		color: '#3B3B98'
	},
	{
		id: 'certik',
		name: 'CertiK',
		descriptionKey: 'chain-tools.tools.certik.description',
		url: 'https://www.certik.com',
		icon: Shield,
		category: 'security',
		tags: ['audit', 'security', 'leaderboard', 'skynet'],
		color: '#00CED1',
		isFeatured: true
	},
	{
		id: 'hacken',
		name: 'Hacken',
		descriptionKey: 'chain-tools.tools.hacken.description',
		url: 'https://hacken.io',
		icon: Shield,
		category: 'security',
		tags: ['audit', 'penetration-testing', 'security'],
		color: '#16C1F3'
	},
	{
		id: 'immunefi',
		name: 'Immunefi',
		descriptionKey: 'chain-tools.tools.immunefi.description',
		url: 'https://immunefi.com',
		icon: Bug,
		category: 'security',
		tags: ['bug-bounty', 'security', 'rewards'],
		color: '#5850EC'
	},
	{
		id: 'openzeppelin',
		name: 'OpenZeppelin',
		descriptionKey: 'chain-tools.tools.openzeppelin.description',
		url: 'https://www.openzeppelin.com',
		icon: Shield,
		category: 'security',
		tags: ['contracts', 'library', 'audit', 'defender'],
		color: '#4E5EE4',
		isFeatured: true
	},
	{
		id: 'dedaub',
		name: 'Dedaub',
		descriptionKey: 'chain-tools.tools.dedaub.description',
		url: 'https://library.dedaub.com',
		icon: Code,
		category: 'security',
		tags: ['decompiler', 'bytecode', 'analysis'],
		color: '#6C63FF'
	},

	// ========== Wallet Security ==========
	{
		id: 'de-fi',
		name: 'De.Fi',
		descriptionKey: 'chain-tools.tools.de_fi.description',
		url: 'https://de.fi',
		icon: Shield,
		category: 'security',
		tags: ['scanner', 'rekt', 'approvals', 'shield'],
		color: '#00D1A0'
	},
	{
		id: 'honeypot',
		name: 'Honeypot.is',
		descriptionKey: 'chain-tools.tools.honeypot.description',
		url: 'https://honeypot.is',
		icon: Lock,
		category: 'security',
		tags: ['honeypot', 'detection', 'scam-check'],
		color: '#FFC107'
	},

	// ========== Transaction Analysis ==========
	{
		id: 'phalcon',
		name: 'Phalcon (BlockSec)',
		descriptionKey: 'chain-tools.tools.phalcon.description',
		url: 'https://phalcon.blocksec.com',
		icon: Eye,
		category: 'security',
		tags: ['explorer', 'tx-analysis', 'debug', 'trace'],
		color: '#00CED1'
	},
	{
		id: 'tx-tracer',
		name: 'Tx Tracer',
		descriptionKey: 'chain-tools.tools.tx_tracer.description',
		url: 'https://openchain.xyz/trace',
		icon: FileSearch,
		category: 'security',
		tags: ['trace', 'debug', 'calldata', 'decoder'],
		color: '#6366F1'
	},
	{
		id: 'contract-diff',
		name: 'Contract Diff',
		descriptionKey: 'chain-tools.tools.contract_diff.description',
		url: 'https://www.contract-diff.xyz',
		icon: FileCode,
		category: 'security',
		tags: ['diff', 'compare', 'contracts', 'verification'],
		color: '#10B981'
	},

	// ========== Monitoring & Alerts ==========
	{
		id: 'forta',
		name: 'Forta',
		descriptionKey: 'chain-tools.tools.forta.description',
		url: 'https://forta.org',
		icon: Bell,
		category: 'security',
		tags: ['monitoring', 'threat-detection', 'bots', 'alerts'],
		color: '#7C3AED'
	},
	{
		id: 'chainalysis',
		name: 'Chainalysis',
		descriptionKey: 'chain-tools.tools.chainalysis.description',
		url: 'https://www.chainalysis.com',
		icon: Eye,
		category: 'security',
		tags: ['compliance', 'investigation', 'enterprise'],
		color: '#0066FF'
	},
	{
		id: 'hexagate',
		name: 'Hexagate',
		descriptionKey: 'chain-tools.tools.hexagate.description',
		url: 'https://www.hexagate.com',
		icon: Shield,
		category: 'security',
		tags: ['monitoring', 'security', 'real-time', 'threats'],
		color: '#6366F1'
	},
	{
		id: 'hypernative',
		name: 'Hypernative',
		descriptionKey: 'chain-tools.tools.hypernative.description',
		url: 'https://www.hypernative.io',
		icon: Shield,
		category: 'security',
		tags: ['monitoring', 'security', 'prevention', 'ai'],
		color: '#14B8A6'
	},
	{
		id: 'chainalert',
		name: 'ChainAlert',
		descriptionKey: 'chain-tools.tools.chainalert.description',
		url: 'https://chainalert.io',
		icon: Bell,
		category: 'security',
		tags: ['alerts', 'monitoring', 'security', 'notifications'],
		color: '#EF4444'
	},

	// ========== Wallet Protection ==========
	{
		id: 'webacy',
		name: 'Webacy',
		descriptionKey: 'chain-tools.tools.webacy.description',
		url: 'https://webacy.com',
		icon: Shield,
		category: 'security',
		tags: ['backup', 'recovery', 'inheritance', 'wallet-safety'],
		color: '#8B5CF6'
	},
	{
		id: 'harpie',
		name: 'Harpie',
		descriptionKey: 'chain-tools.tools.harpie.description',
		url: 'https://harpie.io',
		icon: Shield,
		category: 'security',
		tags: ['firewall', 'protection', 'scam', 'wallet-security'],
		color: '#00D395'
	},
	{
		id: 'blowfish',
		name: 'Blowfish',
		descriptionKey: 'chain-tools.tools.blowfish.description',
		url: 'https://blowfish.xyz',
		icon: Shield,
		category: 'security',
		tags: ['simulation', 'transaction', 'preview', 'protection'],
		color: '#3B82F6'
	},
	{
		id: 'stelo',
		name: 'Stelo',
		descriptionKey: 'chain-tools.tools.stelo.description',
		url: 'https://stelolabs.com',
		icon: Shield,
		category: 'security',
		tags: ['transaction', 'preview', 'simulation', 'security'],
		color: '#000000'
	},
	{
		id: 'fire',
		name: 'Fire',
		descriptionKey: 'chain-tools.tools.fire.description',
		url: 'https://www.joinfire.xyz',
		icon: Shield,
		category: 'security',
		tags: ['transaction', 'simulation', 'protection', 'wallet'],
		color: '#EF4444'
	},
	{
		id: 'wallet-guard',
		name: 'Wallet Guard',
		descriptionKey: 'chain-tools.tools.wallet_guard.description',
		url: 'https://www.walletguard.app',
		icon: Shield,
		category: 'security',
		tags: ['extension', 'protection', 'phishing', 'scam'],
		color: '#22C55E'
	},
	{
		id: 'scamsniffer',
		name: 'ScamSniffer',
		descriptionKey: 'chain-tools.tools.scamsniffer.description',
		url: 'https://scamsniffer.io',
		icon: Bug,
		category: 'security',
		tags: ['scam', 'detection', 'phishing', 'protection'],
		color: '#EF4444'
	},

	// ========== Audit Platforms ==========
	{
		id: 'peckshield',
		name: 'PeckShield',
		descriptionKey: 'chain-tools.tools.peckshield.description',
		url: 'https://peckshield.com',
		icon: Shield,
		category: 'security',
		tags: ['audit', 'security', 'research', 'analysis'],
		color: '#0052FF'
	},
	{
		id: 'slowmist',
		name: 'SlowMist',
		descriptionKey: 'chain-tools.tools.slowmist.description',
		url: 'https://www.slowmist.com',
		icon: Shield,
		category: 'security',
		tags: ['audit', 'security', 'research', 'investigation'],
		color: '#1E40AF'
	},
	{
		id: 'quantstamp',
		name: 'Quantstamp',
		descriptionKey: 'chain-tools.tools.quantstamp.description',
		url: 'https://quantstamp.com',
		icon: Shield,
		category: 'security',
		tags: ['audit', 'security', 'research', 'enterprise'],
		color: '#2962FF'
	},
	{
		id: 'consensys-diligence',
		name: 'ConsenSys Diligence',
		descriptionKey: 'chain-tools.tools.consensys_diligence.description',
		url: 'https://consensys.io/diligence',
		icon: Shield,
		category: 'security',
		tags: ['audit', 'security', 'fuzzing', 'tools'],
		color: '#1E40AF'
	},
	{
		id: 'spearbit',
		name: 'Spearbit',
		descriptionKey: 'chain-tools.tools.spearbit.description',
		url: 'https://spearbit.com',
		icon: Shield,
		category: 'security',
		tags: ['audit', 'security', 'research', 'experts'],
		color: '#EF4444'
	},

	// ========== Privacy Tools ==========
	{
		id: 'railgun',
		name: 'Railgun',
		descriptionKey: 'chain-tools.tools.railgun.description',
		url: 'https://railgun.org',
		icon: Shield,
		category: 'security',
		tags: ['privacy', 'zk-snark', 'defi', 'shielded'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'BNB Chain'],
		color: '#2D3748'
	},
	{
		id: 'aztec',
		name: 'Aztec',
		descriptionKey: 'chain-tools.tools.aztec.description',
		url: 'https://aztec.network',
		icon: Shield,
		category: 'security',
		tags: ['privacy', 'zk-rollup', 'programmable', 'l2'],
		chains: ['Ethereum'],
		color: '#4A5568'
	},
	{
		id: 'nocturne',
		name: 'Nocturne',
		descriptionKey: 'chain-tools.tools.nocturne.description',
		url: 'https://nocturne.xyz',
		icon: Shield,
		category: 'security',
		tags: ['privacy', 'stealth', 'defi', 'ethereum'],
		chains: ['Ethereum'],
		color: '#1A1A2E'
	},
	{
		id: 'umbra',
		name: 'Umbra',
		descriptionKey: 'chain-tools.tools.umbra.description',
		url: 'https://umbra.cash',
		icon: Shield,
		category: 'security',
		tags: ['privacy', 'stealth-addresses', 'payments', 'multichain'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Gnosis'],
		color: '#553C9A'
	},
	{
		id: 'labyrinth',
		name: 'Labyrinth',
		descriptionKey: 'chain-tools.tools.labyrinth.description',
		url: 'https://labyrinth.technology',
		icon: Shield,
		category: 'security',
		tags: ['privacy', 'compliance', 'zkp', 'institutional'],
		chains: ['Ethereum'],
		color: '#0D1117'
	},
	{
		id: 'elusiv',
		name: 'Elusiv',
		descriptionKey: 'chain-tools.tools.elusiv.description',
		url: 'https://elusiv.io',
		icon: Shield,
		category: 'security',
		tags: ['privacy', 'solana', 'zk', 'compliant'],
		chains: ['Solana'],
		color: '#14F195'
	},
	{
		id: 'zcash',
		name: 'Zcash',
		descriptionKey: 'chain-tools.tools.zcash.description',
		url: 'https://z.cash',
		icon: Shield,
		category: 'security',
		tags: ['privacy', 'shielded', 'zk-snark', 'native'],
		chains: ['Zcash'],
		color: '#F4B728'
	},

	// ========== Audit Contests & Platforms ==========
	{
		id: 'code4rena',
		name: 'Code4rena',
		descriptionKey: 'chain-tools.tools.code4rena.description',
		url: 'https://code4rena.com',
		icon: Shield,
		category: 'security',
		tags: ['audit', 'contest', 'community', 'security'],
		chains: ['Ethereum', 'Solana'],
		color: '#22C55E'
	},
	{
		id: 'sherlock',
		name: 'Sherlock',
		descriptionKey: 'chain-tools.tools.sherlock.description',
		url: 'https://sherlock.xyz',
		icon: Shield,
		category: 'security',
		tags: ['audit', 'insurance', 'contest', 'coverage'],
		chains: ['Ethereum'],
		color: '#8B5CF6'
	},

	// ========== New Security Tools ==========
	{
		id: 'chainsecurity',
		name: 'ChainSecurity',
		descriptionKey: 'chain-tools.tools.chainsecurity.description',
		url: 'https://chainsecurity.com',
		icon: Shield,
		category: 'security',
		tags: ['audit', 'research', 'formal-verification', 'enterprise'],
		color: '#3B82F6'
	},
	{
		id: 'trail-of-bits',
		name: 'Trail of Bits',
		descriptionKey: 'chain-tools.tools.trail_of_bits.description',
		url: 'https://trailofbits.com',
		icon: Shield,
		category: 'security',
		tags: ['audit', 'research', 'tools', 'security'],
		color: '#EF4444'
	},
	{
		id: 'openzeppelin-defender',
		name: 'OpenZeppelin Defender',
		descriptionKey: 'chain-tools.tools.openzeppelin_defender.description',
		url: 'https://defender.openzeppelin.com',
		icon: Shield,
		category: 'security',
		tags: ['automation', 'monitoring', 'admin', 'ops'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism'],
		color: '#4E5EE4'
	},
	{
		id: 'halborn',
		name: 'Halborn',
		descriptionKey: 'chain-tools.tools.halborn.description',
		url: 'https://halborn.com',
		icon: Shield,
		category: 'security',
		tags: ['audit', 'pentest', 'advisory', 'enterprise'],
		color: '#000000'
	},
	{
		id: 'zellic',
		name: 'Zellic',
		descriptionKey: 'chain-tools.tools.zellic.description',
		url: 'https://zellic.io',
		icon: Shield,
		category: 'security',
		tags: ['audit', 'zk', 'research', 'security'],
		color: '#6366F1'
	},
	{
		id: 'veridise',
		name: 'Veridise',
		descriptionKey: 'chain-tools.tools.veridise.description',
		url: 'https://veridise.com',
		icon: Shield,
		category: 'security',
		tags: ['formal-verification', 'zk', 'audit', 'tooling'],
		color: '#8B5CF6'
	},
	{
		id: 'pessimistic',
		name: 'Pessimistic',
		descriptionKey: 'chain-tools.tools.pessimistic.description',
		url: 'https://pessimistic.io',
		icon: Shield,
		category: 'security',
		tags: ['audit', 'security', 'research', 'analysis'],
		color: '#F97316'
	},
	{
		id: 'cyfrin',
		name: 'Cyfrin',
		descriptionKey: 'chain-tools.tools.cyfrin.description',
		url: 'https://cyfrin.io',
		icon: Shield,
		category: 'security',
		tags: ['audit', 'education', 'codehawks', 'security'],
		color: '#22C55E'
	},
	{
		id: 'guardian-audits',
		name: 'Guardian Audits',
		descriptionKey: 'chain-tools.tools.guardian_audits.description',
		url: 'https://guardianaudits.com',
		icon: Shield,
		category: 'security',
		tags: ['audit', 'defi', 'security', 'review'],
		color: '#0EA5E9'
	},
	{
		id: 'yaudit',
		name: 'yAudit',
		descriptionKey: 'chain-tools.tools.yaudit.description',
		url: 'https://yaudit.dev',
		icon: Shield,
		category: 'security',
		tags: ['audit', 'yearn', 'review', 'security'],
		color: '#0052FF'
	}
];
