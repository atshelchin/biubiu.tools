---
title: Wallet Connection
description: Learn how to connect your wallet to biubiu.tools and get started with Web3 tools.
order: 2
lastUpdated: 2025-01-01
---

## Supported Wallets

biubiu.tools supports any EVM-compatible wallet that implements the EIP-1193 standard:

- **MetaMask** - Most popular browser extension wallet
- **Coinbase Wallet** - Easy to use mobile and browser wallet
- **WalletConnect** - Connect any mobile wallet via QR code
- **Rainbow** - Beautiful and user-friendly wallet
- **Trust Wallet** - Multi-chain mobile wallet

## Connecting Your Wallet

### Step 1: Click Connect

Click the "Connect Wallet" button in the top right corner of any tool page.

### Step 2: Choose Your Wallet

Select your preferred wallet from the modal. If you're using a mobile wallet, choose WalletConnect to scan a QR code.

### Step 3: Approve the Connection

Your wallet will prompt you to approve the connection. Review the permissions and click "Connect".

## Network Switching

Many tools require you to be on a specific network. biubiu.tools will prompt you to switch networks when needed.

```javascript
// Example of adding a network
await window.ethereum.request({
	method: 'wallet_addEthereumChain',
	params: [
		{
			chainId: '0x2105', // Base (8453 in hex)
			chainName: 'Base',
			rpcUrls: ['https://mainnet.base.org'],
			nativeCurrency: {
				name: 'ETH',
				symbol: 'ETH',
				decimals: 18
			}
		}
	]
});
```

## Security Best Practices

> **Important**: Never share your private keys or seed phrase. biubiu.tools will never ask for them.

1. **Use a hardware wallet** for large amounts
2. **Verify transaction details** before signing
3. **Check the URL** to ensure you're on biubiu.tools
4. **Disconnect unused dApps** regularly

## Troubleshooting

### Wallet Not Detected

If your wallet isn't detected:

1. Make sure the wallet extension is installed
2. Refresh the page
3. Try disabling other wallet extensions

### Connection Failed

If the connection fails:

1. Check your internet connection
2. Try disconnecting and reconnecting
3. Clear your browser cache
4. Update your wallet to the latest version

## Next Steps

Now that your wallet is connected, you're ready to:

- [Deploy your first token](/docs/guides/token-deployer)
- [Scan token balances](/docs/guides/token-balance-scanner)
