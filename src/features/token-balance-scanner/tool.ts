/**
 * Token Balance Scanner Tool Definition
 *
 * Declarative configuration for the token balance scanner tool.
 */

import { mainnet, polygon, arbitrum, optimism, base, bsc } from 'viem/chains';
import { defineStepTool } from '$lib/step-tool-system';
import { stepComponents } from './ui/steps';

export const tokenBalanceScannerTool = defineStepTool({
	id: 'token-balance-scanner',
	i18nPrefix: 'token-balance-scanner',

	steps: [
		{
			label: 'token-balance-scanner.seo.step_1_name',
			description: 'token-balance-scanner.seo.step_1_description'
		},
		{
			label: 'token-balance-scanner.seo.step_2_name',
			description: 'token-balance-scanner.seo.step_2_description'
		},
		{
			label: 'token-balance-scanner.seo.step_3_name',
			description: 'token-balance-scanner.seo.step_3_description'
		},
		{
			label: 'token-balance-scanner.seo.step_4_name',
			description: 'token-balance-scanner.seo.step_4_description'
		},
		{
			label: 'token-balance-scanner.seo.step_5_name',
			description: 'token-balance-scanner.seo.step_5_description'
		}
	],

	stepComponents,

	walletConnect: {
		chains: [mainnet, base, bsc, polygon, arbitrum, optimism],
		storageKey: 'biubiu-tools-token-balance-scanner'
	},

	dependencyChecks: ['rpc', 'multicall3'],

	faqsPrefix: 'token-balance-scanner.faqs',

	status: 'alpha'
});

export default tokenBalanceScannerTool;
