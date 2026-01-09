import type { PageLoad } from './$types';
import type { Step } from '$lib/components/ui/step-indicator.svelte';
import { createWebAppData, createHowToData, type HowToStepData } from '$lib/utils/structured-data';
import { buildCanonicalUrl } from '$utils/common';

export const load: PageLoad = ({ url }) => {
	const canonical = buildCanonicalUrl(url);
	const image = `${url.origin}/og-nft-deployer.png`;

	// Define steps with both SEO text and UI description
	const steps: HowToStepData[] = [
		{
			name: 'Connect Your Wallet',
			text: 'Click the "Connect Wallet" button and select your preferred Web3 wallet provider (MetaMask, WalletConnect, Coinbase Wallet, etc.). Choose the blockchain network where you want to deploy your NFT contract.',
			description: 'Connect wallet and select network'
		},
		{
			name: 'Check Dependencies',
			text: 'Verify that all required smart contracts are deployed on your selected network, including CREATE2 Proxy, Multicall3, BiuBiuPremium, and NFTFactory. If any dependencies are missing, deploy them using the provided deployment tools.',
			description: 'Verify network and contracts'
		},
		{
			name: 'Configure NFT',
			text: 'Enter your NFT collection details including name, symbol, and base URI. Configure minting options such as public mint and stake-to-mint mechanism. If stake-to-mint is enabled, specify the stake token address and amount required.',
			description: 'Set NFT parameters and minting options'
		},
		{
			name: 'Review and Deploy',
			text: 'Review all your configuration settings to ensure everything is correct. When ready, click the "Deploy Contract" button and confirm the transaction in your wallet. Wait for blockchain confirmation to get your NFT contract address.',
			description: 'Review settings and deploy'
		}
	];

	// Create UI steps from HowToStepData
	const uiSteps: Step[] = steps.map((step) => ({
		label: step.name,
		description: step.description
	}));

	// Generate structured data from steps config
	const webAppData = createWebAppData({
		name: 'NFT Deployer',
		description:
			'Deploy NFT smart contracts in minutes using NFTFactory. Support for ERC-721 with stake-to-mint mechanism. Automatic dependency checking and streamlined deployment process. No coding required.',
		canonical,
		features: [
			'NFTFactory integration',
			'Stake-to-mint mechanism',
			'No coding required',
			'Automatic dependency checking',
			'Gas-optimized deployment',
			'Multi-chain support (Ethereum, Polygon, BSC, Arbitrum, Optimism, Base)'
		]
	});

	const howToData = createHowToData({
		name: 'How to Deploy NFT Smart Contracts with NFT Deployer',
		description:
			'Step-by-step guide to deploy your own NFT smart contract using BiuBiu NFT Deployer tool. Integrated with NFTFactory for streamlined deployment with stake-to-mint support.',
		canonical,
		image,
		steps,
		tools: ['Web3 Wallet (MetaMask, WalletConnect, etc.)', 'ETH or native token for gas fees']
	});

	return {
		meta: {
			title: 'NFT Deployer - Deploy NFT Smart Contracts | BiuBiu Tools',
			description:
				'Deploy NFT smart contracts in minutes using NFTFactory. Support for ERC-721 with stake-to-mint mechanism. Automatic dependency checking and streamlined deployment without coding.',
			keywords:
				'nft deployer, create nft, deploy nft contract, erc721, nft factory, stake to mint, nft smart contract, web3 tools, ethereum tools, polygon nft, nft creator',
			canonical,
			type: 'website' as const,
			image,
			locale: 'en_US'
		},
		steps: uiSteps,
		structuredData: [webAppData, howToData]
	};
};
