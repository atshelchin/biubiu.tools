import type { NameGenerationConfig } from '../types/ens';

/**
 * Generate birthday-based names
 */
function generateBirthdayNames(config: NameGenerationConfig): string[] {
	const { startYear = 1980, endYear = 2024, format = 'YYYYMMDD' } = config;
	const names: string[] = [];

	for (let year = startYear; year <= endYear; year++) {
		for (let month = 1; month <= 12; month++) {
			const daysInMonth = new Date(year, month, 0).getDate();
			for (let day = 1; day <= daysInMonth; day++) {
				const y = year.toString();
				const m = month.toString().padStart(2, '0');
				const d = day.toString().padStart(2, '0');

				let name = '';
				switch (format) {
					case 'YYYYMMDD':
						name = `${y}${m}${d}`;
						break;
					case 'MMDDYYYY':
						name = `${m}${d}${y}`;
						break;
					case 'DDMMYYYY':
						name = `${d}${m}${y}`;
						break;
				}

				if (config.prefix) name = config.prefix + name;
				if (config.suffix) name = name + config.suffix;

				names.push(name);
			}
		}
	}

	return names;
}

/**
 * Generate triple letter names (AAA, BBB, CCC)
 */
function generateTripleNames(config: NameGenerationConfig): string[] {
	const { characters = 'abcdefghijklmnopqrstuvwxyz' } = config;
	const names: string[] = [];

	for (const char of characters) {
		let name = char.repeat(3);
		if (config.prefix) name = config.prefix + name;
		if (config.suffix) name = name + config.suffix;
		names.push(name);
	}

	return names;
}

/**
 * Generate ABAB pattern names
 */
function generateABABNames(config: NameGenerationConfig): string[] {
	const { characters = 'abcdefghijklmnopqrstuvwxyz' } = config;
	const names: string[] = [];

	for (const char1 of characters) {
		for (const char2 of characters) {
			if (char1 !== char2) {
				let name = char1 + char2 + char1 + char2;
				if (config.prefix) name = config.prefix + name;
				if (config.suffix) name = name + config.suffix;
				names.push(name);
			}
		}
	}

	return names;
}

/**
 * Generate ABCABC pattern names
 */
function generateABCABCNames(config: NameGenerationConfig): string[] {
	const { characters = 'abcdefghijklmnopqrstuvwxyz' } = config;
	const names: string[] = [];

	for (const char1 of characters) {
		for (const char2 of characters) {
			for (const char3 of characters) {
				if (char1 !== char2 && char2 !== char3 && char1 !== char3) {
					let name = char1 + char2 + char3 + char1 + char2 + char3;
					if (config.prefix) name = config.prefix + name;
					if (config.suffix) name = name + config.suffix;
					names.push(name);
				}
			}
		}
	}

	return names;
}

/**
 * Generate sequential names (ABC, BCD, CDE)
 */
function generateSequentialNames(config: NameGenerationConfig): string[] {
	const { characters = 'abcdefghijklmnopqrstuvwxyz', count = 100 } = config;
	const names: string[] = [];
	const startSequence = config.startSequence || characters.substring(0, 3);

	for (let i = 0; i < count && i < characters.length - startSequence.length + 1; i++) {
		let name = '';
		for (let j = 0; j < startSequence.length; j++) {
			const charIndex = (characters.indexOf(startSequence[j]) + i) % characters.length;
			name += characters[charIndex];
		}

		if (config.prefix) name = config.prefix + name;
		if (config.suffix) name = name + config.suffix;
		names.push(name);
	}

	return names;
}

/**
 * Generate numeric names (001, 002, 003)
 */
function generateNumericNames(config: NameGenerationConfig): string[] {
	const { startNumber = 0, endNumber = 999, digits = 3 } = config;
	const names: string[] = [];

	for (let num = startNumber; num <= endNumber; num++) {
		let name = num.toString().padStart(digits, '0');
		if (config.prefix) name = config.prefix + name;
		if (config.suffix) name = name + config.suffix;
		names.push(name);
	}

	return names;
}

/**
 * Generate custom list names
 */
function generateCustomNames(config: NameGenerationConfig): string[] {
	const { customList = [] } = config;
	return customList.map((name) => {
		let result = name;
		if (config.prefix) result = config.prefix + result;
		if (config.suffix) result = result + config.suffix;
		return result;
	});
}

/**
 * Main name generation function
 */
export function generateNames(config: NameGenerationConfig): string[] {
	switch (config.pattern) {
		case 'birthday':
			return generateBirthdayNames(config);
		case 'triple':
			return generateTripleNames(config);
		case 'abab':
			return generateABABNames(config);
		case 'abcabc':
			return generateABCABCNames(config);
		case 'sequential':
			return generateSequentialNames(config);
		case 'numeric':
			return generateNumericNames(config);
		case 'custom':
			return generateCustomNames(config);
		default:
			return [];
	}
}

/**
 * Validate ENS name format
 */
export function validateENSName(name: string): boolean {
	// ENS names can contain lowercase letters, numbers, and hyphens
	// Must be at least 3 characters long
	const cleanName = name.replace('.eth', '').toLowerCase();
	if (cleanName.length < 3) return false;
	return /^[a-z0-9-]+$/.test(cleanName);
}

/**
 * Clean and normalize ENS name
 */
export function normalizeENSName(name: string): string {
	return name.toLowerCase().trim().replace('.eth', '');
}
