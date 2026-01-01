/**
 * Roadmap Metadata
 * Display metadata for stages, stability levels, and audiences
 */
import type { StageMetadata, StabilityMetadata, AudienceMetadata } from '../types';

/**
 * Stage display metadata
 */
export const stageMetadata: StageMetadata[] = [
	{
		stage: 'planning',
		labelKey: 'routes/roadmap.stages.planning',
		color: '#9CA3AF',
		bgColor: '#F3F4F6',
		order: 0
	},
	{
		stage: 'development',
		labelKey: 'routes/roadmap.stages.development',
		color: '#F59E0B',
		bgColor: '#FEF3C7',
		order: 1
	},
	{
		stage: 'alpha',
		labelKey: 'routes/roadmap.stages.alpha',
		color: '#EF4444',
		bgColor: '#FEE2E2',
		order: 2
	},
	{
		stage: 'beta',
		labelKey: 'routes/roadmap.stages.beta',
		color: '#3B82F6',
		bgColor: '#DBEAFE',
		order: 3
	},
	{
		stage: 'stable',
		labelKey: 'routes/roadmap.stages.stable',
		color: '#10B981',
		bgColor: '#D1FAE5',
		order: 4
	},
	{
		stage: 'deprecated',
		labelKey: 'routes/roadmap.stages.deprecated',
		color: '#6B7280',
		bgColor: '#E5E7EB',
		order: 5
	}
];

/**
 * Stability display metadata
 */
export const stabilityMetadata: StabilityMetadata[] = [
	{
		level: 'experimental',
		labelKey: 'routes/roadmap.stability.experimental',
		color: '#EF4444',
		icon: 'flask'
	},
	{
		level: 'unstable',
		labelKey: 'routes/roadmap.stability.unstable',
		color: '#F59E0B',
		icon: 'alert-triangle'
	},
	{
		level: 'stable',
		labelKey: 'routes/roadmap.stability.stable',
		color: '#10B981',
		icon: 'check-circle'
	},
	{
		level: 'production',
		labelKey: 'routes/roadmap.stability.production',
		color: '#059669',
		icon: 'shield-check'
	}
];

/**
 * Audience display metadata
 */
export const audienceMetadata: AudienceMetadata[] = [
	{
		audience: 'early-adopter',
		labelKey: 'routes/roadmap.audience.early_adopter',
		color: '#8B5CF6'
	},
	{
		audience: 'developer',
		labelKey: 'routes/roadmap.audience.developer',
		color: '#3B82F6'
	},
	{
		audience: 'power-user',
		labelKey: 'routes/roadmap.audience.power_user',
		color: '#F59E0B'
	},
	{
		audience: 'everyone',
		labelKey: 'routes/roadmap.audience.everyone',
		color: '#10B981'
	}
];

/**
 * Get stage metadata
 */
export function getStageMetadata(stage: string): StageMetadata | undefined {
	return stageMetadata.find((s) => s.stage === stage);
}

/**
 * Get stability metadata
 */
export function getStabilityMetadata(level: string): StabilityMetadata | undefined {
	return stabilityMetadata.find((s) => s.level === level);
}

/**
 * Get audience metadata
 */
export function getAudienceMetadata(audience: string): AudienceMetadata | undefined {
	return audienceMetadata.find((a) => a.audience === audience);
}
