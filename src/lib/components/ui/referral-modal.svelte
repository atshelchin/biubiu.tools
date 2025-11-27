<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import { Link, ExternalLink } from '@lucide/svelte';
	import Modal from './modal.svelte';
	import GradientButton from './gradient-button.svelte';
	import CopyButton from './copy-button.svelte';
	import { generateTrackingUrl, createShortLink } from '$lib/utils/shortlink';

	const i18n = useI18n();

	interface Props {
		open: boolean;
		onClose: () => void;
		walletAddress: string | null;
		isConnected: boolean;
		onConnectWallet: () => void;
	}

	let { open, onClose, walletAddress, isConnected, onConnectWallet }: Props = $props();

	// State for short link
	let shortUrl = $state<string | null>(null);
	let isGeneratingShortLink = $state(false);
	let showFullUrl = $state(false);
	let shortLinkFailed = $state(false); // Track if short link generation failed

	// Generate full tracking URL with UTM parameters
	const fullTrackingUrl = $derived(
		walletAddress && typeof window !== 'undefined' ? generateTrackingUrl(walletAddress) : ''
	);

	// Display URL - either short or full
	const displayUrl = $derived(shortUrl && !showFullUrl ? shortUrl : fullTrackingUrl);

	// Generate short link when wallet connects (only if not previously failed)
	$effect(() => {
		if (
			walletAddress &&
			fullTrackingUrl &&
			!shortUrl &&
			!isGeneratingShortLink &&
			!shortLinkFailed
		) {
			generateShortUrl();
		}
	});

	async function generateShortUrl() {
		if (!fullTrackingUrl || isGeneratingShortLink || shortLinkFailed) return;

		isGeneratingShortLink = true;
		try {
			const result = await createShortLink(fullTrackingUrl);
			if (result.success && result.shortUrl) {
				shortUrl = result.shortUrl;
				shortLinkFailed = false;
			} else {
				console.warn('Short link service unavailable, using full URL:', result.error);
				// Mark as failed to prevent further retries
				shortLinkFailed = true;
				shortUrl = null;
			}
		} catch (error) {
			console.warn('Short link generation failed, using full URL:', error);
			// Mark as failed to prevent further retries
			shortLinkFailed = true;
			shortUrl = null;
		} finally {
			isGeneratingShortLink = false;
		}
	}

	function toggleUrlDisplay() {
		showFullUrl = !showFullUrl;
	}

	function handleConnect() {
		onConnectWallet();
	}

	// Reset state when modal closes or wallet disconnects
	$effect(() => {
		if (!open || !walletAddress) {
			shortUrl = null;
			showFullUrl = false;
			shortLinkFailed = false; // Reset failed state for next attempt
		}
	});
</script>

<Modal {open} {onClose} title={i18n.t('referral.title')} maxWidth="600px">
	<div class="referral-content">
		{#if !isConnected}
			<!-- Not connected state -->
			<div class="connect-prompt">
				<div class="icon-wrapper">
					<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path
							d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
						/>
					</svg>
				</div>
				<h3>{i18n.t('referral.connect_first')}</h3>
				<p>{i18n.t('referral.connect_description')}</p>
				<GradientButton onclick={handleConnect}>
					{i18n.t('wallet.connect')}
				</GradientButton>
			</div>
		{:else}
			<!-- Connected state - show referral info -->
			<div class="referral-info">
				<div class="reward-badge">
					<div class="badge-icon">🎁</div>
					<div class="badge-text">
						<span class="percentage">50%</span>
						<span class="label">{i18n.t('referral.commission')}</span>
					</div>
				</div>

				<div class="benefits">
					<h3>{i18n.t('referral.how_it_works')}</h3>
					<ul class="benefit-list">
						<li>
							<span class="bullet">✓</span>
							<span>{i18n.t('referral.benefit_1')}</span>
						</li>
						<li>
							<span class="bullet">✓</span>
							<span>{i18n.t('referral.benefit_2')}</span>
						</li>
						<li>
							<span class="bullet">✓</span>
							<span>{i18n.t('referral.benefit_3')}</span>
						</li>
					</ul>
				</div>

				<div class="share-section">
					<div class="section-header">
						<div class="section-label">{i18n.t('referral.your_link')}</div>
						<button class="toggle-btn" onclick={toggleUrlDisplay} type="button">
							{#if showFullUrl}
								<Link size={16} />
								<span>{i18n.t('referral.show_short')}</span>
							{:else}
								<ExternalLink size={16} />
								<span>{i18n.t('referral.show_full')}</span>
							{/if}
						</button>
					</div>

					<div class="url-display-group">
						<div class="url-container">
							{#if isGeneratingShortLink}
								<div class="loading-state">
									<div class="spinner"></div>
									<span>{i18n.t('referral.generating_link')}</span>
								</div>
							{:else}
								<div class="url-text">
									<span class="short-url">{displayUrl}</span>
								</div>
							{/if}
							<CopyButton value={displayUrl} />
						</div>
					</div>

					{#if shortUrl && !showFullUrl}
						<div class="url-hint">
							<svg
								class="hint-icon"
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<circle cx="12" cy="12" r="10"></circle>
								<line x1="12" y1="16" x2="12" y2="12"></line>
								<line x1="12" y1="8" x2="12.01" y2="8"></line>
							</svg>
							<span>{i18n.t('referral.short_link_hint')}</span>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</Modal>

<style>
	.referral-content {
		padding: var(--space-2);
	}

	/* Connect prompt styles */
	.connect-prompt {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-6);
		text-align: center;
	}

	.icon-wrapper {
		width: 80px;
		height: 80px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, rgba(96, 165, 250, 0.1), rgba(59, 130, 246, 0.15));
		border-radius: 50%;
		border: 2px solid rgba(59, 130, 246, 0.2);
	}

	@media (min-width: 768px) {
		.icon-wrapper {
			width: 100px;
			height: 100px;
		}
	}

	:global([data-theme='dark']) .icon-wrapper {
		background: linear-gradient(135deg, rgba(96, 165, 250, 0.15), rgba(59, 130, 246, 0.2));
		border-color: rgba(96, 165, 250, 0.3);
	}

	.icon {
		width: 40px;
		height: 40px;
		color: #3b82f6;
	}

	@media (min-width: 768px) {
		.icon {
			width: 50px;
			height: 50px;
		}
	}

	:global([data-theme='dark']) .icon {
		color: #60a5fa;
	}

	.connect-prompt h3 {
		font-size: var(--text-xl);
		font-weight: var(--font-bold);
		color: var(--gray-900);
		margin: 0;
	}

	:global([data-theme='dark']) .connect-prompt h3 {
		color: var(--gray-100);
	}

	.connect-prompt p {
		font-size: var(--text-base);
		color: var(--gray-600);
		margin: 0;
		max-width: 400px;
	}

	:global([data-theme='dark']) .connect-prompt p {
		color: var(--gray-400);
	}

	/* Referral info styles */
	.referral-info {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}

	.reward-badge {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-4);
		background: linear-gradient(135deg, #fef3c7, #fde68a);
		border-radius: var(--radius-lg);
		border: 2px solid #fbbf24;
	}

	:global([data-theme='dark']) .reward-badge {
		background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.25));
		border-color: #f59e0b;
	}

	.badge-icon {
		font-size: 48px;
		line-height: 1;
	}

	@media (min-width: 768px) {
		.badge-icon {
			font-size: 64px;
		}
	}

	.badge-text {
		display: flex;
		flex-direction: column;
	}

	.percentage {
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		color: #d97706;
		line-height: 1;
	}

	@media (min-width: 768px) {
		.percentage {
			font-size: 2.5rem;
		}
	}

	:global([data-theme='dark']) .percentage {
		color: #fbbf24;
	}

	.label {
		font-size: var(--text-sm);
		color: #92400e;
		font-weight: var(--font-medium);
	}

	:global([data-theme='dark']) .label {
		color: #fde68a;
	}

	.benefits h3 {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
		margin: 0 0 var(--space-3) 0;
	}

	:global([data-theme='dark']) .benefits h3 {
		color: var(--gray-100);
	}

	.benefit-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.benefit-list li {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-base);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .benefit-list li {
		color: var(--gray-300);
	}

	.bullet {
		flex-shrink: 0;
		width: 20px;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #10b981;
		color: white;
		border-radius: 50%;
		font-size: var(--text-xs);
		font-weight: var(--font-bold);
	}

	.share-section {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-2);
	}

	.share-section .section-label {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .share-section .section-label {
		color: var(--gray-300);
	}

	.toggle-btn {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-1) var(--space-2);
		font-size: var(--text-xs);
		color: #3b82f6;
		background: rgba(59, 130, 246, 0.08);
		border: 1px solid rgba(59, 130, 246, 0.2);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.toggle-btn:hover {
		background: rgba(59, 130, 246, 0.12);
		border-color: rgba(59, 130, 246, 0.3);
	}

	:global([data-theme='dark']) .toggle-btn {
		color: #60a5fa;
		background: rgba(96, 165, 250, 0.1);
		border-color: rgba(96, 165, 250, 0.25);
	}

	:global([data-theme='dark']) .toggle-btn:hover {
		background: rgba(96, 165, 250, 0.15);
		border-color: rgba(96, 165, 250, 0.35);
	}

	.url-display-group {
		display: flex;
		gap: var(--space-2);
		align-items: flex-start;
	}

	.url-container {
		flex: 1;
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3);
		border: 1px solid var(--gray-300);
		border-radius: var(--radius-md);
		background: var(--gray-50);
		min-height: 48px;
	}

	:global([data-theme='dark']) .url-container {
		background: var(--gray-800);
		border-color: var(--gray-600);
	}

	.loading-state {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		color: var(--gray-600);
		font-size: var(--text-sm);
	}

	:global([data-theme='dark']) .loading-state {
		color: var(--gray-400);
	}

	.spinner {
		width: 16px;
		height: 16px;
		border: 2px solid rgba(59, 130, 246, 0.2);
		border-top-color: #3b82f6;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	:global([data-theme='dark']) .spinner {
		border-color: rgba(96, 165, 250, 0.2);
		border-top-color: #60a5fa;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.url-text {
		flex: 1;
		font-family: monospace;
		font-size: var(--text-sm);
		color: var(--gray-900);
		line-height: 1.6;
		user-select: all;
		word-break: break-all;
	}

	:global([data-theme='dark']) .url-text {
		color: var(--gray-100);
	}

	.url-base {
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .url-base {
		color: var(--gray-400);
	}

	.url-params {
		color: var(--gray-500);
		font-size: var(--text-xs);
	}

	:global([data-theme='dark']) .url-params {
		color: var(--gray-500);
	}

	.short-url {
		color: #3b82f6;
		font-weight: var(--font-medium);
	}

	:global([data-theme='dark']) .short-url {
		color: #60a5fa;
	}

	.url-text .highlight {
		color: #3b82f6;
		font-weight: var(--font-medium);
		background: rgba(59, 130, 246, 0.08);
		padding: 0 2px;
		border-radius: 2px;
	}

	:global([data-theme='dark']) .url-text .highlight {
		color: #60a5fa;
		background: rgba(96, 165, 250, 0.12);
	}

	.url-hint {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-2);
		font-size: var(--text-xs);
		color: var(--gray-600);
		background: rgba(59, 130, 246, 0.05);
		border-radius: var(--radius-md);
		border: 1px solid rgba(59, 130, 246, 0.1);
	}

	:global([data-theme='dark']) .url-hint {
		color: var(--gray-400);
		background: rgba(96, 165, 250, 0.08);
		border-color: rgba(96, 165, 250, 0.15);
	}

	.hint-icon {
		flex-shrink: 0;
		color: #3b82f6;
	}

	:global([data-theme='dark']) .hint-icon {
		color: #60a5fa;
	}

	/* Responsive */
	@media (min-width: 768px) {
		.referral-content {
			padding: var(--space-4);
		}

		.connect-prompt {
			padding: var(--space-8);
		}

		.connect-prompt h3 {
			font-size: var(--text-2xl);
		}

		.connect-prompt p {
			font-size: var(--text-lg);
		}

		.benefits h3 {
			font-size: var(--text-xl);
		}

		.benefit-list li {
			font-size: var(--text-lg);
		}
	}

	@media (max-width: 640px) {
		.reward-badge {
			flex-direction: column;
			text-align: center;
		}

		.url-display-group {
			flex-direction: column;
		}
	}
</style>
