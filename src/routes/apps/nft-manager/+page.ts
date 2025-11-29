import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
	const canonical = url.origin + url.pathname;
	const image = `${url.origin}/og-nft-manager.png`;

	return {
		meta: {
			title: 'NFT Manager - Manage Your NFT Collections | BiuBiu Tools',
			description:
				'View and manage your deployed NFT collections from NFTFactory. Mint new NFTs with owner mint or stake-to-mint mechanism. Browse all NFT collections with pagination.',
			keywords:
				'nft manager, nft mint, nft collection, stake to mint, owner mint, nft factory, web3 tools, ethereum nft, polygon nft, manage nft',
			canonical,
			type: 'website' as const,
			image,
			locale: 'en_US'
		}
	};
};
