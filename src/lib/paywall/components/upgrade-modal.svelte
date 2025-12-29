<script lang="ts">
	import { Crown, Check, Sparkles, Users, Loader2 } from '@lucide/svelte';
	import { useI18n } from '@shelchin/i18n';
	import { getReferralAddress, ZERO_ADDRESS } from '$lib/utils/referral';
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import Modal from '$lib/components/ui/modal.svelte';
	import { type Address, parseEther, encodeFunctionData } from 'viem';
	import BiuBiuPremiumABI from '../../../../static/contracts/BiuBiuPremium.json';
	import { useMembershipStore } from '../stores/membership.svelte';
	import { BIUBIU_PREMIUM_CONTRACT } from '../utils/contract';

	const i18n = useI18n();

	interface Props {
		isOpen: boolean;
		onClose: () => void;
	}

	let { isOpen = $bindable(), onClose }: Props = $props();

	const connectStore = useConnectStore();
	const membershipStore = useMembershipStore();

	// Current network
	let currentNetwork = $derived.by(() => {
		if (!connectStore.currentChainId) return null;
		return connectStore.networks.find((n) => n.chainId === connectStore.currentChainId);
	});

	// Get current network symbol
	let networkSymbol = $derived(currentNetwork?.symbol || 'ETH');

	let referralAddress = $state<string | null>(null);

	// Purchase state
	let isPurchasing = $state(false);
	let purchaseError = $state('');
	let purchaseSuccess = $state(false);
	let purchaseDetails = $state<{
		tier: string;
		hash: string;
	} | null>(null);

	// Load referral address when modal opens
	$effect(() => {
		if (isOpen) {
			loadReferralAddress();
		}
	});

	async function loadReferralAddress() {
		const address = await getReferralAddress();
		referralAddress = address;
	}

	// Format address for display
	let displayReferral = $derived(() => {
		if (!referralAddress || referralAddress === ZERO_ADDRESS) {
			return i18n.t('paywall.modal.referral.direct');
		}
		return `${referralAddress.slice(0, 6)}...${referralAddress.slice(-4)}`;
	});

	interface PricingTier {
		id: string;
		name: string;
		days: number;
		price: number;
		pricePerDay: number;
		savings?: string;
		popular?: boolean;
	}

	const pricingTiers: PricingTier[] = [
		{
			id: 'daily',
			name: 'Daily',
			days: 1,
			price: 0.01,
			pricePerDay: 0.01
		},
		{
			id: 'monthly',
			name: 'Monthly',
			days: 30,
			price: 0.05,
			pricePerDay: 0.00167,
			savings: 'Save 83%',
			popular: true
		},
		{
			id: 'yearly',
			name: 'Yearly',
			days: 365,
			price: 0.1,
			pricePerDay: 0.00027,
			savings: 'Save 97%'
		}
	];

	let selectedTier = $state<string>('monthly');

	const benefitKeys = [
		'paywall.modal.benefits.zero_fees',
		'paywall.modal.benefits.unlimited_access',
		'paywall.modal.benefits.priority_support'
	] as const;

	// Map tier ids to translation keys
	const planTranslationKeys = {
		daily: 'paywall.modal.plans.daily',
		monthly: 'paywall.modal.plans.monthly',
		yearly: 'paywall.modal.plans.yearly'
	} as const;

	function getPlanName(tierId: string): string {
		const key = planTranslationKeys[tierId as keyof typeof planTranslationKeys];
		return key ? i18n.t(key) : tierId;
	}

	function handleSelectTier(tierId: string) {
		selectedTier = tierId;
	}

	async function handlePurchase() {
		if (!connectStore.address) {
			purchaseError = i18n.t('paywall.modal.error.connect_wallet');
			return;
		}

		const tier = pricingTiers.find((t) => t.id === selectedTier);
		if (!tier) {
			purchaseError = i18n.t('paywall.modal.error.invalid_tier');
			return;
		}

		isPurchasing = true;
		purchaseError = '';

		try {
			// Map tier ID to contract enum (0=Daily, 1=Monthly, 2=Yearly)
			let tierEnum: number;
			switch (tier.id) {
				case 'daily':
					tierEnum = 0;
					break;
				case 'monthly':
					tierEnum = 1;
					break;
				case 'yearly':
					tierEnum = 2;
					break;
				default:
					throw new Error('Invalid tier');
			}

			// Get referrer address (use zero address if none)
			const referrer = (referralAddress || ZERO_ADDRESS) as Address;

			// Calculate price in wei
			const priceInWei = parseEther(tier.price.toString());

			// Encode function data
			const data = encodeFunctionData({
				abi: BiuBiuPremiumABI.abi,
				functionName: 'subscribe',
				args: [tierEnum, referrer]
			});

			// Call subscribe function
			const hash = await connectStore.sendTransaction({
				to: BIUBIU_PREMIUM_CONTRACT,
				value: priceInWei,
				data,
				gas: BigInt(200000) // Estimated gas for subscribe
			});

			// Wait for transaction confirmation
			const receipt = await connectStore.publicClient!.waitForTransactionReceipt({ hash });

			if (receipt.status === 'success') {
				// Refresh membership status
				await membershipStore.refresh();

				// Show success message
				purchaseSuccess = true;
				purchaseDetails = {
					tier: tier.id,
					hash
				};

				// Auto-close modal after 5 seconds
				setTimeout(() => {
					onClose();
				}, 5000);
			} else {
				throw new Error(i18n.t('paywall.modal.error.tx_failed'));
			}
		} catch (error) {
			console.error('Failed to purchase subscription:', error);
			purchaseError =
				error instanceof Error ? error.message : i18n.t('paywall.modal.error.purchase_failed');
		} finally {
			isPurchasing = false;
		}
	}
</script>

<Modal open={isOpen} {onClose} maxWidth="640px">
	<div class="upgrade-modal">
		<!-- Purchase Success Message -->
		{#if purchaseSuccess && purchaseDetails}
			<div class="purchase-success">
				<div class="success-icon">
					<Check size={32} />
				</div>
				<h3>{i18n.t('paywall.modal.success.title')}</h3>
				<p class="success-message">
					{i18n.t('paywall.modal.success.message', {
						tier: getPlanName(purchaseDetails.tier)
					})}
				</p>
				<div class="transaction-info">
					<span class="tx-label">{i18n.t('paywall.modal.success.tx_label')}</span>
					<code class="tx-hash"
						>{purchaseDetails.hash.slice(0, 10)}...{purchaseDetails.hash.slice(-8)}</code
					>
				</div>
				<p class="success-note">{i18n.t('paywall.modal.success.auto_close')}</p>
			</div>
		{:else}
			<!-- Header with gradient background -->
			<div class="modal-header-custom">
				<div class="header-icon">
					<Crown size={32} />
				</div>
				<h2>{i18n.t('paywall.modal.title')}</h2>
				<p>{i18n.t('paywall.modal.subtitle')}</p>
			</div>

			<!-- Current Subscription Status -->
			{#if membershipStore.isLoading}
				<div class="subscription-status loading">
					<Loader2 size={16} class="spinning" />
					<span>{i18n.t('paywall.modal.status.loading')}</span>
				</div>
			{:else if membershipStore.isMember}
				<div class="subscription-status active">
					<Crown size={16} />
					<span>{i18n.t('paywall.modal.status.active')}</span>
					<span class="remaining-time"
						>{i18n.t('paywall.modal.status.expires_in', {
							days: membershipStore.remainingDays
						})}</span
					>
				</div>
			{/if}

			<!-- Referral Info -->
			<div class="referral-info">
				<Users size={14} />
				<span class="referral-label">{i18n.t('paywall.modal.referral.label')}</span>
				<span class="referral-address">{displayReferral()}</span>
			</div>

			<!-- Pricing Cards -->
			<div class="pricing-cards">
				{#each pricingTiers as tier (tier.id)}
					<button
						class="pricing-card"
						class:selected={selectedTier === tier.id}
						class:popular={tier.popular}
						onclick={() => handleSelectTier(tier.id)}
					>
						<div class="card-left">
							<div class="tier-name">
								<h3>{getPlanName(tier.id)}</h3>
								{#if tier.popular}
									<span class="popular-badge">
										<Sparkles size={12} />
										<span>{i18n.t('paywall.modal.plans.popular')}</span>
									</span>
								{/if}
							</div>
							<div class="tier-days">{i18n.t('paywall.modal.plans.days', { days: tier.days })}</div>
						</div>

						<div class="card-center">
							<div class="price">
								<span class="price-value">{tier.price} {networkSymbol}</span>
							</div>
							<div class="price-detail">
								{i18n.t('paywall.modal.plans.per_day', {
									price: tier.pricePerDay.toFixed(5),
									symbol: networkSymbol
								})}
							</div>
						</div>

						<div class="card-right">
							<div class="checkmark">
								{#if selectedTier === tier.id}
									<Check size={18} />
								{/if}
							</div>
						</div>
					</button>
				{/each}
			</div>

			<!-- Benefits -->
			<div class="benefits-section">
				<h3>{i18n.t('paywall.modal.benefits.title')}</h3>
				<div class="benefits-grid">
					{#each benefitKeys as benefitKey (benefitKey)}
						<div class="benefit-item">
							<Check size={16} />
							<span>{i18n.t(benefitKey)}</span>
						</div>
					{/each}
				</div>
			</div>

			<!-- Purchase Error -->
			{#if purchaseError}
				<div class="purchase-error">
					<span>{purchaseError}</span>
				</div>
			{/if}

			<!-- CTA -->
			<div class="modal-footer-custom">
				<button class="btn-purchase" onclick={handlePurchase} disabled={isPurchasing}>
					{#if isPurchasing}
						<Loader2 size={20} class="spinning" />
						<span>{i18n.t('paywall.modal.processing')}</span>
					{:else}
						<Crown size={20} />
						<span>{i18n.t('paywall.modal.cta')}</span>
					{/if}
				</button>
				<p class="footer-note">
					{i18n.t('paywall.modal.footer_note', {
						network: currentNetwork?.name || 'current network'
					})}
				</p>
			</div>
		{/if}
	</div>
</Modal>

<style>
	.upgrade-modal {
		width: 100%;
	}

	.modal-header-custom {
		position: relative;
		padding: var(--space-5);
		background: linear-gradient(135deg, #ea580c, #f97316);
		color: white;
		border-radius: var(--radius-lg);
		text-align: center;
		margin-bottom: var(--space-4);
	}

	.header-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 50%;
		margin-bottom: var(--space-2);
		backdrop-filter: blur(10px);
	}

	.modal-header-custom h2 {
		margin: 0 0 var(--space-1) 0;
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
	}

	.modal-header-custom p {
		margin: 0;
		opacity: 0.9;
		font-size: var(--text-sm);
	}

	.referral-info {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) 0;
		margin-bottom: var(--space-2);
		font-size: var(--text-xs);
		color: var(--gray-500);
		justify-content: flex-end;
	}

	.referral-info :global(svg) {
		color: #f97316;
		flex-shrink: 0;
		width: 14px;
		height: 14px;
	}

	.referral-label {
		font-weight: var(--font-normal);
		color: var(--gray-500);
	}

	.referral-address {
		font-family: monospace;
		font-weight: var(--font-normal);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .referral-address {
		color: var(--gray-400);
	}

	.pricing-cards {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		margin-bottom: var(--space-4);
	}

	.pricing-card {
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-3) var(--space-4);
		background: var(--gray-50);
		border: 2px solid transparent;
		border-radius: var(--radius-lg);
		cursor: pointer;
		transition: all 0.3s;
		text-align: left;
		width: 100%;
	}

	:global([data-theme='dark']) .pricing-card {
		background: var(--gray-800);
	}

	.pricing-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.pricing-card.selected {
		border-color: #f97316;
		background: linear-gradient(135deg, rgba(249, 115, 22, 0.05), rgba(234, 88, 12, 0.05));
		box-shadow: 0 4px 16px rgba(249, 115, 22, 0.2);
	}

	:global([data-theme='dark']) .pricing-card.selected {
		background: linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(234, 88, 12, 0.15));
	}

	.pricing-card.popular {
		border-color: #f59e0b;
	}

	.pricing-card.popular.selected {
		border-color: #f97316;
	}

	.card-left {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.tier-name {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.tier-name h3 {
		margin: 0;
		font-size: var(--text-base);
		font-weight: var(--font-bold);
		color: var(--gray-800);
	}

	:global([data-theme='dark']) .tier-name h3 {
		color: var(--gray-100);
	}

	.popular-badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		padding: 2px var(--space-2);
		background: linear-gradient(135deg, #f59e0b, #d97706);
		color: white;
		font-size: 10px;
		font-weight: var(--font-bold);
		border-radius: var(--radius-full);
		white-space: nowrap;
	}

	.tier-days {
		font-size: var(--text-xs);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .tier-days {
		color: var(--gray-400);
	}

	.card-center {
		flex: 0 0 auto;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 2px;
	}

	.price-value {
		font-size: var(--text-xl);
		font-weight: var(--font-bold);
		color: #f97316;
		line-height: 1;
		white-space: nowrap;
	}

	.price-detail {
		font-size: 10px;
		color: var(--gray-500);
		white-space: nowrap;
	}

	.card-right {
		flex: 0 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2);
	}

	.checkmark {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border: 2px solid var(--gray-300);
		border-radius: 50%;
		color: transparent;
		transition: all 0.2s;
		flex-shrink: 0;
	}

	.checkmark :global(svg) {
		width: 16px;
		height: 16px;
	}

	:global([data-theme='dark']) .checkmark {
		border-color: var(--gray-700);
	}

	.pricing-card.selected .checkmark {
		border-color: #f97316;
		background: #f97316;
		color: white;
	}

	.benefits-section {
		padding: var(--space-4);
		background: var(--gray-50);
		border-radius: var(--radius-lg);
		margin-bottom: var(--space-4);
	}

	:global([data-theme='dark']) .benefits-section {
		background: var(--gray-800);
	}

	.benefits-section h3 {
		margin: 0 0 var(--space-3) 0;
		font-size: var(--text-base);
		font-weight: var(--font-bold);
		color: var(--gray-800);
		text-align: center;
	}

	:global([data-theme='dark']) .benefits-section h3 {
		color: var(--gray-100);
	}

	.benefits-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-2);
	}

	.benefit-item {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2);
		background: white;
		border-radius: var(--radius-md);
		font-size: var(--text-xs);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .benefit-item {
		background: var(--gray-900);
		color: var(--gray-300);
	}

	.benefit-item :global(svg) {
		width: 14px;
		height: 14px;
		color: #10b981;
		flex-shrink: 0;
	}

	.subscription-status {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3);
		margin-bottom: var(--space-3);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
	}

	.subscription-status.loading {
		background: var(--gray-100);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .subscription-status.loading {
		background: var(--gray-800);
		color: var(--gray-400);
	}

	.subscription-status.active {
		background: linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(234, 88, 12, 0.1));
		color: #f97316;
		border: 1px solid #f97316;
	}

	:global([data-theme='dark']) .subscription-status.active {
		background: linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(234, 88, 12, 0.2));
	}

	.subscription-status :global(svg) {
		flex-shrink: 0;
	}

	.remaining-time {
		margin-left: auto;
		font-size: var(--text-xs);
		opacity: 0.8;
	}

	.purchase-error {
		padding: var(--space-3);
		margin-bottom: var(--space-3);
		background: hsla(0, 80%, 95%, 1);
		border: 1px solid #dc2626;
		border-radius: var(--radius-md);
		color: #dc2626;
		font-size: var(--text-sm);
	}

	:global([data-theme='dark']) .purchase-error {
		background: hsla(0, 80%, 15%, 0.3);
		border-color: #ef4444;
		color: #ef4444;
	}

	.modal-footer-custom {
		text-align: center;
	}

	.btn-purchase {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-6);
		background: linear-gradient(135deg, #ea580c, #f97316);
		color: white;
		border: none;
		border-radius: var(--radius-full);
		font-size: var(--text-base);
		font-weight: var(--font-bold);
		cursor: pointer;
		box-shadow: 0 4px 16px rgba(249, 115, 22, 0.4);
		transition: all 0.3s;
		width: 100%;
	}

	.btn-purchase:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn-purchase :global(svg) {
		width: 18px;
		height: 18px;
	}

	.btn-purchase:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(249, 115, 22, 0.5);
	}

	.btn-purchase:active:not(:disabled) {
		transform: translateY(0);
	}

	.footer-note {
		margin: var(--space-2) 0 0 0;
		font-size: var(--text-xs);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .footer-note {
		color: var(--gray-400);
	}

	/* Spinning animation for loader */
	:global(.spinning) {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	/* Purchase Success Styles */
	.purchase-success {
		text-align: center;
		padding: var(--space-6);
		animation: slideIn 0.3s ease-out;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(-20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.success-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 64px;
		height: 64px;
		background: linear-gradient(135deg, #10b981, #059669);
		border-radius: 50%;
		margin-bottom: var(--space-4);
		color: white;
		box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
	}

	.purchase-success h3 {
		margin: 0 0 var(--space-2) 0;
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .purchase-success h3 {
		color: var(--gray-100);
	}

	.success-message {
		font-size: var(--text-base);
		color: var(--gray-700);
		margin: 0 0 var(--space-4) 0;
	}

	:global([data-theme='dark']) .success-message {
		color: var(--gray-300);
	}

	.success-message strong {
		color: #f97316;
		font-weight: var(--font-bold);
	}

	.transaction-info {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		padding: var(--space-3);
		background: var(--gray-50);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		margin-bottom: var(--space-3);
	}

	:global([data-theme='dark']) .transaction-info {
		background: var(--gray-800);
	}

	.tx-label {
		font-size: var(--text-sm);
		color: var(--gray-600);
		font-weight: var(--font-semibold);
	}

	:global([data-theme='dark']) .tx-label {
		color: var(--gray-400);
	}

	.tx-hash {
		font-family: 'Courier New', monospace;
		font-size: var(--text-sm);
		color: #10b981;
		background: rgba(16, 185, 129, 0.1);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-sm);
	}

	.success-note {
		font-size: var(--text-xs);
		color: var(--gray-500);
		margin: 0;
		font-style: italic;
	}
</style>
