#!/usr/bin/env node
/**
 * Script to split monolithic i18n JSON files into namespace-based structure
 * for @shelchin/i18n v2.0 migration
 */

import fs from 'fs';
import path from 'path';

const LOCALES_DIR = './src/i18n/locales';
const LOCALES = ['en', 'zh'];

// Keys to merge into common.json (small objects or standalone strings)
const COMMON_KEYS = [
	'hero_title',
	'hero_subtitle',
	'cta_get_started',
	'cta_learn_more',
	'cta',
	'stats',
	'footer',
	'helpButton',
	'environment_banner',
	'common' // will be flattened
];

// Tools that should be split into separate files
const TOOL_KEYS = [
	'contract_deployer',
	'wallet_sweep',
	'one_to_many_transfer',
	'token_balance_scanner',
	'contract_events_scanner',
	'ens_scanner',
	'assets_monitor',
	'wallet_generator',
	'dex_moonshot_trader',
	'token_deployer',
	'nft_deployer',
	'wallet_collection',
	'batch_transfer',
	'call_master',
	'security_scanner'
];

// Keys that remain as top-level namespace files
const NAMESPACE_KEYS = [
	'tools', // will contain shared tools strings + actions + notify_modal + feedback_card
	'chain_tools',
	'pricing',
	'faqs',
	'wallet',
	'referral',
	'chainlist',
	'components',
	'cookie_consent',
	'privacy',
	'terms',
	'chains',
	'address',
	'name'
];

function splitLocale(locale) {
	const inputFile = path.join(LOCALES_DIR, `${locale}.json`);
	const outputDir = path.join(LOCALES_DIR, locale);

	// Read original file
	const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
	const meta = data._meta;

	// Create output directory
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	// 1. Build common.json
	const common = { _meta: meta };
	for (const key of COMMON_KEYS) {
		if (key === 'common' && data[key]) {
			// Flatten the original common object
			Object.assign(common, data[key]);
		} else if (data[key] !== undefined) {
			common[key] = data[key];
		}
	}
	writeJson(path.join(outputDir, 'common.json'), common);
	console.log(`  Created common.json`);

	// 2. Split tools into individual files + tools-shared.json
	if (data.tools) {
		const toolsShared = { _meta: meta };

		for (const [key, value] of Object.entries(data.tools)) {
			if (TOOL_KEYS.includes(key)) {
				// Create individual tool file
				const toolData = { _meta: meta, ...value };
				const filename = key.replace(/_/g, '-') + '.json';
				writeJson(path.join(outputDir, filename), toolData);
				console.log(`  Created ${filename}`);
			} else {
				// Keep in tools-shared
				toolsShared[key] = value;
			}
		}

		writeJson(path.join(outputDir, 'tools.json'), toolsShared);
		console.log(`  Created tools.json (shared)`);
	}

	// 3. Create other namespace files
	for (const key of NAMESPACE_KEYS) {
		if (key === 'tools') continue; // Already handled
		if (data[key]) {
			const nsData = { _meta: meta, ...data[key] };
			const filename = key.replace(/_/g, '-') + '.json';
			writeJson(path.join(outputDir, filename), nsData);
			console.log(`  Created ${filename}`);
		}
	}

	console.log(`\nCompleted splitting ${locale}.json`);
}

function writeJson(filepath, data) {
	fs.writeFileSync(filepath, JSON.stringify(data, null, '\t') + '\n', 'utf8');
}

// Main
console.log('Splitting i18n files for v2.0 migration...\n');

for (const locale of LOCALES) {
	console.log(`Processing ${locale}:`);
	splitLocale(locale);
	console.log('');
}

console.log('Done! New structure:');
console.log('  src/i18n/locales/');
console.log('  ├── en/');
console.log('  │   ├── common.json');
console.log('  │   ├── tools.json');
console.log('  │   ├── wallet-sweep.json');
console.log('  │   └── ...');
console.log('  └── zh/');
console.log('      └── ...');
