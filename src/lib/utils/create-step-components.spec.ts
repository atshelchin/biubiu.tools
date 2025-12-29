/**
 * Tests for createStepComponents utility.
 */

import { describe, it, expect, vi } from 'vitest';
import {
	createStepComponents,
	validateStepComponents,
	type GlobModuleMap
} from './create-step-components';

// Mock Svelte components
const MockComponent1 = { name: 'MockComponent1' };
const MockComponent2 = { name: 'MockComponent2' };
const MockComponent3 = { name: 'MockComponent3' };

describe('createStepComponents', () => {
	describe('basic functionality', () => {
		it('should extract components from module maps', () => {
			const sidebarModules: GlobModuleMap = {
				'./step1-connect-sidebar.svelte': { default: MockComponent1 as never },
				'./step2-configure-sidebar.svelte': { default: MockComponent2 as never },
				'./step3-tokens-sidebar.svelte': { default: MockComponent3 as never }
			};
			const contentModules: GlobModuleMap = {
				'./step1-connect-content.svelte': { default: MockComponent1 as never },
				'./step2-configure-content.svelte': { default: MockComponent2 as never },
				'./step3-tokens-content.svelte': { default: MockComponent3 as never }
			};
			const footerModules: GlobModuleMap = {
				'./step1-connect-footer.svelte': { default: MockComponent1 as never },
				'./step2-configure-footer.svelte': { default: MockComponent2 as never },
				'./step3-tokens-footer.svelte': { default: MockComponent3 as never }
			};

			const result = createStepComponents({
				sidebar: sidebarModules,
				content: contentModules,
				footer: footerModules
			});

			expect(result.sidebar).toHaveLength(3);
			expect(result.content).toHaveLength(3);
			expect(result.footer).toHaveLength(3);
		});

		it('should sort components by step number', () => {
			// Intentionally out of order
			const sidebarModules: GlobModuleMap = {
				'./step3-tokens-sidebar.svelte': { default: MockComponent3 as never },
				'./step1-connect-sidebar.svelte': { default: MockComponent1 as never },
				'./step2-configure-sidebar.svelte': { default: MockComponent2 as never }
			};
			const contentModules: GlobModuleMap = {
				'./step2-configure-content.svelte': { default: MockComponent2 as never },
				'./step3-tokens-content.svelte': { default: MockComponent3 as never },
				'./step1-connect-content.svelte': { default: MockComponent1 as never }
			};
			const footerModules: GlobModuleMap = {
				'./step3-tokens-footer.svelte': { default: MockComponent3 as never },
				'./step2-configure-footer.svelte': { default: MockComponent2 as never },
				'./step1-connect-footer.svelte': { default: MockComponent1 as never }
			};

			const result = createStepComponents({
				sidebar: sidebarModules,
				content: contentModules,
				footer: footerModules
			});

			// Should be sorted by step number
			expect(result.sidebar[0]).toBe(MockComponent1);
			expect(result.sidebar[1]).toBe(MockComponent2);
			expect(result.sidebar[2]).toBe(MockComponent3);

			expect(result.content[0]).toBe(MockComponent1);
			expect(result.content[1]).toBe(MockComponent2);
			expect(result.content[2]).toBe(MockComponent3);

			expect(result.footer[0]).toBe(MockComponent1);
			expect(result.footer[1]).toBe(MockComponent2);
			expect(result.footer[2]).toBe(MockComponent3);
		});

		it('should handle double-digit step numbers correctly', () => {
			const MockComponent10 = { name: 'MockComponent10' };
			const MockComponent11 = { name: 'MockComponent11' };

			const sidebarModules: GlobModuleMap = {
				'./step11-final-sidebar.svelte': { default: MockComponent11 as never },
				'./step10-review-sidebar.svelte': { default: MockComponent10 as never },
				'./step1-connect-sidebar.svelte': { default: MockComponent1 as never }
			};
			const contentModules: GlobModuleMap = {
				'./step11-final-content.svelte': { default: MockComponent11 as never },
				'./step10-review-content.svelte': { default: MockComponent10 as never },
				'./step1-connect-content.svelte': { default: MockComponent1 as never }
			};
			const footerModules: GlobModuleMap = {
				'./step11-final-footer.svelte': { default: MockComponent11 as never },
				'./step10-review-footer.svelte': { default: MockComponent10 as never },
				'./step1-connect-footer.svelte': { default: MockComponent1 as never }
			};

			const result = createStepComponents({
				sidebar: sidebarModules,
				content: contentModules,
				footer: footerModules
			});

			// Should sort numerically, not alphabetically
			// (alphabetically: 1, 10, 11; numerically: 1, 10, 11)
			expect(result.sidebar[0]).toBe(MockComponent1);
			expect(result.sidebar[1]).toBe(MockComponent10);
			expect(result.sidebar[2]).toBe(MockComponent11);
		});
	});

	describe('edge cases', () => {
		it('should handle empty module maps', () => {
			const result = createStepComponents({
				sidebar: {},
				content: {},
				footer: {}
			});

			expect(result.sidebar).toHaveLength(0);
			expect(result.content).toHaveLength(0);
			expect(result.footer).toHaveLength(0);
		});

		it('should warn when component counts mismatch', () => {
			const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

			const sidebarModules: GlobModuleMap = {
				'./step1-connect-sidebar.svelte': { default: MockComponent1 as never }
			};
			const contentModules: GlobModuleMap = {
				'./step1-connect-content.svelte': { default: MockComponent1 as never },
				'./step2-configure-content.svelte': { default: MockComponent2 as never }
			};
			const footerModules: GlobModuleMap = {
				'./step1-connect-footer.svelte': { default: MockComponent1 as never }
			};

			createStepComponents({
				sidebar: sidebarModules,
				content: contentModules,
				footer: footerModules
			});

			expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Component count mismatch'));

			consoleSpy.mockRestore();
		});
	});
});

describe('validateStepComponents', () => {
	it('should pass validation when counts match', () => {
		const components = createStepComponents({
			sidebar: {
				'./step1-sidebar.svelte': { default: MockComponent1 as never },
				'./step2-sidebar.svelte': { default: MockComponent2 as never }
			},
			content: {
				'./step1-content.svelte': { default: MockComponent1 as never },
				'./step2-content.svelte': { default: MockComponent2 as never }
			},
			footer: {
				'./step1-footer.svelte': { default: MockComponent1 as never },
				'./step2-footer.svelte': { default: MockComponent2 as never }
			}
		});

		expect(() => validateStepComponents(components, 2)).not.toThrow();
	});

	it('should throw when sidebar count is wrong', () => {
		const components = createStepComponents({
			sidebar: {
				'./step1-sidebar.svelte': { default: MockComponent1 as never }
			},
			content: {
				'./step1-content.svelte': { default: MockComponent1 as never },
				'./step2-content.svelte': { default: MockComponent2 as never }
			},
			footer: {
				'./step1-footer.svelte': { default: MockComponent1 as never },
				'./step2-footer.svelte': { default: MockComponent2 as never }
			}
		});

		expect(() => validateStepComponents(components, 2)).toThrow(
			'Expected 2 sidebar components, got 1'
		);
	});

	it('should throw when content count is wrong', () => {
		const components = createStepComponents({
			sidebar: {
				'./step1-sidebar.svelte': { default: MockComponent1 as never },
				'./step2-sidebar.svelte': { default: MockComponent2 as never }
			},
			content: {
				'./step1-content.svelte': { default: MockComponent1 as never }
			},
			footer: {
				'./step1-footer.svelte': { default: MockComponent1 as never },
				'./step2-footer.svelte': { default: MockComponent2 as never }
			}
		});

		expect(() => validateStepComponents(components, 2)).toThrow(
			'Expected 2 content components, got 1'
		);
	});

	it('should throw when footer count is wrong', () => {
		const components = createStepComponents({
			sidebar: {
				'./step1-sidebar.svelte': { default: MockComponent1 as never },
				'./step2-sidebar.svelte': { default: MockComponent2 as never }
			},
			content: {
				'./step1-content.svelte': { default: MockComponent1 as never },
				'./step2-content.svelte': { default: MockComponent2 as never }
			},
			footer: {
				'./step1-footer.svelte': { default: MockComponent1 as never }
			}
		});

		expect(() => validateStepComponents(components, 2)).toThrow(
			'Expected 2 footer components, got 1'
		);
	});
});
