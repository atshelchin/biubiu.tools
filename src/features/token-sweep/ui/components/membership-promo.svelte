<script lang="ts">
	import { Crown, Zap, Loader2, Sparkles } from '@lucide/svelte';
	import MembershipUpgradeModal from './membership-upgrade-modal.svelte';
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import { type Address } from 'viem';
	import BiuBiuPremiumABI from '../../../../../static/contracts/BiuBiuPremium.json';

	interface Props {
		/**
		 * Custom pricing text for non-members (e.g., "0.0025 ETH/tx", "$0.01 per scan", "Free tier")
		 * If not provided, shows generic "Pay per use"
		 */
		currentPrice?: string;
		/**
		 * Network symbol for displaying fees (e.g., "ETH", "BNB")
		 * Only used if currentPrice is not provided
		 */
		networkSymbol?: string;
		/**
		 * Compact mode for sidebar usage
		 */
		compact?: boolean;
	}

	let { currentPrice, networkSymbol = 'ETH', compact = false }: Props = $props();

	const connectStore = useConnectStore();
	const BIUBIU_PREMIUM_CONTRACT = '0xc5c4bb399938625523250B708dc5c1e7dE4b1626' as Address;

	// If currentPrice is not provided, show generic text with network symbol
	let displayPrice = $derived(currentPrice || `Pay per use (${networkSymbol})`);

	let showModal = $state(false);

	// Subscription status
	let subscriptionStatus = $state<{
		isPremium: boolean;
		expiryTime: bigint;
		remainingTime: bigint;
	} | null>(null);
	let isLoadingStatus = $state(false);

	// Load subscription status when component mounts or wallet changes
	$effect(() => {
		if (connectStore.address && connectStore.publicClient) {
			loadSubscriptionStatus();
		}
	});

	async function loadSubscriptionStatus() {
		if (!connectStore.address || !connectStore.publicClient) {
			return;
		}

		isLoadingStatus = true;

		try {
			const result = await connectStore.publicClient.readContract({
				address: BIUBIU_PREMIUM_CONTRACT,
				abi: BiuBiuPremiumABI.abi,
				functionName: 'getSubscriptionInfo',
				args: [connectStore.address]
			});

			const [isPremium, expiryTime, remainingTime] = result as [boolean, bigint, bigint];

			subscriptionStatus = {
				isPremium,
				expiryTime,
				remainingTime
			};
		} catch (error) {
			console.error('Failed to load subscription status:', error);
			subscriptionStatus = null;
		} finally {
			isLoadingStatus = false;
		}
	}

	// Calculate remaining days
	let remainingDays = $derived(() => {
		if (!subscriptionStatus?.isPremium) return 0;
		return Math.ceil(Number(subscriptionStatus.remainingTime) / 86400);
	});

	function handleUpgradeClick() {
		showModal = true;
	}

	function handleCloseModal() {
		showModal = false;
		// Reload status after modal closes
		loadSubscriptionStatus();
	}
</script>

<div class="membership-promo" class:compact class:premium={subscriptionStatus?.isPremium}>
	{#if isLoadingStatus}
		<div class="loading-state">
			<Loader2 size={20} class="spinning" />
			<span>Loading status...</span>
		</div>
	{:else if subscriptionStatus?.isPremium}
		<!-- Premium Member Status -->
		<div class="promo-header premium-header">
			<Crown size={20} />
			<h3>Premium Active</h3>
			<Sparkles size={16} class="sparkle" />
		</div>

		<div class="promo-content">
			<div class="premium-status">
				<div class="status-badge">
					<span class="badge-label">VIP Member</span>
					<span class="badge-emoji">👑</span>
				</div>
				<div class="expiry-info">
					<span class="expiry-label">Expires in</span>
					<span class="expiry-days">{remainingDays()} days</span>
				</div>
			</div>

			<div class="benefit-highlight premium-benefit">
				<Zap size={16} />
				<span>Zero tool fees • Gas fees still apply</span>
			</div>

			<button class="btn-upgrade btn-renew" onclick={handleUpgradeClick}>
				<Crown size={16} />
				<span>Renew / Extend</span>
			</button>
		</div>
	{:else}
		<!-- Non-Premium User -->
		<div class="promo-header">
			<Crown size={20} />
			<h3>Premium Member</h3>
		</div>

		<div class="promo-content">
			<div class="price-comparison">
				<div class="price-item current">
					<span class="label">Current</span>
					<span class="price">{displayPrice}</span>
				</div>
				<div class="arrow">→</div>
				<div class="price-item premium">
					<span class="label">Premium</span>
					<span class="price">FREE</span>
				</div>
			</div>

			<div class="benefit-highlight">
				<Zap size={16} />
				<span>Unlock all tools for free!</span>
			</div>

			<button class="btn-upgrade" onclick={handleUpgradeClick}>
				<Crown size={16} />
				<span>Upgrade Now</span>
			</button>
		</div>
	{/if}
</div>

<MembershipUpgradeModal isOpen={showModal} onClose={handleCloseModal} />

<style>
	.membership-promo {
		position: relative;
		padding: var(--space-4);
		background: linear-gradient(135deg, #ea580c, #f97316);
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
		font-weight: var(--font-black);
		color: white;
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	}

	.arrow {
		font-size: var(--text-xl);
		font-weight: var(--font-bold);
		opacity: 0.6;
	}

	.benefit-highlight {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3);
		margin-bottom: var(--space-3);
		background: rgba(255, 255, 255, 0.2);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		text-align: center;
		backdrop-filter: blur(10px);
	}

	.compact .benefit-highlight {
		font-size: var(--text-xs);
		padding: var(--space-2);
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

	/* Premium Member Styles */
	.membership-promo.premium {
		background: linear-gradient(135deg, #8b5cf6, #6366f1);
	}

	.loading-state {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		padding: var(--space-4);
		color: white;
		font-size: var(--text-sm);
	}

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

	.premium-header {
		animation: glow 2s ease-in-out infinite;
	}

	@keyframes glow {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.9;
		}
	}

	:global(.sparkle) {
		animation: sparkle 1.5s ease-in-out infinite;
	}

	@keyframes sparkle {
		0%,
		100% {
			transform: scale(1) rotate(0deg);
			opacity: 1;
		}
		50% {
			transform: scale(1.2) rotate(180deg);
			opacity: 0.8;
		}
	}

	.premium-status {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		padding: var(--space-3);
		background: rgba(255, 255, 255, 0.2);
		border-radius: var(--radius-md);
		margin-bottom: var(--space-3);
		backdrop-filter: blur(10px);
	}

	.status-badge {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-2);
		background: rgba(255, 255, 255, 0.25);
		border-radius: var(--radius-sm);
	}

	.badge-label {
		font-size: var(--text-base);
		font-weight: var(--font-bold);
		color: white;
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	}

	.badge-emoji {
		font-size: var(--text-2xl);
		animation: bounce 2s ease-in-out infinite;
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-4px);
		}
	}

	.expiry-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.expiry-label {
		font-size: var(--text-sm);
		opacity: 0.9;
	}

	.expiry-days {
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		color: #fbbf24;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.premium-benefit {
		background: rgba(255, 255, 255, 0.25);
		border: 1px solid rgba(255, 255, 255, 0.3);
	}

	.btn-renew {
		background: linear-gradient(135deg, #10b981, #059669);
	}

	.btn-renew:hover {
		box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
	}
</style>
