<script lang="ts">
	/**
	 * Security Demo
	 * Demonstrates the triple-layer security: checksum + signature + fingerprint
	 */
	import { onMount } from 'svelte';
	import {
		Shield,
		Hash,
		Fingerprint,
		PenTool,
		Check,
		X,
		RefreshCw,
		Lock,
		Monitor,
		Globe,
		Cpu,
		Languages
	} from '@lucide/svelte';
	import { DemoSection, DemoContent, CodeBlock, DemoButton } from '$lib/components/package-demo';

	interface Props {
		t: (key: string) => string;
	}

	let { t }: Props = $props();

	// Mock fingerprint data
	let fingerprint = $state('');
	let fingerprintComponents = $state({
		screen: '',
		timezone: '',
		platform: '',
		hardware: '',
		languages: ''
	});

	// Checksum demo
	let originalData = $state('membership:0x742d35Cc...5f5bC8d:1:true:1735689600:1703980800');
	let checksum = $state('');
	let verificationResult = $state<boolean | null>(null);
	let isGenerating = $state(false);
	let isVerifying = $state(false);

	onMount(async () => {
		// Generate mock fingerprint
		await generateMockFingerprint();
	});

	async function generateMockFingerprint() {
		// Simulate browser fingerprint collection
		const screen = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}x${window.devicePixelRatio || 1}`;
		const timezone = new Date().getTimezoneOffset().toString();
		const platform = navigator.platform || 'unknown';
		const hardware = `${navigator.hardwareConcurrency || 0}-${(navigator as { deviceMemory?: number }).deviceMemory || 0}`;
		const languages = (navigator.languages || [navigator.language]).slice(0, 3).join(',');

		fingerprintComponents = { screen, timezone, platform, hardware, languages };

		// Generate hash
		const data = [screen, timezone, platform, hardware, languages].join('|');
		const encoder = new TextEncoder();
		const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		fingerprint = hashArray
			.slice(0, 16)
			.map((b) => b.toString(16).padStart(2, '0'))
			.join('');
	}

	async function generateChecksum() {
		isGenerating = true;
		verificationResult = null;

		// Simulate checksum generation with salt
		await new Promise((r) => setTimeout(r, 500));

		const salt = 'paywall-v1:sig:a1b2c3d4e5f6';
		const dataWithSalt = originalData + ':' + salt;
		const encoder = new TextEncoder();
		const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(dataWithSalt));
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		checksum = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

		isGenerating = false;
	}

	async function verifyChecksum() {
		isVerifying = true;

		await new Promise((r) => setTimeout(r, 500));

		// In real implementation, this would recalculate and compare
		verificationResult = true;

		isVerifying = false;
	}

	function tamperData() {
		// Modify the data to simulate tampering
		originalData = originalData.replace(':true:', ':false:');
		verificationResult = null;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async function _verifyTampered() {
		isVerifying = true;

		await new Promise((r) => setTimeout(r, 500));

		// Verification would fail for tampered data
		verificationResult = false;

		isVerifying = false;
	}

	const securityCode = `import {
  generateSecureChecksum,
  verifySecureChecksum,
  requestSignature,
  generateFingerprint
} from '@shelchin/paywall';

// 1. Request signature from wallet (once per address)
const signatureCache = await requestSignature(walletClient, address);

// 2. Generate fingerprint (automatic, based on browser)
const fingerprint = await generateFingerprint();

// 3. Generate secure checksum (includes signature + fingerprint)
const checksum = await generateSecureChecksum(
  address,
  chainId,
  isMember,
  expiresAt,
  cachedAt
);

// 4. Verify checksum
const isValid = await verifySecureChecksum(
  address,
  chainId,
  isMember,
  expiresAt,
  cachedAt,
  checksum
);`;
</script>

<DemoSection title={t('demo.security.title')} description={t('demo.security.description')}>
	<!-- Security Layers -->
	<div class="security-layers">
		<div class="layer-card layer-1">
			<div class="layer-icon">
				<Hash size={32} />
			</div>
			<div class="layer-content">
				<h4>{t('demo.security.layer1_title')}</h4>
				<p>{t('demo.security.layer1_desc')}</p>
			</div>
		</div>

		<div class="layer-connector">
			<Lock size={16} />
		</div>

		<div class="layer-card layer-2">
			<div class="layer-icon">
				<PenTool size={32} />
			</div>
			<div class="layer-content">
				<h4>{t('demo.security.layer2_title')}</h4>
				<p>{t('demo.security.layer2_desc')}</p>
			</div>
		</div>

		<div class="layer-connector">
			<Lock size={16} />
		</div>

		<div class="layer-card layer-3">
			<div class="layer-icon">
				<Fingerprint size={32} />
			</div>
			<div class="layer-content">
				<h4>{t('demo.security.layer3_title')}</h4>
				<p>{t('demo.security.layer3_desc')}</p>
			</div>
		</div>
	</div>

	<DemoContent>
		{#snippet panel()}
			<!-- Checksum Demo -->
			<div class="checksum-demo">
				<h4>{t('demo.security.demo_title')}</h4>

				<div class="data-section">
					<label>{t('demo.security.original_data')}</label>
					<textarea bind:value={originalData} rows={2}></textarea>
				</div>

				<div class="checksum-section">
					<label>{t('demo.security.checksum')}</label>
					<div class="checksum-value">
						{checksum || '—'}
					</div>
				</div>

				<div class="demo-actions">
					<DemoButton icon={RefreshCw} loading={isGenerating} onclick={generateChecksum}>
						{t('demo.security.generate')}
					</DemoButton>
					<DemoButton
						variant="success"
						icon={Check}
						loading={isVerifying}
						onclick={verifyChecksum}
						disabled={!checksum}
					>
						{t('demo.security.verify')}
					</DemoButton>
					<DemoButton variant="danger" onclick={tamperData}>
						{t('demo.security.tamper')}
					</DemoButton>
				</div>

				{#if verificationResult !== null}
					<div
						class="verification-result"
						class:passed={verificationResult}
						class:failed={!verificationResult}
					>
						{#if verificationResult}
							<Check size={20} />
							<span>{t('demo.security.passed')}</span>
						{:else}
							<X size={20} />
							<span>{t('demo.security.failed')}</span>
						{/if}
					</div>
				{/if}
			</div>
		{/snippet}

		{#snippet result()}
			<!-- Fingerprint Display -->
			<div class="fingerprint-panel">
				<h4>{t('demo.security.fingerprint')}</h4>

				<div class="fingerprint-hash">
					<Fingerprint size={24} />
					<span class="hash-value">{fingerprint || 'Generating...'}</span>
				</div>

				<div class="components-section">
					<h5>{t('demo.security.fingerprint_components')}</h5>

					<div class="components-grid">
						<div class="component-item">
							<Monitor size={16} />
							<span class="component-label">{t('demo.security.screen')}</span>
							<span class="component-value">{fingerprintComponents.screen}</span>
						</div>

						<div class="component-item">
							<Globe size={16} />
							<span class="component-label">{t('demo.security.timezone')}</span>
							<span class="component-value">UTC{fingerprintComponents.timezone}</span>
						</div>

						<div class="component-item">
							<Shield size={16} />
							<span class="component-label">{t('demo.security.platform')}</span>
							<span class="component-value">{fingerprintComponents.platform}</span>
						</div>

						<div class="component-item">
							<Cpu size={16} />
							<span class="component-label">{t('demo.security.hardware')}</span>
							<span class="component-value">{fingerprintComponents.hardware}</span>
						</div>

						<div class="component-item">
							<Languages size={16} />
							<span class="component-label">{t('demo.security.languages')}</span>
							<span class="component-value">{fingerprintComponents.languages}</span>
						</div>
					</div>
				</div>
			</div>
		{/snippet}
	</DemoContent>

	<CodeBlock title={t('code.security')} code={securityCode} />
</DemoSection>

<style>
	/* Security Layers */
	.security-layers {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		padding: var(--space-6);
		margin-bottom: var(--space-6);
		overflow-x: auto;
	}

	.layer-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: var(--space-5);
		border-radius: var(--radius-xl);
		border: 2px solid;
		min-width: 200px;
		transition: all 0.2s ease;
	}

	.layer-card:hover {
		transform: translateY(-4px);
		box-shadow: var(--shadow-lg);
	}

	.layer-1 {
		background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.05));
		border-color: rgba(99, 102, 241, 0.3);
	}

	.layer-1 .layer-icon {
		color: #6366f1;
	}

	.layer-2 {
		background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(251, 191, 36, 0.05));
		border-color: rgba(245, 158, 11, 0.3);
	}

	.layer-2 .layer-icon {
		color: #f59e0b;
	}

	.layer-3 {
		background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05));
		border-color: rgba(16, 185, 129, 0.3);
	}

	.layer-3 .layer-icon {
		color: #10b981;
	}

	.layer-icon {
		margin-bottom: var(--space-3);
	}

	.layer-content h4 {
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-foreground);
		margin-bottom: var(--space-2);
	}

	.layer-content p {
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		line-height: 1.4;
	}

	.layer-connector {
		color: var(--color-muted-foreground);
		padding: 0 var(--space-2);
	}

	/* Checksum Demo */
	.checksum-demo h4 {
		font-size: var(--text-base);
		font-weight: 600;
		color: var(--color-foreground);
		margin-bottom: var(--space-4);
	}

	.data-section,
	.checksum-section {
		margin-bottom: var(--space-4);
	}

	.data-section label,
	.checksum-section label {
		display: block;
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--color-foreground);
		margin-bottom: var(--space-2);
	}

	.data-section textarea {
		width: 100%;
		padding: var(--space-3);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		background: var(--color-input);
		color: var(--color-foreground);
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		resize: none;
	}

	.checksum-value {
		padding: var(--space-3);
		background: var(--color-panel-2);
		border-radius: var(--radius);
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		color: var(--color-primary);
		word-break: break-all;
		min-height: 40px;
	}

	.demo-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		margin-bottom: var(--space-4);
	}

	.verification-result {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-4);
		border-radius: var(--radius-lg);
		font-weight: 600;
	}

	.verification-result.passed {
		background: rgba(16, 185, 129, 0.1);
		color: #10b981;
	}

	.verification-result.failed {
		background: rgba(239, 68, 68, 0.1);
		color: #ef4444;
	}

	/* Fingerprint Panel */
	.fingerprint-panel h4 {
		font-size: var(--text-base);
		font-weight: 600;
		color: var(--color-foreground);
		margin-bottom: var(--space-4);
	}

	.fingerprint-hash {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-4);
		background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05));
		border: 1px solid rgba(16, 185, 129, 0.3);
		border-radius: var(--radius-lg);
		margin-bottom: var(--space-6);
	}

	.fingerprint-hash :global(svg) {
		color: #10b981;
	}

	.hash-value {
		font-family: var(--font-mono);
		font-size: var(--text-sm);
		color: var(--color-foreground);
		word-break: break-all;
	}

	.components-section h5 {
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-muted-foreground);
		margin-bottom: var(--space-3);
	}

	.components-grid {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.component-item {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3);
		background: var(--color-panel-2);
		border-radius: var(--radius);
	}

	.component-item :global(svg) {
		color: var(--color-muted-foreground);
	}

	.component-label {
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
		min-width: 80px;
	}

	.component-value {
		font-size: var(--text-sm);
		font-family: var(--font-mono);
		color: var(--color-foreground);
	}

	@media (max-width: 1024px) {
		.security-layers {
			flex-direction: column;
		}

		.layer-connector {
			transform: rotate(90deg);
		}
	}
</style>
