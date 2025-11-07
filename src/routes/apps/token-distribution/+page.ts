import type { PageLoad } from './$types';
import type { HowToStepData } from '$lib/utils/structured-data';
import { createWebAppData, createHowToData } from '$lib/utils/structured-data';

export const load: PageLoad = ({ url }) => {
	const title = 'Token Distribution - Batch Send Tokens to Multiple Wallets | BiuBiu Tools';
	const description =
		'Distribute tokens from one wallet to multiple recipients in a single transaction. Support for ETH, ERC20 tokens, and multiple blockchain networks.';
	const keywords =
		'token distribution, batch send, airdrop, token transfer, multi-send, batch transfer, crypto distribution, web3 tools';
	const canonical = url.origin + url.pathname;
	const type = 'website' as const;
	const image = `${url.origin}/og-token-distribution.png`;
	const locale = 'en_US';

	const steps: HowToStepData[] = [
		{
			name: 'Connect Your Wallet',
			text: 'Click the "Connect Wallet" button and connect your Web3 wallet (MetaMask, WalletConnect, etc.) to the application. This wallet will be the source of tokens for distribution.',
			description: 'Link your Web3 wallet as the source wallet'
		},
		{
			name: 'Check Source Balance',
			text: 'Select the blockchain network and verify your wallet has sufficient balance of the token you want to distribute, plus gas fees for the transactions.',
			description: 'Verify source wallet has sufficient balance'
		},
		{
			name: 'Select Token and Amount',
			text: 'Choose which token to distribute (native token or ERC20), set the distribution mode (equal amounts or custom per recipient), and specify the amount per recipient or total amount.',
			description: 'Configure token and distribution amounts'
		},
		{
			name: 'Import Recipients',
			text: 'Add recipient wallet addresses by manually entering them, uploading a CSV file, or pasting a list. Optionally set custom amounts for each recipient.',
			description: 'Add recipient wallet addresses'
		},
		{
			name: 'Review and Execute',
			text: 'Review the distribution summary including total amount, recipient count, and estimated gas costs. Confirm and execute the batch distribution. Sign each transaction with your wallet.',
			description: 'Execute the token distribution'
		}
	];

	const webAppData = createWebAppData({
		name: 'Token Distribution',
		description:
			'Batch distribute tokens from one wallet to multiple recipients across various blockchain networks',
		canonical,
		features: [
			'Connect Web3 wallet (MetaMask, WalletConnect, Coinbase Wallet)',
			'Support multiple networks (Ethereum, Polygon, BSC, Base, Arbitrum, Optimism)',
			'Distribute native tokens (ETH, BNB, MATIC) and ERC20 tokens',
			'Equal distribution or custom amounts per recipient',
			'Import recipients via CSV, paste, or manual entry',
			'Real-time balance checking and validation',
			'Gas cost estimation',
			'Batch transaction execution',
			'Transaction progress tracking'
		]
	});

	const howToData = createHowToData({
		name: 'How to Batch Distribute Tokens to Multiple Wallets',
		description:
			'Complete guide to distributing tokens from one wallet to multiple recipient addresses',
		canonical,
		image,
		steps,
		tools: ['Web3 Wallet (MetaMask, WalletConnect, etc.)', 'Sufficient token balance and gas fees']
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
