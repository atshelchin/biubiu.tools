import type { Chain } from 'viem';
import type { I18nInstance } from '@shelchin/i18n';

/**
 * Generate connect store configuration with BiuBiu Tools defaults
 */
export function createConnectConfig(params: {
	chains: Chain[];
	storageKey: string;
	i18n: I18nInstance;
}) {
	return {
		projectId: 'e68249e217c8793807b7bb961a2f4297',
		appName: 'BiuBiu Tools',
		appUrl: 'https://biubiu.tools',
		appLogoUrl: 'https://biubiu.tools/logo.svg',
		chains: params.chains,
		storageKey: params.storageKey,
		i18n: params.i18n
	};
}
