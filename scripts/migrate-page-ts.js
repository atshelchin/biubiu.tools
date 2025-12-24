#!/usr/bin/env node
/**
 * Script to migrate page.ts files from I18n class to createServerT
 */

import fs from 'fs';

const FILES = [
	'src/routes/apps/wallet-sweep/+page.ts',
	'src/routes/apps/token-balance-scanner/+page.ts',
	'src/routes/apps/one-to-many-transfer/+page.ts',
	'src/routes/apps/contract-deployer/+page.ts',
	'src/routes/apps/chain-tools/[category]/+page.ts',
	'src/routes/apps/chain-tools/+page.ts',
	'src/routes/name/[...name]/+page.server.ts',
	'src/routes/chains/[slug]/+page.ts',
	'src/routes/chains/+page.ts',
	'src/routes/apps/chainlist/+page.ts',
	'src/routes/address/labels/[label]/+page.ts',
	'src/routes/address/[chain]/[address]/+page.ts',
	'src/routes/address/+page.ts'
];

function migrateFile(filepath) {
	let content = fs.readFileSync(filepath, 'utf8');
	let modified = false;

	// Remove old imports
	const oldImports = [
		/import \{ I18n \} from '@shelchin\/i18n';\n?/g,
		/import \{ extractLocaleFromPathname \} from '@shelchin\/i18n';\n?/g,
		/import type \{ PackageLocales \} from '@shelchin\/i18n';\n?/g,
		/import en from ['"][^'"]+\/en\.json['"][^;]*;\n?/g,
		/import zh from ['"][^'"]+\/zh\.json['"][^;]*;\n?/g
	];

	for (const pattern of oldImports) {
		if (pattern.test(content)) {
			content = content.replace(pattern, '');
			modified = true;
		}
	}

	// Add new imports after the first import line
	const newImport =
		"import { createServerT } from '$i18n/server';\nimport { extractLocaleFromPathname } from '@shelchin/i18n';";

	// Find the end of imports section (before the first export or const)
	const importMatch = content.match(/^(import[^;]+;[\s\S]*?)(\n\n|\nexport|\nconst)/m);
	if (importMatch) {
		const endOfImports = importMatch.index + importMatch[1].length;
		content = content.slice(0, endOfImports) + '\n' + newImport + content.slice(endOfImports);
		modified = true;
	}

	// Replace old i18n initialization
	const oldInit =
		/\/\/ Create i18n instance for this request\n\tconst locales = \{ en, zh \} as unknown as PackageLocales;\n\tconst i18n = new I18n\(locale\);\n\ti18n\.register\('__default__', locales\);\n\tconst t = i18n\.t\.bind\(i18n\);/g;

	const newInit = `// Create translation function for this request
	const t = createServerT(locale);`;

	if (oldInit.test(content)) {
		content = content.replace(oldInit, newInit);
		modified = true;
	}

	if (modified) {
		fs.writeFileSync(filepath, content, 'utf8');
		console.log(`Updated: ${filepath}`);
	} else {
		console.log(`No changes: ${filepath}`);
	}
}

console.log('Migrating page.ts files...\n');

for (const file of FILES) {
	if (fs.existsSync(file)) {
		migrateFile(file);
	} else {
		console.log(`File not found: ${file}`);
	}
}

console.log('\nDone!');
