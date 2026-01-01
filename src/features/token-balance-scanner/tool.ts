/**
 * Token Balance Scanner Tool Definition
 *
 * Declarative configuration for the token balance scanner tool.
 */

import { mainnet, polygon, arbitrum, optimism, base, bsc } from 'viem/chains';
import { defineStepTool } from '$lib/step-tool-system';
import { stepComponents } from './ui/steps';
import { getToolPageStatus } from '../roadmap/data/roadmap-items';

export const tokenBalanceScannerTool = defineStepTool({
	id: 'token-balance-scanner',
	i18nPrefix: 'routes/apps/token-balance-scanner',

	steps: [
		{
			label: 'routes/apps/token-balance-scanner.seo.step_1_name',
			description: 'routes/apps/token-balance-scanner.seo.step_1_description'
		},
		{
			label: 'routes/apps/token-balance-scanner.seo.step_2_name',
			description: 'routes/apps/token-balance-scanner.seo.step_2_description'
		},
		{
			label: 'routes/apps/token-balance-scanner.seo.step_3_name',
			description: 'routes/apps/token-balance-scanner.seo.step_3_description'
		},
		{
			label: 'routes/apps/token-balance-scanner.seo.step_4_name',
			description: 'routes/apps/token-balance-scanner.seo.step_4_description'
		},
		{
			label: 'routes/apps/token-balance-scanner.seo.step_5_name',
			description: 'routes/apps/token-balance-scanner.seo.step_5_description'
		}
	],

	stepComponents,

	walletConnect: {
		chains: [mainnet, base, bsc, polygon, arbitrum, optimism],
		storageKey: 'biubiu-tools-token-balance-scanner'
	},

	dependencyChecks: ['rpc', 'multicall3'],

	faqsPrefix: 'routes/apps/token-balance-scanner.faqs',

	// Status from roadmap data (single source of truth)
	status: getToolPageStatus('token-balance-scanner')
});

export default tokenBalanceScannerTool;
