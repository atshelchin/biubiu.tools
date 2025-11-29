/**
 * Token Deployer dependency types
 * Re-export from generic blockchain-checker
 */

export type {
	CheckResult,
	NetworkServiceCheck,
	ContractCheck,
	DependencyCheck,
	DependencyCheckSummary
} from '$lib/utils/blockchain-checker';

// Keep legacy type alias for compatibility
export type DependencyStatus = 'checking' | 'success' | 'warning' | 'error';
export type DependencyCheckResult = CheckResult;

import type { CheckResult } from '$lib/utils/blockchain-checker';
