<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import confetti from 'canvas-confetti';
	import { Dices, Sparkles, ArrowRight } from '@lucide/svelte';
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
		// Allow extra properties from tools-data.ts
		titleKey?: string;
		descriptionKey?: string;
		featureKeys?: string[];
	}

	interface Props {
		tools: Tool[];
	}

	let { tools }: Props = $props();

	const i18n = useI18n();
	const t = i18n.t;

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

	// 1. Button click feedback - short crisp click
	function playClickSound() {
		try {
			const ctx = getAudioContext();
			const now = ctx.currentTime;

			// Short crisp click sound
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

	// 2. Whoosh sound - dice entering from above
	function playWhooshSound() {
		try {
			const ctx = getAudioContext();
			const now = ctx.currentTime;

			// White noise for whoosh effect
			const bufferSize = ctx.sampleRate * 0.4;
			const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
			const data = buffer.getChannelData(0);
			for (let i = 0; i < bufferSize; i++) {
				data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
			}

			const noise = ctx.createBufferSource();
			noise.buffer = buffer;

			// Bandpass filter for swoosh character
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

	// 3. Rolling sound - dice tumbling in air
	function playRollingSound() {
		try {
			const ctx = getAudioContext();
			const now = ctx.currentTime;

			// Multiple clicks simulating dice rolling
			for (let i = 0; i < 15; i++) {
				const osc = ctx.createOscillator();
				const gain = ctx.createGain();

				osc.connect(gain);
				gain.connect(ctx.destination);

				// Varied frequencies for natural rolling sound
				osc.frequency.value = 150 + Math.random() * 350;
				osc.type = 'triangle';

				// Spread clicks over rolling duration, getting slower near end
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

	// 4. Subtle "ding" when dice settles - gentle completion indicator
	function playLandingSound() {
		try {
			const ctx = getAudioContext();
			const now = ctx.currentTime;

			// Soft chime/ding to indicate dice has settled
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();

			osc.connect(gain);
			gain.connect(ctx.destination);

			// Pleasant high frequency chime
			osc.frequency.value = 880; // A5 note
			osc.type = 'sine';

			gain.gain.setValueAtTime(0, now);
			gain.gain.linearRampToValueAtTime(0.1, now + 0.01);
			gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

			osc.start(now);
			osc.stop(now + 0.35);

			// Add a subtle harmonic
			const osc2 = ctx.createOscillator();
			const gain2 = ctx.createGain();

			osc2.connect(gain2);
			gain2.connect(ctx.destination);

			osc2.frequency.value = 1320; // E6 - perfect fifth above
			osc2.type = 'sine';

			gain2.gain.setValueAtTime(0, now + 0.02);
			gain2.gain.linearRampToValueAtTime(0.05, now + 0.03);
			gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

			osc2.start(now + 0.02);
			osc2.stop(now + 0.3);
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

		// Immediate click feedback
		playClickSound();

		isShaking = true;
		showDice3D = true;
	}

	function onDiceAnimationStart() {
		// Whoosh as dice enters screen + rolling sounds
		playWhooshSound();
		// Delay rolling sound slightly to match dice becoming visible
		setTimeout(() => playRollingSound(), 150);
	}

	function onDiceLanding() {
		// Landing thud when dice settles
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

		// Initial burst - reduced particle count for quicker effect
		myConfetti({
			particleCount: 60,
			spread: 60,
			origin: { x: 0.5, y: 0.5 },
			colors: ['#F59E0B', '#EC4899', '#8B5CF6', '#10B981', '#3B82F6'],
			startVelocity: 40,
			gravity: 1.5
		});

		// Shortened duration so users can focus on the discovered tool faster
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
</script>

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
					<!-- <div class="discovery-icon-ring"></div> -->
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
		z-index: 1;
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

	.discovery-icon-ring {
		position: absolute;
		inset: -8px;
		border: 2px solid color-mix(in srgb, var(--tool-color) 40%, transparent);
		border-radius: 20px;
		animation: ringRotate 8s linear infinite;
	}

	@keyframes ringRotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
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

	/* Mobile adjustments */
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

		.discovery-icon-ring {
			inset: -6px;
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
</style>
