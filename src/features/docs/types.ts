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

/** Navigation structure for a version */
export interface DocNavigation {
	version: string;
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
	version: string;
	path: string;
}

/** Version configuration */
export interface DocVersion {
	id: string;
	label: string;
	isDefault?: boolean;
	isLatest?: boolean;
}

/** Global docs configuration */
export interface DocsConfig {
	versions: DocVersion[];
	defaultVersion: string;
	basePath: string;
}
