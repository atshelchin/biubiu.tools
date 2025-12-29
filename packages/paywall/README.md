# @shelchin/paywall

A flexible paywall system for managing membership and usage quotas with blockchain verification.

## Features

- **Membership verification** via smart contract
- **Usage quota tracking** with daily limits
- **IndexedDB caching** with anti-tampering protection
- **Signature-based security** - wallet signature as personalized salt
- **Browser fingerprint** - prevents cross-device cache copying
- **Safe verification** - RPC failures don't delete valid cache
- **Configurable** - contract address, ABI, cache keys, timing all customizable

## Installation

```bash
bun add @shelchin/paywall
# or
npm install @shelchin/paywall
```

## Peer Dependencies

- `svelte` ^5.0.0
- `viem` ^2.0.0

## Quick Start

### 1. Initialize the paywall

```ts
import { initPaywall } from '@shelchin/paywall';
import MyPremiumABI from './contracts/MyPremium.json';

initPaywall({
	contract: {
		address: '0x...', // Your membership contract
		abi: MyPremiumABI.abi,
		functionName: 'getSubscriptionInfo' // Optional, defaults to 'getSubscriptionInfo'
	},
	cache: {
		membershipKeyPrefix: 'myapp-membership', // Optional
		usageKeyPrefix: 'myapp-usage', // Optional
		checksumSalt: 'myapp-v1' // Optional
	},
	selfHostedMode: import.meta.env.VITE_SELF_HOSTED === 'true' // Optional
});
```

### 2. Create a paywall rule

```ts
import { createMembershipOnlyRule } from '@shelchin/paywall';

export const myFeaturePaywall = createMembershipOnlyRule('my-feature', {
	daily: 100, // Free tier: 100 items per day
	countBy: 'items'
});
```

### 3. Use in components

```svelte
<script>
	import { usePaywall } from '@shelchin/paywall';
	import { myFeaturePaywall } from './paywall';

	const paywall = usePaywall({ rule: myFeaturePaywall });

	async function handleAction() {
		const result = await paywall.check(items.length);

		if (!result.allowed) {
			showUpgradeModal();
			return;
		}

		if (!result.freeUse) {
			showPaymentConfirm(result);
			return;
		}

		await doAction();
		await paywall.recordUsage(items.length);
	}
</script>
```

## Configuration

### Contract Configuration

```ts
interface ContractConfig {
	address: Address; // Contract address
	abi: Abi; // Contract ABI
	functionName?: string; // Default: 'getSubscriptionInfo'
}
```

The contract function should return `[isPremium: boolean, expiryTime: uint256, remainingTime: uint256]`.

### Cache Configuration

```ts
interface CacheConfig {
	membershipKeyPrefix?: string; // Default: 'paywall-membership'
	usageKeyPrefix?: string; // Default: 'paywall-usage'
	checksumSalt?: string; // Default: 'paywall-v1'
}
```

### Timing Configuration

```ts
interface TimingConfig {
	verifyIntervalMs?: number; // Default: 180000 (3 min)
	initialVerifyDelayMs?: number; // Default: 5000
	maxRetryAttempts?: number; // Default: 3
	retryBaseDelayMs?: number; // Default: 1000
	retryMaxDelayMs?: number; // Default: 10000
}
```

## Rule Types

### Membership Only

```ts
createMembershipOnlyRule('feature-id', freeQuota?, options?)
```

### Pay Per Use

```ts
createPayPerUseRule('feature-id', perUseFee, options?)
```

### Hybrid (Free + Pay)

```ts
createHybridRule('feature-id', {
	freeQuota: { daily: 10, countBy: 'items' },
	perUseFee: 0.003,
	feeInContract: true
});
```

### Free (No Restrictions)

```ts
createFreeRule('feature-id');
```

## API Reference

### Stores

- `createMembershipStore()` - Creates membership state store
- `useMembershipStore()` - Gets membership store from context
- `createUsageQuotaStore()` - Creates usage tracking store
- `useUsageQuotaStore()` - Gets usage store from context

### Composables

- `usePaywall({ rule })` - Main paywall checker
- `verifyMembership(address, chainId, rpcUrl)` - Verify cached membership
- `terminateVerifier()` - Cleanup worker

### Security Utilities

- `requestSignature(walletClient, address)` - Request signature for security
- `generateSecureChecksum(...)` - Generate tamper-proof checksum
- `verifySecureChecksum(...)` - Verify checksum

## Self-Hosted Mode

Set `selfHostedMode: true` to bypass all paywall checks:

```ts
initPaywall({
  contract: { ... },
  selfHostedMode: import.meta.env.VITE_SELF_HOSTED === 'true'
});
```

Then build with:

```bash
VITE_SELF_HOSTED=true bun run build
```

## License

MIT
