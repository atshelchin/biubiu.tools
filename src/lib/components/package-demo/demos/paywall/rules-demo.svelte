<script lang="ts">
	/**
	 * Rules Demo
	 * Interactive demo of the four paywall rule types
	 */
	import { Gift, Crown, CreditCard, Layers, Play, Check, X, AlertTriangle } from '@lucide/svelte';
	import {
		DemoSection,
		DemoContent,
		CodeBlock,
		DemoButton,
		InputGroup
	} from '$lib/components/package-demo';
	import type { PaywallResult, PaywallContext, QuotaConfig } from '@shelchin/paywall';

	interface Props {
		t: (key: string) => string;
	}

	let { t }: Props = $props();

	type RuleType = 'free' | 'membership_only' | 'pay_per_use' | 'hybrid';

	let selectedRule = $state<RuleType>('membership_only');
	let dailyQuota = $state(100);
	let perUseFee = $state(0.003);
	let itemCount = $state(50);
	let isMember = $state(false);
	let dailyUsed = $state(0);
	let checkResult = $state<PaywallResult | null>(null);

	const ruleTypes: { id: RuleType; icon: typeof Gift; color: string }[] = [
		{ id: 'free', icon: Gift, color: '#10b981' },
		{ id: 'membership_only', icon: Crown, color: '#f59e0b' },
		{ id: 'pay_per_use', icon: CreditCard, color: '#6366f1' },
		{ id: 'hybrid', icon: Layers, color: '#ec4899' }
	];

	function simulateCheck() {
		const ctx: PaywallContext = {
			isMember,
			chainId: 1,
			address: '0x1234567890123456789012345678901234567890',
			itemCount,
			dailyUsage: dailyUsed
		};

		const freeQuota: QuotaConfig = { daily: dailyQuota, countBy: 'items' };

		switch (selectedRule) {
			case 'free':
				checkResult = { allowed: true, freeUse: true };
				break;

			case 'membership_only':
				if (ctx.isMember) {
					checkResult = { allowed: true, freeUse: true };
				} else {
					const remaining = freeQuota.daily - (ctx.dailyUsage ?? 0);
					if ((ctx.itemCount ?? 1) <= remaining) {
						checkResult = {
							allowed: true,
							freeUse: true,
							messageKey: 'paywall.rules.quota_remaining',
							messageParams: { remaining: remaining - (ctx.itemCount ?? 1) }
						};
					} else {
						checkResult = {
							allowed: false,
							reason: 'quota_exceeded',
							messageKey: 'paywall.rules.quota_exceeded',
							showUpgrade: true
						};
					}
				}
				break;

			case 'pay_per_use':
				if (ctx.isMember) {
					checkResult = { allowed: true, freeUse: true };
				} else {
					const totalFee = perUseFee * (ctx.itemCount ?? 1);
					checkResult = {
						allowed: true,
						freeUse: false,
						perUseFee,
						totalFee,
						feeInContract: true,
						showUpgrade: true,
						showPayPerUse: true
					};
				}
				break;

			case 'hybrid':
				if (ctx.isMember) {
					checkResult = { allowed: true, freeUse: true };
				} else {
					const hybridRemaining = freeQuota.daily - (ctx.dailyUsage ?? 0);
					if ((ctx.itemCount ?? 1) <= hybridRemaining) {
						checkResult = {
							allowed: true,
							freeUse: true,
							messageKey: 'paywall.rules.quota_remaining',
							messageParams: { remaining: hybridRemaining - (ctx.itemCount ?? 1) }
						};
					} else {
						const hybridFee = perUseFee * (ctx.itemCount ?? 1);
						checkResult = {
							allowed: true,
							freeUse: false,
							perUseFee,
							totalFee: hybridFee,
							feeInContract: true,
							showUpgrade: true,
							showPayPerUse: true
						};
					}
				}
				break;
		}
	}

	const createRuleCode = `import {
  createFreeRule,
  createMembershipOnlyRule,
  createPayPerUseRule,
  createHybridRule
} from '@shelchin/paywall';

// 1. Free - No restrictions
const freeRule = createFreeRule('public-tool');

// 2. Membership Only - Free quota for non-members
const membershipRule = createMembershipOnlyRule('premium-feature', {
  daily: 100,
  countBy: 'items'
});

// 3. Pay Per Use - Members free, others pay
const payPerUseRule = createPayPerUseRule('wallet-sweep', 0.003, {
  feeInContract: true
});

// 4. Hybrid - Free quota + pay after exhausted
const hybridRule = createHybridRule('batch-transfer', {
  freeQuota: { daily: 10, countBy: 'items' },
  perUseFee: 0.003,
  feeInContract: true
});`;
</script>

<DemoSection title={t('demo.rules.title')} description={t('demo.rules.description')}>
	<DemoContent>
		{#snippet panel()}
			<!-- Rule Type Selector -->
			<div class="rule-selector">
				<label class="selector-label">{t('demo.rules.select_rule')}</label>
				<div class="rule-buttons">
					{#each ruleTypes as rule (rule.id)}
						{@const Icon = rule.icon}
						<button
							class="rule-btn"
							class:active={selectedRule === rule.id}
							style="--rule-color: {rule.color}"
							onclick={() => (selectedRule = rule.id)}
						>
							<Icon size={20} />
							<span>{t(`demo.rules.${rule.id}`)}</span>
						</button>
					{/each}
				</div>
				<p class="rule-desc">{t(`demo.rules.${selectedRule}_desc`)}</p>
			</div>

			<!-- Settings -->
			<div class="settings-panel">
				<h4>{t('demo.rules.settings')}</h4>

				{#if selectedRule !== 'free' && selectedRule !== 'pay_per_use'}
					<InputGroup label={t('demo.rules.daily_quota')} id="daily-quota">
						<div class="slider-group">
							<input
								id="daily-quota"
								type="range"
								min="10"
								max="500"
								step="10"
								bind:value={dailyQuota}
							/>
							<span class="slider-value">{dailyQuota}</span>
						</div>
					</InputGroup>
				{/if}

				{#if selectedRule === 'pay_per_use' || selectedRule === 'hybrid'}
					<InputGroup label={t('demo.rules.per_use_fee')} id="per-use-fee">
						<div class="slider-group">
							<input
								id="per-use-fee"
								type="range"
								min="0.001"
								max="0.01"
								step="0.001"
								bind:value={perUseFee}
							/>
							<span class="slider-value">{perUseFee.toFixed(3)}</span>
						</div>
					</InputGroup>
				{/if}

				<InputGroup label={t('demo.rules.item_count')} id="item-count">
					<div class="slider-group">
						<input id="item-count" type="range" min="1" max="200" bind:value={itemCount} />
						<span class="slider-value">{itemCount}</span>
					</div>
				</InputGroup>

				<div class="toggle-group">
					<label class="toggle-label">
						<input type="checkbox" bind:checked={isMember} />
						<span class="toggle-switch"></span>
						<span>{t('demo.rules.is_member')}</span>
					</label>
				</div>

				{#if selectedRule !== 'free'}
					<InputGroup label={t('demo.rules.daily_used')} id="daily-used">
						<div class="slider-group">
							<input id="daily-used" type="range" min="0" max={dailyQuota} bind:value={dailyUsed} />
							<span class="slider-value">{dailyUsed}</span>
						</div>
					</InputGroup>
				{/if}

				<DemoButton icon={Play} onclick={simulateCheck}>{t('demo.rules.simulate')}</DemoButton>
			</div>
		{/snippet}

		{#snippet result()}
			<div class="result-panel">
				<h4>{t('demo.rules.result')}</h4>

				{#if checkResult}
					<div
						class="result-card"
						class:allowed={checkResult.allowed}
						class:denied={!checkResult.allowed}
					>
						<div class="result-header">
							{#if checkResult.allowed}
								<Check size={24} />
								<span>{t('demo.rules.allowed')}</span>
							{:else}
								<X size={24} />
								<span>{t('demo.rules.denied')}</span>
							{/if}
						</div>

						<div class="result-details">
							{#if checkResult.allowed}
								<div class="detail-row">
									<span class="label"
										>{checkResult.freeUse
											? t('demo.rules.free_use')
											: t('demo.rules.paid_use')}</span
									>
									{#if checkResult.freeUse}
										<span class="badge badge-success">Free</span>
									{:else}
										<span class="badge badge-warning">Paid</span>
									{/if}
								</div>

								{#if checkResult.totalFee !== undefined}
									<div class="detail-row">
										<span class="label">{t('demo.rules.total_fee')}</span>
										<span class="value fee">{checkResult.totalFee.toFixed(4)} ETH</span>
									</div>
								{/if}

								{#if checkResult.messageParams?.remaining !== undefined}
									<div class="detail-row">
										<span class="label">{t('demo.rules.remaining_quota')}</span>
										<span class="value">{checkResult.messageParams.remaining}</span>
									</div>
								{/if}
							{:else}
								<div class="detail-row">
									<span class="label">{t('demo.rules.reason')}</span>
									<span class="value error">{checkResult.reason}</span>
								</div>
							{/if}

							{#if checkResult.showUpgrade}
								<div class="upgrade-hint">
									<AlertTriangle size={16} />
									<span>{t('demo.rules.upgrade_hint')}</span>
								</div>
							{/if}
						</div>
					</div>

					<!-- Result JSON -->
					<div class="result-json">
						<pre>{JSON.stringify(checkResult, null, 2)}</pre>
					</div>
				{:else}
					<div class="empty-result">
						<Play size={48} />
						<p>Click "{t('demo.rules.simulate')}" to see the result</p>
					</div>
				{/if}
			</div>
		{/snippet}
	</DemoContent>

	<CodeBlock title={t('code.create_rule')} code={createRuleCode} />
</DemoSection>

<style>
	.rule-selector {
		margin-bottom: var(--space-4);
	}

	.selector-label {
		display: block;
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--color-foreground);
		margin-bottom: var(--space-3);
	}

	.rule-buttons {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-2);
	}

	.rule-btn {
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
		font-size: var(--text-sm);
		font-weight: 500;
	}

	.rule-btn:hover {
		border-color: var(--rule-color);
		background: color-mix(in srgb, var(--rule-color) 10%, transparent);
	}

	.rule-btn.active {
		border-color: var(--rule-color);
		background: color-mix(in srgb, var(--rule-color) 15%, transparent);
		color: var(--rule-color);
	}

	.rule-btn :global(svg) {
		color: var(--rule-color);
	}

	.rule-desc {
		margin-top: var(--space-3);
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
		padding: var(--space-3);
		background: var(--color-panel-1);
		border-radius: var(--radius);
	}

	.settings-panel {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.settings-panel h4 {
		font-size: var(--text-base);
		font-weight: 600;
		color: var(--color-foreground);
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
		min-width: 50px;
		text-align: right;
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-primary);
	}

	.toggle-group {
		padding: var(--space-2) 0;
	}

	.toggle-label {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		cursor: pointer;
		font-size: var(--text-sm);
		color: var(--color-foreground);
	}

	.toggle-label input {
		display: none;
	}

	.toggle-switch {
		width: 44px;
		height: 24px;
		background: var(--color-panel-2);
		border-radius: 12px;
		position: relative;
		transition: background 0.2s ease;
	}

	.toggle-switch::after {
		content: '';
		position: absolute;
		width: 20px;
		height: 20px;
		background: white;
		border-radius: 50%;
		top: 2px;
		left: 2px;
		transition: transform 0.2s ease;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
	}

	.toggle-label input:checked + .toggle-switch {
		background: var(--color-primary);
	}

	.toggle-label input:checked + .toggle-switch::after {
		transform: translateX(20px);
	}

	/* Result Panel */
	.result-panel h4 {
		font-size: var(--text-base);
		font-weight: 600;
		color: var(--color-foreground);
		margin-bottom: var(--space-4);
	}

	.result-card {
		padding: var(--space-5);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
		margin-bottom: var(--space-4);
	}

	.result-card.allowed {
		background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05));
		border-color: rgba(16, 185, 129, 0.3);
	}

	.result-card.denied {
		background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05));
		border-color: rgba(239, 68, 68, 0.3);
	}

	.result-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-lg);
		font-weight: 600;
		margin-bottom: var(--space-4);
	}

	.result-card.allowed .result-header {
		color: #10b981;
	}

	.result-card.denied .result-header {
		color: #ef4444;
	}

	.result-details {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.detail-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.detail-row .label {
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
	}

	.detail-row .value {
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-foreground);
	}

	.detail-row .value.fee {
		color: var(--color-primary);
	}

	.detail-row .value.error {
		color: #ef4444;
	}

	.badge {
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius);
		font-size: var(--text-xs);
		font-weight: 600;
	}

	.badge-success {
		background: rgba(16, 185, 129, 0.2);
		color: #10b981;
	}

	.badge-warning {
		background: rgba(245, 158, 11, 0.2);
		color: #f59e0b;
	}

	.upgrade-hint {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3);
		background: rgba(245, 158, 11, 0.1);
		border-radius: var(--radius);
		color: #f59e0b;
		font-size: var(--text-sm);
		margin-top: var(--space-2);
	}

	.result-json {
		background: var(--color-panel-2);
		border-radius: var(--radius);
		padding: var(--space-4);
		overflow-x: auto;
	}

	.result-json pre {
		font-size: var(--text-xs);
		font-family: var(--font-mono);
		color: var(--color-muted-foreground);
		margin: 0;
	}

	.empty-result {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 200px;
		color: var(--color-muted-foreground);
		gap: var(--space-4);
	}

	.empty-result p {
		font-size: var(--text-sm);
	}
</style>
