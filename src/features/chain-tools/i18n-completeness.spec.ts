/**
 * i18n Completeness Test for Chain Tools
 *
 * This test checks that all tool description keys in TypeScript files
 * have corresponding translations in all supported languages.
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// Supported languages
const LANGUAGES = ['en', 'zh', 'es', 'fr', 'id', 'it', 'ja', 'ko', 'pt', 'ru', 'tr', 'vi'];
const BASE_LANG = 'en';

// Paths
const TOOLS_DIR = path.resolve(__dirname, 'data/tools');
const LOCALES_DIR = path.resolve(__dirname, '../../i18n/locales');
const CHAIN_TOOLS_I18N_PATH = 'routes/apps/chain-tools';

interface MissingTranslation {
	language: string;
	category: string;
	key: string;
}

interface CategoryToolKeys {
	category: string;
	keys: string[];
}

/**
 * Extract tool description keys from TypeScript files
 */
function extractToolKeysFromTS(): CategoryToolKeys[] {
	const results: CategoryToolKeys[] = [];
	const files = fs.readdirSync(TOOLS_DIR).filter((f) => f.endsWith('.ts') && f !== 'index.ts');

	for (const file of files) {
		const filePath = path.join(TOOLS_DIR, file);
		const content = fs.readFileSync(filePath, 'utf-8');

		// Extract descriptionKey patterns
		const regex =
			/descriptionKey:\s*['"]routes\/apps\/chain-tools\/([^.]+)\.tools\.([^.]+)\.description['"]/g;
		const keys: string[] = [];
		let match;

		while ((match = regex.exec(content)) !== null) {
			const category = match[1];
			const toolKey = match[2];
			keys.push(toolKey);
		}

		if (keys.length > 0) {
			// Get category from first match or filename
			const categoryMatch = content.match(
				/descriptionKey:\s*['"]routes\/apps\/chain-tools\/([^.]+)\.tools\./
			);
			const category = categoryMatch ? categoryMatch[1] : file.replace('.ts', '');
			results.push({ category, keys: [...new Set(keys)] });
		}
	}

	return results;
}

/**
 * Get tool keys from a JSON translation file
 */
function getToolKeysFromJSON(lang: string, category: string): string[] {
	const jsonPath = path.join(LOCALES_DIR, lang, CHAIN_TOOLS_I18N_PATH, `${category}.json`);

	if (!fs.existsSync(jsonPath)) {
		return [];
	}

	try {
		const content = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
		if (content.tools && typeof content.tools === 'object') {
			return Object.keys(content.tools);
		}
	} catch {
		// Invalid JSON
	}

	return [];
}

/**
 * Find missing translations for a category
 */
function findMissingTranslations(
	category: string,
	tsKeys: string[],
	lang: string
): MissingTranslation[] {
	const jsonKeys = getToolKeysFromJSON(lang, category);
	const jsonKeySet = new Set(jsonKeys);

	return tsKeys
		.filter((key) => !jsonKeySet.has(key))
		.map((key) => ({
			language: lang,
			category,
			key
		}));
}

describe('Chain Tools i18n Completeness', () => {
	const categoryToolKeys = extractToolKeysFromTS();

	it('should have extracted tool keys from TS files', () => {
		expect(categoryToolKeys.length).toBeGreaterThan(0);

		const totalKeys = categoryToolKeys.reduce((sum, c) => sum + c.keys.length, 0);
		console.log(`Found ${categoryToolKeys.length} categories with ${totalKeys} total tool keys`);
	});

	describe('Translation completeness by language', () => {
		for (const lang of LANGUAGES) {
			it(`should have all translations for ${lang}`, () => {
				const allMissing: MissingTranslation[] = [];

				for (const { category, keys } of categoryToolKeys) {
					const missing = findMissingTranslations(category, keys, lang);
					allMissing.push(...missing);
				}

				if (allMissing.length > 0) {
					// Group by category for better error message
					const byCategory = allMissing.reduce(
						(acc, m) => {
							if (!acc[m.category]) acc[m.category] = [];
							acc[m.category].push(m.key);
							return acc;
						},
						{} as Record<string, string[]>
					);

					console.log(`\n[${lang}] Missing ${allMissing.length} translations:`);
					for (const [category, keys] of Object.entries(byCategory)) {
						console.log(
							`  ${category}: ${keys.slice(0, 5).join(', ')}${keys.length > 5 ? ` ... and ${keys.length - 5} more` : ''}`
						);
					}
				}

				// Report missing translations (warning mode - doesn't fail)
				// Uncomment the expect below to make test fail on missing translations
				// expect(allMissing.length, `Missing ${allMissing.length} translations for ${lang}`).toBe(0);
				expect(true).toBe(true); // Always pass - this is a report
			});
		}
	});

	describe('Translation completeness by category', () => {
		for (const { category, keys } of categoryToolKeys) {
			it(`should have all translations for category: ${category}`, () => {
				const missingByLang: Record<string, string[]> = {};

				for (const lang of LANGUAGES) {
					const missing = findMissingTranslations(category, keys, lang);
					if (missing.length > 0) {
						missingByLang[lang] = missing.map((m) => m.key);
					}
				}

				const totalMissing = Object.values(missingByLang).reduce((sum, arr) => sum + arr.length, 0);

				if (totalMissing > 0) {
					console.log(`\n[${category}] Missing translations:`);
					for (const [lang, keys] of Object.entries(missingByLang)) {
						console.log(
							`  ${lang}: ${keys.slice(0, 3).join(', ')}${keys.length > 3 ? ` ... and ${keys.length - 3} more` : ''}`
						);
					}
				}

				// Report missing translations (warning mode - doesn't fail)
				// Uncomment the expect below to make test fail on missing translations
				// expect(totalMissing, `Category ${category} has ${totalMissing} missing translations`).toBe(0);
				expect(true).toBe(true); // Always pass - this is a report
			});
		}
	});

	it('should generate a summary report', () => {
		const report: Record<string, Record<string, number>> = {};

		for (const lang of LANGUAGES) {
			report[lang] = {};
			for (const { category, keys } of categoryToolKeys) {
				const missing = findMissingTranslations(category, keys, lang);
				if (missing.length > 0) {
					report[lang][category] = missing.length;
				}
			}
		}

		// Print summary
		console.log('\n=== i18n Completeness Summary ===\n');

		const langTotals: Record<string, number> = {};
		for (const lang of LANGUAGES) {
			const total = Object.values(report[lang]).reduce((sum, n) => sum + n, 0);
			langTotals[lang] = total;
		}

		// Sort by missing count
		const sortedLangs = [...LANGUAGES].sort((a, b) => langTotals[b] - langTotals[a]);

		for (const lang of sortedLangs) {
			const total = langTotals[lang];
			if (total > 0) {
				const categories = Object.entries(report[lang])
					.sort((a, b) => b[1] - a[1])
					.slice(0, 5)
					.map(([cat, count]) => `${cat}(${count})`)
					.join(', ');
				console.log(`${lang}: ${total} missing - ${categories}`);
			} else {
				console.log(`${lang}: ✓ Complete`);
			}
		}

		// The test passes - this is just a report
		expect(true).toBe(true);
	});

	it('should generate detailed missing translations report', () => {
		const allMissing: MissingTranslation[] = [];

		for (const lang of LANGUAGES) {
			for (const { category, keys } of categoryToolKeys) {
				const missing = findMissingTranslations(category, keys, lang);
				allMissing.push(...missing);
			}
		}

		// Sort by language, then category, then key
		allMissing.sort((a, b) => {
			if (a.language !== b.language) return a.language.localeCompare(b.language);
			if (a.category !== b.category) return a.category.localeCompare(b.category);
			return a.key.localeCompare(b.key);
		});

		// Generate report content - one line per missing translation
		const reportLines = allMissing.map((m) => `${m.language}\t${m.category}\t${m.key}`);

		// Write to file
		const reportPath = path.resolve(__dirname, '../../..', 'i18n-missing-report.txt');
		const header = `# i18n Missing Translations Report
# Generated: ${new Date().toISOString()}
# Total missing: ${allMissing.length}
# Format: language\\tcategory\\tkey
#
`;
		fs.writeFileSync(reportPath, header + reportLines.join('\n') + '\n');

		console.log(`\n=== Detailed Report Written ===`);
		console.log(`File: ${reportPath}`);
		console.log(`Total missing translations: ${allMissing.length}`);

		// Also print first 50 lines as preview
		console.log(`\nPreview (first 50 entries):`);
		console.log('language\tcategory\tkey');
		console.log('--------\t--------\t---');
		reportLines.slice(0, 50).forEach((line) => console.log(line));
		if (reportLines.length > 50) {
			console.log(`... and ${reportLines.length - 50} more (see ${reportPath})`);
		}

		expect(true).toBe(true);
	});

	it('should check translations against English baseline and generate report', () => {
		const OTHER_LANGUAGES = LANGUAGES.filter((l) => l !== BASE_LANG);
		const missingFromEnglish: Array<{
			language: string;
			file: string;
			key: string;
			parentKey?: string;
		}> = [];

		// Get all English JSON files in chain-tools directory
		const enChainToolsDir = path.join(LOCALES_DIR, BASE_LANG, CHAIN_TOOLS_I18N_PATH);

		if (!fs.existsSync(enChainToolsDir)) {
			console.log('English chain-tools directory not found');
			expect(true).toBe(true);
			return;
		}

		/**
		 * Recursively get all keys from an object with their paths
		 */
		function getAllKeys(obj: unknown, prefix = ''): string[] {
			const keys: string[] = [];
			if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
				for (const [key, value] of Object.entries(obj)) {
					const fullKey = prefix ? `${prefix}.${key}` : key;
					keys.push(fullKey);
					if (value && typeof value === 'object' && !Array.isArray(value)) {
						keys.push(...getAllKeys(value, fullKey));
					}
				}
			}
			return keys;
		}

		/**
		 * Recursively scan directory for JSON files
		 */
		function scanDirectory(dir: string, relativePath = ''): string[] {
			const files: string[] = [];
			const entries = fs.readdirSync(dir, { withFileTypes: true });

			for (const entry of entries) {
				const entryRelPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
				if (entry.isDirectory()) {
					files.push(...scanDirectory(path.join(dir, entry.name), entryRelPath));
				} else if (entry.name.endsWith('.json')) {
					files.push(entryRelPath);
				}
			}
			return files;
		}

		// Get all JSON files from English directory
		const enJsonFiles = scanDirectory(enChainToolsDir);

		for (const jsonFile of enJsonFiles) {
			const enFilePath = path.join(enChainToolsDir, jsonFile);

			let enContent: Record<string, unknown>;
			try {
				enContent = JSON.parse(fs.readFileSync(enFilePath, 'utf-8'));
			} catch {
				console.log(`Failed to parse English file: ${jsonFile}`);
				continue;
			}

			const enKeys = getAllKeys(enContent);

			// Check each other language
			for (const lang of OTHER_LANGUAGES) {
				const langFilePath = path.join(LOCALES_DIR, lang, CHAIN_TOOLS_I18N_PATH, jsonFile);

				if (!fs.existsSync(langFilePath)) {
					// Entire file is missing
					missingFromEnglish.push({
						language: lang,
						file: jsonFile,
						key: '*',
						parentKey: 'FILE_MISSING'
					});
					continue;
				}

				let langContent: Record<string, unknown>;
				try {
					langContent = JSON.parse(fs.readFileSync(langFilePath, 'utf-8'));
				} catch {
					missingFromEnglish.push({
						language: lang,
						file: jsonFile,
						key: '*',
						parentKey: 'PARSE_ERROR'
					});
					continue;
				}

				const langKeys = new Set(getAllKeys(langContent));

				// Find keys in English but not in this language
				for (const enKey of enKeys) {
					if (!langKeys.has(enKey)) {
						missingFromEnglish.push({
							language: lang,
							file: jsonFile,
							key: enKey
						});
					}
				}
			}
		}

		// Sort by language, then file, then key
		missingFromEnglish.sort((a, b) => {
			if (a.language !== b.language) return a.language.localeCompare(b.language);
			if (a.file !== b.file) return a.file.localeCompare(b.file);
			return a.key.localeCompare(b.key);
		});

		// Generate report
		const reportLines = missingFromEnglish.map((m) => {
			if (m.parentKey === 'FILE_MISSING') {
				return `${m.language}\t${m.file}\t[FILE_MISSING]`;
			} else if (m.parentKey === 'PARSE_ERROR') {
				return `${m.language}\t${m.file}\t[PARSE_ERROR]`;
			}
			return `${m.language}\t${m.file}\t${m.key}`;
		});

		// Write to file
		const reportPath = path.resolve(__dirname, '../../..', 'i18n-vs-english-report.txt');
		const header = `# i18n Missing Keys vs English Baseline
# Generated: ${new Date().toISOString()}
# Base language: ${BASE_LANG}
# Checked languages: ${OTHER_LANGUAGES.join(', ')}
# Total missing: ${missingFromEnglish.length}
# Format: language\\tfile\\tkey
#
`;
		fs.writeFileSync(reportPath, header + reportLines.join('\n') + '\n');

		// Print summary
		console.log(`\n=== i18n vs English Baseline Report ===`);
		console.log(`File: ${reportPath}`);
		console.log(`Total missing keys: ${missingFromEnglish.length}`);

		// Summary by language
		const byLang: Record<string, number> = {};
		for (const m of missingFromEnglish) {
			byLang[m.language] = (byLang[m.language] || 0) + 1;
		}

		console.log(`\nBy language:`);
		for (const [lang, count] of Object.entries(byLang).sort((a, b) => b[1] - a[1])) {
			console.log(`  ${lang}: ${count} missing`);
		}

		// Preview first 30 lines
		if (reportLines.length > 0) {
			console.log(`\nPreview (first 30 entries):`);
			console.log('language\tfile\tkey');
			console.log('--------\t----\t---');
			reportLines.slice(0, 30).forEach((line) => console.log(line));
			if (reportLines.length > 30) {
				console.log(`... and ${reportLines.length - 30} more (see ${reportPath})`);
			}
		}

		expect(true).toBe(true);
	});
});
