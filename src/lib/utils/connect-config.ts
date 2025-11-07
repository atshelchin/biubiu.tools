import type { Chain } from 'viem';

/**
 * Generate connect store configuration with BiuBiu Tools defaults
 */
export function createConnectConfig(params: { chains: Chain[]; storageKey: string }) {
	return {
		projectId: 'e68249e217c8793807b7bb961a2f4297',
		appName: 'BiuBiu Tools',
		appUrl: 'https://biubiu.tools',
		appLogoUrl: 'https://biubiu.tools/logo.svg',
		chains: params.chains,
		storageKey: params.storageKey
	};
}
