<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';

	const i18n = useI18n();
</script>

<svelte:head>
	<title>{i18n.t('privacy.page_title')} | BiuBiu Tools</title>
	<meta name="description" content={i18n.t('privacy.page_description')} />
</svelte:head>

<div class="privacy-page">
	<div class="container">
		<h1>{i18n.t('privacy.title')}</h1>
		<p class="last-updated">{i18n.t('privacy.last_updated')}: 2025-12-22</p>

		<section>
			<h2>{i18n.t('privacy.introduction.title')}</h2>
			<p>{i18n.t('privacy.introduction.content')}</p>
		</section>

		<section>
			<h2>{i18n.t('privacy.data_collection.title')}</h2>
			<p>{i18n.t('privacy.data_collection.intro')}</p>

			<h3>{i18n.t('privacy.data_collection.necessary.title')}</h3>
			<ul>
				<li>{i18n.t('privacy.data_collection.necessary.item1')}</li>
				<li>{i18n.t('privacy.data_collection.necessary.item2')}</li>
				<li>{i18n.t('privacy.data_collection.necessary.item3')}</li>
				<li>{i18n.t('privacy.data_collection.necessary.item4')}</li>
				<li>{i18n.t('privacy.data_collection.necessary.item5')}</li>
			</ul>

			<h3>{i18n.t('privacy.data_collection.analytics.title')}</h3>
			<ul>
				<li>{i18n.t('privacy.data_collection.analytics.item1')}</li>
				<li>{i18n.t('privacy.data_collection.analytics.item2')}</li>
				<li>{i18n.t('privacy.data_collection.analytics.item3')}</li>
			</ul>
		</section>

		<section>
			<h2>{i18n.t('privacy.local_storage.title')}</h2>
			<p>{i18n.t('privacy.local_storage.content')}</p>
			<ul>
				<li>{i18n.t('privacy.local_storage.item1')}</li>
				<li>{i18n.t('privacy.local_storage.item2')}</li>
				<li>{i18n.t('privacy.local_storage.item3')}</li>
				<li>{i18n.t('privacy.local_storage.item4')}</li>
			</ul>
		</section>

		<section>
			<h2>{i18n.t('privacy.third_party.title')}</h2>
			<p>{i18n.t('privacy.third_party.content')}</p>
		</section>

		<section>
			<h2>{i18n.t('privacy.your_rights.title')}</h2>
			<p>{i18n.t('privacy.your_rights.content')}</p>
			<ul>
				<li>{i18n.t('privacy.your_rights.item1')}</li>
				<li>{i18n.t('privacy.your_rights.item2')}</li>
				<li>{i18n.t('privacy.your_rights.item3')}</li>
			</ul>
		</section>

		<section>
			<h2>{i18n.t('privacy.contact.title')}</h2>
			<p>{i18n.t('privacy.contact.content')}</p>
		</section>
	</div>
</div>

<style>
	.privacy-page {
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

	h3 {
		font-size: var(--text-lg);
		font-weight: var(--font-medium);
		color: var(--color-foreground);
		margin: var(--space-4) 0 var(--space-2);
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
		.privacy-page {
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
