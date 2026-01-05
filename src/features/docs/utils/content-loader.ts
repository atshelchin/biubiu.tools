/**
 * Content Loader for Documentation
 *
 * Loads markdown files from src/features/docs/content/
 * using Vite's import.meta.glob for build-time optimization.
 * Supports multiple languages with fallback to default language.
 */

import type { DocCategory, DocItem, DocNavigation, CategoryMeta, ParsedDoc } from '../types';
import { parseDocument } from './markdown-parser';
import { isValidLanguage, getDefaultLanguage } from '../config';

// Import all markdown and svx files at build time
const contentModules = import.meta.glob('/src/features/docs/content/**/*.{md,svx}', {
	query: '?raw',
	import: 'default',
	eager: false
});

// Import category metadata files
const categoryModules = import.meta.glob('/src/features/docs/content/**/_category.json', {
	import: 'default',
	eager: true
});

/**
 * Parse file path to extract language, category, and slug
 */
function parseFilePath(path: string): { language: string; category: string; slug: string } | null {
	// Path format: /src/features/docs/content/en/category/document.md
	const match = path.match(/\/content\/([^/]+)\/([^/]+)\/([^/]+)\.(md|svx)$/);
	if (!match) return null;

	return {
		language: match[1],
		category: match[2],
		slug: match[3]
	};
}

/**
 * Get category metadata for a given language and category
 * Falls back to default language if not found
 */
function getCategoryMeta(language: string, category: string): CategoryMeta {
	const path = `/src/features/docs/content/${language}/${category}/_category.json`;
	let meta = categoryModules[path] as CategoryMeta | undefined;

	// Fallback to default language
	if (!meta) {
		const fallbackPath = `/src/features/docs/content/${getDefaultLanguage()}/${category}/_category.json`;
		meta = categoryModules[fallbackPath] as CategoryMeta | undefined;
	}

	return (
		meta ?? {
			label: category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' '),
			order: 999
		}
	);
}

/**
 * Load navigation structure for a language
 * Uses default language for structure, but loads localized labels and titles
 */
export async function loadNavigation(language: string): Promise<DocNavigation | null> {
	if (!isValidLanguage(language)) {
		return null;
	}

	// Use default language for navigation structure
	// This ensures consistent navigation across all languages
	const navLanguage = getDefaultLanguage();
	const categories: Record<string, DocCategory> = {};

	// Process each content file
	for (const path of Object.keys(contentModules)) {
		const parsed = parseFilePath(path);
		if (!parsed || parsed.language !== navLanguage) continue;

		// Load the file content to get frontmatter (from default language for structure)
		const rawContent = (await contentModules[path]()) as string;
		const { frontmatter } = await parseDocument(rawContent);

		// Skip drafts in production
		if (frontmatter.draft && import.meta.env.PROD) continue;

		// Try to load localized title from target language
		let localizedTitle = frontmatter.title;
		if (language !== navLanguage) {
			const localizedPath = path.replace(`/${navLanguage}/`, `/${language}/`);
			if (contentModules[localizedPath]) {
				const localizedContent = (await contentModules[localizedPath]()) as string;
				const { frontmatter: localizedFrontmatter } = await parseDocument(localizedContent);
				localizedTitle = localizedFrontmatter.title;
			}
		}

		// Get or create category
		if (!categories[parsed.category]) {
			const meta = getCategoryMeta(language, parsed.category);
			categories[parsed.category] = {
				slug: parsed.category,
				label: meta.label,
				order: meta.order,
				icon: meta.icon,
				collapsed: meta.collapsed,
				items: []
			};
		}

		// Add document to category
		const docItem: DocItem = {
			slug: parsed.slug,
			title: localizedTitle,
			description: frontmatter.description,
			order: frontmatter.order ?? 999,
			path: `/${parsed.category}/${parsed.slug}`,
			draft: frontmatter.draft
		};

		categories[parsed.category].items.push(docItem);
	}

	// Sort categories and items
	const sortedCategories = Object.values(categories)
		.sort((a, b) => a.order - b.order)
		.map((cat) => ({
			...cat,
			items: cat.items.sort((a, b) => a.order - b.order)
		}));

	return {
		language,
		categories: sortedCategories
	};
}

/**
 * Load a specific document with language fallback
 */
export async function loadDocument(
	language: string,
	category: string,
	slug: string
): Promise<ParsedDoc | null> {
	if (!isValidLanguage(language)) {
		return null;
	}

	// Try requested language first, then fallback to default
	const languagesToTry = [language];
	if (language !== getDefaultLanguage()) {
		languagesToTry.push(getDefaultLanguage());
	}

	for (const lang of languagesToTry) {
		// Try .md first, then .svx
		const mdPath = `/src/features/docs/content/${lang}/${category}/${slug}.md`;
		const svxPath = `/src/features/docs/content/${lang}/${category}/${slug}.svx`;

		let rawContent: string | null = null;
		let usedPath = mdPath;

		if (contentModules[mdPath]) {
			rawContent = (await contentModules[mdPath]()) as string;
		} else if (contentModules[svxPath]) {
			rawContent = (await contentModules[svxPath]()) as string;
			usedPath = svxPath;
		}

		if (rawContent) {
			const { frontmatter, html, toc } = await parseDocument(rawContent);

			// Skip drafts in production
			if (frontmatter.draft && import.meta.env.PROD) {
				continue;
			}

			return {
				frontmatter,
				content: rawContent,
				html,
				toc,
				slug,
				category,
				language: lang,
				path: usedPath
			};
		}
	}

	return null;
}

/**
 * Get all document paths for prerendering
 */
export async function getAllDocumentPaths(): Promise<string[]> {
	const paths: string[] = [];
	const defaultLang = getDefaultLanguage();

	for (const path of Object.keys(contentModules)) {
		const parsed = parseFilePath(path);
		// Only get paths from default language (structure source)
		if (!parsed || parsed.language !== defaultLang) continue;

		// Load to check for drafts
		const rawContent = (await contentModules[path]()) as string;
		const { frontmatter } = await parseDocument(rawContent);

		if (frontmatter.draft && import.meta.env.PROD) continue;

		paths.push(`/docs/${parsed.category}/${parsed.slug}`);
	}

	return paths;
}

/**
 * Get the first document (for redirects)
 */
export async function getFirstDocument(language: string): Promise<string | null> {
	const nav = await loadNavigation(language);
	if (!nav || nav.categories.length === 0) return null;

	const firstCategory = nav.categories[0];
	if (firstCategory.items.length === 0) return null;

	const firstDoc = firstCategory.items[0];
	return `/docs${firstDoc.path}`;
}

/**
 * Get all document slugs (for prerender entries)
 * Returns slugs in format "category/document"
 */
export async function getAllDocSlugs(): Promise<string[]> {
	const slugs: string[] = [];
	const defaultLang = getDefaultLanguage();

	for (const path of Object.keys(contentModules)) {
		const parsed = parseFilePath(path);
		// Only get slugs from default language (structure source)
		if (!parsed || parsed.language !== defaultLang) continue;

		// Load to check for drafts
		const rawContent = (await contentModules[path]()) as string;
		const { frontmatter } = await parseDocument(rawContent);

		if (frontmatter.draft && import.meta.env.PROD) continue;

		// Return slug in format: category/document
		slugs.push(`${parsed.category}/${parsed.slug}`);
	}

	return slugs;
}
