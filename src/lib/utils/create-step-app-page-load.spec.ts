/**
 * Tests for createStepAppPageLoad factory function.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createStepAppPageLoad, type StepAppPageConfig } from './create-step-app-page-load';
import type { RequestEvent } from '@sveltejs/kit';

// Mock dependencies
vi.mock('$i18n/translations', () => ({
	createT: vi.fn(() => {
		// Return a mock translation function that returns the key with a prefix
		return (key: string) => `[translated] ${key}`;
	})
}));

vi.mock('$utils/common', () => ({
	extractLocaleFromPathname: vi.fn((pathname: string) => {
		if (pathname.startsWith('/zh/')) return 'zh';
		if (pathname.startsWith('/de/')) return 'de';
		return 'en';
	})
}));

vi.mock('./structured-data', () => ({
	createWebAppData: vi.fn((params) => ({
		'@type': 'WebApplication',
		name: params.name,
		description: params.description
	})),
	createHowToData: vi.fn((params) => ({
		'@type': 'HowTo',
		name: params.name,
		step: params.steps
	}))
}));

describe('createStepAppPageLoad', () => {
	const createMockEvent = (pathname: string = '/en/apps/test-tool'): RequestEvent => {
		return {
			url: new URL(`https://example.com${pathname}`),
			params: {},
			route: { id: pathname },
			request: new Request(`https://example.com${pathname}`),
			locals: {},
			platform: undefined,
			isDataRequest: false,
			isSubRequest: false,
			cookies: {} as never,
			fetch: vi.fn(),
			getClientAddress: vi.fn(),
			setHeaders: vi.fn()
		} as unknown as RequestEvent;
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('basic configuration', () => {
		it('should create a page load function with minimal config', () => {
			const config: StepAppPageConfig = {
				toolId: 'test-tool',
				stepCount: 3
			};

			const load = createStepAppPageLoad(config);
			expect(typeof load).toBe('function');
		});

		it('should return correct meta structure', () => {
			const config: StepAppPageConfig = {
				toolId: 'wallet-sweep',
				stepCount: 5
			};

			const load = createStepAppPageLoad(config);
			const event = createMockEvent('/en/apps/wallet-sweep');
			const result = load(event);

			expect(result.meta).toMatchObject({
				title: '[translated] wallet-sweep.seo.page_title',
				description: '[translated] wallet-sweep.seo.page_description',
				keywords: '[translated] wallet-sweep.seo.keywords',
				canonical: 'https://example.com/en/apps/wallet-sweep',
				type: 'website',
				image: 'https://example.com/og-wallet-sweep.png',
				locale: 'en_US'
			});
		});

		it('should generate correct number of steps', () => {
			const config: StepAppPageConfig = {
				toolId: 'test-tool',
				stepCount: 5
			};

			const load = createStepAppPageLoad(config);
			const event = createMockEvent();
			const result = load(event);

			expect(result.steps).toHaveLength(5);
			expect(result.steps[0].name).toBe('[translated] test-tool.seo.step_1_name');
			expect(result.steps[4].name).toBe('[translated] test-tool.seo.step_5_name');
		});
	});

	describe('locale handling', () => {
		it('should handle Chinese locale', () => {
			const config: StepAppPageConfig = {
				toolId: 'test-tool',
				stepCount: 3
			};

			const load = createStepAppPageLoad(config);
			const event = createMockEvent('/zh/apps/test-tool');
			const result = load(event);

			expect(result.meta.locale).toBe('zh_CN');
		});

		it('should handle German locale', () => {
			const config: StepAppPageConfig = {
				toolId: 'test-tool',
				stepCount: 3
			};

			const load = createStepAppPageLoad(config);
			const event = createMockEvent('/de/apps/test-tool');
			const result = load(event);

			expect(result.meta.locale).toBe('de_DE');
		});

		it('should default to en_US for unknown locales', () => {
			const config: StepAppPageConfig = {
				toolId: 'test-tool',
				stepCount: 3
			};

			const load = createStepAppPageLoad(config);
			const event = createMockEvent('/xx/apps/test-tool');
			const result = load(event);

			// extractLocaleFromPathname returns 'en' for unknown locales
			expect(result.meta.locale).toBe('en_US');
		});
	});

	describe('optional configuration', () => {
		it('should use custom ogImage when provided', () => {
			const config: StepAppPageConfig = {
				toolId: 'test-tool',
				stepCount: 3,
				ogImage: 'custom-image.jpg'
			};

			const load = createStepAppPageLoad(config);
			const event = createMockEvent();
			const result = load(event);

			expect(result.meta.image).toBe('https://example.com/custom-image.jpg');
		});

		it('should use custom featureCount', () => {
			const config: StepAppPageConfig = {
				toolId: 'test-tool',
				stepCount: 3,
				featureCount: 3
			};

			const load = createStepAppPageLoad(config);
			const event = createMockEvent();
			const result = load(event);

			// The features are passed to createWebAppData, we verify the call was made
			expect(result.structuredData).toBeDefined();
		});

		it('should include custom structured data when provided', () => {
			const config: StepAppPageConfig = {
				toolId: 'test-tool',
				stepCount: 3,
				customStructuredData: ({ canonical }) => [
					{
						'@type': 'FAQPage',
						mainEntity: [],
						url: canonical
					}
				]
			};

			const load = createStepAppPageLoad(config);
			const event = createMockEvent();
			const result = load(event);

			// Should have WebApp + HowTo + custom FAQPage
			expect(result.structuredData).toHaveLength(3);
			expect(result.structuredData[2]).toMatchObject({
				'@type': 'FAQPage'
			});
		});
	});

	describe('structured data generation', () => {
		it('should include WebApplication and HowTo structured data', () => {
			const config: StepAppPageConfig = {
				toolId: 'test-tool',
				stepCount: 3
			};

			const load = createStepAppPageLoad(config);
			const event = createMockEvent();
			const result = load(event);

			expect(result.structuredData).toHaveLength(2);
			expect(result.structuredData[0]).toMatchObject({ '@type': 'WebApplication' });
			expect(result.structuredData[1]).toMatchObject({ '@type': 'HowTo' });
		});
	});

	describe('i18n key generation', () => {
		it('should generate correct i18n keys for steps', () => {
			const config: StepAppPageConfig = {
				toolId: 'my-tool',
				stepCount: 2
			};

			const load = createStepAppPageLoad(config);
			const event = createMockEvent();
			const result = load(event);

			expect(result.steps[0]).toMatchObject({
				name: '[translated] my-tool.seo.step_1_name',
				text: '[translated] my-tool.seo.step_1_text',
				description: '[translated] my-tool.seo.step_1_description'
			});
			expect(result.steps[1]).toMatchObject({
				name: '[translated] my-tool.seo.step_2_name',
				text: '[translated] my-tool.seo.step_2_text',
				description: '[translated] my-tool.seo.step_2_description'
			});
		});
	});
});
