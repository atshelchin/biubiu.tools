import type { RequestHandler } from './$types';

const site = 'https://biubiu.tools';
const supportedLocales = ['en', 'zh', 'ja', 'fr'];

// Locale to language code mapping for hreflang
const localeToLang: Record<string, string> = {
	en: 'en',
	zh: 'zh-CN',
	ja: 'ja',
	fr: 'fr'
};

/**
 * Extract route paths from Vite's import.meta.glob
 * This works at build time and in Cloudflare environment
 */
function extractRoutes(): string[] {
	// Use Vite's glob import to find all +page.svelte files
	const pages = import.meta.glob('/src/routes/**/+page.svelte', { eager: false });
	const routes: string[] = [];

	for (const path of Object.keys(pages)) {
		// Convert file path to route path
		// /src/routes/apps/token-sweep/+page.svelte -> /apps/token-sweep
		const route = path
			.replace('/src/routes', '')
			.replace('/+page.svelte', '')
			.replace(/\/\(.*?\)/g, ''); // Remove SvelteKit route groups

		// Handle root page
		if (route === '' || route === '/') {
			continue; // Skip, we'll add it separately
		}

		routes.push(route);
	}

	return routes.sort(); // Sort for consistent output
}

/**
 * Generate alternate links for multi-language support (Google SEO best practice)
 */
function generateAlternateLinks(route: string): string {
	const alternates: string[] = [];

	// Add x-default (no locale)
	alternates.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${site}${route}"/>`);

	// Add each locale
	for (const locale of supportedLocales) {
		const lang = localeToLang[locale];
		const url = `${site}/${locale}${route}`;
		alternates.push(`    <xhtml:link rel="alternate" hreflang="${lang}" href="${url}"/>`);
	}

	return alternates.join('\n');
}

function generateSitemap(): string {
	const urls: string[] = [];
	const today = new Date().toISOString().split('T')[0];

	// Get all routes
	const routes = extractRoutes();

	// Add homepage (no locale) with alternates
	urls.push(`
  <url>
    <loc>${site}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
${generateAlternateLinks('/')}
  </url>`);

	// Add all routes (each with locale variants and hreflang)
	for (const route of routes) {
		// Add main route (no locale) with all alternates
		urls.push(`
  <url>
    <loc>${site}${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
${generateAlternateLinks(route)}
  </url>`);

		// Add each localized version
		for (const locale of supportedLocales) {
			const url = `${site}/${locale}${route}`;
			urls.push(`
  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
${generateAlternateLinks(route)}
  </url>`);
		}
	}

	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('')}
</urlset>`.trim();
}

export const GET: RequestHandler = () => {
	const sitemap = generateSitemap();

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600, s-maxage=3600'
		}
	});
};

// Pre-render this route at build time for static hosting
export const prerender = true;
