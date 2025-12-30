/**
 * Merge split chain-tools category files back into a single chain-tools.json
 *
 * This script combines:
 * - _base.json (common data: meta, title, categories, etc.)
 * - {category}.json files (category_seo and tools for each category)
 *
 * Usage: bun run scripts/merge-chain-tools.ts
 *
 * This runs automatically before build via npm scripts.
 */

import * as fs from 'fs';
import * as path from 'path';

const CATEGORIES = [
	'defi',
	'nft',
	'analytics',
	'security',
	'bridge',
	'wallet',
	'explorer',
	'dev',
	'dao',
	'infra',
	'launchpad',
	'identity',
	'social',
	'l2',
	'gamefi',
	'payments',
	'funding',
	'news',
	'community',
	'jobs',
	'stablecoin',
	'oracle',
	'dao_token',
	'whale_address',
	'airdrop_token',
	'non_evm',
	'legendary_token',
	'mev',
	'privacy',
	'rwa',
	'ai_crypto',
	'restaking',
	'cex',
	'gas_burner',
	'trends',
	'web3_teams',
	'regulation',
	'influencer',
	'product_hunt'
];

function mergeChainTools(locale: string) {
	const inputDir = path.join(process.cwd(), 'src/i18n/locales', locale, 'routes/chain-tools');
	const outputPath = path.join(
		process.cwd(),
		'src/i18n/locales',
		locale,
		'routes/chain-tools.json'
	);

	// Check if split directory exists
	if (!fs.existsSync(inputDir)) {
		console.log(`  Skipping ${locale} - no chain-tools directory`);
		return;
	}

	// Read base file
	const basePath = path.join(inputDir, '_base.json');
	if (!fs.existsSync(basePath)) {
		console.log(`  Skipping ${locale} - no _base.json`);
		return;
	}

	const result: Record<string, unknown> = JSON.parse(fs.readFileSync(basePath, 'utf-8'));

	// Initialize category_seo and tools objects
	result.category_seo = {};
	result.tools = {};

	// Merge each category file
	for (const category of CATEGORIES) {
		const categoryPath = path.join(inputDir, `${category}.json`);
		if (fs.existsSync(categoryPath)) {
			const categoryData = JSON.parse(fs.readFileSync(categoryPath, 'utf-8'));

			// Merge category_seo
			if (categoryData.category_seo) {
				(result.category_seo as Record<string, unknown>)[category] = categoryData.category_seo;
			}

			// Merge tools
			if (categoryData.tools) {
				Object.assign(result.tools as Record<string, unknown>, categoryData.tools);
			}
		}
	}

	// Write merged file
	fs.writeFileSync(outputPath, JSON.stringify(result, null, '\t'));

	const toolCount = Object.keys(result.tools as Record<string, unknown>).length;
	const categoryCount = Object.keys(result.category_seo as Record<string, unknown>).length;
	console.log(`  ✓ ${locale}: ${categoryCount} categories, ${toolCount} tools`);
}

// Main
console.log('Merging chain-tools files...\n');

const localesDir = path.join(process.cwd(), 'src/i18n/locales');
const locales = fs.readdirSync(localesDir).filter((f) => {
	const stat = fs.statSync(path.join(localesDir, f));
	return stat.isDirectory();
});

for (const locale of locales) {
	mergeChainTools(locale);
}

console.log('\n✅ Done!');
