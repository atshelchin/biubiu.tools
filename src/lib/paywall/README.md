# Paywall System

A flexible paywall system for managing membership and usage quotas in biubiu.tools.

## Overview

The paywall system supports:

- **Membership-based access**: Members get unlimited free access
- **Pay-per-use**: Non-members pay per transaction (fees collected in smart contract)
- **Quota-based limits**: Daily free quotas with upgrade prompts
- **Hybrid mode**: Free quota + pay-per-use after exhaustion

## Quick Start

### 1. Define a Paywall Rule

Create a `paywall.ts` file in your feature folder:

```typescript
// src/features/my-feature/paywall.ts
import { createMembershipOnlyRule } from '$lib/paywall';

// Membership only (no free quota)
export const myFeaturePaywall = createMembershipOnlyRule('my-feature');

// With daily free quota
export const scannerPaywall = createMembershipOnlyRule('balance-scanner', {
	daily: 1000,
	countBy: 'items' // or 'requests'
});
```

### 2. Use in Component

```svelte
<script lang="ts">
	import { usePaywall } from '$lib/paywall';
	import { myFeaturePaywall } from './paywall';

	const paywall = usePaywall({ rule: myFeaturePaywall });

	async function handleAction() {
		const result = await paywall.check(itemCount);

		if (!result.allowed) {
			// Show upgrade modal
			showUpgradeModal(result.message);
			return;
		}

		if (!result.freeUse) {
			// Show payment confirmation
			showPaymentConfirm(result.totalFee);
			return;
		}

		// Proceed with action
		await doAction();

		// Record usage (for quota-based rules)
		await paywall.recordUsage(itemCount);
	}
</script>
```

## Rule Types

### 1. Free Rule

No restrictions:

```typescript
import { createFreeRule } from '$lib/paywall';

export const publicToolPaywall = createFreeRule('public-tool');
```

### 2. Membership Only

Members only, with optional free quota for non-members:

```typescript
import { createMembershipOnlyRule } from '$lib/paywall';

// No free access
export const premiumPaywall = createMembershipOnlyRule('premium-feature');

// With 1000 items/day free
export const scannerPaywall = createMembershipOnlyRule('scanner', {
	daily: 1000,
	countBy: 'items'
});

// With custom messages
export const customPaywall = createMembershipOnlyRule(
	'feature',
	{ daily: 100, countBy: 'requests' },
	{
		message: 'Premium feature - upgrade to access',
		quotaExceededMessage: 'Daily limit reached'
	}
);
```

### 3. Pay Per Use

Members free, non-members pay per transaction:

```typescript
import { createPayPerUseRule } from '$lib/paywall';

// 0.005 ETH per transaction
export const sweepPaywall = createPayPerUseRule('wallet-sweep', 0.005, {
	feeInContract: true // Fee collected by smart contract
});

// With free quota before charging
export const hybridPaywall = createPayPerUseRule('feature', 0.003, {
	freeQuota: { daily: 5, countBy: 'items' },
	feeInContract: true
});
```

### 4. Hybrid Rule

Free quota + pay-per-use after exhaustion:

```typescript
import { createHybridRule } from '$lib/paywall';

export const batchPaywall = createHybridRule('batch-transfer', {
	freeQuota: { daily: 10, countBy: 'items' },
	perUseFee: 0.003,
	feeInContract: true
});
```

## Store Setup

Initialize stores in your root layout:

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import { createMembershipStore, createUsageQuotaStore } from '$lib/paywall';
	import { onMount } from 'svelte';

	const membership = createMembershipStore();
	const usageQuota = createUsageQuotaStore();

	// Update when wallet connects
	$effect(() => {
		if (wallet.connected) {
			membership.update(wallet.address, wallet.chainId, wallet.publicClient, wallet.rpcUrl);
			usageQuota.setAddress(wallet.address);
		} else {
			membership.update(null, null, null);
			usageQuota.setAddress(null);
		}
	});

	// Cleanup old usage records periodically
	onMount(() => {
		usageQuota.cleanupOldRecords();
	});
</script>
```

## PaywallResult Structure

```typescript
interface PaywallResult {
	allowed: boolean;

	// When allowed
	freeUse?: boolean; // true = no payment needed
	perUseFee?: number; // Fee per item (ETH)
	totalFee?: number; // Total fee (ETH)
	feeInContract?: boolean; // Fee collected by contract

	// When denied
	reason?: 'not_connected' | 'membership_required' | 'quota_exceeded' | 'payment_required';

	// UI hints
	message?: string;
	upgradeHint?: string;
	showUpgrade?: boolean;
	showPayPerUse?: boolean;
}
```

## UI Components

### PaywallPrompt

Shows appropriate prompt based on paywall result:

```svelte
<script lang="ts">
	import { PaywallPrompt } from '$lib/paywall/components';
</script>

<PaywallPrompt
	result={paywallResult}
	on:upgrade={() => (showUpgradeModal = true)}
	on:pay={() => handlePayment()}
/>
```

### UpgradeModal

Membership purchase modal:

```svelte
<script lang="ts">
	import { UpgradeModal } from '$lib/paywall/components';
</script>

<UpgradeModal bind:open={showUpgradeModal} on:success={() => membership.refresh()} />
```

## Security Features

### Anti-Tampering Protection

- All cached data (membership, usage) protected with SHA-256 checksums
- Checksum includes salt to prevent forgery
- Invalid checksums trigger cache invalidation

### Background Verification

- Web Worker periodically verifies cached membership against on-chain data
- Detects and corrects any cache/on-chain mismatches
- Runs every 5 minutes when membership is active

```typescript
// Manual verification
await membership.verifyWithWorker();

// Control background verification
membership.startBackgroundVerification();
membership.stopBackgroundVerification();
```

## API Reference

### useMembershipStore()

```typescript
const membership = useMembershipStore();

// State (reactive)
membership.isMember; // boolean
membership.expiresAt; // number | null (Unix timestamp)
membership.remainingDays; // number
membership.isLoading; // boolean
membership.isVerifying; // boolean
membership.chainId; // number | null
membership.address; // Address | null

// Methods
await membership.update(address, chainId, publicClient, rpcUrl);
await membership.refresh();
await membership.clear();
await membership.verifyWithWorker();
```

### useUsageQuotaStore()

```typescript
const usage = useUsageQuotaStore();

// Methods
const used = await usage.getDailyUsage(featureId);
await usage.recordUsage(featureId, count);
const remaining = await usage.getRemainingQuota(featureId, dailyLimit);
await usage.clearUsage(featureId);
await usage.cleanupOldRecords();
usage.setAddress(address);
```

### usePaywall(options)

```typescript
const paywall = usePaywall({ rule: myRule });

// Methods
const result = await paywall.check(itemCount);
await paywall.recordUsage(count);
const used = await paywall.getDailyUsage();
const remaining = await paywall.getRemainingQuota();

// State (reactive)
paywall.isMember; // boolean
paywall.isLoading; // boolean
```

## Smart Contract

The membership is managed by the `BiuBiuPremium` contract:

- **Address**: `0xc5c4bb399938625523250B708dc5c1e7dE4b1626`
- **Function**: `getSubscriptionInfo(address user) → (bool isPremium, uint256 expiryTime, uint256 remainingTime)`

Per-use fees are collected by feature-specific contracts (e.g., TokenSweep contract).

## Testing

Run paywall tests:

```bash
bun run test:unit src/lib/paywall/
```

Test coverage includes:

- Checksum generation/verification
- Date utilities
- Rule logic (all 4 types)
- Store operations (with mocked IndexedDB)
- Composable integration

## File Structure

```
src/lib/paywall/
├── index.ts                 # Public exports
├── types.ts                 # Type definitions
├── README.md                # This file
├── stores/
│   ├── membership.svelte.ts # Membership state management
│   ├── membership.spec.ts   # Tests
│   ├── usage-quota.svelte.ts # Usage quota tracking
│   └── usage-quota.spec.ts  # Tests
├── composables/
│   ├── use-paywall.svelte.ts # Main composable
│   ├── use-paywall.spec.ts   # Tests
│   └── use-membership-verifier.ts # Worker wrapper
├── workers/
│   └── membership-verifier.worker.ts # Background verification
├── utils/
│   ├── checksum.ts          # Anti-tampering
│   ├── checksum.spec.ts     # Tests
│   ├── contract.ts          # Contract interaction
│   ├── date.ts              # Date utilities
│   ├── date.spec.ts         # Tests
│   ├── rules.ts             # Rule helpers
│   └── rules.spec.ts        # Tests
└── components/
    ├── paywall-prompt.svelte
    └── upgrade-modal.svelte
```

## Maintenance

### Adding New Features

1. Create `paywall.ts` in your feature folder
2. Choose appropriate rule type
3. Use `usePaywall` in components
4. Record usage after successful operations

### Changing Quotas

Update the rule definition in the feature's `paywall.ts`:

```typescript
// Before
export const rule = createMembershipOnlyRule('feature', { daily: 1000, countBy: 'items' });

// After
export const rule = createMembershipOnlyRule('feature', { daily: 2000, countBy: 'items' });
```

### Debugging

```typescript
// Check membership status
console.log('isMember:', membership.isMember);
console.log('expiresAt:', new Date(membership.expiresAt * 1000));

// Check usage
const used = await usage.getDailyUsage('feature-id');
console.log('Today usage:', used);

// Force refresh from contract
await membership.refresh();

// Clear cached data
await membership.clear();
await usage.clearUsage('feature-id');
```

### Cache Keys

- Membership: `biubiu-membership:{address}:{chainId}`
- Usage: `biubiu-usage:{address}:{featureId}:{date}`

Data stored in IndexedDB via `idb-keyval`.
