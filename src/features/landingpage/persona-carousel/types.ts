/**
 * Persona carousel types
 * 人群轮播组件类型定义
 */

/** Single pain point within a persona */
export interface PainPoint {
	/** i18n key for pain point title */
	titleKey: string;
	/** i18n key for solution subtitle */
	subtitleKey: string;
	/** i18n key for CTA button text */
	ctaKey: string;
	/** Link to the tool */
	link: string;
}

/** Theme colors for a persona */
export interface PersonaTheme {
	/** Primary accent color (CSS color value) */
	accent: string;
	/** Background gradient start color */
	gradientFrom: string;
	/** Background gradient end color */
	gradientTo: string;
	/** Glow color for buttons and highlights */
	glow: string;
}

/** Persona group (e.g., Data Analyst, Developer, Airdrop Hunter) */
export interface Persona {
	/** Unique identifier */
	id: string;
	/** i18n key for persona tab label */
	labelKey: string;
	/** Icon name from lucide-svelte */
	icon: string;
	/** Theme colors */
	theme: PersonaTheme;
	/** Pain points for this persona */
	painPoints: PainPoint[];
	/** i18n keys for bottom tags */
	tagKeys: string[];
}

/** Carousel configuration */
export interface CarouselConfig {
	/** Auto-rotate interval in milliseconds (default: 6000) */
	interval: number;
	/** Pause duration after user interaction before resuming (default: 5000) */
	resumeDelay: number;
	/** Enable auto-rotation (default: true) */
	autoPlay: boolean;
}

/** Carousel state */
export interface CarouselState {
	/** Current persona index */
	personaIndex: number;
	/** Current pain point index within the persona */
	painPointIndex: number;
	/** Whether auto-rotation is paused */
	isPaused: boolean;
	/** Whether user has manually interacted */
	hasInteracted: boolean;
	/** Progress percentage (0-100) for current slide */
	progress: number;
}
