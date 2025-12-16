<script lang="ts">
	/* eslint-disable svelte/no-unused-props -- Props reserved for future use */
	import {
		CheckCircle2,
		XCircle,
		AlertCircle,
		RefreshCw,
		ExternalLink,
		Settings
	} from '@lucide/svelte';
	import { slide } from 'svelte/transition';

	interface DependencyCheck {
		id: string;
		name: string;
		description: string;
		status: 'checking' | 'success' | 'error' | 'warning';
		message?: string;
		docUrl?: string;
		type?: 'contract' | 'network-service';
		address?: string;
		blockNumber?: number;
		blockTimestamp?: number;
		endpoint?: string;
		responseTime?: number;
		canDeploy?: boolean;
		deployGuideUrl?: string;
		/** Whether the user needs to configure RPC endpoint */
		needsRpcConfig?: boolean;
	}

	interface Props {
		check: DependencyCheck;
		index: number;
		canFix: boolean;
		blockExplorer?: string;
		onDeploy?: () => void;
		onConfigureRpc?: () => void;
		deployButtonText?: string;
		configureRpcButtonText?: string;
		blockedHintText?: string;
		addressLabel?: string;
		endpointLabel?: string;
		viewGuideText?: string;
		deployComingSoonText?: string;
		categoryLabels?: {
			network: string;
			protocol: string;
			contract: string;
		};
	}

	let {
		check,
		canFix,
		blockExplorer,
		onDeploy,
		onConfigureRpc,
		deployButtonText = 'Deploy',
		configureRpcButtonText = 'Configure RPC',
		addressLabel = 'Address:',
		endpointLabel = 'Endpoint:',
		deployComingSoonText = 'Deploy Contract (Coming Soon)',
		categoryLabels = {
			network: 'Network',
			protocol: 'Protocol',
			contract: 'Contract'
		}
	}: Props = $props();

	// Determine category based on check type and id
	type Category = 'network' | 'protocol' | 'contract';
	let category = $derived.by((): Category => {
		if (check.type === 'contract') return 'contract';
		if (check.id === 'rpc-endpoint') return 'network';
		if (check.id?.startsWith('eip-')) return 'protocol';
		return 'network'; // default fallback
	});
</script>

<div
	class="check-card"
	class:cannotfix={!canFix}
	class:success={check.status === 'success'}
	class:error={check.status === 'error'}
	class:warning={check.status === 'warning'}
	in:slide={{ duration: 200, delay: 50 }}
>
	<div class="check-header">
		<div class="check-info">
			<div class="check-title">
				<h4>{check.name}</h4>
				<span class="category-tag {category}">{categoryLabels[category]}</span>
				{#if check.docUrl}
					<a
						href={check.docUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="doc-link"
						title="View documentation"
					>
						<ExternalLink size={14} />
					</a>
				{/if}
			</div>
			<p class="check-description">{check.description}</p>
		</div>
	</div>

	<div class="check-details">
		<!-- Show contract address for all contract checks -->
		{#if check.type === 'contract' && check.address}
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

		<!-- Show endpoint for all network service checks -->
		{#if check.type === 'network-service' && check.endpoint}
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

		<!-- Only show error/warning messages at the bottom, not success messages -->
		<!-- && (check.status === 'error' || check.status === 'warning') -->
		<div style="display:flex;align-items: center;gap:8px">
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
			{#if check.message}
				<p class="check-message">{check.message}</p>
			{/if}
		</div>
	</div>

	{#if check.status === 'error' && check.needsRpcConfig && onConfigureRpc}
		<!-- Show Configure RPC button when RPC is not configured -->
		<div class="check-actions">
			<button class="configure-rpc-button w-full mt-4" onclick={onConfigureRpc}>
				<Settings size={16} />
				{configureRpcButtonText}
			</button>
		</div>
	{:else if check.status === 'error' && check.canDeploy}
		<div class="check-actions">
			{#if !canFix}
				<!-- <div class="blocked-hint w-full">
					<AlertCircle size={16} />
					<span>{blockedHintText}</span>
				</div> -->
			{:else if onDeploy}
				<button class="deploy-button primary w-full mt-4" onclick={onDeploy}>
					{deployButtonText}
				</button>
			{:else}
				<button class="deploy-button w-full mt-4" disabled>{deployComingSoonText}</button>
			{/if}
		</div>
	{/if}
</div>

<style>
	.w-full {
		width: 100%;
	}
	.check-card {
		padding: var(--space-5);
		background: var(--white);
		border-radius: var(--radius-xl);
		border: 1px solid var(--color-border);
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

	/* Success: subtle and low-key */
	.check-card.success {
		opacity: 0.7;
	}

	.check-card.cannotfix {
		opacity: 0.7;
	}

	/* Warning: subtle orange border */
	.check-card.warning {
		border-color: hsl(30, 80%, 55%);
	}

	:global([data-theme='dark']) .check-card.warning {
		border-color: hsl(30, 80%, 50%);
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
		/* width: 40px; */
		/* height: 40px; */
		font-weight: var(--font-medium);
		border-radius: var(--radius-lg);
		/* background: var(--gray-100); */
	}

	.check-icon :global(svg) {
		color: var(--gray-500);
	}

	/* Icon colors: simple and minimal */
	.check-card.success .check-icon :global(svg) {
		color: var(--color-success);
	}

	.check-card.error .check-icon :global(svg) {
		color: hsl(0, 70%, 50%);
	}

	.check-card.warning .check-icon :global(svg) {
		color: hsl(30, 80%, 50%);
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

	.check-title {
		display: flex;
		align-items: center;
		gap: var(--space-2);
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

	.category-tag {
		display: inline-flex;
		align-items: center;
		padding: 2px 8px;
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		border-radius: var(--radius-full);
		white-space: nowrap;
	}

	/* Network: Blue */
	.category-tag.network {
		background: hsla(210, 100%, 95%, 1);
		color: hsl(210, 80%, 45%);
		border: 1px solid hsla(210, 80%, 80%, 1);
	}

	:global([data-theme='dark']) .category-tag.network {
		background: hsla(210, 80%, 20%, 0.3);
		color: hsl(210, 80%, 70%);
		border-color: hsla(210, 80%, 50%, 0.5);
	}

	/* Protocol: Purple */
	.category-tag.protocol {
		background: hsla(270, 100%, 95%, 1);
		color: hsl(270, 70%, 50%);
		border: 1px solid hsla(270, 70%, 80%, 1);
	}

	:global([data-theme='dark']) .category-tag.protocol {
		background: hsla(270, 70%, 20%, 0.3);
		color: hsl(270, 70%, 70%);
		border-color: hsla(270, 70%, 50%, 0.5);
	}

	/* Contract: Green */
	.category-tag.contract {
		background: hsla(150, 80%, 95%, 1);
		color: hsl(150, 70%, 35%);
		border: 1px solid hsla(150, 70%, 70%, 1);
	}

	:global([data-theme='dark']) .category-tag.contract {
		background: hsla(150, 70%, 20%, 0.3);
		color: hsl(150, 70%, 65%);
		border-color: hsla(150, 70%, 45%, 0.5);
	}

	.doc-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: var(--gray-400);
		transition: color 0.2s ease;
	}

	.doc-link:hover {
		color: var(--color-primary);
	}

	:global([data-theme='dark']) .doc-link {
		color: var(--gray-500);
	}

	:global([data-theme='dark']) .doc-link:hover {
		color: var(--color-primary);
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
		/* padding-left: calc(40px + var(--space-3)); */
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.check-message {
		font-size: var(--text-sm);
		color: var(--gray-600);
		margin: 0;
		/* padding: var(--space-3) 0 0 0; */
		line-height: 1.6;
		font-weight: var(--font-medium);
	}

	:global([data-theme='dark']) .check-message {
		color: var(--gray-400);
	}

	/* Success message: green */
	.check-card.success .check-message {
		color: hsl(150, 60%, 35%);
	}

	:global([data-theme='dark']) .check-card.success .check-message {
		color: hsl(150, 60%, 55%);
	}

	/* Error message: red */
	.check-card.error .check-message {
		color: hsl(0, 70%, 45%);
	}

	:global([data-theme='dark']) .check-card.error .check-message {
		color: hsl(0, 70%, 60%);
	}

	/* Warning message: orange */
	.check-card.warning .check-message {
		color: hsl(30, 80%, 45%);
	}

	:global([data-theme='dark']) .check-card.warning .check-message {
		color: hsl(30, 80%, 60%);
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
		color: var(--gray-700);
		background: var(--gray-50);
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
		word-break: break-all;
		flex: 1;
		min-width: 0;
	}

	:global([data-theme='dark']) .address-code,
	:global([data-theme='dark']) .endpoint-code {
		color: var(--gray-300);
		background: var(--gray-900);
		border-color: var(--gray-700);
	}

	.explorer-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-2);
		color: var(--gray-600);
		background: var(--gray-50);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		transition: all 0.2s ease;
		flex-shrink: 0;
	}

	.explorer-link:hover {
		color: var(--color-primary);
		background: var(--gray-100);
	}

	:global([data-theme='dark']) .explorer-link {
		background: var(--gray-900);
		border-color: var(--gray-700);
		color: var(--gray-400);
	}

	:global([data-theme='dark']) .explorer-link:hover {
		background: var(--gray-800);
		color: var(--color-primary);
	}

	.mt-4 {
		margin-top: var(--space-4);
	}
	.check-actions {
		/* margin-top: var(--space-4); */
		/* padding-top: var(--space-4); */
		/* padding-left: calc(40px + var(--space-3)); */
		/* border-top: 1px solid var(--color-border); */
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
		background: var(--gray-200);
		color: var(--gray-600);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		cursor: not-allowed;
		transition: all 0.2s ease;
	}

	.deploy-button.primary {
		background: hsla(120, 60%, 96%, 1);
		color: hsl(120, 60%, 35%);
		border: 1px solid hsla(120, 60%, 60%, 1);
		cursor: pointer;
		font-weight: var(--font-medium);
	}

	.deploy-button.primary:hover {
		background: hsla(120, 60%, 94%, 1);
	}

	.deploy-button.primary:active {
		background: hsla(120, 60%, 92%, 1);
	}

	:global([data-theme='dark']) .deploy-button {
		background: var(--gray-700);
		color: var(--gray-400);
		border-color: var(--gray-600);
	}

	:global([data-theme='dark']) .deploy-button.primary {
		background: hsla(120, 60%, 15%, 0.3);
		border-color: hsla(120, 60%, 50%, 1);
		color: hsl(120, 60%, 70%);
	}

	:global([data-theme='dark']) .deploy-button.primary:hover {
		background: hsla(120, 60%, 18%, 0.4);
	}

	/* Configure RPC Button - Blue/Primary color */
	.configure-rpc-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-5);
		background: hsla(210, 80%, 96%, 1);
		color: hsl(210, 80%, 45%);
		border: 1px solid hsla(210, 80%, 60%, 1);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.configure-rpc-button:hover {
		background: hsla(210, 80%, 94%, 1);
	}

	.configure-rpc-button:active {
		background: hsla(210, 80%, 92%, 1);
	}

	:global([data-theme='dark']) .configure-rpc-button {
		background: hsla(210, 80%, 15%, 0.3);
		border-color: hsla(210, 80%, 50%, 1);
		color: hsl(210, 80%, 70%);
	}

	:global([data-theme='dark']) .configure-rpc-button:hover {
		background: hsla(210, 80%, 18%, 0.4);
	}

	.deploy-link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		background: var(--gray-100);
		color: var(--gray-700);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		text-decoration: none;
		transition: all 0.2s;
	}

	.deploy-link:hover {
		background: var(--gray-200);
	}

	:global([data-theme='dark']) .deploy-link {
		background: var(--gray-800);
		color: var(--gray-300);
		border-color: var(--gray-700);
	}

	:global([data-theme='dark']) .deploy-link:hover {
		background: var(--gray-700);
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
