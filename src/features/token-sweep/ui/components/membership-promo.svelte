<script lang="ts">
	import { Crown, Zap } from 'lucide-svelte';

	interface Props {
		networkSymbol?: string;
		compact?: boolean;
	}

	let { networkSymbol = 'native coin', compact = false }: Props = $props();

	function handleLearnMore() {
		// TODO: Link to membership page or modal
		alert('Membership feature coming soon!');
	}
</script>

<div class="membership-promo" class:compact>
	<div class="promo-header">
		<Crown size={20} />
		<h3>Premium Member</h3>
	</div>

	<div class="promo-content">
		<div class="price-comparison">
			<div class="price-item current">
				<span class="label">Current</span>
				<span class="price">0.0025 {networkSymbol}/tx</span>
			</div>
			<div class="arrow">→</div>
			<div class="price-item premium">
				<span class="label">Premium</span>
				<span class="price">FREE</span>
			</div>
		</div>

		<ul class="benefits">
			<li>
				<Zap size={14} />
				<span>Zero transaction fees</span>
			</li>
			<li>
				<Zap size={14} />
				<span>Priority support</span>
			</li>
			<li>
				<Zap size={14} />
				<span>Exclusive features</span>
			</li>
		</ul>

		<button class="btn-upgrade" onclick={handleLearnMore}>
			<Crown size={16} />
			<span>Upgrade Now</span>
		</button>
	</div>
</div>

<style>
	.membership-promo {
		position: relative;
		padding: var(--space-4);
		background: linear-gradient(135deg, #7c3aed, #a855f7);
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
		pointer-events: none;
	}

	.promo-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-3);
		position: relative;
		z-index: 1;
	}

	.promo-header h3 {
		margin: 0;
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
	}

	.compact .promo-header h3 {
		font-size: var(--text-base);
	}

	.promo-content {
		position: relative;
		z-index: 1;
	}

	.price-comparison {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-2);
		padding: var(--space-3);
		background: rgba(255, 255, 255, 0.15);
		border-radius: var(--radius-md);
		margin-bottom: var(--space-3);
		backdrop-filter: blur(10px);
	}

	.price-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-1);
		flex: 1;
	}

	.label {
		font-size: var(--text-xs);
		opacity: 0.8;
		text-transform: uppercase;
		font-weight: var(--font-semibold);
	}

	.price {
		font-size: var(--text-base);
		font-weight: var(--font-bold);
		white-space: nowrap;
	}

	.price-item.premium .price {
		font-size: var(--text-xl);
		background: linear-gradient(135deg, #fbbf24, #f59e0b);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.arrow {
		font-size: var(--text-xl);
		font-weight: var(--font-bold);
		opacity: 0.6;
	}

	.benefits {
		list-style: none;
		padding: 0;
		margin: 0 0 var(--space-3) 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.benefits li {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
	}

	.compact .benefits li {
		font-size: var(--text-xs);
	}

	.btn-upgrade {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		background: linear-gradient(135deg, #fbbf24, #f59e0b);
		color: var(--gray-900);
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-bold);
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-upgrade:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4);
	}

	.btn-upgrade:active {
		transform: translateY(0);
	}
</style>
