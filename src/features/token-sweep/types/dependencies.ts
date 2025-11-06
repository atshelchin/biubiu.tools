/**
 * Token Sweep dependency types
 */

export type DependencyStatus = 'checking' | 'success' | 'warning' | 'error';

export interface DependencyCheckResult {
	id: string;
	name: string;
	description: string;
	status: DependencyStatus;
	message?: string;
	address?: string;
	canDeploy?: boolean;
	deployGuideUrl?: string;
}

export interface NetworkServiceCheck extends DependencyCheckResult {
	type: 'network-service';
	endpoint?: string;
	responseTime?: number;
}

export interface ContractCheck extends DependencyCheckResult {
	type: 'contract';
	address: string;
	expectedAddress?: string;
	isDeployed: boolean;
	blockNumber?: number;
	blockTimestamp?: number;
}

export type DependencyCheck = NetworkServiceCheck | ContractCheck;

export interface DependencyCheckSummary {
	total: number;
	passed: number;
	warnings: number;
	failed: number;
	allPassed: boolean;
}
