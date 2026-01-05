/**
 * Documentation System Types
 */

/** Frontmatter metadata for a document */
export interface DocFrontmatter {
	title: string;
	description?: string;
	order?: number;
	draft?: boolean;
	lastUpdated?: string;
	author?: string;
	tags?: string[];
}

/** Category metadata from _category.json */
export interface CategoryMeta {
	label: string;
	order: number;
	icon?: string;
	collapsed?: boolean;
}

/** A single document item */
export interface DocItem {
	slug: string;
	title: string;
	description?: string;
	order: number;
	path: string;
	draft?: boolean;
}

/** A category containing documents */
export interface DocCategory {
	slug: string;
	label: string;
	order: number;
	icon?: string;
	collapsed?: boolean;
	items: DocItem[];
}

/** Navigation structure for a language */
export interface DocNavigation {
	language: string;
	categories: DocCategory[];
}

/** Table of contents item */
export interface TocItem {
	id: string;
	text: string;
	level: number;
	children?: TocItem[];
}

/** Parsed document with content and metadata */
export interface ParsedDoc {
	frontmatter: DocFrontmatter;
	content: string;
	html: string;
	toc: TocItem[];
	slug: string;
	category: string;
	language: string;
	path: string;
}

/** Global docs configuration */
export interface DocsConfig {
	/** Default/fallback language for docs */
	defaultLanguage: string;
	/** Base path for docs URLs */
	basePath: string;
}
