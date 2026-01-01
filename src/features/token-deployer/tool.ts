/**
 * Token Deployer Tool Definition
 *
 * Declarative configuration for the token deployer tool.
 * Note: Steps are defined in +page.ts for SEO structured data compatibility.
 */

import { mainnet, polygon, arbitrum, optimism, base, bsc } from 'viem/chains';
import { defineStepTool } from '$lib/step-tool-system';
import { stepComponents } from './ui/steps';
import { getToolPageStatus } from '../roadmap/data/roadmap-items';

export const tokenDeployerTool = defineStepTool({
	id: 'token-deployer',
	i18nPrefix: 'routes/apps/token-deployer',

	// Steps are provided by +page.ts for SEO structured data
	// These are placeholder steps that will be overridden
	steps: [
		{ label: 'Step 1', description: 'Connect wallet' },
		{ label: 'Step 2', description: 'Check dependencies' },
		{ label: 'Step 3', description: 'Configure token' },
		{ label: 'Step 4', description: 'Deploy' }
	],
	useI18nSteps: false,

	stepComponents,

	walletConnect: {
		chains: [mainnet, base, bsc, polygon, arbitrum, optimism],
		storageKey: 'biubiu-tools-token-deployer'
	},

	dependencyChecks: ['rpc', 'create2', 'multicall3', 'biubiu-premium', 'token-factory'],

	// Status from roadmap data (single source of truth)
	status: getToolPageStatus('token-deployer')
});

export default tokenDeployerTool;
