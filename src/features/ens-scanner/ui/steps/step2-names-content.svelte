<script lang="ts">
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import { ensState } from '../../stores/ens-state.svelte';
	import { generateNames } from '../../utils/name-generator';
	import type { NameGenerationPattern } from '../../types/ens';

	let selectedPattern = $state<NameGenerationPattern>('triple');

	// Pattern-specific options
	let startYear = $state(2000);
	let endYear = $state(2024);
	let startNumber = $state(0);
	let endNumber = $state(999);
	let prefix = $state('');
	let suffix = $state('');

	function handleGenerate() {
		const config = {
			pattern: selectedPattern,
			startYear,
			endYear,
			startNumber,
			endNumber,
			digits: 3,
			prefix,
			suffix
		};

		const names = generateNames(config);
		ensState.setGeneratedNames(names.slice(0, 1000)); // Limit to 1000
	}

	const hasNames = $derived(ensState.allNames.length > 0);
</script>

<div class="step-content">
	<StepContentHeader title="Generate or Import Names" description="Create ENS names to scan" />

	<div class="tabs">
		<button class="tab">Generate</button>
		<button class="tab">Import</button>
	</div>

	<div class="pattern-selector">
		<label>
			<span>Pattern:</span>
			<select bind:value={selectedPattern}>
				<option value="triple">Triple (AAA)</option>
				<option value="abab">ABAB Pattern</option>
				<option value="numeric">Numeric</option>
				<option value="birthday">Birthday</option>
			</select>
		</label>
	</div>

	<button class="generate-btn" onclick={handleGenerate}>Generate Names</button>

	{#if hasNames}
		<div class="names-preview">
			<h4>Generated Names ({ensState.allNames.length})</h4>
			<div class="names-list">
				{#each ensState.allNames.slice(0, 20) as name (name)}
					<span class="name-tag">{name}.eth</span>
				{/each}
				{#if ensState.allNames.length > 20}
					<span class="more">+{ensState.allNames.length - 20} more</span>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.step-content {
		padding: var(--space-6);
	}
	.pattern-selector {
		margin-top: var(--space-4);
	}
	.pattern-selector label {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}
	.pattern-selector select {
		padding: var(--space-3);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-base);
	}
	.generate-btn {
		margin-top: var(--space-4);
		padding: var(--space-3) var(--space-6);
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-weight: var(--font-semibold);
		cursor: pointer;
	}
	.names-preview {
		margin-top: var(--space-6);
		padding: var(--space-4);
		background: var(--color-panel-1);
		border-radius: var(--radius-md);
	}
	.names-list {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		margin-top: var(--space-3);
	}
	.name-tag {
		padding: var(--space-1) var(--space-3);
		background: var(--color-panel-2);
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
		font-family: monospace;
	}
</style>
