# @shelchin/rpc-manager

RPC endpoint manager with automatic rotation, rate limiting, health tracking, and quality metrics.

## Features

- **Automatic Rotation**: Switches to healthy RPCs when one fails
- **Rate Limit Handling**: Cooldown period after rate limits
- **Health Tracking**: Marks unhealthy RPCs and auto-recovers
- **Quality Metrics**: Tracks success rates, response times, and rate limits
- **Persistence**: Saves quality data to localStorage (optional)
- **Zero Dependencies**: Pure TypeScript, no external dependencies

## Installation

```bash
npm install @shelchin/rpc-manager
# or
bun add @shelchin/rpc-manager
```

## Usage

### Basic RPC Manager

```typescript
import { RPCManager } from '@shelchin/rpc-manager';

const manager = new RPCManager([
	{ url: 'https://eth.llamarpc.com', name: 'Llama', priority: 1 },
	{ url: 'https://rpc.ankr.com/eth', name: 'Ankr', priority: 2 },
	{ url: 'https://cloudflare-eth.com', name: 'Cloudflare', priority: 3 }
]);

// Get current RPC
const rpcUrl = manager.getCurrentRPC();

// After successful request
manager.markSuccess();

// After failed request (auto-rotates if too many failures)
const rotated = manager.markFailed();

// After rate limit (auto-rotates)
const rotated = manager.markRateLimited();

// Check if all RPCs are exhausted
if (manager.isAllExhausted()) {
	// Wait for recovery
	await manager.waitForAvailableRPC();
}

// Get status report
console.log(manager.getStatusReport());
```

### Configuration Options

```typescript
const manager = new RPCManager(endpoints, {
	// Cooldown after rate limit (default: 30s)
	rateLimitCooldown: 30000,

	// Failures before marking unhealthy (default: 3)
	maxFailCount: 3,

	// Time before retrying unhealthy RPC (default: 60s)
	healthRecoveryTime: 60000
});
```

### Quality Tracking

```typescript
import { getRPCQualityTracker } from '@shelchin/rpc-manager';

const tracker = getRPCQualityTracker({
	storageKey: 'my_rpc_quality',
	maxAgeDays: 30,
	// Optional: integrate with cookie consent
	canPersist: () => checkConsent('functional')
});

// Record metrics
tracker.recordSuccess('https://eth.llamarpc.com', 1, 150); // 150ms response
tracker.recordFailure('https://rpc.ankr.com/eth', 1);
tracker.recordRateLimit('https://cloudflare-eth.com', 1);

// Get quality scores
const score = tracker.getQualityScore('https://eth.llamarpc.com', 1);
const successRate = tracker.getSuccessRate('https://eth.llamarpc.com', 1);

// Get best RPC for a chain
const best = tracker.getBestRPC(1); // chainId: 1 (Ethereum)
console.log(best); // { url: '...', score: 85 }

// Get ranked RPCs
const ranked = tracker.getRankedRPCs(1);

// Get recommendations
const recommendations = tracker.getRecommendations(1);
for (const rec of recommendations) {
	console.log(`[${rec.type}] ${rec.message}`);
}

// Get health summary
const summary = tracker.getHealthSummary(1);
console.log(summary.status); // 'healthy' | 'warning' | 'degraded' | 'unknown'
```

### Non-Singleton Instance

```typescript
import { createRPCQualityTracker } from '@shelchin/rpc-manager';

// Create independent instance
const tracker = createRPCQualityTracker({
	storageKey: 'custom_storage_key'
});
```

## API Reference

### RPCManager

#### Constructor

```typescript
new RPCManager(endpoints: RPCEndpoint[], config?: RPCManagerConfig)
```

#### Methods

| Method                          | Returns            | Description                                |
| ------------------------------- | ------------------ | ------------------------------------------ |
| `getCurrentRPC()`               | `string`           | Get current RPC URL                        |
| `getCurrentRPCName()`           | `string`           | Get current RPC name                       |
| `markSuccess()`                 | `void`             | Mark current RPC as successful             |
| `markFailed()`                  | `boolean`          | Mark failed, returns true if rotated       |
| `markRateLimited()`             | `boolean`          | Mark rate limited, returns true if rotated |
| `isAllExhausted()`              | `boolean`          | Check if all RPCs exhausted                |
| `getWaitTimeUntilAvailable()`   | `number`           | Get ms until RPC available                 |
| `waitForAvailableRPC(maxWait?)` | `Promise<boolean>` | Wait for available RPC                     |
| `getStatusReport()`             | `string`           | Get formatted status report                |
| `getHealthyCount()`             | `number`           | Get healthy RPC count                      |
| `getTotalCount()`               | `number`           | Get total RPC count                        |
| `hasHealthyRPC()`               | `boolean`          | Check if healthy RPC exists                |
| `resetAllRPCs()`                | `void`             | Reset all RPCs to healthy                  |

### RPCQualityTracker

#### Constructor

```typescript
new RPCQualityTracker(config?: RPCQualityTrackerConfig)
```

#### Methods

| Method                            | Returns               | Description               |
| --------------------------------- | --------------------- | ------------------------- |
| `recordSuccess(url, chainId, ms)` | `void`                | Record successful request |
| `recordFailure(url, chainId)`     | `void`                | Record failed request     |
| `recordRateLimit(url, chainId)`   | `void`                | Record rate limit         |
| `getMetrics(url, chainId)`        | `RPCQualityMetrics?`  | Get metrics for RPC       |
| `getSuccessRate(url, chainId)`    | `number`              | Get success rate (0-1)    |
| `getQualityScore(url, chainId)`   | `number`              | Get quality score (0-100) |
| `getBestRPC(chainId)`             | `{url, score}?`       | Get best RPC for chain    |
| `getRankedRPCs(chainId)`          | `Array`               | Get ranked RPCs           |
| `getRecommendations(chainId)`     | `RPCRecommendation[]` | Get recommendations       |
| `getHealthSummary(chainId)`       | `RPCHealthSummary`    | Get health summary        |
| `flush()`                         | `void`                | Save pending updates      |
| `clear()`                         | `void`                | Clear all data            |
| `clearForChain(chainId)`          | `void`                | Clear data for chain      |

## Types

```typescript
interface RPCEndpoint {
	url: string;
	name?: string;
	priority?: number; // Lower = higher priority
}

interface RPCManagerConfig {
	rateLimitCooldown?: number;
	maxFailCount?: number;
	healthRecoveryTime?: number;
}

interface RPCQualityTrackerConfig {
	storageKey?: string;
	maxAgeDays?: number;
	canPersist?: () => boolean;
}

interface RPCQualityMetrics {
	url: string;
	chainId: number;
	successCount: number;
	failCount: number;
	avgResponseTime: number;
	rateLimitCount: number;
	lastUpdated: number;
}

interface RPCRecommendation {
	type: 'info' | 'warning' | 'error' | 'success';
	priority: 'high' | 'medium' | 'low';
	message: string;
	actionable: boolean;
	rpcUrl?: string;
}

interface RPCHealthSummary {
	status: 'healthy' | 'warning' | 'degraded' | 'unknown';
	totalRPCs: number;
	healthyRPCs: number;
	averageScore: number;
	averageResponseTime: number;
	totalRequests: number;
}
```

## License

MIT
