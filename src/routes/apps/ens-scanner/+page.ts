import type { PageLoad } from './$types';
import type { HowToStepData } from '$lib/utils/structured-data';
import { createWebAppData, createHowToData } from '$lib/utils/structured-data';

export const load: PageLoad = ({ url }) => {
	const title = 'ENS Scanner - Batch Scan ENS Domain Availability | BiuBiu Tools';
	const description =
		'Scan multiple ENS domain names for availability, expiry dates, and registration status. Generate names by patterns like birthdays, sequences, and more.';
	const keywords =
		'ENS scanner, ENS domains, domain availability, ENS expiry, batch ENS scan, Ethereum Name Service, domain generator, web3 tools';
	const canonical = url.origin + url.pathname;
	const type = 'website' as const;
	const image = `${url.origin}/og-ens-scanner.png`;
	const locale = 'en_US';

	const steps: HowToStepData[] = [
		{
			name: 'Connect Wallet',
			text: 'Connect your Web3 wallet to Ethereum mainnet. ENS names are registered on Ethereum mainnet only.',
			description: 'Connect to Ethereum mainnet'
		},
		{
			name: 'Generate or Import Names',
			text: 'Generate ENS names using patterns (birthday, triple letters, ABAB, numeric sequences) or import your own list of names to check.',
			description: 'Create names to scan'
		},
		{
			name: 'Scan ENS Names',
			text: 'Execute the scan to check registration status, expiry dates, and ownership information for all names in your list.',
			description: 'Scan domain availability'
		},
		{
			name: 'View and Filter Results',
			text: 'Review scan results with filters for available names, expiring soon, registered, or in grace period. Export results to CSV or JSON.',
			description: 'Filter and export results'
		}
	];

	const webAppData = createWebAppData({
		name: 'ENS Scanner',
		description:
			'Batch scan ENS domain names for availability, registration status, and expiry information',
		canonical,
		features: [
			'Connect to Ethereum mainnet',
			'Generate names by multiple patterns (birthday, triple, ABAB, numeric)',
			'Import custom name lists',
			'Batch scan up to 1000 names',
			'Check availability and registration status',
			'View expiry dates and days until expiry',
			'Filter by status (available, registered, expiring, grace period)',
			'Export results to CSV or JSON',
			'Read-only operations (no transactions)'
		]
	});

	const howToData = createHowToData({
		name: 'How to Batch Scan ENS Domain Names',
		description: 'Complete guide to scanning ENS domain availability and registration status',
		canonical,
		image,
		steps,
		tools: ['Web3 Wallet (MetaMask, WalletConnect, etc.)', 'Ethereum Mainnet connection']
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
		steps,
		structuredData: [webAppData, howToData]
	};
};
