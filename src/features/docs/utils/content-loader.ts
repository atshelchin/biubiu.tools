/**
 * Content Loader for Documentation
 *
 * Loads markdown files from src/features/docs/content/
 * using Vite's import.meta.glob for build-time optimization.
 */

import type { DocCategory, DocItem, DocNavigation, CategoryMeta, ParsedDoc } from '../types';
import { parseDocument } from './markdown-parser';
import { isValidVersion } from '../config';

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
 * Parse file path to extract version, category, and slug
 */
function parseFilePath(path: string): { version: string; category: string; slug: string } | null {
	// Path format: /src/features/docs/content/v1/category/document.md
	const match = path.match(/\/content\/([^/]+)\/([^/]+)\/([^/]+)\.(md|svx)$/);
	if (!match) return null;

	return {
		version: match[1],
		category: match[2],
		slug: match[3]
	};
}

/**
 * Get category metadata for a given version and category
 */
function getCategoryMeta(version: string, category: string): CategoryMeta {
	const path = `/src/features/docs/content/${version}/${category}/_category.json`;
	const meta = categoryModules[path] as CategoryMeta | undefined;

	return (
		meta ?? {
			label: category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' '),
			order: 999
		}
	);
}

/**
 * Load navigation structure for a version
 */
export async function loadNavigation(version: string): Promise<DocNavigation | null> {
	if (!isValidVersion(version)) {
		return null;
	}

	const categories: Record<string, DocCategory> = {};

	// Process each content file
	for (const path of Object.keys(contentModules)) {
		const parsed = parseFilePath(path);
		if (!parsed || parsed.version !== version) continue;

		// Load the file content to get frontmatter
		const rawContent = (await contentModules[path]()) as string;
		const { frontmatter } = await parseDocument(rawContent);

		// Skip drafts in production
		if (frontmatter.draft && import.meta.env.PROD) continue;

		// Get or create category
		if (!categories[parsed.category]) {
			const meta = getCategoryMeta(version, parsed.category);
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
			title: frontmatter.title,
			description: frontmatter.description,
			order: frontmatter.order ?? 999,
			path: `/${version}/${parsed.category}/${parsed.slug}`,
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
		version,
		categories: sortedCategories
	};
}

/**
 * Load a specific document
 */
export async function loadDocument(
	version: string,
	category: string,
	slug: string
): Promise<ParsedDoc | null> {
	if (!isValidVersion(version)) {
		return null;
	}

	// Try .md first, then .svx
	const mdPath = `/src/features/docs/content/${version}/${category}/${slug}.md`;
	const svxPath = `/src/features/docs/content/${version}/${category}/${slug}.svx`;

	let rawContent: string | null = null;
	let usedPath = mdPath;

	if (contentModules[mdPath]) {
		rawContent = (await contentModules[mdPath]()) as string;
	} else if (contentModules[svxPath]) {
		rawContent = (await contentModules[svxPath]()) as string;
		usedPath = svxPath;
	}

	if (!rawContent) {
		return null;
	}

	const { frontmatter, html, toc } = await parseDocument(rawContent);

	// Skip drafts in production
	if (frontmatter.draft && import.meta.env.PROD) {
		return null;
	}

	return {
		frontmatter,
		content: rawContent,
		html,
		toc,
		slug,
		category,
		version,
		path: usedPath
	};
}

/**
 * Get all document paths for prerendering
 */
export async function getAllDocumentPaths(): Promise<string[]> {
	const paths: string[] = [];

	for (const path of Object.keys(contentModules)) {
		const parsed = parseFilePath(path);
		if (!parsed) continue;

		// Load to check for drafts
		const rawContent = (await contentModules[path]()) as string;
		const { frontmatter } = await parseDocument(rawContent);

		if (frontmatter.draft && import.meta.env.PROD) continue;

		paths.push(`/docs/${parsed.version}/${parsed.category}/${parsed.slug}`);
	}

	return paths;
}

/**
 * Get the first document in a version (for redirects)
 */
export async function getFirstDocument(version: string): Promise<string | null> {
	const nav = await loadNavigation(version);
	if (!nav || nav.categories.length === 0) return null;

	const firstCategory = nav.categories[0];
	if (firstCategory.items.length === 0) return null;

	const firstDoc = firstCategory.items[0];
	return `/docs${firstDoc.path}`;
}
