/**
 * Wallet Sweep Tool Definition
 *
 * Declarative configuration for the wallet sweep tool.
 */

import { mainnet, polygon, base, bsc } from 'viem/chains';
import { defineStepTool } from '$lib/step-tool-system';
import { stepComponents } from './ui/steps';
import { getToolPageStatus } from '../roadmap/data/roadmap-items';

export const walletSweepTool = defineStepTool({
	id: 'wallet-sweep',
	i18nPrefix: 'routes/apps/wallet-sweep',

	steps: [
		{
			label: 'routes/apps/wallet-sweep.seo.step_1_name',
			description: 'routes/apps/wallet-sweep.seo.step_1_description'
		},
		{
			label: 'routes/apps/wallet-sweep.seo.step_2_name',
			description: 'routes/apps/wallet-sweep.seo.step_2_description'
		},
		{
			label: 'routes/apps/wallet-sweep.seo.step_3_name',
			description: 'routes/apps/wallet-sweep.seo.step_3_description'
		},
		{
			label: 'routes/apps/wallet-sweep.seo.step_4_name',
			description: 'routes/apps/wallet-sweep.seo.step_4_description'
		},
		{
			label: 'routes/apps/wallet-sweep.seo.step_5_name',
			description: 'routes/apps/wallet-sweep.seo.step_5_description'
		}
	],

	stepComponents,

	walletConnect: {
		chains: [mainnet, polygon, base, bsc],
		storageKey: 'biubiu-tools-wallet-sweep'
	},

	dependencyChecks: ['rpc', 'eip7702', 'create2', 'multicall3', 'biubiu-premium', 'token-sweep'],

	faqsPrefix: 'routes/apps/wallet-sweep.faqs',

	// Status from roadmap data (single source of truth)
	status: getToolPageStatus('wallet-sweep')
});

export default walletSweepTool;
