import type { PageLoad } from './$types';
import type { HowToStepData } from '$lib/utils/structured-data';
import { createWebAppData, createHowToData } from '$lib/utils/structured-data';

export const load: PageLoad = ({ url }) => {
	const title = 'Token Deployer - Create & Deploy ERC20 Tokens | BiuBiu Tools';
	const description =
		'Deploy custom ERC20 tokens with advanced features including burn, pause, tax system, and anti-bot protection. Perfect for developers and community projects.';
	const keywords =
		'token deployer, ERC20, create token, deploy token, smart contract, token creator, DeFi, crypto token, blockchain';
	const canonical = url.origin + url.pathname;
	const type = 'website' as const;
	const image = `${url.origin}/og-token-deployer.png`;
	const locale = 'en_US';

	const steps: HowToStepData[] = [
		{
			name: 'Connect Your Wallet',
			text: 'Click the "Connect Wallet" button and connect your Web3 wallet (MetaMask, WalletConnect, etc.). Select the network where you want to deploy your token.',
			description: 'Connect wallet and select deployment network'
		},
		{
			name: 'Configure Basic Info',
			text: 'Enter your token name, symbol, decimals (usually 18), and initial supply. These fundamental properties define your token identity.',
			description: 'Set token name, symbol, decimals and supply'
		},
		{
			name: 'Set Advanced Parameters',
			text: 'Optionally enable advanced features like mintable, burnable, pausable, tax system, or anti-bot protection based on your needs.',
			description: 'Configure optional advanced features'
		},
		{
			name: 'Review and Deploy',
			text: 'Review all your token configuration, verify the deployment cost, and click "Deploy" to create your token. Sign the transaction with your wallet.',
			description: 'Review configuration and deploy token'
		}
	];

	const webAppData = createWebAppData({
		name: 'Token Deployer',
		description:
			'Create and deploy custom ERC20 tokens with advanced features on any EVM-compatible network',
		canonical,
		features: [
			'Connect Web3 wallet (MetaMask, WalletConnect, Coinbase Wallet)',
			'Support multiple EVM networks (Ethereum, BSC, Polygon, Arbitrum, etc.)',
			'Configure token name, symbol, decimals, and initial supply',
			'Optional features: Mintable, Burnable, Pausable',
			'Tax system with buy/sell fees',
			'Anti-bot protection (max transaction, max wallet, trading delay)',
			'Blacklist functionality',
			'Gas cost estimation',
			'Instant deployment'
		]
	});

	const howToData = createHowToData({
		name: 'How to Deploy an ERC20 Token',
		description:
			'Complete guide to creating and deploying custom ERC20 tokens with advanced features',
		canonical,
		image,
		steps,
		tools: ['Web3 Wallet (MetaMask, WalletConnect, etc.)', 'ETH or native token for gas fees']
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
