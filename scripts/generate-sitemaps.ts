/**
 * Sitemap Generation Script
 *
 * Generates static sitemap XML files for better SEO performance.
 * Run with: bun run sitemap
 *
 * Output files in /static:
 * - sitemap.xml (index)
 * - sitemap-static.xml
 * - sitemap-chains.xml
 * - sitemap-addresses.xml
 * - sitemap-names.xml
 * - sitemap-tools.xml
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// Import data sources
import rawChains from '../static/rpcs.json';
import { categories } from '../src/features/chain-tools/data/categories';
import { allAddresses, allNames } from '../src/features/address/data/index';

const SITE = 'https://biubiu.tools';
const SUPPORTED_LOCALES = ['en', 'zh'];
const OUTPUT_DIR = join(process.cwd(), 'static');

// Locale to language code mapping for hreflang
const LOCALE_TO_LANG: Record<string, string> = {
	en: 'en',
	zh: 'zh-CN',
	ja: 'ja',
	fr: 'fr'
};

interface Chain {
	chainId: number;
	name: string;
	chainSlug?: string;
	shortName?: string;
	isTestnet?: boolean;
}

const chains = rawChains as Chain[];

// Get unique labels from addresses
const uniqueLabels = [...new Set(allAddresses.flatMap((a) => a.labels))];

/**
 * Generate alternate links for multi-language support
 * @param baseRoute - The route WITHOUT locale prefix (e.g., "/chains" not "/en/chains")
 */
function generateAlternateLinks(baseRoute: string): string {
	const alternates: string[] = [];

	// Add x-default (no locale prefix)
	alternates.push(
		`    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${baseRoute}"/>`
	);

	// Add each locale
	for (const locale of SUPPORTED_LOCALES) {
		const lang = LOCALE_TO_LANG[locale];
		const url = `${SITE}/${locale}${baseRoute}`;
		alternates.push(`    <xhtml:link rel="alternate" hreflang="${lang}" href="${url}"/>`);
	}

	return alternates.join('\n');
}

/**
 * Generate a single URL entry
 * @param loc - The full URL path (may include locale prefix)
 * @param baseRoute - The base route without locale prefix (for alternate links)
 */
function generateUrl(
	loc: string,
	options: {
		lastmod?: string;
		changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
		priority?: number;
		includeAlternates?: boolean;
		baseRoute?: string; // Base route for alternate links (without locale)
	} = {}
): string {
	const {
		lastmod = new Date().toISOString().split('T')[0],
		changefreq = 'weekly',
		priority = 0.8,
		includeAlternates = true,
		baseRoute
	} = options;

	// Use baseRoute for alternates if provided, otherwise use loc
	const alternates = includeAlternates && baseRoute ? `\n${generateAlternateLinks(baseRoute)}` : '';

	return `  <url>
    <loc>${SITE}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${alternates}
  </url>`;
}

/**
 * Wrap URLs in sitemap XML structure
 */
function wrapSitemap(urls: string[]): string {
	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>`;
}

/**
 * Generate sitemap index
 */
function generateSitemapIndex(sitemaps: string[]): string {
	const today = new Date().toISOString().split('T')[0];

	const entries = sitemaps
		.map(
			(sitemap) => `  <sitemap>
    <loc>${SITE}/${sitemap}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`
		)
		.join('\n');

	return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`;
}

/**
 * Generate static pages sitemap
 */
function generateStaticSitemap(): string {
	const staticRoutes = [
		{ path: '/', priority: 1.0, changefreq: 'daily' as const },
		{ path: '/chains', priority: 0.9, changefreq: 'daily' as const },
		{ path: '/address', priority: 0.9, changefreq: 'daily' as const },
		{ path: '/apps/chain-tools', priority: 0.9, changefreq: 'weekly' as const },
		{ path: '/apps/chainlist', priority: 0.8, changefreq: 'weekly' as const },
		{ path: '/apps/wallet-generator', priority: 0.8, changefreq: 'monthly' as const },
		{ path: '/apps/wallet-sweep', priority: 0.8, changefreq: 'monthly' as const },
		{ path: '/apps/ens-scanner', priority: 0.8, changefreq: 'monthly' as const },
		{ path: '/apps/token-deployer', priority: 0.8, changefreq: 'monthly' as const },
		{ path: '/apps/nft-deployer', priority: 0.8, changefreq: 'monthly' as const },
		{ path: '/apps/contract-deployer', priority: 0.8, changefreq: 'monthly' as const },
		{ path: '/apps/call-master', priority: 0.8, changefreq: 'monthly' as const },
		{ path: '/apps/assets-monitor', priority: 0.8, changefreq: 'monthly' as const },
		{ path: '/apps/drain-balance', priority: 0.8, changefreq: 'monthly' as const },
		{ path: '/apps/token-balance-scanner', priority: 0.8, changefreq: 'monthly' as const },
		{ path: '/apps/one-to-many-transfer', priority: 0.8, changefreq: 'monthly' as const },
		{ path: '/apps/contract-events-scanner', priority: 0.8, changefreq: 'monthly' as const },
		{ path: '/apps/nft-manager', priority: 0.8, changefreq: 'monthly' as const },
		{ path: '/apps/dex-moonshot-trader', priority: 0.8, changefreq: 'monthly' as const },
		{ path: '/privacy', priority: 0.3, changefreq: 'yearly' as const },
		{ path: '/terms', priority: 0.3, changefreq: 'yearly' as const }
	];

	const urls: string[] = [];

	for (const route of staticRoutes) {
		// Main route with alternates pointing to the base route
		urls.push(
			generateUrl(route.path, {
				priority: route.priority,
				changefreq: route.changefreq,
				baseRoute: route.path
			})
		);

		// Localized routes - all share the same alternates pointing to base route
		for (const locale of SUPPORTED_LOCALES) {
			urls.push(
				generateUrl(`/${locale}${route.path}`, {
					priority: route.priority * 0.9,
					changefreq: route.changefreq,
					baseRoute: route.path
				})
			);
		}
	}

	return wrapSitemap(urls);
}

/**
 * Generate chains sitemap
 */
function generateChainsSitemap(): string {
	const urls: string[] = [];

	// Filter mainnet chains only
	const mainnetChains = chains.filter((c) => !c.isTestnet);

	for (const chain of mainnetChains) {
		const slug = chain.chainSlug || chain.shortName;
		if (!slug) continue;

		const path = `/chains/${slug.toLowerCase()}`;

		// Main route
		urls.push(generateUrl(path, { priority: 0.7, changefreq: 'weekly', baseRoute: path }));

		// Localized routes
		for (const locale of SUPPORTED_LOCALES) {
			urls.push(
				generateUrl(`/${locale}${path}`, { priority: 0.6, changefreq: 'weekly', baseRoute: path })
			);
		}
	}

	return wrapSitemap(urls);
}

/**
 * Generate addresses sitemap
 */
function generateAddressesSitemap(): string {
	const urls: string[] = [];

	// Map chain IDs to slugs
	const chainIdToSlug: Record<number, string> = {
		1: 'ethereum',
		8453: 'base',
		42161: 'arbitrum',
		10: 'optimism',
		137: 'polygon',
		56: 'bnb',
		43114: 'avalanche',
		250: 'fantom',
		100: 'gnosis',
		324: 'zksync',
		59144: 'linea',
		534352: 'scroll',
		5000: 'mantle',
		81457: 'blast',
		34443: 'mode',
		167000: 'taiko'
	};

	// Generate address URLs
	for (const addr of allAddresses) {
		const chainSlug = chainIdToSlug[addr.chainId];
		if (!chainSlug) continue;

		const path = `/address/${chainSlug}/${addr.address}`;

		// Main route only (no locale variants for individual addresses to keep sitemap manageable)
		urls.push(
			generateUrl(path, { priority: 0.5, changefreq: 'monthly', includeAlternates: false })
		);
	}

	// Generate label pages
	for (const label of uniqueLabels) {
		const path = `/address/labels/${label}`;

		// Main route
		urls.push(generateUrl(path, { priority: 0.6, changefreq: 'weekly', baseRoute: path }));

		// Localized routes
		for (const locale of SUPPORTED_LOCALES) {
			urls.push(
				generateUrl(`/${locale}${path}`, { priority: 0.5, changefreq: 'weekly', baseRoute: path })
			);
		}
	}

	return wrapSitemap(urls);
}

/**
 * Generate names sitemap (ENS, etc.)
 */
function generateNamesSitemap(): string {
	const urls: string[] = [];

	for (const name of allNames) {
		const path = `/name/${encodeURIComponent(name.name)}`;

		// Main route only
		urls.push(
			generateUrl(path, { priority: 0.5, changefreq: 'monthly', includeAlternates: false })
		);
	}

	return wrapSitemap(urls);
}

/**
 * Generate chain-tools category sitemap
 */
function generateToolsSitemap(): string {
	const urls: string[] = [];

	for (const category of categories) {
		const path = `/apps/chain-tools/${category.id}`;

		// Main route
		urls.push(generateUrl(path, { priority: 0.7, changefreq: 'weekly', baseRoute: path }));

		// Localized routes
		for (const locale of SUPPORTED_LOCALES) {
			urls.push(
				generateUrl(`/${locale}${path}`, { priority: 0.6, changefreq: 'weekly', baseRoute: path })
			);
		}
	}

	return wrapSitemap(urls);
}

/**
 * Main function
 */
function main() {
	console.log('🗺️  Generating sitemaps...\n');

	// Ensure output directory exists
	if (!existsSync(OUTPUT_DIR)) {
		mkdirSync(OUTPUT_DIR, { recursive: true });
	}

	const sitemapFiles: string[] = [];

	// Generate static sitemap
	console.log('📄 Generating sitemap-static.xml...');
	const staticSitemap = generateStaticSitemap();
	writeFileSync(join(OUTPUT_DIR, 'sitemap-static.xml'), staticSitemap);
	sitemapFiles.push('sitemap-static.xml');
	console.log(`   ✓ Static pages sitemap generated`);

	// Generate chains sitemap
	console.log('🔗 Generating sitemap-chains.xml...');
	const chainsSitemap = generateChainsSitemap();
	writeFileSync(join(OUTPUT_DIR, 'sitemap-chains.xml'), chainsSitemap);
	sitemapFiles.push('sitemap-chains.xml');
	const mainnetCount = chains.filter((c) => !c.isTestnet).length;
	console.log(`   ✓ ${mainnetCount} chains indexed`);

	// Generate addresses sitemap
	console.log('📬 Generating sitemap-addresses.xml...');
	const addressesSitemap = generateAddressesSitemap();
	writeFileSync(join(OUTPUT_DIR, 'sitemap-addresses.xml'), addressesSitemap);
	sitemapFiles.push('sitemap-addresses.xml');
	console.log(`   ✓ ${allAddresses.length} addresses + ${uniqueLabels.length} labels indexed`);

	// Generate names sitemap
	console.log('🏷️  Generating sitemap-names.xml...');
	const namesSitemap = generateNamesSitemap();
	writeFileSync(join(OUTPUT_DIR, 'sitemap-names.xml'), namesSitemap);
	sitemapFiles.push('sitemap-names.xml');
	console.log(`   ✓ ${allNames.length} names indexed`);

	// Generate tools sitemap
	console.log('🔧 Generating sitemap-tools.xml...');
	const toolsSitemap = generateToolsSitemap();
	writeFileSync(join(OUTPUT_DIR, 'sitemap-tools.xml'), toolsSitemap);
	sitemapFiles.push('sitemap-tools.xml');
	console.log(`   ✓ ${categories.length} tool categories indexed`);

	// Generate sitemap index
	console.log('\n📑 Generating sitemap.xml (index)...');
	const sitemapIndex = generateSitemapIndex(sitemapFiles);
	writeFileSync(join(OUTPUT_DIR, 'sitemap.xml'), sitemapIndex);
	console.log('   ✓ Sitemap index generated');

	// Summary
	console.log('\n✅ All sitemaps generated successfully!');
	console.log('\nFiles created in /static:');
	console.log('  - sitemap.xml (index)');
	sitemapFiles.forEach((f) => console.log(`  - ${f}`));

	// Stats
	const totalUrls =
		mainnetCount * (SUPPORTED_LOCALES.length + 1) +
		allAddresses.length +
		uniqueLabels.length * (SUPPORTED_LOCALES.length + 1) +
		allNames.length +
		categories.length * (SUPPORTED_LOCALES.length + 1);

	console.log(`\n📊 Total URLs indexed: ~${totalUrls}`);
}

main();
