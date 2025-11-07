import type { PageLoad } from './$types';
import type { HowToStepData } from '$lib/utils/structured-data';
import { createWebAppData, createHowToData } from '$lib/utils/structured-data';

export const load: PageLoad = ({ url }) => {
	const title = 'Contract Events Scanner - Analyze Smart Contract Events | BiuBiu Tools';
	const description =
		'Professional tool to scan, analyze and export smart contract events from any blockchain. Fetch event logs, store in IndexedDB, and perform advanced analysis.';
	const keywords =
		'smart contract events, event scanner, blockchain events, contract logs, event analysis, web3 tools, ethereum events, event logs, contract monitoring';
	const canonical = url.origin + url.pathname;
	const type = 'website' as const;
	const image = `${url.origin}/og-contract-events-scanner.png`;
	const locale = 'en_US';

	const steps: HowToStepData[] = [
		{
			name: 'Connect Your Wallet',
			text: 'Connect your Web3 wallet (MetaMask, WalletConnect, etc.) to select the blockchain network you want to scan. This determines which network the contract events will be fetched from.',
			description: 'Connect wallet and select network'
		},
		{
			name: 'Configure Contract',
			text: 'Enter the smart contract address you want to monitor. Paste the contract ABI (JSON format) to automatically detect all available events. Select which specific event you want to scan.',
			description: 'Input contract address and ABI'
		},
		{
			name: 'Set Time Range',
			text: 'Choose the time period for scanning events. You can select by date range (e.g., last 7 days, last month) or by specific block numbers for precise control. Use presets for common ranges.',
			description: 'Define scanning time period'
		},
		{
			name: 'Scan Events',
			text: "Start the blockchain scan to fetch all matching events. The tool will query the blockchain in batches, decode the event data, and store results in your browser's IndexedDB for instant access.",
			description: 'Execute scan and store results'
		},
		{
			name: 'Analyze and Export Results',
			text: 'View scanned events in a detailed table with filtering and sorting options. Analyze event patterns, search for specific values, and export data to CSV or JSON format for further analysis.',
			description: 'View, filter, and export events'
		}
	];

	const webAppData = createWebAppData({
		name: 'Contract Events Scanner',
		description:
			'Professional tool for scanning and analyzing smart contract events across multiple blockchains',
		canonical,
		features: [
			'Connect Web3 wallet for network selection',
			'Support multiple networks (Ethereum, Polygon, BSC, Base, Arbitrum, Optimism)',
			'Automatic ABI parsing and event detection',
			'Flexible time range selection (dates or block numbers)',
			'Batch scanning with progress tracking',
			'Store events in browser IndexedDB',
			'Advanced filtering and search capabilities',
			'Real-time event decoding',
			'Export to CSV and JSON formats',
			'Event analytics and statistics',
			'No on-chain transactions (read-only)',
			'Professional data analysis tools'
		]
	});

	const howToData = createHowToData({
		name: 'How to Scan and Analyze Smart Contract Events',
		description:
			'Complete guide to scanning, storing, and analyzing blockchain contract events with professional tools',
		canonical,
		image,
		steps,
		tools: [
			'Web3 Wallet (MetaMask, WalletConnect, etc.)',
			'Contract address to monitor',
			'Contract ABI (Application Binary Interface)'
		]
	});

	return {
		meta: {
			title,
			description,
			keywords,
			canonical,
			type,
			image,
			locale
		},
		steps,
		structuredData: [webAppData, howToData]
	};
};
