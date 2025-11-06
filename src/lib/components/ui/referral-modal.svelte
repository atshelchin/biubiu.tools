<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import Modal from './modal.svelte';
	import GradientButton from './gradient-button.svelte';
	import CopyButton from './copy-button.svelte';
	import { generateReferralUrl } from '$lib/utils/referral';

	const i18n = useI18n();

	interface Props {
		open: boolean;
		onClose: () => void;
		walletAddress: string | null;
		isConnected: boolean;
		onConnectWallet: () => void;
	}

	let { open, onClose, walletAddress, isConnected, onConnectWallet }: Props = $props();

	const referralUrl = $derived(
		walletAddress
			? generateReferralUrl(walletAddress)
			: typeof window !== 'undefined'
				? window.location.href
				: ''
	);

	function handleConnect() {
		onConnectWallet();
	}
</script>

<Modal {open} {onClose} title={i18n.t('referral.title')}>
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
					<div class="section-label">{i18n.t('referral.your_link')}</div>
					<div class="url-display-group">
						<div class="url-text">
							{#if walletAddress}
								{@const parts = referralUrl.split(walletAddress)}
								{parts[0]}<span class="highlight">{walletAddress}</span>{parts[1] || ''}
							{:else}
								{referralUrl}
							{/if}
						</div>
						<CopyButton value={referralUrl} />
					</div>
				</div>

				<div class="note">
					<svg class="note-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<circle cx="12" cy="12" r="10" />
						<line x1="12" y1="16" x2="12" y2="12" />
						<line x1="12" y1="8" x2="12.01" y2="8" />
					</svg>
					<p>{i18n.t('referral.note')}</p>
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

	:global([data-theme='dark']) .icon-wrapper {
		background: linear-gradient(135deg, rgba(96, 165, 250, 0.15), rgba(59, 130, 246, 0.2));
		border-color: rgba(96, 165, 250, 0.3);
	}

	.icon {
		width: 40px;
		height: 40px;
		color: #3b82f6;
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
		align-items: flex-start;
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
		gap: var(--space-2);
	}

	.share-section .section-label {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--gray-700);
		margin-bottom: var(--space-2);
	}

	:global([data-theme='dark']) .share-section .section-label {
		color: var(--gray-300);
	}

	.url-display-group {
		display: flex;
		gap: var(--space-2);
		align-items: flex-start;
	}

	.url-text {
		flex: 1;
		padding: var(--space-3);
		border: 1px solid var(--gray-300);
		border-radius: var(--radius-md);
		font-family: monospace;
		font-size: var(--text-sm);
		color: var(--gray-900);
		background: var(--gray-50);
		word-break: break-all;
		line-height: 1.6;
		user-select: all;
	}

	:global([data-theme='dark']) .url-text {
		background: var(--gray-800);
		border-color: var(--gray-600);
		color: var(--gray-100);
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

	.note {
		display: flex;
		gap: var(--space-3);
		padding: var(--space-3);
		background: var(--gray-50);
		border-radius: var(--radius-md);
		border: 1px solid var(--gray-200);
	}

	:global([data-theme='dark']) .note {
		background: var(--gray-800);
		border-color: var(--gray-700);
	}

	.note-icon {
		flex-shrink: 0;
		width: 20px;
		height: 20px;
		color: #3b82f6;
		stroke-width: 2;
	}

	.note p {
		font-size: var(--text-sm);
		color: var(--gray-600);
		margin: 0;
		line-height: 1.5;
	}

	:global([data-theme='dark']) .note p {
		color: var(--gray-400);
	}

	/* Responsive */
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
