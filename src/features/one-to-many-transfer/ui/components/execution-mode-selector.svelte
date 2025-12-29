<script lang="ts">
	import { useI18n } from '@shelchin/i18n';
	import { Wallet, Users, Info } from '@lucide/svelte';
	import type { ExecutionMode } from '@/features/one-to-many-transfer/types/distribution';

	interface Props {
		value: ExecutionMode;
		onchange?: (mode: ExecutionMode) => void;
		disabled?: boolean;
	}

	let { value = $bindable(), onchange, disabled = false }: Props = $props();

	const i18n = useI18n();

	function handleSelect(mode: ExecutionMode) {
		if (disabled) return;
		value = mode;
		onchange?.(mode);
	}
</script>

<div class="mode-selector" class:disabled>
	<button
		class="mode-option"
		class:selected={value === 'self'}
		onclick={() => handleSelect('self')}
		{disabled}
		type="button"
	>
		<div class="mode-icon">
			<Wallet size={24} />
		</div>
		<div class="mode-content">
			<h4 class="mode-title">
				{i18n.t('one-to-many-transfer.step5.mode.self.title')}
			</h4>
			<p class="mode-description">
				{i18n.t('one-to-many-transfer.step5.mode.self.description')}
			</p>
		</div>
		<div class="mode-indicator">
			<div class="radio-circle" class:checked={value === 'self'}></div>
		</div>
	</button>

	<button
		class="mode-option"
		class:selected={value === 'delegated'}
		onclick={() => handleSelect('delegated')}
		{disabled}
		type="button"
	>
		<div class="mode-icon">
			<Users size={24} />
		</div>
		<div class="mode-content">
			<h4 class="mode-title">
				{i18n.t('one-to-many-transfer.step5.mode.delegated.title')}
			</h4>
			<p class="mode-description">
				{i18n.t('one-to-many-transfer.step5.mode.delegated.description')}
			</p>
		</div>
		<div class="mode-indicator">
			<div class="radio-circle" class:checked={value === 'delegated'}></div>
		</div>
	</button>

	{#if value === 'delegated'}
		<div class="info-banner">
			<Info size={16} />
			<span>{i18n.t('one-to-many-transfer.step5.mode.delegated.info')}</span>
		</div>
	{/if}
</div>

<style>
	.mode-selector {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.mode-selector.disabled {
		opacity: 0.6;
		pointer-events: none;
	}

	.mode-option {
		display: flex;
		align-items: flex-start;
		gap: var(--space-4);
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-lg);
		cursor: pointer;
		transition: all 0.2s ease;
		text-align: left;
	}

	.mode-option:hover:not(:disabled) {
		border-color: hsl(210, 80%, 60%);
		background: var(--color-panel-2);
	}

	.mode-option.selected {
		border-color: hsl(210, 100%, 50%);
		background: hsla(210, 100%, 95%, 0.5);
	}

	:global([data-theme='dark']) .mode-option.selected {
		background: hsla(210, 100%, 20%, 0.2);
	}

	.mode-option:disabled {
		cursor: not-allowed;
	}

	.mode-icon {
		flex-shrink: 0;
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: hsla(210, 100%, 50%, 0.1);
		border-radius: var(--radius-md);
		color: hsl(210, 100%, 50%);
	}

	.mode-option.selected .mode-icon {
		background: hsl(210, 100%, 50%);
		color: white;
	}

	.mode-content {
		flex: 1;
	}

	.mode-title {
		margin: 0 0 var(--space-1) 0;
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .mode-title {
		color: var(--gray-100);
	}

	.mode-description {
		margin: 0;
		font-size: var(--text-sm);
		color: var(--gray-600);
		line-height: 1.4;
	}

	:global([data-theme='dark']) .mode-description {
		color: var(--gray-400);
	}

	.mode-indicator {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		padding-top: var(--space-2);
	}

	.radio-circle {
		width: 20px;
		height: 20px;
		border: 2px solid var(--color-border);
		border-radius: 50%;
		position: relative;
		transition: all 0.2s ease;
	}

	.radio-circle.checked {
		border-color: hsl(210, 100%, 50%);
	}

	.radio-circle.checked::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 10px;
		height: 10px;
		background: hsl(210, 100%, 50%);
		border-radius: 50%;
	}

	.info-banner {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3);
		background: hsla(210, 100%, 95%, 1);
		border: 1px solid hsla(210, 100%, 80%, 1);
		border-radius: var(--radius-md);
		color: hsl(210, 80%, 35%);
		font-size: var(--text-sm);
	}

	:global([data-theme='dark']) .info-banner {
		background: hsla(210, 100%, 15%, 0.3);
		border-color: hsla(210, 100%, 40%, 0.5);
		color: hsl(210, 80%, 70%);
	}

	@media (max-width: 640px) {
		.mode-option {
			flex-wrap: wrap;
		}

		.mode-icon {
			order: 1;
		}

		.mode-indicator {
			order: 2;
		}

		.mode-content {
			order: 3;
			width: 100%;
			margin-top: var(--space-2);
		}
	}
</style>
