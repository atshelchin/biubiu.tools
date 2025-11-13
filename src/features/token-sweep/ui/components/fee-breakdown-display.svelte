<script lang="ts">
	import type { FeeBreakdown, MembershipStatus } from '@/features/token-sweep/types/fee';
	import { formatFee } from '@/features/token-sweep/utils/membership';
	import { Shield, AlertCircle, CheckCircle2 } from 'lucide-svelte';

	interface Props {
		feeBreakdown: FeeBreakdown;
		membershipStatus: MembershipStatus;
		networkSymbol: string;
	}

	let { feeBreakdown, membershipStatus, networkSymbol }: Props = $props();
</script>

<div class="fee-breakdown-display">
	<!-- Membership Status -->
	<div class="membership-status" class:is-member={membershipStatus.isMember}>
		<div class="membership-header">
			<Shield size={20} />
			<h4>Membership Status</h4>
		</div>

		{#if membershipStatus.isMember}
			<div class="membership-badge member">
				<CheckCircle2 size={16} />
				<span>✓ Member - Free Transactions</span>
			</div>
			<p class="membership-info">
				You are a verified member. All sweep fees are waived!
				{#if membershipStatus.verificationMethod === 'signature'}
					<br />
					<small
						>Verified via signature from {membershipStatus.verifiedAddress?.slice(0, 10)}...</small
					>
				{/if}
			</p>
		{:else}
			<div class="membership-badge non-member">
				<AlertCircle size={16} />
				<span>Non-Member - Fees Apply</span>
			</div>
			<p class="membership-info">
				Each transaction requires a 0.0025 {networkSymbol} fee. Become a member to enjoy free transactions!
			</p>
		{/if}
	</div>

	<!-- Fee Breakdown -->
	<div class="fee-details">
		<h4 class="details-title">Fee Breakdown</h4>

		<div class="fee-grid">
			<!-- Transaction Count -->
			<div class="fee-item">
				<span class="fee-label">Transactions:</span>
				<span class="fee-value">{feeBreakdown.transactionCount}</span>
			</div>

			<!-- Sweep Fee per Transaction -->
			<div class="fee-item">
				<span class="fee-label">Sweep Fee (per tx):</span>
				<span class="fee-value" class:free={!feeBreakdown.requiresPayment}>
					{feeBreakdown.requiresPayment ? `${feeBreakdown.sweepFeePerTx} ${networkSymbol}` : 'FREE'}
				</span>
			</div>

			<!-- Total Sweep Fee -->
			<div class="fee-item">
				<span class="fee-label">Total Sweep Fee:</span>
				<span class="fee-value sweep-fee" class:free={!feeBreakdown.requiresPayment}>
					{feeBreakdown.requiresPayment ? `${feeBreakdown.totalSweepFee} ${networkSymbol}` : 'FREE'}
				</span>
			</div>

			<!-- Estimated Gas Fee -->
			<div class="fee-item">
				<span class="fee-label">Estimated Gas:</span>
				<span class="fee-value">{formatFee(feeBreakdown.estimatedGasFee, networkSymbol)}</span>
			</div>

			<!-- Total Cost -->
			<div class="fee-item total">
				<span class="fee-label">Total Cost:</span>
				<span class="fee-value total-value">
					{formatFee(feeBreakdown.totalCost, networkSymbol)}
				</span>
			</div>
		</div>

		{#if feeBreakdown.requiresPayment}
			<div class="fee-note">
				<AlertCircle size={16} />
				<p>
					<strong>Payment Required:</strong> The sweep fee will be deducted automatically from each transaction.
					Make sure your wallets have sufficient balance.
				</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.fee-breakdown-display {
		margin: var(--space-4) 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.membership-status {
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-lg);
	}

	.membership-status.is-member {
		border-color: #10b981;
		background: hsla(142, 76%, 95%, 1);
	}

	:global([data-theme='dark']) .membership-status {
		background: var(--gray-800);
		border-color: var(--gray-700);
	}

	:global([data-theme='dark']) .membership-status.is-member {
		background: hsla(142, 76%, 15%, 0.3);
		border-color: #10b981;
	}

	.membership-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-3);
		color: var(--gray-800);
	}

	:global([data-theme='dark']) .membership-header {
		color: var(--gray-200);
	}

	.membership-header h4 {
		margin: 0;
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
	}

	.membership-badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-md);
		font-weight: var(--font-semibold);
		font-size: var(--text-sm);
		margin-bottom: var(--space-2);
	}

	.membership-badge.member {
		background: #10b981;
		color: white;
	}

	.membership-badge.non-member {
		background: #f59e0b;
		color: white;
	}

	.membership-info {
		font-size: var(--text-sm);
		color: var(--gray-700);
		margin: 0;
		line-height: 1.5;
	}

	:global([data-theme='dark']) .membership-info {
		color: var(--gray-300);
	}

	.membership-info small {
		color: var(--gray-600);
		font-size: var(--text-xs);
	}

	:global([data-theme='dark']) .membership-info small {
		color: var(--gray-400);
	}

	.fee-details {
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
	}

	:global([data-theme='dark']) .fee-details {
		background: var(--gray-800);
		border-color: var(--gray-700);
	}

	.details-title {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--gray-800);
		margin: 0 0 var(--space-3) 0;
	}

	:global([data-theme='dark']) .details-title {
		color: var(--gray-200);
	}

	.fee-grid {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.fee-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-2) 0;
		border-bottom: 1px solid var(--color-border);
		font-size: var(--text-sm);
	}

	.fee-item:last-of-type {
		border-bottom: none;
	}

	.fee-item.total {
		margin-top: var(--space-2);
		padding-top: var(--space-3);
		border-top: 2px solid var(--color-border);
		font-size: var(--text-base);
	}

	:global([data-theme='dark']) .fee-item {
		border-bottom-color: var(--gray-700);
	}

	.fee-label {
		color: var(--gray-700);
		font-weight: var(--font-medium);
	}

	:global([data-theme='dark']) .fee-label {
		color: var(--gray-300);
	}

	.fee-value {
		color: var(--gray-900);
		font-weight: var(--font-semibold);
		font-family: 'Courier New', monospace;
	}

	:global([data-theme='dark']) .fee-value {
		color: var(--gray-100);
	}

	.fee-value.free {
		color: #10b981;
		font-weight: var(--font-bold);
	}

	.fee-value.sweep-fee {
		color: var(--color-primary);
	}

	.fee-value.total-value {
		color: var(--color-primary);
		font-size: var(--text-lg);
	}

	.fee-note {
		display: flex;
		gap: var(--space-2);
		margin-top: var(--space-3);
		padding: var(--space-3);
		background: hsla(45, 100%, 95%, 1);
		border: 1px solid hsl(45, 100%, 60%);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		color: hsl(45, 100%, 25%);
	}

	:global([data-theme='dark']) .fee-note {
		background: hsla(45, 100%, 15%, 0.3);
		border-color: hsl(45, 100%, 40%);
		color: hsl(45, 100%, 70%);
	}

	.fee-note p {
		margin: 0;
	}

	.membership-cta {
		padding: var(--space-4);
		background: linear-gradient(135deg, #8b5cf6, #7c3aed);
		color: white;
		border-radius: var(--radius-lg);
	}

	.membership-cta h5 {
		margin: 0 0 var(--space-2) 0;
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
	}

	.membership-cta p {
		margin: 0 0 var(--space-3) 0;
		opacity: 0.95;
	}

	.membership-cta ul {
		list-style: none;
		padding: 0;
		margin: 0 0 var(--space-4) 0;
	}

	.membership-cta ul li {
		padding: var(--space-1) 0;
		opacity: 0.95;
	}

	.btn-membership {
		padding: var(--space-2) var(--space-4);
		background: white;
		color: #7c3aed;
		border: none;
		border-radius: var(--radius-md);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-membership:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	}
</style>
