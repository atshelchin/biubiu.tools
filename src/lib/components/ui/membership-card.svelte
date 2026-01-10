<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import { useI18n } from '@shelchin/i18n';
	import {
		Crown,
		Clock,
		Sparkles,
		ChevronDown,
		ChevronUp,
		Check,
		Loader2,
		AlertCircle
	} from '@lucide/svelte';
	import NetworkIcon from './network-icon.svelte';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const connectStore = useConnectStore();
	const i18n = useI18n();

	// UI State
	let isExpanded = $state(false);
	let selectedPlan = $state<'daily' | 'monthly' | 'yearly'>('monthly');

	// Subscription state
	type SubscribeStatus = 'idle' | 'pending' | 'success' | 'error';
	let subscribeStatus = $state<SubscribeStatus>('idle');
	let subscribeError = $state<string>('');

	// Mock data for membership status
	// TODO: Replace with actual on-chain queries
	type MembershipState = 'none' | 'active' | 'expired';

	// Simulate different states for demo (change this to test different states)
	let mockMembershipState = $state<MembershipState>('none');
	const mockExpiryDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000); // 15 days from now

	// Compute membership status based on mock data
	const membershipStatus: {
		state: MembershipState;
		expiryDate?: Date;
		daysRemaining?: number;
	} = $derived.by(() => {
		if (mockMembershipState === 'active') {
			const daysRemaining = Math.ceil(
				(mockExpiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
			);
			return {
				state: 'active' as const,
				expiryDate: mockExpiryDate,
				daysRemaining
			};
		} else if (mockMembershipState === 'expired') {
			return {
				state: 'expired' as const,
				expiryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
			};
		}
		return { state: 'none' as const };
	});

	// Expose for testing in dev mode
	if (import.meta.env.DEV) {
		// @ts-expect-error - expose for dev testing
		globalThis.__setMembershipState = (state: MembershipState) => {
			mockMembershipState = state;
		};
		// @ts-expect-error - expose for dev testing
		globalThis.__setSubscribeStatus = (status: SubscribeStatus) => {
			subscribeStatus = status;
		};
	}

	// Mock pricing data (will come from on-chain)
	const mockPricing = $derived({
		daily: '0.002',
		monthly: '0.025',
		yearly: '0.15',
		symbol: connectStore.currentChainId === 1 ? 'ETH' : 'ETH'
	});

	// Calculate savings
	const savings = $derived({
		monthly: Math.round((1 - Number(mockPricing.monthly) / (Number(mockPricing.daily) * 30)) * 100),
		yearly: Math.round((1 - Number(mockPricing.yearly) / (Number(mockPricing.daily) * 365)) * 100)
	});

	// Get selected plan price
	const selectedPrice = $derived(mockPricing[selectedPlan]);

	// Get current network
	const currentNetwork = $derived(
		connectStore.currentChainId
			? connectStore.networks.find((n) => n.chainId === connectStore.currentChainId)
			: undefined
	);

	// Format address
	function formatAddress(addr: string): string {
		return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
	}

	// Format date
	function formatDate(date: Date): string {
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	// Handle subscription - mock implementation
	async function handleSubscribe() {
		subscribeStatus = 'pending';
		subscribeError = '';

		// Simulate transaction delay
		await new Promise((resolve) => setTimeout(resolve, 2000));

		// Mock: 80% success rate for demo
		const isSuccess = Math.random() > 0.2;

		if (isSuccess) {
			subscribeStatus = 'success';
			// Update membership state after successful subscription
			mockMembershipState = 'active';
			// Reset after showing success
			setTimeout(() => {
				subscribeStatus = 'idle';
			}, 3000);
		} else {
			subscribeStatus = 'error';
			subscribeError = 'Transaction rejected by user';
			// Reset after showing error
			setTimeout(() => {
				subscribeStatus = 'idle';
				subscribeError = '';
			}, 4000);
		}
	}

	// Handle renewal - same as subscribe
	async function handleRenew() {
		await handleSubscribe();
	}

	// Toggle expansion
	function toggleExpand() {
		isExpanded = !isExpanded;
	}

	// Button text based on status
	const subscribeButtonText = $derived.by(() => {
		switch (subscribeStatus) {
			case 'pending':
				return i18n.t('common.membership.subscribing' as never) || 'Processing...';
			case 'success':
				return i18n.t('common.membership.subscribe_success' as never) || 'Subscribed!';
			case 'error':
				return i18n.t('common.membership.subscribe_failed' as never) || 'Failed';
			default:
				return `${i18n.t('common.membership.subscribe_now')} · ${selectedPrice} ${mockPricing.symbol}`;
		}
	});

	// Renew button text
	const renewButtonText = $derived.by(() => {
		switch (subscribeStatus) {
			case 'pending':
				return i18n.t('common.membership.renewing' as never) || 'Processing...';
			case 'success':
				return i18n.t('common.membership.renew_success' as never) || 'Extended!';
			case 'error':
				return i18n.t('common.membership.renew_failed' as never) || 'Failed';
			default:
				return i18n.t('common.membership.extend_membership');
		}
	});

	// Is button disabled
	const isButtonDisabled = $derived(subscribeStatus === 'pending' || subscribeStatus === 'success');
</script>

{#if connectStore.isConnected && connectStore.address}
	<div class="membership-card {className}" class:expanded={isExpanded}>
		<!-- Collapsed Header -->
		<button class="card-header" onclick={toggleExpand}>
			<div class="header-left">
				{#if membershipStatus.state === 'active'}
					<div class="status-icon active">
						<Crown size={18} />
					</div>
					<div class="header-info">
						<span class="status-text">{i18n.t('common.membership.status.active')}</span>
						<span class="expiry-hint">
							{membershipStatus.daysRemaining}
							{i18n.t('common.membership.days_left')}
						</span>
					</div>
				{:else if membershipStatus.state === 'expired'}
					<div class="status-icon expired">
						<Clock size={18} />
					</div>
					<div class="header-info">
						<span class="status-text expired">{i18n.t('common.membership.status.expired')}</span>
						<span class="action-hint">{i18n.t('common.membership.tap_to_renew')}</span>
					</div>
				{:else}
					<div class="status-icon none">
						<Sparkles size={18} />
					</div>
					<div class="header-info">
						<span class="status-text">{i18n.t('common.membership.become_member')}</span>
						<span class="benefit-hint">{i18n.t('common.membership.unlock_all_tools')}</span>
					</div>
				{/if}
			</div>
			<div class="header-right">
				{#if currentNetwork}
					<NetworkIcon chainId={currentNetwork.chainId} size={20} />
				{/if}
				{#if isExpanded}
					<ChevronUp size={18} class="chevron" />
				{:else}
					<ChevronDown size={18} class="chevron" />
				{/if}
			</div>
		</button>

		<!-- Expanded Content -->
		{#if isExpanded}
			<div class="card-content">
				{#if membershipStatus.state === 'active'}
					<!-- Active Member View -->
					<div class="member-details">
						<div class="detail-row">
							<span class="label">{i18n.t('common.membership.wallet')}</span>
							<span class="value mono">{formatAddress(connectStore.address)}</span>
						</div>
						<div class="detail-row">
							<span class="label">{i18n.t('common.membership.expires')}</span>
							<span class="value">{formatDate(membershipStatus.expiryDate!)}</span>
						</div>
						<div class="detail-row">
							<span class="label">{i18n.t('common.membership.network')}</span>
							<span class="value">{currentNetwork?.name || 'Unknown'}</span>
						</div>
					</div>

					<div class="benefits-compact">
						<div class="benefit-item">
							<Check size={14} />
							<span>{i18n.t('common.membership.benefit.all_tools')}</span>
						</div>
						<div class="benefit-item">
							<Check size={14} />
							<span>{i18n.t('common.membership.benefit.unlimited')}</span>
						</div>
					</div>

					<button
						class="renew-button"
						class:loading={subscribeStatus === 'pending'}
						class:success={subscribeStatus === 'success'}
						class:error={subscribeStatus === 'error'}
						onclick={handleRenew}
						disabled={isButtonDisabled}
					>
						{#if subscribeStatus === 'pending'}
							<Loader2 size={16} class="spinning" />
						{:else if subscribeStatus === 'success'}
							<Check size={16} />
						{:else if subscribeStatus === 'error'}
							<AlertCircle size={16} />
						{/if}
						<span>{renewButtonText}</span>
					</button>
				{:else}
					<!-- Non-Member / Expired View -->
					<div class="plan-selector">
						<button
							class="plan-option"
							class:selected={selectedPlan === 'daily'}
							onclick={() => (selectedPlan = 'daily')}
							disabled={isButtonDisabled}
						>
							<span class="plan-name">{i18n.t('common.membership.plan.daily')}</span>
							<span class="plan-price">{mockPricing.daily} {mockPricing.symbol}</span>
						</button>
						<button
							class="plan-option"
							class:selected={selectedPlan === 'monthly'}
							onclick={() => (selectedPlan = 'monthly')}
							disabled={isButtonDisabled}
						>
							<div class="plan-header">
								<span class="plan-name">{i18n.t('common.membership.plan.monthly')}</span>
								{#if savings.monthly > 0}
									<span class="save-badge">-{savings.monthly}%</span>
								{/if}
							</div>
							<span class="plan-price">{mockPricing.monthly} {mockPricing.symbol}</span>
						</button>
						<button
							class="plan-option best-value"
							class:selected={selectedPlan === 'yearly'}
							onclick={() => (selectedPlan = 'yearly')}
							disabled={isButtonDisabled}
						>
							<div class="plan-header">
								<span class="plan-name">{i18n.t('common.membership.plan.yearly')}</span>
								{#if savings.yearly > 0}
									<span class="save-badge best">-{savings.yearly}%</span>
								{/if}
							</div>
							<span class="plan-price">{mockPricing.yearly} {mockPricing.symbol}</span>
						</button>
					</div>

					<button
						class="subscribe-button"
						class:loading={subscribeStatus === 'pending'}
						class:success={subscribeStatus === 'success'}
						class:error={subscribeStatus === 'error'}
						onclick={handleSubscribe}
						disabled={isButtonDisabled}
					>
						{#if subscribeStatus === 'pending'}
							<Loader2 size={16} class="spinning" />
						{:else if subscribeStatus === 'success'}
							<Check size={16} />
						{:else if subscribeStatus === 'error'}
							<AlertCircle size={16} />
						{:else}
							<Sparkles size={16} />
						{/if}
						<span>{subscribeButtonText}</span>
					</button>

					<!-- Error message -->
					{#if subscribeStatus === 'error' && subscribeError}
						<p class="error-message">{subscribeError}</p>
					{/if}

					<p class="chain-notice">
						{i18n.t('common.membership.chain_notice', {
							chain: currentNetwork?.name || 'this chain'
						})}
					</p>
				{/if}
			</div>
		{/if}
	</div>
{/if}

<style>
	.membership-card {
		background: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		overflow: hidden;
		transition: all 0.2s ease;
	}

	.membership-card:hover {
		border-color: var(--color-primary);
	}

	.membership-card.expanded {
		box-shadow: 0 4px 12px hsla(0, 0%, 0%, 0.08);
	}

	:global([data-theme='dark']) .membership-card.expanded {
		box-shadow: 0 4px 12px hsla(0, 0%, 0%, 0.3);
	}

	/* Header */
	.card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: var(--space-3) var(--space-4);
		background: transparent;
		border: none;
		cursor: pointer;
		transition: background 0.15s ease;
	}

	.card-header:hover {
		background: var(--color-muted);
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.status-icon {
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-md);
		flex-shrink: 0;
	}

	.status-icon.active {
		background: linear-gradient(135deg, hsla(45, 100%, 50%, 0.2), hsla(35, 100%, 50%, 0.2));
		color: hsl(40, 100%, 45%);
	}

	.status-icon.expired {
		background: hsla(0, 80%, 50%, 0.15);
		color: hsl(0, 80%, 50%);
	}

	.status-icon.none {
		background: linear-gradient(
			135deg,
			hsla(var(--brand-hue), 80%, 50%, 0.15),
			hsla(var(--brand-hue), 80%, 60%, 0.15)
		);
		color: var(--color-primary);
	}

	.header-info {
		display: flex;
		flex-direction: column;
		gap: var(--space-0-5);
		text-align: left;
	}

	.status-text {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--color-foreground);
	}

	.status-text.expired {
		color: hsl(0, 80%, 50%);
	}

	.expiry-hint,
	.action-hint,
	.benefit-hint {
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
	}

	.action-hint {
		color: hsl(0, 80%, 50%);
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		color: var(--color-muted-foreground);
	}

	.header-right :global(.chevron) {
		transition: transform 0.2s ease;
	}

	/* Content */
	.card-content {
		padding: var(--space-4);
		padding-top: 0;
		animation: slideDown 0.2s ease;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Member Details */
	.member-details {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		padding: var(--space-3);
		background: var(--color-muted);
		border-radius: var(--radius-md);
		margin-bottom: var(--space-3);
	}

	.detail-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: var(--text-xs);
	}

	.detail-row .label {
		color: var(--color-muted-foreground);
	}

	.detail-row .value {
		color: var(--color-foreground);
		font-weight: var(--font-medium);
	}

	.detail-row .value.mono {
		font-family: var(--font-mono, monospace);
	}

	/* Benefits */
	.benefits-compact {
		display: flex;
		gap: var(--space-3);
		margin-bottom: var(--space-3);
	}

	.benefit-item {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-xs);
		color: hsl(145, 70%, 40%);
	}

	:global([data-theme='dark']) .benefit-item {
		color: hsl(145, 70%, 55%);
	}

	/* Buttons */
	.renew-button,
	.subscribe-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		width: 100%;
		padding: var(--space-2-5) var(--space-4);
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.renew-button {
		background: var(--color-secondary);
		color: var(--color-foreground);
		border: 1px solid var(--color-border);
	}

	.renew-button:hover:not(:disabled) {
		background: var(--color-muted);
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	.renew-button:disabled {
		cursor: not-allowed;
		opacity: 0.8;
	}

	.subscribe-button {
		background: linear-gradient(135deg, var(--brand-500), var(--brand-600));
		color: white;
	}

	.subscribe-button:hover:not(:disabled) {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px var(--color-ring);
	}

	.subscribe-button:disabled {
		cursor: not-allowed;
		opacity: 0.9;
	}

	/* Button states */
	.subscribe-button.loading,
	.renew-button.loading {
		background: var(--color-muted);
		color: var(--color-muted-foreground);
		border-color: var(--color-border);
	}

	.subscribe-button.success,
	.renew-button.success {
		background: hsl(145, 70%, 45%);
		color: white;
		border-color: hsl(145, 70%, 45%);
	}

	.subscribe-button.error,
	.renew-button.error {
		background: hsl(0, 70%, 50%);
		color: white;
		border-color: hsl(0, 70%, 50%);
	}

	/* Spinning animation */
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

	/* Error message */
	.error-message {
		font-size: var(--text-xs);
		color: hsl(0, 70%, 50%);
		text-align: center;
		margin: var(--space-2) 0 0 0;
	}

	/* Plan Selector */
	.plan-selector {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		margin-bottom: var(--space-3);
	}

	.plan-option {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-3);
		background: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.plan-option:hover:not(:disabled) {
		border-color: var(--color-primary);
		background: var(--color-muted);
	}

	.plan-option:disabled {
		cursor: not-allowed;
		opacity: 0.6;
	}

	.plan-option.selected {
		border-color: var(--color-primary);
		background: hsla(var(--brand-hue), 80%, 50%, 0.08);
	}

	.plan-option.best-value {
		position: relative;
	}

	.plan-option.best-value::before {
		content: '';
		position: absolute;
		inset: -1px;
		border-radius: var(--radius-md);
		background: linear-gradient(135deg, var(--brand-400), var(--brand-600));
		z-index: -1;
		opacity: 0;
		transition: opacity 0.15s ease;
	}

	.plan-option.best-value.selected::before {
		opacity: 1;
	}

	.plan-option.best-value.selected {
		border-color: transparent;
	}

	.plan-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.plan-name {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-foreground);
	}

	.plan-price {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--color-foreground);
		font-family: var(--font-mono, monospace);
	}

	.save-badge {
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		padding: 0.125rem 0.375rem;
		background: hsla(145, 70%, 45%, 0.15);
		color: hsl(145, 70%, 40%);
		border-radius: var(--radius-full);
	}

	.save-badge.best {
		background: linear-gradient(135deg, hsla(145, 80%, 45%, 0.2), hsla(120, 80%, 45%, 0.2));
		color: hsl(135, 80%, 35%);
	}

	:global([data-theme='dark']) .save-badge {
		background: hsla(145, 70%, 50%, 0.2);
		color: hsl(145, 70%, 60%);
	}

	:global([data-theme='dark']) .save-badge.best {
		background: linear-gradient(135deg, hsla(145, 80%, 50%, 0.25), hsla(120, 80%, 50%, 0.25));
		color: hsl(135, 80%, 55%);
	}

	/* Chain Notice */
	.chain-notice {
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		text-align: center;
		margin-top: var(--space-2);
		margin-bottom: 0;
	}

	/* Responsive */
	@media (max-width: 480px) {
		.benefits-compact {
			flex-direction: column;
			gap: var(--space-1);
		}
	}
</style>
