/**
 * Scroll Depth Tracking Composable
 *
 * Tracks when users scroll to different sections of the page.
 * Uses Intersection Observer for efficient tracking.
 */

import { onMount, onDestroy } from 'svelte';
import { browser } from '$app/environment';
import { trackScrollDepth, type SectionName, SECTIONS } from './index';

interface SectionConfig {
	id: string;
	name: SectionName;
}

/**
 * Default section configuration for landing page
 * Note: Section ids must match the actual DOM element ids
 */
export const LANDING_SECTIONS: SectionConfig[] = [
	{ id: 'hero', name: SECTIONS.HERO },
	{ id: 'persona-carousel', name: SECTIONS.PERSONA },
	{ id: 'tools', name: SECTIONS.FEATURES },
	{ id: 'cta', name: SECTIONS.CTA },
	{ id: 'faqs', name: SECTIONS.FAQ }
];

/**
 * Create scroll tracking for a page
 *
 * @param sections - Array of section configs to track
 * @param threshold - Visibility threshold (0-1), default 0.5 (50% visible)
 */
export function useScrollTracking(
	sections: SectionConfig[] = LANDING_SECTIONS,
	threshold: number = 0.5
) {
	// Track which sections have been viewed (only fire once per session)
	const viewedSections = new Set<SectionName>();
	let observer: IntersectionObserver | null = null;

	function init() {
		if (!browser) return;

		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (!entry.isIntersecting) return;

					const sectionId = entry.target.id;
					const section = sections.find((s) => s.id === sectionId);

					if (!section) return;

					// Only track first view
					if (viewedSections.has(section.name)) return;
					viewedSections.add(section.name);

					// Calculate approximate scroll percent
					const scrollPercent = Math.round(
						((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
					);

					trackScrollDepth(section.name, scrollPercent);
				});
			},
			{ threshold }
		);

		// Observe all sections
		sections.forEach((section) => {
			const element = document.getElementById(section.id);
			if (element) {
				observer!.observe(element);
			}
		});
	}

	function cleanup() {
		if (observer) {
			observer.disconnect();
			observer = null;
		}
	}

	// Setup lifecycle
	onMount(() => {
		init();
	});

	onDestroy(() => {
		cleanup();
	});

	return {
		/** Manually reset viewed sections (for testing) */
		reset: () => viewedSections.clear(),
		/** Get currently viewed sections */
		getViewedSections: () => Array.from(viewedSections)
	};
}
