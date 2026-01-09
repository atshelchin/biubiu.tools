<script lang="ts">
	/**
	 * Interactive Playground Demo
	 * Complete paywall flow simulation with various scenarios
	 */
	import {
		Play,
		User,
		UserCheck,
		UserX,
		Crown,
		Search,
		Wallet,
		ArrowRightLeft,
		Check,
		X,
		AlertTriangle,
		CreditCard
	} from '@lucide/svelte';
	import {
		DemoSection,
		DemoContent,
		DemoButton,
		InputGroup,
		CodeBlock
	} from '$lib/components/package-demo';
	import type { PaywallResult, PaywallContext, QuotaConfig } from '@shelchin/paywall';

	interface Props {
		t: (key: string) => string;
	}

	let { t }: Props = $props();

	type Scenario = 'guest' | 'free' | 'exhausted' | 'member';
	type Feature = 'scanner' | 'sweep' | 'transfer';

	let scenario = $state<Scenario>('free');
	let feature = $state<Feature>('scanner');
	let actionCount = $state(50);
	let checkResult = $state<PaywallResult | null>(null);
	let isChecking = $state(false);
	let isExecuting = $state(false);

	const scenarios: { id: Scenario; icon: typeof User; color: string }[] = [
		{ id: 'guest', icon: UserX, color: '#6b7280' },
		{ id: 'free', icon: User, color: '#3b82f6' },
		{ id: 'exhausted', icon: UserX, color: '#ef4444' },
		{ id: 'member', icon: Crown, color: '#f59e0b' }
	];

	const features: { id: Feature; icon: typeof Search; quota: number; fee: number }[] = [
		{ id: 'scanner', icon: Search, quota: 100, fee: 0 },
		{ id: 'sweep', icon: Wallet, quota: 50, fee: 0.003 },
		{ id: 'transfer', icon: ArrowRightLeft, quota: 20, fee: 0.005 }
	];

	const selectedFeature = $derived(features.find((f) => f.id === feature)!);

	async function checkPaywall() {
		isChecking = true;
		checkResult = null;

		// Simulate network delay
		await new Promise((r) => setTimeout(r, 600));

		const freeQuota: QuotaConfig = { daily: selectedFeature.quota, countBy: 'items' };

		switch (scenario) {
			case 'guest':
				checkResult = {
					allowed: false,
					reason: 'not_connected',
					messageKey: 'paywall.status.not_connected'
				};
				break;

			case 'free':
				if (actionCount <= freeQuota.daily) {
					checkResult = {
						allowed: true,
						freeUse: true,
						messageKey: 'paywall.rules.quota_remaining',
						messageParams: { remaining: freeQuota.daily - actionCount }
					};
				} else if (selectedFeature.fee > 0) {
					// Hybrid - can pay
					checkResult = {
						allowed: true,
						freeUse: false,
						perUseFee: selectedFeature.fee,
						totalFee: selectedFeature.fee * actionCount,
						showUpgrade: true,
						showPayPerUse: true
					};
				} else {
					// Membership only - blocked
					checkResult = {
						allowed: false,
						reason: 'quota_exceeded',
						showUpgrade: true
					};
				}
				break;

			case 'exhausted':
				if (selectedFeature.fee > 0) {
					checkResult = {
						allowed: true,
						freeUse: false,
						perUseFee: selectedFeature.fee,
						totalFee: selectedFeature.fee * actionCount,
						showUpgrade: true,
						showPayPerUse: true
					};
				} else {
					checkResult = {
						allowed: false,
						reason: 'quota_exceeded',
						showUpgrade: true
					};
				}
				break;

			case 'member':
				checkResult = {
					allowed: true,
					freeUse: true
				};
				break;
		}

		isChecking = false;
	}

	async function executeAction() {
		if (!checkResult?.allowed) return;

		isExecuting = true;
		// Simulate execution
		await new Promise((r) => setTimeout(r, 1000));
		isExecuting = false;
	}

	const usePaywallCode = `import { usePaywall } from '@shelchin/paywall';
import { balanceScannerPaywall } from './paywall-rules';

const paywall = usePaywall({ rule: balanceScannerPaywall });

async function handleScan() {
  // 1. Check paywall
  const result = await paywall.check(addresses.length);

  if (!result.allowed) {
    if (result.reason === 'not_connected') {
      showConnectWallet();
    } else {
      showUpgradeModal();
    }
    return;
  }

  // 2. Handle payment if needed
  if (!result.freeUse && result.showPayPerUse) {
    const confirmed = await showPaymentConfirm(result.totalFee);
    if (!confirmed) return;
  }

  // 3. Execute action
  await performScan(addresses);

  // 4. Record usage (for quota tracking)
  if (result.freeUse) {
    await paywall.recordUsage(addresses.length);
  }
}`;
</script>

<DemoSection title={t('demo.interactive.title')} description={t('demo.interactive.description')}>
	<DemoContent>
		{#snippet panel()}
			<!-- Scenario Selector -->
			<div class="scenario-section">
				<label class="section-label">{t('demo.interactive.scenario')}</label>
				<div class="scenario-grid">
					{#each scenarios as s (s.id)}
						{@const Icon = s.icon}
						<button
							class="scenario-btn"
							class:active={scenario === s.id}
							style="--scenario-color: {s.color}"
							onclick={() => (scenario = s.id)}
						>
							<Icon size={20} />
							<span>{t(`demo.interactive.scenario_${s.id}`)}</span>
						</button>
					{/each}
				</div>
			</div>

			<!-- Feature Selector -->
			<div class="feature-section">
				<label class="section-label">{t('demo.interactive.feature')}</label>
				<div class="feature-grid">
					{#each features as f (f.id)}
						{@const Icon = f.icon}
						<button
							class="feature-btn"
							class:active={feature === f.id}
							onclick={() => (feature = f.id)}
						>
							<Icon size={18} />
							<div class="feature-info">
								<span class="feature-name">{t(`demo.interactive.feature_${f.id}`)}</span>
								<span class="feature-quota">Quota: {f.quota}</span>
							</div>
						</button>
					{/each}
				</div>
			</div>

			<!-- Action Count -->
			<InputGroup label={t('demo.interactive.action_count')} id="action-count">
				<div class="slider-group">
					<input id="action-count" type="range" min="1" max="200" bind:value={actionCount} />
					<span class="slider-value">{actionCount}</span>
				</div>
			</InputGroup>

			<!-- Actions -->
			<div class="action-buttons">
				<DemoButton variant="primary" icon={Play} loading={isChecking} onclick={checkPaywall}>
					{t('demo.interactive.check_paywall')}
				</DemoButton>

				{#if checkResult?.allowed}
					<DemoButton variant="success" icon={Check} loading={isExecuting} onclick={executeAction}>
						{t('demo.interactive.execute')}
					</DemoButton>
				{/if}
			</div>
		{/snippet}

		{#snippet result()}
			<div class="result-panel">
				<h4>{t('demo.interactive.result_panel')}</h4>

				{#if checkResult}
					<div
						class="result-card"
						class:allowed={checkResult.allowed}
						class:denied={!checkResult.allowed}
					>
						<!-- Status Header -->
						<div class="result-status">
							{#if checkResult.allowed}
								<div class="status-icon allowed">
									<Check size={24} />
								</div>
								<div class="status-text">
									<span class="status-label">Access Allowed</span>
									<span class="status-type">
										{checkResult.freeUse ? 'Free Use' : 'Paid Use'}
									</span>
								</div>
							{:else}
								<div class="status-icon denied">
									<X size={24} />
								</div>
								<div class="status-text">
									<span class="status-label">Access Denied</span>
									<span class="status-type">{checkResult.reason}</span>
								</div>
							{/if}
						</div>

						<!-- Details -->
						<div class="result-details">
							{#if checkResult.allowed && !checkResult.freeUse && checkResult.totalFee}
								<div class="detail-item fee">
									<CreditCard size={18} />
									<div class="detail-content">
										<span class="detail-label">Total Fee</span>
										<span class="detail-value">{checkResult.totalFee.toFixed(4)} ETH</span>
									</div>
								</div>
							{/if}

							{#if checkResult.messageParams?.remaining !== undefined}
								<div class="detail-item">
									<div class="detail-content">
										<span class="detail-label">Remaining Quota</span>
										<span class="detail-value">{checkResult.messageParams.remaining}</span>
									</div>
								</div>
							{/if}

							{#if checkResult.showUpgrade}
								<div class="upgrade-banner">
									<Crown size={18} />
									<span>Upgrade to unlock unlimited access</span>
								</div>
							{/if}
						</div>

						<!-- JSON Output -->
						<div class="json-output">
							<pre>{JSON.stringify(checkResult, null, 2)}</pre>
						</div>
					</div>
				{:else}
					<div class="empty-state">
						<Play size={48} />
						<p>{t('demo.interactive.waiting')}</p>
					</div>
				{/if}
			</div>
		{/snippet}
	</DemoContent>

	<CodeBlock title={t('code.use_paywall')} code={usePaywallCode} />
</DemoSection>

<style>
	.section-label {
		display: block;
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-foreground);
		margin-bottom: var(--space-3);
	}

	/* Scenario Selector */
	.scenario-section,
	.feature-section {
		margin-bottom: var(--space-4);
	}

	.scenario-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-2);
	}

	.scenario-btn {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-lg);
		background: var(--color-card);
		color: var(--color-foreground);
		cursor: pointer;
		transition: all 0.2s ease;
		font-size: var(--text-xs);
		font-weight: 500;
	}

	.scenario-btn:hover {
		border-color: var(--scenario-color);
	}

	.scenario-btn.active {
		border-color: var(--scenario-color);
		background: color-mix(in srgb, var(--scenario-color) 10%, transparent);
	}

	.scenario-btn :global(svg) {
		color: var(--scenario-color);
	}

	/* Feature Selector */
	.feature-grid {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.feature-btn {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		background: var(--color-card);
		color: var(--color-foreground);
		cursor: pointer;
		transition: all 0.2s ease;
		text-align: left;
	}

	.feature-btn:hover {
		border-color: var(--color-primary);
	}

	.feature-btn.active {
		border-color: var(--color-primary);
		background: color-mix(in srgb, var(--color-primary) 5%, var(--color-card));
	}

	.feature-btn :global(svg) {
		color: var(--color-primary);
	}

	.feature-info {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.feature-name {
		font-size: var(--text-sm);
		font-weight: 500;
	}

	.feature-quota {
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
	}

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
		min-width: 40px;
		text-align: right;
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-primary);
	}

	.action-buttons {
		display: flex;
		gap: var(--space-2);
		margin-top: var(--space-4);
	}

	/* Result Panel */
	.result-panel h4 {
		font-size: var(--text-base);
		font-weight: 600;
		color: var(--color-foreground);
		margin-bottom: var(--space-4);
	}

	.result-card {
		border-radius: var(--radius-xl);
		border: 1px solid var(--color-border);
		overflow: hidden;
	}

	.result-card.allowed {
		background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), transparent);
		border-color: rgba(16, 185, 129, 0.3);
	}

	.result-card.denied {
		background: linear-gradient(135deg, rgba(239, 68, 68, 0.05), transparent);
		border-color: rgba(239, 68, 68, 0.3);
	}

	.result-status {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-5);
		border-bottom: 1px solid var(--color-border);
	}

	.status-icon {
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-full);
		color: white;
	}

	.status-icon.allowed {
		background: #10b981;
	}

	.status-icon.denied {
		background: #ef4444;
	}

	.status-text {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.status-label {
		font-size: var(--text-lg);
		font-weight: 600;
		color: var(--color-foreground);
	}

	.status-type {
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
	}

	.result-details {
		padding: var(--space-4);
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.detail-item {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3);
		background: var(--color-panel-1);
		border-radius: var(--radius);
	}

	.detail-item.fee {
		background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), transparent);
	}

	.detail-item.fee :global(svg) {
		color: #6366f1;
	}

	.detail-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.detail-label {
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
	}

	.detail-value {
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-foreground);
	}

	.upgrade-banner {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3);
		background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(251, 191, 36, 0.05));
		border: 1px solid rgba(245, 158, 11, 0.3);
		border-radius: var(--radius);
		color: #f59e0b;
		font-size: var(--text-sm);
		font-weight: 500;
	}

	.json-output {
		padding: var(--space-4);
		background: var(--color-panel-2);
		border-top: 1px solid var(--color-border);
	}

	.json-output pre {
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		margin: 0;
		overflow-x: auto;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 250px;
		color: var(--color-muted-foreground);
		gap: var(--space-4);
	}

	.empty-state p {
		font-size: var(--text-sm);
	}
</style>
