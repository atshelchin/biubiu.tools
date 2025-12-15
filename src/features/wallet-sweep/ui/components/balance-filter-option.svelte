<script lang="ts">
	interface Props {
		hasScanned: boolean;
		walletWithBalanceCount: number;
		walletCount: number;
		onlyWithBalance: boolean;
	}

	let {
		hasScanned,
		walletWithBalanceCount,
		walletCount,
		onlyWithBalance = $bindable()
	}: Props = $props();
</script>

{#if hasScanned && walletWithBalanceCount < walletCount}
	<div class="form-section">
		<label class="checkbox-label">
			<input type="checkbox" bind:checked={onlyWithBalance} />
			<span>
				Only sweep wallets with balance ({walletWithBalanceCount} of {walletCount})
			</span>
		</label>
		<p class="form-hint">
			💡 {onlyWithBalance
				? `Only ${walletWithBalanceCount} wallets with confirmed balance will be processed`
				: `All ${walletCount} wallets will be processed (including those without balance)`}
		</p>
	</div>
{/if}

<style>
	.form-section {
		margin-bottom: var(--space-6);
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		cursor: pointer;
		font-size: var(--text-sm);
		color: var(--color-text-1);
	}

	.checkbox-label input[type='checkbox'] {
		cursor: pointer;
		width: 18px;
		height: 18px;
	}

	.form-hint {
		font-size: var(--text-sm);
		color: var(--gray-600);
		margin: var(--space-2) 0 0 28px;
	}

	:global([data-theme='dark']) .form-hint {
		color: var(--gray-400);
	}
</style>
