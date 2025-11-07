# Balance Scanning Test Guide

## Overview

The balance scanning feature has been implemented in Step 4. This guide will help you test the functionality.

## Implementation Status

✅ **Completed:**

- Web3 integration with viem PublicClient
- Native token balance scanning (ETH, BNB, MATIC, etc.)
- ERC20 token balance scanning
- Progress tracking during scan
- Wallet balance state management
- Error handling and validation

## Prerequisites

Before testing balance scanning, make sure:

1. **Step 1: Connect Wallet** - Wallet connected and network selected
2. **Step 2: Configure** - Dependencies checked (CREATE2 proxy)
3. **Step 3: Select Tokens** - At least one token selected
4. **Step 4: Import Wallets** - At least one wallet imported

## Test Scenarios

### Scenario 1: Basic Balance Scan (Test Network)

**Network:** Sepolia Testnet (11155111)

**Test Mnemonic:**

```
test test test test test test test test test test test junk
```

**Expected Results:**

- Scan completes without errors
- Progress indicator shows 0% → 100%
- Wallets display balance status
- "With Balance" count updates

### Scenario 2: Multiple Wallets Scan

**Steps:**

1. Import 10-20 wallets using mnemonic (index 0-19)
2. Select ETH + 2-3 ERC20 tokens
3. Click "🔍 Scan Balances"
4. Watch progress indicator

**Expected Results:**

- Progress updates smoothly (10%, 20%, 30%...)
- Scan completes in reasonable time (depends on RPC speed)
- Wallets with zero balances show `hasBalance: false`

### Scenario 3: Error Handling

**Test Cases:**

1. **No tokens selected**
   - Go to Step 4 without selecting tokens in Step 3
   - Click "Scan Balances"
   - Expected: Error message "Please select tokens in Step 3 first"

2. **No wallets imported**
   - Clear all wallets
   - Click "Scan Balances"
   - Expected: Error message "No wallets to scan"

3. **RPC timeout/failure**
   - Use a network with slow/unreliable RPC
   - Expected: Error message with explanation

## How Balance Scanning Works

### 1. Data Collection

```typescript
// Get selected tokens from Step 3
const selectedTokenIds = Array.from(step3State.selectedTokenIds);

// Get all available tokens for current network
const allTokens = getAllTokensForChain(connectStore.currentChainId);

// Filter to selected tokens only
const selectedTokens = allTokens.filter((token) => selectedTokenIds.includes(token.id));
```

### 2. RPC Client Setup

```typescript
// Create viem PublicClient with current network RPC
const publicClient = createPublicClient({
	chain: {
		id: currentNetwork.chainId,
		name: currentNetwork.name,
		nativeCurrency: { name: '...', symbol: '...', decimals: 18 },
		rpcUrls: { default: { http: [rpcUrl] } }
	},
	transport: http(rpcUrl)
});
```

### 3. Batch Scanning

```typescript
// Scan all wallets with progress tracking
const results = await scanMultipleWallets(
	publicClient,
	importedWallets,
	tokenAddresses,
	chainId,
	(progress) => {
		step4State.scanProgress = progress.percentage; // Updates UI
	}
);
```

### 4. State Update

```typescript
// Convert results to storage format
const updates = new SvelteMap();
for (const [address, result] of results.entries()) {
	updates.set(address.toLowerCase(), {
		hasBalance: result.hasBalance,
		balances: {
			native: '...',
			tokens: { '1:0x...': '100.5' }
		}
	});
}

// Update all wallet states at once
step4State.updateWalletBalances(updates);
step4State.hasScanned = true;
```

## UI States

### Before Scan

```
Imported Wallets (5)

[🔍 Scan Balances] [Clear All]

Wallet List:
- 0x1234...5678
- 0xabcd...ef01
```

### During Scan

```
Imported Wallets (5)
Scanning: 40%

[⏳ Scanning... 40%] [Clear All]

Wallet List:
- 0x1234...5678
- 0xabcd...ef01
```

### After Scan

```
Imported Wallets (5)
With Balance: 2

[🔍 Scan Balances] [Clear All]

Wallet List:
- 0x1234...5678 ✅ (has balance)
- 0xabcd...ef01 ❌ (no balance)
```

## Step 5 Integration

After scanning, Step 5 can filter wallets:

```typescript
// Show only wallets with balance
let onlyWithBalance = $state(false);

let walletsToSweep = $derived.by(() => {
	if (onlyWithBalance) {
		return step4State.getWalletsWithBalance();
	}
	return step4State.importedWallets;
});
```

## Troubleshooting

### Scan is very slow

**Possible causes:**

- Network has slow RPC endpoint
- Too many tokens selected (each token = 1 RPC call per wallet)
- Many wallets imported (10+ wallets)

**Solutions:**

- Select fewer tokens
- Use a faster RPC endpoint
- Scan in smaller batches

### "No RPC endpoint available"

**Cause:** Current network configuration is missing RPC endpoints

**Solution:**

- Check network configuration in Step 1
- Ensure RPC endpoint is properly configured

### Scan fails with timeout

**Cause:** RPC endpoint is unresponsive or rate-limiting

**Solution:**

- Try again after a few seconds
- Switch to a different network
- Check network status

## Performance Metrics

**Expected scan times (Sepolia testnet):**

- 1 wallet, 1 token: < 1 second
- 10 wallets, 3 tokens: 3-5 seconds
- 50 wallets, 3 tokens: 15-25 seconds
- 100 wallets, 5 tokens: 30-60 seconds

**Note:** Actual times depend heavily on RPC endpoint speed and reliability.

## Next Steps

After implementing balance scanning:

1. ✅ Test on testnet (Sepolia)
2. ⏳ Test on mainnet with real wallets
3. ⏳ Implement sweep execution logic (Step 5)
4. ⏳ Add transaction monitoring
5. ⏳ Add batch execution control

## Related Files

- `src/features/token-sweep/ui/step4-import-wallets.svelte` - UI implementation
- `src/features/token-sweep/utils/balance-scanner.ts` - Scanning logic
- `src/features/token-sweep/stores/step4-state.svelte.ts` - State management
- `src/features/token-sweep/types/wallet.ts` - Type definitions
