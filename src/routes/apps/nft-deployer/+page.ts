import type { PageLoad } from './$types';
import { createWebAppData, createHowToData, type HowToStepData } from '$lib/utils/structured-data';

export const load: PageLoad = ({ url }) => {
	const canonical = url.origin + url.pathname;
	const image = `${url.origin}/og-nft-deployer.png`;

	// Define steps with both SEO text and UI description
	const steps: HowToStepData[] = [
		{
			name: 'Connect Your Wallet',
			text: 'Click the "Connect Wallet" button and select your preferred Web3 wallet provider (MetaMask, WalletConnect, Coinbase Wallet, etc.). Choose the blockchain network where you want to deploy your NFT contract.',
			description: 'Connect wallet and select network'
		},
		{
			name: 'Select NFT Standard',
			text: 'Choose the NFT standard that best fits your needs: ERC-721 for standard NFTs, ERC-721A for gas-optimized batch minting, or ERC-1155 for multi-token support. Each standard has different features and use cases.',
			description: 'Choose NFT standard (ERC-721, ERC-721A, ERC-1155)'
		},
		{
			name: 'Configure Basic Information',
			text: 'Enter your NFT collection name, symbol, and description. Optionally, provide a base URI for your token metadata. This information will be stored on the blockchain and displayed on NFT marketplaces.',
			description: 'Set name, symbol, and description'
		},
		{
			name: 'Configure Advanced Settings',
			text: 'Set up advanced features like max supply, mint price, royalties (EIP-2981), access control, and special features (pausable, burnable, revealable). These settings can help you manage your NFT collection effectively.',
			description: 'Configure pricing, royalties, and features'
		},
		{
			name: 'Review and Deploy',
			text: 'Review all your configuration settings to ensure everything is correct. When ready, click the "Deploy Contract" button and confirm the transaction in your wallet. Wait for blockchain confirmation to get your NFT contract address.',
			description: 'Review settings and deploy'
		}
	];

	// Generate structured data from steps config
	const webAppData = createWebAppData({
		name: 'NFT Deployer',
		description:
			'Deploy NFT smart contracts in minutes. Support for ERC-721, ERC-721A, and ERC-1155 standards with advanced features like royalties, access control, and more. No coding required.',
		canonical,
		features: [
			'ERC-721, ERC-721A, ERC-1155 support',
			'No coding required',
			'EIP-2981 royalty standard',
			'Access control & whitelist',
			'Gas-optimized deployment',
			'Multi-chain support (Ethereum, Polygon, BSC, Arbitrum, Optimism, Base)'
		]
	});

	const howToData = createHowToData({
		name: 'How to Deploy NFT Smart Contracts with NFT Deployer',
		description:
			'Step-by-step guide to deploy your own NFT smart contract using BiuBiu NFT Deployer tool. Support for multiple NFT standards and advanced features.',
		canonical,
		image,
		steps,
		tools: ['Web3 Wallet (MetaMask, WalletConnect, etc.)', 'ETH or native token for gas fees']
	});

	return {
		meta: {
			title: 'NFT Deployer - Deploy NFT Smart Contracts | BiuBiu Tools',
			description:
				'Deploy NFT smart contracts in minutes. Support for ERC-721, ERC-721A, and ERC-1155 standards. Configure royalties, access control, and advanced features without coding.',
			keywords:
				'nft deployer, create nft, deploy nft contract, erc721, erc721a, erc1155, nft smart contract, web3 tools, ethereum tools, polygon nft, nft royalties, nft creator',
			canonical,
			type: 'website' as const,
			image,
			locale: 'en_US'
		},
		steps,
		structuredData: [webAppData, howToData]
	};
};
