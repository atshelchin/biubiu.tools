<script lang="ts">
	import { Sparkles, Crown, Zap, Shield, Check } from 'lucide-svelte';

	interface Props {
		networkSymbol?: string;
		compact?: boolean; // For sidebar usage
	}

	let { networkSymbol = 'native coin', compact = false }: Props = $props();

	function handleLearnMore() {
		// TODO: Link to membership page or modal
		alert('Membership feature coming soon!');
	}
</script>

<div class="membership-promo" class:compact>
	<div class="promo-header">
		<div class="crown-icon">
			<Crown size={compact ? 24 : 32} />
		</div>
		<h3>Unlock Premium Benefits</h3>
	</div>

	<div class="promo-content">
		<div class="pricing-comparison">
			<div class="pricing-card basic">
				<div class="card-badge">Current</div>
				<div class="card-title">Basic</div>
				<div class="card-price">
					<span class="price-value">0.0025</span>
					<span class="price-unit">{networkSymbol}/tx</span>
				</div>
				<div class="card-features">
					<div class="feature">
						<Check size={14} />
						<span>Access all tools</span>
					</div>
					<div class="feature dimmed">
						<span>❌ Transaction fees apply</span>
					</div>
				</div>
			</div>

			<div class="pricing-card premium">
				<div class="card-badge premium-badge">
					<Sparkles size={12} />
					<span>Recommended</span>
				</div>
				<div class="card-title">Premium Member</div>
				<div class="card-price">
					<span class="price-value">FREE</span>
					<span class="price-unit">unlimited</span>
				</div>
				<div class="card-features">
					<div class="feature">
						<Zap size={14} />
						<span>Zero transaction fees</span>
					</div>
					<div class="feature">
						<Shield size={14} />
						<span>Priority support</span>
					</div>
					<div class="feature">
						<Sparkles size={14} />
						<span>Exclusive features</span>
					</div>
					<div class="feature">
						<Crown size={14} />
						<span>VIP badge</span>
					</div>
				</div>
			</div>
		</div>

		<div class="promo-cta">
			<button class="btn-upgrade" onclick={handleLearnMore}>
				<Crown size={16} />
				<span>Upgrade to Premium</span>
				<Sparkles size={16} />
			</button>
			<p class="cta-hint">💰 Save on every transaction • No hidden fees</p>
		</div>
	</div>
</div>

<style>
	.membership-promo {
		position: relative;
		padding: var(--space-6);
		background: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%);
		border-radius: var(--radius-lg);
		color: white;
		overflow: hidden;
	}

	.membership-promo::before {
		content: '';
		position: absolute;
		top: -50%;
		right: -50%;
		width: 200%;
		height: 200%;
		background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
		animation: pulse 3s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.5;
			transform: scale(1);
		}
		50% {
			opacity: 1;
			transform: scale(1.1);
		}
	}

	.membership-promo.compact {
		padding: var(--space-4);
	}

	.promo-header {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-4);
		position: relative;
		z-index: 1;
	}

	.crown-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 64px;
		height: 64px;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 50%;
		backdrop-filter: blur(10px);
		animation: float 3s ease-in-out infinite;
	}

	.compact .crown-icon {
		width: 48px;
		height: 48px;
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	.promo-header h3 {
		margin: 0;
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		text-align: center;
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	}

	.compact .promo-header h3 {
		font-size: var(--text-lg);
	}

	.promo-content {
		position: relative;
		z-index: 1;
	}

	.pricing-comparison {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-3);
		margin-bottom: var(--space-4);
	}

	.compact .pricing-comparison {
		grid-template-columns: 1fr;
	}

	.pricing-card {
		position: relative;
		padding: var(--space-4);
		background: rgba(255, 255, 255, 0.95);
		border-radius: var(--radius-md);
		color: var(--gray-800);
		transition: all 0.3s;
	}

	.pricing-card.basic {
		opacity: 0.9;
	}

	.pricing-card.premium {
		background: linear-gradient(135deg, #fef3c7, #fde68a);
		border: 2px solid #f59e0b;
		box-shadow: 0 8px 24px rgba(245, 158, 11, 0.3);
		transform: scale(1.05);
	}

	.compact .pricing-card.premium {
		transform: scale(1);
	}

	.pricing-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
	}

	.card-badge {
		position: absolute;
		top: var(--space-2);
		right: var(--space-2);
		padding: var(--space-1) var(--space-2);
		background: var(--gray-600);
		color: white;
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		border-radius: var(--radius-sm);
		text-transform: uppercase;
	}

	.premium-badge {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		background: linear-gradient(135deg, #f59e0b, #d97706);
		animation: shimmer 2s linear infinite;
	}

	@keyframes shimmer {
		0% {
			background-position: -100% 0;
		}
		100% {
			background-position: 200% 0;
		}
	}

	.card-title {
		font-size: var(--text-base);
		font-weight: var(--font-bold);
		margin-bottom: var(--space-2);
		color: var(--gray-700);
	}

	.card-price {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: var(--space-3);
		padding: var(--space-3) 0;
		border-bottom: 2px solid rgba(0, 0, 0, 0.1);
	}

	.price-value {
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		color: var(--gray-900);
		line-height: 1;
	}

	.premium .price-value {
		background: linear-gradient(135deg, #7c3aed, #ec4899);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.price-unit {
		font-size: var(--text-xs);
		color: var(--gray-600);
		margin-top: var(--space-1);
	}

	.card-features {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.feature {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
		color: var(--gray-700);
	}

	.feature.dimmed {
		opacity: 0.6;
	}

	.promo-cta {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2);
	}

	.btn-upgrade {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-6);
		background: linear-gradient(135deg, #fbbf24, #f59e0b);
		color: var(--gray-900);
		border: none;
		border-radius: var(--radius-full);
		font-size: var(--text-base);
		font-weight: var(--font-bold);
		cursor: pointer;
		box-shadow: 0 4px 16px rgba(245, 158, 11, 0.4);
		transition: all 0.3s;
		animation: glow 2s ease-in-out infinite;
	}

	@keyframes glow {
		0%,
		100% {
			box-shadow: 0 4px 16px rgba(245, 158, 11, 0.4);
		}
		50% {
			box-shadow: 0 6px 24px rgba(245, 158, 11, 0.6);
		}
	}

	.btn-upgrade:hover {
		transform: translateY(-2px) scale(1.05);
		box-shadow: 0 8px 24px rgba(245, 158, 11, 0.6);
	}

	.btn-upgrade:active {
		transform: translateY(0) scale(1);
	}

	.cta-hint {
		margin: 0;
		font-size: var(--text-xs);
		text-align: center;
		opacity: 0.9;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
	}

	/* Responsive adjustments */
	@media (max-width: 640px) {
		.pricing-comparison {
			grid-template-columns: 1fr;
		}

		.pricing-card.premium {
			transform: scale(1);
		}
	}
</style>
