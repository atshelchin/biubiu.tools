#!/usr/bin/env node
/**
 * Script to migrate i18n translation keys to use namespace prefix
 *
 * Key mapping rules:
 * 1. Keys starting with "tools.TOOL_NAME" -> "TOOL_NAME.rest" (e.g., tools.wallet_sweep.xxx -> wallet-sweep.xxx)
 * 2. Keys starting with "common." -> stay as "common.xxx"
 * 3. Keys starting with other top-level namespaces -> add namespace prefix
 * 4. Root-level keys (hero_title, etc.) -> "common.xxx"
 */

import fs from 'fs';
import path from 'path';

// Tool names that were split into separate files
const TOOL_NAMES = [
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

// Keys that were moved to common.json (originally root-level strings)
const COMMON_ROOT_KEYS = ['hero_title', 'hero_subtitle', 'cta_get_started', 'cta_learn_more'];

// Keys from the original 'common' object (already have common. prefix in code)
// These stay as-is since they're already prefixed

// Top-level namespace keys that became their own files (used for reference)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const NAMESPACE_KEYS = [
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
	'name',
	'cta',
	'stats',
	'footer',
	'helpButton',
	'environment_banner'
];

function transformKey(key) {
	// Handle tools.TOOL_NAME.xxx -> TOOL_NAME.xxx (with underscore to hyphen)
	for (const tool of TOOL_NAMES) {
		if (key.startsWith(`tools.${tool}.`)) {
			const rest = key.substring(`tools.${tool}.`.length);
			const toolNameHyphen = tool.replace(/_/g, '-');
			return `${toolNameHyphen}.${rest}`;
		}
	}

	// Handle tools.shared_key (non-tool keys in tools namespace)
	if (key.startsWith('tools.')) {
		// Keys like tools.section_title, tools.try_now etc stay in tools namespace
		const rest = key.substring('tools.'.length);
		return `tools.${rest}`;
	}

	// Handle root-level keys that moved to common
	if (COMMON_ROOT_KEYS.includes(key)) {
		return `common.${key}`;
	}

	// Handle cta.xxx, stats.xxx, footer.xxx, helpButton.xxx, environment_banner.xxx
	// These were merged into common.json
	const commonMergedPrefixes = ['cta', 'stats', 'footer', 'helpButton', 'environment_banner'];
	for (const prefix of commonMergedPrefixes) {
		if (key.startsWith(`${prefix}.`) || key === prefix) {
			return `common.${key}`;
		}
	}

	// Handle chain_tools -> chain-tools (underscore to hyphen)
	if (key.startsWith('chain_tools.')) {
		return key.replace('chain_tools.', 'chain-tools.');
	}
	if (key.startsWith('cookie_consent.')) {
		return key.replace('cookie_consent.', 'cookie-consent.');
	}

	// All other keys (common.xxx, chains.xxx, etc.) stay as-is
	return key;
}

function walkDir(dir, callback) {
	const files = fs.readdirSync(dir);
	for (const file of files) {
		const filepath = path.join(dir, file);
		const stat = fs.statSync(filepath);
		if (stat.isDirectory()) {
			if (file !== 'node_modules' && file !== '.svelte-kit' && file !== 'locales') {
				walkDir(filepath, callback);
			}
		} else if (file.endsWith('.svelte') || file.endsWith('.ts')) {
			callback(filepath);
		}
	}
}

function migrateKeys() {
	let modifiedCount = 0;
	let keyChanges = new Map();

	walkDir('src', (file) => {
		let content = fs.readFileSync(file, 'utf8');
		let modified = false;

		// Match t('key') or t("key") patterns
		const newContent = content.replace(
			/\bt\(\s*(['"])([^'"]+)\1\s*(?:,|\))/g,
			(match, quote, key) => {
				const newKey = transformKey(key);
				if (newKey !== key) {
					modified = true;
					const count = keyChanges.get(`${key} -> ${newKey}`) || 0;
					keyChanges.set(`${key} -> ${newKey}`, count + 1);
					return match.replace(key, newKey);
				}
				return match;
			}
		);

		if (modified) {
			fs.writeFileSync(file, newContent, 'utf8');
			console.log(`Updated: ${file}`);
			modifiedCount++;
		}
	});

	console.log(`\nTotal files updated: ${modifiedCount}`);
	console.log(`\nKey transformations:`);
	for (const [change, count] of [...keyChanges.entries()].sort()) {
		console.log(`  ${change} (${count}x)`);
	}
}

// Test the transform function
console.log('Testing key transformations:');
const testCases = [
	'tools.wallet_sweep.title',
	'tools.contract_deployer.step1.name',
	'tools.section_title',
	'tools.try_now',
	'common.back',
	'common.next',
	'hero_title',
	'cta.get_started',
	'chain_tools.title',
	'chains.title',
	'wallet.connect',
	'cookie_consent.title'
];

for (const test of testCases) {
	console.log(`  ${test} -> ${transformKey(test)}`);
}

console.log('\nProceeding with migration...\n');
migrateKeys();
