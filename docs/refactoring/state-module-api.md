# State Module API Reference

This document describes the reusable state modules available in `$lib/stores/modules/`.

## Overview

State modules are Svelte 5 reactive state containers that can be composed to create tool-specific state management. Each module:

- Uses Svelte 5 Runes (`$state`, `$derived`)
- Implements the `StateModule` interface for persistence
- Is fully tested with unit tests
- Can be used independently or composed together

## Core Interface

All state modules implement the `StateModule` interface:

```typescript
interface StateModule<TState = unknown> {
	reset(): void; // Reset to initial state
	serialize(): TState; // Serialize for persistence
	deserialize(data: TState): void; // Restore from persisted data
}
```

## Available Modules

| Module                  | Purpose                 | Key Features                      |
| ----------------------- | ----------------------- | --------------------------------- |
| `TokenSelectionModule`  | Token selection state   | Multi-select, toggle, select all  |
| `WalletAddressesModule` | Wallet addresses        | Labels, batch operations          |
| `DependencyCheckModule` | Prerequisites checking  | Status tracking, pass/fail counts |
| `ScanProgressModule`    | Scan/operation progress | Status, results, pagination, logs |

---

## TokenSelectionModule

Manages token selection state for tools that need users to select tokens.

### Import

```typescript
import { createTokenSelectionModule } from '$lib/stores/modules';
import type { TokenSelectionModule, Token } from '$lib/stores/modules';
```

### Types

```typescript
type Token = NativeToken | ERC20Token;

interface TokenSelectionSerializedState {
	selectedIds: string[];
	tokens: Token[];
}
```

### State Properties

| Property         | Type                  | Description                     |
| ---------------- | --------------------- | ------------------------------- |
| `tokens`         | `Token[]`             | Available tokens to select from |
| `selectedIds`    | `ReadonlySet<string>` | Set of selected token IDs       |
| `selectedCount`  | `number`              | Number of selected tokens       |
| `selectedTokens` | `Token[]`             | Array of selected token objects |
| `hasSelection`   | `boolean`             | Whether any tokens are selected |
| `allSelected`    | `boolean`             | Whether all tokens are selected |

### Actions

| Method              | Parameters | Description                                      |
| ------------------- | ---------- | ------------------------------------------------ |
| `setTokens(tokens)` | `Token[]`  | Set available tokens (clears invalid selections) |
| `toggle(tokenId)`   | `string`   | Toggle selection of a token                      |
| `select(tokenId)`   | `string`   | Select a token                                   |
| `deselect(tokenId)` | `string`   | Deselect a token                                 |
| `selectAll()`       | -          | Select all tokens                                |
| `selectByIds(ids)`  | `string[]` | Select tokens by ID array                        |
| `clear()`           | -          | Clear all selections                             |
| `reset()`           | -          | Reset to initial state                           |

### Example Usage

```typescript
const tokenSelection = createTokenSelectionModule();

// Set available tokens
tokenSelection.setTokens([
  { id: 'eth', type: 'native', symbol: 'ETH', ... },
  { id: 'usdc', type: 'erc20', symbol: 'USDC', ... }
]);

// Toggle selection
tokenSelection.toggle('eth');  // Select ETH
tokenSelection.toggle('eth');  // Deselect ETH

// Get selected
console.log(tokenSelection.selectedCount);  // 0
console.log(tokenSelection.hasSelection);   // false

// Select all
tokenSelection.selectAll();
console.log(tokenSelection.allSelected);    // true
```

---

## WalletAddressesModule

Manages wallet addresses with optional labels, optimized for batch operations.

### Import

```typescript
import { createWalletAddressesModule } from '$lib/stores/modules';
import type { WalletAddressesModule, WalletEntry } from '$lib/stores/modules';
```

### Types

```typescript
interface WalletEntry {
	address: Address; // viem Address type
	label?: string;
}

interface WalletAddressesSerializedState {
	wallets: WalletEntry[];
}
```

### State Properties

| Property     | Type                           | Description                      |
| ------------ | ------------------------------ | -------------------------------- |
| `addresses`  | `readonly Address[]`           | List of wallet addresses         |
| `labels`     | `ReadonlyMap<Address, string>` | Map of address to label          |
| `count`      | `number`                       | Number of wallets                |
| `hasWallets` | `boolean`                      | Whether any wallets exist        |
| `entries`    | `readonly WalletEntry[]`       | Combined address + label entries |

### Actions

| Method                        | Parameters         | Description                            |
| ----------------------------- | ------------------ | -------------------------------------- |
| `addWallet(address, label?)`  | `Address, string?` | Add single wallet                      |
| `addWallets(wallets)`         | `WalletEntry[]`    | **Batch add** (single reactive update) |
| `removeWallet(address)`       | `Address`          | Remove a wallet                        |
| `updateLabel(address, label)` | `Address, string`  | Update wallet label                    |
| `clearWallets()`              | -                  | Remove all wallets                     |
| `hasAddress(address)`         | `Address`          | Check if address exists                |
| `getLabel(address)`           | `Address`          | Get label for address                  |
| `reset()`                     | -                  | Reset to initial state                 |

### Example Usage

```typescript
const wallets = createWalletAddressesModule();

// Add single wallet
wallets.addWallet('0x123...', 'Main Wallet');

// Batch add for performance (single reactive update)
wallets.addWallets([
	{ address: '0xabc...', label: 'Wallet 1' },
	{ address: '0xdef...', label: 'Wallet 2' }
	// ... 100 more wallets
]);

// Check and access
console.log(wallets.count); // 102
console.log(wallets.hasAddress('0x123...')); // true
console.log(wallets.getLabel('0x123...')); // 'Main Wallet'
```

### Performance Note

Always use `addWallets()` for bulk operations instead of looping with `addWallet()`:

```typescript
// ❌ BAD - 100 reactive updates
for (const wallet of importedWallets) {
	wallets.addWallet(wallet.address, wallet.label);
}

// ✅ GOOD - 1 reactive update
wallets.addWallets(importedWallets);
```

---

## DependencyCheckModule

Manages prerequisite/dependency check state for tools that verify conditions before proceeding.

### Import

```typescript
import { createDependencyCheckModule } from '$lib/stores/modules';
import type { DependencyCheckModule } from '$lib/stores/modules';
```

### Types

```typescript
interface DependencyCheck {
	id: string;
	label: string;
	status: 'pending' | 'checking' | 'success' | 'warning' | 'error';
	message?: string;
}

interface DependencyCheckSummary {
	allPassed: boolean;
	passedCount: number;
	failedCount: number;
	warningCount: number;
}

interface DependencyCheckSerializedState {
	checks: DependencyCheck[];
	summary: DependencyCheckSummary | null;
	hasChecked: boolean;
}
```

### State Properties

| Property       | Type                             | Description                    |
| -------------- | -------------------------------- | ------------------------------ |
| `checks`       | `DependencyCheck[]`              | List of checks                 |
| `summary`      | `DependencyCheckSummary \| null` | Check summary                  |
| `isChecking`   | `boolean`                        | Whether checks are in progress |
| `hasChecked`   | `boolean`                        | Whether checks have completed  |
| `canProceed`   | `boolean`                        | Whether all checks passed      |
| `passedCount`  | `number`                         | Number of passed checks        |
| `failedCount`  | `number`                         | Number of failed checks        |
| `warningCount` | `number`                         | Number of warnings             |

### Actions

| Method                            | Parameters                                  | Description                              |
| --------------------------------- | ------------------------------------------- | ---------------------------------------- |
| `startChecking()`                 | -                                           | Begin checking (clears previous results) |
| `finishChecking(checks, summary)` | `DependencyCheck[], DependencyCheckSummary` | Complete with results                    |
| `updateCheck(index, check)`       | `number, DependencyCheck`                   | Update a specific check                  |
| `reset()`                         | -                                           | Reset to initial state                   |

### Example Usage

```typescript
const checker = createDependencyCheckModule();

// Start checking
checker.startChecking();
console.log(checker.isChecking); // true

// Finish with results
checker.finishChecking(
	[
		{ id: 'wallet', label: 'Wallet Connected', status: 'success' },
		{ id: 'balance', label: 'Sufficient Balance', status: 'error', message: 'Balance too low' }
	],
	{ allPassed: false, passedCount: 1, failedCount: 1, warningCount: 0 }
);

console.log(checker.canProceed); // false
console.log(checker.failedCount); // 1
```

### Legacy `createStep2State()`

For simpler cases, use the legacy factory:

```typescript
import { createStep2State } from '$lib/stores/modules/dependency-check.svelte';

export const step2State = createStep2State();
```

---

## ScanProgressModule

Manages scan/processing operation state with progress tracking, results, and pagination.

### Import

```typescript
import { createScanProgressModule } from '$lib/stores/modules';
import type {
	ScanProgressModule,
	ScanStatus,
	ScanProgressInfo,
	ScanLogEntry,
	PaginationState
} from '$lib/stores/modules';
```

### Types

```typescript
type ScanStatus = 'idle' | 'scanning' | 'paused' | 'completed' | 'error';

interface ScanProgressInfo {
	current: number;
	total: number;
	percentage: number;
}

interface ScanLogEntry {
	timestamp: number;
	type: 'info' | 'warning' | 'error' | 'success';
	message: string;
}

interface PaginationState {
	page: number;
	pageSize: number;
	totalItems: number;
	totalPages: number;
}
```

### State Properties

| Property           | Type                      | Description                 |
| ------------------ | ------------------------- | --------------------------- |
| `status`           | `ScanStatus`              | Current scan status         |
| `progress`         | `ScanProgressInfo`        | Progress information        |
| `results`          | `TResult[]`               | Scan results (generic type) |
| `error`            | `string \| null`          | Error message if any        |
| `sessionId`        | `string \| null`          | Unique session identifier   |
| `logs`             | `readonly ScanLogEntry[]` | Operation logs (last 100)   |
| `pagination`       | `PaginationState`         | Pagination state            |
| `isIdle`           | `boolean`                 | Status is 'idle'            |
| `isScanning`       | `boolean`                 | Status is 'scanning'        |
| `isPaused`         | `boolean`                 | Status is 'paused'          |
| `isCompleted`      | `boolean`                 | Status is 'completed'       |
| `hasError`         | `boolean`                 | Has error status or message |
| `hasResults`       | `boolean`                 | Has any results             |
| `resultCount`      | `number`                  | Total result count          |
| `paginatedResults` | `TResult[]`               | Results for current page    |

### Actions

**Status Actions:**

| Method                  | Parameters | Description                           |
| ----------------------- | ---------- | ------------------------------------- |
| `startScan(sessionId?)` | `string?`  | Start scan (auto-generates sessionId) |
| `pauseScan()`           | -          | Pause scanning                        |
| `resumeScan()`          | -          | Resume scanning                       |
| `completeScan()`        | -          | Mark scan as completed                |
| `setError(error)`       | `string`   | Set error status                      |
| `clearError()`          | -          | Clear error                           |

**Progress Actions:**

| Method                       | Parameters         | Description             |
| ---------------------------- | ------------------ | ----------------------- |
| `setProgress(progress)`      | `ScanProgressInfo` | Set progress info       |
| `incrementProgress(current)` | `number`           | Update current progress |

**Result Actions:**

| Method                | Parameters  | Description           |
| --------------------- | ----------- | --------------------- |
| `setResults(results)` | `TResult[]` | Replace all results   |
| `addResult(result)`   | `TResult`   | Add single result     |
| `addResults(results)` | `TResult[]` | **Batch add** results |
| `clearResults()`      | -           | Clear all results     |

**Log Actions:**

| Method                  | Parameters                                      | Description    |
| ----------------------- | ----------------------------------------------- | -------------- |
| `addLog(type, message)` | `'info'\|'warning'\|'error'\|'success', string` | Add log entry  |
| `clearLogs()`           | -                                               | Clear all logs |

**Pagination Actions:**

| Method              | Parameters | Description      |
| ------------------- | ---------- | ---------------- |
| `setPage(page)`     | `number`   | Navigate to page |
| `setPageSize(size)` | `number`   | Change page size |

### Example Usage

```typescript
interface TokenBalance {
	address: string;
	balance: bigint;
}

const scanner = createScanProgressModule<TokenBalance>();

// Start scan
scanner.startScan();
scanner.setProgress({ current: 0, total: 100, percentage: 0 });
scanner.addLog('info', 'Starting token balance scan...');

// Update progress during scan
for (let i = 0; i < 100; i++) {
	const balance = await fetchBalance(tokens[i]);
	scanner.addResult({ address: tokens[i], balance });
	scanner.incrementProgress(i + 1);
}

// Complete
scanner.completeScan();
scanner.addLog('success', `Found ${scanner.resultCount} balances`);

// Paginate results
scanner.setPageSize(20);
scanner.setPage(2);
const page2Results = scanner.paginatedResults;
```

---

## Composing Modules

Modules can be composed together in feature-specific state:

```typescript
// features/my-tool/stores/app-state.svelte.ts
import {
	createTokenSelectionModule,
	createWalletAddressesModule,
	createScanProgressModule
} from '$lib/stores/modules';

class MyToolState {
	tokens = createTokenSelectionModule();
	wallets = createWalletAddressesModule();
	scanner = createScanProgressModule<MyResult>();

	reset() {
		this.tokens.reset();
		this.wallets.reset();
		this.scanner.reset();
	}
}

export const appState = new MyToolState();
```

## Testing

All modules have comprehensive unit tests in `src/lib/stores/modules/*.spec.ts`. See test files for additional usage examples.

Run tests:

```bash
bun run test:unit
```
