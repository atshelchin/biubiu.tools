<script lang="ts">
	/**
	 * Intro Demo
	 * Explains the paywall flow and core concepts visually
	 */
	import {
		User,
		Shield,
		Scale,
		CheckCircle,
		Crown,
		Gift,
		CreditCard,
		ArrowRight
	} from '@lucide/svelte';
	import { DemoSection, CodeBlock } from '$lib/components/package-demo';

	interface Props {
		t: (key: string) => string;
	}

	let { t }: Props = $props();

	const initCode = `import { initPaywall } from '@shelchin/paywall';
import MyPremiumABI from './contracts/MyPremium.json';

// Initialize once at app startup
initPaywall({
  contract: {
    address: '0x1234...', // Your membership contract
    abi: MyPremiumABI.abi,
    functionName: 'getSubscriptionInfo' // Returns [isMember, expiresAt, remainingTime]
  },
  cache: {
    membershipKeyPrefix: 'myapp-membership',
    checksumSalt: 'myapp-v1'
  },
  timing: {
    verifyIntervalMs: 180000, // Background verification every 3 min
  }
});`;
</script>

<DemoSection title={t('demo.intro.title')} description={t('demo.intro.description')}>
	<!-- Flow Diagram -->
	<div class="flow-section">
		<h3 class="section-title">{t('demo.intro.flow_title')}</h3>
		<div class="flow-diagram">
			<div class="flow-step">
				<div class="step-icon step-1">
					<User size={24} />
				</div>
				<div class="step-content">
					<h4>{t('demo.intro.step1_title')}</h4>
					<p>{t('demo.intro.step1_desc')}</p>
				</div>
			</div>

			<div class="flow-arrow">
				<ArrowRight size={20} />
			</div>

			<div class="flow-step">
				<div class="step-icon step-2">
					<Shield size={24} />
				</div>
				<div class="step-content">
					<h4>{t('demo.intro.step2_title')}</h4>
					<p>{t('demo.intro.step2_desc')}</p>
				</div>
			</div>

			<div class="flow-arrow">
				<ArrowRight size={20} />
			</div>

			<div class="flow-step">
				<div class="step-icon step-3">
					<Scale size={24} />
				</div>
				<div class="step-content">
					<h4>{t('demo.intro.step3_title')}</h4>
					<p>{t('demo.intro.step3_desc')}</p>
				</div>
			</div>

			<div class="flow-arrow">
				<ArrowRight size={20} />
			</div>

			<div class="flow-step">
				<div class="step-icon step-4">
					<CheckCircle size={24} />
				</div>
				<div class="step-content">
					<h4>{t('demo.intro.step4_title')}</h4>
					<p>{t('demo.intro.step4_desc')}</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Core Concepts -->
	<div class="concepts-section">
		<h3 class="section-title">{t('demo.intro.concepts_title')}</h3>
		<div class="concepts-grid">
			<div class="concept-card concept-member">
				<div class="concept-icon">
					<Crown size={32} />
				</div>
				<h4>{t('demo.intro.concept_member')}</h4>
				<p>{t('demo.intro.concept_member_desc')}</p>
			</div>

			<div class="concept-card concept-quota">
				<div class="concept-icon">
					<Gift size={32} />
				</div>
				<h4>{t('demo.intro.concept_quota')}</h4>
				<p>{t('demo.intro.concept_quota_desc')}</p>
			</div>

			<div class="concept-card concept-fee">
				<div class="concept-icon">
					<CreditCard size={32} />
				</div>
				<h4>{t('demo.intro.concept_fee')}</h4>
				<p>{t('demo.intro.concept_fee_desc')}</p>
			</div>
		</div>
	</div>

	<CodeBlock title={t('code.init')} code={initCode} />
</DemoSection>

<style>
	.flow-section,
	.concepts-section {
		margin-bottom: var(--space-8);
	}

	.section-title {
		font-size: var(--text-lg);
		font-weight: 600;
		color: var(--color-foreground);
		margin-bottom: var(--space-6);
	}

	/* Flow Diagram */
	.flow-diagram {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--space-2);
		padding: var(--space-6);
		background: linear-gradient(135deg, var(--color-panel-1) 0%, var(--color-panel-0) 100%);
		border-radius: var(--radius-xl);
		border: 1px solid var(--color-border);
		overflow-x: auto;
	}

	.flow-step {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		min-width: 140px;
		flex: 1;
	}

	.step-icon {
		width: 56px;
		height: 56px;
		border-radius: var(--radius-full);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: var(--space-3);
		color: white;
	}

	.step-1 {
		background: linear-gradient(135deg, #6366f1, #8b5cf6);
	}
	.step-2 {
		background: linear-gradient(135deg, #f59e0b, #f97316);
	}
	.step-3 {
		background: linear-gradient(135deg, #10b981, #059669);
	}
	.step-4 {
		background: linear-gradient(135deg, #3b82f6, #2563eb);
	}

	.step-content h4 {
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-foreground);
		margin-bottom: var(--space-1);
	}

	.step-content p {
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		line-height: 1.4;
	}

	.flow-arrow {
		display: flex;
		align-items: center;
		color: var(--color-muted-foreground);
		padding-top: var(--space-4);
	}

	/* Concepts Grid */
	.concepts-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-4);
	}

	.concept-card {
		padding: var(--space-6);
		border-radius: var(--radius-xl);
		border: 1px solid var(--color-border);
		text-align: center;
		transition: all 0.2s ease;
	}

	.concept-card:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-lg);
	}

	.concept-member {
		background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.05));
		border-color: rgba(251, 191, 36, 0.3);
	}

	.concept-member .concept-icon {
		color: #f59e0b;
	}

	.concept-quota {
		background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05));
		border-color: rgba(16, 185, 129, 0.3);
	}

	.concept-quota .concept-icon {
		color: #10b981;
	}

	.concept-fee {
		background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.05));
		border-color: rgba(99, 102, 241, 0.3);
	}

	.concept-fee .concept-icon {
		color: #6366f1;
	}

	.concept-icon {
		margin-bottom: var(--space-3);
	}

	.concept-card h4 {
		font-size: var(--text-base);
		font-weight: 600;
		color: var(--color-foreground);
		margin-bottom: var(--space-2);
	}

	.concept-card p {
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
		line-height: 1.5;
	}

	@media (max-width: 1024px) {
		.flow-diagram {
			flex-direction: column;
			align-items: center;
		}

		.flow-arrow {
			transform: rotate(90deg);
			padding: var(--space-2) 0;
		}

		.flow-step {
			min-width: auto;
			width: 100%;
			max-width: 300px;
		}
	}

	@media (max-width: 768px) {
		.concepts-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
