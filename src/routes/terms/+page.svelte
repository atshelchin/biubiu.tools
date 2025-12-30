<script lang="ts">
	import { useI18n } from '@shelchin/i18n';

	const i18n = useI18n();
</script>

<svelte:head>
	<title>{i18n.t('routes/terms.page_title')} | BiuBiu Tools</title>
	<meta name="description" content={i18n.t('routes/terms.page_description')} />
</svelte:head>

<div class="terms-page">
	<div class="container">
		<h1>{i18n.t('routes/terms.title')}</h1>
		<p class="last-updated">{i18n.t('routes/terms.last_updated')}: 2025-12-22</p>

		<div class="authoritative-notice">
			{i18n.t('routes/terms.authoritative_notice')}
		</div>

		<section>
			<h2>{i18n.t('routes/terms.acceptance.title')}</h2>
			<p>{i18n.t('routes/terms.acceptance.content')}</p>
		</section>

		<section>
			<h2>{i18n.t('routes/terms.description.title')}</h2>
			<p>{i18n.t('routes/terms.description.content')}</p>
		</section>

		<section>
			<h2>{i18n.t('routes/terms.risks.title')}</h2>
			<p>{i18n.t('routes/terms.risks.intro')}</p>
			<ul>
				<li>{i18n.t('routes/terms.risks.item1')}</li>
				<li>{i18n.t('routes/terms.risks.item2')}</li>
				<li>{i18n.t('routes/terms.risks.item3')}</li>
				<li>{i18n.t('routes/terms.risks.item4')}</li>
				<li>{i18n.t('routes/terms.risks.item5')}</li>
			</ul>
		</section>

		<section>
			<h2>{i18n.t('routes/terms.no_advice.title')}</h2>
			<p>{i18n.t('routes/terms.no_advice.content')}</p>
		</section>

		<section>
			<h2>{i18n.t('routes/terms.user_responsibility.title')}</h2>
			<p>{i18n.t('routes/terms.user_responsibility.intro')}</p>
			<ul>
				<li>{i18n.t('routes/terms.user_responsibility.item1')}</li>
				<li>{i18n.t('routes/terms.user_responsibility.item2')}</li>
				<li>{i18n.t('routes/terms.user_responsibility.item3')}</li>
				<li>{i18n.t('routes/terms.user_responsibility.item4')}</li>
			</ul>
		</section>

		<section>
			<h2>{i18n.t('routes/terms.disclaimer.title')}</h2>
			<p>{i18n.t('routes/terms.disclaimer.content')}</p>
		</section>

		<section>
			<h2>{i18n.t('routes/terms.limitation.title')}</h2>
			<p>{i18n.t('routes/terms.limitation.content')}</p>
		</section>

		<section>
			<h2>{i18n.t('routes/terms.prohibited.title')}</h2>
			<p>{i18n.t('routes/terms.prohibited.intro')}</p>
			<ul>
				<li>{i18n.t('routes/terms.prohibited.item1')}</li>
				<li>{i18n.t('routes/terms.prohibited.item2')}</li>
				<li>{i18n.t('routes/terms.prohibited.item3')}</li>
				<li>{i18n.t('routes/terms.prohibited.item4')}</li>
			</ul>
		</section>

		<section>
			<h2>{i18n.t('routes/terms.open_source.title')}</h2>
			<p>{i18n.t('routes/terms.open_source.content')}</p>
		</section>

		<section>
			<h2>{i18n.t('routes/terms.modifications.title')}</h2>
			<p>{i18n.t('routes/terms.modifications.content')}</p>
		</section>

		<section>
			<h2>{i18n.t('routes/terms.contact.title')}</h2>
			<p>{i18n.t('routes/terms.contact.content')}</p>
		</section>
	</div>
</div>

<style>
	.terms-page {
		min-height: 100vh;
		padding: var(--space-8) var(--space-4);
		background: var(--color-background);
	}

	.container {
		max-width: 800px;
		margin: 0 auto;
	}

	h1 {
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		color: var(--color-foreground);
		margin-bottom: var(--space-2);
	}

	.last-updated {
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
		margin-bottom: var(--space-4);
	}

	.authoritative-notice {
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
		background: hsla(var(--brand-hue), var(--brand-saturation), 50%, 0.08);
		border: 1px solid hsla(var(--brand-hue), var(--brand-saturation), 50%, 0.2);
		border-radius: var(--radius-md);
		padding: var(--space-3) var(--space-4);
		margin-bottom: var(--space-8);
	}

	section {
		margin-bottom: var(--space-8);
	}

	h2 {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		color: var(--color-foreground);
		margin-bottom: var(--space-3);
		padding-bottom: var(--space-2);
		border-bottom: 1px solid var(--color-border);
	}

	p {
		font-size: var(--text-base);
		color: var(--color-muted-foreground);
		line-height: 1.7;
		margin-bottom: var(--space-3);
	}

	ul {
		list-style: disc;
		padding-left: var(--space-6);
		margin-bottom: var(--space-3);
	}

	li {
		font-size: var(--text-base);
		color: var(--color-muted-foreground);
		line-height: 1.6;
		margin-bottom: var(--space-2);
	}

	@media (max-width: 768px) {
		.terms-page {
			padding: var(--space-6) var(--space-4);
		}

		h1 {
			font-size: var(--text-2xl);
		}

		h2 {
			font-size: var(--text-lg);
		}
	}
</style>
