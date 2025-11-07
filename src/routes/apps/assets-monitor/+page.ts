import type { PageLoad } from './$types';
import type { HowToStepData } from '$lib/utils/structured-data';
import { createWebAppData, createHowToData } from '$lib/utils/structured-data';

export const load: PageLoad = ({ url }) => {
	const title = 'Assets Monitor - Track Wallet Asset Movements | BiuBiu Tools';
	const description =
		'Monitor and analyze all asset movements in any wallet address. Track ETH, ERC20, ERC721, ERC1155 transfers with advanced analytics and local storage.';
	const keywords =
		'assets monitor, wallet tracker, transaction history, asset movements, ETH tracker, ERC20 tracker, NFT tracker, blockchain analytics, web3 tools';
	const canonical = url.origin + url.pathname;
	const type = 'website' as const;
	const image = `${url.origin}/og-assets-monitor.png`;
	const locale = 'en_US';

	const steps: HowToStepData[] = [
		{
			name: 'Connect Wallet',
			text: 'Connect your Web3 wallet and select the blockchain network you want to monitor.',
			description: 'Connect wallet and select network'
		},
		{
			name: 'Configure Scan Parameters',
			text: 'Enter wallet address to monitor, select time range or block range, and choose asset types (ETH, ERC20, ERC721, ERC1155).',
			description: 'Set scan parameters'
		},
		{
			name: 'Scan Asset Movements',
			text: 'Execute the scan to fetch all asset transfers. Results are stored locally in IndexedDB for fast access.',
			description: 'Scan blockchain for transfers'
		},
		{
			name: 'Analyze & Visualize',
			text: 'View detailed analytics, filter movements, check balance changes, and export results to CSV or JSON.',
			description: 'Analyze and export results'
		}
	];

	const webAppData = createWebAppData({
		name: 'Assets Monitor',
		description:
			'Professional asset monitoring tool for tracking wallet movements across multiple blockchain networks',
		canonical,
		features: [
			'Track ETH, ERC20, ERC721, ERC1155 transfers',
			'Custom time range and block range selection',
			'Real-time scanning with progress tracking',
			'Local storage with IndexedDB (Dexie.js)',
			'Advanced filtering and sorting',
			'Balance change analysis',
			'Asset statistics and analytics',
			'Export to CSV and JSON',
			'Multi-chain support (Ethereum, Polygon, BSC, Base, Arbitrum, Optimism)',
			'Read-only operations (no transactions)'
		]
	});

	const howToData = createHowToData({
		name: 'How to Monitor Wallet Asset Movements',
		description: 'Complete guide to tracking and analyzing blockchain asset transfers',
		canonical,
		image,
		steps,
		tools: ['Web3 Wallet (MetaMask, WalletConnect, etc.)', 'Wallet address to monitor']
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
