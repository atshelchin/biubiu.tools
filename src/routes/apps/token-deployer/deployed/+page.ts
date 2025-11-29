import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	return {
		meta: {
			title: 'Deployed Tokens | Token Deployer | BiuBiu Tools',
			description: 'View and manage your deployed ERC20 tokens across multiple blockchain networks.'
		}
	};
};
