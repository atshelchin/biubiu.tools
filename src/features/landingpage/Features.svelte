<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';

	const i18n = useI18n();
	const t = i18n.t;
	import {
		Wallet,
		Zap,
		Sparkles,
		ArrowRight,
		Lock,
		MessageCircle,
		ArrowRightLeft,
		SendHorizontal,
		ScanSearch
	} from '@lucide/svelte';

	interface Tool {
		icon: typeof Wallet;
		title: string;
		description: string;
		link?: string;
		status: 'active' | 'coming-soon';
		color: string;
		features?: string[];
		highlight?: boolean;
		alpha?: boolean;
	}

	// Tools data with full i18n - reactive to language changes
	const tools = $derived<Tool[]>([
		{
			icon: ArrowRightLeft,
			title: t('tools.token_sweep.title'),
			description: t('tools.token_sweep.description'),
			link: '/apps/token-sweep',
			status: 'active',
			color: '#10B981',
			features: ['Multi-chain Support', 'Batch Processing', 'Gas Optimized'],
			highlight: true,
			alpha: true
		},
		{
			icon: SendHorizontal,
			title: t('tools.token_distribution.title'),
			description: t('tools.token_distribution.description'),
			link: '/apps/token-distribution',
			status: 'active',
			color: '#F59E0B',
			features: ['Equal or Custom Amounts', 'CSV Import Ready', 'Real-time Preview'],
			highlight: false,
			alpha: true
		},
		{
			icon: ScanSearch,
			title: t('tools.token_balance_scanner.title'),
			description: t('tools.token_balance_scanner.description'),
			link: '/apps/token-balance-scanner',
			status: 'active',
			color: '#3B82F6',
			features: ['Multi-Wallet Scanning', 'CSV/JSON Export', 'Read-only Operations'],
			highlight: false,
			alpha: true
		},
		{
			icon: Zap,
			title: t('tools.call_master.title'),
			description: t('tools.call_master.description'),
			link: '/apps/call-master',
			status: 'active',
			color: '#8B5CF6',
			features: [
				t('tools.call_master.feature_1'),
				t('tools.call_master.feature_2'),
				t('tools.call_master.feature_3')
			],
			highlight: false,
			alpha: false
		}
	]);

	// Telegram group link
	const telegramGroupLink = 'https://t.me/+ABMpMG1islA4NTVl';

	function joinTelegramGroup() {
		window.open(telegramGroupLink, '_blank');
	}
</script>

<!-- Premium Tools Section -->
<section id="tools" class="tools-section">
	<!-- Animated background -->
	<!-- <div class="bg-pattern"></div> -->
	<div class="bg-gradient"></div>

	<div class="container">
		<!-- Premium header -->
		<div class="section-header">
			<div class="badge-wrapper">
				<div class="badge-glow"></div>
				<div class="badge">
					<Sparkles class="badge-icon" />
					<span>{t('tools.badge')}</span>
				</div>
			</div>

			<h2 class="section-title">
				<span class="title-line">{t('tools.section_title')}</span>
			</h2>

			<p class="section-subtitle">
				{t('tools.section_subtitle')}
			</p>
		</div>

		<!-- Premium cards grid -->
		<div class="tools-grid">
			{#each tools as tool, index (index)}
				{@const Icon = tool.icon}
				<article
					class="tool-card {tool.highlight ? 'highlighted' : ''} {tool.status === 'coming-soon'
						? 'coming-soon'
						: ''}"
					style="--index: {index}; --tool-color: {tool.color};"
				>
					<!-- Card glow effect -->
					<div class="card-glow"></div>

					<!-- Glass morphism background -->
					<div class="card-bg"></div>

					{#if tool.status === 'coming-soon'}
						<div class="status-ribbon">
							<Lock class="ribbon-icon" />
							<span>{t('tools.coming_soon')}</span>
						</div>
					{/if}

					{#if tool.highlight}
						<div class="highlight-badge">{t('tools.available_now')}</div>
					{/if}

					{#if tool.alpha}
						<div class="alpha-badge">Alpha</div>
					{/if}

					<!-- Premium icon with animation -->
					<div class="icon-wrapper">
						<div class="icon-glow"></div>
						<div class="icon-box">
							<Icon class="tool-icon" />
						</div>
					</div>

					<!-- Content with better typography -->
					<div class="content-wrapper">
						<h3 class="tool-title">{tool.title}</h3>
						<p class="tool-description">{tool.description}</p>

						<!-- Premium feature pills -->
						{#if tool.features}
							<div class="features-list">
								{#each tool.features as feature (feature)}
									<div class="feature-pill">
										<span class="pill-dot"></span>
										<span>{feature}</span>
									</div>
								{/each}
							</div>
						{/if}
					</div>

					<!-- Premium action button -->
					<div class="action-wrapper">
						{#if tool.status === 'active'}
							<a href={tool.link} class="action-btn primary">
								<span class="btn-text">{t('tools.launch_app')}</span>
								<ArrowRight class="btn-arrow" />
							</a>
						{:else}
							<button class="action-btn telegram" onclick={joinTelegramGroup}>
								<MessageCircle class="btn-icon" />
								<span class="btn-text">{t('tools.join_telegram')}</span>
							</button>
						{/if}
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	/* Premium section with proper spacing */
	.tools-section {
		position: relative;
		padding: var(--space-20) var(--space-6);
		background: var(--color-background);
		overflow: hidden;
	}

	/* Subtle background gradient */
	.bg-gradient {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			180deg,
			var(--color-background),
			var(--color-panel-1) 50%,
			var(--color-background)
		);
		opacity: 0.3;
	}

	:global(.light) .tools-section {
		background: var(--color-panel-1);
	}

	.container {
		position: relative;
		max-width: 80rem;
		margin: 0 auto;
		width: 100%;
		z-index: 1;
	}

	/* Header with proper spacing */
	.section-header {
		text-align: center;
		margin-bottom: var(--space-24);
	}

	.badge-wrapper {
		position: relative;
		display: inline-block;
		margin-bottom: var(--space-8);
	}

	.badge-glow {
		position: absolute;
		inset: -8px;
		background: var(--color-brand-primary);
		border-radius: var(--radius-full);
		filter: blur(16px);
		opacity: 0.1;
	}

	.badge {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		border-radius: var(--radius-full);
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-2);
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		color: var(--color-description-2);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	:global(.badge-icon) {
		width: 0.875rem;
		height: 0.875rem;
		color: var(--color-primary);
	}

	/* Title with strong to weak gradient */
	.section-title {
		font-size: var(--text-5xl);
		font-weight: var(--font-bold);
		line-height: 1.2;
		margin-bottom: var(--space-8);
		letter-spacing: -0.01em;
	}

	.title-line {
		background: linear-gradient(
			to right,
			var(--color-heading-1) 0%,
			var(--color-heading-1) 30%,
			var(--color-heading-3) 70%,
			var(--color-heading-4) 100%
		);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.section-subtitle {
		max-width: 40rem;
		margin: 0 auto;
		font-size: var(--text-lg);
		line-height: 1.7;
		color: var(--color-description-3);
	}

	/* Grid with generous spacing */
	.tools-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
		gap: var(--space-12);
		padding: 0;
	}

	@media (min-width: 1024px) {
		.tools-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: var(--space-16);
		}
	}

	/* Card with proper layer hierarchy */
	.tool-card {
		position: relative;
		display: flex;
		flex-direction: column;
		padding: var(--space-12);
		border-radius: var(--radius-2xl);
		transition: all 200ms ease;
		animation: fadeUp 0.5s calc(var(--index) * 0.08s) both;
		cursor: default;
		min-height: 460px;
	}

	@keyframes fadeUp {
		from {
			opacity: 0;
			transform: translateY(24px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Card background with panel hierarchy */
	.card-bg {
		position: absolute;
		inset: 0;
		border-radius: var(--radius-2xl);
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-2);
		z-index: 1;
		box-shadow:
			0 4px 6px -1px rgb(0 0 0 / 0.05),
			0 2px 4px -2px rgb(0 0 0 / 0.05);
		transition: all 200ms ease;
	}

	/* Light mode specific enhancements */
	:global(.light) .card-bg {
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-2);
		box-shadow:
			0 10px 15px -3px rgb(0 0 0 / 0.08),
			0 4px 6px -4px rgb(0 0 0 / 0.05);
	}

	.card-glow {
		position: absolute;
		inset: -1px;
		border-radius: var(--radius-2xl);
		background: radial-gradient(circle at 50% 0%, var(--brand-100), transparent 70%);
		opacity: 0;
		transition: opacity 200ms ease;
	}

	.tool-card:hover .card-glow {
		opacity: 1;
	}

	.tool-card:hover {
		transform: translateY(-6px);
	}

	.tool-card:hover .card-bg {
		background: var(--color-panel-2);
		border-color: var(--color-panel-border-3);
		box-shadow: var(--shadow-lg);
	}

	:global(.light) .tool-card:hover .card-bg {
		background: var(--color-panel-3);
		border-color: var(--color-panel-border-3);
		box-shadow:
			0 20px 25px -5px rgb(0 0 0 / 0.1),
			0 8px 10px -6px rgb(0 0 0 / 0.05);
	}

	/* Highlighted card with subtle accent */
	.tool-card.highlighted .card-bg {
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-3);
		box-shadow: var(--shadow-md);
	}

	:global(.light) .tool-card.highlighted .card-bg {
		background: var(--color-panel-3);
		border: 2px solid var(--color-primary);
		box-shadow:
			0 10px 40px -10px color-mix(in srgb, var(--color-primary) 20%, transparent),
			0 4px 6px -4px rgb(0 0 0 / 0.1);
	}

	.highlight-badge {
		position: absolute;
		top: var(--space-6);
		right: var(--space-6);
		padding: var(--space-1) var(--space-3);
		background: var(--color-panel-accent);
		color: var(--color-success);
		font-size: 10px;
		font-weight: var(--font-semibold);
		border-radius: var(--radius-md);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		z-index: 10;
	}

	:global(.light) .highlight-badge {
		background: var(--color-success);
		color: white;
		box-shadow: 0 2px 8px -2px color-mix(in srgb, var(--color-success) 50%, transparent);
	}

	/* Alpha badge */
	.alpha-badge {
		position: absolute;
		top: var(--space-3);
		left: var(--space-3);
		padding: var(--space-1) var(--space-3);
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		font-size: 10px;
		font-weight: var(--font-bold);
		border-radius: var(--radius-md);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		z-index: 10;
		box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
	}

	:global(.light) .alpha-badge {
		box-shadow: 0 2px 8px rgba(102, 126, 234, 0.5);
	}

	/* Coming soon ribbon */
	.status-ribbon {
		position: absolute;
		top: var(--space-6);
		right: var(--space-6);
		display: flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-1) var(--space-3);
		background: var(--color-panel-muted);
		border-radius: var(--radius-md);
		color: var(--color-warning);
		font-size: 10px;
		font-weight: var(--font-semibold);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		z-index: 10;
	}

	:global(.ribbon-icon) {
		width: 12px;
		height: 12px;
	}

	.tool-card.coming-soon {
		opacity: 0.8;
	}

	.tool-card.coming-soon:hover {
		transform: translateY(-3px);
	}

	/* Icon with clean design */
	.icon-wrapper {
		position: relative;
		width: 64px;
		height: 64px;
		margin-bottom: var(--space-10);
		z-index: 2;
	}

	.icon-glow {
		position: absolute;
		inset: -12px;
		background: radial-gradient(circle, var(--tool-color), transparent 60%);
		opacity: 0.15;
		filter: blur(12px);
	}

	.icon-box {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(
			135deg,
			var(--tool-color),
			color-mix(in srgb, var(--tool-color) 80%, black)
		);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-md);
		transition: all 200ms ease;
	}

	:global(.light) .icon-box {
		box-shadow:
			0 4px 14px 0 color-mix(in srgb, var(--tool-color) 30%, transparent),
			0 2px 4px 0 color-mix(in srgb, var(--tool-color) 20%, transparent),
			inset 0 1px 0 0 rgb(255 255 255 / 0.2);
	}

	.tool-card:hover .icon-box {
		transform: translateY(-2px) scale(1.05);
		box-shadow: var(--shadow-lg);
	}

	:global(.tool-icon) {
		width: 28px;
		height: 28px;
		color: white;
	}

	/* Content with proper text hierarchy */
	.content-wrapper {
		flex: 1;
		z-index: 2;
		display: flex;
		flex-direction: column;
	}

	.tool-title {
		margin-bottom: var(--space-4);
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		color: var(--color-heading-1);
		line-height: 1.3;
	}

	.tool-description {
		margin-bottom: var(--space-8);
		font-size: var(--text-base);
		line-height: 1.7;
		color: var(--color-description-3);
	}

	/* Feature pills with subtle styling */
	.features-list {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		margin-top: auto;
		margin-bottom: var(--space-8);
	}

	.feature-pill {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-full);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		color: var(--color-description-2);
		transition: all 150ms ease;
	}

	:global(.light) .feature-pill {
		background: var(--color-background);
		border: 1px solid var(--color-panel-border-2);
		color: var(--color-description-2);
	}

	.pill-dot {
		width: 4px;
		height: 4px;
		background: var(--tool-color);
		border-radius: 50%;
		opacity: 0.7;
	}

	.tool-card:hover .feature-pill {
		background: var(--color-panel-2);
		border-color: var(--color-panel-border-2);
		color: var(--color-description-1);
	}

	:global(.light) .tool-card:hover .feature-pill {
		background: var(--color-panel-1);
		border-color: var(--color-panel-border-3);
		color: var(--color-heading-3);
	}

	/* Action button with clean design */
	.action-wrapper {
		padding-top: var(--space-6);
		border-top: 1px solid var(--color-panel-border-1);
		z-index: 2;
	}

	:global(.light) .action-wrapper {
		border-top: 1px solid var(--color-panel-border-2);
	}

	.action-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-3);
		width: 100%;
		padding: var(--space-4) var(--space-6);
		border-radius: var(--radius-md);
		font-weight: var(--font-medium);
		font-size: var(--text-base);
		transition: all 150ms ease;
		text-decoration: none;
		position: relative;
	}

	.action-btn.primary {
		background: var(--color-panel-3);
		color: var(--color-primary);
		border: 1px solid var(--color-panel-border-3);
		box-shadow: none;
		font-weight: var(--font-semibold);
	}

	:global(.light) .action-btn.primary {
		background: var(--color-primary);
		color: white;
		border: 1px solid var(--color-primary);
		box-shadow:
			0 1px 3px 0 rgb(0 0 0 / 0.1),
			0 1px 2px -1px rgb(0 0 0 / 0.1);
	}

	.action-btn.primary:hover {
		background: var(--color-panel-4);
		border-color: var(--color-primary);
		color: var(--color-primary);
		transform: translateY(-1px);
		box-shadow: 0 0 0 1px var(--color-primary);
	}

	:global(.light) .action-btn.primary:hover {
		background: var(--brand-700);
		border-color: var(--brand-700);
		color: white;
		box-shadow:
			0 4px 6px -1px rgb(0 0 0 / 0.1),
			0 2px 4px -2px rgb(0 0 0 / 0.1);
	}

	:global(.btn-arrow) {
		width: 16px;
		height: 16px;
		transition: transform 150ms ease;
	}

	.action-btn.primary:hover :global(.btn-arrow) {
		transform: translateX(3px);
	}

	.action-btn.telegram {
		background: linear-gradient(135deg, #229ed9, #2aabee);
		color: white;
		border: none;
		cursor: pointer;
		box-shadow: var(--shadow-sm);
	}

	.action-btn.telegram:hover {
		background: linear-gradient(135deg, #1e8cc7, #2498d5);
		transform: translateY(-1px);
		box-shadow: var(--shadow-md);
	}

	:global(.btn-icon) {
		width: 18px;
		height: 18px;
	}

	/* Responsive with proper spacing */
	@media (min-width: 768px) {
		.tools-section {
			padding: var(--space-24) var(--space-12);
		}

		.section-title {
			font-size: var(--text-6xl);
		}

		.section-header {
			margin-bottom: var(--space-20);
		}
	}

	@media (max-width: 768px) {
		.tools-grid {
			grid-template-columns: 1fr;
			gap: var(--space-8);
		}

		.tool-card {
			padding: var(--space-8);
		}
	}
</style>
