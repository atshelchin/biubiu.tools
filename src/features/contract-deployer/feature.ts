/**
 * Contract Deployer Feature Definition
 *
 * Declarative configuration for the contract deployer tool.
 */

import { mainnet, polygon, base, bsc, sepolia } from 'viem/chains';
import { defineStepTool } from '$lib/step-tool-system';
import { stepComponents } from './ui/steps';

export const contractDeployerTool = defineStepTool({
	id: 'contract-deployer',
	i18nPrefix: 'contract-deployer',

	steps: [
		{
			label: 'contract-deployer.seo.step_1_name',
			description: 'contract-deployer.seo.step_1_description'
		},
		{
			label: 'contract-deployer.seo.step_2_name',
			description: 'contract-deployer.seo.step_2_description'
		},
		{
			label: 'contract-deployer.seo.step_3_name',
			description: 'contract-deployer.seo.step_3_description'
		}
	],

	stepComponents,

	walletConnect: {
		chains: [mainnet, polygon, base, bsc, sepolia],
		storageKey: 'biubiu-tools-contract-deployer'
	},

	dependencyChecks: ['rpc', 'create2'],

	faqsPrefix: 'contract-deployer.faqs'
});

export default contractDeployerTool;
