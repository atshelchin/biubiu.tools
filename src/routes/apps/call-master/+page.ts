import type { PageLoad } from './$types';
import type { HowToStepData } from '$lib/utils/structured-data';
import type { Step } from '$lib/components/ui/step-indicator.svelte';
import { createWebAppData, createHowToData } from '$lib/utils/structured-data';
import { buildCanonicalUrl } from '$utils/common';

export const load: PageLoad = ({ url }) => {
	const title = 'Call Master - Smart Contract Interaction Tool | BiuBiu Tools';
	const description =
		'Execute smart contract calls with advanced features. Read contract state, send transactions, and batch multiple calls together.';
	const keywords =
		'smart contract, contract call, ethereum, read function, write function, abi, multicall, batch call, dapp';
	const canonical = buildCanonicalUrl(url);
	const type = 'website' as const;
	const image = `${url.origin}/og-call-master.png`;
	const locale = 'en_US';

	const steps: HowToStepData[] = [
		{
			name: 'Connect Wallet',
			text: 'Connect your cryptocurrency wallet to interact with smart contracts on supported networks.',
			description: 'Connect your wallet to interact with smart contracts'
		},
		{
			name: 'Configure Contract',
			text: 'Enter the contract address and load the ABI. You can paste ABI JSON, fetch from verified contracts, or upload a file.',
			description: 'Load contract ABI and configure function calls'
		},
		{
			name: 'Execute Calls',
			text: 'Select a function, enter parameters, and execute. Read calls are free, write calls require gas.',
			description: 'Execute read or write calls to the smart contract'
		}
	];

	// Create UI steps from HowToStepData
	const uiSteps: Step[] = steps.map((step) => ({
		label: step.name,
		description: step.description
	}));

	const webAppData = createWebAppData({
		name: 'Call Master',
		description: 'Execute smart contract calls with advanced features and batch operations',
		canonical,
		features: [
			'Execute any smart contract function',
			'Read contract state (free, no gas)',
			'Send write transactions with gas estimation',
			'Auto-fetch ABI from verified contracts',
			'Support custom ABI input',
			'Batch multiple calls together',
			'View decoded return values',
			'Transaction history and status'
		]
	});

	const howToData = createHowToData({
		name: 'How to Interact with Smart Contracts',
		description:
			'Complete guide to executing smart contract calls including read and write operations',
		canonical,
		image,
		steps,
		tools: ['Web3 wallet', 'Contract address and ABI']
	});

	return {
		meta: {
			title,
			description,
			keywords,
			canonical,
			type,
			image,
			locale
		},
		steps: uiSteps,
		structuredData: [webAppData, howToData]
	};
};
