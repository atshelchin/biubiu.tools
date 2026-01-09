<script lang="ts">
	/**
	 * ColorPicker - Custom color picker component for Schema Form demo
	 */
	interface Props {
		value?: string;
		presetColors?: string[];
		onInput?: (value: string) => void;
		onBlur?: () => void;
	}

	let { value = '#667eea', presetColors = [], onInput, onBlur }: Props = $props();

	function handleColorChange(newColor: string) {
		if (onInput) {
			onInput(newColor);
		}
	}
</script>

<div class="color-picker">
	<div class="color-display" style="background-color: {value}">
		<span class="color-value">{value}</span>
	</div>

	<div class="color-controls">
		<input
			type="color"
			{value}
			oninput={(e) => handleColorChange(e.currentTarget.value)}
			onblur={onBlur}
			class="color-input"
		/>

		{#if presetColors.length > 0}
			<div class="preset-colors">
				{#each presetColors as presetColor (presetColor)}
					<button
						type="button"
						class="preset-btn"
						class:active={value === presetColor}
						style="background-color: {presetColor}"
						onclick={() => handleColorChange(presetColor)}
						title={presetColor}
						aria-label={presetColor}
					></button>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.color-picker {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.color-display {
		height: 48px;
		border-radius: var(--radius);
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transition: all 0.2s;
	}

	.color-display:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.color-value {
		/* background: rgba(255, 255, 255, 0.9); */
		padding: 0.125rem 0.5rem;
		border-radius: 0.25rem;
		font-family: 'SF Mono', Monaco, monospace;
		font-size: var(--text-xs);
		font-weight: 600;
		color: var(--color-foreground);
	}

	.color-controls {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.color-input {
		width: 48px;
		height: 32px;
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		cursor: pointer;
		transition: all 0.2s;
		padding: 0;
	}

	.color-input:hover {
		border-color: var(--color-primary);
	}

	.preset-colors {
		display: flex;
		gap: 0.375rem;
		flex-wrap: wrap;
	}

	.preset-btn {
		width: 32px;
		height: 32px;
		border: 2px solid transparent;
		border-radius: var(--radius);
		cursor: pointer;
		transition: all 0.2s;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.preset-btn:hover {
		transform: scale(1.1);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	.preset-btn.active {
		border-color: var(--color-foreground);
		box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
	}
</style>
