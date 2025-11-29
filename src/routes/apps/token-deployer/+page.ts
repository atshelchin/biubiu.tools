import type { PageLoad } from './$types';
import type { HowToStepData } from '$lib/utils/structured-data';
import type { Step } from '$lib/components/ui/step-indicator.svelte';
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
			name: 'Check Dependencies',
			text: 'Verify that all required contracts are deployed on the selected network. This includes the TokenFactory contract, CREATE2 Proxy, Multicall3, and BiuBiuPremium membership contract.',
			description: 'Verify network and required contracts'
		},
		{
			name: 'Configure Token',
			text: 'Enter your token name, symbol, decimals (usually 18), and initial supply. Optionally enable the mintable feature to allow minting new tokens after deployment.',
			description: 'Set token properties and features'
		},
		{
			name: 'Review and Deploy',
			text: 'Review all your token configuration, verify the deployment cost, and click "Deploy" to create your token. Sign the transaction with your wallet.',
			description: 'Review configuration and deploy token'
		}
	];

	// Create UI steps from HowToStepData
	const uiSteps: Step[] = steps.map((step) => ({
		label: step.name,
		description: step.description
	}));

	const webAppData = createWebAppData({
		name: 'Token Deployer',
		description:
			'Create and deploy custom ERC20 tokens with mintable feature on any EVM-compatible network',
		canonical,
		features: [
			'Connect Web3 wallet (MetaMask, WalletConnect, Coinbase Wallet)',
			'Support multiple EVM networks (Ethereum, BSC, Polygon, Arbitrum, etc.)',
			'Configure token name, symbol, decimals, and initial supply',
			'Optional mintable feature for creating new tokens after deployment',
			'Dependency checks for required contracts',
			'Gas cost estimation',
			'Instant deployment via TokenFactory contract'
		]
	});

	const howToData = createHowToData({
		name: 'How to Deploy an ERC20 Token',
		description:
			'Complete guide to creating and deploying custom ERC20 tokens with optional mintable feature',
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
		steps: uiSteps,
		structuredData: [webAppData, howToData]
	};
};
