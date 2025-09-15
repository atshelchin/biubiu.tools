<script lang="ts">
	import { t } from '@/i18n/create-i18n.svelte';
	// import EmailCollector from './EmailCollector.svelte';

	// 暂时移除邮件收集器，直接跳转到预售页面
	// Temporarily remove email collector, redirect to presale page
	// let showEmailCollector = $state(false);

	// Handle CTA click | 处理 CTA 点击
	function handleCtaClick(e: Event) {
		e.preventDefault();
		// // 根据语言跳转到预售页面 / Redirect to presale page based on language
		// const locale = getLocale();
		// const presaleUrl = locale === 'zh' ? '/presale.html' : '/presale.html?lang=en';
		// window.location.href = presaleUrl;
	}

	// Scroll to features section | 滚动到功能介绍部分
	function scrollToFeatures() {
		const featuresSection = document.getElementById('tools');
		if (featuresSection) {
			featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	const bgSvg = `'data:image/svg+xml;utf8,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="%23a855f7" stroke-width="0.5" opacity="0.3"/><circle cx="30" cy="30" r="1.5" fill="%23a855f7" opacity="0.4"/><polygon points="15,10 25,10 20,20" fill="%23eab308" opacity="0.2"/><polygon points="35,40 45,40 40,50" fill="%23a855f7" opacity="0.2"/></pattern></defs><rect width="100%" height="100%" fill="url(%23grid)"/></svg>'`;
</script>

<!-- Update page title | 更新页面标题 -->
<svelte:head>
	<title>biubiu.tools</title>
</svelte:head>

<!-- Hero section with brand mesh gradient | 带品牌网格渐变的主要展示区 -->
<section class="hero-section">
	<!-- Premium geometric pattern overlay | 高端几何图案叠加 -->
	<div class="hero-pattern-overlay" style="background-image: url({bgSvg})"></div>

	<!-- Flowing gradient orbs | 流动的渐变球体 -->
	<div class="hero-gradient-orbs">
		<!-- Primary orb | 主要球体 -->
		<div class="orb orb-primary"></div>
		<!-- Secondary orb | 次要球体 -->
		<div class="orb orb-secondary"></div>
		<!-- Accent orb | 点缀球体 -->
		<div class="orb orb-accent"></div>
	</div>

	<!-- Hero content container | 主要内容容器 -->
	<div class="hero-content">
		<!-- Logo with premium effect | 带高端效果的标志 -->
		<div class="logo-container animate-fade-in">
			<div class="logo-wrapper">
				<!-- Glow effect | 发光效果 -->
				<div class="logo-glow"></div>
				<img src="/logo.svg" alt="BiuBiu Logo" class="logo-image" />
			</div>
		</div>

		<!-- Main title with brand styling | 品牌风格主标题 -->

		<h1 class="hero-title animate-fade-in-delayed">
			<span class="title-gradient">
				{t('hero_title')}
			</span>
		</h1>

		<!-- Subtitle with enhanced typography | 增强排版的副标题 -->
		<p class="hero-subtitle animate-fade-in-delayed">
			{t('hero_subtitle')}
		</p>

		<!-- CTA buttons with premium styling | 高端风格的行动按钮 -->
		<div class="cta-buttons animate-fade-in-delayed-more">
			<!-- Primary CTA button | 主要行动按钮 -->
			<!-- <button onclick={handleCtaClick} class="btn-primary">
				<span class="btn-text">{t('cta_get_started')}</span>
				<div class="btn-glow"></div>
			</button> -->

			<!-- Secondary CTA button | 次要行动按钮 -->

			<button class="button-secondary" onclick={scrollToFeatures}>
				{t('cta_learn_more')}
			</button>
		</div>

		<!-- Platform compatibility | 平台兼容性 -->
		<div class="platform-section">
			<p class="platform-label animate-fade-in">Powerful Batch Operations</p>
			<div class="platform-list">
				<span class="platform-item">Token Collect</span>
				<span class="platform-item">Airdrop Tools</span>
				<span class="platform-item">Multi-Wallet</span>
				<span class="platform-item">Multi-Chain</span>
			</div>
		</div>
	</div>

	<!-- Scroll indicator | 滚动指示器 -->
	<div class="scroll-indicator">
		<svg class="scroll-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M19 14l-7 7m0 0l-7-7m7 7V3"
			></path>
		</svg>
	</div>
</section>

<style>
	/* Design tokens are imported globally in +layout.svelte */

	/* Hero Section Layout */
	.hero-section {
		position: relative;
		display: flex;
		min-height: 100vh;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		background: linear-gradient(
			135deg,
			var(--color-background) 0%,
			var(--color-panel-1) 50%,
			var(--color-background) 100%
		);
	}

	/* Pattern Overlay */
	.hero-pattern-overlay {
		position: absolute;
		inset: 0;
		opacity: 0.02;
		pointer-events: none;
	}

	/* Gradient Orbs Container */
	.hero-gradient-orbs {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
	}

	/* Orb Styles */
	.orb {
		position: absolute;
		border-radius: var(--radius-full);
		filter: blur(100px);
		animation: pulse 4s ease-in-out infinite;
	}

	.orb-primary {
		top: -10rem;
		right: -10rem;
		width: 37.5rem;
		height: 37.5rem;
		background: linear-gradient(
			135deg,
			hsla(var(--brand-hue), var(--brand-saturation), 50%, 0.3),
			hsla(var(--brand-hue), var(--brand-saturation), 50%, 0)
		);
	}

	.orb-secondary {
		bottom: -10rem;
		left: -10rem;
		width: 37.5rem;
		height: 37.5rem;
		background: linear-gradient(
			45deg,
			hsla(var(--brand-hue), calc(var(--brand-saturation) * 0.7), 60%, 0.2),
			hsla(var(--brand-hue), calc(var(--brand-saturation) * 0.7), 60%, 0)
		);
		animation-delay: 2s;
	}

	.orb-accent {
		top: 50%;
		left: 50%;
		width: 50rem;
		height: 50rem;
		transform: translate(-50%, -50%);
		background: radial-gradient(
			circle,
			hsla(var(--brand-hue), var(--brand-saturation), 50%, 0.1),
			transparent,
			transparent
		);
		filter: blur(50px);
	}

	/* Content Container */
	.hero-content {
		position: relative;
		z-index: 10;
		max-width: 80rem;
		margin: 0 auto;
		padding: 0 var(--space-4);
		text-align: center;
	}

	/* Logo Container */
	.logo-container {
		margin-bottom: var(--space-4);
	}

	.logo-wrapper {
		position: relative;
		display: inline-block;
	}

	.logo-glow {
		position: absolute;
		inset: 0;
		border-radius: var(--radius-full);
		background: hsla(var(--brand-hue), var(--brand-saturation), 50%, 0.2);
		filter: blur(2rem);
	}

	.logo-image {
		position: relative;
		width: var(--space-24);
		height: var(--space-24);
		margin: 0 auto;
		border-radius: var(--radius-full);
		box-shadow: var(--shadow-2xl);
	}

	/* Title Styles */
	.hero-title {
		margin-bottom: var(--space-6);
		padding: 0 var(--space-4);
		font-size: var(--text-3xl);
		font-weight: var(--font-black);
		line-height: 1.1;
	}

	.title-gradient {
		background: linear-gradient(
			90deg,
			var(--color-primary),
			var(--brand-700),
			var(--color-primary)
		);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	/* Subtitle */
	.hero-subtitle {
		max-width: 52rem;
		margin: 0 auto var(--space-10) auto;
		padding: 0 var(--space-6);
		font-size: var(--text-lg);
		font-weight: var(--font-light);
		line-height: 1.75;
		color: var(--color-muted-foreground);
		opacity: 0.9;
	}

	/* CTA Buttons Container */
	.cta-buttons {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: var(--space-3);
		padding: 0 var(--space-4);
	}

	/* Secondary Button */
	.button-secondary {
		position: relative;
		width: 100%;
		padding: var(--space-4) var(--space-10);
		border-radius: var(--radius-lg);
		background: transparent;
		color: var(--color-foreground);
		font-size: var(--text-lg);
		font-weight: var(--font-medium);
		border: 2px solid var(--color-border);
		cursor: pointer;
		transition: all 300ms ease;
		backdrop-filter: blur(10px);
		letter-spacing: 0.025em;
	}

	.button-secondary:hover {
		border-color: var(--color-primary);
		color: var(--color-primary);
		background: hsla(var(--brand-hue), var(--brand-saturation), 50%, 0.05);
		transform: translateY(-1px);
	}

	/* Platform Section */
	.platform-section {
		margin-top: var(--space-12);
		padding-top: var(--space-12);
		border-top: 1px solid hsla(var(--brand-hue), 10%, 50%, 0.05);
	}

	.platform-label {
		margin-bottom: var(--space-6);
		padding: 0 var(--space-4);
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
	}

	.platform-list {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: var(--space-6);
		padding: 0 var(--space-4);
		opacity: 0.5;
		filter: grayscale(1);
		transition: all 500ms ease;
	}

	.platform-list:hover {
		opacity: 0.7;
		filter: grayscale(0);
	}

	.platform-item {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
	}

	/* Scroll Indicator */
	.scroll-indicator {
		position: absolute;
		bottom: var(--space-8);
		left: 50%;
		transform: translateX(-50%);
		animation: bounce 1.5s ease-in-out infinite;
	}

	.scroll-icon {
		width: var(--space-6);
		height: var(--space-6);
		color: var(--color-muted-foreground);
	}

	/* Responsive Styles */
	@media (min-width: 640px) {
		.logo-container {
			margin-bottom: var(--space-6);
		}

		.logo-image {
			width: 7rem;
			height: 7rem;
		}

		.hero-title {
			margin-bottom: var(--space-8);
			font-size: var(--text-5xl);
		}

		.hero-subtitle {
			margin-bottom: var(--space-12);
			font-size: var(--text-xl);
			max-width: 56rem;
		}

		.cta-buttons {
			flex-direction: row;
			gap: var(--space-4);
		}

		.button-secondary {
			width: auto;
			padding: var(--space-5) var(--space-12);
			font-size: var(--text-xl);
		}

		.platform-section {
			margin-top: var(--space-20);
			padding-top: var(--space-20);
		}

		.platform-label {
			margin-bottom: var(--space-8);
		}

		.platform-list {
			gap: var(--space-12);
		}

		.platform-item {
			font-size: var(--text-lg);
		}
	}

	@media (min-width: 768px) {
		.logo-image {
			width: 9rem;
			height: 9rem;
		}

		.hero-title {
			font-size: 4.5rem;
			margin-bottom: var(--space-10);
		}

		.hero-subtitle {
			font-size: var(--text-2xl);
			margin-bottom: var(--space-14);
			max-width: 60rem;
		}

		.button-secondary {
			padding: var(--space-6) var(--space-14);
			font-size: 1.25rem;
		}
	}

	/* Animations */
	@keyframes pulse {
		0%,
		100% {
			opacity: 0.8;
		}
		50% {
			opacity: 1;
		}
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translateX(-50%) translateY(0);
		}
		50% {
			transform: translateX(-50%) translateY(-10px);
		}
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	:global(.animate-fade-in) {
		animation: fadeIn 0.8s ease-out;
	}

	:global(.animate-fade-in-delayed) {
		animation: fadeIn 0.8s ease-out 0.2s both;
	}

	:global(.animate-fade-in-delayed-more) {
		animation: fadeIn 0.8s ease-out 0.4s both;
	}
</style>
