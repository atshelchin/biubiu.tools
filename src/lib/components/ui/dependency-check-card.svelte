<script lang="ts">
	import { CheckCircle2, XCircle, AlertCircle, RefreshCw, ExternalLink } from '@lucide/svelte';
	import { slide } from 'svelte/transition';

	interface DependencyCheck {
		id: string;
		name: string;
		description: string;
		status: 'checking' | 'success' | 'error' | 'warning';
		message?: string;
		type?: 'contract' | 'network-service';
		address?: string;
		blockNumber?: number;
		blockTimestamp?: number;
		endpoint?: string;
		responseTime?: number;
		canDeploy?: boolean;
		deployGuideUrl?: string;
	}

	interface Props {
		check: DependencyCheck;
		index: number;
		canFix: boolean;
		blockExplorer?: string;
		onDeploy?: () => void;
		deployButtonText?: string;
		blockedHintText?: string;
		addressLabel?: string;
		endpointLabel?: string;
		viewGuideText?: string;
		deployComingSoonText?: string;
	}

	let {
		check,
		index,
		canFix,
		blockExplorer,
		onDeploy,
		deployButtonText = 'Deploy',
		blockedHintText = 'Please resolve the previous issue first',
		addressLabel = 'Address:',
		endpointLabel = 'Endpoint:',
		viewGuideText = 'View Deployment Guide',
		deployComingSoonText = 'Deploy Contract (Coming Soon)'
	}: Props = $props();
</script>

<div
	class="check-card"
	class:success={check.status === 'success'}
	class:error={check.status === 'error'}
	class:warning={check.status === 'warning'}
	in:slide={{ duration: 200, delay: 50 }}
>
	<div class="check-header">
		<div class="check-icon">
			{#if check.status === 'checking'}
				<RefreshCw size={24} class="spinning" />
			{:else if check.status === 'success'}
				<CheckCircle2 size={24} />
			{:else if check.status === 'warning'}
				<AlertCircle size={24} />
			{:else}
				<XCircle size={24} />
			{/if}
		</div>
		<div class="check-info">
			<h4>{check.name}</h4>
			<p class="check-description">{check.description}</p>
		</div>
	</div>

	<div class="check-details">
		<!-- Only show error/warning messages, not success messages -->
		{#if check.message && (check.status === 'error' || check.status === 'warning')}
			<p class="check-message">{check.message}</p>
		{/if}

		<!-- Only show address details for failed contract checks -->
		{#if check.type === 'contract' && check.address && check.status === 'error'}
			<div class="detail-row">
				<span class="label">{addressLabel}</span>
				<div class="detail-value">
					<code class="address-code">{check.address}</code>
					{#if blockExplorer}
						<a
							href="{blockExplorer}/address/{check.address}"
							target="_blank"
							rel="noopener noreferrer"
							class="explorer-link"
							title="View on Block Explorer"
						>
							<ExternalLink size={14} />
						</a>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Only show endpoint details for failed network service checks -->
		{#if check.type === 'network-service' && check.endpoint && check.status === 'error'}
			<div class="detail-row">
				<span class="label">{endpointLabel}</span>
				<div class="detail-value">
					<code class="endpoint-code">{check.endpoint}</code>
					<a
						href={check.endpoint}
						target="_blank"
						rel="noopener noreferrer"
						class="explorer-link"
						title="Open RPC Endpoint"
					>
						<ExternalLink size={14} />
					</a>
				</div>
			</div>
		{/if}
	</div>

	{#if check.status === 'error' && check.canDeploy}
		<div class="check-actions">
			{#if !canFix}
				<div class="blocked-hint">
					<AlertCircle size={16} />
					<span>{blockedHintText}</span>
				</div>
			{:else if onDeploy}
				<button class="deploy-button primary" onclick={onDeploy}>
					{deployButtonText}
				</button>
			{:else if check.deployGuideUrl}
				<a
					href={check.deployGuideUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="deploy-link"
				>
					<ExternalLink size={16} />
					{viewGuideText}
				</a>
			{:else}
				<button class="deploy-button" disabled>{deployComingSoonText}</button>
			{/if}
		</div>
	{/if}
</div>

<style>
	.check-card {
		padding: var(--space-5);
		background: var(--white);
		border-radius: var(--radius-xl);
		border: 2px solid var(--color-border);
		transition: all 0.3s ease;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	}

	:global([data-theme='dark']) .check-card {
		background: var(--gray-800);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
	}

	.check-card:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
		transform: translateY(-2px);
	}

	:global([data-theme='dark']) .check-card:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	.check-card.success {
		border-color: hsl(120, 60%, 60%);
		background: linear-gradient(135deg, hsla(120, 60%, 99%, 1) 0%, hsla(120, 60%, 97%, 1) 100%);
	}

	:global([data-theme='dark']) .check-card.success {
		border-color: hsl(120, 60%, 40%);
		background: linear-gradient(135deg, hsla(120, 60%, 10%, 0.4) 0%, hsla(120, 60%, 8%, 0.3) 100%);
	}

	.check-card.error {
		border-color: hsl(0, 80%, 60%);
		background: linear-gradient(135deg, hsla(0, 80%, 99%, 1) 0%, hsla(0, 80%, 97%, 1) 100%);
	}

	:global([data-theme='dark']) .check-card.error {
		border-color: hsl(0, 80%, 40%);
		background: linear-gradient(135deg, hsla(0, 80%, 10%, 0.4) 0%, hsla(0, 80%, 8%, 0.3) 100%);
	}

	.check-card.warning {
		border-color: hsl(45, 100%, 60%);
		background: linear-gradient(135deg, hsla(45, 100%, 99%, 1) 0%, hsla(45, 100%, 97%, 1) 100%);
	}

	:global([data-theme='dark']) .check-card.warning {
		border-color: hsl(45, 100%, 50%);
		background: linear-gradient(135deg, hsla(45, 100%, 10%, 0.4) 0%, hsla(45, 100%, 8%, 0.3) 100%);
	}

	.check-header {
		display: flex;
		gap: var(--space-3);
		margin-bottom: var(--space-4);
	}

	.check-icon {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: var(--radius-lg);
		background: var(--gray-100);
	}

	:global([data-theme='dark']) .check-icon {
		background: var(--gray-700);
	}

	.check-icon :global(svg) {
		color: var(--gray-500);
	}

	.check-card.success .check-icon {
		background: hsla(120, 60%, 95%, 1);
	}

	:global([data-theme='dark']) .check-card.success .check-icon {
		background: hsla(120, 60%, 20%, 0.5);
	}

	.check-card.success .check-icon :global(svg) {
		color: hsl(120, 60%, 40%);
	}

	.check-card.error .check-icon {
		background: hsla(0, 80%, 95%, 1);
	}

	:global([data-theme='dark']) .check-card.error .check-icon {
		background: hsla(0, 80%, 20%, 0.5);
	}

	.check-card.error .check-icon :global(svg) {
		color: hsl(0, 80%, 50%);
	}

	.check-card.warning .check-icon {
		background: hsla(45, 100%, 95%, 1);
	}

	:global([data-theme='dark']) .check-card.warning .check-icon {
		background: hsla(45, 100%, 20%, 0.5);
	}

	.check-card.warning .check-icon :global(svg) {
		color: hsl(45, 100%, 45%);
	}

	:global(.spinning) {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.check-info {
		flex: 1;
		min-width: 0;
	}

	.check-info h4 {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
		margin: 0 0 var(--space-1) 0;
		line-height: 1.4;
	}

	:global([data-theme='dark']) .check-info h4 {
		color: var(--gray-100);
	}

	.check-description {
		font-size: var(--text-sm);
		color: var(--gray-600);
		margin: 0;
		line-height: 1.5;
	}

	:global([data-theme='dark']) .check-description {
		color: var(--gray-400);
	}

	.check-details {
		padding-left: calc(40px + var(--space-3));
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.check-message {
		font-size: var(--text-sm);
		color: var(--gray-700);
		margin: 0;
		padding: var(--space-3) var(--space-4);
		background: linear-gradient(135deg, var(--gray-50) 0%, var(--gray-100) 100%);
		border-radius: var(--radius-lg);
		border-left: 4px solid var(--color-primary);
		line-height: 1.6;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	}

	:global([data-theme='dark']) .check-message {
		color: var(--gray-200);
		background: linear-gradient(135deg, var(--gray-700) 0%, var(--gray-750) 100%);
		border-left-color: var(--color-primary);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
	}

	.detail-row {
		display: flex;
		gap: var(--space-3);
		align-items: center;
		font-size: var(--text-sm);
	}

	.detail-row .label {
		font-weight: var(--font-semibold);
		color: var(--gray-600);
		min-width: 100px;
		flex-shrink: 0;
	}

	:global([data-theme='dark']) .detail-row .label {
		color: var(--gray-400);
	}

	.detail-value {
		flex: 1;
		display: flex;
		align-items: center;
		gap: var(--space-2);
		color: var(--gray-800);
	}

	:global([data-theme='dark']) .detail-value {
		color: var(--gray-200);
	}

	.address-code,
	.endpoint-code {
		font-family: var(--font-mono, monospace);
		font-size: var(--text-xs);
		color: var(--color-primary);
		background: linear-gradient(135deg, hsla(210, 100%, 97%, 1) 0%, hsla(210, 100%, 95%, 1) 100%);
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-md);
		border: 1px solid hsla(210, 100%, 90%, 1);
		word-break: break-all;
		flex: 1;
		min-width: 0;
		font-weight: var(--font-medium);
		letter-spacing: -0.01em;
	}

	:global([data-theme='dark']) .address-code,
	:global([data-theme='dark']) .endpoint-code {
		color: hsl(210, 100%, 70%);
		background: linear-gradient(
			135deg,
			hsla(210, 100%, 12%, 0.6) 0%,
			hsla(210, 100%, 10%, 0.4) 100%
		);
		border-color: hsla(210, 100%, 20%, 0.8);
	}

	.explorer-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-1);
		color: var(--color-primary);
		background: var(--color-panel-1);
		border-radius: var(--radius-sm);
		transition: all 0.2s;
		flex-shrink: 0;
	}

	.explorer-link:hover {
		background: var(--color-primary);
		color: white;
		transform: translateY(-1px);
	}

	:global([data-theme='dark']) .explorer-link {
		background: var(--gray-700);
	}

	:global([data-theme='dark']) .explorer-link:hover {
		background: var(--color-primary);
	}

	.check-actions {
		margin-top: var(--space-4);
		padding-top: var(--space-4);
		padding-left: calc(40px + var(--space-3));
		border-top: 1px solid var(--color-border);
		display: flex;
		gap: var(--space-2);
	}

	.blocked-hint {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-4);
		background: hsla(45, 100%, 96%, 1);
		border: 1px solid hsla(45, 100%, 70%, 1);
		border-radius: var(--radius-md);
		color: hsl(45, 100%, 30%);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
	}

	:global([data-theme='dark']) .blocked-hint {
		background: hsla(45, 100%, 15%, 0.3);
		border-color: hsla(45, 100%, 40%, 1);
		color: hsl(45, 100%, 70%);
	}

	.blocked-hint :global(svg) {
		flex-shrink: 0;
	}

	.deploy-button {
		padding: var(--space-3) var(--space-5);
		background: linear-gradient(135deg, var(--gray-200) 0%, var(--gray-300) 100%);
		color: var(--gray-600);
		border: none;
		border-radius: var(--radius-lg);
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		cursor: not-allowed;
		transition: all 0.3s ease;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
	}

	.deploy-button.primary {
		background: linear-gradient(135deg, var(--color-primary) 0%, hsl(210, 100%, 45%) 100%);
		color: white;
		cursor: pointer;
		box-shadow: 0 4px 12px hsla(210, 100%, 50%, 0.25);
	}

	.deploy-button.primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px hsla(210, 100%, 50%, 0.35);
	}

	.deploy-button.primary:active {
		transform: translateY(0);
		box-shadow: 0 2px 8px hsla(210, 100%, 50%, 0.25);
	}

	:global([data-theme='dark']) .deploy-button {
		background: linear-gradient(135deg, var(--gray-700) 0%, var(--gray-600) 100%);
		color: var(--gray-400);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	:global([data-theme='dark']) .deploy-button.primary {
		background: linear-gradient(135deg, hsl(210, 100%, 50%) 0%, hsl(210, 100%, 40%) 100%);
		box-shadow: 0 4px 12px hsla(210, 100%, 40%, 0.4);
	}

	:global([data-theme='dark']) .deploy-button.primary:hover {
		box-shadow: 0 6px 20px hsla(210, 100%, 40%, 0.5);
	}

	.deploy-link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		background: var(--color-primary);
		color: white;
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		text-decoration: none;
		transition: all 0.2s;
	}

	.deploy-link:hover {
		opacity: 0.9;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	/* Responsive */
	@media (max-width: 640px) {
		.check-details {
			padding-left: 0;
		}

		.check-actions {
			padding-left: 0;
		}

		.detail-row {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--space-1);
		}

		.detail-row .label {
			min-width: auto;
		}
	}
</style>
