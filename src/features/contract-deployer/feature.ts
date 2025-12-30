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
	i18nPrefix: 'routes/apps/contract-deployer',

	steps: [
		{
			label: 'routes/apps/contract-deployer.seo.step_1_name',
			description: 'routes/apps/contract-deployer.seo.step_1_description'
		},
		{
			label: 'routes/apps/contract-deployer.seo.step_2_name',
			description: 'routes/apps/contract-deployer.seo.step_2_description'
		},
		{
			label: 'routes/apps/contract-deployer.seo.step_3_name',
			description: 'routes/apps/contract-deployer.seo.step_3_description'
		}
	],

	stepComponents,

	walletConnect: {
		chains: [mainnet, polygon, base, bsc, sepolia],
		storageKey: 'biubiu-tools-contract-deployer'
	},

	dependencyChecks: ['rpc', 'create2'],

	faqsPrefix: 'routes/apps/contract-deployer.faqs',

	status: 'alpha'
});

export default contractDeployerTool;
