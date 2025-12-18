<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import { step3State } from '../../stores/step3-state.svelte';
	import { step4State } from '../../stores/step4-state.svelte';
	import { step5State } from '../../stores/step5-state.svelte';
	import StepContent from '$lib/components/step/step-content.svelte';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import {
		ResumeDialog,
		ScanIdleState,
		ScanScanningState,
		ScanPausedState,
		ScanCompletedState,
		ScanErrorState
	} from '../components/scan-states';
	import {
		useTokenScanner,
		type StartScanParams
	} from '../../composables/use-token-scanner.svelte';
	import { PREDEFINED_TOKENS } from '$lib/config/tokens';
	import type { NativeToken, Token } from '$lib/types/token';
	import type { BalanceFilter, SortState } from '../../types/scanner';

	const i18n = useI18n();
	const connectStore = useConnectStore();
	const scanner = useTokenScanner();

	// Get selected tokens
	const selectedTokens = $derived(() => {
		if (!connectStore.currentChainId) return [];

		const tokens: Token[] = [];

		// Add native token
		const currentNetwork = connectStore.networks.find(
			(n) => n.chainId === connectStore.currentChainId
		);
		if (currentNetwork) {
			const nativeToken: NativeToken = {
				id: `${connectStore.currentChainId}:native`,
				type: 'native',
				symbol: currentNetwork.symbol,
				name: currentNetwork.name,
				decimals: 18,
				chainId: connectStore.currentChainId,
				logoUrl: ''
			};
			tokens.push(nativeToken);
		}

		// Add ERC20 tokens
		const erc20Tokens = PREDEFINED_TOKENS[connectStore.currentChainId];
		if (erc20Tokens && erc20Tokens.length > 0) {
			tokens.push(...erc20Tokens);
		}

		return tokens.filter((token) => step3State.selectedTokens.has(token.id));
	});

	// Get current network
	const currentNetwork = $derived(
		connectStore.currentChainId
			? connectStore.networks.find((n) => n.chainId === connectStore.currentChainId)
			: undefined
	);

	// Get RPC endpoints
	const rpcEndpoints = $derived(
		currentNetwork?.rpcEndpoints?.map((rpc, index) => ({
			url: rpc.url,
			name: `RPC ${index + 1}`,
			priority: rpc.isPrimary ? 0 : index + 1
		})) || []
	);

	// Sync scanner state to step5State
	$effect(() => {
		step5State.setScanStatus(scanner.status);
	});

	$effect(() => {
		if (scanner.stats) {
			step5State.setProgress({
				current: scanner.stats.success,
				total: scanner.stats.total,
				percentage: scanner.stats.progress,
				success: scanner.stats.success,
				failed: scanner.stats.failed,
				pending: scanner.stats.pending
			});
		}
	});

	$effect(() => {
		step5State.setResults(scanner.results);
	});

	$effect(() => {
		step5State.setSummary(scanner.summary);
	});

	$effect(() => {
		step5State.setError(scanner.error);
	});

	$effect(() => {
		step5State.setSessionId(scanner.sessionId);
	});

	$effect(() => {
		step5State.setTokenConfigs(scanner.tokenConfigs);
	});

	$effect(() => {
		step5State.setLogs(scanner.logs);
	});

	// Check for resumable session on mount
	$effect(() => {
		if (connectStore.currentChainId && step5State.scanStatus === 'idle') {
			checkResumable();
		}
	});

	async function checkResumable() {
		if (!connectStore.currentChainId) return;
		const resumable = await scanner.checkResumableSession(connectStore.currentChainId);
		if (resumable) {
			step5State.setResumableSession(resumable);
		}
	}

	// Action handlers
	async function handleStartScan() {
		if (!currentNetwork || !connectStore.currentChainId) {
			step5State.setError(
				i18n.t('tools.token_balance_scanner.step5.error.no_network') || 'No network selected'
			);
			return;
		}

		const tokens = selectedTokens();
		if (tokens.length === 0) {
			step5State.setError(
				i18n.t('tools.token_balance_scanner.step5.error.no_tokens') || 'No tokens selected'
			);
			return;
		}

		if (step4State.wallets.length === 0) {
			step5State.setError(
				i18n.t('tools.token_balance_scanner.step5.error.no_wallets') || 'No wallets added'
			);
			return;
		}

		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const labelMap = new Map<string, string>();
		for (const [address, label] of step4State.walletLabels.entries()) {
			labelMap.set(address.toLowerCase(), label);
		}

		const params: StartScanParams = {
			addresses: step4State.wallets,
			addressLabels: labelMap,
			tokens,
			chainId: connectStore.currentChainId,
			rpcEndpoints,
			networkName: currentNetwork.name,
			networkSymbol: currentNetwork.symbol
		};

		await scanner.startScan(params);
	}

	async function handleResumeScan() {
		if (!currentNetwork) return;
		const sessionToResume = step5State.resumableSession?.sessionId || step5State.sessionId;
		if (!sessionToResume) return;

		await scanner.resumeScan(
			sessionToResume,
			rpcEndpoints,
			currentNetwork.name,
			currentNetwork.symbol
		);
		step5State.setResumableSession(null);
	}

	async function handleDiscardSession() {
		if (!step5State.resumableSession) return;
		await scanner.deleteSession(step5State.resumableSession.sessionId);
		step5State.setResumableSession(null);
	}

	function handlePauseScan() {
		scanner.pause();
	}

	function handleResetScan() {
		scanner.reset();
		step5State.reset();
	}

	// Filter and pagination handlers
	function handleFilterChange(newFilter: Partial<BalanceFilter>) {
		step5State.setFilter(newFilter);
	}

	function handleFilterReset() {
		step5State.resetFilter();
	}

	function handlePageChange(page: number) {
		step5State.setPage(page);
	}

	function handlePageSizeChange(size: number) {
		step5State.setPageSize(size);
	}

	function handleSortChange(state: SortState) {
		step5State.setSortState(state);
	}
</script>

<StepContent>
	<StepContentHeader
		title={i18n.t('tools.token_balance_scanner.step5.title') || 'Scan & View Results'}
		description={i18n.t('tools.token_balance_scanner.step5.description') ||
			'Scan token balances and export data'}
	/>

	<div class="step5-content">
		{#if step5State.resumableSession && step5State.scanStatus === 'idle'}
			<ResumeDialog
				session={step5State.resumableSession}
				onResume={handleResumeScan}
				onDiscard={handleDiscardSession}
			/>
		{/if}

		{#if step5State.scanStatus === 'idle'}
			<ScanIdleState
				networkName={currentNetwork?.name || 'Unknown'}
				walletCount={step4State.wallets.length}
				tokenCount={step3State.selectedTokens.size}
				rpcCount={rpcEndpoints.length}
				onStartScan={handleStartScan}
			/>
		{:else if step5State.scanStatus === 'scanning'}
			<ScanScanningState progress={step5State.progress} onPause={handlePauseScan} />
		{:else if step5State.scanStatus === 'paused'}
			<ScanPausedState
				progress={step5State.progress}
				error={step5State.error}
				onResume={handleResumeScan}
				onNewScan={handleResetScan}
			/>
		{:else if step5State.scanStatus === 'completed'}
			<ScanCompletedState
				results={step5State.results}
				summary={step5State.summary}
				tokens={step5State.tokenConfigs}
				filter={step5State.filter}
				sortState={step5State.sortState}
				pagination={step5State.pagination}
				paginatedResults={step5State.paginatedResults}
				filteredCount={step5State.filteredResults.length}
				onFilterChange={handleFilterChange}
				onFilterReset={handleFilterReset}
				onSortChange={handleSortChange}
				onPageChange={handlePageChange}
				onPageSizeChange={handlePageSizeChange}
			/>
		{:else if step5State.scanStatus === 'error'}
			<ScanErrorState error={step5State.error} onRetry={handleStartScan} />
		{/if}
	</div>
</StepContent>

<style>
	.step5-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}
</style>
