import type { PageLoad } from './$types';
import type { HowToStepData } from '$lib/utils/structured-data';
import { createWebAppData, createHowToData } from '$lib/utils/structured-data';

export const load: PageLoad = ({ url }) => {
	const title = 'DEX Moonshot Trader - Buy & Sell Tokens from DEXScreener Moonshot | BiuBiu Tools';
	const description =
		'Trade tokens that were created on DEXScreener Moonshot. Buy and sell tokens directly from your wallet with support for multiple blockchain networks.';
	const keywords =
		'dexscreener, moonshot, token trading, buy tokens, sell tokens, dex trading, web3 trading, crypto trading, token swap';
	const canonical = url.origin + url.pathname;
	const type = 'website' as const;
	const image = `${url.origin}/og-dex-moonshot-trader.png`;
	const locale = 'en_US';

	const steps: HowToStepData[] = [
		{
			name: 'Connect Your Wallet',
			text: 'Click the "Connect Wallet" button and connect your Web3 wallet (MetaMask, WalletConnect, etc.) to the application. Select the blockchain network where your token exists.',
			description: 'Link your Web3 wallet and select network'
		},
		{
			name: 'Enter Token Address',
			text: 'Input the contract address of the token you want to trade. The app will validate the contract and display token information including name, symbol, and your current balance.',
			description: 'Input and validate token contract address'
		},
		{
			name: 'Execute Trades',
			text: 'Choose to buy or sell the token. Set your desired amount and slippage tolerance, then execute the trade. Sign the transaction with your wallet to complete.',
			description: 'Buy or sell tokens with custom settings'
		}
	];

	const webAppData = createWebAppData({
		name: 'DEX Moonshot Trader',
		description:
			'Trade tokens from DEXScreener Moonshot across various blockchain networks with a simple web interface',
		canonical,
		features: [
			'Connect Web3 wallet (MetaMask, WalletConnect, Coinbase Wallet)',
			'Support multiple networks (Ethereum, Polygon, BSC, Base, Arbitrum, Optimism)',
			'Validate and display token information',
			'Buy tokens with native currency (ETH, BNB, MATIC)',
			'Sell tokens for native currency',
			'Adjustable slippage tolerance',
			'Real-time balance checking',
			'Non-custodial trading'
		]
	});

	const howToData = createHowToData({
		name: 'How to Trade Tokens from DEXScreener Moonshot',
		description: 'Complete guide to buying and selling tokens created on DEXScreener Moonshot',
		canonical,
		image,
		steps,
		tools: ['Web3 Wallet (MetaMask, WalletConnect, etc.)', 'Token contract address']
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
