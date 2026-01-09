<script lang="ts">
	/**
	 * Usage Quota Demo
	 * Demonstrates daily usage tracking with checksum protection
	 */
	import { Gauge, Plus, Trash2, Check, AlertTriangle, History } from '@lucide/svelte';
	import {
		DemoSection,
		DemoContent,
		CodeBlock,
		DemoButton,
		InputGroup,
		ProgressBar
	} from '$lib/components/package-demo';

	interface Props {
		t: (key: string) => string;
	}

	let { t }: Props = $props();

	// Mock state
	let featureId = $state('balance-scanner');
	let dailyLimit = $state(100);
	let currentUsage = $state(0);
	let usageAmount = $state(10);
	let checksumValid = $state(true);
	let usageHistory = $state<{ id: number; time: string; amount: number; total: number }[]>([]);
	let historyIdCounter = $state(0);

	const remaining = $derived(Math.max(0, dailyLimit - currentUsage));
	const usagePercent = $derived(Math.min(100, (currentUsage / dailyLimit) * 100));

	function recordUsage() {
		if (usageAmount <= 0) return;

		currentUsage += usageAmount;
		historyIdCounter += 1;
		usageHistory = [
			{
				id: historyIdCounter,
				time: new Date().toLocaleTimeString(),
				amount: usageAmount,
				total: currentUsage
			},
			...usageHistory
		].slice(0, 10);
	}

	function clearUsage() {
		currentUsage = 0;
		usageHistory = [];
	}

	function tamperData() {
		// Simulate tampering - checksum becomes invalid
		checksumValid = false;
		currentUsage = 0; // Pretend to reset usage
	}

	function verifyChecksum() {
		// In real implementation, this would verify the checksum
		// After tampering, verification would fail
		if (!checksumValid) {
			// Reset to valid state after verification detects tampering
			currentUsage = usageHistory.reduce((sum, h) => sum + h.amount, 0) || 0;
			checksumValid = true;
		}
	}

	const usageStoreCode = `import { createUsageQuotaStore, useUsageQuotaStore } from '@shelchin/paywall';

// In parent component
const usageStore = createUsageQuotaStore();

// Set address when wallet connects
usageStore.setAddress(walletAddress);

// In child components
const usage = useUsageQuotaStore();

// Get today's usage for a feature
const dailyUsage = await usage.getDailyUsage('balance-scanner');

// Record usage after successful operation
await usage.recordUsage('balance-scanner', itemCount);

// Get remaining quota
const remaining = await usage.getRemainingQuota('balance-scanner', 100);

// Clear usage (for testing/admin)
await usage.clearUsage('balance-scanner');`;
</script>

<DemoSection title={t('demo.usage.title')} description={t('demo.usage.description')}>
	<DemoContent>
		{#snippet panel()}
			<!-- Feature Config -->
			<InputGroup label={t('demo.usage.feature_id')} id="feature-id">
				<input id="feature-id" type="text" bind:value={featureId} />
			</InputGroup>

			<InputGroup label={t('demo.usage.daily_limit')} id="daily-limit">
				<div class="slider-group">
					<input
						id="daily-limit"
						type="range"
						min="10"
						max="500"
						step="10"
						bind:value={dailyLimit}
					/>
					<span class="slider-value">{dailyLimit}</span>
				</div>
			</InputGroup>

			<!-- Record Usage -->
			<div class="record-section">
				<h4>{t('demo.usage.record_usage')}</h4>
				<div class="record-row">
					<InputGroup label={t('demo.usage.amount')} id="usage-amount">
						<input id="usage-amount" type="number" min="1" max="100" bind:value={usageAmount} />
					</InputGroup>
					<DemoButton icon={Plus} onclick={recordUsage} disabled={remaining <= 0}>
						{t('demo.usage.record')}
					</DemoButton>
				</div>
			</div>

			<!-- Actions -->
			<div class="actions-row">
				<DemoButton variant="outline" icon={Trash2} onclick={clearUsage}>
					{t('demo.usage.clear')}
				</DemoButton>
			</div>

			<!-- Checksum Demo -->
			<div class="checksum-section">
				<h4>{t('demo.usage.checksum_status')}</h4>
				<div class="checksum-status" class:valid={checksumValid} class:invalid={!checksumValid}>
					{#if checksumValid}
						<Check size={16} />
						<span>{t('demo.usage.valid')}</span>
					{:else}
						<AlertTriangle size={16} />
						<span>{t('demo.usage.invalid')}</span>
					{/if}
				</div>
				<div class="checksum-actions">
					<button class="tamper-btn" onclick={tamperData}> Tamper Data </button>
					<button class="verify-btn" onclick={verifyChecksum}> Verify & Restore </button>
				</div>
			</div>
		{/snippet}

		{#snippet result()}
			<div class="usage-panel">
				<!-- Current Usage Display -->
				<div class="usage-card">
					<div class="usage-header">
						<Gauge size={24} />
						<span>{featureId}</span>
					</div>

					<div class="usage-stats">
						<div class="stat-item">
							<span class="stat-label">{t('demo.usage.current_usage')}</span>
							<span class="stat-value">{currentUsage}</span>
						</div>
						<div class="stat-divider">/</div>
						<div class="stat-item">
							<span class="stat-label">{t('demo.usage.daily_limit')}</span>
							<span class="stat-value">{dailyLimit}</span>
						</div>
					</div>

					<ProgressBar
						progress={usagePercent}
						showLabel
						color={usagePercent >= 100
							? '#ef4444'
							: usagePercent >= 80
								? '#f59e0b'
								: 'var(--color-primary)'}
					/>

					<div class="remaining-display">
						<span class="remaining-label">{t('demo.usage.remaining')}</span>
						<span class="remaining-value" class:zero={remaining === 0}>
							{remaining}
						</span>
					</div>
				</div>

				<!-- Usage History -->
				<div class="history-section">
					<div class="history-header">
						<History size={16} />
						<span>{t('demo.usage.history')}</span>
					</div>

					{#if usageHistory.length === 0}
						<div class="no-history">
							<p>{t('demo.usage.no_usage')}</p>
						</div>
					{:else}
						<div class="history-list">
							{#each usageHistory as entry (entry.id)}
								<div class="history-item">
									<span class="history-time">{entry.time}</span>
									<span class="history-amount">+{entry.amount}</span>
									<span class="history-total">= {entry.total}</span>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		{/snippet}
	</DemoContent>

	<CodeBlock title={t('code.usage_store')} code={usageStoreCode} />
</DemoSection>

<style>
	.slider-group {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.slider-group input[type='range'] {
		flex: 1;
		height: 6px;
		border-radius: 3px;
		background: var(--color-panel-2);
		cursor: pointer;
	}

	.slider-value {
		min-width: 50px;
		text-align: right;
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-primary);
	}

	.record-section {
		margin-bottom: var(--space-4);
	}

	.record-section h4 {
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-foreground);
		margin-bottom: var(--space-3);
	}

	.record-row {
		display: flex;
		gap: var(--space-3);
		align-items: flex-end;
	}

	.record-row :global(.input-group) {
		flex: 1;
	}

	.actions-row {
		margin-bottom: var(--space-4);
	}

	.checksum-section {
		padding: var(--space-4);
		background: var(--color-panel-1);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
	}

	.checksum-section h4 {
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-foreground);
		margin-bottom: var(--space-3);
	}

	.checksum-status {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3);
		border-radius: var(--radius);
		font-size: var(--text-sm);
		font-weight: 600;
		margin-bottom: var(--space-3);
	}

	.checksum-status.valid {
		background: rgba(16, 185, 129, 0.1);
		color: #10b981;
	}

	.checksum-status.invalid {
		background: rgba(239, 68, 68, 0.1);
		color: #ef4444;
	}

	.checksum-actions {
		display: flex;
		gap: var(--space-2);
	}

	.tamper-btn,
	.verify-btn {
		padding: var(--space-2) var(--space-3);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		font-size: var(--text-xs);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.tamper-btn {
		background: rgba(239, 68, 68, 0.1);
		color: #ef4444;
		border-color: rgba(239, 68, 68, 0.3);
	}

	.tamper-btn:hover {
		background: rgba(239, 68, 68, 0.2);
	}

	.verify-btn {
		background: rgba(16, 185, 129, 0.1);
		color: #10b981;
		border-color: rgba(16, 185, 129, 0.3);
	}

	.verify-btn:hover {
		background: rgba(16, 185, 129, 0.2);
	}

	/* Usage Panel */
	.usage-card {
		padding: var(--space-6);
		background: linear-gradient(135deg, var(--color-card) 0%, var(--color-panel-1) 100%);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-xl);
		margin-bottom: var(--space-4);
	}

	.usage-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-lg);
		font-weight: 600;
		color: var(--color-foreground);
		margin-bottom: var(--space-6);
	}

	.usage-header :global(svg) {
		color: var(--color-primary);
	}

	.usage-stats {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-4);
		margin-bottom: var(--space-4);
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-1);
	}

	.stat-label {
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
	}

	.stat-value {
		font-size: var(--text-3xl);
		font-weight: 700;
		color: var(--color-foreground);
	}

	.stat-divider {
		font-size: var(--text-2xl);
		color: var(--color-muted-foreground);
	}

	.remaining-display {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: var(--space-4);
		padding-top: var(--space-4);
		border-top: 1px solid var(--color-border);
	}

	.remaining-label {
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
	}

	.remaining-value {
		font-size: var(--text-xl);
		font-weight: 700;
		color: #10b981;
	}

	.remaining-value.zero {
		color: #ef4444;
	}

	/* History */
	.history-section {
		background: var(--color-panel-1);
		border-radius: var(--radius-lg);
		padding: var(--space-4);
	}

	.history-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-muted-foreground);
		margin-bottom: var(--space-3);
	}

	.no-history {
		text-align: center;
		padding: var(--space-4);
		color: var(--color-muted-foreground);
		font-size: var(--text-sm);
	}

	.history-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		max-height: 200px;
		overflow-y: auto;
	}

	.history-item {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-2) var(--space-3);
		background: var(--color-card);
		border-radius: var(--radius);
		font-size: var(--text-sm);
	}

	.history-time {
		color: var(--color-muted-foreground);
		font-family: var(--font-mono);
		font-size: var(--text-xs);
	}

	.history-amount {
		color: #10b981;
		font-weight: 600;
	}

	.history-total {
		color: var(--color-foreground);
		margin-left: auto;
		font-weight: 500;
	}
</style>
