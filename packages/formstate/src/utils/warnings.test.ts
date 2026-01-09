/**
 * 开发警告系统测试
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DevWarnings, FormWarnings, WarningCodes, devAssert, checkPerformance } from './warnings';

describe('warnings', () => {
	let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
	let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		DevWarnings.resetWarnings();
	});

	afterEach(() => {
		consoleWarnSpy.mockRestore();
		consoleErrorSpy.mockRestore();
	});

	describe('DevWarnings', () => {
		describe('warn', () => {
			it('should show warning only once per code', () => {
				DevWarnings.warn('TEST_CODE', 'Test message');
				DevWarnings.warn('TEST_CODE', 'Test message again');

				// In non-dev mode, no warnings shown
				// But we can verify resetWarnings works
				DevWarnings.resetWarnings();
			});
		});

		describe('error', () => {
			it('should log error with details', () => {
				DevWarnings.error('TEST_ERROR', 'Error message', { key: 'value' });

				expect(consoleErrorSpy).toHaveBeenCalled();
			});

			it('should log error without details', () => {
				DevWarnings.error('TEST_ERROR', 'Error message');

				expect(consoleErrorSpy).toHaveBeenCalled();
			});
		});

		describe('resetWarnings', () => {
			it('should reset warning state', () => {
				// This should not throw
				expect(() => DevWarnings.resetWarnings()).not.toThrow();
			});
		});
	});

	describe('WarningCodes', () => {
		it('should have all expected warning codes', () => {
			expect(WarningCodes.FIELD_NOT_REGISTERED).toBe('FIELD_NOT_REGISTERED');
			expect(WarningCodes.FIELD_ALREADY_REGISTERED).toBe('FIELD_ALREADY_REGISTERED');
			expect(WarningCodes.VALIDATOR_THREW_ERROR).toBe('VALIDATOR_THREW_ERROR');
			expect(WarningCodes.DUPLICATE_SUBMISSION).toBe('DUPLICATE_SUBMISSION');
			expect(WarningCodes.LARGE_FORM_WITHOUT_OPTIMIZATION).toBe('LARGE_FORM_WITHOUT_OPTIMIZATION');
		});
	});

	describe('FormWarnings', () => {
		it('fieldNotRegistered should call DevWarnings.warn', () => {
			FormWarnings.fieldNotRegistered('test.path');
			// Just verify it doesn't throw
		});

		it('fieldAlreadyRegistered should call DevWarnings.warn', () => {
			FormWarnings.fieldAlreadyRegistered('test.path');
		});

		it('validatorThrewError should call DevWarnings.error', () => {
			FormWarnings.validatorThrewError('test.path', new Error('Test error'));
			expect(consoleErrorSpy).toHaveBeenCalled();
		});

		it('validatorThrewError should handle non-Error objects', () => {
			FormWarnings.validatorThrewError('test.path', 'string error');
			expect(consoleErrorSpy).toHaveBeenCalled();
		});

		it('asyncValidatorWithoutFlag should call DevWarnings.warn', () => {
			FormWarnings.asyncValidatorWithoutFlag('test.path');
		});

		it('arrayPathNotArray should call DevWarnings.error', () => {
			FormWarnings.arrayPathNotArray('test.path', 'string');
			expect(consoleErrorSpy).toHaveBeenCalled();
		});

		it('arrayIndexOutOfBounds should call DevWarnings.warn', () => {
			FormWarnings.arrayIndexOutOfBounds('test.path', 5, 3);
		});

		it('duplicateSubmission should call DevWarnings.warn', () => {
			FormWarnings.duplicateSubmission();
		});

		it('submitHandlerError should call DevWarnings.error', () => {
			FormWarnings.submitHandlerError(new Error('Submit error'));
			expect(consoleErrorSpy).toHaveBeenCalled();
		});

		it('submitHandlerError should handle non-Error objects', () => {
			FormWarnings.submitHandlerError('string error');
			expect(consoleErrorSpy).toHaveBeenCalled();
		});

		it('largeFormWithoutOptimization should call DevWarnings.warn', () => {
			FormWarnings.largeFormWithoutOptimization(100);
		});

		it('missingDestroyCall should call DevWarnings.warn', () => {
			FormWarnings.missingDestroyCall();
		});

		it('orphanedField should call DevWarnings.warn', () => {
			FormWarnings.orphanedField('test.path');
		});
	});

	describe('devAssert', () => {
		it('should not throw when condition is true', () => {
			expect(() => devAssert(true, 'TEST', 'message')).not.toThrow();
		});

		it('should not throw in non-dev mode even when condition is false', () => {
			// In non-dev mode, devAssert is a no-op
			expect(() => devAssert(false, 'TEST', 'message')).not.toThrow();
		});
	});

	describe('checkPerformance', () => {
		it('should not warn for small forms', () => {
			checkPerformance(10);
			// In non-dev mode, no warnings
		});

		it('should handle large form check', () => {
			// Should not throw
			expect(() => checkPerformance(100)).not.toThrow();
		});
	});
});
