<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { useI18n, type TranslationKeys } from '@shelchin/i18n';
	import { ArrowRight, Dices, Sparkles } from '@lucide/svelte';
	import confetti from 'canvas-confetti';
	import { PERSONAS } from './data';
	import { useCarousel } from './use-carousel.svelte';
	import { toolsConfig } from '../data/tools-data';
	import Dice3D from '$lib/components/ui/dice-3d.svelte';
	import type { Component } from 'svelte';

	interface Tool {
		icon: Component;
		title: string;
		description: string;
		link?: string;
		status: 'active' | 'coming-soon';
		color: string;
		features?: string[];
		stage?: string;
		titleKey?: string;
		descriptionKey?: string;
		featureKeys?: string[];
	}

	const i18n = useI18n();
	const t = i18n.t.bind(i18n);

	// Initialize carousel
	const carousel = useCarousel({
		personas: PERSONAS
	});

	// Current pain point (derived for cleaner template)
	const currentPainPoint = $derived(
		carousel.currentPersona.painPoints[carousel.state.painPointIndex]
	);

	// Tools with i18n translations
	const tools = $derived(
		toolsConfig.map((tool) => ({
			...tool,
			title: t(tool.titleKey as keyof TranslationKeys),
			description: t(tool.descriptionKey as keyof TranslationKeys),
			features: tool.featureKeys
				? tool.featureKeys.map((key) => t(key as keyof TranslationKeys))
				: tool.features
		}))
	);

	// Filter only active tools for random discovery
	const activeTools = $derived(
		tools.filter((tool) => tool.status === 'active' && tool.link) as Tool[]
	);

	// Random tool discovery state
	let isShaking = $state(false);
	let showDice3D = $state(false);
	let showDiscoveryModal = $state(false);
	let discoveredTool = $state<Tool | null>(null);

	// Create custom confetti with high z-index
	let customConfetti: ReturnType<typeof confetti.create> | null = null;

	function getConfetti() {
		if (!customConfetti) {
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

	function playClickSound() {
		try {
			const ctx = getAudioContext();
			const now = ctx.currentTime;
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.connect(gain);
			gain.connect(ctx.destination);
			osc.frequency.value = 800;
			osc.type = 'sine';
			gain.gain.setValueAtTime(0, now);
			gain.gain.linearRampToValueAtTime(0.15, now + 0.005);
			gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
			osc.start(now);
			osc.stop(now + 0.08);
		} catch {
			// Audio not supported
		}
	}

	function playWhooshSound() {
		try {
			const ctx = getAudioContext();
			const now = ctx.currentTime;
			const bufferSize = ctx.sampleRate * 0.4;
			const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
			const data = buffer.getChannelData(0);
			for (let i = 0; i < bufferSize; i++) {
				data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
			}
			const noise = ctx.createBufferSource();
			noise.buffer = buffer;
			const filter = ctx.createBiquadFilter();
			filter.type = 'bandpass';
			filter.frequency.setValueAtTime(2000, now);
			filter.frequency.exponentialRampToValueAtTime(400, now + 0.3);
			filter.Q.value = 1;
			const gain = ctx.createGain();
			gain.gain.setValueAtTime(0, now);
			gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
			gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
			noise.connect(filter);
			filter.connect(gain);
			gain.connect(ctx.destination);
			noise.start(now);
			noise.stop(now + 0.4);
		} catch {
			// Audio not supported
		}
	}

	function playRollingSound() {
		try {
			const ctx = getAudioContext();
			const now = ctx.currentTime;
			for (let i = 0; i < 15; i++) {
				const osc = ctx.createOscillator();
				const gain = ctx.createGain();
				osc.connect(gain);
				gain.connect(ctx.destination);
				osc.frequency.value = 150 + Math.random() * 350;
				osc.type = 'triangle';
				const clickTime = now + i * 0.08 * (1 + i * 0.05) + Math.random() * 0.03;
				gain.gain.setValueAtTime(0, clickTime);
				gain.gain.linearRampToValueAtTime(0.1, clickTime + 0.008);
				gain.gain.exponentialRampToValueAtTime(0.01, clickTime + 0.06);
				osc.start(clickTime);
				osc.stop(clickTime + 0.08);
			}
		} catch {
			// Audio not supported
		}
	}

	function playLandingSound() {
		try {
			const ctx = getAudioContext();
			const now = ctx.currentTime;
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			const filter = ctx.createBiquadFilter();
			filter.type = 'lowpass';
			filter.frequency.value = 200;
			filter.Q.value = 1;
			osc.connect(filter);
			filter.connect(gain);
			gain.connect(ctx.destination);
			osc.frequency.setValueAtTime(120, now);
			osc.frequency.exponentialRampToValueAtTime(60, now + 0.15);
			osc.type = 'sine';
			gain.gain.setValueAtTime(0, now);
			gain.gain.linearRampToValueAtTime(0.25, now + 0.02);
			gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
			osc.start(now);
			osc.stop(now + 0.25);
			const tap = ctx.createOscillator();
			const tapGain = ctx.createGain();
			tap.connect(tapGain);
			tapGain.connect(ctx.destination);
			tap.frequency.value = 400;
			tap.type = 'triangle';
			tapGain.gain.setValueAtTime(0, now);
			tapGain.gain.linearRampToValueAtTime(0.06, now + 0.005);
			tapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
			tap.start(now);
			tap.stop(now + 0.06);
		} catch {
			// Audio not supported
		}
	}

	function playCelebrationSound() {
		try {
			const ctx = getAudioContext();
			const now = ctx.currentTime;
			const notes = [523.25, 659.25, 783.99, 1046.5];
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
			// Audio not supported
		}
	}

	function handleShake() {
		if (isShaking || showDice3D) return;
		playClickSound();
		isShaking = true;
		showDice3D = true;
	}

	function onDiceAnimationStart() {
		playWhooshSound();
		setTimeout(() => playRollingSound(), 150);
	}

	function onDiceLanding() {
		playLandingSound();
	}

	function onDiceComplete() {
		showDice3D = false;
		isShaking = false;
		const randomIndex = Math.floor(Math.random() * activeTools.length);
		discoveredTool = activeTools[randomIndex];
		showDiscoveryModal = true;
		playCelebrationSound();
		const myConfetti = getConfetti();
		myConfetti({
			particleCount: 60,
			spread: 60,
			origin: { x: 0.5, y: 0.5 },
			colors: ['#F59E0B', '#EC4899', '#8B5CF6', '#10B981', '#3B82F6'],
			startVelocity: 40,
			gravity: 1.5
		});
		const duration = 1200;
		const end = Date.now() + duration;
		const frame = () => {
			myConfetti({
				particleCount: 2,
				angle: 60,
				spread: 45,
				origin: { x: 0, y: 0.65 },
				colors: ['#F59E0B', '#EC4899', '#8B5CF6']
			});
			myConfetti({
				particleCount: 2,
				angle: 120,
				spread: 45,
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
		setTimeout(() => {
			handleShake();
		}, 100);
	}

	// Lifecycle
	onMount(() => {
		carousel.start();
	});

	onDestroy(() => {
		carousel.stop();
	});
</script>

<section
	class="persona-carousel"
	onmouseenter={carousel.handleMouseEnter}
	onmouseleave={carousel.handleMouseLeave}
	aria-label="User personas and pain points"
	style="
		--accent-color: {carousel.currentPersona.theme.accent};
		--gradient-from: {carousel.currentPersona.theme.gradientFrom};
		--gradient-to: {carousel.currentPersona.theme.gradientTo};
		--glow-color: {carousel.currentPersona.theme.glow};
	"
>
	<!-- Background glow effect -->
	<div class="background-glow"></div>

	<div class="carousel-container">
		<!-- Persona Tabs with integrated progress -->
		<div class="persona-tabs" role="tablist">
			{#each PERSONAS as persona, index (persona.id)}
				<button
					class="persona-tab"
					class:active={carousel.state.personaIndex === index}
					onclick={() => carousel.goToPersona(index)}
					role="tab"
					aria-selected={carousel.state.personaIndex === index}
					aria-controls="carousel-content"
					style="--tab-accent: {persona.theme.accent};"
				>
					<span class="tab-text">{t(persona.labelKey as keyof TranslationKeys)}</span>
					<!-- Progress indicator as underline -->
					{#if carousel.state.personaIndex === index}
						<span class="tab-progress" style="width: {carousel.state.progress}%"></span>
					{/if}
				</button>
			{/each}
		</div>

		<!-- Carousel Content -->
		<div id="carousel-content" class="carousel-content" role="tabpanel">
			<!-- Pain Point Content -->
			{#key `${carousel.state.personaIndex}-${carousel.state.painPointIndex}`}
				<!-- Pain Point Title - The Hero -->
				<h2 class="pain-title">
					{t(currentPainPoint.titleKey as keyof TranslationKeys)}
				</h2>

				<!-- Solution Subtitle - Supporting role -->
				<p class="pain-subtitle">
					{t(currentPainPoint.subtitleKey as keyof TranslationKeys)}
				</p>

				<!-- CTA Buttons -->
				<div class="cta-group">
					<a href={currentPainPoint.link} class="cta-button primary">
						<span>{t(currentPainPoint.ctaKey as keyof TranslationKeys)}</span>
						<ArrowRight class="cta-icon" />
					</a>
					<button class="cta-button secondary" class:shaking={isShaking} onclick={handleShake}>
						<Dices class="dice-icon" />
						<span>{t('persona.feel_lucky')}</span>
					</button>
				</div>
			{/key}

			<!-- Pain Point Dots (minimal) -->
			<div class="pain-dots">
				{#each carousel.currentPersona.painPoints as _painPoint, index (index)}
					<button
						class="pain-dot"
						class:active={carousel.state.painPointIndex === index}
						onclick={() => carousel.goToPainPoint(index)}
						aria-label="Go to pain point {index + 1}"
					></button>
				{/each}
			</div>
		</div>

		<!-- Bottom Tags - Nearly invisible -->
		<div class="tags">
			{#each carousel.currentPersona.tagKeys as tagKey (tagKey)}
				<span class="tag">{t(tagKey as keyof TranslationKeys)}</span>
			{/each}
		</div>
	</div>
</section>

<!-- Discovery Modal -->
{#if showDiscoveryModal && discoveredTool}
	{@const DiscoveredIcon = discoveredTool.icon}
	<div class="discovery-overlay" onclick={closeDiscoveryModal} role="presentation">
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="discovery-modal"
			onclick={(e) => e.stopPropagation()}
			role="dialog"
			aria-modal="true"
			tabindex="-1"
			style="--tool-color: {discoveredTool.color};"
		>
			<div class="modal-decoration modal-decoration-top-left"></div>
			<div class="modal-decoration modal-decoration-bottom-right"></div>

			<div class="discovery-content">
				<div class="discovery-badge">
					<div class="badge-sparkle"></div>
					<Sparkles size={14} />
					<span>{t('tools.you_discovered')}</span>
					<div class="badge-sparkle"></div>
				</div>

				<div class="discovery-icon-wrapper">
					<div class="discovery-icon-glow"></div>
					<div class="discovery-icon-box">
						<DiscoveredIcon class="discovery-icon" />
					</div>
				</div>

				<h3 class="discovery-title">{discoveredTool.title}</h3>
				<p class="discovery-description">{discoveredTool.description}</p>

				{#if discoveredTool.features}
					<div class="discovery-features">
						{#each discoveredTool.features.slice(0, 3) as feature, i (feature)}
							<span class="discovery-feature" style="--delay: {i * 0.1}s">{feature}</span>
						{/each}
					</div>
				{/if}

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
<Dice3D
	visible={showDice3D}
	onComplete={onDiceComplete}
	onAnimationStart={onDiceAnimationStart}
	onLanding={onDiceLanding}
/>

<style>
	.persona-carousel {
		position: relative;
		min-height: 100svh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-16) var(--space-4);
		background: var(--color-background);
		overflow: hidden;
		transition:
			--accent-color 0.5s ease,
			--gradient-from 0.5s ease,
			--gradient-to 0.5s ease,
			--glow-color 0.5s ease;
	}

	/* Background glow effect */
	.background-glow {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 900px;
		height: 900px;
		background: radial-gradient(
			circle,
			var(--gradient-from) 0%,
			var(--gradient-to) 35%,
			transparent 65%
		);
		opacity: 0.8;
		pointer-events: none;
		transition: background 0.6s ease;
	}

	.carousel-container {
		position: relative;
		max-width: 64rem;
		width: 100%;
		margin: 0 auto;
		text-align: center;
		z-index: 1;
	}

	/* Persona Tabs with integrated progress */
	.persona-tabs {
		display: flex;
		justify-content: center;
		gap: var(--space-1);
		margin-bottom: var(--space-16);
	}

	.persona-tab {
		position: relative;
		padding: var(--space-3) var(--space-6);
		border: none;
		border-radius: var(--radius-lg);
		background: transparent;
		color: var(--color-muted-foreground);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.25s ease;
		overflow: hidden;
	}

	.tab-text {
		position: relative;
		z-index: 1;
	}

	.persona-tab:hover {
		color: var(--tab-accent);
	}

	.persona-tab.active {
		color: var(--tab-accent);
		font-weight: var(--font-semibold);
	}

	/* Progress as bottom border/underline */
	.tab-progress {
		position: absolute;
		bottom: 0;
		left: 0;
		height: 3px;
		background: var(--tab-accent);
		border-radius: var(--radius-full);
		transition: width 50ms linear;
	}

	/* Carousel Content */
	.carousel-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: var(--space-8) 0;
	}

	/* Pain Point Title - THE HERO */
	.pain-title {
		font-size: 2rem;
		font-weight: var(--font-bold);
		line-height: 1.2;
		color: var(--color-foreground);
		margin: 0 0 var(--space-8) 0;
		padding: 0 var(--space-4);
		max-width: 800px;
		letter-spacing: -0.02em;
		animation: fadeInUp 0.4s ease-out;
	}

	/* Solution Subtitle - Supporting, faded */
	.pain-subtitle {
		font-size: var(--text-base);
		line-height: 1.7;
		color: var(--color-muted-foreground);
		opacity: 0.7;
		margin: 0 0 var(--space-12) 0;
		padding: 0 var(--space-4);
		max-width: 480px;
		animation: fadeInUp 0.4s ease-out 0.1s both;
	}

	/* CTA Group */
	.cta-group {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		margin-bottom: var(--space-12);
		animation: fadeInUp 0.4s ease-out 0.2s both;
	}

	/* CTA Buttons */
	.cta-button {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-4) var(--space-8);
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		border-radius: var(--radius-xl);
		text-decoration: none;
		cursor: pointer;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease,
			background 0.3s ease,
			border-color 0.3s ease;
	}

	.cta-button.primary {
		background: var(--accent-color);
		border: none;
		color: white;
		box-shadow:
			0 0 40px var(--glow-color),
			0 4px 15px hsla(0, 0%, 0%, 0.1);
	}

	.cta-button.primary:hover {
		transform: translateY(-3px);
		box-shadow:
			0 0 60px var(--glow-color),
			0 8px 25px hsla(0, 0%, 0%, 0.15);
	}

	.cta-button.secondary {
		background: transparent;
		border: 1px solid hsla(0, 0%, 50%, 0.3);
		color: var(--color-muted-foreground);
	}

	.cta-button.secondary:hover {
		border-color: var(--accent-color);
		color: var(--accent-color);
		background: hsla(0, 0%, 50%, 0.05);
	}

	.cta-button.secondary.shaking {
		animation: diceShake 0.5s ease-in-out;
	}

	@keyframes diceShake {
		0%,
		100% {
			transform: rotate(0deg);
		}
		20% {
			transform: rotate(-10deg);
		}
		40% {
			transform: rotate(10deg);
		}
		60% {
			transform: rotate(-10deg);
		}
		80% {
			transform: rotate(10deg);
		}
	}

	:global(.cta-icon) {
		width: 20px;
		height: 20px;
		transition: transform 0.2s ease;
	}

	.cta-button.primary:hover :global(.cta-icon) {
		transform: translateX(4px);
	}

	:global(.dice-icon) {
		width: 20px;
		height: 20px;
		transition: transform 0.2s ease;
	}

	.cta-button.secondary:hover :global(.dice-icon) {
		transform: rotate(15deg);
	}

	/* Pain Point Dots - minimal */
	.pain-dots {
		display: flex;
		justify-content: center;
		gap: var(--space-2);
	}

	.pain-dot {
		width: 8px;
		height: 8px;
		padding: 0;
		border: none;
		border-radius: var(--radius-full);
		background: hsla(0, 0%, 50%, 0.2);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.pain-dot:hover {
		background: hsla(0, 0%, 50%, 0.4);
	}

	.pain-dot.active {
		background: var(--accent-color);
		transform: scale(1.25);
	}

	/* Tags - Nearly invisible */
	.tags {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: var(--space-8);
		margin-top: var(--space-16);
		opacity: 0.4;
	}

	.tag {
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		letter-spacing: 0.05em;
	}

	/* Animations */
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
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
		max-width: 440px;
		background: linear-gradient(
			145deg,
			var(--color-panel-2),
			color-mix(in srgb, var(--color-panel-2) 95%, var(--tool-color))
		);
		border: 1px solid color-mix(in srgb, var(--tool-color) 30%, var(--color-panel-border-2));
		border-radius: 24px;
		padding: var(--space-10);
		animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
		box-shadow:
			0 25px 60px -12px rgba(0, 0, 0, 0.35),
			0 0 0 1px rgba(255, 255, 255, 0.08),
			0 0 80px -20px color-mix(in srgb, var(--tool-color) 30%, transparent);
		overflow: hidden;
	}

	.modal-decoration {
		position: absolute;
		width: 120px;
		height: 120px;
		border-radius: 50%;
		background: radial-gradient(circle, var(--tool-color), transparent 70%);
		opacity: 0.15;
		filter: blur(30px);
		pointer-events: none;
	}

	.modal-decoration-top-left {
		top: -40px;
		left: -40px;
	}

	.modal-decoration-bottom-right {
		bottom: -40px;
		right: -40px;
	}

	@keyframes popIn {
		from {
			opacity: 0;
			transform: scale(0.85) translateY(30px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	.discovery-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		position: relative;
		z-index: 1;
	}

	.discovery-badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-5);
		background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(236, 72, 153, 0.15));
		border: 1px solid rgba(245, 158, 11, 0.25);
		border-radius: var(--radius-full);
		font-size: var(--text-xs);
		font-weight: var(--font-bold);
		color: #f59e0b;
		margin-bottom: var(--space-8);
		animation: badgeGlow 2s ease-in-out infinite;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.badge-sparkle {
		width: 4px;
		height: 4px;
		background: #f59e0b;
		border-radius: 50%;
		animation: sparkle 1.5s ease-in-out infinite;
	}

	.badge-sparkle:last-child {
		animation-delay: 0.75s;
	}

	@keyframes sparkle {
		0%,
		100% {
			opacity: 0.3;
			transform: scale(0.8);
		}
		50% {
			opacity: 1;
			transform: scale(1.2);
		}
	}

	@keyframes badgeGlow {
		0%,
		100% {
			box-shadow: 0 0 15px rgba(245, 158, 11, 0.2);
		}
		50% {
			box-shadow: 0 0 25px rgba(245, 158, 11, 0.4);
		}
	}

	.discovery-icon-wrapper {
		position: relative;
		width: 96px;
		height: 96px;
		margin-bottom: var(--space-8);
	}

	.discovery-icon-glow {
		position: absolute;
		inset: -25px;
		background: radial-gradient(circle, var(--tool-color), transparent 65%);
		opacity: 0.4;
		filter: blur(25px);
		animation: glowPulse 2.5s ease-in-out infinite;
	}

	@keyframes glowPulse {
		0%,
		100% {
			opacity: 0.35;
			transform: scale(1);
		}
		50% {
			opacity: 0.55;
			transform: scale(1.15);
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
			145deg,
			var(--tool-color),
			color-mix(in srgb, var(--tool-color) 70%, black)
		);
		border-radius: 20px;
		box-shadow:
			0 15px 50px color-mix(in srgb, var(--tool-color) 50%, transparent),
			0 5px 15px rgba(0, 0, 0, 0.25),
			inset 0 1px 0 rgba(255, 255, 255, 0.2);
		animation: iconFloat 3s ease-in-out infinite;
	}

	@keyframes iconFloat {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-5px);
		}
	}

	:global(.discovery-icon) {
		width: 44px;
		height: 44px;
		color: white;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
	}

	.discovery-title {
		font-size: 1.5rem;
		font-weight: var(--font-bold);
		color: var(--color-heading-1);
		margin-bottom: var(--space-3);
		background: linear-gradient(135deg, var(--color-heading-1), var(--tool-color));
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.discovery-description {
		font-size: var(--text-base);
		color: var(--color-description-2);
		line-height: 1.7;
		margin-bottom: var(--space-6);
		max-width: 320px;
	}

	.discovery-features {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: var(--space-2);
		margin-bottom: var(--space-8);
	}

	.discovery-feature {
		padding: 6px var(--space-4);
		background: color-mix(in srgb, var(--tool-color) 10%, var(--color-panel-1));
		border: 1px solid color-mix(in srgb, var(--tool-color) 20%, var(--color-panel-border-1));
		border-radius: var(--radius-full);
		font-size: 12px;
		font-weight: var(--font-medium);
		color: var(--color-description-1);
		animation: featureSlideIn 0.4s ease-out backwards;
		animation-delay: var(--delay);
	}

	@keyframes featureSlideIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.discovery-actions {
		display: flex;
		gap: var(--space-3);
		width: 100%;
		margin-top: var(--space-2);
	}

	.discovery-btn {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		padding: var(--space-4) var(--space-5);
		border-radius: 12px;
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.discovery-btn.primary {
		background: linear-gradient(
			135deg,
			var(--tool-color),
			color-mix(in srgb, var(--tool-color) 80%, #8b5cf6)
		);
		border: none;
		color: white;
		box-shadow:
			0 6px 20px color-mix(in srgb, var(--tool-color) 40%, transparent),
			inset 0 1px 0 rgba(255, 255, 255, 0.2);
	}

	.discovery-btn.primary:hover {
		transform: translateY(-3px) scale(1.02);
		box-shadow:
			0 10px 30px color-mix(in srgb, var(--tool-color) 50%, transparent),
			inset 0 1px 0 rgba(255, 255, 255, 0.3);
	}

	.discovery-btn.secondary {
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-2);
		color: var(--color-text-secondary);
	}

	.discovery-btn.secondary:hover {
		background: var(--color-panel-3);
		border-color: var(--tool-color);
		color: var(--tool-color);
		transform: translateY(-2px);
	}

	/* Responsive */
	@media (min-width: 640px) {
		.persona-tabs {
			gap: var(--space-2);
			margin-bottom: var(--space-20);
		}

		.persona-tab {
			padding: var(--space-3) var(--space-8);
			font-size: var(--text-base);
		}

		.pain-title {
			font-size: 2.75rem;
			margin-bottom: var(--space-10);
		}

		.pain-subtitle {
			font-size: var(--text-lg);
		}
	}

	@media (min-width: 768px) {
		.persona-carousel {
			padding: var(--space-24) var(--space-8);
		}

		.persona-tabs {
			margin-bottom: var(--space-24);
		}

		.pain-title {
			font-size: 3.5rem;
			margin-bottom: var(--space-12);
			max-width: 900px;
		}

		.pain-subtitle {
			font-size: var(--text-xl);
			margin-bottom: var(--space-16);
			max-width: 560px;
		}

		.cta-group {
			margin-bottom: var(--space-16);
		}

		.cta-button {
			padding: var(--space-5) var(--space-12);
			font-size: 1.0625rem;
		}

		.pain-dots {
			gap: var(--space-3);
		}

		.pain-dot {
			width: 10px;
			height: 10px;
		}

		.tags {
			margin-top: var(--space-20);
			gap: var(--space-12);
		}

		.background-glow {
			width: 1100px;
			height: 1100px;
		}
	}

	@media (min-width: 1024px) {
		.pain-title {
			font-size: 4rem;
		}

		.background-glow {
			width: 1300px;
			height: 1300px;
		}
	}

	/* Mobile adjustments */
	@media (max-width: 640px) {
		.cta-group {
			flex-direction: column;
			width: 100%;
			max-width: 280px;
		}

		.cta-button {
			width: 100%;
			justify-content: center;
		}

		.discovery-modal {
			padding: var(--space-7);
			border-radius: 20px;
		}

		.discovery-badge {
			margin-bottom: var(--space-6);
		}

		.discovery-icon-wrapper {
			width: 80px;
			height: 80px;
			margin-bottom: var(--space-6);
		}

		:global(.discovery-icon) {
			width: 36px;
			height: 36px;
		}

		.discovery-title {
			font-size: 1.25rem;
		}

		.discovery-description {
			font-size: var(--text-sm);
		}

		.discovery-actions {
			flex-direction: column;
		}

		.discovery-btn {
			padding: var(--space-4);
		}
	}

	/* Mobile touch support */
	@media (hover: none) {
		.persona-tab:hover {
			color: var(--color-muted-foreground);
		}

		.persona-tab.active:hover {
			color: var(--tab-accent);
		}

		.cta-button:hover {
			transform: none;
		}

		.cta-button.secondary:hover {
			border-color: hsla(0, 0%, 50%, 0.3);
			color: var(--color-muted-foreground);
			background: transparent;
		}
	}

	/* Reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.pain-title,
		.pain-subtitle,
		.cta-group {
			animation: none;
		}

		.background-glow {
			transition: none;
		}
	}
</style>
