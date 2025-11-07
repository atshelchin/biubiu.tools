<script lang="ts">
	import type { NFTStandardInfo } from '../../types/nft';

	interface Props {
		standard: NFTStandardInfo;
		selected?: boolean;
		onclick?: () => void;
	}

	let { standard, selected = false, onclick }: Props = $props();

	const gasEfficiencyColor = $derived(
		standard.gasEfficiency === 'high'
			? 'var(--green-600)'
			: standard.gasEfficiency === 'medium'
				? 'var(--yellow-600)'
				: 'var(--orange-600)'
	);
</script>

<button class="standard-card" class:selected {onclick}>
	<div class="card-header">
		<h3 class="standard-name">{standard.name}</h3>
		<div class="gas-badge" style="color: {gasEfficiencyColor}">
			{standard.gasEfficiency === 'high'
				? '⚡ High'
				: standard.gasEfficiency === 'medium'
					? '⚖️ Medium'
					: '🔥 Low'} Gas
		</div>
	</div>

	<p class="standard-description">{standard.description}</p>

	<div class="features-section">
		<h4 class="section-title">Features</h4>
		<ul class="features-list">
			{#each standard.features as feature (feature)}
				<li>{feature}</li>
			{/each}
		</ul>
	</div>

	<div class="usecases-section">
		<h4 class="section-title">Best For</h4>
		<div class="usecases-tags">
			{#each standard.useCases as useCase (useCase)}
				<span class="usecase-tag">{useCase}</span>
			{/each}
		</div>
	</div>
</button>

<style>
	.standard-card {
		width: 100%;
		padding: var(--space-6);
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-lg);
		cursor: pointer;
		transition: all 0.3s ease;
		text-align: left;
	}

	.standard-card:hover {
		border-color: var(--color-primary);
		box-shadow: 0 4px 12px hsla(210, 100%, 50%, 0.1);
		transform: translateY(-2px);
	}

	.standard-card.selected {
		border-color: var(--color-primary);
		background: hsla(210, 100%, 50%, 0.05);
		box-shadow: 0 0 0 3px hsla(210, 100%, 50%, 0.1);
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: var(--space-3);
	}

	.standard-name {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--gray-900);
		margin: 0;
	}

	:global([data-theme='dark']) .standard-name {
		color: var(--gray-100);
	}

	.gas-badge {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		padding: var(--space-1) var(--space-3);
		background: var(--gray-100);
		border-radius: var(--radius-full);
	}

	:global([data-theme='dark']) .gas-badge {
		background: var(--gray-800);
	}

	.standard-description {
		font-size: var(--text-base);
		color: var(--gray-600);
		line-height: 1.6;
		margin: 0 0 var(--space-5) 0;
	}

	:global([data-theme='dark']) .standard-description {
		color: var(--gray-400);
	}

	.features-section,
	.usecases-section {
		margin-top: var(--space-5);
	}

	.section-title {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-700);
		margin: 0 0 var(--space-3) 0;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	:global([data-theme='dark']) .section-title {
		color: var(--gray-300);
	}

	.features-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: var(--space-2);
	}

	.features-list li {
		padding-left: var(--space-5);
		position: relative;
		font-size: var(--text-sm);
		color: var(--gray-700);
		line-height: 1.5;
	}

	.features-list li::before {
		content: '✓';
		position: absolute;
		left: 0;
		color: var(--green-600);
		font-weight: var(--font-bold);
	}

	:global([data-theme='dark']) .features-list li {
		color: var(--gray-300);
	}

	.usecases-tags {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.usecase-tag {
		padding: var(--space-2) var(--space-3);
		background: var(--gray-100);
		color: var(--gray-700);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		border-radius: var(--radius-md);
	}

	:global([data-theme='dark']) .usecase-tag {
		background: var(--gray-800);
		color: var(--gray-300);
	}

	@media (max-width: 640px) {
		.standard-card {
			padding: var(--space-4);
		}

		.standard-name {
			font-size: var(--text-xl);
		}
	}
</style>
