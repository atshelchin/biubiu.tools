/**
 * Wallet Sweep Tool Definition
 *
 * Declarative configuration for the wallet sweep tool.
 */

import { mainnet, polygon, base, bsc } from 'viem/chains';
import { defineStepTool } from '$lib/step-tool-system';
import { stepComponents } from './ui/steps';

export const walletSweepTool = defineStepTool({
	id: 'wallet-sweep',
	i18nPrefix: 'wallet-sweep',

	steps: [
		{
			label: 'wallet-sweep.seo.step_1_name',
			description: 'wallet-sweep.seo.step_1_description'
		},
		{
			label: 'wallet-sweep.seo.step_2_name',
			description: 'wallet-sweep.seo.step_2_description'
		},
		{
			label: 'wallet-sweep.seo.step_3_name',
			description: 'wallet-sweep.seo.step_3_description'
		},
		{
			label: 'wallet-sweep.seo.step_4_name',
			description: 'wallet-sweep.seo.step_4_description'
		},
		{
			label: 'wallet-sweep.seo.step_5_name',
			description: 'wallet-sweep.seo.step_5_description'
		}
	],

	stepComponents,

	walletConnect: {
		chains: [mainnet, polygon, base, bsc],
		storageKey: 'biubiu-tools-wallet-sweep'
	},

	dependencyChecks: ['rpc', 'eip7702', 'create2', 'multicall3', 'biubiu-premium', 'token-sweep'],

	faqsPrefix: 'wallet-sweep.faqs'
});

export default walletSweepTool;
