<script lang="ts">
	import { Crown, Check, Sparkles, X, Users } from 'lucide-svelte';
	import { getReferralAddress, ZERO_ADDRESS } from '$lib/utils/referral';
	import { useConnectStore } from '$lib/stores/connect.svelte';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
	}

	let { isOpen = $bindable(), onClose }: Props = $props();

	const connectStore = useConnectStore();

	// Current network
	let currentNetwork = $derived.by(() => {
		if (!connectStore.currentChainId) return null;
		return connectStore.networks.find((n) => n.chainId === connectStore.currentChainId);
	});

	// Get current network symbol
	let networkSymbol = $derived(currentNetwork?.symbol || 'COIN');

	let referralAddress = $state<string | null>(null);

	// Load referral address when modal opens
	$effect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
			loadReferralAddress();
		} else {
			document.body.style.overflow = '';
		}

		// Cleanup on unmount
		return () => {
			document.body.style.overflow = '';
		};
	});

	async function loadReferralAddress() {
		const address = await getReferralAddress();
		referralAddress = address;
	}

	// Format address for display
	let displayReferral = $derived(() => {
		if (!referralAddress || referralAddress === ZERO_ADDRESS) {
			return 'Direct visit';
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
			id: 'weekly',
			name: 'Weekly',
			days: 7,
			price: 0.01,
			pricePerDay: 0.00143
		},
		{
			id: 'monthly',
			name: 'Monthly',
			days: 30,
			price: 0.02,
			pricePerDay: 0.00067,
			savings: 'Save 53%',
			popular: true
		},
		{
			id: 'yearly',
			name: 'Yearly',
			days: 365,
			price: 0.05,
			pricePerDay: 0.00014,
			savings: 'Save 90%'
		}
	];

	let selectedTier = $state<string>('monthly');

	const benefits = [
		'Zero transaction fees on all tools',
		'Unlimited access to premium features',
		'Priority customer support'
	];

	function handleSelectTier(tierId: string) {
		selectedTier = tierId;
	}

	function handlePurchase() {
		const tier = pricingTiers.find((t) => t.id === selectedTier);
		// TODO: Integrate payment gateway
		alert(
			`Purchase ${tier?.name} plan for ${tier?.price} COIN!\n\nPayment integration coming soon.`
		);
	}

	function handleClickOutside(event: MouseEvent) {
		if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
			onClose();
		}
	}
</script>

{#if isOpen}
	<div class="modal-overlay" onclick={handleClickOutside} role="presentation">
		<div class="modal-container">
			<!-- Header -->
			<div class="modal-header">
				<div class="header-content">
					<div class="header-icon">
						<Crown size={32} />
					</div>
					<h2>Upgrade to Premium</h2>
					<p>Choose the perfect plan for your needs</p>
				</div>
				<button class="btn-close" onclick={onClose} aria-label="Close modal">
					<X size={24} />
				</button>
			</div>

			<!-- Referral Info -->
			<div class="referral-info">
				<Users size={16} />
				<span class="referral-label">Referred by:</span>
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
								<h3>{tier.name}</h3>
								{#if tier.popular}
									<span class="popular-badge">
										<Sparkles size={12} />
										<span>Popular</span>
									</span>
								{/if}
							</div>
							<div class="tier-days">{tier.days} days</div>
						</div>

						<div class="card-center">
							<div class="price">
								<span class="price-value">{tier.price} {networkSymbol}</span>
							</div>
							<div class="price-detail">{tier.pricePerDay.toFixed(5)} {networkSymbol}/day</div>
						</div>

						<div class="card-right">
							<!-- {#if tier.savings}
								<div class="savings-badge">{tier.savings}</div>
							{/if} -->
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
				<h3>What's Included</h3>
				<div class="benefits-grid">
					{#each benefits as benefit (benefit)}
						<div class="benefit-item">
							<Check size={16} />
							<span>{benefit}</span>
						</div>
					{/each}
				</div>
			</div>

			<!-- CTA -->
			<div class="modal-footer">
				<button class="btn-purchase" onclick={handlePurchase}>
					<Crown size={20} />
					<span>Purchase Premium Access</span>
				</button>
				<p class="footer-note">
					⚠️ Membership valid on <strong>{currentNetwork?.name || 'current network'}</strong> only •
					Switch networks requires new purchase
				</p>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.75);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
		padding: var(--space-4);
		animation: fadeIn 0.2s ease-out;
		overflow-y: auto;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.modal-container {
		position: relative;
		max-width: 640px;
		width: 100%;
		max-height: 90vh;
		overflow-y: auto;
		background: white;
		border-radius: var(--radius-xl);
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
		animation: slideUp 0.3s ease-out;
		margin: auto;
	}

	:global([data-theme='dark']) .modal-container {
		background: var(--gray-900);
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.modal-header {
		position: relative;
		padding: var(--space-5);
		background: linear-gradient(135deg, #ea580c, #f97316);
		color: white;
		border-radius: var(--radius-xl) var(--radius-xl) 0 0;
	}

	.header-content {
		text-align: center;
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

	.header-icon :global(svg) {
		width: 24px;
		height: 24px;
	}

	.modal-header h2 {
		margin: 0 0 var(--space-1) 0;
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
	}

	.modal-header p {
		margin: 0;
		opacity: 0.9;
		font-size: var(--text-sm);
	}

	.btn-close {
		position: absolute;
		top: var(--space-4);
		right: var(--space-4);
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.2);
		border: none;
		border-radius: 50%;
		color: white;
		cursor: pointer;
		transition: all 0.2s;
		backdrop-filter: blur(10px);
	}

	.btn-close:hover {
		background: rgba(255, 255, 255, 0.3);
		transform: scale(1.1);
	}

	.referral-info {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		background: transparent;
		margin: 0 var(--space-4) var(--space-2) var(--space-4);
		font-size: var(--text-xs);
		color: var(--gray-500);
		justify-content: flex-end;
	}

	:global([data-theme='dark']) .referral-info {
		color: var(--gray-500);
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

	:global([data-theme='dark']) .referral-label {
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
		padding: var(--space-4);
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
	}

	:global([data-theme='dark']) .pricing-card {
		background: var(--gray-800);
	}

	.pricing-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
	}

	.pricing-card.selected {
		border-color: #f97316;
		background: linear-gradient(135deg, rgba(249, 115, 22, 0.05), rgba(234, 88, 12, 0.05));
		box-shadow: 0 8px 24px rgba(249, 115, 22, 0.3);
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

	:global([data-theme='dark']) .price-detail {
		color: var(--gray-500);
	}

	.card-right {
		flex: 0 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2);
	}

	.savings-badge {
		padding: 2px var(--space-2);
		background: #10b981;
		color: white;
		font-size: 10px;
		font-weight: var(--font-bold);
		border-radius: var(--radius-sm);
		white-space: nowrap;
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
		padding: 0 var(--space-4) var(--space-4);
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
		background: var(--gray-50);
		border-radius: var(--radius-md);
		font-size: var(--text-xs);
		color: var(--gray-700);
	}

	.benefit-item :global(svg) {
		width: 14px;
		height: 14px;
	}

	:global([data-theme='dark']) .benefit-item {
		background: var(--gray-800);
		color: var(--gray-300);
	}

	.benefit-item :global(svg) {
		flex-shrink: 0;
		color: #10b981;
	}

	.modal-footer {
		padding: var(--space-4);
		background: var(--gray-50);
		border-radius: 0 0 var(--radius-xl) var(--radius-xl);
		text-align: center;
	}

	:global([data-theme='dark']) .modal-footer {
		background: var(--gray-800);
	}

	.btn-purchase {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		background: linear-gradient(135deg, #ea580c, #f97316);
		color: white;
		border: none;
		border-radius: var(--radius-full);
		font-size: var(--text-base);
		font-weight: var(--font-bold);
		cursor: pointer;
		box-shadow: 0 8px 24px rgba(249, 115, 22, 0.4);
		transition: all 0.3s;
	}

	.btn-purchase :global(svg) {
		width: 18px;
		height: 18px;
	}

	.btn-purchase:hover {
		transform: translateY(-2px);
		box-shadow: 0 12px 32px rgba(249, 115, 22, 0.5);
	}

	.btn-purchase:active {
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
</style>
