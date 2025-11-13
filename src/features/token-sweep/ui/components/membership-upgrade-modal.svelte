<script lang="ts">
	import { Crown, Check, Sparkles, X } from 'lucide-svelte';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
	}

	let { isOpen = $bindable(), onClose }: Props = $props();

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
		'Priority customer support',
		'Early access to new tools',
		'Advanced analytics & reporting',
		'API access for automation'
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

			<!-- Pricing Cards -->
			<div class="pricing-cards">
				{#each pricingTiers as tier (tier.id)}
					<button
						class="pricing-card"
						class:selected={selectedTier === tier.id}
						class:popular={tier.popular}
						onclick={() => handleSelectTier(tier.id)}
					>
						{#if tier.popular}
							<div class="popular-badge">
								<Sparkles size={14} />
								<span>Most Popular</span>
							</div>
						{/if}

						{#if tier.savings}
							<div class="savings-badge">{tier.savings}</div>
						{/if}

						<h3>{tier.name}</h3>
						<div class="price">
							<span class="price-value">{tier.price} COIN</span>
							<span class="price-period">/{tier.days} days</span>
						</div>
						<div class="price-detail">
							{tier.pricePerDay.toFixed(5)} COIN per day
						</div>

						<div class="checkmark">
							{#if selectedTier === tier.id}
								<Check size={20} />
							{/if}
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
				<p class="footer-note">💳 Secure payment • Cancel anytime • 30-day money-back guarantee</p>
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
		background: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: var(--space-4);
		animation: fadeIn 0.2s ease-out;
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
		max-width: 900px;
		width: 100%;
		max-height: 90vh;
		overflow-y: auto;
		background: white;
		border-radius: var(--radius-xl);
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
		animation: slideUp 0.3s ease-out;
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
		padding: var(--space-6);
		background: linear-gradient(135deg, #7c3aed, #a855f7);
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
		width: 64px;
		height: 64px;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 50%;
		margin-bottom: var(--space-3);
		backdrop-filter: blur(10px);
	}

	.modal-header h2 {
		margin: 0 0 var(--space-2) 0;
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
	}

	.modal-header p {
		margin: 0;
		opacity: 0.9;
		font-size: var(--text-base);
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

	.pricing-cards {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-4);
		padding: var(--space-6);
	}

	@media (max-width: 768px) {
		.pricing-cards {
			grid-template-columns: 1fr;
		}
	}

	.pricing-card {
		position: relative;
		padding: var(--space-5);
		background: var(--gray-50);
		border: 3px solid transparent;
		border-radius: var(--radius-lg);
		cursor: pointer;
		transition: all 0.3s;
		text-align: center;
	}

	:global([data-theme='dark']) .pricing-card {
		background: var(--gray-800);
	}

	.pricing-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
	}

	.pricing-card.selected {
		border-color: #7c3aed;
		background: linear-gradient(135deg, rgba(124, 58, 237, 0.05), rgba(168, 85, 247, 0.05));
		box-shadow: 0 8px 24px rgba(124, 58, 237, 0.3);
	}

	:global([data-theme='dark']) .pricing-card.selected {
		background: linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(168, 85, 247, 0.15));
	}

	.pricing-card.popular {
		border-color: #f59e0b;
	}

	.pricing-card.popular.selected {
		border-color: #7c3aed;
	}

	.popular-badge {
		position: absolute;
		top: -12px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-1) var(--space-3);
		background: linear-gradient(135deg, #f59e0b, #d97706);
		color: white;
		font-size: var(--text-xs);
		font-weight: var(--font-bold);
		border-radius: var(--radius-full);
		text-transform: uppercase;
		box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
	}

	.savings-badge {
		position: absolute;
		top: var(--space-3);
		right: var(--space-3);
		padding: var(--space-1) var(--space-2);
		background: #10b981;
		color: white;
		font-size: var(--text-xs);
		font-weight: var(--font-bold);
		border-radius: var(--radius-sm);
	}

	.pricing-card h3 {
		margin: 0 0 var(--space-3) 0;
		font-size: var(--text-xl);
		font-weight: var(--font-bold);
		color: var(--gray-800);
	}

	:global([data-theme='dark']) .pricing-card h3 {
		color: var(--gray-100);
	}

	.price {
		margin-bottom: var(--space-2);
	}

	.price-value {
		font-size: var(--text-4xl);
		font-weight: var(--font-bold);
		color: #7c3aed;
		line-height: 1;
	}

	.price-period {
		font-size: var(--text-sm);
		color: var(--gray-600);
		margin-left: var(--space-1);
	}

	:global([data-theme='dark']) .price-period {
		color: var(--gray-400);
	}

	.price-detail {
		font-size: var(--text-sm);
		color: var(--gray-600);
		margin-bottom: var(--space-3);
	}

	:global([data-theme='dark']) .price-detail {
		color: var(--gray-400);
	}

	.checkmark {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		margin: 0 auto;
		border: 2px solid var(--gray-300);
		border-radius: 50%;
		color: transparent;
		transition: all 0.2s;
	}

	:global([data-theme='dark']) .checkmark {
		border-color: var(--gray-700);
	}

	.pricing-card.selected .checkmark {
		border-color: #7c3aed;
		background: #7c3aed;
		color: white;
	}

	.benefits-section {
		padding: 0 var(--space-6) var(--space-6);
	}

	.benefits-section h3 {
		margin: 0 0 var(--space-4) 0;
		font-size: var(--text-xl);
		font-weight: var(--font-bold);
		color: var(--gray-800);
		text-align: center;
	}

	:global([data-theme='dark']) .benefits-section h3 {
		color: var(--gray-100);
	}

	.benefits-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-3);
	}

	@media (max-width: 640px) {
		.benefits-grid {
			grid-template-columns: 1fr;
		}
	}

	.benefit-item {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2);
		background: var(--gray-50);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		color: var(--gray-700);
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
		padding: var(--space-6);
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
		padding: var(--space-3) var(--space-6);
		background: linear-gradient(135deg, #7c3aed, #a855f7);
		color: white;
		border: none;
		border-radius: var(--radius-full);
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		cursor: pointer;
		box-shadow: 0 8px 24px rgba(124, 58, 237, 0.4);
		transition: all 0.3s;
	}

	.btn-purchase:hover {
		transform: translateY(-2px);
		box-shadow: 0 12px 32px rgba(124, 58, 237, 0.5);
	}

	.btn-purchase:active {
		transform: translateY(0);
	}

	.footer-note {
		margin: var(--space-3) 0 0 0;
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .footer-note {
		color: var(--gray-400);
	}
</style>
