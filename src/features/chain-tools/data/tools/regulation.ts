/**
 * Regulation Tools - Global Crypto Policies & Legal Resources
 *
 * Categories:
 * - US Regulatory Bodies
 * - EU/UK Regulation
 * - Asia-Pacific Regulation
 * - Middle East & Africa
 * - Global Organizations
 * - Legal Resources & Research
 * - Compliance Tools
 */
import { Scale, Landmark, Globe, FileText, Shield, BookOpen, Map, Users } from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const regulationTools: ExternalTool[] = [
	// ========== US Regulatory Bodies ==========
	{
		id: 'sec-crypto',
		name: 'SEC (US)',
		descriptionKey: 'chain_tools.tools.sec_crypto.description',
		url: 'https://www.sec.gov/spotlight/cybersecurity',
		icon: Landmark,
		category: 'regulation',
		tags: ['us', 'securities', 'enforcement', 'sec'],
		color: '#002868',
		isFeatured: true
	},
	{
		id: 'cftc-crypto',
		name: 'CFTC (US)',
		descriptionKey: 'chain_tools.tools.cftc_crypto.description',
		url: 'https://www.cftc.gov/digitalassets',
		icon: Landmark,
		category: 'regulation',
		tags: ['us', 'commodities', 'derivatives', 'cftc'],
		color: '#002868',
		isFeatured: true
	},
	{
		id: 'fincen-crypto',
		name: 'FinCEN (US)',
		descriptionKey: 'chain_tools.tools.fincen_crypto.description',
		url: 'https://www.fincen.gov/resources/statutes-and-regulations/guidance',
		icon: Shield,
		category: 'regulation',
		tags: ['us', 'aml', 'kyc', 'fincen'],
		color: '#002868'
	},
	{
		id: 'occ-crypto',
		name: 'OCC (US)',
		descriptionKey: 'chain_tools.tools.occ_crypto.description',
		url: 'https://www.occ.gov/topics/digital-assets/index.html',
		icon: Landmark,
		category: 'regulation',
		tags: ['us', 'banking', 'custody', 'occ'],
		color: '#002868'
	},
	{
		id: 'fed-crypto',
		name: 'Federal Reserve',
		descriptionKey: 'chain_tools.tools.fed_crypto.description',
		url: 'https://www.federalreserve.gov/central-bank-digital-currency.htm',
		icon: Landmark,
		category: 'regulation',
		tags: ['us', 'cbdc', 'stablecoin', 'fed'],
		color: '#002868'
	},
	{
		id: 'nydfs-crypto',
		name: 'NYDFS BitLicense',
		descriptionKey: 'chain_tools.tools.nydfs_crypto.description',
		url: 'https://www.dfs.ny.gov/virtual_currency_businesses',
		icon: FileText,
		category: 'regulation',
		tags: ['us', 'new-york', 'bitlicense', 'state'],
		color: '#002868'
	},
	// ========== EU & UK Regulation ==========
	{
		id: 'mica-eu',
		name: 'MiCA (EU)',
		descriptionKey: 'chain_tools.tools.mica_eu.description',
		url: 'https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/markets-crypto-assets-regulation-mica',
		icon: Scale,
		category: 'regulation',
		tags: ['eu', 'mica', 'comprehensive', 'framework'],
		color: '#003399',
		isFeatured: true
	},
	{
		id: 'esma-crypto',
		name: 'ESMA (EU)',
		descriptionKey: 'chain_tools.tools.esma_crypto.description',
		url: 'https://www.esma.europa.eu',
		icon: Landmark,
		category: 'regulation',
		tags: ['eu', 'securities', 'esma', 'markets'],
		color: '#003399'
	},
	{
		id: 'eba-crypto',
		name: 'EBA (EU)',
		descriptionKey: 'chain_tools.tools.eba_crypto.description',
		url: 'https://www.eba.europa.eu/regulation-and-policy/crypto-assets',
		icon: Landmark,
		category: 'regulation',
		tags: ['eu', 'banking', 'eba', 'prudential'],
		color: '#003399'
	},
	{
		id: 'fca-crypto',
		name: 'FCA (UK)',
		descriptionKey: 'chain_tools.tools.fca_crypto.description',
		url: 'https://www.fca.org.uk/consumers/cryptoassets',
		icon: Landmark,
		category: 'regulation',
		tags: ['uk', 'fca', 'registration', 'consumer'],
		color: '#012169',
		isFeatured: true
	},
	{
		id: 'bafin-crypto',
		name: 'BaFin (Germany)',
		descriptionKey: 'chain_tools.tools.bafin_crypto.description',
		url: 'https://www.bafin.de/EN/Aufsicht/FinTech/VirtualCurrency/virtual_currency_node_en.html',
		icon: Landmark,
		category: 'regulation',
		tags: ['germany', 'bafin', 'custody', 'licensing'],
		color: '#000000'
	},
	{
		id: 'amf-crypto',
		name: 'AMF (France)',
		descriptionKey: 'chain_tools.tools.amf_crypto.description',
		url: 'https://www.amf-france.org/en/news-publications/dossiers-thematiques/digital-finance',
		icon: Landmark,
		category: 'regulation',
		tags: ['france', 'amf', 'psan', 'dasp'],
		color: '#002654'
	},
	{
		id: 'finma-crypto',
		name: 'FINMA (Switzerland)',
		descriptionKey: 'chain_tools.tools.finma_crypto.description',
		url: 'https://www.finma.ch/en/finma-public/fintech/',
		icon: Landmark,
		category: 'regulation',
		tags: ['switzerland', 'finma', 'crypto-valley', 'banking'],
		color: '#FF0000'
	},
	// ========== Asia-Pacific Regulation ==========
	{
		id: 'hkma-crypto',
		name: 'HKMA (Hong Kong)',
		descriptionKey: 'chain_tools.tools.hkma_crypto.description',
		url: 'https://www.hkma.gov.hk/eng/key-functions/international-financial-centre/fintech/',
		icon: Landmark,
		category: 'regulation',
		tags: ['hong-kong', 'hkma', 'vasp', 'licensing'],
		color: '#DE2910',
		isFeatured: true
	},
	{
		id: 'sfc-hk',
		name: 'SFC (Hong Kong)',
		descriptionKey: 'chain_tools.tools.sfc_hk.description',
		url: 'https://www.sfc.hk/en/Welcome-to-the-Fintech-Contact-Point/Virtual-assets',
		icon: Landmark,
		category: 'regulation',
		tags: ['hong-kong', 'sfc', 'vasp', 'exchange'],
		color: '#DE2910'
	},
	{
		id: 'mas-crypto',
		name: 'MAS (Singapore)',
		descriptionKey: 'chain_tools.tools.mas_crypto.description',
		url: 'https://www.mas.gov.sg/regulation/digital-token-offerings',
		icon: Landmark,
		category: 'regulation',
		tags: ['singapore', 'mas', 'psa', 'licensing'],
		color: '#ED2939',
		isFeatured: true
	},
	{
		id: 'jfsa-crypto',
		name: 'JFSA (Japan)',
		descriptionKey: 'chain_tools.tools.jfsa_crypto.description',
		url: 'https://www.fsa.go.jp/en/policy/virtual_currency/index.html',
		icon: Landmark,
		category: 'regulation',
		tags: ['japan', 'jfsa', 'exchange', 'registration'],
		color: '#BC002D'
	},
	{
		id: 'fsc-korea',
		name: 'FSC (South Korea)',
		descriptionKey: 'chain_tools.tools.fsc_korea.description',
		url: 'https://www.fsc.go.kr/eng/index.do',
		icon: Landmark,
		category: 'regulation',
		tags: ['korea', 'fsc', 'vasp', 'travel-rule'],
		color: '#003478'
	},
	{
		id: 'asic-crypto',
		name: 'ASIC (Australia)',
		descriptionKey: 'chain_tools.tools.asic_crypto.description',
		url: 'https://asic.gov.au/regulatory-resources/digital-assets/',
		icon: Landmark,
		category: 'regulation',
		tags: ['australia', 'asic', 'licensing', 'consumer'],
		color: '#00008B'
	},
	{
		id: 'rbi-crypto',
		name: 'RBI (India)',
		descriptionKey: 'chain_tools.tools.rbi_crypto.description',
		url: 'https://www.rbi.org.in',
		icon: Landmark,
		category: 'regulation',
		tags: ['india', 'rbi', 'cbdc', 'banking'],
		color: '#FF9933'
	},
	// ========== Middle East & Africa ==========
	{
		id: 'vara-dubai',
		name: 'VARA (Dubai)',
		descriptionKey: 'chain_tools.tools.vara_dubai.description',
		url: 'https://vara.ae',
		icon: Landmark,
		category: 'regulation',
		tags: ['dubai', 'vara', 'vasp', 'comprehensive'],
		color: '#00732F',
		isFeatured: true
	},
	{
		id: 'adgm-crypto',
		name: 'ADGM (Abu Dhabi)',
		descriptionKey: 'chain_tools.tools.adgm_crypto.description',
		url: 'https://www.adgm.com/setting-up/digital-assets',
		icon: Landmark,
		category: 'regulation',
		tags: ['abu-dhabi', 'adgm', 'framework', 'sandbox'],
		color: '#00732F'
	},
	{
		id: 'sama-crypto',
		name: 'SAMA (Saudi Arabia)',
		descriptionKey: 'chain_tools.tools.sama_crypto.description',
		url: 'https://www.sama.gov.sa/en-US/pages/default.aspx',
		icon: Landmark,
		category: 'regulation',
		tags: ['saudi', 'sama', 'cbdc', 'banking'],
		color: '#006C35'
	},
	{
		id: 'sarb-crypto',
		name: 'SARB (South Africa)',
		descriptionKey: 'chain_tools.tools.sarb_crypto.description',
		url: 'https://www.resbank.co.za/en/home/what-we-do/fintech',
		icon: Landmark,
		category: 'regulation',
		tags: ['south-africa', 'sarb', 'casp', 'framework'],
		color: '#007749'
	},
	// ========== Americas (Non-US) ==========
	{
		id: 'csa-crypto',
		name: 'CSA (Canada)',
		descriptionKey: 'chain_tools.tools.csa_crypto.description',
		url: 'https://www.securities-administrators.ca/crypto-assets/',
		icon: Landmark,
		category: 'regulation',
		tags: ['canada', 'csa', 'securities', 'registration'],
		color: '#FF0000'
	},
	{
		id: 'cnbv-crypto',
		name: 'CNBV (Mexico)',
		descriptionKey: 'chain_tools.tools.cnbv_crypto.description',
		url: 'https://www.gob.mx/cnbv',
		icon: Landmark,
		category: 'regulation',
		tags: ['mexico', 'cnbv', 'fintech-law', 'sandbox'],
		color: '#006847'
	},
	{
		id: 'bcra-crypto',
		name: 'BCRA (Argentina)',
		descriptionKey: 'chain_tools.tools.bcra_crypto.description',
		url: 'https://www.bcra.gob.ar',
		icon: Landmark,
		category: 'regulation',
		tags: ['argentina', 'bcra', 'restrictions', 'banking'],
		color: '#74ACDF'
	},
	{
		id: 'cvm-brazil',
		name: 'CVM (Brazil)',
		descriptionKey: 'chain_tools.tools.cvm_brazil.description',
		url: 'https://www.gov.br/cvm/pt-br',
		icon: Landmark,
		category: 'regulation',
		tags: ['brazil', 'cvm', 'securities', 'framework'],
		color: '#009B3A'
	},
	// ========== Global Organizations ==========
	{
		id: 'fatf-crypto',
		name: 'FATF',
		descriptionKey: 'chain_tools.tools.fatf_crypto.description',
		url: 'https://www.fatf-gafi.org/en/topics/virtual-assets.html',
		icon: Globe,
		category: 'regulation',
		tags: ['global', 'fatf', 'aml', 'travel-rule'],
		color: '#0033A0',
		isFeatured: true
	},
	{
		id: 'bis-crypto',
		name: 'BIS',
		descriptionKey: 'chain_tools.tools.bis_crypto.description',
		url: 'https://www.bis.org/topics/fintech.htm',
		icon: Globe,
		category: 'regulation',
		tags: ['global', 'bis', 'cbdc', 'central-bank'],
		color: '#002855'
	},
	{
		id: 'fsb-crypto',
		name: 'FSB',
		descriptionKey: 'chain_tools.tools.fsb_crypto.description',
		url: 'https://www.fsb.org/work-of-the-fsb/financial-innovation-and-structural-change/crypto-assets/',
		icon: Globe,
		category: 'regulation',
		tags: ['global', 'fsb', 'stability', 'stablecoin'],
		color: '#003366'
	},
	{
		id: 'iosco-crypto',
		name: 'IOSCO',
		descriptionKey: 'chain_tools.tools.iosco_crypto.description',
		url: 'https://www.iosco.org/publications/?subsection=crypto_assets',
		icon: Globe,
		category: 'regulation',
		tags: ['global', 'iosco', 'securities', 'standards'],
		color: '#1E3A5F'
	},
	// ========== Legal Resources & Research ==========
	{
		id: 'coinbase-legal',
		name: 'Coinbase Legal Hub',
		descriptionKey: 'chain_tools.tools.coinbase_legal.description',
		url: 'https://www.coinbase.com/legal',
		icon: BookOpen,
		category: 'regulation',
		tags: ['legal', 'policy', 'coinbase', 'advocacy'],
		color: '#0052FF'
	},
	{
		id: 'a16z-policy',
		name: 'a16z Policy Hub',
		descriptionKey: 'chain_tools.tools.a16z_policy.description',
		url: 'https://a16zcrypto.com/posts/category/policy',
		icon: BookOpen,
		category: 'regulation',
		tags: ['policy', 'advocacy', 'research', 'proposals'],
		color: '#FF6B35'
	},
	{
		id: 'blockchain-association',
		name: 'Blockchain Association',
		descriptionKey: 'chain_tools.tools.blockchain_association.description',
		url: 'https://theblockchainassociation.org',
		icon: Users,
		category: 'regulation',
		tags: ['us', 'advocacy', 'lobby', 'industry'],
		color: '#3B82F6'
	},
	{
		id: 'coin-center',
		name: 'Coin Center',
		descriptionKey: 'chain_tools.tools.coin_center.description',
		url: 'https://www.coincenter.org',
		icon: BookOpen,
		category: 'regulation',
		tags: ['us', 'advocacy', 'research', 'nonprofit'],
		color: '#F59E0B'
	},
	{
		id: 'atlanticcouncil-cbdc',
		name: 'CBDC Tracker',
		descriptionKey: 'chain_tools.tools.atlanticcouncil_cbdc.description',
		url: 'https://www.atlanticcouncil.org/cbdctracker/',
		icon: Map,
		category: 'regulation',
		tags: ['cbdc', 'global', 'tracker', 'research'],
		color: '#1E40AF',
		isFeatured: true
	},
	{
		id: 'global-crypto-map',
		name: 'Global Crypto Regulation Map',
		descriptionKey: 'chain_tools.tools.global_crypto_map.description',
		url: 'https://www.complyadvantage.com/insights/cryptocurrency-regulations-around-world/',
		icon: Map,
		category: 'regulation',
		tags: ['global', 'map', 'comparison', 'status'],
		color: '#6366F1'
	},
	// ========== Compliance Tools ==========
	{
		id: 'chainalysis-compliance',
		name: 'Chainalysis',
		descriptionKey: 'chain_tools.tools.chainalysis_compliance.description',
		url: 'https://www.chainalysis.com',
		icon: Shield,
		category: 'regulation',
		tags: ['compliance', 'aml', 'tracing', 'enterprise'],
		color: '#0052FF',
		isFeatured: true
	},
	{
		id: 'elliptic-compliance',
		name: 'Elliptic',
		descriptionKey: 'chain_tools.tools.elliptic_compliance.description',
		url: 'https://www.elliptic.co',
		icon: Shield,
		category: 'regulation',
		tags: ['compliance', 'aml', 'screening', 'enterprise'],
		color: '#00D395'
	},
	{
		id: 'trm-labs',
		name: 'TRM Labs',
		descriptionKey: 'chain_tools.tools.trm_labs.description',
		url: 'https://www.trmlabs.com',
		icon: Shield,
		category: 'regulation',
		tags: ['compliance', 'aml', 'investigation', 'enterprise'],
		color: '#1E40AF'
	},
	{
		id: 'merkle-science',
		name: 'Merkle Science',
		descriptionKey: 'chain_tools.tools.merkle_science.description',
		url: 'https://www.merklescience.com',
		icon: Shield,
		category: 'regulation',
		tags: ['compliance', 'aml', 'risk', 'asia'],
		color: '#6366F1'
	},
	{
		id: 'notabene-travel',
		name: 'Notabene',
		descriptionKey: 'chain_tools.tools.notabene_travel.description',
		url: 'https://notabene.id',
		icon: FileText,
		category: 'regulation',
		tags: ['compliance', 'travel-rule', 'vasp', 'messaging'],
		color: '#FF6B35'
	},
	{
		id: 'sumsub-kyc',
		name: 'Sumsub',
		descriptionKey: 'chain_tools.tools.sumsub_kyc.description',
		url: 'https://sumsub.com',
		icon: Shield,
		category: 'regulation',
		tags: ['kyc', 'verification', 'identity', 'compliance'],
		color: '#4F46E5'
	}
];
