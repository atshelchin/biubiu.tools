<script lang="ts">
	interface Props {
		title: string;
		description: string;
		keywords?: string;
		canonical: string;
		type?: 'website' | 'article';
		image?: string;
		locale?: string;
		structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
	}

	let {
		title,
		description,
		keywords,
		canonical,
		type = 'website',
		image = 'https://biubiu.tools/og-default.png',
		locale = 'en_US',
		structuredData
	}: Props = $props();

	// Convert structured data to JSON string for safe rendering
	const structuredDataScript = $derived(
		structuredData ? JSON.stringify(structuredData, null, 2) : null
	);
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={description} />
	{#if keywords}
		<meta name="keywords" content={keywords} />
	{/if}
	<link rel="canonical" href={canonical} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content={type} />
	<meta property="og:url" content={canonical} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />
	<meta property="og:locale" content={locale} />
	<meta property="og:site_name" content="BiuBiu Tools" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={canonical} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />

	<!-- Additional SEO -->
	<meta name="robots" content="index, follow" />
	<meta name="googlebot" content="index, follow" />
	<meta name="language" content="English" />
	<meta name="revisit-after" content="7 days" />
	<meta name="author" content="BiuBiu Tools" />
</svelte:head>

<!-- Structured Data (JSON-LD) for Google rich snippets -->
<!-- Placed outside svelte:head to avoid Prettier issues -->
{#if structuredDataScript}
	{@html '<' + 'script type="application/ld+json">' + structuredDataScript + '<' + '/script>'}
{/if}
