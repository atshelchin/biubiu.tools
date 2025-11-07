<script lang="ts">
	import { BarChart3, Download, Filter, Database } from 'lucide-svelte';
	import { monitorState } from '../../stores/monitor-state.svelte';
</script>

<div class="step-sidebar">
	<div class="info-section">
		<h3 class="sidebar-title">
			<BarChart3 size={18} />
			Results Overview
		</h3>
		<ul class="stats-list">
			<li>
				<strong>Total Movements:</strong>
				{monitorState.movements.length}
			</li>
			<li>
				<strong>Assets Tracked:</strong>
				{monitorState.balances.length}
			</li>
		</ul>
	</div>

	<div class="info-section">
		<h3 class="sidebar-title">
			<Filter size={18} />
			Filter & Search
		</h3>
		<p class="sidebar-text">
			Use the filters above to narrow down results by asset type, direction, or search for specific
			tokens and transactions.
		</p>
	</div>

	<div class="info-section">
		<h3 class="sidebar-title">
			<Download size={18} />
			Export Data
		</h3>
		<p class="sidebar-text">
			Export your scan results to CSV format for further analysis in spreadsheet applications.
		</p>
	</div>

	<div class="info-section tip">
		<h3 class="sidebar-title">
			<Database size={18} />
			Stored Locally
		</h3>
		<p class="sidebar-text">
			All scan data is stored in your browser's IndexedDB. You can return anytime to view previous
			scans.
		</p>
	</div>
</div>

<style>
	.step-sidebar {
		padding: var(--space-6);
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}

	.info-section {
		padding: var(--space-4);
		background: var(--color-panel-1);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
	}

	.info-section.tip {
		background: color-mix(in srgb, var(--color-primary) 5%, var(--color-panel-1));
		border-color: color-mix(in srgb, var(--color-primary) 20%, transparent);
	}

	.sidebar-title {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--color-heading-2);
		margin-bottom: var(--space-3);
	}

	.sidebar-text {
		font-size: var(--text-sm);
		line-height: 1.6;
		color: var(--color-description-3);
		margin: 0;
	}

	.stats-list {
		margin: 0;
		padding: 0;
		list-style: none;
		font-size: var(--text-sm);
	}

	.stats-list li {
		display: flex;
		justify-content: space-between;
		padding: var(--space-2) 0;
		color: var(--color-description-3);
		border-bottom: 1px solid var(--color-border);
	}

	.stats-list li:last-child {
		border-bottom: none;
	}

	.stats-list strong {
		color: var(--color-heading-3);
		font-weight: var(--font-semibold);
	}
</style>
