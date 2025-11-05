<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { SvelteMap, SvelteSet } from 'svelte/reactivity';
	import type { Address } from 'viem';
	import CodeEditor from '@/lib/components/widgets/CodeEditor.svelte';
	import { validatePrivateKey, getAddressFromPrivateKey } from './utils/wallet';
	import { SUPPORTED_NETWORKS, COMMON_TOKENS } from './constants/networks';
	import type { Network, Token, WalletInfo, ExecutionResult } from './types';
	import { useTheme } from '$lib/stores/theme.svelte';
	import { WalletValidator } from './utils/wallet-validator';
	import { StorageManager } from './utils/storage';
	import { validateNetwork, validateToken } from './utils/validation';

	// State management
	let currentStep = $state(1); // Current active step
	let selectedNetwork = $state<Network | null>(null);
	let selectedTokens = $state<Token[]>([]);
	let wallets = $state<WalletInfo[]>([]);
	let targetAddress = $state('');
	let isExecuting = $state(false);
	let isValidating = $state(false);
	let validationProgress = $state(0);
	let validationStats = $state({
		processed: 0,
		valid: 0
	});
	let needsRevalidation = $state(false); // Track if keys need re-validation after editing
	const themeStore = useTheme();

	// Custom items
	let customNetworks = $state<Network[]>([]);
	let customTokens = new SvelteMap<number, Token[]>();
	let networkOverrides = $state<Record<number, Partial<Network>>>({});
	let allNetworks = $derived(
		(() => {
			// Apply overrides to built-in networks
			const overriddenNetworks = SUPPORTED_NETWORKS.map((network) => {
				const override = networkOverrides[network.chainId];
				return override ? { ...network, ...override } : network;
			});
			return [...overriddenNetworks, ...customNetworks];
		})()
	);

	// Get tokens for the current network
	let currentNetworkTokens = $derived(() => {
		if (!selectedNetwork) return [];
		const builtInTokens = COMMON_TOKENS[selectedNetwork.chainId] || [];
		const userTokens = customTokens.get(selectedNetwork.chainId) || [];
		return [...builtInTokens, ...userTokens];
	});
	// Consume the derived value to avoid unused warning
	$effect(() => {
		void currentNetworkTokens();
	});

	// Dialog states
	let showAddNetworkDialog = $state(false);
	let showEditNetworkDialog = $state(false);
	let editingNetwork = $state<Network | null>(null);
	let showAddTokenDialog = $state(false);
	let addNetworkForm = $state({
		name: '',
		chainId: '',
		rpcUrl: '',
		blockExplorer: '',
		nativeCurrencyName: '',
		nativeCurrencySymbol: '',
		nativeCurrencyDecimals: '18'
	});
	let editNetworkForm = $state({
		name: '',
		chainId: '',
		rpcUrl: '',
		blockExplorer: '',
		nativeCurrencyName: '',
		nativeCurrencySymbol: '',
		nativeCurrencyDecimals: '18'
	});
	let addTokenForm = $state({
		address: '',
		isValidating: false,
		error: ''
	});
	let networkValidationStatus = $state<{
		isValidating: boolean;
		error?: string;
		success?: boolean;
	}>({ isValidating: false });

	// Step completion status
	let stepCompleted = $state<Record<number, boolean>>({
		1: false,
		2: false,
		3: false,
		4: false,
		5: false
	});

	// CodeEditor reference
	let codeEditor = $state<CodeEditor | undefined>();

	// Initialize wallet validator
	const validator = new WalletValidator();

	// Load custom items on mount
	onMount(() => {
		customNetworks = StorageManager.getCustomNetworks();

		// Load network overrides
		networkOverrides = StorageManager.getNetworkOverrides();

		// Load all custom tokens into map
		customTokens.clear();
		[...SUPPORTED_NETWORKS, ...customNetworks].forEach((network) => {
			const tokens = StorageManager.getCustomTokens(network.chainId);
			if (tokens.length > 0) {
				customTokens.set(network.chainId, tokens);
			}
		});
	});

	// Watch for network changes to auto-select native token
	$effect(() => {
		if (selectedNetwork) {
			// Create native token object
			const nativeToken: Token = {
				address: '0x0', // Native token has special address
				symbol: selectedNetwork.nativeCurrency.symbol,
				name: selectedNetwork.nativeCurrency.name,
				decimals: selectedNetwork.nativeCurrency.decimals,
				isNative: true
			};

			// Always include native token when network changes
			if (!selectedTokens.find((t) => t.address === '0x0')) {
				selectedTokens = [nativeToken];
			}
		}
	});

	// Cleanup on component destroy
	onDestroy(() => {
		validator.destroy();
	});

	// Edit network
	function openEditNetworkDialog(network: Network) {
		editingNetwork = network;
		editNetworkForm = {
			name: network.name,
			chainId: String(network.chainId),
			rpcUrl: network.rpcUrl,
			blockExplorer: network.blockExplorer || '',
			nativeCurrencyName: network.nativeCurrency.name,
			nativeCurrencySymbol: network.nativeCurrency.symbol,
			nativeCurrencyDecimals: String(network.nativeCurrency.decimals)
		};
		showEditNetworkDialog = true;
	}

	async function saveEditedNetwork() {
		if (!editingNetwork) return;

		networkValidationStatus = { isValidating: true };

		const network = {
			name: editNetworkForm.name,
			chainId: parseInt(editNetworkForm.chainId),
			rpcUrl: editNetworkForm.rpcUrl,
			blockExplorer: editNetworkForm.blockExplorer
		};

		try {
			const result = await validateNetwork(network);

			if (result.isValid && editingNetwork) {
				const currentEditingNetwork = editingNetwork;
				const updatedNetwork: Network = {
					...network,
					nativeCurrency: {
						name: editNetworkForm.nativeCurrencyName,
						symbol: editNetworkForm.nativeCurrencySymbol,
						decimals: parseInt(editNetworkForm.nativeCurrencyDecimals)
					},
					isCustom: currentEditingNetwork.isCustom,
					features: result.features || []
				};

				// Update in storage if it's a custom network
				if (currentEditingNetwork.isCustom) {
					StorageManager.updateCustomNetwork(currentEditingNetwork.chainId, updatedNetwork);
					customNetworks = customNetworks.map((n) =>
						n.chainId === currentEditingNetwork.chainId ? updatedNetwork : n
					);
				} else {
					// For built-in networks, save as override in storage
					StorageManager.saveNetworkOverride(updatedNetwork);
					// Update the overrides in the current session
					networkOverrides = {
						...networkOverrides,
						[currentEditingNetwork.chainId]: updatedNetwork
					};
				}

				// Update selected network if it's the one being edited
				if (selectedNetwork?.chainId === currentEditingNetwork.chainId) {
					selectedNetwork = updatedNetwork;
				}

				// Show success message
				networkValidationStatus = { isValidating: false, success: true };

				// Close dialog after 3 seconds
				setTimeout(() => {
					showEditNetworkDialog = false;
					editingNetwork = null;
					networkValidationStatus = { isValidating: false };
				}, 3000);
			} else {
				networkValidationStatus = { isValidating: false, error: result.error };
			}
		} catch (error) {
			networkValidationStatus = {
				isValidating: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			};
		}
	}

	// Add custom network
	async function addCustomNetwork() {
		networkValidationStatus = { isValidating: true };

		const network = {
			name: addNetworkForm.name,
			chainId: parseInt(addNetworkForm.chainId),
			rpcUrl: addNetworkForm.rpcUrl,
			blockExplorer: addNetworkForm.blockExplorer
		};

		try {
			const result = await validateNetwork(network);

			if (result.isValid) {
				const newNetwork: Network = {
					...network,
					nativeCurrency: {
						name: addNetworkForm.nativeCurrencyName || 'ETH',
						symbol: addNetworkForm.nativeCurrencySymbol || 'ETH',
						decimals: parseInt(addNetworkForm.nativeCurrencyDecimals) || 18
					},
					isCustom: true,
					features: result.features || []
				};

				StorageManager.addCustomNetwork(newNetwork);
				customNetworks = [...customNetworks, newNetwork];

				// Show success message
				networkValidationStatus = { isValidating: false, success: true };

				// Close dialog after 3 seconds
				setTimeout(() => {
					showAddNetworkDialog = false;
					// Reset form
					addNetworkForm = {
						name: '',
						chainId: '',
						rpcUrl: '',
						blockExplorer: '',
						nativeCurrencyName: '',
						nativeCurrencySymbol: '',
						nativeCurrencyDecimals: '18'
					};
					networkValidationStatus = { isValidating: false };
				}, 3000);
			} else {
				networkValidationStatus = { isValidating: false, error: result.error };
			}
		} catch (error) {
			networkValidationStatus = {
				isValidating: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			};
		}
	}

	// Add custom token
	async function addCustomToken() {
		if (!selectedNetwork) {
			addTokenForm.error = 'Please select a network first';
			return;
		}

		addTokenForm.isValidating = true;
		addTokenForm.error = '';

		try {
			const result = await validateToken(addTokenForm.address, selectedNetwork.rpcUrl);

			if (result.isValid && result.token) {
				// Save to storage
				StorageManager.addCustomToken(selectedNetwork.chainId, result.token);

				// Update local state to immediately show the new token
				const currentTokens = customTokens.get(selectedNetwork.chainId) || [];
				customTokens.set(selectedNetwork.chainId, [...currentTokens, result.token]);

				// Show success and close dialog after a short delay
				setTimeout(() => {
					showAddTokenDialog = false;
					addTokenForm = { address: '', isValidating: false, error: '' };
				}, 1500);
			} else {
				addTokenForm.error = result.error || 'Invalid token';
			}
		} catch (error) {
			addTokenForm.error = error instanceof Error ? error.message : 'Failed to validate token';
		} finally {
			addTokenForm.isValidating = false;
		}
	}
	// Parse and validate private keys using Web Worker
	async function parsePrivateKeys() {
		const privateKeysInput = codeEditor?.getValue() || '';
		const lines = privateKeysInput.split('\n').filter((line) => line.trim());

		// Skip if no keys to validate
		if (lines.length === 0) {
			wallets = [];
			return { validWallets: [], invalidKeys: [] };
		}

		// Use Web Worker for large batches, inline for small ones
		if (lines.length > 100) {
			isValidating = true;
			validationProgress = 0;

			try {
				const result = await validator.validateKeys(lines, (progress, valid, processed) => {
					validationProgress = progress;
					if (valid !== undefined && processed !== undefined) {
						validationStats = { valid, processed };
					}
				});

				wallets = result.validWallets.map((w) => ({
					privateKey: w.privateKey,
					address: w.address,
					balances: {},
					isValid: true
				}));

				if (result.invalidKeys.length > 0) {
					console.warn('Invalid private keys detected:', result.invalidKeys.length);
				}

				return result;
			} catch (error) {
				// Only log error if it's not a cancellation
				if (error instanceof Error && error.message !== 'Validation cancelled') {
					console.error('Validation error:', error);
				}
				// Keep existing wallets if validation was cancelled
				if (error instanceof Error && error.message === 'Validation cancelled') {
					return { validWallets: wallets, invalidKeys: [] };
				}
				wallets = [];
				return { validWallets: [], invalidKeys: [] };
			} finally {
				isValidating = false;
				validationProgress = 0;
				validationStats = { processed: 0, valid: 0 };
			}
		} else {
			// For small batches, validate inline to avoid Worker overhead
			const validWallets: WalletInfo[] = [];
			const invalidKeys: string[] = [];

			for (const line of lines) {
				const key = line.trim();
				if (validatePrivateKey(key)) {
					const address = getAddressFromPrivateKey(key);
					validWallets.push({
						privateKey: key,
						address,
						balances: {},
						isValid: true
					});
				} else if (key) {
					invalidKeys.push(key);
				}
			}

			wallets = validWallets;

			if (invalidKeys.length > 0) {
				console.warn('Invalid private keys detected:', invalidKeys.length);
			}

			return { validWallets, invalidKeys };
		}
	}

	// Detect if we should use minimal setup based on line count
	let lineCount = $state(0);
	let shouldUseMinimalSetup = $derived(lineCount > 10000);
	let maxLinesWarning = $state('');

	// Update line count when editor content changes
	function updateLineCount() {
		lineCount = codeEditor?.getLineCount() || 0;
	}

	// Step navigation
	function proceedToStep(step: number) {
		if (step > currentStep && step <= 5) {
			// Mark current step as completed
			stepCompleted[currentStep] = true;
			currentStep = step;
		}
	}

	function goToStep(step: number) {
		if (step <= currentStep && step >= 1) {
			currentStep = step;
		}
	}

	// Step validation functions
	function validateStep1(): boolean {
		return selectedNetwork !== null;
	}

	function validateStep2(): boolean {
		return selectedTokens.length > 0;
	}

	function validateStep3(): boolean {
		return wallets.length > 0 && !needsRevalidation;
	}

	function validateStep4(): boolean {
		return targetAddress.trim().length > 0;
	}

	// Import EIP-7702 utilities
	import {
		batchPrivateKeys,
		constructBatchTransaction,
		estimateGas,
		formatExecutionResults
	} from './utils/eip7702';

	let executionResults = $state<ExecutionResult[]>([]);
	let showResultsDialog = $state(false);
	let resultEditor = $state<CodeEditor | undefined>();

	// Results display state
	let showResults = $state(false);
	let resultsFilter = $state({
		status: 'all', // all, success, failed, pending
		searchTerm: ''
	});
	let resultsPagination = $state({
		currentPage: 1,
		itemsPerPage: 50,
		totalItems: 0
	});
	let selectedResults = new SvelteSet<number>();
	let totalBatches = $state(0);
	let currentBatch = $state(0);

	// Prepare all batches for display (without executing)
	async function prepareBatches() {
		// First validate keys if not already done
		if (wallets.length === 0) {
			await parsePrivateKeys();
		}

		if (!targetAddress || !selectedNetwork || wallets.length === 0) {
			alert('Please complete all required fields');
			return;
		}

		// Validate target address format
		if (!/^0x[a-fA-F0-9]{40}$/i.test(targetAddress.trim())) {
			alert('Invalid target address format');
			return;
		}

		// Extract private keys from wallets
		const privateKeys = wallets.map((w) => w.privateKey);

		// Batch private keys (100 per batch)
		const batches = batchPrivateKeys(privateKeys, 100);
		totalBatches = batches.length;

		console.log(`Preparing ${totalBatches} batch(es) for ${wallets.length} wallet(s)`);

		// Filter out native token (0x0) and only keep ERC20 tokens
		const erc20Tokens = selectedTokens.filter(
			(token) =>
				token.address !== '0x0' && token.address !== '0x0000000000000000000000000000000000000000'
		);

		// Create all batch results with pending status
		executionResults = [];
		for (let i = 0; i < batches.length; i++) {
			const batch = batches[i];
			executionResults.push({
				batchId: i,
				status: 'pending', // pending, processing, success, failed
				success: false,
				transactionHash: undefined,
				error: undefined,
				timestamp: Date.now(),
				walletCount: batch.length,
				wallets: batch.map((pk) => ({
					privateKey: pk,
					address: '', // Will be filled when executing
					balances: {},
					isValid: true
				})),
				addresses: [],
				privateKeys: batch,
				gasUsed: undefined,
				totalValue: undefined,
				// Store batch data for later execution
				batchData: {
					privateKeys: batch,
					targetAddress: targetAddress as `0x${string}`,
					tokens: erc20Tokens,
					network: selectedNetwork
				}
			});
		}

		showResults = true;
		resultsPagination.totalItems = executionResults.length;
		alert(
			`Prepared ${totalBatches} batch(es) for execution. Click "Send" button for each batch to execute.`
		);
	}

	// Execute a single batch
	async function executeSingleBatch(batchId: number) {
		const result = executionResults[batchId];
		if (!result || !result.batchData) return;

		// Check if already processed
		if (result.status === 'success' || result.status === 'processing') {
			alert(`Batch #${batchId} is already ${result.status}`);
			return;
		}

		// Update status to processing
		result.status = 'processing';
		executionResults = [...executionResults];

		try {
			// Construct the transaction for this batch
			const batch = await constructBatchTransaction(
				result.batchData.privateKeys,
				result.batchData.targetAddress as Address,
				result.batchData.tokens,
				result.batchData.network,
				batchId
			);

			// Estimate gas
			const estimatedGas = await estimateGas(result.batchData.network, batch);

			// TODO: In production, send actual transaction here
			// For now, simulate success
			const mockSuccess = Math.random() > 0.2; // 80% success rate for demo

			if (mockSuccess) {
				result.status = 'success';
				result.success = true;
				result.transactionHash = `0x${Math.random().toString(16).slice(2, 66).padEnd(64, '0')}`;
				result.addresses = batch.addresses;
				result.gasUsed = estimatedGas / BigInt(10 ** 18);
				result.totalValue = BigInt(Math.floor(Math.random() * 10 * 10000));
			} else {
				result.status = 'failed';
				result.success = false;
				result.error = ['Insufficient gas', 'Network error', 'Transaction reverted'][
					Math.floor(Math.random() * 3)
				];
			}

			result.timestamp = Date.now();
			executionResults = [...executionResults];

			console.log(`Batch ${batchId}: ${result.status}`, result);
		} catch (error) {
			console.error(`Error executing batch ${batchId}:`, error);
			result.status = 'failed';
			result.success = false;
			result.error = error instanceof Error ? error.message : 'Unknown error';
			executionResults = [...executionResults];
		}
	}

	// Helper functions for results display
	function getFilteredResults() {
		let filtered = executionResults;

		// Filter by status
		if (resultsFilter.status !== 'all') {
			filtered = filtered.filter((r) =>
				resultsFilter.status === 'success' ? r.success : !r.success
			);
		}

		// Filter by search term
		if (resultsFilter.searchTerm) {
			const term = resultsFilter.searchTerm.toLowerCase();
			filtered = filtered.filter(
				(r) =>
					r.batchId.toString().includes(term) ||
					r.transactionHash?.toLowerCase().includes(term) ||
					r.error?.toLowerCase().includes(term)
			);
		}

		return filtered;
	}

	function getPaginatedResults() {
		const filtered = getFilteredResults();
		const start = (resultsPagination.currentPage - 1) * resultsPagination.itemsPerPage;
		const end = start + resultsPagination.itemsPerPage;
		return filtered.slice(start, end);
	}

	function getTotalPages() {
		return Math.ceil(getFilteredResults().length / resultsPagination.itemsPerPage);
	}

	function convertToCSV(results: ExecutionResult[]) {
		const headers = [
			'Batch ID',
			'Status',
			'Wallet Count',
			'Transaction Hash',
			'Gas Used',
			'Total Value',
			'Error',
			'Timestamp'
		];
		const rows = results.map((r) => [
			r.batchId,
			r.success ? 'Success' : 'Failed',
			r.walletCount || 100,
			r.transactionHash || '',
			r.gasUsed || '',
			r.totalValue || '0',
			r.error || '',
			new Date(r.timestamp || Date.now()).toISOString()
		]);

		return [headers, ...rows].map((row) => row.join(',')).join('\n');
	}

	function downloadCSV(content: string, filename: string) {
		const blob = new Blob([content], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		a.click();
		URL.revokeObjectURL(url);
	}

	function formatResultsForCopy(results: ExecutionResult[]) {
		return results
			.map(
				(r) =>
					`Batch #${r.batchId}: ${r.success ? '✅ Success' : '❌ Failed'} | ` +
					`Wallets: ${r.walletCount || 100} | ` +
					`${r.transactionHash ? `TX: ${r.transactionHash}` : `Error: ${r.error}`}`
			)
			.join('\n');
	}

	function viewBatchDetails(result: ExecutionResult) {
		// TODO: Implement detailed view
		console.log('View details for batch:', result);
	}

	// Get private keys for failed batches
	function getFailedPrivateKeys() {
		const failedResults = executionResults.filter((r) => !r.success && r.privateKeys);
		const allPrivateKeys: string[] = [];

		failedResults.forEach((result) => {
			if (result.privateKeys) {
				allPrivateKeys.push(...result.privateKeys);
			}
		});

		return allPrivateKeys;
	}

	// Copy failed private keys to clipboard
	function copyFailedKeys() {
		const keys = getFailedPrivateKeys();
		if (keys.length > 0) {
			navigator.clipboard.writeText(keys.join('\n'));
			alert(
				`Copied ${keys.length} private keys from ${executionResults.filter((r) => !r.success).length} failed batches to clipboard`
			);
		} else {
			alert('No failed batches found');
		}
	}

	// Download failed private keys as text file
	function downloadFailedKeys() {
		const keys = getFailedPrivateKeys();
		if (keys.length > 0) {
			const content = keys.join('\n');
			const blob = new Blob([content], { type: 'text/plain' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `failed-keys-${Date.now()}.txt`;
			a.click();
			URL.revokeObjectURL(url);
		} else {
			alert('No failed batches found');
		}
	}

	// Copy private keys for specific batch
	function copyBatchKeys(batchId: number) {
		const result = executionResults.find((r) => r.batchId === batchId);
		if (result && result.privateKeys) {
			navigator.clipboard.writeText(result.privateKeys.join('\n'));
			alert(`Copied ${result.privateKeys.length} private keys from batch #${batchId} to clipboard`);
		} else {
			alert(`No private keys found for batch #${batchId}`);
		}
	}

	// Generate mock data for testing results display
	function generateMockResults() {
		const mockResults: ExecutionResult[] = [];
		const errors = [
			'Insufficient gas',
			'Network error',
			'Transaction reverted',
			'Invalid authorization',
			'Timeout'
		];

		for (let i = 0; i < 250; i++) {
			const isSuccess = Math.random() > 0.3;
			const walletCount = Math.floor(Math.random() * 100) + 1;

			// Generate mock wallets for this batch
			const mockWallets: WalletInfo[] = [];
			for (let w = 0; w < walletCount; w++) {
				mockWallets.push({
					privateKey: `0x${Math.random().toString(16).slice(2, 66).padEnd(64, '0')}`,
					address: `0x${Math.random().toString(16).slice(2, 42).padEnd(40, '0')}`,
					balances: {},
					isValid: true
				});
			}

			mockResults.push({
				batchId: i,
				status: isSuccess ? 'success' : 'failed',
				success: isSuccess,
				transactionHash: isSuccess
					? `0x${Math.random().toString(16).slice(2, 66).padEnd(64, '0')}`
					: undefined,
				error: !isSuccess ? errors[Math.floor(Math.random() * errors.length)] : undefined,
				timestamp: Date.now() - Math.random() * 3600000,
				walletCount,
				wallets: mockWallets,
				addresses: mockWallets.map((w) => w.address as Address),
				privateKeys: mockWallets.map((w) => w.privateKey),
				gasUsed: isSuccess ? BigInt(Math.floor(Math.random() * 0.1 * 1e18)) : undefined,
				totalValue: isSuccess ? BigInt(Math.floor(Math.random() * 10 * 10000)) : BigInt(0)
			});
		}

		executionResults = mockResults;
		showResults = true;
		resultsPagination.totalItems = mockResults.length;
	}
</script>

<div class="drain-balance-app">
	<h1 class="app-title">Drain Balance Tool</h1>

	<!-- Step 1: Network Selection -->
	{#if currentStep >= 1}
		<section
			class="step-section"
			class:completed={stepCompleted[1]}
			class:active={currentStep === 1}
		>
			<div class="step-header">
				<h2>Step 1: Select Network</h2>
				{#if stepCompleted[1]}
					<button class="edit-step-btn" onclick={() => goToStep(1)}> Edit </button>
				{/if}
			</div>

			{#if currentStep === 1}
				<div class="network-grid">
					{#each allNetworks as network (network.chainId)}
						<div class="network-card-wrapper">
							<button
								class="network-card"
								class:selected={selectedNetwork?.chainId === network.chainId}
								class:custom={network.isCustom}
								onclick={() => (selectedNetwork = network)}
							>
								<div class="network-header">
									<span class="network-name">
										{network.name}
										{#if network.isCustom}
											<span class="custom-badge">Custom</span>
										{/if}
									</span>
								</div>
								<div class="network-info">
									<span class="network-id">Chain ID: {network.chainId}</span>
								</div>
								{#if network.features && network.features.length > 0}
									<div class="network-features">
										{#each network.features.slice(0, 2) as feature (feature)}
											<span class="feature-badge">
												{feature}
											</span>
										{/each}
										{#if network.features.length > 2}
											<span class="feature-badge more">+{network.features.length - 2}</span>
										{/if}
									</div>
								{/if}
							</button>
							<button
								class="network-edit-btn"
								title="Edit network settings"
								aria-label="Edit {network.name} settings"
								onclick={(e) => {
									e.stopPropagation();
									openEditNetworkDialog(network);
								}}
							>
								<span class="edit-icon">✏️</span>
							</button>
						</div>
					{/each}
					<button class="network-card add-network" onclick={() => (showAddNetworkDialog = true)}>
						<span class="add-icon">+</span>
						<span class="add-text">Add Custom Network</span>
					</button>
				</div>
				<div class="step-actions">
					<button class="btn-next" onclick={() => proceedToStep(2)} disabled={!validateStep1()}>
						Next Step →
					</button>
				</div>
			{:else if stepCompleted[1]}
				<div class="step-summary">
					<p>
						Selected Network: <strong>{selectedNetwork?.name}</strong>
						<span class="summary-detail">(Chain ID: {selectedNetwork?.chainId})</span>
					</p>
				</div>
			{/if}
		</section>
	{/if}

	<!-- Step 2: Token Selection -->
	{#if currentStep >= 2}
		<section
			class="step-section"
			class:completed={stepCompleted[2]}
			class:active={currentStep === 2}
		>
			<div class="step-header">
				<h2>Step 2: Select Tokens</h2>
				{#if stepCompleted[2]}
					<button class="edit-step-btn" onclick={() => goToStep(2)}> Edit </button>
				{/if}
			</div>

			{#if currentStep === 2}
				<div class="token-grid">
					{#if selectedNetwork}
						{@const nativeToken = {
							address: '0x0',
							symbol: selectedNetwork.nativeCurrency.symbol,
							name: selectedNetwork.nativeCurrency.name,
							decimals: selectedNetwork.nativeCurrency.decimals,
							isNative: true
						}}
						{@const otherTokens = [
							...(COMMON_TOKENS[selectedNetwork.chainId] || []),
							...(customTokens.get(selectedNetwork.chainId) || [])
						]}

						<!-- Native Token (Gas Coin) - Always first and required -->
						<label class="token-card native-token">
							<input type="checkbox" checked={true} disabled />
							<span class="token-info">
								<span class="token-symbol">
									{nativeToken.symbol}
									<span class="native-badge">Native</span>
								</span>
								<span class="token-name">{nativeToken.name} </span>
								<span class="token-description"> Auto-included </span>
							</span>
						</label>

						<!-- Other Tokens -->
						{#each otherTokens as token (token.address)}
							<label class="token-card" class:custom={token.isCustom}>
								<input
									type="checkbox"
									checked={selectedTokens.some((t) => t.address === token.address)}
									onchange={(e) => {
										if (e.currentTarget.checked) {
											selectedTokens = [...selectedTokens, token];
										} else {
											selectedTokens = selectedTokens.filter((t) => t.address !== token.address);
										}
									}}
								/>
								<span class="token-info">
									<span class="token-symbol">
										{token.symbol}
										{#if token.isCustom}
											<span class="custom-badge">Custom</span>
										{/if}
									</span>
									<span class="token-name">{token.name}</span>
									{#if token.isCustom}
										<span class="token-address"
											>{token.address.slice(0, 6)}...{token.address.slice(-4)}</span
										>
									{/if}
								</span>
							</label>
						{/each}

						<!-- Add Custom Token Button -->
						<button class="token-card add-token" onclick={() => (showAddTokenDialog = true)}>
							<span class="add-icon">+</span>
							<span class="add-text">Add Custom Token</span>
						</button>
					{/if}
				</div>
				<div class="step-actions">
					<button class="btn-prev" onclick={() => goToStep(1)}> ← Previous </button>
					<button class="btn-next" onclick={() => proceedToStep(3)} disabled={!validateStep2()}>
						Next Step →
					</button>
				</div>
			{:else if stepCompleted[2]}
				<div class="step-summary">
					<p>Selected Tokens:</p>
					<div class="token-summary-list">
						{#each selectedTokens as token (token.address)}
							<span class="token-summary-item">
								<strong>{token.symbol}</strong>
								{#if token.address && token.address !== '0x0'}
									<span class="summary-detail">
										({token.address.slice(0, 6)}...{token.address.slice(-4)})
									</span>
								{/if}
							</span>
						{/each}
					</div>
				</div>
			{/if}
		</section>
	{/if}

	<!-- Step 3: Private Keys Input -->
	{#if currentStep >= 3}
		<section
			class="step-section"
			class:completed={stepCompleted[3]}
			class:active={currentStep === 3}
		>
			<div class="step-header">
				<h2>Step 3: Enter Private Keys</h2>
				{#if stepCompleted[3]}
					<button class="edit-step-btn" onclick={() => goToStep(3)}> Edit </button>
				{/if}
			</div>

			{#if currentStep === 3}
				<p class="step-description">
					Enter one private key per line. Keys are validated when you click "Validate Keys".
				</p>
				<CodeEditor
					bind:this={codeEditor}
					initialValue=""
					placeholder="0x... or private key without 0x prefix"
					height="300px"
					theme={themeStore.theme}
					readonly={(() => {
						const shouldBeReadonly = isValidating || (wallets.length > 0 && !needsRevalidation);
						console.log('CodeEditor readonly state:', {
							isValidating,
							walletsLength: wallets.length,
							needsRevalidation,
							shouldBeReadonly
						});
						return shouldBeReadonly;
					})()}
					onBlur={() => {
						updateLineCount();
					}}
					useMinimalSetup={shouldUseMinimalSetup}
					maxLines={2000000}
					onMaxLinesExceeded={(count) => {
						maxLinesWarning = `Maximum line limit exceeded! Tried to input ${count.toLocaleString()} lines, limited to 2,000,000.`;
						setTimeout(() => (maxLinesWarning = ''), 5000);
					}}
				/>
				<div class="wallet-stats">
					<span>Valid wallets: {wallets.length}</span>
					{#if needsRevalidation}
						<span class="revalidation-warning">⚠️ Keys modified - re-validation required</span>
					{/if}
					{#if !isValidating}
						{#if wallets.length > 0 && !needsRevalidation}
							<button
								class="btn-edit-keys"
								onclick={() => {
									needsRevalidation = true;
									wallets = [];
								}}
							>
								✏️ Edit Keys
							</button>
						{:else}
							<button
								class="btn-validate"
								onclick={async () => {
									updateLineCount();
									await parsePrivateKeys();
									needsRevalidation = false;
								}}
							>
								{needsRevalidation ? 'Re-validate Keys' : 'Validate Keys'}
							</button>
						{/if}
					{:else}
						<button
							class="btn-cancel"
							onclick={() => {
								validator.cancel();
								isValidating = false;
								validationProgress = 0;
							}}
						>
							Cancel
						</button>
						<span class="validation-progress">
							Progress: {validationProgress.toFixed(1)}% | Processed: {validationStats.processed.toLocaleString()}
							| Valid: {validationStats.valid.toLocaleString()}
						</span>
					{/if}
					{#if maxLinesWarning}
						<span class="max-lines-warning">
							⚠️ {maxLinesWarning}
						</span>
					{/if}
				</div>
				<div class="step-actions">
					<button class="btn-prev" onclick={() => goToStep(2)}> ← Previous </button>
					<button class="btn-next" onclick={() => proceedToStep(4)} disabled={!validateStep3()}>
						Next Step →
					</button>
				</div>
			{:else if stepCompleted[3]}
				<div class="step-summary">
					<p>Validated Wallets: <strong>{wallets.length}</strong></p>
				</div>
			{/if}
		</section>
	{/if}

	<!-- Step 4: Target Address -->
	{#if currentStep >= 4}
		<section
			class="step-section"
			class:completed={stepCompleted[4]}
			class:active={currentStep === 4}
		>
			<div class="step-header">
				<h2>Step 4: Target Address</h2>
				{#if stepCompleted[4]}
					<button class="edit-step-btn" onclick={() => goToStep(4)}> Edit </button>
				{/if}
			</div>

			{#if currentStep === 4}
				<p class="step-description">Enter the address that will receive all collected funds</p>
				<input
					type="text"
					bind:value={targetAddress}
					placeholder="0x... address"
					class="address-input"
					readonly={stepCompleted[4]}
				/>
				<div class="step-actions">
					<button class="btn-prev" onclick={() => goToStep(3)}> ← Previous </button>
					<button class="btn-next" onclick={() => proceedToStep(5)} disabled={!validateStep4()}>
						Next Step →
					</button>
				</div>
			{:else if stepCompleted[4]}
				<div class="step-summary">
					<p>
						Target Address: <strong>{targetAddress.slice(0, 6)}...{targetAddress.slice(-4)}</strong>
					</p>
				</div>
			{/if}
		</section>
	{/if}

	<!-- Step 5: Analysis & Execution -->
	{#if currentStep >= 5}
		<section class="step-section" class:active={currentStep === 5}>
			<div class="step-header">
				<h2>Step 5: Analyze & Execute</h2>
			</div>

			{#if currentStep === 5}
				<div class="final-review">
					<h3>Review Configuration</h3>
					<ul class="review-list">
						<li>
							Network: <strong>{selectedNetwork?.name}</strong>
							<span class="summary-detail">(Chain ID: {selectedNetwork?.chainId})</span>
						</li>
						<li>
							Tokens:
							<div class="token-review-list">
								{#each selectedTokens as token (token.address)}
									<div class="token-review-item">
										<strong>{token.symbol}</strong>
										{#if token.address && token.address !== '0x0'}
											<span class="summary-detail">
												({token.address.slice(0, 6)}...{token.address.slice(-4)})
											</span>
										{/if}
									</div>
								{/each}
							</div>
						</li>
						<li>Wallets: <strong>{wallets.length}</strong></li>
						<li>
							Target: <strong>{targetAddress.slice(0, 6)}...{targetAddress.slice(-4)}</strong>
						</li>
					</ul>
				</div>

				<div class="action-buttons">
					<button
						class="btn-execute"
						onclick={prepareBatches}
						disabled={wallets.length === 0 || !targetAddress || !selectedNetwork}
					>
						📦 Prepare Batches ({Math.ceil(wallets.length / 100)} batch{Math.ceil(
							wallets.length / 100
						) > 1
							? 'es'
							: ''})
					</button>
					<p class="execute-hint">
						Prepare {Math.ceil(wallets.length / 100)} transaction batch{Math.ceil(
							wallets.length / 100
						) > 1
							? 'es'
							: ''} (100 wallets per batch). You can then send each batch individually in the results
						section below.
					</p>
				</div>

				{#if totalBatches > 0 && isExecuting}
					<div class="batch-info">
						<p>
							Processing {totalBatches} transaction batch{totalBatches > 1 ? 'es' : ''} for {wallets.length}
							wallets
						</p>
						<p>Current batch: {currentBatch}/{totalBatches}</p>
						<div class="progress-bar">
							<div
								class="progress-fill"
								style="width: {(currentBatch / totalBatches) * 100}%"
							></div>
						</div>
					</div>
				{/if}

				<div class="step-actions">
					<button class="btn-prev" onclick={() => goToStep(4)}> ← Previous </button>
				</div>
			{/if}
		</section>
	{/if}

	<!-- Results Display -->
	{#if wallets.length > 0}
		<section class="step-section">
			<h2>Wallet Analysis</h2>
			<div class="wallet-list">
				<!-- {#each wallets as wallet} -->
				<div class="wallet-item">
					<!-- <span class="wallet-address">{wallet.address}</span> -->
					<!-- TODO: Display balances -->
				</div>
				<!-- {/each} -->
			</div>
		</section>
	{/if}

	<!-- Add Network Dialog -->
	{#if showAddNetworkDialog}
		<div
			class="dialog-overlay"
			role="button"
			tabindex="0"
			onclick={() => (showAddNetworkDialog = false)}
			onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && (showAddNetworkDialog = false)}
		>
			<div
				class="dialog"
				role="dialog"
				tabindex="-1"
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => e.stopPropagation()}
			>
				<h2>Add Custom Network</h2>
				<form
					onsubmit={(e) => {
						e.preventDefault();
						addCustomNetwork();
					}}
				>
					<div class="form-group">
						<label for="network-name">Network Name *</label>
						<input
							id="network-name"
							type="text"
							bind:value={addNetworkForm.name}
							placeholder="e.g., Polygon"
							required
						/>
					</div>

					<div class="form-group">
						<label for="chain-id">Chain ID *</label>
						<input
							id="chain-id"
							type="number"
							bind:value={addNetworkForm.chainId}
							placeholder="e.g., 137"
							required
						/>
					</div>

					<div class="form-group">
						<label for="rpc-url">RPC URL *</label>
						<input
							id="rpc-url"
							type="url"
							bind:value={addNetworkForm.rpcUrl}
							placeholder="https://..."
							required
						/>
					</div>

					<div class="form-group">
						<label for="block-explorer">Block Explorer (optional)</label>
						<input
							id="block-explorer"
							type="url"
							bind:value={addNetworkForm.blockExplorer}
							placeholder="https://..."
						/>
					</div>

					<div class="form-group">
						<label for="native-symbol">Native Currency Symbol</label>
						<input
							id="native-symbol"
							type="text"
							bind:value={addNetworkForm.nativeCurrencySymbol}
							placeholder="e.g., ETH, MATIC"
						/>
					</div>

					<div class="form-group">
						<label for="native-name">Native Currency Name</label>
						<input
							id="native-name"
							type="text"
							bind:value={addNetworkForm.nativeCurrencyName}
							placeholder="e.g., Ether"
						/>
					</div>

					{#if networkValidationStatus.error}
						<div class="error-message">
							{networkValidationStatus.error}
						</div>
					{/if}

					{#if networkValidationStatus.success}
						<div class="success-message">✅ Network added successfully!</div>
					{/if}

					<div class="dialog-actions">
						<button
							type="button"
							class="btn-cancel"
							onclick={() => {
								showAddNetworkDialog = false;
								networkValidationStatus = { isValidating: false };
							}}
							disabled={networkValidationStatus.success}
						>
							Cancel
						</button>
						<button
							type="submit"
							class="btn-primary"
							disabled={networkValidationStatus.isValidating || networkValidationStatus.success}
						>
							{networkValidationStatus.isValidating
								? 'Validating...'
								: networkValidationStatus.success
									? 'Added!'
									: 'Add Network'}
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}

	<!-- Add Token Dialog -->
	{#if showAddTokenDialog}
		<div
			class="dialog-overlay"
			role="button"
			tabindex="0"
			onclick={() => (showAddTokenDialog = false)}
			onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && (showAddTokenDialog = false)}
		>
			<div
				class="dialog"
				role="dialog"
				tabindex="-1"
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => e.stopPropagation()}
			>
				<h2>Add Custom Token</h2>
				{#if selectedNetwork}
					<p class="dialog-subtitle">Adding token to: {selectedNetwork.name}</p>
				{/if}
				<form
					onsubmit={(e) => {
						e.preventDefault();
						// Validate address format before submitting
						const address = addTokenForm.address.trim();
						if (!/^0x[a-fA-F0-9]{40}$/i.test(address)) {
							addTokenForm.error =
								'Invalid address format. Please enter 0x followed by 40 hex characters.';
							return;
						}
						addCustomToken();
					}}
				>
					<div class="form-group">
						<label for="token-address">Token Contract Address *</label>
						<input
							id="token-address"
							type="text"
							bind:value={addTokenForm.address}
							placeholder="0x..."
							required
							minlength={42}
							maxlength={42}
						/>
						<small>Enter the ERC20 token contract address</small>
					</div>

					{#if addTokenForm.error}
						<div class="error-message">
							{addTokenForm.error}
						</div>
					{/if}

					<div class="dialog-actions">
						<button type="button" class="btn-cancel" onclick={() => (showAddTokenDialog = false)}>
							Cancel
						</button>
						<button type="submit" class="btn-primary" disabled={addTokenForm.isValidating}>
							{addTokenForm.isValidating ? 'Validating...' : 'Add Token'}
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}

	<!-- Edit Network Dialog -->
	{#if showEditNetworkDialog && editingNetwork}
		<div
			class="dialog-overlay"
			role="button"
			tabindex="0"
			onclick={() => (showEditNetworkDialog = false)}
			onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && (showEditNetworkDialog = false)}
		>
			<div
				class="dialog"
				role="dialog"
				tabindex="-1"
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => e.stopPropagation()}
			>
				<h2>Edit Network</h2>
				<p class="dialog-subtitle">Editing: {editingNetwork.name}</p>
				<form
					onsubmit={(e) => {
						e.preventDefault();
						saveEditedNetwork();
					}}
				>
					{#if editingNetwork.isCustom}
						<div class="form-group">
							<label for="edit-network-name">Network Name *</label>
							<input
								id="edit-network-name"
								type="text"
								bind:value={editNetworkForm.name}
								placeholder="e.g., Polygon"
								required
							/>
						</div>
					{:else}
						<div class="form-group">
							<label for="edit-network-name-disabled">Network Name</label>
							<input
								id="edit-network-name-disabled"
								type="text"
								value={editNetworkForm.name}
								disabled
								style="opacity: 0.5; cursor: not-allowed;"
							/>
						</div>
					{/if}

					<div class="form-group">
						<label for="edit-chain-id-disabled">Chain ID</label>
						<input
							id="edit-chain-id-disabled"
							type="text"
							value={editNetworkForm.chainId}
							disabled
							style="opacity: 0.5; cursor: not-allowed;"
						/>
						<small>Chain ID cannot be changed</small>
					</div>

					<div class="form-group">
						<label for="edit-rpc-url">RPC URL *</label>
						<input
							id="edit-rpc-url"
							type="url"
							bind:value={editNetworkForm.rpcUrl}
							placeholder="https://..."
							required
						/>
					</div>

					<div class="form-group">
						<label for="edit-block-explorer">Block Explorer (optional)</label>
						<input
							id="edit-block-explorer"
							type="url"
							bind:value={editNetworkForm.blockExplorer}
							placeholder="https://..."
						/>
					</div>

					<div class="form-group">
						<label for="edit-native-symbol">Native Currency Symbol</label>
						<input
							id="edit-native-symbol"
							type="text"
							bind:value={editNetworkForm.nativeCurrencySymbol}
							placeholder="e.g., ETH, MATIC"
						/>
					</div>

					<div class="form-group">
						<label for="edit-native-name">Native Currency Name</label>
						<input
							id="edit-native-name"
							type="text"
							bind:value={editNetworkForm.nativeCurrencyName}
							placeholder="e.g., Ether"
						/>
					</div>

					{#if networkValidationStatus.error}
						<div class="error-message">
							{networkValidationStatus.error}
						</div>
					{/if}

					{#if networkValidationStatus.success}
						<div class="success-message">✅ Network updated successfully!</div>
					{/if}

					<div class="dialog-actions">
						<button
							type="button"
							class="btn-cancel"
							onclick={() => {
								showEditNetworkDialog = false;
								editingNetwork = null;
								networkValidationStatus = { isValidating: false };
							}}
							disabled={networkValidationStatus.success}
						>
							Cancel
						</button>
						{#if editingNetwork?.isCustom}
							<button
								type="button"
								class="btn-danger"
								onclick={() => {
									if (
										editingNetwork &&
										confirm('Are you sure you want to delete this custom network?')
									) {
										const networkToDelete = editingNetwork;
										StorageManager.removeCustomNetwork(networkToDelete.chainId);
										customNetworks = customNetworks.filter(
											(n) => n.chainId !== networkToDelete.chainId
										);
										if (selectedNetwork?.chainId === networkToDelete.chainId) {
											selectedNetwork = null;
										}
										showEditNetworkDialog = false;
										editingNetwork = null;
									}
								}}
							>
								Delete
							</button>
						{/if}
						<button
							type="submit"
							class="btn-primary"
							disabled={networkValidationStatus.isValidating || networkValidationStatus.success}
						>
							{networkValidationStatus.isValidating
								? 'Validating...'
								: networkValidationStatus.success
									? 'Saved!'
									: 'Save Changes'}
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}

	<!-- Execution Results Dialog -->
	{#if showResultsDialog}
		<div
			class="dialog-overlay"
			onclick={() => (showResultsDialog = false)}
			role="dialog"
			tabindex="0"
			aria-modal="true"
			onkeydown={(e) => {
				if (e.key === 'Escape') showResultsDialog = false;
			}}
		>
			<div
				class="dialog results-dialog"
				role="presentation"
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => e.stopPropagation()}
			>
				<h2>Execution Results</h2>
				<p class="dialog-subtitle">Transaction batch results for {wallets.length} wallets</p>

				<div class="results-summary">
					<div class="summary-card">
						<span class="summary-label">Total Batches</span>
						<span class="summary-value">{executionResults.length}</span>
					</div>
					<div class="summary-card success">
						<span class="summary-label">Successful</span>
						<span class="summary-value">{executionResults.filter((r) => r.success).length}</span>
					</div>
					<div class="summary-card failed">
						<span class="summary-label">Failed</span>
						<span class="summary-value">{executionResults.filter((r) => !r.success).length}</span>
					</div>
				</div>

				<div class="results-editor-container">
					<CodeEditor
						bind:this={resultEditor}
						initialValue={formatExecutionResults(executionResults)}
						readonly={true}
						height="400px"
						theme={themeStore.theme}
						useMinimalSetup={executionResults.length > 50}
						maxLines={2000000}
					/>
				</div>

				<div class="dialog-actions">
					<button
						type="button"
						class="btn-cancel"
						onclick={() => {
							navigator.clipboard.writeText(formatExecutionResults(executionResults));
							alert('Results copied to clipboard!');
						}}
					>
						Copy Results
					</button>
					<button type="button" class="btn-primary" onclick={() => (showResultsDialog = false)}>
						Close
					</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Execution Results Display -->
	{#if showResults && executionResults.length > 0}
		<section class="results-section">
			<div class="results-header">
				<h2>📊 Execution Results</h2>
				<div class="results-summary">
					<div class="summary-item pending">
						<span class="summary-icon">⏳</span>
						<span class="summary-count"
							>{executionResults.filter((r) => r.status === 'pending').length}</span
						>
						<span class="summary-label">Pending</span>
					</div>
					<div class="summary-item processing">
						<span class="summary-icon">⚡</span>
						<span class="summary-count"
							>{executionResults.filter((r) => r.status === 'processing').length}</span
						>
						<span class="summary-label">Processing</span>
					</div>
					<div class="summary-item success">
						<span class="summary-icon">✅</span>
						<span class="summary-count"
							>{executionResults.filter((r) => r.status === 'success' || r.success).length}</span
						>
						<span class="summary-label">Success</span>
					</div>
					<div class="summary-item failed">
						<span class="summary-icon">❌</span>
						<span class="summary-count"
							>{executionResults.filter(
								(r) =>
									r.status === 'failed' ||
									(!r.success && r.status !== 'pending' && r.status !== 'processing')
							).length}</span
						>
						<span class="summary-label">Failed</span>
					</div>
				</div>
			</div>

			<!-- Filters and Controls -->
			<div class="results-controls">
				<div class="filter-group">
					<input
						type="text"
						placeholder="Search by batch ID, tx hash, or error..."
						bind:value={resultsFilter.searchTerm}
						class="search-input"
					/>
					<select bind:value={resultsFilter.status} class="status-filter">
						<option value="all">All Status</option>
						<option value="success">✅ Success Only</option>
						<option value="failed">❌ Failed Only</option>
					</select>
					<button
						class="btn-export"
						onclick={() => {
							const filtered = getFilteredResults();
							const csv = convertToCSV(filtered);
							downloadCSV(csv, 'drain-results.csv');
						}}
					>
						📥 Export CSV
					</button>
					<button
						class="btn-copy"
						onclick={() => {
							const filtered =
								selectedResults.size > 0
									? getFilteredResults().filter((r) => selectedResults.has(r.batchId))
									: getFilteredResults();
							const text = formatResultsForCopy(filtered);
							navigator.clipboard.writeText(text);
							alert(`Copied ${filtered.length} results to clipboard!`);
						}}
					>
						📋 Copy {selectedResults.size > 0 ? `(${selectedResults.size})` : 'All'}
					</button>
					{#if executionResults.filter((r) => !r.success).length > 0}
						<button
							class="btn-failed-keys"
							onclick={copyFailedKeys}
							title="Copy all private keys from failed batches"
						>
							🔑 Copy Failed Keys
						</button>
						<button
							class="btn-failed-keys"
							onclick={downloadFailedKeys}
							title="Download all private keys from failed batches"
						>
							💾 Download Failed Keys
						</button>
					{/if}
				</div>
			</div>

			<!-- Results Table -->
			<div class="results-table-container">
				<table class="results-table">
					<thead>
						<tr>
							<th class="checkbox-col">
								<input
									type="checkbox"
									checked={selectedResults.size === getPaginatedResults().length &&
										getPaginatedResults().length > 0}
									onchange={(e) => {
										if (e.currentTarget.checked) {
											getPaginatedResults().forEach((r) => selectedResults.add(r.batchId));
										} else {
											selectedResults.clear();
										}
									}}
								/>
							</th>
							<th>Batch</th>
							<th>Status</th>
							<th>Wallets</th>
							<th>Transaction</th>
							<th>Gas</th>
							<th>Value</th>
							<th>Error</th>
							<th>Time</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each getPaginatedResults() as result (result.batchId)}
							<tr class:success-row={result.success} class:failed-row={!result.success}>
								<td class="checkbox-col">
									<input
										type="checkbox"
										checked={selectedResults.has(result.batchId)}
										onchange={(e) => {
											const newSet = new SvelteSet(selectedResults);
											if (e.currentTarget.checked) {
												newSet.add(result.batchId);
											} else {
												newSet.delete(result.batchId);
											}
											// Direct mutation instead
										}}
									/>
								</td>
								<td class="batch-id">#{result.batchId}</td>
								<td class="status">
									{#if result.status === 'pending'}
										<span class="status-badge pending">⏳ Pending</span>
									{:else if result.status === 'processing'}
										<span class="status-badge processing">⚡ Processing</span>
									{:else if result.status === 'success' || result.success}
										<span class="status-badge success">✅ Success</span>
									{:else}
										<span class="status-badge failed">❌ Failed</span>
									{/if}
								</td>
								<td class="wallet-count">{result.walletCount || 100}</td>
								<td class="tx-hash">
									{#if result.transactionHash}
										<a
											href="{selectedNetwork?.blockExplorer}/tx/{result.transactionHash}"
											target="_blank"
											rel="noopener noreferrer"
											class="tx-link"
											title={result.transactionHash}
										>
											{result.transactionHash.slice(0, 8)}...
										</a>
									{:else}
										-
									{/if}
								</td>
								<td class="gas-used">{result.gasUsed || '-'}</td>
								<td class="total-value">{result.totalValue || '0'} ETH</td>
								<td class="error-msg">
									{#if result.error}
										<span class="error-text" title={result.error}>
											{result.error.length > 20 ? result.error.slice(0, 20) + '...' : result.error}
										</span>
									{:else}
										-
									{/if}
								</td>
								<td class="timestamp">
									{new Date(result.timestamp || Date.now()).toLocaleTimeString()}
								</td>
								<td class="actions">
									{#if result.status === 'pending'}
										<button
											class="btn-action send"
											onclick={() => executeSingleBatch(result.batchId)}
											title="Send this batch transaction"
										>
											📤 Send
										</button>
									{:else if result.status === 'processing'}
										<button class="btn-action processing" disabled> ⏳ Sending... </button>
									{:else}
										<button
											class="btn-action"
											onclick={() => copyBatchKeys(result.batchId)}
											title="Copy private keys"
										>
											🔑
										</button>
										{#if result.status === 'failed' || !result.success}
											<button
												class="btn-action retry"
												onclick={() => {
													result.status = 'pending';
													executionResults = [...executionResults];
												}}
												title="Retry this batch"
											>
												🔄
											</button>
										{/if}
									{/if}
									<button
										class="btn-action"
										onclick={() => viewBatchDetails(result)}
										title="View details"
									>
										🔍
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>

				{#if getFilteredResults().length === 0}
					<div class="no-results">
						<p>No results found matching your filters</p>
					</div>
				{/if}
			</div>

			<!-- Pagination -->
			{#if getFilteredResults().length > resultsPagination.itemsPerPage}
				<div class="pagination">
					<button
						class="page-btn"
						disabled={resultsPagination.currentPage === 1}
						onclick={() => (resultsPagination.currentPage = 1)}
					>
						First
					</button>
					<button
						class="page-btn"
						disabled={resultsPagination.currentPage === 1}
						onclick={() => resultsPagination.currentPage--}
					>
						Previous
					</button>
					<span class="page-info">
						Page {resultsPagination.currentPage} of {getTotalPages()}
					</span>
					<button
						class="page-btn"
						disabled={resultsPagination.currentPage === getTotalPages()}
						onclick={() => resultsPagination.currentPage++}
					>
						Next
					</button>
					<button
						class="page-btn"
						disabled={resultsPagination.currentPage === getTotalPages()}
						onclick={() => (resultsPagination.currentPage = getTotalPages())}
					>
						Last
					</button>
					<select
						bind:value={resultsPagination.itemsPerPage}
						onchange={() => (resultsPagination.currentPage = 1)}
						class="items-per-page"
					>
						<option value={25}>25 / page</option>
						<option value={50}>50 / page</option>
						<option value={100}>100 / page</option>
						<option value={200}>200 / page</option>
					</select>
				</div>
			{/if}

			<!-- Quick Stats Bar -->
			<div class="stats-bar">
				<div class="stat-item">
					<span class="stat-label">Total Gas:</span>
					<span class="stat-value">
						{executionResults
							.filter((r) => r.success && r.gasUsed)
							.reduce((sum, r) => sum + Number(r.gasUsed || BigInt(0)), 0)
							.toFixed(6)} ETH
					</span>
				</div>
				<div class="stat-item">
					<span class="stat-label">Collected:</span>
					<span class="stat-value">
						{(
							executionResults
								.filter((r) => r.success && r.totalValue)
								.reduce((sum, r) => sum + Number(r.totalValue || BigInt(0)), 0) / 10000
						).toFixed(4)} ETH
					</span>
				</div>
				<div class="stat-item">
					<span class="stat-label">Success Rate:</span>
					<span class="stat-value success">
						{(
							(executionResults.filter((r) => r.success).length / executionResults.length) *
							100
						).toFixed(1)}%
					</span>
				</div>
			</div>
		</section>
	{/if}

	<!-- Test Button (Remove in production) -->
	{#if import.meta.env.DEV}
		<button onclick={generateMockResults} class="mock-data-btn"> 🧪 Test with Mock Data </button>
	{/if}
</div>

<style>
	/* Mobile-First Responsive Design */
	:root {
		--mobile-padding: var(--space-3);
		--desktop-padding: var(--space-6);
		--mobile-gap: var(--space-2);
		--desktop-gap: var(--space-4);
		--touch-target: 44px;
	}
	.drain-balance-app {
		max-width: 1200px;
		margin: 0 auto;
		padding: var(--space-4);
	}

	@media (min-width: 768px) {
		.drain-balance-app {
			padding: var(--space-8);
		}
	}

	.app-title {
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		color: var(--color-heading-1);
		margin-bottom: var(--space-8);
	}

	.step-section {
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-lg);
		padding: var(--space-6);
		margin-bottom: var(--space-6);
		transition: all 300ms ease;
		opacity: 0.95;
	}

	.step-section.active {
		border-color: var(--color-primary);
		box-shadow: 0 0 0 1px var(--color-primary);
		opacity: 1;
	}

	.step-section.completed {
		background: var(--color-panel-2);
		opacity: 0.85;
	}

	.step-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-4);
	}

	.step-header h2 {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		color: var(--color-heading-2);
		margin: 0;
	}

	.edit-step-btn {
		padding: var(--space-2) var(--space-3);
		background: var(--color-panel-3);
		color: var(--color-primary);
		border: 1px solid var(--color-primary);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 150ms ease;
	}

	.edit-step-btn:hover {
		background: var(--color-primary);
		color: white;
	}

	.step-summary {
		padding: var(--space-3);
		background: var(--color-panel-3);
		border-radius: var(--radius-md);
		color: var(--color-description-2);
	}

	.step-summary p {
		margin: 0;
		font-size: var(--text-sm);
	}

	.summary-detail {
		color: var(--color-description-3);
		font-size: var(--text-xs);
		margin-left: var(--space-2);
		font-weight: normal;
	}

	.token-summary-list {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		margin-top: var(--space-2);
	}

	.token-summary-item {
		display: inline-flex;
		align-items: center;
		padding: var(--space-2) var(--space-3);
		background: var(--color-panel-2);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
	}

	.token-review-list {
		margin-top: var(--space-2);
		margin-left: var(--space-4);
	}

	.token-review-item {
		display: inline-flex;
		align-items: center;
		padding: var(--space-1) 0;
		font-size: var(--text-sm);
	}

	.token-review-item + .token-review-item {
		margin-left: var(--space-4);
	}

	.step-actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: var(--space-6);
		padding-top: var(--space-4);
		border-top: 1px solid var(--color-panel-border-2);
	}

	.btn-prev,
	.btn-next {
		padding: var(--space-3) var(--space-5);
		border-radius: var(--radius-md);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 150ms ease;
		border: none;
	}

	.btn-prev {
		background: var(--color-panel-3);
		color: var(--color-heading-2);
	}

	.btn-prev:hover {
		background: var(--color-panel-4);
	}

	.btn-next {
		background: var(--color-primary);
		color: white;
		margin-left: auto;
	}

	.btn-next:hover:not(:disabled) {
		background: var(--brand-700);
	}

	.btn-next:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.step-description {
		color: var(--color-description-3);
		margin-bottom: var(--space-4);
	}

	.network-grid,
	.token-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: var(--space-4);
	}

	.network-card-wrapper {
		position: relative;
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.network-edit-btn {
		position: absolute;
		top: var(--space-2);
		right: var(--space-2);
		width: 30px;
		height: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-panel-3);
		border: 1px solid var(--color-panel-border-3);
		border-radius: var(--radius-full);
		cursor: pointer;
		transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
		opacity: 0;
		transform: translateY(-2px) scale(0.95);
		color: var(--color-description-2);
		z-index: 10;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
	}

	.network-card-wrapper:hover .network-edit-btn {
		opacity: 0.9;
		transform: translateY(0) scale(1);
	}

	.network-edit-btn:hover {
		opacity: 1;
		background: var(--color-primary);
		border-color: var(--color-primary);
		color: white;
		transform: translateY(0) scale(1.08);
		box-shadow: 0 4px 12px var(--color-ring);
	}

	.network-edit-btn .edit-icon {
		font-size: 16px;
		line-height: 1;
		display: block;
		font-weight: normal;
	}

	.network-card {
		min-height: 120px;
		padding: var(--space-4);
		background: var(--color-panel-2);
		border: 2px solid var(--color-panel-border-2);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all 150ms ease;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: var(--space-3);
		height: 100%;
		position: relative;
		overflow: hidden;
		text-align: left;
	}

	.network-card:hover {
		background: var(--color-panel-3);
		border-color: var(--color-panel-border-3);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.network-card.selected {
		background: var(--color-primary);
		border-color: var(--color-primary);
		color: white;
		box-shadow: 0 4px 12px var(--color-ring);
	}

	.network-card-wrapper:has(.network-card.selected) .network-edit-btn {
		background: rgba(255, 255, 255, 0.25);
		border-color: rgba(255, 255, 255, 0.4);
		color: white;
	}

	.network-card-wrapper:has(.network-card.selected) .network-edit-btn:hover {
		opacity: 1;
		background: rgba(255, 255, 255, 0.35);
		border-color: rgba(255, 255, 255, 0.5);
		color: white;
	}

	.network-header {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.network-name {
		font-weight: var(--font-semibold);
		font-size: var(--text-base);
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		flex-wrap: wrap;
		line-height: 1.4;
	}

	.network-info {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.network-id {
		font-size: var(--text-sm);
		color: var(--color-description-2);
		opacity: 0.9;
	}

	.network-features {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-1);
		margin-top: auto;
	}

	.feature-badge {
		display: inline-block;
		padding: 2px 6px;
		background: var(--color-panel-3);
		color: var(--color-description-2);
		border-radius: var(--radius-xs);
		font-size: 10px;
		font-weight: var(--font-medium);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	/* .feature-badge.eip7702 {
		background: var(--color-success);
		color: white;
	} */

	.feature-badge.more {
		background: var(--color-panel-4);
		color: var(--color-description-3);
	}

	.network-card.selected .network-id {
		color: rgba(255, 255, 255, 0.9);
		opacity: 1;
	}

	.network-card.selected .feature-badge {
		background: rgba(255, 255, 255, 0.2);
		color: white;
	}

	/* .network-card.selected .feature-badge.eip7702 {
		background: rgba(255, 255, 255, 0.3);
	} */

	.token-card {
		display: flex;
		align-items: center;
		padding: var(--space-3);
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all 150ms ease;
	}

	.token-card:hover {
		background: var(--color-panel-3);
	}

	.token-info {
		display: flex;
		flex-direction: column;
		margin-left: var(--space-2);
	}

	.token-symbol {
		font-weight: var(--font-semibold);
	}

	.token-name {
		font-size: var(--text-sm);
		color: var(--color-description-3);
	}

	.wallet-stats {
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: var(--color-panel-2);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		color: var(--color-description-2);
	}

	.address-input {
		width: 100%;
		padding: var(--space-3);
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		color: var(--color-heading-2);
	}

	.address-input:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 2px var(--color-ring);
	}

	.action-buttons {
		display: flex;
		gap: var(--space-4);
	}

	.btn-execute {
		width: 100%;
		padding: var(--space-4);
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-weight: var(--font-semibold);
		font-size: var(--text-base);
		cursor: pointer;
		transition: all 150ms ease;
	}

	.btn-execute:hover:not(:disabled) {
		background: var(--brand-700);
		transform: translateY(-1px);
		box-shadow: 0 4px 12px var(--color-ring);
	}

	.btn-execute:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.batch-info {
		margin-top: var(--space-4);
		padding: var(--space-4);
		background: var(--color-panel-2);
		border-radius: var(--radius-md);
		text-align: center;
	}

	.batch-info p {
		margin: var(--space-2) 0;
		color: var(--color-description-2);
		font-size: var(--text-sm);
	}

	.progress-bar {
		width: 100%;
		height: 8px;
		background: var(--color-panel-3);
		border-radius: var(--radius-full);
		overflow: hidden;
		margin-top: var(--space-3);
	}

	.progress-fill {
		height: 100%;
		background: var(--color-primary);
		transition: width 300ms ease;
	}

	.results-dialog {
		max-width: 900px;
		width: 90%;
	}

	.results-summary {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-4);
		margin-bottom: var(--space-4);
	}

	.summary-card {
		padding: var(--space-3);
		background: var(--color-panel-2);
		border-radius: var(--radius-md);
		text-align: center;
		border: 1px solid var(--color-panel-border-2);
	}

	.summary-card.success {
		background: var(--color-panel-accent);
		border-color: var(--color-success);
	}

	.summary-card.failed {
		background: var(--color-panel-3);
		border-color: var(--color-danger);
	}

	.summary-label {
		display: block;
		font-size: var(--text-xs);
		color: var(--color-description-3);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		margin-bottom: var(--space-1);
	}

	.summary-value {
		display: block;
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--color-heading-2);
	}

	.summary-card.success .summary-value {
		color: var(--color-success);
	}

	.summary-card.failed .summary-value {
		color: var(--color-danger);
	}

	.results-editor-container {
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-md);
		overflow: hidden;
		margin-bottom: var(--space-4);
	}

	.wallet-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.wallet-item {
		padding: var(--space-3);
		background: var(--color-panel-2);
		border-radius: var(--radius-md);
		font-family: monospace;
		font-size: var(--text-sm);
	}

	.max-lines-warning {
		display: block;
		color: var(--color-danger);
		font-size: var(--text-sm);
		margin-top: var(--space-2);
		animation: fadeIn 0.3s ease-in;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.validation-progress {
		color: var(--color-primary);
		font-size: var(--text-sm);
		margin-left: var(--space-4);
		font-weight: var(--font-semibold);
	}

	.btn-validate,
	.btn-edit-keys {
		margin-left: var(--space-4);
		padding: var(--space-2) var(--space-4);
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 150ms ease;
	}

	.btn-validate:hover:not(:disabled),
	.btn-edit-keys:hover:not(:disabled) {
		background: var(--brand-700);
	}

	.btn-validate:disabled,
	.btn-edit-keys:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* .btn-edit-keys {
		background: var(--color-panel-accent);
	} */

	.revalidation-warning {
		color: var(--color-warning);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		margin: 0 var(--space-3);
	}

	.btn-cancel {
		margin-left: var(--space-4);
		padding: var(--space-2) var(--space-4);
		background: var(--color-danger);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 150ms ease;
	}

	.btn-cancel:hover {
		background: var(--red-700);
	}

	.final-review {
		background: var(--color-panel-2);
		border-radius: var(--radius-md);
		padding: var(--space-4);
		margin-bottom: var(--space-6);
	}

	.final-review h3 {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--color-heading-3);
		margin-bottom: var(--space-3);
	}

	.review-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.review-list li {
		padding: var(--space-2) 0;
		font-size: var(--text-base);
		color: var(--color-description-2);
		border-bottom: 1px solid var(--color-panel-border-1);
	}

	.review-list li:last-child {
		border-bottom: none;
	}

	.review-list strong {
		color: var(--color-heading-3);
		margin-left: var(--space-2);
	}

	/* Custom items styling */
	.network-card.custom {
		position: relative;
	}

	.token-card.custom {
		position: relative;
	}

	.custom-badge {
		display: inline-block;
		padding: 2px 6px;
		background: var(--color-warning);
		color: white;
		border-radius: var(--radius-xs);
		font-size: 10px;
		font-weight: var(--font-semibold);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.native-badge {
		display: inline-block;
		padding: 2px 6px;
		background: var(--color-success);
		color: white;
		border-radius: var(--radius-sm);
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		margin-left: var(--space-2);
	}

	.native-token {
		border-color: var(--color-success);
		background: var(--color-panel-3);
	}

	.native-token input[type='checkbox'] {
		cursor: not-allowed;
	}

	.token-description {
		font-size: var(--text-xs);
		color: var(--color-description-3);
		font-style: italic;
	}

	.add-network,
	.add-token {
		min-height: 120px;
		border: 2px dashed var(--color-panel-border-3);
		background: var(--color-panel-2);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 150ms ease;
	}

	.add-network:hover,
	.add-token:hover {
		border-color: var(--color-primary);
		background: var(--color-panel-3);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.add-icon {
		font-size: var(--text-2xl);
		color: var(--color-primary);
		margin-bottom: var(--space-2);
	}

	.add-text {
		font-size: var(--text-sm);
		color: var(--color-description-2);
	}

	.token-address {
		font-size: var(--text-xs);
		color: var(--color-description-3);
		font-family: monospace;
	}

	/* Dialog styles */
	.dialog-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.dialog {
		background: var(--color-panel-1);
		border-radius: var(--radius-lg);
		padding: var(--space-6);
		max-width: 500px;
		width: 90%;
		max-height: 80vh;
		overflow-y: auto;
		box-shadow:
			0 20px 25px -5px rgba(0, 0, 0, 0.1),
			0 10px 10px -5px rgba(0, 0, 0, 0.04);
	}

	.dialog h2 {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		color: var(--color-heading-2);
		margin-bottom: var(--space-4);
	}

	.dialog-subtitle {
		color: var(--color-description-2);
		margin-bottom: var(--space-4);
		font-size: var(--text-sm);
	}

	.form-group {
		margin-bottom: var(--space-4);
	}

	.form-group label {
		display: block;
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-heading-3);
		margin-bottom: var(--space-2);
	}

	.form-group input {
		width: 100%;
		padding: var(--space-3);
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		color: var(--color-heading-2);
	}

	.form-group input:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 2px var(--color-ring);
	}

	.form-group small {
		display: block;
		margin-top: var(--space-1);
		font-size: var(--text-xs);
		color: var(--color-description-3);
	}

	.dialog-actions {
		display: flex;
		justify-content: flex-end;
		gap: var(--space-3);
		margin-top: var(--space-6);
		padding-top: var(--space-4);
		border-top: 1px solid var(--color-panel-border-2);
	}

	.btn-primary {
		padding: var(--space-3) var(--space-5);
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 150ms ease;
	}

	.btn-primary:hover:not(:disabled) {
		background: var(--brand-700);
	}

	.btn-primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-danger {
		padding: var(--space-3) var(--space-5);
		background: var(--color-danger);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 150ms ease;
	}

	.btn-danger:hover {
		background: var(--red-700);
	}

	.error-message {
		padding: var(--space-3);
		background: var(--color-panel-3);
		border: 1px solid var(--color-danger);
		border-radius: var(--radius-md);
		color: var(--color-danger);
		font-size: var(--text-sm);
		margin-top: var(--space-3);
	}

	.success-message {
		padding: var(--space-3);
		background: var(--color-panel-accent);
		border: 1px solid var(--color-success);
		border-radius: var(--radius-md);
		color: var(--color-success);
		font-size: var(--text-sm);
		margin-top: var(--space-3);
		animation: pulse 1s ease-in-out infinite;
		position: relative;
		overflow: hidden;
	}

	.success-message::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		height: 2px;
		background: var(--color-success);
		animation: progress 3s linear forwards;
	}

	@keyframes progress {
		from {
			width: 100%;
		}
		to {
			width: 0;
		}
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.9;
		}
	}

	/* Results Section Styles */
	.results-section {
		margin-top: var(--space-8);
		background: var(--color-panel-1);
		border-radius: var(--radius-lg);
		padding: var(--space-6);
		border: 1px solid var(--color-panel-2);
	}

	.results-header {
		margin-bottom: var(--space-6);
	}

	.results-header h2 {
		font-size: var(--text-xl);
		margin-bottom: var(--space-4);
		color: var(--color-text);
	}

	.results-summary {
		display: flex;
		gap: var(--space-4);
		margin-bottom: var(--space-6);
	}

	.summary-item {
		flex: 1;
		background: var(--color-panel-2);
		border-radius: var(--radius-md);
		padding: var(--space-4);
		text-align: center;
		border: 1px solid var(--color-panel-3);
	}

	.summary-item.success {
		background: var(--color-panel-accent);
		border-color: var(--color-success);
	}

	.summary-item.failed {
		background: var(--color-panel-3);
		border-color: var(--color-danger);
	}

	.summary-item.pending {
		background: var(--color-panel-2);
		border-color: var(--color-warning);
	}

	.summary-item.processing {
		background: var(--color-panel-2);
		border-color: var(--color-info);
		animation: pulse 2s infinite;
	}

	.summary-icon {
		font-size: var(--text-2xl);
		display: block;
		margin-bottom: var(--space-2);
	}

	.summary-count {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		display: block;
		margin-bottom: var(--space-1);
	}

	.summary-label {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}

	/* Filters and Controls */
	.results-controls {
		margin-bottom: var(--space-4);
	}

	.filter-group {
		display: flex;
		gap: var(--space-3);
		align-items: center;
		flex-wrap: wrap;
	}

	.search-input {
		flex: 1;
		min-width: 200px;
		padding: var(--space-2) var(--space-3);
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-3);
		border-radius: var(--radius-md);
		color: var(--color-text);
		font-size: var(--text-sm);
	}

	.status-filter {
		padding: var(--space-2) var(--space-3);
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-3);
		border-radius: var(--radius-md);
		color: var(--color-text);
		font-size: var(--text-sm);
		cursor: pointer;
	}

	.btn-export,
	.btn-copy,
	.btn-failed-keys {
		padding: var(--space-2) var(--space-3);
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		cursor: pointer;
		transition: all 150ms ease;
	}

	.btn-failed-keys {
		background: var(--color-warning);
	}

	.btn-export:hover,
	.btn-copy:hover,
	.btn-failed-keys:hover {
		opacity: 0.9;
	}

	.btn-action {
		padding: var(--space-1) var(--space-2);
		background: var(--color-panel-3);
		border: 1px solid var(--color-panel-4);
		border-radius: var(--radius-sm);
		color: var(--color-text);
		font-size: var(--text-sm);
		cursor: pointer;
		margin: 0 var(--space-1);
		transition: all 150ms ease;
	}

	.btn-action:hover {
		background: var(--color-panel-4);
	}

	.btn-action.retry {
		background: var(--color-warning);
		color: white;
		border-color: var(--color-warning);
	}

	.actions {
		white-space: nowrap;
	}

	/* Results Table */
	.results-table-container {
		overflow-x: auto;
		margin-bottom: var(--space-4);
		background: var(--color-panel-2);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-panel-3);
	}

	.results-table {
		width: 100%;
		border-collapse: collapse;
		font-size: var(--text-sm);
	}

	.results-table th {
		background: var(--color-panel-3);
		padding: var(--space-3);
		text-align: left;
		font-weight: var(--font-semibold);
		color: var(--color-text);
		border-bottom: 2px solid var(--color-panel-4);
	}

	.results-table td {
		padding: var(--space-3);
		border-bottom: 1px solid var(--color-panel-3);
		color: var(--color-text);
	}

	.results-table tbody tr:hover {
		background: var(--color-panel-3);
	}

	.results-table tbody tr.success-row {
		background: var(--color-panel-accent);
	}

	.results-table tbody tr.failed-row {
		background: rgba(239, 68, 68, 0.05);
	}

	.checkbox-col {
		width: 40px;
		text-align: center;
	}

	.batch-id {
		font-weight: var(--font-medium);
	}

	.status-badge {
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-sm);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
	}

	.status-badge.success {
		background: var(--color-success);
		color: white;
	}

	.status-badge.failed {
		background: var(--color-danger);
		color: white;
	}

	.status-badge.pending {
		background: var(--color-warning);
		color: white;
	}

	.status-badge.processing {
		background: var(--color-info);
		color: white;
		animation: pulse 1.5s infinite;
	}

	.btn-action.send {
		background: var(--color-success);
		color: white;
		border-color: var(--color-success);
		font-weight: var(--font-medium);
		padding: var(--space-2) var(--space-3);
	}

	.btn-action.send:hover {
		background: var(--brand-700);
	}

	.btn-action.processing {
		background: var(--color-info);
		color: white;
		border-color: var(--color-info);
		cursor: wait;
		animation: pulse 1.5s infinite;
	}

	.execute-hint {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		margin-top: var(--space-3);
		text-align: center;
	}

	.tx-link {
		color: var(--color-primary);
		text-decoration: none;
		font-family: monospace;
		font-size: var(--text-xs);
	}

	.tx-link:hover {
		text-decoration: underline;
	}

	.error-text {
		color: var(--color-danger);
		font-size: var(--text-xs);
	}

	.no-results {
		padding: var(--space-8);
		text-align: center;
		color: var(--color-text-secondary);
	}

	/* Pagination */
	.pagination {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-3);
		margin-top: var(--space-4);
	}

	.page-btn {
		padding: var(--space-2) var(--space-3);
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-3);
		border-radius: var(--radius-md);
		color: var(--color-text);
		font-size: var(--text-sm);
		cursor: pointer;
		transition: all 150ms ease;
	}

	.page-btn:hover:not(:disabled) {
		background: var(--color-panel-3);
	}

	.page-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.page-info {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}

	.items-per-page {
		padding: var(--space-2) var(--space-3);
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-3);
		border-radius: var(--radius-md);
		color: var(--color-text);
		font-size: var(--text-sm);
		cursor: pointer;
	}

	/* Stats Bar */
	.stats-bar {
		display: flex;
		gap: var(--space-4);
		padding-top: var(--space-4);
		border-top: 1px solid var(--color-panel-3);
		margin-top: var(--space-4);
	}

	.stat-item {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.stat-label {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}

	.stat-value {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--color-text);
	}

	.stat-value.success {
		color: var(--color-success);
	}

	/* Mock Data Button */
	.mock-data-btn {
		position: fixed;
		bottom: var(--space-6);
		right: var(--space-6);
		padding: var(--space-3) var(--space-4);
		background: var(--color-success);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		cursor: pointer;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		z-index: 1000;
		transition: all 150ms ease;
	}

	.mock-data-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
	}

	/* === MOBILE OPTIMIZATIONS === */

	/* Mobile: Step Sections */
	@media (max-width: 767px) {
		.step-section {
			padding: var(--space-4) !important;
			margin-bottom: var(--space-4) !important;
			border-radius: var(--radius-md) !important;
		}

		.step-header {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--space-2);
		}

		.step-header h2 {
			font-size: var(--text-lg) !important;
		}

		.edit-step-btn {
			align-self: flex-end;
			margin-top: calc(var(--space-2) * -1);
		}

		/* Mobile: Network and Token Cards */
		.network-grid {
			grid-template-columns: 1fr !important;
			gap: var(--space-3) !important;
		}

		.token-grid {
			grid-template-columns: repeat(2, 1fr) !important;
			gap: var(--space-2) !important;
		}

		.network-card,
		.token-card {
			min-height: var(--touch-target);
			padding: var(--space-3) !important;
		}

		/* .network-card h3 {
			font-size: var(--text-base) !important;
		} */

		/* Mobile: Buttons */
		.btn-next,
		.btn-prev,
		.btn-execute {
			width: 100% !important;
			min-height: var(--touch-target) !important;
			padding: var(--space-3) !important;
			font-size: var(--text-base) !important;
		}

		.step-actions {
			flex-direction: column !important;
			gap: var(--space-3) !important;
		}

		/* Mobile: Form Elements */
		.address-input,
		input[type='text'],
		input[type='url'],
		input[type='number'],
		select /* ,
		textarea */ {
			width: 100% !important;
			min-height: var(--touch-target) !important;
			font-size: 16px !important; /* Prevents zoom on iOS */
			padding: var(--space-3) !important;
		}

		/* Mobile: Results Section */
		.results-section {
			padding: var(--space-4) !important;
			margin-top: var(--space-4) !important;
		}

		.results-summary {
			flex-direction: column !important;
			gap: var(--space-2) !important;
		}

		.summary-item {
			display: flex !important;
			align-items: center !important;
			justify-content: space-between !important;
			padding: var(--space-3) !important;
			text-align: left !important;
		}

		.summary-item .summary-icon {
			display: inline-block !important;
			margin-bottom: 0 !important;
			margin-right: var(--space-3) !important;
			font-size: var(--text-xl) !important;
		}

		.summary-item .summary-count {
			font-size: var(--text-xl) !important;
			margin-bottom: 0 !important;
			margin-right: auto !important;
		}

		.summary-item .summary-label {
			font-size: var(--text-sm) !important;
		}

		/* Mobile: Filter Controls */
		.filter-group {
			flex-direction: column !important;
			gap: var(--space-2) !important;
		}

		.search-input {
			width: 100% !important;
			min-width: 0 !important;
		}

		.btn-export,
		.btn-copy,
		.btn-failed-keys {
			width: 100% !important;
			padding: var(--space-3) !important;
		}

		/* Mobile: Results Table */
		.results-table-container {
			overflow-x: auto !important;
			-webkit-overflow-scrolling: touch !important;
			margin: 0 calc(var(--space-4) * -1) !important;
			padding: 0 var(--space-4) !important;
		}

		.results-table {
			min-width: 600px !important;
			font-size: var(--text-xs) !important;
		}

		.results-table th,
		.results-table td {
			padding: var(--space-2) !important;
		}

		/* Hide less important columns on mobile */
		.gas-used,
		.total-value {
			display: none !important;
		}

		/* Mobile: Pagination */
		.pagination {
			flex-wrap: wrap !important;
			justify-content: center !important;
			gap: var(--space-2) !important;
			padding: var(--space-3) !important;
		}

		.page-btn {
			min-width: var(--touch-target) !important;
			min-height: 36px !important;
		}

		.page-info {
			width: 100% !important;
			text-align: center !important;
			order: -1 !important;
			margin-bottom: var(--space-2) !important;
		}

		.items-per-page {
			width: 100% !important;
		}

		/* Mobile: Stats Bar */
		.stats-bar {
			flex-direction: column !important;
			gap: var(--space-2) !important;
			padding: var(--space-3) !important;
		}

		.stat-item {
			justify-content: space-between !important;
			padding: var(--space-2) 0 !important;
			border-bottom: 1px solid var(--color-panel-3);
		}

		.stat-item:last-child {
			border-bottom: none;
		}

		/* Mobile: Dialogs */
		.dialog {
			width: calc(100vw - var(--space-6)) !important;
			max-width: 400px !important;
			max-height: 85vh !important;
			padding: var(--space-4) !important;
		}

		.dialog h2 {
			font-size: var(--text-lg) !important;
		}

		.form-group label {
			font-size: var(--text-sm) !important;
		}

		/* Mobile: Wallet Stats */
		.wallet-stats {
			flex-direction: column !important;
			gap: var(--space-2) !important;
			align-items: stretch !important;
		}

		.wallet-stats > * {
			width: 100% !important;
		}

		/* Mobile: Progress Bar */
		.progress-bar {
			height: 6px !important;
		}

		/* Mobile: Add Network/Token Buttons */
		.network-card.add-network,
		.token-card.add-token {
			min-height: 80px !important;
		}
	}

	/* Tablet Optimizations */
	@media (min-width: 768px) and (max-width: 1023px) {
		.network-grid {
			grid-template-columns: repeat(2, 1fr) !important;
		}

		.token-grid {
			grid-template-columns: repeat(3, 1fr) !important;
		}

		.results-summary {
			gap: var(--space-3) !important;
		}

		.filter-group {
			flex-wrap: wrap !important;
		}
	}

	/* Touch Device Optimizations */
	@media (hover: none) and (pointer: coarse) {
		/* Increase all touch targets */
		button,
		/* .btn, */
		input[type='checkbox'] /* ,
		input[type='radio'] */ {
			min-height: var(--touch-target) !important;
			min-width: var(--touch-target) !important;
		}

		/* Add active states for better feedback */
		button:active /* ,
		.btn:active */ {
			transform: scale(0.98);
			opacity: 0.9;
		}

		/* Improve hover states on touch devices */
		.network-card:active,
		.token-card:active {
			transform: scale(0.98);
			background: var(--color-panel-3);
		}
	}

	/* Dark Mode Mobile Adjustments */
	@media (prefers-color-scheme: dark) and (max-width: 767px) {
		.step-section {
			background: var(--color-panel-1);
			border-color: var(--color-panel-3);
		}

		.results-table-container {
			background: var(--color-panel-1);
		}
	}

	/* Landscape Mobile Optimizations */
	@media (max-width: 767px) and (orientation: landscape) {
		.app-title {
			font-size: var(--text-xl) !important;
			margin-bottom: var(--space-4) !important;
		}

		.step-section {
			padding: var(--space-3) !important;
		}

		.network-grid {
			grid-template-columns: repeat(2, 1fr) !important;
		}
	}

	/* High Contrast Mode Support */
	@media (prefers-contrast: high) {
		.network-card.selected /* ,
		.token-card.selected */ {
			outline: 3px solid var(--color-primary);
			outline-offset: 2px;
		}

		button:focus,
		/* .btn:focus, */
		input:focus,
		select:focus /* ,
		textarea:focus */ {
			outline: 3px solid var(--color-primary);
			outline-offset: 2px;
		}
	}

	/* Reduced Motion Support */
	@media (prefers-reduced-motion: reduce) {
		* {
			animation-duration: 0.01ms !important;
			animation-iteration-count: 1 !important;
			transition-duration: 0.01ms !important;
		}
	}

	/* Small Screen Height Optimizations */
	@media (max-height: 600px) {
		.app-title {
			margin-bottom: var(--space-3) !important;
		}

		.step-section {
			padding: var(--space-3) !important;
			margin-bottom: var(--space-3) !important;
		}

		.dialog {
			max-height: 90vh !important;
		}
	}
</style>
