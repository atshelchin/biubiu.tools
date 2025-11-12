<script lang="ts">
	/**
	 * ColorPicker - 自定义颜色选择器组件
	 * 演示如何创建可在 Schema 中使用的自定义输入组件
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
				{#each presetColors as presetColor}
					<button
						type="button"
						class="preset-btn"
						class:active={value === presetColor}
						style="background-color: {presetColor}"
						onclick={() => handleColorChange(presetColor)}
						title={presetColor}
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
		gap: 0.75rem;
	}

	.color-display {
		height: 60px;
		border-radius: 0.5rem;
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
		background: rgba(255, 255, 255, 0.9);
		padding: 0.25rem 0.75rem;
		border-radius: 0.25rem;
		font-family: monospace;
		font-weight: 600;
		color: #374151;
	}

	.color-controls {
		display: flex;
		gap: 0.75rem;
		align-items: center;
	}

	.color-input {
		width: 60px;
		height: 40px;
		border: 2px solid #e5e7eb;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.color-input:hover {
		border-color: #667eea;
	}

	.preset-colors {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.preset-btn {
		width: 40px;
		height: 40px;
		border: 2px solid transparent;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.2s;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.preset-btn:hover {
		transform: scale(1.1);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	.preset-btn.active {
		border-color: #374151;
		box-shadow: 0 0 0 3px rgba(55, 65, 81, 0.1);
	}
</style>
