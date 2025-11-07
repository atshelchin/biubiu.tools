import type { PageLoad } from './$types';
import type { HowToStepData } from '$lib/utils/structured-data';
import { createWebAppData, createHowToData } from '$lib/utils/structured-data';

export const load: PageLoad = ({ url }) => {
	const title = 'Token Balance Scanner - Batch Check Wallet Balances | BiuBiu Tools';
	const description =
		'Scan and aggregate token balances across multiple wallets. Check holdings for native tokens and ERC20 tokens, export results to CSV or JSON.';
	const keywords =
		'token balance, wallet scanner, batch balance check, crypto portfolio, token holdings, multi-wallet scanner, blockchain balance, web3 tools';
	const canonical = url.origin + url.pathname;
	const type = 'website' as const;
	const image = `${url.origin}/og-token-balance-scanner.png`;
	const locale = 'en_US';

	const steps: HowToStepData[] = [
		{
			name: 'Connect Your Wallet',
			text: 'Click the "Connect Wallet" button and connect your Web3 wallet to select the blockchain network you want to scan.',
			description: 'Connect wallet and select network'
		},
		{
			name: 'Select Tokens to Scan',
			text: 'Choose which tokens you want to check balances for. You can select native tokens (ETH, BNB, MATIC) and any ERC20 tokens available on the network.',
			description: 'Select tokens to scan'
		},
		{
			name: 'Import Wallet Addresses',
			text: 'Add wallet addresses to scan by pasting them (one per line), uploading a CSV/TXT file, or entering them manually. You can scan up to 1000 wallets at once.',
			description: 'Add wallet addresses to scan'
		},
		{
			name: 'Scan Balances',
			text: 'Click "Start Scanning" to query token balances across all wallets. The tool will fetch balance data from the blockchain and display progress in real-time.',
			description: 'Execute the balance scan'
		},
		{
			name: 'View and Export Results',
			text: 'Review the scanned balances in a table format, see total holdings for each token, and export the results to CSV or JSON format for further analysis.',
			description: 'View results and export data'
		}
	];

	const webAppData = createWebAppData({
		name: 'Token Balance Scanner',
		description:
			'Batch scan and aggregate token balances across multiple wallets on various blockchains',
		canonical,
		features: [
			'Connect Web3 wallet for network selection',
			'Support multiple networks (Ethereum, Polygon, BSC, Base, Arbitrum, Optimism)',
			'Scan native tokens (ETH, BNB, MATIC) and ERC20 token balances',
			'Import wallets via CSV, TXT, or manual entry',
			'Scan up to 1000 wallets at once',
			'Real-time scan progress tracking',
			'Aggregate total holdings across all wallets',
			'Export results to CSV or JSON',
			'No on-chain transactions required (read-only)'
		]
	});

	const howToData = createHowToData({
		name: 'How to Batch Scan Token Balances Across Multiple Wallets',
		description:
			'Complete guide to scanning and aggregating token balances for multiple wallet addresses',
		canonical,
		image,
		steps,
		tools: ['Web3 Wallet (MetaMask, WalletConnect, etc.)', 'List of wallet addresses to scan']
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
