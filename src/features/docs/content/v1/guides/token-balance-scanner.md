---
title: Token Balance Scanner
description: Learn how to scan and monitor token balances across multiple wallets using biubiu.tools.
order: 2
lastUpdated: 2025-01-01
---

## Overview

The Token Balance Scanner helps you check token balances across multiple wallets simultaneously. Perfect for portfolio tracking, airdrop verification, and wallet management.

## Features

- **Multi-wallet scanning** - Check balances for hundreds of wallets at once
- **Multi-token support** - Scan for multiple tokens in one request
- **Cross-chain** - Scan across different networks
- **Export options** - Download results as CSV or JSON

## How to Use

### Step 1: Connect Wallet (Optional)

While you can scan any addresses without connecting, connecting your wallet allows you to:

- Save your scan history
- Quick-add connected addresses
- Export with enhanced options

### Step 2: Add Wallets

Enter wallet addresses to scan:

```
0x1234567890123456789012345678901234567890
0x2345678901234567890123456789012345678901
0x3456789012345678901234567890123456789012
```

You can paste multiple addresses separated by:

- New lines
- Commas
- Spaces

### Step 3: Select Tokens

Choose tokens to scan for:

1. **Popular tokens** - ETH, USDT, USDC, etc.
2. **Custom tokens** - Enter any token contract address
3. **All tokens** - Scan for all token transfers (slower)

### Step 4: Run Scan

Click "Scan Balances" and wait for results.

## Understanding Results

### Balance Display

```typescript
interface BalanceResult {
	address: string; // Wallet address
	token: string; // Token symbol
	balance: string; // Token balance
	balanceUSD: string; // USD value (if available)
	lastActivity: Date; // Last transaction
}
```

### Status Indicators

| Status     | Meaning            |
| ---------- | ------------------ |
| ✅ Success | Balance retrieved  |
| ⚠️ Warning | Partial data       |
| ❌ Error   | Failed to retrieve |

## Batch Scanning

For scanning many wallets, use batch mode:

```javascript
// Example batch scan request
const scanConfig = {
	addresses: [
		'0x1234...',
		'0x5678...'
		// ... up to 1000 addresses
	],
	tokens: [
		'0x0000000000000000000000000000000000000000', // Native token
		'0xdAC17F958D2ee523a2206206994597C13D831ec7' // USDT
	],
	network: 'ethereum'
};
```

## Export Options

### CSV Format

```csv
Address,Token,Balance,USD Value
0x1234...,ETH,1.5,3750.00
0x1234...,USDT,1000,1000.00
```

### JSON Format

```json
{
	"timestamp": "2025-01-01T00:00:00Z",
	"network": "ethereum",
	"results": [
		{
			"address": "0x1234...",
			"balances": [{ "token": "ETH", "balance": "1.5", "usd": "3750.00" }]
		}
	]
}
```

## Performance Tips

1. **Batch sizes**: Scan 100-200 addresses per batch for best speed
2. **Token selection**: Specify tokens instead of scanning all
3. **Network selection**: Choose one network per scan
4. **Caching**: Results are cached for 5 minutes

## Rate Limits

| Plan    | Addresses/scan | Scans/hour |
| ------- | -------------- | ---------- |
| Free    | 100            | 10         |
| Premium | 1000           | Unlimited  |

## Common Use Cases

### Portfolio Tracking

Scan all your wallets to see total holdings.

### Airdrop Verification

Check if airdrop tokens were received across multiple wallets.

### Wallet Auditing

Verify balances before/after transactions.

## Related Tools

- [Wallet Sweep](/apps/wallet-sweep) - Consolidate tokens
- [One-to-Many Transfer](/apps/one-to-many-transfer) - Distribute tokens
- [Contract Events Scanner](/apps/contract-events-scanner) - Monitor transfers
