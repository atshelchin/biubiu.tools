<script lang="ts">
	import { Wallet } from 'lucide-svelte';
	import { useI18n } from '@shelchin/i18n/svelte';
	import { longPress } from '$lib/utils/long-press';

	interface Props {
		/** Whether the button is in loading state */
		isLoading?: boolean;
		/** Click handler */
		onclick?: () => void;
		/** Long press duration in milliseconds */
		longPressDuration?: number;
		/** Long press complete handler */
		onLongPress?: () => void;
		/** Show long press hint */
		showHint?: boolean;
	}

	let {
		isLoading = false,
		onclick,
		longPressDuration = 3000,
		onLongPress,
		showHint = false
	}: Props = $props();

	const i18n = useI18n();

	let longPressProgress = $state(0);
	let isPressing = $state(false);

	function handleProgress(progress: number) {
		if (progress > 0) {
			isPressing = true;
			longPressProgress = progress;
		} else {
			isPressing = false;
			longPressProgress = 0;
		}
	}

	function handleLongPressComplete() {
		onLongPress?.();
		isPressing = false;
		longPressProgress = 0;
	}
</script>

<div class="connect-button-container">
	<div
		use:longPress={{
			duration: longPressDuration,
			onProgress: handleProgress,
			onComplete: handleLongPressComplete
		}}
	>
		<button class="connect-button" {onclick} disabled={isLoading}>
			<div class="button-content">
				<Wallet size={24} />
				<span class="button-text">
					{isLoading ? i18n.t('wallet.connecting') : i18n.t('wallet.connect')}
				</span>
			</div>
		</button>
	</div>

	<!-- Long press indicator -->
	{#if isLoading && isPressing && longPressProgress > 0}
		<div class="long-press-indicator">
			<div class="progress-bar" style:width="{longPressProgress}%"></div>
		</div>
	{/if}
</div>

<!-- Reset hint -->
{#if showHint && isLoading}
	<div class="reset-hint">💡 {i18n.t('wallet.long_press_hint')}</div>
{/if}

<style>
	.connect-button-container {
		position: relative;
		width: 100%;
	}

	.connect-button {
		width: 100%;
		min-height: 64px;
		padding: var(--space-4) var(--space-6);
		background: linear-gradient(
			135deg,
			var(--color-primary),
			hsl(var(--brand-hue), var(--brand-saturation), 45%)
		);
		color: white;
		border: none;
		border-radius: var(--radius-lg);
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 12px hsla(var(--brand-hue), var(--brand-saturation), 50%, 0.3);
	}

	.connect-button:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 8px 24px hsla(var(--brand-hue), var(--brand-saturation), 50%, 0.4);
	}

	.connect-button:active:not(:disabled) {
		transform: translateY(0);
	}

	.connect-button:disabled {
		opacity: 0.8;
		cursor: not-allowed;
	}

	.long-press-indicator {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: hsla(0, 0%, 100%, 0.2);
		border-radius: 0 0 var(--radius-lg) var(--radius-lg);
		overflow: hidden;
	}

	.progress-bar {
		height: 100%;
		background: linear-gradient(90deg, hsl(45, 100%, 50%), hsl(0, 80%, 50%));
		transition: width 0.05s linear;
	}

	.reset-hint {
		font-size: var(--text-sm);
		color: var(--gray-600);
		text-align: center;
		margin-top: var(--space-2);
		animation: fadeIn 0.3s ease-out;
	}

	:global([data-theme='dark']) .reset-hint {
		color: var(--gray-400);
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.button-content {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-3);
	}

	.button-text {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
	}
</style>
