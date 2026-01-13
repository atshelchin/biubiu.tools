/**
 * Carousel composable - reusable carousel logic
 * 轮播逻辑 composable - 可复用的轮播核心逻辑
 */

import { untrack } from 'svelte';
import type { CarouselConfig, CarouselState, Persona } from './types';
import { DEFAULT_CAROUSEL_CONFIG } from './data';

export interface UseCarouselOptions {
	personas: Persona[];
	config?: Partial<CarouselConfig>;
	onPersonaChange?: (index: number) => void;
	onPainPointChange?: (personaIndex: number, painPointIndex: number) => void;
}

export interface UseCarouselReturn {
	/** Current state */
	state: CarouselState;
	/** Current persona */
	currentPersona: Persona;
	/** Go to specific persona */
	goToPersona: (index: number) => void;
	/** Go to specific pain point within current persona */
	goToPainPoint: (index: number) => void;
	/** Go to next slide (pain point or persona) */
	next: () => void;
	/** Go to previous slide */
	previous: () => void;
	/** Pause auto-rotation */
	pause: () => void;
	/** Resume auto-rotation */
	resume: () => void;
	/** Handle mouse enter (pause on hover) */
	handleMouseEnter: () => void;
	/** Handle mouse leave (resume after delay) */
	handleMouseLeave: () => void;
	/** Start the carousel */
	start: () => void;
	/** Stop the carousel completely */
	stop: () => void;
}

/**
 * Creates a carousel controller with auto-rotation and user interaction support
 */
export function useCarousel(options: UseCarouselOptions): UseCarouselReturn {
	const { personas, config: userConfig, onPersonaChange, onPainPointChange } = options;

	const config: CarouselConfig = {
		...DEFAULT_CAROUSEL_CONFIG,
		...userConfig
	};

	// Reactive state
	// eslint-disable-next-line prefer-const
	let state = $state<CarouselState>({
		personaIndex: 0,
		painPointIndex: 0,
		isPaused: false,
		hasInteracted: false,
		progress: 0
	});

	// Derived current persona
	const currentPersona = $derived(personas[state.personaIndex]);

	// Timer references
	let progressInterval: ReturnType<typeof setInterval> | null = null;
	let resumeTimeout: ReturnType<typeof setTimeout> | null = null;

	// Progress update frequency (60fps-ish for smooth animation)
	const PROGRESS_UPDATE_INTERVAL = 50; // ms
	const progressStep = (PROGRESS_UPDATE_INTERVAL / config.interval) * 100;

	/**
	 * Clear all timers
	 */
	function clearTimers(): void {
		if (progressInterval) {
			clearInterval(progressInterval);
			progressInterval = null;
		}
		if (resumeTimeout) {
			clearTimeout(resumeTimeout);
			resumeTimeout = null;
		}
	}

	/**
	 * Start progress timer
	 */
	function startProgressTimer(): void {
		if (progressInterval) return;

		progressInterval = setInterval(() => {
			if (state.isPaused) return;

			state.progress += progressStep;

			if (state.progress >= 100) {
				state.progress = 0;
				next();
			}
		}, PROGRESS_UPDATE_INTERVAL);
	}

	/**
	 * Go to next slide
	 */
	function next(): void {
		const currentPainPoints = untrack(() => personas[state.personaIndex].painPoints);
		const isLastPainPoint = state.painPointIndex >= currentPainPoints.length - 1;

		if (isLastPainPoint) {
			// Move to next persona
			const nextPersonaIndex = (state.personaIndex + 1) % personas.length;
			state.personaIndex = nextPersonaIndex;
			state.painPointIndex = 0;
			onPersonaChange?.(nextPersonaIndex);
		} else {
			// Move to next pain point
			state.painPointIndex += 1;
		}

		state.progress = 0;
		onPainPointChange?.(state.personaIndex, state.painPointIndex);
	}

	/**
	 * Go to previous slide
	 */
	function previous(): void {
		if (state.painPointIndex > 0) {
			state.painPointIndex -= 1;
		} else {
			// Move to previous persona's last pain point
			const prevPersonaIndex = (state.personaIndex - 1 + personas.length) % personas.length;
			state.personaIndex = prevPersonaIndex;
			state.painPointIndex = personas[prevPersonaIndex].painPoints.length - 1;
			onPersonaChange?.(prevPersonaIndex);
		}

		state.progress = 0;
		onPainPointChange?.(state.personaIndex, state.painPointIndex);
	}

	/**
	 * Go to specific persona
	 */
	function goToPersona(index: number): void {
		if (index < 0 || index >= personas.length) return;

		state.personaIndex = index;
		state.painPointIndex = 0;
		state.progress = 0;
		state.hasInteracted = true;

		// Stop auto-play when user interacts
		pause();
		scheduleResume();

		onPersonaChange?.(index);
		onPainPointChange?.(index, 0);
	}

	/**
	 * Go to specific pain point within current persona
	 */
	function goToPainPoint(index: number): void {
		const maxIndex = personas[state.personaIndex].painPoints.length - 1;
		if (index < 0 || index > maxIndex) return;

		state.painPointIndex = index;
		state.progress = 0;
		state.hasInteracted = true;

		// Stop auto-play when user interacts
		pause();
		scheduleResume();

		onPainPointChange?.(state.personaIndex, index);
	}

	/**
	 * Pause auto-rotation
	 */
	function pause(): void {
		state.isPaused = true;
	}

	/**
	 * Resume auto-rotation
	 */
	function resume(): void {
		state.isPaused = false;
		state.progress = 0;
	}

	/**
	 * Schedule resume after delay
	 */
	function scheduleResume(): void {
		if (resumeTimeout) {
			clearTimeout(resumeTimeout);
		}

		resumeTimeout = setTimeout(() => {
			if (config.autoPlay) {
				resume();
			}
		}, config.resumeDelay);
	}

	/**
	 * Handle mouse enter - pause on hover
	 */
	function handleMouseEnter(): void {
		pause();
		if (resumeTimeout) {
			clearTimeout(resumeTimeout);
			resumeTimeout = null;
		}
	}

	/**
	 * Handle mouse leave - resume after delay
	 */
	function handleMouseLeave(): void {
		if (config.autoPlay) {
			scheduleResume();
		}
	}

	/**
	 * Start the carousel
	 */
	function start(): void {
		if (config.autoPlay) {
			startProgressTimer();
		}
	}

	/**
	 * Stop the carousel completely
	 */
	function stop(): void {
		clearTimers();
		state.isPaused = true;
	}

	return {
		get state() {
			return state;
		},
		get currentPersona() {
			return currentPersona;
		},
		goToPersona,
		goToPainPoint,
		next,
		previous,
		pause,
		resume,
		handleMouseEnter,
		handleMouseLeave,
		start,
		stop
	};
}
