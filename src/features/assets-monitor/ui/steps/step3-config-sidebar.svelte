<script lang="ts">
	import { Database, Shield, Clock } from 'lucide-svelte';
	import { monitorState } from '../../stores/monitor-state.svelte';
</script>

<div class="step-sidebar">
	<div class="info-section">
		<h3 class="sidebar-title">
			<Database size={18} />
			Scanning Blockchain
		</h3>
		<p class="sidebar-text">
			Scanning blockchain for asset movements matching your configuration. This may take a few
			moments depending on the block range.
		</p>
	</div>

	{#if monitorState.scanConfig}
		<div class="info-section">
			<h3 class="sidebar-title">
				<Clock size={18} />
				Scan Parameters
			</h3>
			<ul class="params-list">
				<li>
					<strong>Address:</strong>
					<span class="monospace">
						{monitorState.scanConfig.walletAddress.slice(0, 8)}...
					</span>
				</li>
				<li>
					<strong>Asset Types:</strong>
					{monitorState.scanConfig.assetTypes.length}
				</li>
				<li>
					<strong>Direction:</strong>
					{monitorState.scanConfig.includeIncoming && monitorState.scanConfig.includeOutgoing
						? 'Both'
						: monitorState.scanConfig.includeIncoming
							? 'Incoming'
							: 'Outgoing'}
				</li>
			</ul>
		</div>
	{/if}

	<div class="info-section tip">
		<h3 class="sidebar-title">
			<Shield size={18} />
			Read-Only Operation
		</h3>
		<p class="sidebar-text">
			This is a read-only operation. No transactions will be sent and your wallet will not be
			charged any fees.
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

	.params-list {
		margin: 0;
		padding: 0;
		list-style: none;
		font-size: var(--text-sm);
	}

	.params-list li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-2) 0;
		color: var(--color-description-3);
		border-bottom: 1px solid var(--color-border);
	}

	.params-list li:last-child {
		border-bottom: none;
	}

	.params-list strong {
		color: var(--color-heading-3);
		font-weight: var(--font-semibold);
	}

	.monospace {
		font-family: 'Monaco', 'Menlo', monospace;
		font-size: var(--text-xs);
	}
</style>
