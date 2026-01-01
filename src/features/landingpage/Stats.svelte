<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { useI18n } from '@shelchin/i18n';
	import { RefreshCw, Users, Zap, Globe, TrendingUp } from '@lucide/svelte';
	import { useStatsStore } from './stats/stats-store.svelte';

	const i18n = useI18n();
	const t = i18n.t.bind(i18n);

	const store = useStatsStore();

	// Animation state
	let isVisible = $state(false);
	let animatedPremium = $state(0);
	let animatedUsage = $state(0);
	let animatedNetworks = $state(0);

	// Sort mode: 'members' or 'usage'
	type SortMode = 'members' | 'usage';
	let sortMode = $state<SortMode>('usage');

	// Animate numbers when visible
	function animateNumbers() {
		if (!isVisible) return;

		const targetPremium = Number(store.stats.totalPremiumSubscribers);
		const targetUsage = Number(store.stats.totalToolUsage);
		const targetNetworks = store.stats.activeNetworks;

		const duration = 1500;
		const startTime = Date.now();

		function update() {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const easeOut = 1 - Math.pow(1 - progress, 3);

			animatedPremium = Math.floor(targetPremium * easeOut);
			animatedUsage = Math.floor(targetUsage * easeOut);
			animatedNetworks = Math.floor(targetNetworks * easeOut);

			if (progress < 1) {
				requestAnimationFrame(update);
			}
		}

		update();
	}

	// Re-animate when stats change
	$effect(() => {
		if (store.stats.lastUpdated > 0 && isVisible) {
			animateNumbers();
		}
	});

	// Intersection observer for triggering animation
	onMount(() => {
		// Start demo activity immediately for preview
		isVisible = true;
		animateNumbers();

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !isVisible) {
						isVisible = true;
						store.loadStats();
					}
				});
			},
			{ threshold: 0.2 }
		);

		const section = document.querySelector('#stats-section');
		if (section) observer.observe(section);

		return () => observer.disconnect();
	});

	onDestroy(() => {
		store.cleanup();
	});

	// Format numbers for display
	function formatNumber(value: number): string {
		if (value >= 1_000_000) {
			return `${(value / 1_000_000).toFixed(1)}M`;
		}
		if (value >= 1_000) {
			return `${(value / 1_000).toFixed(1)}K`;
		}
		return value.toLocaleString();
	}

	// Calculate cooldown seconds remaining
	let cooldownSeconds = $state(0);
	let cooldownInterval: ReturnType<typeof setInterval> | null = null;

	$effect(() => {
		if (store.refreshCooldown && !cooldownInterval) {
			cooldownSeconds = 30;
			cooldownInterval = setInterval(() => {
				cooldownSeconds--;
				if (cooldownSeconds <= 0 && cooldownInterval) {
					clearInterval(cooldownInterval);
					cooldownInterval = null;
				}
			}, 1000);
		}
	});
</script>

<!-- Stats section -->
<section id="stats-section" class="stats-section">
	<!-- Background effects -->
	<div class="bg-gradient"></div>
	<div class="bg-grid"></div>

	<!-- Floating orbs -->
	<div class="orb orb-1"></div>
	<div class="orb orb-2"></div>
	<div class="orb orb-3"></div>

	<div class="container">
		<!-- Section header -->
		<div class="section-header">
			<h2 class="section-title">
				{t('common.stats.title')}
			</h2>
			<p class="section-subtitle">
				{t('common.stats.subtitle')}
			</p>
			<p class="demo-notice">
				{t('common.stats.demo_notice')}
			</p>

			<!-- Refresh button -->
			<button
				class="refresh-btn"
				onclick={() => store.refreshStats()}
				disabled={store.refreshCooldown || store.stats.isLoading}
			>
				<RefreshCw size={16} class={store.stats.isLoading ? 'spin' : ''} />
				{#if store.stats.isLoading}
					{t('common.stats.refreshing')}
				{:else if store.refreshCooldown}
					{t('common.stats.cooldown', { seconds: cooldownSeconds.toString() })}
				{:else}
					{t('common.stats.refresh')}
				{/if}
			</button>
		</div>

		<!-- Loading indicator -->
		{#if store.stats.isLoading && store.loadingProgress.total > 0}
			<div class="loading-bar">
				<div
					class="loading-progress"
					style="width: {(store.loadingProgress.completed / store.loadingProgress.total) * 100}%"
				></div>
				<span class="loading-text">
					{t('common.stats.loading_chains', {
						completed: store.loadingProgress.completed.toString(),
						total: store.loadingProgress.total.toString()
					})}
				</span>
			</div>
		{/if}

		<!-- Main stats cards -->
		<div class="stats-grid">
			<!-- Premium Subscribers -->
			<div class="stat-card premium-card">
				<div class="stat-icon">
					<Users size={28} />
				</div>
				<div class="stat-content">
					<div class="stat-value">
						{#if store.stats.isLoading && store.stats.lastUpdated === 0}
							<span class="skeleton">---</span>
						{:else}
							{formatNumber(animatedPremium)}
						{/if}
					</div>
					<div class="stat-label">{t('common.stats.premium_subscribers')}</div>
				</div>
				<div class="stat-glow"></div>
			</div>

			<!-- Tool Usage -->
			<div class="stat-card usage-card">
				<div class="stat-icon">
					<Zap size={28} />
				</div>
				<div class="stat-content">
					<div class="stat-value">
						{#if store.stats.isLoading && store.stats.lastUpdated === 0}
							<span class="skeleton">---</span>
						{:else}
							{formatNumber(animatedUsage)}
						{/if}
					</div>
					<div class="stat-label">{t('common.stats.tool_usage')}</div>
				</div>
				<div class="stat-glow"></div>
			</div>

			<!-- Active Networks -->
			<div class="stat-card networks-card">
				<div class="stat-icon">
					<Globe size={28} />
				</div>
				<div class="stat-content">
					<div class="stat-value">
						{#if store.stats.isLoading && store.stats.lastUpdated === 0}
							<span class="skeleton">---</span>
						{:else}
							{animatedNetworks}
						{/if}
					</div>
					<div class="stat-label">{t('common.stats.active_networks')}</div>
				</div>
				<div class="stat-hint">{t('common.stats.networks_hint')}</div>
				<div class="stat-glow"></div>
			</div>
		</div>

		<!-- Live Activity & Top Networks -->
		<div class="details-grid">
			<!-- Live Activity Feed -->
			<div class="activity-panel">
				<div class="panel-header">
					<span class="live-indicator"></span>
					<h3>{t('common.stats.live_activity')}</h3>
				</div>
				<div class="activity-list">
					{#if store.activityEvents.length === 0}
						<div class="no-activity">
							{t('common.stats.no_activity')}
						</div>
					{:else}
						{#each store.activityEvents as event (event.id)}
							{@const display = store.getEventDisplay(event.type)}
							<div class="activity-item">
								<span class="activity-icon">{display.icon}</span>
								<div class="activity-details">
									<span class="activity-label">{t(`common.stats.activity.${event.type}`)}</span>
									<span class="activity-chain"
										>{t('common.stats.activity.on_chain', { chain: event.chainName })}</span
									>
								</div>
								<span class="activity-time">{store.getRelativeTime(event.timestamp)}</span>
							</div>
						{/each}
					{/if}
				</div>
			</div>

			<!-- Top Networks -->
			<div class="networks-panel">
				<div class="panel-header">
					<TrendingUp size={18} />
					<h3>{t('common.stats.top_networks')}</h3>
					<div class="sort-toggle">
						<button
							class="sort-btn"
							class:active={sortMode === 'members'}
							onclick={() => (sortMode = 'members')}
						>
							{t('common.stats.sort_by_members')}
						</button>
						<button
							class="sort-btn"
							class:active={sortMode === 'usage'}
							onclick={() => (sortMode = 'usage')}
						>
							{t('common.stats.sort_by_usage')}
						</button>
					</div>
				</div>
				<div class="networks-list">
					{#if store.stats.topNetworks.length === 0}
						<div class="no-networks">
							{t('common.stats.no_contracts')}
						</div>
					{:else}
						{@const sortedNetworks = [...store.stats.topNetworks].sort((a, b) =>
							sortMode === 'members'
								? Number(b.biubiuPremium.totalSupply - a.biubiuPremium.totalSupply)
								: Number(b.totalToolUsage - a.totalToolUsage)
						)}
						{#each sortedNetworks.slice(0, 8) as network, index (network.chainId)}
							{@const maxValue =
								sortMode === 'members'
									? Number(sortedNetworks[0]?.biubiuPremium.totalSupply || 1n)
									: Number(sortedNetworks[0]?.totalToolUsage || 1n)}
							{@const currentValue =
								sortMode === 'members'
									? Number(network.biubiuPremium.totalSupply)
									: Number(network.totalToolUsage)}
							{@const percentage = (currentValue / maxValue) * 100}
							<div class="network-item">
								<div class="network-rank">#{index + 1}</div>
								<div class="network-info">
									<span class="network-name">{network.chainName}</span>
								</div>
								<div class="network-stats">
									<span class="network-stat" title={t('common.stats.premium_subscribers')}>
										<span class="stat-icon-mini">👤</span>
										{store.formatStatNumber(network.biubiuPremium.totalSupply)}
									</span>
									<span class="network-stat" title={t('common.stats.tool_usage')}>
										<span class="stat-icon-mini">⚡</span>
										{store.formatStatNumber(network.totalToolUsage)}
									</span>
								</div>
								<div class="network-bar-container">
									<div class="network-bar" style="width: {percentage}%"></div>
								</div>
							</div>
						{/each}
					{/if}
				</div>
			</div>
		</div>

		<!-- Trust badge -->
		<div class="trust-badge">
			<svg class="check-icon" fill="currentColor" viewBox="0 0 20 20">
				<path
					fill-rule="evenodd"
					d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
					clip-rule="evenodd"
				/>
			</svg>
			<span>{t('common.stats.last_updated')}</span>
		</div>
	</div>
</section>

<style>
	.stats-section {
		position: relative;
		padding: var(--space-24) var(--space-4);
		overflow: hidden;
	}

	@media (min-width: 768px) {
		.stats-section {
			padding: var(--space-20) var(--space-6);
		}
	}

	/* Background */
	.bg-gradient {
		position: absolute;
		inset: 0;
		background: radial-gradient(
			ellipse 80% 50% at 50% -20%,
			hsl(var(--brand-hue), var(--brand-saturation), 50%, 0.15),
			transparent
		);
	}

	.bg-grid {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(
				hsl(var(--brand-hue), var(--brand-saturation), 50%, 0.03) 1px,
				transparent 1px
			),
			linear-gradient(
				90deg,
				hsl(var(--brand-hue), var(--brand-saturation), 50%, 0.03) 1px,
				transparent 1px
			);
		background-size: 60px 60px;
		mask-image: radial-gradient(ellipse 60% 50% at 50% 0%, black, transparent);
	}

	/* Floating orbs */
	.orb {
		position: absolute;
		border-radius: 50%;
		filter: blur(80px);
		opacity: 0.4;
		animation: float 8s ease-in-out infinite;
	}

	.orb-1 {
		width: 300px;
		height: 300px;
		top: -100px;
		left: 10%;
		background: hsl(var(--brand-hue), var(--brand-saturation), 60%);
		animation-delay: 0s;
	}

	.orb-2 {
		width: 250px;
		height: 250px;
		bottom: -50px;
		right: 15%;
		background: hsl(calc(var(--brand-hue) + 30), var(--brand-saturation), 55%);
		animation-delay: 2s;
	}

	.orb-3 {
		width: 200px;
		height: 200px;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: hsl(calc(var(--brand-hue) - 20), var(--brand-saturation), 50%);
		animation-delay: 4s;
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0) scale(1);
		}
		50% {
			transform: translateY(-20px) scale(1.05);
		}
	}

	/* Container */
	.container {
		position: relative;
		z-index: 10;
		max-width: 1200px;
		margin: 0 auto;
	}

	/* Section header */
	.section-header {
		text-align: center;
		margin-bottom: var(--space-12);
	}

	.section-title {
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		background: linear-gradient(135deg, var(--gray-900), var(--brand-600));
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		margin-bottom: var(--space-2);
	}

	@media (min-width: 768px) {
		.section-title {
			font-size: var(--text-4xl);
		}
	}

	.section-subtitle {
		font-size: var(--text-base);
		color: var(--color-muted-foreground);
		margin-bottom: var(--space-2);
	}

	.demo-notice {
		font-size: var(--text-xs);
		color: var(--color-warning, #f59e0b);
		margin-bottom: var(--space-4);
		padding: var(--space-1) var(--space-3);
		background: hsl(38, 92%, 50%, 0.1);
		border-radius: var(--radius-full);
		display: inline-block;
	}

	.refresh-btn {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-muted-foreground);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-full);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.refresh-btn:hover:not(:disabled) {
		color: var(--gray-900);
		border-color: var(--brand-500);
	}

	.refresh-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.refresh-btn :global(.spin) {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	/* Loading bar */
	.loading-bar {
		position: relative;
		height: 4px;
		background: var(--color-panel-2);
		border-radius: var(--radius-full);
		margin-bottom: var(--space-8);
		overflow: hidden;
	}

	.loading-progress {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		background: linear-gradient(90deg, var(--brand-500), var(--brand-400));
		border-radius: var(--radius-full);
		transition: width 0.3s ease;
	}

	.loading-text {
		position: absolute;
		top: var(--space-2);
		left: 50%;
		transform: translateX(-50%);
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		white-space: nowrap;
	}

	/* Stats grid */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(1, 1fr);
		gap: var(--space-4);
		margin-bottom: var(--space-8);
	}

	@media (min-width: 640px) {
		.stats-grid {
			grid-template-columns: repeat(3, 1fr);
			gap: var(--space-6);
		}
	}

	/* Stat card */
	.stat-card {
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-6);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-xl);
		overflow: hidden;
		transition: all 0.2s ease;
	}

	.stat-card:hover {
		transform: translateY(-4px);
		border-color: hsl(var(--brand-hue), var(--brand-saturation), 50%, 0.3);
	}

	.stat-card:hover .stat-glow {
		opacity: 1;
	}

	.stat-glow {
		position: absolute;
		inset: 0;
		background: radial-gradient(
			circle at 30% 50%,
			hsl(var(--brand-hue), var(--brand-saturation), 50%, 0.1),
			transparent 60%
		);
		opacity: 0;
		transition: opacity 0.2s ease;
		pointer-events: none;
	}

	.stat-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 56px;
		height: 56px;
		border-radius: var(--radius-lg);
		flex-shrink: 0;
	}

	.premium-card .stat-icon {
		background: linear-gradient(135deg, #f59e0b20, #f59e0b10);
		color: #f59e0b;
	}

	.usage-card .stat-icon {
		background: linear-gradient(135deg, #8b5cf620, #8b5cf610);
		color: #8b5cf6;
	}

	.networks-card .stat-icon {
		background: linear-gradient(135deg, #10b98120, #10b98110);
		color: #10b981;
	}

	.stat-content {
		flex: 1;
		min-width: 0;
	}

	.stat-value {
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		color: var(--gray-900);
		line-height: 1.2;
	}

	@media (min-width: 768px) {
		.stat-value {
			font-size: var(--text-4xl);
		}
	}

	.stat-label {
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
		margin-top: var(--space-1);
	}

	.stat-hint {
		position: absolute;
		bottom: var(--space-2);
		left: var(--space-6);
		right: var(--space-6);
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		opacity: 0.7;
		text-align: center;
	}

	.networks-card {
		padding-bottom: var(--space-8);
	}

	.skeleton {
		display: inline-block;
		background: linear-gradient(
			90deg,
			var(--color-panel-2) 25%,
			var(--color-panel-3) 50%,
			var(--color-panel-2) 75%
		);
		background-size: 200% 100%;
		animation: shimmer 1.5s infinite;
		border-radius: var(--radius-sm);
	}

	@keyframes shimmer {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	/* Details grid */
	.details-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-6);
		margin-bottom: var(--space-8);
	}

	@media (min-width: 768px) {
		.details-grid {
			grid-template-columns: 1fr 1.5fr;
		}
	}

	/* Panel styles */
	.activity-panel,
	.networks-panel {
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-xl);
		overflow: hidden;
	}

	.panel-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-4) var(--space-5);
		background: var(--color-panel-2);
		border-bottom: 1px solid var(--color-border);
	}

	.panel-header h3 {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
		flex: 1;
	}

	/* Sort toggle */
	.sort-toggle {
		display: flex;
		gap: var(--space-1);
		margin-left: auto;
	}

	.sort-btn {
		padding: var(--space-1) var(--space-2);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		color: var(--color-muted-foreground);
		background: transparent;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.sort-btn:hover {
		color: var(--gray-900);
		border-color: var(--brand-500);
	}

	.sort-btn.active {
		color: var(--brand-600);
		background: hsl(var(--brand-hue), var(--brand-saturation), 50%, 0.1);
		border-color: var(--brand-500);
	}

	.live-indicator {
		width: 8px;
		height: 8px;
		background: #10b981;
		border-radius: 50%;
		animation: pulse-live 2s ease-in-out infinite;
	}

	@keyframes pulse-live {
		0%,
		100% {
			opacity: 1;
			box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
		}
		50% {
			opacity: 0.8;
			box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
		}
	}

	/* Activity list */
	.activity-list {
		max-height: 280px;
		overflow-y: auto;
	}

	.no-activity {
		padding: var(--space-8);
		text-align: center;
		color: var(--color-muted-foreground);
		font-size: var(--text-sm);
	}

	.activity-item {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-5);
		border-bottom: 1px solid var(--color-border);
		animation: slideIn 0.3s ease;
	}

	.activity-item:last-child {
		border-bottom: none;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateX(-10px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.activity-icon {
		font-size: var(--text-lg);
		flex-shrink: 0;
	}

	.activity-details {
		flex: 1;
		min-width: 0;
	}

	.activity-label {
		display: block;
		font-size: var(--text-sm);
		color: var(--gray-900);
		font-weight: var(--font-medium);
	}

	.activity-chain {
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
	}

	.activity-time {
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		white-space: nowrap;
	}

	/* Networks list */
	.networks-list {
		padding: var(--space-2);
	}

	.no-networks {
		padding: var(--space-8);
		text-align: center;
		color: var(--color-muted-foreground);
		font-size: var(--text-sm);
	}

	.network-item {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3);
		border-radius: var(--radius-lg);
		transition: background 0.15s ease;
	}

	.network-item:hover {
		background: var(--color-panel-2);
	}

	.network-rank {
		width: 28px;
		font-size: var(--text-sm);
		font-weight: var(--font-bold);
		color: var(--color-muted-foreground);
		text-align: center;
	}

	.network-info {
		flex: 0 0 120px;
		min-width: 0;
	}

	.network-name {
		display: block;
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--gray-900);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.network-contracts {
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
	}

	.network-bar-container {
		flex: 1;
		height: 6px;
		background: var(--color-panel-2);
		border-radius: var(--radius-full);
		overflow: hidden;
	}

	.network-bar {
		height: 100%;
		background: linear-gradient(90deg, var(--brand-500), var(--brand-400));
		border-radius: var(--radius-full);
		transition: width 0.5s ease;
	}

	.network-usage {
		width: 60px;
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
		text-align: right;
	}

	/* Network stats (member count + usage count) */
	.network-stats {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		flex-shrink: 0;
	}

	.network-stat {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		cursor: help;
	}

	.stat-icon-mini {
		font-size: var(--text-sm);
	}

	/* Trust badge */
	.trust-badge {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		border-radius: var(--radius-full);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
	}

	.check-icon {
		width: 16px;
		height: 16px;
		color: var(--color-success);
	}

	.trust-badge span {
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
	}

	/* Dark mode adjustments */
	:global([data-theme='dark']) .section-title {
		background: linear-gradient(135deg, var(--gray-100), var(--brand-400));
		-webkit-background-clip: text;
		background-clip: text;
	}

	:global([data-theme='dark']) .stat-value,
	:global([data-theme='dark']) .panel-header h3,
	:global([data-theme='dark']) .activity-label,
	:global([data-theme='dark']) .network-name,
	:global([data-theme='dark']) .network-usage {
		color: var(--gray-100);
	}

	:global([data-theme='dark']) .refresh-btn:hover:not(:disabled) {
		color: var(--gray-100);
	}
</style>
