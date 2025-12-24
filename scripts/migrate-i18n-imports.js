#!/usr/bin/env node
/**
 * Script to migrate i18n imports from v0.x to v2.0
 */

import fs from 'fs';
import path from 'path';

// Import path replacements
const IMPORT_REPLACEMENTS = [
	// Main imports
	{
		from: /from ['"]@shelchin\/i18n\/svelte['"]/g,
		to: "from '@shelchin/i18n'"
	},
	{
		from: /from ['"]@shelchin\/i18n\/utils['"]/g,
		to: "from '@shelchin/i18n'"
	}
];

function walkDir(dir, callback) {
	const files = fs.readdirSync(dir);
	for (const file of files) {
		const filepath = path.join(dir, file);
		const stat = fs.statSync(filepath);
		if (stat.isDirectory()) {
			if (file !== 'node_modules' && file !== '.svelte-kit') {
				walkDir(filepath, callback);
			}
		} else if (file.endsWith('.svelte') || file.endsWith('.ts')) {
			callback(filepath);
		}
	}
}

function migrateImports() {
	let modifiedCount = 0;

	walkDir('src', (file) => {
		let content = fs.readFileSync(file, 'utf8');
		let modified = false;

		for (const replacement of IMPORT_REPLACEMENTS) {
			if (replacement.from.test(content)) {
				// Reset regex lastIndex
				replacement.from.lastIndex = 0;
				content = content.replace(replacement.from, replacement.to);
				modified = true;
			}
		}

		if (modified) {
			fs.writeFileSync(file, content, 'utf8');
			console.log(`Updated: ${file}`);
			modifiedCount++;
		}
	});

	console.log(`\nTotal files updated: ${modifiedCount}`);
}

migrateImports();
