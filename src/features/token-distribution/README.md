# Token Distribution Feature

A comprehensive token distribution application built with SvelteKit 5 and the StepBasedApp framework. This feature allows users to distribute tokens from one wallet to multiple recipient addresses in batch.

## Overview

Token Distribution is the inverse operation of Token Sweep - instead of collecting tokens from multiple wallets into one, it distributes tokens from one source wallet to multiple recipients.

## Features

### ✅ Completed Features

#### 1. **5-Step Wizard Interface**

- **Step 1: Connect Wallet** - Web3 wallet connection with network selection
- **Step 2: Configure Source** - Verify source wallet balance and readiness
- **Step 3: Select Token & Amount** - Choose token and distribution mode
- **Step 4: Import Recipients** - Add recipient addresses via manual, paste, or CSV
- **Step 5: Review & Execute** - Confirm and execute batch distribution

#### 2. **Distribution Modes**

- **Equal Distribution**: Same amount to all recipients
- **Custom Amounts**: Individual amounts per recipient

#### 3. **Token Support**

- Native tokens (ETH, BNB, MATIC, etc.)
- ERC20 tokens (USDT, USDC, WETH, etc.)
- Pre-configured tokens for multiple networks

#### 4. **Network Support**

- Ethereum Mainnet
- Polygon
- BSC (Binance Smart Chain)
- Base
- Arbitrum
- Optimism

#### 5. **Recipient Management**

- Manual address input
- Bulk paste (addresses with optional labels and amounts)
- CSV import support (planned)
- Address validation
- Edit/remove recipients

#### 6. **Distribution Execution**

- Transaction builder for native and ERC20 transfers
- Gas estimation
- Batch processing with progress tracking
- Real-time status updates

## Project Structure

```
src/features/token-distribution/
├── types/
│   ├── distribution.ts    # Distribution config and transaction types
│   └── recipient.ts        # Recipient types and import methods
├── stores/
│   ├── step3-state.svelte.ts  # Token selection state
│   └── step4-state.svelte.ts  # Recipients state
├── utils/
│   └── distribution-builder.ts # Transaction building and calculation
├── ui/
│   └── steps/
│       ├── index.ts                               # Step components export
│       ├── step1-connect-*.svelte                 # Step 1 components
│       ├── step2-configure-*.svelte               # Step 2 components
│       ├── step3-select-tokens-*.svelte           # Step 3 components
│       ├── step4-import-wallets-*.svelte          # Step 4 components
│       └── step5-confirm-distribution-*.svelte    # Step 5 components
└── README.md

src/routes/apps/token-distribution/
├── +page.svelte    # Main route component
└── +page.ts        # Page load function with SEO metadata
```

## Usage

### For Users

1. **Navigate to** `/apps/token-distribution`
2. **Connect your wallet** and select network
3. **Verify** your wallet has sufficient balance
4. **Select token** and choose distribution mode
5. **Import recipients** (manually, paste, or CSV)
6. **Review summary** and execute distribution

### For Developers

#### Adding Token Distribution to Your App

```svelte
<script lang="ts">
	import { mainnet, polygon, base } from 'viem/chains';
	import StepBasedApp from '$lib/components/step-based-app.svelte';
	import { stepComponents } from '@/features/token-distribution/ui/steps';

	const meta = {
		title: 'Token Distribution',
		description: 'Distribute tokens to multiple wallets'
		// ... other meta fields
	};
</script>

<StepBasedApp
	config={{
		meta,
		structuredData: [
			/* SEO data */
		],
		steps: [
			/* HowTo steps */
		],
		appTitle: 'Token Distribution',
		appDescription: 'Batch send tokens to multiple recipients',
		walletConnect: {
			chains: [mainnet, polygon, base],
			storageKey: 'my-app-token-distribution'
		},
		stepComponents
	}}
/>
```

#### State Management

The feature uses module-level Svelte 5 stores:

```typescript
import { step3State } from '@/features/token-distribution/stores/step3-state.svelte';
import { step4State } from '@/features/token-distribution/stores/step4-state.svelte';

// Access token selection
console.log(step3State.selectedToken);
console.log(step3State.amountMode);

// Access recipients
console.log(step4State.recipients);
console.log(step4State.totalRecipients);
```

## Technical Details

### Distribution Transaction Builder

```typescript
import { buildDistributionTransactions } from '@/features/token-distribution/utils/distribution-builder';

const config: DistributionConfig = {
	sourceWallet: '0x...',
	token: selectedToken,
	amountMode: 'equal',
	amountPerRecipient: '1.5',
	recipients: [...],
	chainId: 1,
	gasLimit: BigInt(21000)
};

const transactions = buildDistributionTransactions(config);
// Returns array of DistributionTransaction objects
```

### Supported Distribution Modes

1. **Equal Distribution**
   - User sets amount per recipient
   - Same amount sent to all recipients
   - Total calculated automatically

2. **Custom Amounts**
   - Each recipient has custom amount
   - Amounts set in Step 4 (recipient import)
   - Total calculated from sum of all amounts

### Transaction Types

- **Native Token**: Direct ETH/BNB transfer (gas ~21,000)
- **ERC20 Token**: `transfer()` function call (gas ~65,000)

## Architecture Patterns

### Module-Level State

Uses Svelte 5 module-level state pattern for cross-component sharing:

```typescript
class Step3State {
	selectedToken = $state<NativeToken | ERC20Token | null>(null);
	amountMode = $state<DistributionAmountMode>('equal');
	// ...
}

export const step3State = new Step3State();
```

### StepBasedApp Integration

Follows the StepBasedApp pattern:

- Each step has 3 components: sidebar, content, footer
- Steps share state via module-level stores
- Navigation managed by StepManager context

## Future Enhancements

### Planned Features

- [ ] CSV file upload for bulk recipient import
- [ ] Balance checking before distribution
- [ ] Token approval handling for ERC20
- [ ] Transaction batching (send multiple in one transaction)
- [ ] Distribution templates (save/load recipient lists)
- [ ] Scheduling (delayed execution)
- [ ] Gas optimization suggestions
- [ ] Multi-token distribution (distribute multiple tokens in one flow)

### Performance Improvements

- [ ] Optimistic UI updates
- [ ] Transaction queueing
- [ ] Failed transaction retry logic
- [ ] Transaction history tracking

## Testing

### Manual Testing Checklist

- [ ] Connect wallet on each supported network
- [ ] Select native token and ERC20 token
- [ ] Equal distribution mode
- [ ] Custom amounts mode
- [ ] Manual recipient add
- [ ] Bulk paste recipients
- [ ] Execute distribution (testnet)
- [ ] Gas estimation accuracy
- [ ] Progress tracking during execution

### E2E Tests (Planned)

See `E2E_TEST_GUIDE.md` (to be created)

## Dependencies

- **viem**: Ethereum library for transaction building
- **@shelchin/ethereum-connectors**: Wallet connection
- **lucide-svelte**: Icons
- **SvelteKit 5**: Framework with runes
- **TypeScript**: Type safety

## SEO & Metadata

The feature includes comprehensive SEO optimization:

- Structured data (WebApplication, HowTo)
- Meta tags (title, description, keywords)
- Open Graph tags
- Canonical URLs

## License

Part of BiuBiu Tools project.

## Contributing

Follow the project's TypeScript and Svelte 5 best practices:

- Use `$state` and `$derived` for reactivity
- Type all interfaces in `types/` directory
- Run `bun run lint` and `bun run check` before committing
- No `any` types allowed
- Use SvelteMap/SvelteSet for reactive collections

## Support

For issues or questions:

- GitHub Issues: [biubiu.tools repository](https://github.com/...)
- Documentation: See CLAUDE.md for development guidelines
