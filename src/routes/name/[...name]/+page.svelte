<script lang="ts">
	import { useI18n, type TranslationKeys } from '@shelchin/i18n';
	import {
		ArrowLeft,
		Copy,
		ExternalLink,
		Check,
		Globe,
		Twitter,
		Github,
		Link2,
		Calendar,
		Clock,
		Mail,
		MessageCircle,
		MapPin
		// User
	} from '@lucide/svelte';
	import SeoHead from '$lib/components/seo-head.svelte';
	import type { PageData } from './$types';
	// import type { SocialLink } from './+page.server';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();

	// Get icon component for social platform
	function getSocialIcon(platform: string) {
		const icons: Record<string, typeof Twitter> = {
			Twitter,
			GitHub: Github,
			Website: Globe,
			Email: Mail,
			Discord: MessageCircle,
			Telegram: MessageCircle,
			Reddit: MessageCircle
		};
		return icons[platform] || Globe;
	}

	// Calculate days until expiration or days since expiration
	function getExpirationInfo(expiresAt: string | undefined): {
		daysRemaining: number;
		isExpired: boolean;
	} | null {
		if (!expiresAt) return null;
		const expirationDate = new Date(expiresAt);
		const now = new Date();
		const diffTime = expirationDate.getTime() - now.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return {
			daysRemaining: Math.abs(diffDays),
			isExpired: diffDays < 0
		};
	}

	// Use ENS records expiry if available, otherwise fallback to static data
	const effectiveExpiresAt = $derived(data.ensRecords?.expiresAt || data.name.expiresAt);
	const expirationInfo = $derived(getExpirationInfo(effectiveExpiresAt));

	// Copy state
	let copiedName = $state(false);
	let copiedAddress = $state(false);

	async function copyName() {
		await navigator.clipboard.writeText(data.name.name);
		copiedName = true;
		setTimeout(() => (copiedName = false), 2000);
	}

	async function copyAddress() {
		if (data.name.address) {
			await navigator.clipboard.writeText(data.name.address);
			copiedAddress = true;
			setTimeout(() => (copiedAddress = false), 2000);
		}
	}

	// Name type info
	const nameTypeInfo: Record<string, { label: string; explorer: string }> = {
		ens: { label: 'ENS', explorer: 'https://app.ens.domains/name/' },
		'spaceid-bnb': { label: 'Space ID (.bnb)', explorer: 'https://space.id/name/' },
		'spaceid-arb': { label: 'Space ID (.arb)', explorer: 'https://space.id/name/' },
		basename: { label: 'Base Names', explorer: 'https://www.base.org/names/' },
		unstoppable: { label: 'Unstoppable Domains', explorer: 'https://unstoppabledomains.com/d/' }
	};

	const typeInfo = nameTypeInfo[data.name.type] || {
		label: data.name.type,
		explorer: ''
	};
</script>

<SeoHead
	title={data.meta.title}
	description={data.meta.description}
	keywords={data.meta.keywords}
	canonical={data.meta.canonical}
	type={data.meta.type}
	image={data.meta.image}
	locale={data.meta.locale}
	structuredData={data.structuredData}
/>

<div class="name-detail-page">
	<!-- Breadcrumb -->
	<nav class="breadcrumb">
		<a href="/address" class="back-link">
			<ArrowLeft class="icon" />
			<span>{i18n.t('routes/address.all_addresses')}</span>
		</a>
	</nav>

	<!-- Main Card -->
	<div class="main-card">
		<!-- Header -->
		<div class="card-header">
			<div class="name-info">
				{#if data.ensRecords?.avatar || data.name.avatar}
					<img
						src={data.ensRecords?.avatar || data.name.avatar}
						alt={data.name.name}
						class="name-avatar"
					/>
				{:else}
					<div class="name-placeholder">
						{data.name.name.charAt(0).toUpperCase()}
					</div>
				{/if}
				<div class="name-text">
					<h1 class="name-title">{data.name.name}</h1>
					<span class="name-type">{typeInfo.label}</span>
				</div>
			</div>

			<button class="copy-btn" onclick={copyName}>
				{#if copiedName}
					<Check class="icon" />
				{:else}
					<Copy class="icon" />
				{/if}
			</button>
		</div>

		<!-- Description -->
		{#if data.ensRecords?.textRecords?.description || data.name.description}
			<p class="description">
				{data.ensRecords?.textRecords?.description || data.name.description}
			</p>
		{/if}

		<!-- ENS Text Records (Additional info) -->
		{#if data.ensRecords?.textRecords?.location || data.ensRecords?.textRecords?.keywords || data.ensRecords?.textRecords?.notice}
			<div class="ens-metadata-section">
				<h3 class="section-label">{i18n.t('routes/name.ens_records')}</h3>
				<div class="ens-metadata-grid">
					{#if data.ensRecords?.textRecords?.location}
						<div class="ens-metadata-item">
							<MapPin class="icon-inline" />
							<span class="ens-metadata-label">{i18n.t('routes/name.location')}</span>
							<span class="ens-metadata-value">{data.ensRecords.textRecords.location}</span>
						</div>
					{/if}
					{#if data.ensRecords?.textRecords?.keywords}
						<div class="ens-metadata-item">
							<span class="ens-metadata-label">{i18n.t('routes/name.keywords')}</span>
							<span class="ens-metadata-value">{data.ensRecords.textRecords.keywords}</span>
						</div>
					{/if}
					{#if data.ensRecords?.textRecords?.notice}
						<div class="ens-metadata-item notice">
							<span class="ens-metadata-value">{data.ensRecords.textRecords.notice}</span>
						</div>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Entity Info -->
		{#if data.entity}
			<div class="entity-section">
				<h3 class="entity-label">{i18n.t('routes/name.owner')}</h3>
				<div class="entity-card">
					{#if data.entity.logo}
						<img src={data.entity.logo} alt={data.entity.name} class="entity-logo" />
					{/if}
					<span class="entity-name">{data.entity.name}</span>
				</div>
			</div>
		{/if}

		<!-- Registration Info -->
		{#if data.name.registrationStatus || data.name.registeredAt || effectiveExpiresAt}
			<div class="registration-section">
				<h3 class="section-label">{i18n.t('routes/name.registration_info')}</h3>
				<div class="registration-grid">
					{#if data.name.registrationStatus}
						<div class="registration-item">
							<span class="registration-label">{i18n.t('routes/name.registration_status')}</span>
							<span class="registration-status status-{data.name.registrationStatus}">
								{i18n.t(('routes/name.status.' + data.name.registrationStatus) as keyof TranslationKeys)}
							</span>
						</div>
					{/if}

					{#if data.name.registeredAt}
						<div class="registration-item">
							<span class="registration-label">
								<Calendar class="icon-inline" />
								{i18n.t('routes/name.registered_at')}
							</span>
							<span class="registration-value">{data.name.registeredAt}</span>
						</div>
					{/if}

					{#if effectiveExpiresAt}
						<div class="registration-item">
							<span class="registration-label">
								<Clock class="icon-inline" />
								{i18n.t('routes/name.expires_at')}
							</span>
							<span class="registration-value">
								{new Date(effectiveExpiresAt).toLocaleDateString()}
								{#if expirationInfo}
									<span class="expiration-info" class:expired={expirationInfo.isExpired}>
										{#if expirationInfo.isExpired}
											({i18n.t('routes/name.expired_ago', { days: expirationInfo.daysRemaining })})
										{:else}
											({i18n.t('routes/name.days_remaining', { days: expirationInfo.daysRemaining })})
										{/if}
									</span>
								{/if}
							</span>
						</div>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Resolved Address -->
		{#if data.name.address}
			<div class="address-section">
				<h3 class="section-label">{i18n.t('routes/name.resolved_address')}</h3>
				<div class="address-row">
					<code class="address-full">{data.name.address}</code>
					<button class="copy-btn-small" onclick={copyAddress}>
						{#if copiedAddress}
							<Check class="icon" />
						{:else}
							<Copy class="icon" />
						{/if}
					</button>
				</div>

				{#if data.resolvedAddress}
					<a
						href="/address/{data.resolvedAddress.chainId}/{data.resolvedAddress.address}"
						class="address-link"
					>
						<Link2 class="icon" />
						<span>{i18n.t('routes/name.view_address_details')}</span>
					</a>
				{/if}
			</div>
		{:else}
			<div class="not-resolved">
				<span>{i18n.t('routes/name.not_resolved')}</span>
			</div>
		{/if}

		<!-- Social Links from ENS Records -->
		{#if data.socialLinks && data.socialLinks.length > 0}
			<div class="socials-section">
				<h3 class="section-label">{i18n.t('routes/name.socials')}</h3>
				<div class="social-links">
					{#each data.socialLinks as link (link.platform)}
						{@const IconComponent = getSocialIcon(link.platform)}
						<a href={link.url} target="_blank" rel="noopener noreferrer" class="social-link">
							<IconComponent class="icon" />
							<span>{link.display}</span>
						</a>
					{/each}
				</div>
			</div>
		{:else if data.name.socials}
			<!-- Fallback to static socials -->
			<div class="socials-section">
				<h3 class="section-label">{i18n.t('routes/name.socials')}</h3>
				<div class="social-links">
					{#if data.name.socials.website}
						<a
							href={data.name.socials.website}
							target="_blank"
							rel="noopener noreferrer"
							class="social-link"
						>
							<Globe class="icon" />
							<span>Website</span>
						</a>
					{/if}
					{#if data.name.socials.twitter}
						<a
							href="https://twitter.com/{data.name.socials.twitter}"
							target="_blank"
							rel="noopener noreferrer"
							class="social-link"
						>
							<Twitter class="icon" />
							<span>@{data.name.socials.twitter}</span>
						</a>
					{/if}
					{#if data.name.socials.github}
						<a
							href="https://github.com/{data.name.socials.github}"
							target="_blank"
							rel="noopener noreferrer"
							class="social-link"
						>
							<Github class="icon" />
							<span>{data.name.socials.github}</span>
						</a>
					{/if}
				</div>
			</div>
		{/if}

		<!-- External Links -->
		<div class="external-links">
			{#if typeInfo.explorer}
				<a
					href="{typeInfo.explorer}{data.name.name}"
					target="_blank"
					rel="noopener noreferrer"
					class="external-link"
				>
					<ExternalLink class="icon" />
					<span>{i18n.t('routes/name.view_on', { platform: typeInfo.label })}</span>
				</a>
			{/if}

			{#if data.name.address}
				<a
					href="https://etherscan.io/address/{data.name.address}"
					target="_blank"
					rel="noopener noreferrer"
					class="external-link"
				>
					<ExternalLink class="icon" />
					<span>{i18n.t('routes/name.view_on_etherscan')}</span>
				</a>
			{/if}
		</div>
	</div>

	<!-- FAQ Section for SEO -->
	<section class="faq-section">
		<h2 class="section-title">{i18n.t('routes/name.faq.title')}</h2>

		<div class="faq-list">
			<details class="faq-item">
				<summary class="faq-question"
					>{i18n.t('routes/name.faq.what_is', { name: data.name.name })}</summary
				>
				<p class="faq-answer">
					{i18n.t('routes/name.faq.what_is_answer', {
						name: data.name.name,
						type: typeInfo.label
					})}
				</p>
			</details>

			<details class="faq-item">
				<summary class="faq-question">{i18n.t('routes/name.faq.how_to_use')}</summary>
				<p class="faq-answer">
					{i18n.t('routes/name.faq.how_to_use_answer', { name: data.name.name })}
				</p>
			</details>

			{#if data.name.address}
				<details class="faq-item">
					<summary class="faq-question">{i18n.t('routes/name.faq.who_owns')}</summary>
					<p class="faq-answer">
						{i18n.t('routes/name.faq.who_owns_answer', {
							name: data.name.name,
							address: `${data.name.address.slice(0, 10)}...${data.name.address.slice(-6)}`
						})}
					</p>
				</details>
			{/if}
		</div>
	</section>

	<!-- Data Source Footer -->
	<footer class="data-source">
		<p>
			{i18n.t('routes/address.data_source')}:
			{i18n.t(('routes/address.source_' + data.name.source) as keyof TranslationKeys)}
			· {i18n.t('routes/address.updated')}: {data.name.updatedAt}
		</p>
	</footer>
</div>

<style>
	.name-detail-page {
		max-width: 700px;
		margin: 0 auto;
		padding: var(--space-6);
	}

	/* Breadcrumb */
	.breadcrumb {
		margin-bottom: var(--space-6);
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-description-2);
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.back-link:hover {
		color: var(--color-heading-1);
	}

	.back-link :global(.icon) {
		width: 16px;
		height: 16px;
	}

	/* Main Card */
	.main-card {
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-xl);
		padding: var(--space-6);
	}

	.card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-4);
		margin-bottom: var(--space-5);
	}

	.name-info {
		display: flex;
		align-items: center;
		gap: var(--space-4);
	}

	.name-avatar {
		width: 64px;
		height: 64px;
		border-radius: var(--radius-full);
		object-fit: cover;
	}

	.name-placeholder {
		width: 64px;
		height: 64px;
		border-radius: var(--radius-full);
		background: linear-gradient(135deg, #3b82f6, #8b5cf6);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: white;
	}

	.name-text {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.name-title {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: #3b82f6;
		margin: 0;
	}

	.name-type {
		font-size: var(--text-sm);
		color: var(--color-description-2);
	}

	.copy-btn {
		padding: var(--space-3);
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-md);
		color: var(--color-description-2);
		cursor: pointer;
		transition: all 0.2s;
	}

	.copy-btn:hover {
		background: var(--color-panel-3);
		color: var(--color-heading-1);
	}

	.copy-btn :global(.icon) {
		width: 18px;
		height: 18px;
	}

	/* Description */
	.description {
		font-size: var(--text-base);
		color: var(--color-description-1);
		line-height: 1.6;
		margin: 0 0 var(--space-5);
		padding: var(--space-4);
		background: var(--color-panel-2);
		border-radius: var(--radius-lg);
	}

	/* ENS Metadata Section */
	.ens-metadata-section {
		margin-bottom: var(--space-5);
	}

	.ens-metadata-grid {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		padding: var(--space-4);
		background: var(--color-panel-2);
		border-radius: var(--radius-md);
	}

	.ens-metadata-item {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
	}

	.ens-metadata-item :global(.icon-inline) {
		width: 14px;
		height: 14px;
		color: var(--color-description-3);
		flex-shrink: 0;
	}

	.ens-metadata-label {
		color: var(--color-description-3);
		min-width: 80px;
	}

	.ens-metadata-value {
		color: var(--color-heading-2);
	}

	.ens-metadata-item.notice {
		padding: var(--space-2);
		background: rgba(245, 158, 11, 0.1);
		border-radius: var(--radius-sm);
		border-left: 3px solid #f59e0b;
	}

	.ens-metadata-item.notice .ens-metadata-value {
		color: var(--color-description-1);
		font-style: italic;
	}

	/* Entity Section */
	.entity-section {
		margin-bottom: var(--space-5);
	}

	.entity-label,
	.section-label {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-description-3);
		margin: 0 0 var(--space-2);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.entity-card {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3);
		background: var(--color-panel-2);
		border-radius: var(--radius-md);
	}

	.entity-logo {
		width: 24px;
		height: 24px;
		border-radius: var(--radius-sm);
	}

	.entity-name {
		font-weight: var(--font-medium);
		color: var(--color-heading-2);
	}

	/* Registration Section */
	.registration-section {
		margin-bottom: var(--space-5);
	}

	.registration-grid {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		padding: var(--space-4);
		background: var(--color-panel-2);
		border-radius: var(--radius-md);
	}

	.registration-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-3);
	}

	.registration-label {
		display: flex;
		align-items: center;
		gap: var(--space-1-5);
		font-size: var(--text-sm);
		color: var(--color-description-2);
	}

	.registration-label :global(.icon-inline) {
		width: 14px;
		height: 14px;
	}

	.registration-value {
		font-size: var(--text-sm);
		color: var(--color-heading-2);
		text-align: right;
	}

	.registration-status {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-sm);
	}

	.status-registered {
		background: rgba(16, 185, 129, 0.15);
		color: #10b981;
	}

	.status-available {
		background: rgba(59, 130, 246, 0.15);
		color: #3b82f6;
	}

	.status-grace-period {
		background: rgba(245, 158, 11, 0.15);
		color: #f59e0b;
	}

	.status-premium {
		background: rgba(139, 92, 246, 0.15);
		color: #8b5cf6;
	}

	.status-unknown {
		background: rgba(107, 114, 128, 0.15);
		color: #6b7280;
	}

	.expiration-info {
		font-size: var(--text-xs);
		color: #10b981;
		margin-left: var(--space-1);
	}

	.expiration-info.expired {
		color: #ef4444;
	}

	/* Address Section */
	.address-section {
		margin-bottom: var(--space-5);
	}

	.address-row {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3);
		background: var(--color-panel-2);
		border-radius: var(--radius-md);
		margin-bottom: var(--space-2);
	}

	.address-full {
		flex: 1;
		font-family: var(--font-mono);
		font-size: var(--text-sm);
		color: var(--color-heading-2);
		word-break: break-all;
	}

	.copy-btn-small {
		padding: var(--space-1-5);
		background: var(--color-panel-3);
		border: none;
		border-radius: var(--radius-sm);
		color: var(--color-description-2);
		cursor: pointer;
		transition: all 0.2s;
	}

	.copy-btn-small:hover {
		background: var(--color-panel-4);
		color: var(--color-heading-1);
	}

	.copy-btn-small :global(.icon) {
		width: 14px;
		height: 14px;
	}

	.address-link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1-5);
		font-size: var(--text-sm);
		color: #3b82f6;
		text-decoration: none;
	}

	.address-link:hover {
		text-decoration: underline;
	}

	.address-link :global(.icon) {
		width: 14px;
		height: 14px;
	}

	.not-resolved {
		padding: var(--space-4);
		background: var(--color-panel-2);
		border-radius: var(--radius-md);
		text-align: center;
		color: var(--color-description-3);
		font-style: italic;
	}

	/* Socials Section */
	.socials-section {
		margin-bottom: var(--space-5);
	}

	.social-links {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.social-link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1-5);
		padding: var(--space-2) var(--space-3);
		background: var(--color-panel-2);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		color: var(--color-description-2);
		text-decoration: none;
		transition: all 0.2s;
	}

	.social-link:hover {
		background: var(--color-panel-3);
		color: var(--color-heading-1);
	}

	.social-link :global(.icon) {
		width: 14px;
		height: 14px;
	}

	/* External Links */
	.external-links {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		padding-top: var(--space-5);
		border-top: 1px solid var(--color-panel-border-1);
	}

	.external-link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-description-2);
		text-decoration: none;
		transition: all 0.2s;
	}

	.external-link:hover {
		background: var(--color-panel-3);
		border-color: var(--color-panel-border-3);
		color: var(--color-heading-1);
	}

	.external-link :global(.icon) {
		width: 14px;
		height: 14px;
	}

	/* FAQ Section */
	.faq-section {
		margin-top: var(--space-10);
	}

	.section-title {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--color-heading-1);
		margin: 0 0 var(--space-4);
	}

	.faq-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.faq-item {
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-lg);
		overflow: hidden;
	}

	.faq-question {
		padding: var(--space-4);
		font-weight: var(--font-medium);
		color: var(--color-heading-2);
		cursor: pointer;
		list-style: none;
	}

	.faq-question::-webkit-details-marker {
		display: none;
	}

	.faq-question::before {
		content: '▶';
		display: inline-block;
		margin-right: var(--space-2);
		font-size: var(--text-xs);
		transition: transform 0.2s;
	}

	.faq-item[open] .faq-question::before {
		transform: rotate(90deg);
	}

	.faq-answer {
		padding: 0 var(--space-4) var(--space-4);
		font-size: var(--text-sm);
		color: var(--color-description-2);
		line-height: 1.6;
		margin: 0;
	}

	/* Data Source Footer */
	.data-source {
		margin-top: var(--space-10);
		padding-top: var(--space-5);
		border-top: 1px solid var(--color-panel-border-1);
		text-align: center;
	}

	.data-source p {
		font-size: var(--text-xs);
		color: var(--color-description-3);
		margin: 0;
	}

	/* Mobile */
	@media (max-width: 768px) {
		.name-detail-page {
			padding: var(--space-4);
		}

		.main-card {
			padding: var(--space-4);
		}

		.card-header {
			flex-direction: column;
			align-items: flex-start;
		}

		.name-info {
			width: 100%;
		}

		.copy-btn {
			align-self: flex-end;
		}

		.address-full {
			font-size: var(--text-xs);
		}
	}
</style>
