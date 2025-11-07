<script lang="ts">
	import { Info, Zap, Shield } from 'lucide-svelte';
</script>

<div class="step-sidebar">
	<div class="info-section">
		<h3 class="sidebar-title">
			<Info size={18} />
			Scan Configuration
		</h3>
		<p class="sidebar-text">
			Configure the parameters for scanning wallet asset movements. You can specify a block range or
			scan recent blocks.
		</p>
	</div>

	<div class="info-section">
		<h3 class="sidebar-title">
			<Zap size={18} />
			Asset Types
		</h3>
		<ul class="info-list">
			<li><strong>Native (ETH):</strong> Blockchain's native currency</li>
			<li><strong>ERC-20:</strong> Standard fungible tokens</li>
			<li><strong>ERC-721:</strong> Non-fungible tokens (NFTs)</li>
		</ul>
	</div>

	<div class="info-section tip">
		<h3 class="sidebar-title">
			<Shield size={18} />
			Privacy & Storage
		</h3>
		<p class="sidebar-text">
			All scan results are stored locally in your browser using IndexedDB. No data is sent to any
			server.
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
		background: color-mix(in srgb, var(--color-success) 5%, var(--color-panel-1));
		border-color: color-mix(in srgb, var(--color-success) 20%, transparent);
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

	.info-list {
		margin: 0;
		padding-left: var(--space-5);
		font-size: var(--text-sm);
		line-height: 1.8;
		color: var(--color-description-3);
	}

	.info-list li {
		margin-bottom: var(--space-2);
	}

	.info-list strong {
		color: var(--color-heading-3);
		font-weight: var(--font-semibold);
	}
</style>
