/**
 * Shared state for Step 4 wallet import
 * Module-level state is shared across all component instances automatically
 */
import { SvelteSet } from 'svelte/reactivity';
import type { ImportedWallet } from '../types/wallet';
import type { ScanState, ScanEvent } from '$lib/services/balance-scanner/types';

// Module-level state - automatically shared across all imports
let importedWallets = $state<ImportedWallet[]>([]);
let isScanning = $state(false);
let scanProgress = $state(0);
let hasScanned = $state(false);
// Indicates scan completed successfully (100% without interruption)
let scanCompleted = $state(false);

// Error message
let errorMessage = $state('');
// Flag to indicate if errorMessage is just info (not an error)
let isInfoMessage = $state(false);

// Resumable scan state
let scanState = $state<ScanState | null>(null);
let isRateLimited = $state(false);
let rateLimitMessage = $state<string>('');
let canResumeScan = $state(false);

// Scan log events - limited to prevent memory issues
let scanEvents = $state<ScanEvent[]>([]);
const MAX_SCAN_EVENTS = 1000; // Keep only the latest 1000 events to prevent memory issues
const MAX_MESSAGE_LENGTH = 300; // Truncate long messages to prevent memory issues

// Scan rate tracking
let scanStartTime = $state<number | null>(null);
let totalScannedAddresses = $state(0);

export const step4State = {
	get importedWallets() {
		return importedWallets;
	},
	set importedWallets(value: ImportedWallet[]) {
		importedWallets = value;
	},
	get isScanning() {
		return isScanning;
	},
	set isScanning(value: boolean) {
		isScanning = value;
	},
	get scanProgress() {
		return scanProgress;
	},
	set scanProgress(value: number) {
		scanProgress = value;
	},
	get hasScanned() {
		return hasScanned;
	},
	set hasScanned(value: boolean) {
		hasScanned = value;
	},
	get scanCompleted() {
		return scanCompleted;
	},
	set scanCompleted(value: boolean) {
		scanCompleted = value;
	},
	get errorMessage() {
		return errorMessage;
	},
	set errorMessage(value: string) {
		errorMessage = value;
	},
	get isInfoMessage() {
		return isInfoMessage;
	},
	set isInfoMessage(value: boolean) {
		isInfoMessage = value;
	},

	// Helper methods
	addWallets(wallets: ImportedWallet[]) {
		// Avoid duplicates
		const existing = new SvelteSet(importedWallets.map((w) => w.address.toLowerCase()));
		const newWallets = wallets.filter((w) => !existing.has(w.address.toLowerCase()));
		importedWallets = [...importedWallets, ...newWallets];
	},

	clearWallets() {
		importedWallets = [];
		hasScanned = false;
		scanCompleted = false;
		scanProgress = 0;
		errorMessage = '';
		isInfoMessage = false;
	},

	clearError() {
		errorMessage = '';
		isInfoMessage = false;
	},

	removeWallet(address: string) {
		importedWallets = importedWallets.filter(
			(w) => w.address.toLowerCase() !== address.toLowerCase()
		);
	},

	getWalletsWithBalance() {
		return importedWallets.filter((w) => w.hasBalance);
	},

	// Update wallet balance information
	updateWalletBalance(
		address: string,
		hasBalance: boolean,
		balances?: { native?: string; tokens?: Record<string, string> }
	) {
		importedWallets = importedWallets.map((w) => {
			if (w.address.toLowerCase() === address.toLowerCase()) {
				return { ...w, hasBalance, balances };
			}
			return w;
		});
	},

	// Batch update wallet balances
	updateWalletBalances(
		updates: Map<
			string,
			{ hasBalance: boolean; balances?: { native?: string; tokens?: Record<string, string> } }
		>
	) {
		importedWallets = importedWallets.map((w) => {
			const update = updates.get(w.address.toLowerCase());
			if (update) {
				return { ...w, ...update };
			}
			return w;
		});
	},

	// Reset scan state
	resetScanState() {
		hasScanned = false;
		scanCompleted = false;
		scanProgress = 0;
		isScanning = false;
		scanState = null;
		isRateLimited = false;
		rateLimitMessage = '';
		canResumeScan = false;
	},

	// Resumable scan state management
	get scanState() {
		return scanState;
	},
	set scanState(value: ScanState | null) {
		scanState = value;
	},

	get isRateLimited() {
		return isRateLimited;
	},
	set isRateLimited(value: boolean) {
		isRateLimited = value;
	},

	get rateLimitMessage() {
		return rateLimitMessage;
	},
	set rateLimitMessage(value: string) {
		rateLimitMessage = value;
	},

	get canResumeScan() {
		return canResumeScan;
	},
	set canResumeScan(value: boolean) {
		canResumeScan = value;
	},

	// Handle rate limit error
	handleRateLimitError(message: string, state: ScanState) {
		isRateLimited = true;
		rateLimitMessage = message;
		scanState = state;
		canResumeScan = true;
		isScanning = false;
	},

	// Clear rate limit state
	clearRateLimitError() {
		isRateLimited = false;
		rateLimitMessage = '';
	},

	// Scan events management
	get scanEvents() {
		return scanEvents;
	},
	set scanEvents(value: ScanEvent[]) {
		scanEvents = value;
	},

	// Add a scan event (limited to MAX_SCAN_EVENTS to prevent memory issues)
	addScanEvent(event: ScanEvent) {
		// Truncate long messages to prevent memory issues
		const truncatedEvent =
			event.message.length > MAX_MESSAGE_LENGTH
				? { ...event, message: event.message.slice(0, MAX_MESSAGE_LENGTH) + '...' }
				: event;

		scanEvents = [...scanEvents, truncatedEvent];
		// Trim old events if exceeding limit
		if (scanEvents.length > MAX_SCAN_EVENTS) {
			scanEvents = scanEvents.slice(-MAX_SCAN_EVENTS);
		}
	},

	// Clear scan events
	clearScanEvents() {
		scanEvents = [];
	},

	// Scan rate tracking
	get scanStartTime() {
		return scanStartTime;
	},
	set scanStartTime(value: number | null) {
		scanStartTime = value;
	},

	get totalScannedAddresses() {
		return totalScannedAddresses;
	},
	set totalScannedAddresses(value: number) {
		totalScannedAddresses = value;
	},

	// Start scan rate tracking
	startScanTracking() {
		scanStartTime = Date.now();
		totalScannedAddresses = 0;
	},

	// Update scanned address count
	addScannedAddresses(count: number) {
		totalScannedAddresses += count;
	},

	// Get scan rate (addresses per second)
	getScanRate(): number {
		if (!scanStartTime || totalScannedAddresses === 0) {
			return 0;
		}
		const elapsedSeconds = (Date.now() - scanStartTime) / 1000;
		if (elapsedSeconds < 1) {
			return 0;
		}
		return Math.round(totalScannedAddresses / elapsedSeconds);
	},

	// Reset scan tracking
	resetScanTracking() {
		scanStartTime = null;
		totalScannedAddresses = 0;
	}
};
