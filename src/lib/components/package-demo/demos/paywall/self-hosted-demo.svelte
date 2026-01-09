<script lang="ts">
	/**
	 * Self-Hosted Mode Demo
	 * Demonstrates bypassing all paywall checks for self-hosted deployments
	 */
	import { Server, Check, X, Terminal, Settings, Cloud, Building, Code } from '@lucide/svelte';
	import { DemoSection, DemoContent, CodeBlock, DemoButton } from '$lib/components/package-demo';

	interface Props {
		t: (key: string) => string;
	}

	let { t }: Props = $props();

	let selfHostedMode = $state(false);

	function toggleMode() {
		selfHostedMode = !selfHostedMode;
	}

	// Simulate paywall check result based on mode
	const checkResult = $derived(
		selfHostedMode
			? { allowed: true, freeUse: true }
			: { allowed: false, reason: 'membership_required', showUpgrade: true }
	);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const _envCode = `# .env
VITE_SELF_HOSTED=true`;

	const configCode = `import { initPaywall } from '@shelchin/paywall';

initPaywall({
  contract: {
    address: '0x...',
    abi: MyPremiumABI.abi,
  },
  // Enable self-hosted mode via environment variable
  selfHostedMode: import.meta.env.VITE_SELF_HOSTED === 'true'
});

// Build with self-hosted mode enabled
// $ VITE_SELF_HOSTED=true bun run build`;
</script>

<DemoSection title={t('demo.self_hosted.title')} description={t('demo.self_hosted.description')}>
	<DemoContent>
		{#snippet panel()}
			<!-- Mode Toggle -->
			<div class="mode-toggle">
				<div class="mode-card" class:enabled={selfHostedMode}>
					<div class="mode-icon">
						<Server size={32} />
					</div>
					<div class="mode-info">
						<h4>{t('demo.self_hosted.mode_status')}</h4>
						<div class="mode-status">
							{#if selfHostedMode}
								<Check size={16} />
								<span>{t('demo.self_hosted.enabled')}</span>
							{:else}
								<X size={16} />
								<span>{t('demo.self_hosted.disabled')}</span>
							{/if}
						</div>
					</div>
					<DemoButton variant={selfHostedMode ? 'danger' : 'success'} onclick={toggleMode}>
						{t('demo.self_hosted.toggle')}
					</DemoButton>
				</div>

				<p class="mode-explanation">{t('demo.self_hosted.explanation')}</p>
			</div>

			<!-- Use Cases -->
			<div class="use-cases">
				<h4>{t('demo.self_hosted.use_cases')}</h4>
				<div class="case-list">
					<div class="case-item">
						<Cloud size={20} />
						<span>{t('demo.self_hosted.case1')}</span>
					</div>
					<div class="case-item">
						<Code size={20} />
						<span>{t('demo.self_hosted.case2')}</span>
					</div>
					<div class="case-item">
						<Building size={20} />
						<span>{t('demo.self_hosted.case3')}</span>
					</div>
				</div>
			</div>
		{/snippet}

		{#snippet result()}
			<!-- Check Result Demo -->
			<div class="result-demo">
				<h4>paywall.check() Result</h4>

				<div
					class="result-card"
					class:allowed={checkResult.allowed}
					class:denied={!checkResult.allowed}
				>
					<div class="result-header">
						{#if checkResult.allowed}
							<Check size={24} />
							<span>Allowed</span>
						{:else}
							<X size={24} />
							<span>Denied</span>
						{/if}
					</div>

					<div class="result-json">
						<pre>{JSON.stringify(checkResult, null, 2)}</pre>
					</div>
				</div>

				<!-- How to Enable -->
				<div class="how-to-section">
					<h4>{t('demo.self_hosted.how_to_enable')}</h4>

					<div class="code-tabs">
						<div class="code-tab">
							<div class="tab-header">
								<Terminal size={16} />
								<span>{t('demo.self_hosted.env_var')}</span>
							</div>
							<div class="tab-code">
								<code>VITE_SELF_HOSTED=true bun run build</code>
							</div>
						</div>

						<div class="code-tab">
							<div class="tab-header">
								<Settings size={16} />
								<span>{t('demo.self_hosted.config')}</span>
							</div>
							<div class="tab-code">
								<code>selfHostedMode: true</code>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/snippet}
	</DemoContent>

	<CodeBlock title="Configuration" code={configCode} />
</DemoSection>

<style>
	.mode-toggle {
		margin-bottom: var(--space-6);
	}

	.mode-card {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-5);
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-xl);
		transition: all 0.3s ease;
	}

	.mode-card.enabled {
		background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05));
		border-color: rgba(16, 185, 129, 0.5);
	}

	.mode-icon {
		width: 64px;
		height: 64px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-panel-2);
		border-radius: var(--radius-lg);
		color: var(--color-muted-foreground);
		transition: all 0.3s ease;
	}

	.mode-card.enabled .mode-icon {
		background: #10b981;
		color: white;
	}

	.mode-info {
		flex: 1;
	}

	.mode-info h4 {
		font-size: var(--text-lg);
		font-weight: 600;
		color: var(--color-foreground);
		margin-bottom: var(--space-2);
	}

	.mode-status {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
		font-weight: 500;
	}

	.mode-card.enabled .mode-status {
		color: #10b981;
	}

	.mode-card:not(.enabled) .mode-status {
		color: var(--color-muted-foreground);
	}

	.mode-explanation {
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: var(--color-panel-2);
		border-radius: var(--radius);
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
	}

	/* Use Cases */
	.use-cases h4 {
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-foreground);
		margin-bottom: var(--space-3);
	}

	.case-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.case-item {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3);
		background: var(--color-panel-1);
		border-radius: var(--radius);
		font-size: var(--text-sm);
		color: var(--color-foreground);
	}

	.case-item :global(svg) {
		color: var(--color-primary);
	}

	/* Result Demo */
	.result-demo h4 {
		font-size: var(--text-base);
		font-weight: 600;
		color: var(--color-foreground);
		margin-bottom: var(--space-4);
	}

	.result-card {
		padding: var(--space-5);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
		margin-bottom: var(--space-6);
		transition: all 0.3s ease;
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

	.result-json {
		background: var(--color-panel-2);
		border-radius: var(--radius);
		padding: var(--space-4);
	}

	.result-json pre {
		font-family: var(--font-mono);
		font-size: var(--text-sm);
		color: var(--color-foreground);
		margin: 0;
	}

	/* How To */
	.how-to-section h4 {
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-muted-foreground);
		margin-bottom: var(--space-3);
	}

	.code-tabs {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.code-tab {
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		overflow: hidden;
	}

	.tab-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		background: var(--color-panel-2);
		font-size: var(--text-xs);
		font-weight: 500;
		color: var(--color-muted-foreground);
	}

	.tab-code {
		padding: var(--space-3);
		background: var(--color-card);
	}

	.tab-code code {
		font-family: var(--font-mono);
		font-size: var(--text-sm);
		color: var(--color-primary);
	}
</style>
