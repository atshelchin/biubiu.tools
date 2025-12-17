<script lang="ts">
	import { onDestroy } from 'svelte';
	import * as THREE from 'three';
	import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

	interface Props {
		visible: boolean;
		onComplete: () => void;
		onAnimationStart?: () => void;
		onLanding?: () => void;
	}

	let { visible, onComplete, onAnimationStart, onLanding }: Props = $props();

	let container: HTMLDivElement | undefined = $state();
	let scene: THREE.Scene | undefined;
	let camera: THREE.PerspectiveCamera | undefined;
	let renderer: THREE.WebGLRenderer | undefined;
	let dice: THREE.Mesh | undefined;
	let glowMesh: THREE.Mesh | undefined;
	let animationId: number | undefined;

	// Theme colors
	const COLORS = {
		primary: '#8B5CF6', // Purple
		secondary: '#EC4899', // Pink
		accent: '#F59E0B', // Amber
		gradientStart: '#a855f7',
		gradientEnd: '#ec4899',
		dotColor: '#1e1b4b', // Dark purple
		glowColor: '#c084fc'
	};

	// Create gradient dice texture with dots
	function createDiceTexture(dots: number): THREE.CanvasTexture {
		const canvas = document.createElement('canvas');
		canvas.width = 512;
		canvas.height = 512;
		const ctx = canvas.getContext('2d')!;

		// Beautiful gradient background
		const gradient = ctx.createLinearGradient(0, 0, 512, 512);
		gradient.addColorStop(0, '#f3e8ff'); // Light purple
		gradient.addColorStop(0.5, '#fce7f3'); // Light pink
		gradient.addColorStop(1, '#fef3c7'); // Light amber

		// Fill with gradient
		ctx.fillStyle = gradient;
		ctx.beginPath();
		ctx.roundRect(0, 0, 512, 512, 40);
		ctx.fill();

		// Subtle inner glow
		const innerGlow = ctx.createRadialGradient(256, 256, 0, 256, 256, 350);
		innerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
		innerGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
		ctx.fillStyle = innerGlow;
		ctx.fillRect(0, 0, 512, 512);

		// Border with gradient
		const borderGradient = ctx.createLinearGradient(0, 0, 512, 512);
		borderGradient.addColorStop(0, COLORS.primary);
		borderGradient.addColorStop(1, COLORS.secondary);
		ctx.strokeStyle = borderGradient;
		ctx.lineWidth = 12;
		ctx.beginPath();
		ctx.roundRect(6, 6, 500, 500, 35);
		ctx.stroke();

		// Dots with gradient fill
		const dotGradient = ctx.createLinearGradient(0, 0, 512, 512);
		dotGradient.addColorStop(0, '#6d28d9'); // Violet-700
		dotGradient.addColorStop(1, '#be185d'); // Pink-700

		const dotRadius = 38;
		const positions: Record<number, [number, number][]> = {
			1: [[256, 256]],
			2: [
				[128, 128],
				[384, 384]
			],
			3: [
				[128, 128],
				[256, 256],
				[384, 384]
			],
			4: [
				[128, 128],
				[384, 128],
				[128, 384],
				[384, 384]
			],
			5: [
				[128, 128],
				[384, 128],
				[256, 256],
				[128, 384],
				[384, 384]
			],
			6: [
				[128, 128],
				[128, 256],
				[128, 384],
				[384, 128],
				[384, 256],
				[384, 384]
			]
		};

		positions[dots].forEach(([x, y]) => {
			// Dot shadow
			ctx.beginPath();
			ctx.arc(x + 3, y + 3, dotRadius, 0, Math.PI * 2);
			ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
			ctx.fill();

			// Main dot with gradient
			ctx.beginPath();
			ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
			ctx.fillStyle = dotGradient;
			ctx.fill();

			// Dot highlight
			ctx.beginPath();
			ctx.arc(x - 8, y - 8, dotRadius * 0.4, 0, Math.PI * 2);
			ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
			ctx.fill();
		});

		const texture = new THREE.CanvasTexture(canvas);
		texture.colorSpace = THREE.SRGBColorSpace;
		return texture;
	}

	function initScene() {
		if (!container) return;

		// Scene
		scene = new THREE.Scene();

		// Camera - adjust for mobile screens
		const isMobile = window.innerWidth < 768;
		const fov = isMobile ? 70 : 60; // Wider FOV on mobile to see dice better
		camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera.position.z = isMobile ? 6 : 5; // Further back on mobile

		// Renderer with better quality
		renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
			powerPreference: 'high-performance'
		});
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setClearColor(0x000000, 0);
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
		renderer.toneMappingExposure = 1.2;
		// eslint-disable-next-line svelte/no-dom-manipulating
		container.appendChild(renderer.domElement);

		// Enhanced lighting
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
		scene.add(ambientLight);

		// Main directional light
		const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
		mainLight.position.set(5, 8, 5);
		mainLight.castShadow = true;
		scene.add(mainLight);

		// Purple accent light
		const purpleLight = new THREE.PointLight(0x8b5cf6, 1, 15);
		purpleLight.position.set(-4, 4, 4);
		scene.add(purpleLight);

		// Pink accent light
		const pinkLight = new THREE.PointLight(0xec4899, 0.8, 15);
		pinkLight.position.set(4, -4, 4);
		scene.add(pinkLight);

		// Amber back light
		const amberLight = new THREE.PointLight(0xf59e0b, 0.5, 12);
		amberLight.position.set(0, 0, -5);
		scene.add(amberLight);

		// Create rounded dice with beautiful geometry
		const geometry = new RoundedBoxGeometry(1.8, 1.8, 1.8, 6, 0.15);

		// Materials for each face with enhanced look
		const materials = [
			new THREE.MeshPhysicalMaterial({
				map: createDiceTexture(1),
				roughness: 0.2,
				metalness: 0.1,
				clearcoat: 0.8,
				clearcoatRoughness: 0.2
			}),
			new THREE.MeshPhysicalMaterial({
				map: createDiceTexture(6),
				roughness: 0.2,
				metalness: 0.1,
				clearcoat: 0.8,
				clearcoatRoughness: 0.2
			}),
			new THREE.MeshPhysicalMaterial({
				map: createDiceTexture(2),
				roughness: 0.2,
				metalness: 0.1,
				clearcoat: 0.8,
				clearcoatRoughness: 0.2
			}),
			new THREE.MeshPhysicalMaterial({
				map: createDiceTexture(5),
				roughness: 0.2,
				metalness: 0.1,
				clearcoat: 0.8,
				clearcoatRoughness: 0.2
			}),
			new THREE.MeshPhysicalMaterial({
				map: createDiceTexture(3),
				roughness: 0.2,
				metalness: 0.1,
				clearcoat: 0.8,
				clearcoatRoughness: 0.2
			}),
			new THREE.MeshPhysicalMaterial({
				map: createDiceTexture(4),
				roughness: 0.2,
				metalness: 0.1,
				clearcoat: 0.8,
				clearcoatRoughness: 0.2
			})
		];

		dice = new THREE.Mesh(geometry, materials);
		scene.add(dice);

		// Add glow effect
		const glowGeometry = new RoundedBoxGeometry(2.0, 2.0, 2.0, 4, 0.2);
		const glowMaterial = new THREE.MeshBasicMaterial({
			color: new THREE.Color(COLORS.glowColor),
			transparent: true,
			opacity: 0.15,
			side: THREE.BackSide
		});
		glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
		scene.add(glowMesh);

		// Handle resize
		const handleResize = () => {
			if (!camera || !renderer) return;
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		};
		window.addEventListener('resize', handleResize);
	}

	function animateDice() {
		if (!dice || !scene || !camera || !renderer || !glowMesh) return;

		// Single smooth animation - dice tumbles in from above and gradually slows down
		const duration = 2800; // ms
		const startTime = Date.now();

		// Random target rotation (multiple full rotations)
		const targetRotationX = Math.PI * (8 + Math.random() * 6);
		const targetRotationY = Math.PI * (8 + Math.random() * 6);
		const targetRotationZ = Math.PI * (4 + Math.random() * 3);

		// Starting position (off-screen top)
		dice.position.set(0, 8, 0);
		dice.rotation.set(0, 0, 0);
		dice.scale.set(0.3, 0.3, 0.3);
		glowMesh.position.copy(dice.position);
		glowMesh.scale.copy(dice.scale);

		// Trigger animation start callback for sound sync
		onAnimationStart?.();

		const animate = () => {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);

			// Custom easing - fast at start, very gradual slowdown
			const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
			const easeProgress = easeOutQuart(progress);

			// Scale up smoothly
			const scale = 0.3 + 0.8 * easeProgress;
			dice!.scale.set(scale, scale, scale);
			glowMesh!.scale.set(scale * 1.1, scale * 1.1, scale * 1.1);

			// Position - smooth descent to center
			const yPos = 8 * (1 - easeProgress);
			dice!.position.y = yPos;
			glowMesh!.position.y = yPos;

			// Rotation - continuous tumbling that gradually slows
			// Use a different easing for rotation to make it feel more natural
			const rotEase = 1 - Math.pow(1 - progress, 3);
			dice!.rotation.x = targetRotationX * rotEase;
			dice!.rotation.y = targetRotationY * rotEase;
			dice!.rotation.z = targetRotationZ * rotEase;
			glowMesh!.rotation.copy(dice!.rotation);

			// Pulsing glow effect
			const glowPulse = 0.12 + 0.08 * Math.sin(elapsed * 0.01);
			(glowMesh!.material as THREE.MeshBasicMaterial).opacity = glowPulse;

			renderer!.render(scene!, camera!);

			if (progress < 1) {
				animationId = requestAnimationFrame(animate);
			} else {
				// Brief pause at the end before completing
				onLanding?.();
				animateIdle();
			}
		};

		// Brief idle animation before complete
		const animateIdle = () => {
			const idleStart = Date.now();
			const idleDuration = 500;

			const idleAnimate = () => {
				const idleElapsed = Date.now() - idleStart;
				const idleProgress = idleElapsed / idleDuration;

				if (idleProgress < 1) {
					// Very subtle floating motion
					dice!.rotation.x += Math.sin(idleElapsed * 0.012) * 0.0008;
					dice!.rotation.y += Math.cos(idleElapsed * 0.01) * 0.0008;
					glowMesh!.rotation.copy(dice!.rotation);

					// Glow pulse
					const glowPulse = 0.15 + 0.1 * Math.sin(idleElapsed * 0.015);
					(glowMesh!.material as THREE.MeshBasicMaterial).opacity = glowPulse;

					renderer!.render(scene!, camera!);
					animationId = requestAnimationFrame(idleAnimate);
				} else {
					onComplete();
				}
			};

			idleAnimate();
		};

		animate();
	}

	function cleanup() {
		if (animationId) {
			cancelAnimationFrame(animationId);
		}
		if (renderer && container && renderer.domElement.parentNode === container) {
			// eslint-disable-next-line svelte/no-dom-manipulating
			container.removeChild(renderer.domElement);
			renderer.dispose();
		}
		if (dice) {
			dice.geometry.dispose();
			if (Array.isArray(dice.material)) {
				dice.material.forEach((m) => {
					const material = m as THREE.MeshPhysicalMaterial;
					if (material.map) material.map.dispose();
					material.dispose();
				});
			}
		}
		if (glowMesh) {
			glowMesh.geometry.dispose();
			(glowMesh.material as THREE.Material).dispose();
		}
		scene = undefined;
		camera = undefined;
		renderer = undefined;
		dice = undefined;
		glowMesh = undefined;
	}

	$effect(() => {
		if (visible && container && !scene) {
			initScene();
			animateDice();
		} else if (!visible && scene) {
			cleanup();
		}
	});

	onDestroy(() => {
		cleanup();
	});
</script>

{#if visible}
	<div class="dice-overlay">
		<div class="dice-container" bind:this={container}></div>
		<div class="dice-hint">Rolling...</div>
	</div>
{/if}

<style>
	.dice-overlay {
		position: fixed;
		inset: 0;
		background: radial-gradient(
			ellipse at center,
			rgba(139, 92, 246, 0.15) 0%,
			rgba(0, 0, 0, 0.85) 100%
		);
		backdrop-filter: blur(12px);
		z-index: 1001;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
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

	.dice-container {
		width: 100%;
		height: 100%;
		position: absolute;
		inset: 0;
	}

	.dice-container :global(canvas) {
		display: block;
	}

	.dice-hint {
		position: absolute;
		bottom: 15%;
		left: 50%;
		transform: translateX(-50%);
		font-size: 1.25rem;
		font-weight: 600;
		color: white;
		text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
		animation: pulse 1s ease-in-out infinite;
		letter-spacing: 0.1em;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.6;
		}
		50% {
			opacity: 1;
		}
	}
</style>
