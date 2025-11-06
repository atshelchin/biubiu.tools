<script lang="ts" module>
	export interface Step {
		label: string;
		description?: string;
	}

	export interface StepManager {
		steps: Step[];
		currentStep: number;
		next: () => void;
		prev: () => void;
		goTo: (step: number) => void;
		reset: () => void;
		isFirst: boolean;
		isLast: boolean;
		canGoNext: boolean;
		canGoPrev: boolean;
	}

	/**
	 * Create a step manager for StepIndicator
	 * @param steps - Array of step definitions
	 * @param initialStep - Initial step (1-based, defaults to 1)
	 */
	export function createStepManager(steps: Step[], initialStep: number = 1): StepManager {
		let currentStep = $state(initialStep);

		return {
			get steps() {
				return steps;
			},
			get currentStep() {
				return currentStep;
			},
			next() {
				if (currentStep < steps.length) {
					currentStep++;
				}
			},
			prev() {
				if (currentStep > 1) {
					currentStep--;
				}
			},
			goTo(step: number) {
				if (step >= 1 && step <= steps.length) {
					currentStep = step;
				}
			},
			reset() {
				currentStep = 1;
			},
			get isFirst() {
				return currentStep === 1;
			},
			get isLast() {
				return currentStep === steps.length;
			},
			get canGoNext() {
				return currentStep < steps.length;
			},
			get canGoPrev() {
				return currentStep > 1;
			}
		};
	}
</script>

<script lang="ts">
	interface Props {
		manager: StepManager;
	}

	let { manager }: Props = $props();

	const isVertical = $derived(manager.steps.length > 3);

	function getStepStatus(index: number) {
		const stepNumber = index + 1;
		if (stepNumber < manager.currentStep) return 'completed';
		if (stepNumber === manager.currentStep) return 'active';
		return 'pending';
	}
</script>

<div class="step-indicator" class:vertical={isVertical}>
	{#each manager.steps as step, index (index)}
		{@const status = getStepStatus(index)}
		{@const stepNumber = index + 1}

		<div
			class="step-item"
			class:active={status === 'active'}
			class:completed={status === 'completed'}
		>
			<!-- 步骤圆圈 -->
			<div
				class="step-circle"
				class:active={status === 'active'}
				class:completed={status === 'completed'}
			>
				{#if status === 'completed'}
					<svg
						class="check-icon"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="3"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<polyline points="20 6 9 17 4 12"></polyline>
					</svg>
				{:else}
					<span class="step-number">{stepNumber}</span>
				{/if}
			</div>

			<!-- 步骤标签 -->
			<div class="step-label">
				<div class="step-title">{step.label}</div>
				{#if step.description}
					<div class="step-description">{step.description}</div>
				{/if}
			</div>

			<!-- 连接线 -->
			{#if index < manager.steps.length - 1}
				<div class="step-connector" class:completed={status === 'completed'}></div>
			{/if}
		</div>
	{/each}
</div>

<style>
	.step-indicator {
		display: flex;
		width: 100%;
	}

	.step-indicator:not(.vertical) {
		flex-direction: row;
		align-items: flex-start;
		justify-content: space-between;
	}

	.step-indicator.vertical {
		flex-direction: column;
		gap: var(--space-4);
	}

	.step-item {
		position: relative;
		display: flex;
		transition: all 0.3s ease;
	}

	/* 横向布局 */
	.step-indicator:not(.vertical) .step-item {
		flex-direction: column;
		align-items: center;
		flex: 1;
	}

	/* 纵向布局 */
	.step-indicator.vertical .step-item {
		flex-direction: row;
		align-items: flex-start;
		gap: var(--space-3);
	}

	/* 步骤圆圈 */
	.step-circle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--gray-50);
		border: 1px solid var(--gray-200);
		color: var(--gray-400);
		font-weight: var(--font-medium);
		font-size: var(--text-sm);
		transition: all 0.3s ease;
		position: relative;
		z-index: 2;
		flex-shrink: 0;
		cursor: pointer;
	}

	.step-circle:hover {
		border-color: var(--gray-300);
		background: white;
	}

	.step-circle.active {
		background: linear-gradient(135deg, #60a5fa, #3b82f6);
		border: 1px solid #2563eb;
		color: white;
		box-shadow:
			0 0 0 4px rgba(59, 130, 246, 0.1),
			0 2px 8px rgba(37, 99, 235, 0.2);
		animation: pulse-active 2s ease-in-out infinite;
	}

	.step-circle.active:hover {
		box-shadow:
			0 0 0 4px rgba(59, 130, 246, 0.15),
			0 4px 12px rgba(37, 99, 235, 0.25);
	}

	.step-circle.completed {
		background: #10b981;
		border: 1px solid #059669;
		color: white;
		box-shadow: 0 1px 3px rgba(5, 150, 105, 0.2);
	}

	.step-circle.completed:hover {
		box-shadow: 0 2px 6px rgba(5, 150, 105, 0.25);
	}

	@keyframes pulse-active {
		0%,
		100% {
			box-shadow:
				0 0 0 4px rgba(59, 130, 246, 0.1),
				0 2px 8px rgba(37, 99, 235, 0.2);
		}
		50% {
			box-shadow:
				0 0 0 6px rgba(59, 130, 246, 0.12),
				0 3px 12px rgba(37, 99, 235, 0.25);
		}
	}

	.step-number {
		transition: all 0.3s ease;
	}

	.check-icon {
		width: 20px;
		height: 20px;
		animation: check-in 0.3s ease;
	}

	@keyframes check-in {
		0% {
			transform: scale(0.8);
			opacity: 0;
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	/* 步骤标签 */
	.step-label {
		transition: all 0.3s ease;
	}

	.step-indicator:not(.vertical) .step-label {
		text-align: center;
		margin-top: var(--space-2);
		max-width: 120px;
	}

	.step-indicator.vertical .step-label {
		flex: 1;
		padding-top: var(--space-1);
	}

	.step-title {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--gray-500);
		transition: all 0.3s ease;
	}

	.step-item.active .step-title {
		color: #3b82f6;
		font-weight: var(--font-semibold);
	}

	.step-item.completed .step-title {
		color: var(--gray-600);
	}

	.step-description {
		font-size: var(--text-xs);
		color: var(--gray-400);
		margin-top: var(--space-1);
		line-height: 1.4;
		transition: all 0.3s ease;
	}

	.step-item.active .step-description {
		color: #60a5fa;
	}

	/* 连接线 */
	.step-connector {
		position: absolute;
		background: var(--gray-200);
		transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
		z-index: 1;
	}

	/* 横向连接线 */
	.step-indicator:not(.vertical) .step-connector {
		top: 20px;
		left: calc(50% + 20px);
		right: calc(-50% + 20px);
		height: 2px;
	}

	/* 纵向连接线 */
	.step-indicator.vertical .step-connector {
		left: 19px;
		top: 40px;
		width: 2px;
		height: calc(100% + var(--space-4));
	}

	.step-connector.completed {
		background: #10b981;
	}

	/* 响应式 */
	@media (max-width: 640px) {
		.step-indicator:not(.vertical) {
			flex-direction: column;
			gap: var(--space-4);
		}

		.step-indicator:not(.vertical) .step-item {
			flex-direction: row;
			align-items: flex-start;
			gap: var(--space-3);
		}

		.step-indicator:not(.vertical) .step-label {
			text-align: left;
			margin-top: var(--space-1);
			max-width: none;
		}

		.step-indicator:not(.vertical) .step-connector {
			left: 19px;
			top: 40px;
			width: 2px;
			height: calc(100% + var(--space-4));
		}
	}
</style>
