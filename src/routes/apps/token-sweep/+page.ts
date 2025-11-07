import type { PageLoad } from './$types';
import {
	createWebAppData,
	createHowToData,
	type HowToStepData
} from '@/features/token-sweep/utils/structured-data';

export const load: PageLoad = ({ url }) => {
	const canonical = url.origin + url.pathname;
	const image = `${url.origin}/og-token-sweep.png`;

	// Define steps with both SEO text and UI description
	const steps: HowToStepData[] = [
		{
			name: 'Connect Your Wallet',
			text: 'Click the "Connect Wallet" button and select your preferred Web3 wallet provider (MetaMask, WalletConnect, Coinbase Wallet, etc.). Approve the connection request in your wallet.',
			description: 'Link your Web3 wallet'
		},
		{
			name: 'Check Dependencies',
			text: 'Verify the blockchain network connection and ensure all required smart contracts are accessible. The system will automatically detect and validate the necessary components.',
			description: 'Verify network and contracts'
		},
		{
			name: 'Select Tokens',
			text: 'Choose which ERC20 tokens you want to sweep from the available list. You can select multiple tokens to transfer in a single batch operation.',
			description: 'Choose tokens to sweep'
		},
		{
			name: 'Import Wallets',
			text: 'Import the source wallet addresses that contain the tokens you want to sweep. You can add multiple wallet addresses to collect tokens from all of them.',
			description: 'Add source addresses'
		},
		{
			name: 'Confirm Sweep',
			text: 'Review the transaction summary including total tokens, gas fees, and destination address. Click "Execute Transfer" and confirm the transaction in your wallet. Wait for blockchain confirmation and view the transaction receipt.',
			description: 'Review and execute'
		}
	];

	// Generate structured data from steps config
	const webAppData = createWebAppData({
		name: 'Token Sweep',
		description:
			'Efficiently sweep and consolidate multiple ERC20 tokens across wallets. Support for Ethereum, Polygon, BSC, Arbitrum, Optimism, and Base networks.',
		canonical,
		features: [
			'Batch transfer ERC20 tokens',
			'Multi-network support (Ethereum, Polygon, BSC, Arbitrum, Optimism, Base)',
			'Gas optimization',
			'Secure wallet integration',
			'Real-time transaction tracking'
		]
	});

	const howToData = createHowToData({
		name: 'How to Batch Transfer ERC20 Tokens with Token Sweep',
		description:
			'Step-by-step guide to sweep and consolidate multiple ERC20 tokens across wallets using BiuBiu Token Sweep tool.',
		canonical,
		image,
		steps,
		tools: ['Web3 Wallet (MetaMask, WalletConnect, etc.)', 'ERC20 Tokens to transfer']
	});

	return {
		meta: {
			title: 'Token Sweep - Batch Transfer ERC20 Tokens | BiuBiu Tools',
			description:
				'Efficiently sweep and consolidate multiple ERC20 tokens across wallets. Support for Ethereum, Polygon, BSC, Arbitrum, Optimism, and Base networks. Fast, secure, and gas-optimized.',
			keywords:
				'token sweep, ERC20 transfer, batch transfer, crypto tools, web3 tools, ethereum tools, polygon tools, DeFi tools, token consolidation',
			canonical,
			type: 'website' as const,
			image,
			locale: 'en_US'
		},
		steps,
		structuredData: [webAppData, howToData]
	};
};
