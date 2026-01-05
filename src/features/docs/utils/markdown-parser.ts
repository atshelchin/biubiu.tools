/**
 * Markdown Parser with Shiki Highlighting
 */

import { marked, type Tokens } from 'marked';
import { createHighlighter, type Highlighter } from 'shiki';
import type { DocFrontmatter, TocItem } from '../types';

let highlighterPromise: Promise<Highlighter> | null = null;

/**
 * Get or create Shiki highlighter singleton
 */
async function getHighlighter(): Promise<Highlighter> {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighter({
			themes: ['github-dark', 'github-light'],
			langs: [
				'javascript',
				'typescript',
				'json',
				'bash',
				'shell',
				'markdown',
				'html',
				'css',
				'solidity',
				'python',
				'yaml',
				'toml'
			]
		});
	}
	return highlighterPromise;
}

/**
 * Parse frontmatter from markdown content
 */
export function parseFrontmatter(content: string): {
	frontmatter: DocFrontmatter;
	content: string;
} {
	const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
	const match = content.match(frontmatterRegex);

	if (!match) {
		return {
			frontmatter: { title: 'Untitled' },
			content
		};
	}

	const frontmatterStr = match[1];
	const remainingContent = content.slice(match[0].length);

	// Simple YAML parser for frontmatter
	const frontmatter: DocFrontmatter = { title: 'Untitled' };
	const lines = frontmatterStr.split('\n');

	for (const line of lines) {
		const colonIndex = line.indexOf(':');
		if (colonIndex === -1) continue;

		const key = line.slice(0, colonIndex).trim();
		let value = line.slice(colonIndex + 1).trim();

		// Remove quotes if present
		if (
			(value.startsWith('"') && value.endsWith('"')) ||
			(value.startsWith("'") && value.endsWith("'"))
		) {
			value = value.slice(1, -1);
		}

		// Handle arrays (simple case: comma-separated in brackets)
		if (value.startsWith('[') && value.endsWith(']')) {
			const arrayContent = value.slice(1, -1);
			const items = arrayContent.split(',').map((item) => item.trim().replace(/^['"]|['"]$/g, ''));
			(frontmatter as Record<string, unknown>)[key] = items;
		} else if (value === 'true') {
			(frontmatter as Record<string, unknown>)[key] = true;
		} else if (value === 'false') {
			(frontmatter as Record<string, unknown>)[key] = false;
		} else if (!isNaN(Number(value)) && value !== '') {
			(frontmatter as Record<string, unknown>)[key] = Number(value);
		} else {
			(frontmatter as Record<string, unknown>)[key] = value;
		}
	}

	return { frontmatter, content: remainingContent };
}

/**
 * Generate a URL-safe slug from text, supporting Unicode characters
 */
function generateSlug(text: string): string {
	return (
		text
			.toLowerCase()
			// Keep Unicode letters/numbers, spaces, and hyphens
			.replace(/[^\p{L}\p{N}\s-]/gu, '')
			.trim()
			.replace(/\s+/g, '-')
	);
}

/**
 * Extract table of contents from markdown
 */
export function extractToc(content: string): TocItem[] {
	const headingRegex = /^(#{2,4})\s+(.+)$/gm;
	const toc: TocItem[] = [];
	const usedIds = new Map<string, number>();
	let match;

	while ((match = headingRegex.exec(content)) !== null) {
		const level = match[1].length;
		const text = match[2].trim();
		let id = generateSlug(text);

		// Handle empty or duplicate IDs
		if (!id) {
			id = 'section';
		}

		// Ensure unique IDs by appending a counter if needed
		const count = usedIds.get(id) || 0;
		if (count > 0) {
			id = `${id}-${count}`;
		}
		usedIds.set(id.replace(/-\d+$/, ''), count + 1);

		toc.push({ id, text, level });
	}

	return toc;
}

/**
 * Build hierarchical TOC structure
 */
export function buildTocTree(flatToc: TocItem[]): TocItem[] {
	const root: TocItem[] = [];
	const stack: { item: TocItem; level: number }[] = [];

	for (const item of flatToc) {
		const tocItem: TocItem = { ...item, children: [] };

		while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
			stack.pop();
		}

		if (stack.length === 0) {
			root.push(tocItem);
		} else {
			const parent = stack[stack.length - 1].item;
			if (!parent.children) parent.children = [];
			parent.children.push(tocItem);
		}

		stack.push({ item: tocItem, level: item.level });
	}

	return root;
}

/**
 * Parse markdown to HTML with Shiki highlighting
 */
export async function parseMarkdown(content: string): Promise<string> {
	const highlighter = await getHighlighter();

	// Configure marked with custom renderer
	const renderer = new marked.Renderer();

	// Track used IDs for unique heading anchors
	const usedIds = new Map<string, number>();

	// Custom heading renderer with IDs for TOC linking
	renderer.heading = function ({ tokens, depth }: Tokens.Heading): string {
		const text = this.parser.parseInline(tokens);
		const plainText = text.replace(/<[^>]*>/g, ''); // Remove HTML tags
		let id = generateSlug(plainText);

		// Handle empty or duplicate IDs (same logic as extractToc)
		if (!id) {
			id = 'section';
		}

		const count = usedIds.get(id) || 0;
		if (count > 0) {
			id = `${id}-${count}`;
		}
		usedIds.set(id.replace(/-\d+$/, ''), count + 1);

		return `<h${depth} id="${id}">${text}</h${depth}>\n`;
	};

	// Custom code block renderer with Shiki
	renderer.code = function ({ text, lang }: Tokens.Code): string {
		const language = lang || 'text';
		try {
			const html = highlighter.codeToHtml(text, {
				lang: language,
				themes: {
					light: 'github-light',
					dark: 'github-dark'
				}
			});
			return `<div class="code-block" data-lang="${language}">${html}</div>`;
		} catch {
			// Fallback for unsupported languages
			return `<pre><code class="language-${language}">${text}</code></pre>`;
		}
	};

	// Custom link renderer for external links
	renderer.link = function ({ href, title, tokens }: Tokens.Link): string {
		const text = this.parser.parseInline(tokens);
		const isExternal = href.startsWith('http://') || href.startsWith('https://');
		const attrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
		const titleAttr = title ? ` title="${title}"` : '';
		return `<a href="${href}"${titleAttr}${attrs}>${text}</a>`;
	};

	marked.setOptions({
		renderer,
		gfm: true,
		breaks: false
	});

	return marked.parse(content) as string;
}

/**
 * Full document parsing pipeline
 */
export async function parseDocument(rawContent: string): Promise<{
	frontmatter: DocFrontmatter;
	html: string;
	toc: TocItem[];
}> {
	const { frontmatter, content } = parseFrontmatter(rawContent);
	const flatToc = extractToc(content);
	const toc = buildTocTree(flatToc);
	const html = await parseMarkdown(content);

	return { frontmatter, html, toc };
}
