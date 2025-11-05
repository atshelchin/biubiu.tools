<script lang="ts">
	import { Check } from 'lucide-svelte';

	interface Props {
		checked: boolean;
		onchange: (checked: boolean) => void;
		disabled?: boolean;
		class?: string;
	}

	let { checked = false, onchange, disabled = false, class: className = '' }: Props = $props();

	function handleChange(e: Event) {
		const target = e.currentTarget as HTMLInputElement;
		onchange(target.checked);
	}
</script>

<label class="toggle-switch {className}" class:disabled>
	<input type="checkbox" {checked} onchange={handleChange} {disabled} />
	<span class="toggle-slider">
		{#if checked}
			<span class="check-icon">
				<Check size={12} strokeWidth={3} />
			</span>
		{/if}
	</span>
</label>

<style>
	.toggle-switch {
		position: relative;
		display: inline-block;
		width: 44px;
		height: 24px;
		cursor: pointer;
	}

	.toggle-switch.disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.toggle-switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	.toggle-slider {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: var(--color-secondary);
		border: 1px solid var(--color-border);
		border-radius: 24px;
		transition: all 0.3s;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		padding: 0 3px;
	}

	.toggle-slider::before {
		content: '';
		position: absolute;
		height: 18px;
		width: 18px;
		left: 3px;
		background: var(--color-muted-foreground);
		border-radius: 50%;
		transition: all 0.3s;
	}

	.toggle-switch input:checked + .toggle-slider {
		background: var(--brand-500);
		border-color: var(--brand-500);
	}

	.toggle-switch input:checked + .toggle-slider::before {
		transform: translateX(20px);
		background: var(--color-card);
	}

	.toggle-switch:hover:not(.disabled) .toggle-slider {
		border-color: var(--color-muted-foreground);
	}

	.toggle-switch input:checked:hover + .toggle-slider {
		background: var(--brand-600);
		border-color: var(--brand-600);
	}

	.check-icon {
		position: absolute;
		left: 5px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-card);
		transition: all 0.3s;
	}
</style>
