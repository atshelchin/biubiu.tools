import 'fake-indexeddb/auto';
import { vi, beforeEach } from 'vitest';

// Mock window if not available
if (typeof window === 'undefined') {
	global.window = {} as typeof window;
}

// Reset modules before each test
beforeEach(() => {
	vi.resetModules();
});
