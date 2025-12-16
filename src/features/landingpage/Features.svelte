<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import confetti from 'canvas-confetti';

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
		ScanSearch,
		Globe,
		TrendingUp,
		KeyRound,
		Rocket,
		Activity,
		Search,
		Image,
		Folder,
		Dices,
		ChevronDown,
		ChevronUp,
		X
	} from '@lucide/svelte';
	import ToolStatusBadge from '$lib/components/ui/tool-status-badge.svelte';
	import Dice3D from '$lib/components/ui/dice-3d.svelte';

	interface Tool {
		icon: typeof Wallet;
		title: string;
		description: string;
		link?: string;
		status: 'active' | 'coming-soon';
		color: string;
		features?: string[];
		stage?: 'coming-soon' | 'alpha' | 'beta' | 'stable' | 'new';
	}

	// Telegram group link
	const telegramGroupLink = 'https://t.me/+ABMpMG1islA4NTVl';

	// Tools data with full i18n - reactive to language changes
	const tools = $derived<Tool[]>([
		{
			icon: SendHorizontal,
			title: t('tools.token_distribution.title'),
			description: t('tools.token_distribution.description'),
			link: '/apps/token-distribution',
			status: 'active',
			color: '#F59E0B',
			features: ['Equal or Custom Amounts', 'CSV Import Ready', 'Real-time Preview'],
			stage: 'alpha'
		},
		{
			icon: ScanSearch,
			title: t('tools.token_balance_scanner.title'),
			description: t('tools.token_balance_scanner.description'),
			link: '/apps/token-balance-scanner',
			status: 'active',
			color: '#3B82F6',
			features: [
				t('tools.token_balance_scanner.feature_1'),
				t('tools.token_balance_scanner.feature_2'),
				t('tools.token_balance_scanner.feature_3'),
				t('tools.token_balance_scanner.feature_4')
			],
			stage: 'alpha'
		},
		{
			icon: ArrowRightLeft,
			title: t('tools.wallet_sweep.title'),
			description: t('tools.wallet_sweep.description'),
			link: '/apps/wallet-sweep',
			status: 'active',
			color: '#10B981',
			features: [
				i18n.t('tools.wallet_sweep.feature_1'),
				i18n.t('tools.wallet_sweep.feature_2'),
				i18n.t('tools.wallet_sweep.feature_3'),
				i18n.t('tools.wallet_sweep.feature_4')
			],
			stage: 'beta'
		},
		{
			icon: Sparkles,
			title: t('tools.token_deployer.title'),
			description: t('tools.token_deployer.description'),
			link: '/apps/token-deployer',
			status: 'active',
			color: '#10B981',
			features: ['Advanced Features', 'Tax & Anti-Bot', 'Instant Deploy'],
			stage: 'alpha'
		},
		{
			icon: Rocket,
			title: t('tools.contract_deployer.title'),
			description: t('tools.contract_deployer.description'),
			link: '/apps/contract-deployer',
			status: 'active',
			color: '#F59E0B',
			features: [
				t('tools.contract_deployer.feature_1'),
				t('tools.contract_deployer.feature_2'),
				t('tools.contract_deployer.feature_3')
			],
			stage: 'alpha'
		},
		{
			icon: Image,
			title: t('tools.nft_deployer.title'),
			description: t('tools.nft_deployer.description'),
			link: '/apps/nft-deployer',
			status: 'active',
			color: '#EC4899',
			features: [
				t('tools.nft_deployer.feature_1'),
				t('tools.nft_deployer.feature_2'),
				t('tools.nft_deployer.feature_3')
			],
			stage: 'alpha'
		},
		{
			icon: MessageCircle,
			title: t('tools.feedback_card.title'),
			description: t('tools.feedback_card.description'),
			link: telegramGroupLink,
			status: 'active',
			color: '#06B6D4',
			features: [
				t('tools.feedback_card.feature_1'),
				t('tools.feedback_card.feature_2'),
				t('tools.feedback_card.feature_3')
			]
		},
		{
			icon: Search,
			title: t('tools.contract_events_scanner.title'),
			description: t('tools.contract_events_scanner.description'),
			link: '/apps/contract-events-scanner',
			status: 'active',
			color: '#A855F7',
			features: [
				t('tools.contract_events_scanner.feature_1'),
				t('tools.contract_events_scanner.feature_2'),
				t('tools.contract_events_scanner.feature_3')
			],
			stage: 'alpha'
		},
		{
			icon: Zap,
			title: t('tools.call_master.title'),
			description: t('tools.call_master.description'),
			status: 'coming-soon',
			color: '#8B5CF6',
			features: [
				t('tools.call_master.feature_1'),
				t('tools.call_master.feature_2'),
				t('tools.call_master.feature_3')
			],
			stage: 'coming-soon'
		},
		{
			icon: Globe,
			title: t('tools.ens_scanner.title'),
			description: t('tools.ens_scanner.description'),
			link: '/apps/ens-scanner',
			status: 'active',
			color: '#EC4899',
			features: ['Pattern Generation', 'Expiry Tracking', 'Batch Scanning'],
			stage: 'alpha'
		},
		{
			icon: KeyRound,
			title: t('tools.wallet_generator.title'),
			description: t('tools.wallet_generator.description'),
			link: '/apps/wallet-generator',
			status: 'active',
			color: '#8B5CF6',
			features: ['HD Path Support', 'Multiple Chains', 'Export to CSV/JSON'],
			stage: 'alpha'
		},
		{
			icon: TrendingUp,
			title: t('tools.dex_moonshot_trader.title'),
			description: t('tools.dex_moonshot_trader.description'),
			link: '/apps/dex-moonshot-trader',
			status: 'active',
			color: '#EF4444',
			features: ['Buy & Sell Tokens', 'Adjustable Slippage', 'Multi-Chain Support'],
			stage: 'alpha'
		},

		{
			icon: Folder,
			title: 'NFT Manager',
			description: 'Manage your deployed NFT collections. View, mint, and interact with NFTs.',
			link: '/apps/nft-manager',
			status: 'active',
			color: '#A855F7',
			features: ['View NFT Collections', 'Owner & Stake Mint', 'Paginated Browsing'],
			stage: 'alpha'
		},
		{
			icon: Activity,
			title: t('tools.assets_monitor.title'),
			description: t('tools.assets_monitor.description'),
			link: '/apps/assets-monitor',
			status: 'active',
			color: '#06B6D4',
			features: [
				t('tools.assets_monitor.feature_1'),
				t('tools.assets_monitor.feature_2'),
				t('tools.assets_monitor.feature_3')
			],
			stage: 'alpha'
		}
	]);

	function joinTelegramGroup() {
		window.open(telegramGroupLink, '_blank');
	}

	// Show more/less state
	const INITIAL_VISIBLE_COUNT = 9;
	let showAll = $state(false);

	// Random tool discovery state
	let isShaking = $state(false);
	let showDice3D = $state(false);
	let showDiscoveryModal = $state(false);
	let discoveredTool = $state<Tool | null>(null);

	// Filter only active tools for random discovery
	const activeTools = $derived(tools.filter((tool) => tool.status === 'active' && tool.link));

	// Create custom confetti with high z-index
	let customConfetti: ReturnType<typeof confetti.create> | null = null;

	function getConfetti() {
		if (!customConfetti) {
			// Create a canvas for confetti with high z-index
			const canvas = document.createElement('canvas');
			canvas.style.position = 'fixed';
			canvas.style.inset = '0';
			canvas.style.width = '100%';
			canvas.style.height = '100%';
			canvas.style.pointerEvents = 'none';
			canvas.style.zIndex = '10000';
			document.body.appendChild(canvas);
			customConfetti = confetti.create(canvas, { resize: true, useWorker: true });
		}
		return customConfetti;
	}

	// Audio context for sound effects
	let audioContext: AudioContext | null = null;

	function getAudioContext() {
		if (!audioContext) {
			audioContext = new AudioContext();
		}
		return audioContext;
	}

	function playDiceRollSound() {
		try {
			const ctx = getAudioContext();
			const now = ctx.currentTime;

			// Create multiple short "click" sounds to simulate dice rolling
			for (let i = 0; i < 12; i++) {
				const osc = ctx.createOscillator();
				const gain = ctx.createGain();

				osc.connect(gain);
				gain.connect(ctx.destination);

				// Random frequency for each click
				osc.frequency.value = 200 + Math.random() * 400;
				osc.type = 'sine';

				// Fade in/out quickly
				const clickTime = now + i * 0.12 + Math.random() * 0.05;
				gain.gain.setValueAtTime(0, clickTime);
				gain.gain.linearRampToValueAtTime(0.12, clickTime + 0.01);
				gain.gain.exponentialRampToValueAtTime(0.01, clickTime + 0.08);

				osc.start(clickTime);
				osc.stop(clickTime + 0.1);
			}
		} catch {
			// Audio not supported, silently fail
		}
	}

	function playCelebrationSound() {
		try {
			const ctx = getAudioContext();
			const now = ctx.currentTime;

			// Victory fanfare - ascending notes
			const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

			notes.forEach((freq, i) => {
				const osc = ctx.createOscillator();
				const gain = ctx.createGain();

				osc.connect(gain);
				gain.connect(ctx.destination);

				osc.frequency.value = freq;
				osc.type = 'sine';

				const noteTime = now + i * 0.15;
				gain.gain.setValueAtTime(0, noteTime);
				gain.gain.linearRampToValueAtTime(0.15, noteTime + 0.05);
				gain.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.4);

				osc.start(noteTime);
				osc.stop(noteTime + 0.45);
			});

			// Add a shimmer effect
			for (let i = 0; i < 5; i++) {
				const osc = ctx.createOscillator();
				const gain = ctx.createGain();

				osc.connect(gain);
				gain.connect(ctx.destination);

				osc.frequency.value = 2000 + Math.random() * 2000;
				osc.type = 'sine';

				const shimmerTime = now + 0.5 + i * 0.1;
				gain.gain.setValueAtTime(0, shimmerTime);
				gain.gain.linearRampToValueAtTime(0.04, shimmerTime + 0.02);
				gain.gain.exponentialRampToValueAtTime(0.001, shimmerTime + 0.15);

				osc.start(shimmerTime);
				osc.stop(shimmerTime + 0.2);
			}
		} catch {
			// Audio not supported, silently fail
		}
	}

	function handleShake() {
		if (isShaking || showDice3D) return;

		isShaking = true;
		showDice3D = true;
		playDiceRollSound();
	}

	function onDiceComplete() {
		showDice3D = false;
		isShaking = false;

		// Pick a random active tool
		const randomIndex = Math.floor(Math.random() * activeTools.length);
		discoveredTool = activeTools[randomIndex];
		showDiscoveryModal = true;

		// Play celebration sound
		playCelebrationSound();

		const myConfetti = getConfetti();

		// Fire confetti with a burst effect
		myConfetti({
			particleCount: 100,
			spread: 70,
			origin: { x: 0.5, y: 0.5 },
			colors: ['#F59E0B', '#EC4899', '#8B5CF6', '#10B981', '#3B82F6'],
			startVelocity: 45,
			gravity: 1.2
		});

		// Side confetti streams
		const duration = 2500;
		const end = Date.now() + duration;

		const frame = () => {
			myConfetti({
				particleCount: 4,
				angle: 60,
				spread: 55,
				origin: { x: 0, y: 0.65 },
				colors: ['#F59E0B', '#EC4899', '#8B5CF6']
			});
			myConfetti({
				particleCount: 4,
				angle: 120,
				spread: 55,
				origin: { x: 1, y: 0.65 },
				colors: ['#10B981', '#3B82F6', '#8B5CF6']
			});

			if (Date.now() < end) {
				requestAnimationFrame(frame);
			}
		};

		frame();
	}

	function closeDiscoveryModal() {
		showDiscoveryModal = false;
		discoveredTool = null;
	}

	function goToDiscoveredTool() {
		if (discoveredTool?.link) {
			window.location.href = discoveredTool.link;
		}
	}

	function tryAgain() {
		closeDiscoveryModal();
		// Small delay before starting new dice roll
		setTimeout(() => {
			handleShake();
		}, 100);
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
					class="tool-card {tool.status === 'coming-soon' ? 'coming-soon' : ''}"
					class:visually-hidden={!showAll && index >= INITIAL_VISIBLE_COUNT}
					style="--index: {index}; --tool-color: {tool.color};"
					aria-hidden={!showAll && index >= INITIAL_VISIBLE_COUNT ? 'true' : undefined}
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
					{:else if tool.stage}
						<ToolStatusBadge status={tool.stage} />
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
						{#if tool.status === 'active' && tool.link}
							{#if tool.link === telegramGroupLink}
								<button class="action-btn telegram" onclick={joinTelegramGroup}>
									<MessageCircle class="btn-icon" />
									<span class="btn-text">{t('tools.join_telegram')}</span>
								</button>
							{:else}
								<a href={tool.link} class="action-btn primary">
									<span class="btn-text">{t('tools.launch_app')}</span>
									<ArrowRight class="btn-arrow" />
								</a>
							{/if}
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

		<!-- Show More / Show Less Button -->
		{#if tools.length > INITIAL_VISIBLE_COUNT}
			<div class="show-more-wrapper">
				<button class="show-more-btn" onclick={() => (showAll = !showAll)}>
					{#if showAll}
						<ChevronUp class="show-more-icon" />
						<span>{t('common.show_less')}</span>
					{:else}
						<ChevronDown class="show-more-icon" />
						<span>{t('common.show_more')} ({tools.length - INITIAL_VISIBLE_COUNT})</span>
					{/if}
				</button>
			</div>
		{/if}
	</div>

	<!-- Floating Shake Button -->
	<button
		class="shake-btn"
		class:shaking={isShaking}
		onclick={handleShake}
		title={t('tools.discover_random')}
		aria-label={t('tools.discover_random')}
	>
		<Dices class="shake-icon" />
	</button>

	<!-- Discovery Modal -->
	{#if showDiscoveryModal && discoveredTool}
		{@const DiscoveredIcon = discoveredTool.icon}
		<div class="discovery-overlay" onclick={closeDiscoveryModal} role="presentation">
			<div
				class="discovery-modal"
				onclick={(e) => e.stopPropagation()}
				role="dialog"
				aria-modal="true"
				style="--tool-color: {discoveredTool.color};"
			>
				<!-- Decorative elements -->
				<div class="modal-decoration modal-decoration-top-left"></div>
				<div class="modal-decoration modal-decoration-bottom-right"></div>

				<!-- Close button -->
				<button class="modal-close" onclick={closeDiscoveryModal} aria-label="Close">
					<X size={18} />
				</button>

				<div class="discovery-content">
					<!-- Animated badge -->
					<div class="discovery-badge">
						<div class="badge-sparkle"></div>
						<Sparkles size={14} />
						<span>{t('tools.you_discovered')}</span>
						<div class="badge-sparkle"></div>
					</div>

					<!-- Icon with animated glow -->
					<div class="discovery-icon-wrapper">
						<div class="discovery-icon-ring"></div>
						<div class="discovery-icon-glow"></div>
						<div class="discovery-icon-box">
							<DiscoveredIcon class="discovery-icon" />
						</div>
					</div>

					<!-- Tool info with gradient text -->
					<h3 class="discovery-title">{discoveredTool.title}</h3>
					<p class="discovery-description">{discoveredTool.description}</p>

					<!-- Feature tags -->
					{#if discoveredTool.features}
						<div class="discovery-features">
							{#each discoveredTool.features.slice(0, 3) as feature, i (feature)}
								<span class="discovery-feature" style="--delay: {i * 0.1}s">{feature}</span>
							{/each}
						</div>
					{/if}

					<!-- Action buttons -->
					<div class="discovery-actions">
						<button class="discovery-btn primary" onclick={goToDiscoveredTool}>
							<span>{t('tools.launch_app')}</span>
							<ArrowRight size={18} />
						</button>
						<button class="discovery-btn secondary" onclick={tryAgain}>
							<Dices size={18} />
							<span>{t('tools.try_again')}</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- 3D Dice Animation -->
	<Dice3D visible={showDice3D} onComplete={onDiceComplete} />
</section>

<style>
	/* Premium section with proper spacing */
	.tools-section {
		position: relative;
		padding: var(--space-16) var(--space-6);
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
		padding: var(--space-4) var(--space-5);
	}

	/* Header with proper spacing */
	.section-header {
		text-align: center;
		margin-bottom: var(--space-16);
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
		font-size: 2.25rem;
		font-weight: var(--font-bold);
		line-height: 1.2;
		margin-bottom: var(--space-6);
		letter-spacing: -0.02em;
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
		padding: 0 var(--space-4);
		font-size: 1.0625rem;
		line-height: 1.65;
		color: var(--color-description-3);
	}

	/* Grid with compact spacing - 3 columns */
	.tools-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: var(--space-6);
		padding: 0;
	}

	@media (max-width: 768px) {
		.container {
			padding: var(--space-3) var(--space-1);
		}
	}

	@media (min-width: 768px) {
		.tools-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: var(--space-8);
		}
	}

	@media (min-width: 1024px) {
		.tools-grid {
			grid-template-columns: repeat(3, 1fr);
			gap: var(--space-6);
		}
	}

	/* Card with proper layer hierarchy - more compact */
	.tool-card {
		position: relative;
		display: flex;
		flex-direction: column;
		padding: var(--space-8);
		border-radius: var(--radius-xl);
		transition: all 200ms ease;
		animation: fadeUp 0.5s calc(var(--index) * 0.08s) both;
		cursor: default;
		min-height: 380px;
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
		border-radius: var(--radius-xl);
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-2);
		z-index: 1;
		box-shadow:
			0 1px 3px 0 rgb(0 0 0 / 0.05),
			0 1px 2px -1px rgb(0 0 0 / 0.05);
		transition: all 200ms ease;
	}

	/* Light mode specific enhancements */
	:global(.light) .card-bg {
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-2);
		box-shadow:
			0 4px 6px -1px rgb(0 0 0 / 0.05),
			0 2px 4px -2px rgb(0 0 0 / 0.05);
	}

	.card-glow {
		position: absolute;
		inset: -1px;
		border-radius: var(--radius-xl);
		background: radial-gradient(circle at 50% 0%, var(--brand-100), transparent 70%);
		opacity: 0;
		transition: opacity 300ms ease;
	}

	.tool-card:hover .card-glow {
		opacity: 0.5;
	}

	.tool-card:hover {
		transform: translateY(-4px);
	}

	.tool-card:hover .card-bg {
		background: var(--color-panel-2);
		border-color: var(--color-panel-border-3);
		box-shadow:
			0 10px 15px -3px rgb(0 0 0 / 0.1),
			0 4px 6px -4px rgb(0 0 0 / 0.05);
	}

	:global(.light) .tool-card:hover .card-bg {
		background: var(--color-panel-3);
		border-color: var(--color-panel-border-3);
		box-shadow:
			0 12px 20px -5px rgb(0 0 0 / 0.08),
			0 6px 8px -4px rgb(0 0 0 / 0.04);
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

	/* Icon with clean design - more compact */
	.icon-wrapper {
		position: relative;
		width: 52px;
		height: 52px;
		margin-bottom: var(--space-6);
		z-index: 2;
	}

	.icon-glow {
		position: absolute;
		inset: -10px;
		background: radial-gradient(circle, var(--tool-color), transparent 60%);
		opacity: 0.15;
		filter: blur(10px);
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
		border-radius: var(--radius-md);
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
		width: 24px;
		height: 24px;
		color: white;
	}

	/* Content with proper text hierarchy - more compact */
	.content-wrapper {
		flex: 1;
		z-index: 2;
		display: flex;
		flex-direction: column;
	}

	.tool-title {
		margin-bottom: var(--space-3);
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--color-heading-1);
		line-height: 1.3;
	}

	.tool-description {
		margin-bottom: var(--space-5);
		font-size: var(--text-sm);
		line-height: 1.6;
		color: var(--color-description-3);
	}

	/* Feature pills with subtle styling - more compact */
	.features-list {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		margin-top: auto;
		margin-bottom: var(--space-5);
	}

	.feature-pill {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-1) var(--space-2);
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-full);
		font-size: 11px;
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

	/* Action button with clean design - more compact */
	.action-wrapper {
		padding-top: var(--space-4);
		border-top: 1px solid var(--color-panel-border-1);
		position: relative;
		z-index: 10;
	}

	:global(.light) .action-wrapper {
		border-top: 1px solid var(--color-panel-border-2);
	}

	.action-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		width: 100%;
		padding: var(--space-3) var(--space-5);
		border-radius: var(--radius-md);
		font-weight: var(--font-semibold);
		font-size: var(--text-sm);
		transition: all 200ms ease;
		text-decoration: none;
		position: relative;
		cursor: pointer;
		z-index: 10;
	}

	/* Dark mode - subtle default, vibrant on hover */
	.action-btn.primary {
		background: var(--color-panel-2);
		color: var(--color-text-primary);
		border: 1px solid var(--color-panel-border-2);
		box-shadow: none;
	}

	.action-btn.primary:hover {
		background: linear-gradient(
			135deg,
			var(--color-primary),
			color-mix(in srgb, var(--color-primary) 85%, black)
		);
		color: white;
		border-color: var(--color-primary);
		transform: translateY(-2px);
		box-shadow:
			0 8px 20px 0 color-mix(in srgb, var(--color-primary) 40%, transparent),
			0 2px 8px 0 color-mix(in srgb, var(--color-primary) 30%, transparent);
	}

	.action-btn.primary:active {
		transform: translateY(0);
		box-shadow:
			0 4px 12px 0 color-mix(in srgb, var(--color-primary) 30%, transparent),
			0 1px 4px 0 color-mix(in srgb, var(--color-primary) 20%, transparent);
	}

	/* Light mode - clean default, bold gradient on hover */
	:global(.light) .action-btn.primary {
		background: white;
		color: var(--color-text-primary);
		border: 1px solid var(--color-border);
		box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
	}

	:global(.light) .action-btn.primary:hover {
		background: linear-gradient(
			135deg,
			var(--color-primary),
			color-mix(in srgb, var(--color-primary) 90%, black)
		);
		color: white;
		border-color: var(--color-primary);
		box-shadow:
			0 8px 24px 0 color-mix(in srgb, var(--color-primary) 35%, transparent),
			0 4px 12px 0 color-mix(in srgb, var(--color-primary) 25%, transparent);
	}

	:global(.light) .action-btn.primary:active {
		box-shadow:
			0 4px 16px 0 color-mix(in srgb, var(--color-primary) 30%, transparent),
			0 2px 8px 0 color-mix(in srgb, var(--color-primary) 20%, transparent);
	}

	:global(.btn-text) {
		transition: all 200ms ease;
	}

	:global(.btn-arrow) {
		width: 18px;
		height: 18px;
		transition: all 200ms ease;
		flex-shrink: 0;
		opacity: 0.5;
	}

	.action-btn.primary:hover :global(.btn-text) {
		letter-spacing: 0.02em;
	}

	.action-btn.primary:hover :global(.btn-arrow) {
		transform: translateX(4px);
		opacity: 1;
	}

	.action-btn.primary:active :global(.btn-arrow) {
		transform: translateX(2px);
		opacity: 0.9;
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
		.tools-section {
			padding: var(--space-12) var(--space-5);
		}

		.section-header {
			margin-bottom: var(--space-12);
		}

		.section-title {
			font-size: 1.875rem;
			margin-bottom: var(--space-5);
		}

		.section-subtitle {
			font-size: 1rem;
			padding: 0 var(--space-2);
		}

		.tools-grid {
			grid-template-columns: 1fr;
			gap: var(--space-5);
		}

		.tool-card {
			padding: var(--space-7);
			min-height: 320px;
		}

		.icon-wrapper {
			width: 48px;
			height: 48px;
			margin-bottom: var(--space-5);
		}

		:global(.tool-icon) {
			width: 22px;
			height: 22px;
		}

		.tool-title {
			font-size: 1.0625rem;
			margin-bottom: var(--space-2);
		}

		.tool-description {
			font-size: 0.9375rem;
			margin-bottom: var(--space-4);
		}

		.feature-pill {
			font-size: 0.6875rem;
			padding: 0.1875rem var(--space-2);
		}

		.action-btn {
			padding: var(--space-3) var(--space-4);
			font-size: 0.9375rem;
		}
	}

	/* SEO-friendly hidden cards - content remains in DOM for crawlers */
	.tool-card.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	/* Show More Button */
	.show-more-wrapper {
		display: flex;
		justify-content: center;
		margin-top: var(--space-10);
	}

	.show-more-btn {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-6);
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-full);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-text-secondary);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.show-more-btn:hover {
		background: var(--color-panel-3);
		border-color: var(--color-primary);
		color: var(--color-primary);
		transform: translateY(-2px);
	}

	:global(.show-more-icon) {
		width: 18px;
		height: 18px;
	}

	/* Floating Shake Button */
	.shake-btn {
		position: fixed;
		right: var(--space-6);
		bottom: var(--space-24);
		width: 64px;
		height: 64px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #f59e0b, #ec4899, #8b5cf6);
		background-size: 200% 200%;
		border: none;
		border-radius: 16px;
		color: white;
		cursor: pointer;
		box-shadow:
			0 8px 32px rgba(139, 92, 246, 0.5),
			0 4px 16px rgba(236, 72, 153, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.2);
		transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
		z-index: 100;
		transform-style: preserve-3d;
		perspective: 1000px;
		animation:
			gradientShift 3s ease infinite,
			floatIdle 2s ease-in-out infinite;
	}

	@keyframes gradientShift {
		0%,
		100% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
	}

	@keyframes floatIdle {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-4px);
		}
	}

	.shake-btn:hover {
		transform: scale(1.15) translateY(-2px);
		box-shadow:
			0 12px 40px rgba(139, 92, 246, 0.6),
			0 6px 20px rgba(236, 72, 153, 0.4),
			inset 0 1px 0 rgba(255, 255, 255, 0.3);
		animation: gradientShift 1.5s ease infinite;
	}

	.shake-btn.shaking {
		animation: diceRoll3D 0.8s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
	}

	@keyframes diceRoll3D {
		0% {
			transform: perspective(600px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1);
		}
		10% {
			transform: perspective(600px) rotateX(45deg) rotateY(-30deg) rotateZ(15deg) scale(1.1)
				translateY(-20px);
		}
		25% {
			transform: perspective(600px) rotateX(-30deg) rotateY(60deg) rotateZ(-20deg) scale(1.2)
				translateY(-30px);
		}
		40% {
			transform: perspective(600px) rotateX(60deg) rotateY(-45deg) rotateZ(30deg) scale(1.15)
				translateY(-25px);
		}
		55% {
			transform: perspective(600px) rotateX(-45deg) rotateY(30deg) rotateZ(-15deg) scale(1.1)
				translateY(-15px);
		}
		70% {
			transform: perspective(600px) rotateX(30deg) rotateY(-20deg) rotateZ(10deg) scale(1.05)
				translateY(-8px);
		}
		85% {
			transform: perspective(600px) rotateX(-15deg) rotateY(10deg) rotateZ(-5deg) scale(1.02)
				translateY(-3px);
		}
		100% {
			transform: perspective(600px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1) translateY(0);
		}
	}

	:global(.shake-icon) {
		width: 32px;
		height: 32px;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
		transition: transform 0.3s ease;
	}

	.shake-btn:hover :global(.shake-icon) {
		transform: rotate(15deg);
	}

	.shake-btn.shaking :global(.shake-icon) {
		animation: iconSpin 0.8s ease-in-out;
	}

	@keyframes iconSpin {
		0% {
			transform: rotate(0deg);
		}
		25% {
			transform: rotate(180deg) scale(1.2);
		}
		50% {
			transform: rotate(360deg);
		}
		75% {
			transform: rotate(540deg) scale(0.9);
		}
		100% {
			transform: rotate(720deg);
		}
	}

	/* Discovery Modal Overlay */
	.discovery-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(8px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		animation: fadeIn 0.3s ease;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	/* Discovery Modal */
	.discovery-modal {
		position: relative;
		width: 90%;
		max-width: 420px;
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-xl);
		padding: var(--space-8);
		animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
		box-shadow:
			0 25px 50px -12px rgba(0, 0, 0, 0.25),
			0 0 0 1px rgba(255, 255, 255, 0.05);
	}

	@keyframes popIn {
		from {
			opacity: 0;
			transform: scale(0.9) translateY(20px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	.modal-close {
		position: absolute;
		top: var(--space-4);
		right: var(--space-4);
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-md);
		color: var(--color-text-secondary);
		cursor: pointer;
		transition: all 0.2s;
	}

	.modal-close:hover {
		background: var(--color-panel-3);
		color: var(--color-text-primary);
	}

	.discovery-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.discovery-badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(236, 72, 153, 0.2));
		border: 1px solid rgba(245, 158, 11, 0.3);
		border-radius: var(--radius-full);
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		color: #f59e0b;
		margin-bottom: var(--space-6);
		animation: pulse 2s infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.7;
		}
	}

	.discovery-icon-wrapper {
		position: relative;
		width: 80px;
		height: 80px;
		margin-bottom: var(--space-6);
	}

	.discovery-icon-glow {
		position: absolute;
		inset: -20px;
		background: radial-gradient(circle, var(--tool-color), transparent 60%);
		opacity: 0.3;
		filter: blur(20px);
		animation: glowPulse 2s infinite;
	}

	@keyframes glowPulse {
		0%,
		100% {
			opacity: 0.3;
			transform: scale(1);
		}
		50% {
			opacity: 0.5;
			transform: scale(1.1);
		}
	}

	.discovery-icon-box {
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
		box-shadow:
			0 10px 40px color-mix(in srgb, var(--tool-color) 40%, transparent),
			0 4px 12px rgba(0, 0, 0, 0.2);
	}

	:global(.discovery-icon) {
		width: 40px;
		height: 40px;
		color: white;
	}

	.discovery-title {
		font-size: var(--text-xl);
		font-weight: var(--font-bold);
		color: var(--color-heading-1);
		margin-bottom: var(--space-3);
	}

	.discovery-description {
		font-size: var(--text-sm);
		color: var(--color-description-3);
		line-height: 1.6;
		margin-bottom: var(--space-5);
		max-width: 320px;
	}

	.discovery-features {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: var(--space-2);
		margin-bottom: var(--space-6);
	}

	.discovery-feature {
		padding: var(--space-1) var(--space-3);
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-full);
		font-size: 11px;
		color: var(--color-description-2);
	}

	.discovery-actions {
		display: flex;
		gap: var(--space-3);
		width: 100%;
	}

	.discovery-btn {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-4);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.2s;
	}

	.discovery-btn.primary {
		background: linear-gradient(135deg, var(--color-primary), #8b5cf6);
		border: none;
		color: white;
		box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
	}

	.discovery-btn.primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
	}

	.discovery-btn.secondary {
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-2);
		color: var(--color-text-secondary);
	}

	.discovery-btn.secondary:hover {
		background: var(--color-panel-3);
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	/* Mobile adjustments for shake button */
	@media (max-width: 768px) {
		.shake-btn {
			right: var(--space-4);
			bottom: var(--space-20);
			width: 56px;
			height: 56px;
			border-radius: 14px;
		}

		:global(.shake-icon) {
			width: 28px;
			height: 28px;
		}

		.discovery-modal {
			padding: var(--space-6);
		}

		.discovery-icon-wrapper {
			width: 64px;
			height: 64px;
		}

		:global(.discovery-icon) {
			width: 32px;
			height: 32px;
		}

		.discovery-actions {
			flex-direction: column;
		}
	}
</style>
