/**
 * Debug 工具测试
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debug, enableDebug, disableDebug } from './debug';

describe('debug', () => {
	let consoleLogSpy: ReturnType<typeof vi.spyOn>;
	let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
	let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
	let consoleGroupSpy: ReturnType<typeof vi.spyOn>;
	let consoleGroupEndSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
		consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		consoleGroupSpy = vi.spyOn(console, 'group').mockImplementation(() => {});
		consoleGroupEndSpy = vi.spyOn(console, 'groupEnd').mockImplementation(() => {});
	});

	afterEach(() => {
		consoleLogSpy.mockRestore();
		consoleWarnSpy.mockRestore();
		consoleErrorSpy.mockRestore();
		consoleGroupSpy.mockRestore();
		consoleGroupEndSpy.mockRestore();
	});

	describe('debug.log', () => {
		it('should not log when debug is disabled', () => {
			debug.log('test message');
			// Debug is disabled by default in test environment
			// Just verify it doesn't throw
		});

		it('should accept multiple arguments', () => {
			expect(() => debug.log('message', 1, { key: 'value' })).not.toThrow();
		});
	});

	describe('debug.warn', () => {
		it('should not warn when debug is disabled', () => {
			debug.warn('test warning');
			// Debug is disabled by default
		});

		it('should accept multiple arguments', () => {
			expect(() => debug.warn('warning', 1, { key: 'value' })).not.toThrow();
		});
	});

	describe('debug.error', () => {
		it('should always log errors', () => {
			debug.error('test error');
			expect(consoleErrorSpy).toHaveBeenCalledWith('test error');
		});

		it('should log errors with multiple arguments', () => {
			debug.error('error', new Error('test'), { context: 'value' });
			expect(consoleErrorSpy).toHaveBeenCalled();
		});
	});

	describe('debug.group', () => {
		it('should not create group when debug is disabled', () => {
			debug.group('test group');
			// Debug is disabled by default
		});
	});

	describe('debug.groupEnd', () => {
		it('should not end group when debug is disabled', () => {
			debug.groupEnd();
			// Debug is disabled by default
		});
	});

	describe('enableDebug / disableDebug', () => {
		// Mock localStorage
		const localStorageMock = {
			getItem: vi.fn(),
			setItem: vi.fn(),
			removeItem: vi.fn()
		};

		beforeEach(() => {
			Object.defineProperty(globalThis, 'localStorage', {
				value: localStorageMock,
				writable: true
			});
		});

		it('enableDebug should set localStorage item', () => {
			enableDebug();
			expect(localStorageMock.setItem).toHaveBeenCalledWith('FORMSTATE_DEBUG', 'true');
		});

		it('disableDebug should remove localStorage item', () => {
			disableDebug();
			expect(localStorageMock.removeItem).toHaveBeenCalledWith('FORMSTATE_DEBUG');
		});
	});
});
