import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
	const canonical = url.origin + url.pathname;

	return {
		meta: {
			title: 'Token Sweep - Batch Transfer ERC20 Tokens | BiuBiu Tools',
			description:
				'Efficiently sweep and consolidate multiple ERC20 tokens across wallets. Support for Ethereum, Polygon, BSC, Arbitrum, Optimism, and Base networks. Fast, secure, and gas-optimized.',
			keywords:
				'token sweep, ERC20 transfer, batch transfer, crypto tools, web3 tools, ethereum tools, polygon tools, DeFi tools, token consolidation',
			canonical,
			type: 'website' as const,
			image: `${url.origin}/og-token-sweep.png`, // You'll need to create this image
			locale: 'en_US'
		}
	};
};
