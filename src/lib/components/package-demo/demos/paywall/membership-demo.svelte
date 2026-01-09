<script lang="ts">
	/**
	 * Membership Demo
	 * Simulates the membership store with mock data
	 */
	import {
		Wallet,
		Crown,
		Calendar,
		Clock,
		Database,
		RefreshCw,
		Trash2,
		Check,
		X,
		Link,
		Unlink
	} from '@lucide/svelte';
	import { DemoSection, DemoContent, CodeBlock, DemoButton } from '$lib/components/package-demo';

	interface Props {
		t: (key: string) => string;
	}

	let { t }: Props = $props();

	// Mock state
	let isConnected = $state(false);
	let mockAddress = $state('0x742d35Cc6634C0532925a3b844Bc9e7595f5bC8d');
	let mockChainId = $state(1);
	let isMember = $state(false);
	let expiresAt = $state<number | null>(null);
	let remainingDays = $state(0);
	let isLoading = $state(false);
	let isCached = $state(false);
	let lastVerified = $state<number | null>(null);

	function connect() {
		isConnected = true;
		isLoading = true;
		// Simulate loading from cache/contract
		setTimeout(() => {
			isLoading = false;
			isCached = true;
			lastVerified = Date.now();
		}, 800);
	}

	function disconnect() {
		isConnected = false;
		isMember = false;
		expiresAt = null;
		remainingDays = 0;
		isCached = false;
		lastVerified = null;
	}

	function mockAsMember(days: number = 30) {
		isMember = true;
		const now = Math.floor(Date.now() / 1000);
		expiresAt = now + days * 86400;
		remainingDays = days;
		isCached = true;
	}

	function mockAsNonMember() {
		isMember = false;
		expiresAt = null;
		remainingDays = 0;
		isCached = true;
	}

	function refresh() {
		isLoading = true;
		setTimeout(() => {
			isLoading = false;
			lastVerified = Date.now();
		}, 600);
	}

	function clearCache() {
		isCached = false;
		lastVerified = null;
	}

	function formatDate(timestamp: number): string {
		return new Date(timestamp * 1000).toLocaleDateString();
	}

	function formatTime(timestamp: number): string {
		return new Date(timestamp).toLocaleTimeString();
	}

	const membershipStoreCode = `import { createMembershipStore, useMembershipStore } from '@shelchin/paywall';

// In parent component (e.g., +layout.svelte)
const membershipStore = createMembershipStore();

// Update when wallet connects
$effect(() => {
  membershipStore.update(
    walletAddress,
    chainId,
    publicClient,
    rpcUrl
  );
});

// In child components
const membership = useMembershipStore();

// Reactive access
$effect(() => {
  if (membership.isMember) {
    console.log('User is a member, expires:', membership.expiresAt);
  }
});

// Manual refresh
await membership.refresh();

// Clear cache
await membership.clear();`;
</script>

<DemoSection title={t('demo.membership.title')} description={t('demo.membership.description')}>
	<DemoContent>
		{#snippet panel()}
			<!-- Mock Wallet Section -->
			<div class="wallet-section">
				<h4>{t('demo.membership.mock_wallet')}</h4>
				<div class="wallet-card" class:connected={isConnected}>
					<div class="wallet-icon">
						<Wallet size={24} />
					</div>
					<div class="wallet-info">
						{#if isConnected}
							<span class="wallet-address">{mockAddress.slice(0, 6)}...{mockAddress.slice(-4)}</span
							>
							<span class="wallet-chain">Chain ID: {mockChainId}</span>
						{:else}
							<span class="wallet-status">{t('status.disconnected')}</span>
						{/if}
					</div>
					<DemoButton
						variant={isConnected ? 'outline' : 'primary'}
						icon={isConnected ? Unlink : Link}
						onclick={isConnected ? disconnect : connect}
					>
						{isConnected ? t('demo.membership.disconnect') : t('demo.membership.connect')}
					</DemoButton>
				</div>
			</div>

			{#if isConnected}
				<!-- Mock Actions -->
				<div class="mock-actions">
					<h4>{t('demo.membership.actions')}</h4>
					<div class="action-grid">
						<DemoButton variant="success" icon={Crown} onclick={() => mockAsMember(30)}>
							{t('demo.membership.mock_member')}
						</DemoButton>
						<DemoButton variant="outline" icon={X} onclick={mockAsNonMember}>
							{t('demo.membership.mock_non_member')}
						</DemoButton>
						<DemoButton variant="outline" icon={RefreshCw} loading={isLoading} onclick={refresh}>
							{t('demo.membership.refresh')}
						</DemoButton>
						<DemoButton variant="danger" icon={Trash2} onclick={clearCache}>
							{t('demo.membership.clear_cache')}
						</DemoButton>
					</div>

					<!-- Expiry Presets -->
					<div class="expiry-presets">
						<span class="preset-label">{t('demo.membership.set_expiry')}</span>
						<div class="preset-buttons">
							{#each [7, 30, 90, 365] as days (days)}
								<button class="preset-btn" onclick={() => mockAsMember(days)}>
									{days}d
								</button>
							{/each}
						</div>
					</div>
				</div>
			{/if}
		{/snippet}

		{#snippet result()}
			<div class="status-panel">
				<h4>{t('demo.membership.status')}</h4>

				{#if !isConnected}
					<div class="not-connected">
						<Wallet size={48} />
						<p>{t('messages.not_connected')}</p>
					</div>
				{:else if isLoading}
					<div class="loading">
						<RefreshCw size={32} class="spin" />
						<p>{t('demo.membership.loading')}</p>
					</div>
				{:else}
					<!-- Membership Status Card -->
					<div class="status-card" class:member={isMember}>
						<div class="status-header">
							<Crown size={24} />
							<span>{isMember ? t('status.member') : t('status.non_member')}</span>
						</div>

						<div class="status-grid">
							<div class="status-item">
								<span class="item-label">{t('demo.membership.is_member')}</span>
								<span class="item-value" class:yes={isMember} class:no={!isMember}>
									{#if isMember}
										<Check size={16} /> {t('demo.membership.yes')}
									{:else}
										<X size={16} /> {t('demo.membership.no')}
									{/if}
								</span>
							</div>

							{#if isMember && expiresAt}
								<div class="status-item">
									<span class="item-label">{t('demo.membership.expires_at')}</span>
									<span class="item-value">
										<Calendar size={16} />
										{formatDate(expiresAt)}
									</span>
								</div>

								<div class="status-item">
									<span class="item-label">{t('demo.membership.remaining_days')}</span>
									<span class="item-value highlight">
										<Clock size={16} />
										{remainingDays} days
									</span>
								</div>
							{/if}

							<div class="status-item">
								<span class="item-label">{t('demo.membership.chain_id')}</span>
								<span class="item-value">{mockChainId}</span>
							</div>

							<div class="status-item">
								<span class="item-label">{t('demo.membership.address')}</span>
								<span class="item-value mono">{mockAddress.slice(0, 10)}...</span>
							</div>
						</div>
					</div>

					<!-- Cache Status Card -->
					<div class="cache-card">
						<div class="cache-header">
							<Database size={20} />
							<span>{t('demo.membership.cache_status')}</span>
						</div>

						<div class="cache-grid">
							<div class="cache-item">
								<span class="item-label">{t('demo.membership.cached')}</span>
								<span class="item-value" class:yes={isCached} class:no={!isCached}>
									{isCached ? t('demo.membership.yes') : t('demo.membership.no')}
								</span>
							</div>

							<div class="cache-item">
								<span class="item-label">{t('demo.membership.last_verified')}</span>
								<span class="item-value">
									{lastVerified ? formatTime(lastVerified) : t('demo.membership.never')}
								</span>
							</div>
						</div>
					</div>
				{/if}
			</div>
		{/snippet}
	</DemoContent>

	<CodeBlock title={t('code.membership_store')} code={membershipStoreCode} />
</DemoSection>

<style>
	.wallet-section,
	.mock-actions {
		margin-bottom: var(--space-4);
	}

	.wallet-section h4,
	.mock-actions h4 {
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-foreground);
		margin-bottom: var(--space-3);
	}

	.wallet-card {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-lg);
		transition: all 0.2s ease;
	}

	.wallet-card.connected {
		border-color: var(--color-primary);
		background: color-mix(in srgb, var(--color-primary) 5%, var(--color-panel-1));
	}

	.wallet-icon {
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-panel-2);
		border-radius: var(--radius-full);
		color: var(--color-muted-foreground);
	}

	.wallet-card.connected .wallet-icon {
		background: var(--color-primary);
		color: white;
	}

	.wallet-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.wallet-address {
		font-family: var(--font-mono);
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-foreground);
	}

	.wallet-chain {
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
	}

	.wallet-status {
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
	}

	.action-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-2);
	}

	.expiry-presets {
		margin-top: var(--space-4);
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.preset-label {
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
	}

	.preset-buttons {
		display: flex;
		gap: var(--space-2);
	}

	.preset-btn {
		padding: var(--space-1) var(--space-3);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		background: var(--color-card);
		color: var(--color-foreground);
		font-size: var(--text-xs);
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.preset-btn:hover {
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	/* Status Panel */
	.status-panel h4 {
		font-size: var(--text-base);
		font-weight: 600;
		color: var(--color-foreground);
		margin-bottom: var(--space-4);
	}

	.not-connected,
	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 200px;
		color: var(--color-muted-foreground);
		gap: var(--space-4);
	}

	.loading :global(.spin) {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.status-card {
		padding: var(--space-5);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
		margin-bottom: var(--space-4);
		background: var(--color-card);
	}

	.status-card.member {
		background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.05));
		border-color: rgba(251, 191, 36, 0.3);
	}

	.status-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-lg);
		font-weight: 600;
		margin-bottom: var(--space-4);
		color: var(--color-foreground);
	}

	.status-card.member .status-header {
		color: #f59e0b;
	}

	.status-grid,
	.cache-grid {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.status-item,
	.cache-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.item-label {
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
	}

	.item-value {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--color-foreground);
	}

	.item-value.yes {
		color: #10b981;
	}

	.item-value.no {
		color: #ef4444;
	}

	.item-value.highlight {
		color: var(--color-primary);
	}

	.item-value.mono {
		font-family: var(--font-mono);
	}

	.cache-card {
		padding: var(--space-4);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
		background: var(--color-panel-1);
	}

	.cache-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
		font-weight: 600;
		margin-bottom: var(--space-3);
		color: var(--color-muted-foreground);
	}
</style>
