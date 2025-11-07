import type { PageLoad } from './$types';
import type { HowToStepData } from '$lib/utils/structured-data';
import { createWebAppData, createHowToData } from '$lib/utils/structured-data';

export const load: PageLoad = ({ url }) => {
	const title = 'Wallet Factory - Generate Multiple Wallets from Mnemonic or xpub | BiuBiu Tools';
	const description =
		'Generate multiple cryptocurrency wallets from mnemonic phrases, xpub keys, or secret text. Support for Ethereum and Bitcoin with custom HD paths.';
	const keywords =
		'wallet generator, hd wallet, mnemonic wallet, xpub, derivation path, bitcoin wallet, ethereum wallet, batch wallet generation, bip44, bip49, bip84';
	const canonical = url.origin + url.pathname;
	const type = 'website' as const;
	const image = `${url.origin}/og-wallet-generator.png`;
	const locale = 'en_US';

	const steps: HowToStepData[] = [
		{
			name: 'Choose Input Source',
			text: 'Select your input method: mnemonic phrase (12/24 words), xpub key, or secret text. For secret text, the tool will generate a mnemonic seed using SHA256.',
			description: 'Select input source type for wallet generation'
		},
		{
			name: 'Configure Blockchain and HD Path',
			text: 'Choose the blockchain (Ethereum or Bitcoin) and select or customize the HD derivation path. Common paths include BIP44, BIP49, and BIP84 standards.',
			description: 'Set blockchain and derivation path'
		},
		{
			name: 'Set Generation Parameters',
			text: 'Specify how many wallets to generate and the starting index. The tool can use Web Workers for accelerated generation of large batches.',
			description: 'Configure generation quantity'
		},
		{
			name: 'Generate and Export',
			text: 'Generate wallets and view results in a table with addresses, private keys, and QR codes. Export to CSV or JSON format for backup.',
			description: 'Generate wallets and download results'
		}
	];

	const webAppData = createWebAppData({
		name: 'Wallet Factory',
		description:
			'Generate multiple cryptocurrency wallets from mnemonic, xpub, or secret text with HD path support',
		canonical,
		features: [
			'Generate wallets from mnemonic phrases (BIP39)',
			'Support xpub extended public keys',
			'Generate mnemonic from secret text (SHA256)',
			'Support Ethereum and Bitcoin blockchains',
			'Customizable HD derivation paths (BIP44/49/84)',
			'Batch wallet generation with Web Workers',
			'QR code generation for addresses',
			'Export to CSV and JSON formats',
			'Secure client-side generation'
		]
	});

	const howToData = createHowToData({
		name: 'How to Generate Multiple Wallets with HD Paths',
		description:
			'Complete guide to generating multiple cryptocurrency wallets from mnemonic or xpub with custom HD paths',
		canonical,
		image,
		steps,
		tools: ['Mnemonic phrase, xpub, or secret text', 'Secure device for generation']
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
