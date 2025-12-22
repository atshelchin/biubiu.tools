# Fork & Self-Host Guide

This guide is for developers who want to fork biubiu.tools and run their own instance with custom fee settings.

## Prerequisites

Before you start, make sure you have:

- Solidity development experience (Foundry or Hardhat)
- Node.js 18+ and Bun/npm
- A wallet with ETH for contract deployment
- Basic understanding of CREATE2 deterministic deployment

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        biubiu.tools                             │
│                      (Frontend - SvelteKit)                     │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Smart Contracts (Solidity)                   │
├─────────────────────────────────────────────────────────────────┤
│  BiuBiuPremium   │  TokenSweep   │  TokenDistribution  │  ...  │
│  (Membership)    │  (Batch Tx)   │  (Airdrop)          │       │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
                    FEE_RECIPIENT (hardcoded in contracts)
```

## Step 1: Clone & Modify Contracts

### 1.1 Clone the contracts repository

```bash
git clone https://github.com/atshelchin/biubiu-contracts.git
cd biubiu-contracts
```

### 1.2 Modify the fee recipient address

Search for the fee recipient address in all contracts and replace with your own:

```solidity
// Original (DO NOT USE - this is the official biubiu.tools address)
address constant FEE_RECIPIENT = 0xd9eda338cafae29b18b4a92aa5f7c646ba9cdce9;

// Replace with YOUR address
address constant FEE_RECIPIENT = 0xYourAddressHere;
```

**Files to check:**
- `src/BiuBiuPremium.sol`
- `src/TokenSweep.sol`
- `src/TokenDistribution.sol`

### 1.3 (Optional) Modify fee amounts

If you want to change the fee structure:

```solidity
// In TokenSweep.sol
uint256 constant NON_MEMBER_FEE = 0.005 ether; // Change this

// In BiuBiuPremium.sol
uint256 constant MONTHLY_PRICE = 0.01 ether;   // Change these
uint256 constant QUARTERLY_PRICE = 0.02 ether;
uint256 constant YEARLY_PRICE = 0.05 ether;
```

### 1.4 Compile contracts

```bash
# Using Foundry
forge build

# Output: out/ directory with compiled contracts
```

## Step 2: Deploy Contracts

### 2.1 Deploy using CREATE2 (Recommended)

CREATE2 deployment ensures the same contract address across all chains.

```bash
# Deploy to your target network
forge script script/Deploy.s.sol --rpc-url $RPC_URL --broadcast --verify

# Or deploy manually
forge create src/BiuBiuPremium.sol:BiuBiuPremium \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY
```

### 2.2 Record your new contract addresses

After deployment, note down all contract addresses:

```
BiuBiuPremium:     0x...
TokenSweep:        0x...
TokenDistribution: 0x...
TokenFactory:      0x...
NFTFactory:        0x...
WETH:              0x...
```

## Step 3: Update Frontend Configuration

### 3.1 Clone the frontend repository

```bash
git clone https://github.com/atshelchin/biubiu.tools.git
cd biubiu.tools
bun install
```

### 3.2 Update contract addresses

Edit `src/lib/config/deployment-configs.ts`:

```typescript
// Replace all contract addresses with your deployed addresses

const BIUBIU_PREMIUM_DEPLOYMENT_CONFIG: ContractDeploymentConfig = {
  contractName: 'BiuBiuPremium',
  contractAddress: '0xYourBiuBiuPremiumAddress' as Address,
  // ... rest of config
};

const wallet_sweep_DEPLOYMENT_CONFIG: ContractDeploymentConfig = {
  contractName: 'TokenSweep',
  contractAddress: '0xYourTokenSweepAddress' as Address,
  // ... rest of config
};

// ... update all other contracts
```

### 3.3 Update fee recipient

Edit `src/lib/utils/contract-deployment.ts`:

```typescript
export const KNOWN_ADDRESSES = {
  CREATE2_DEPLOYER: '0x3fab184622dc19b6109349b94811493bf2a45362' as Address,
  CREATE2_PROXY: '0x4e59b44847b379578588920cA78FbF26c0B4956C' as Address,
  // Update this to YOUR address
  FEE_RECIPIENT: '0xYourFeeRecipientAddress' as Address
} as const;
```

### 3.4 (Optional) Set fees to zero for free usage

If you want completely free usage, update these files:

**`src/features/wallet-sweep/utils/tokensweep-executor.ts`:**
```typescript
// Line 261 and 332
const NON_MEMBER_FEE = parseEther('0'); // Free!
```

**`src/features/wallet-sweep/types/fee.ts`:**
```typescript
export const SWEEP_FEE_PER_TRANSACTION = 0; // Free!
```

### 3.5 Update contract bytecode (if modified)

If you modified the contracts, update the bytecode:

```typescript
// In deployment-configs.ts
bytecode: '0xYourNewBytecode...' as `0x${string}`,
```

Or update the JSON files in `static/contracts/`:
- `TokenSweep.json`
- `BiuBiuPremium.json`
- `TokenDistribution.json`
- etc.

## Step 4: Build & Deploy Frontend

```bash
# Build
bun run build

# Preview locally
bun run preview

# Deploy to Cloudflare Pages (or your preferred host)
wrangler pages deploy .svelte-kit/cloudflare
```

## File Reference

| Purpose | File Path |
|---------|-----------|
| Contract addresses | `src/lib/config/deployment-configs.ts` |
| Fee recipient | `src/lib/utils/contract-deployment.ts` |
| Sweep fee logic | `src/features/wallet-sweep/utils/tokensweep-executor.ts` |
| Fee constants | `src/features/wallet-sweep/types/fee.ts` |
| Contract ABIs | `static/contracts/*.json` |
| Referral system | `src/lib/utils/referral.ts` |

## Common Issues

### Q: Contract deployment fails
**A:** Make sure you have enough ETH for gas, and the CREATE2 proxy is deployed on your target chain.

### Q: Frontend shows wrong contract address
**A:** Clear browser cache and localStorage. The app caches some blockchain data.

### Q: Transactions fail with "fee mismatch"
**A:** Make sure the frontend fee matches the contract fee. If you modified the contract, update the frontend constants.

## Security Considerations

1. **Audit your changes** - If you modify contract logic, get it audited
2. **Test on testnet first** - Always deploy to testnet before mainnet
3. **Keep private keys safe** - Never commit private keys to git
4. **Monitor your contracts** - Set up alerts for unusual activity

## Contributing Back

If you find bugs or make improvements, please consider:

1. Opening an issue on the original repo
2. Submitting a pull request
3. Sharing your deployment for community verification

Your contributions help make the ecosystem more trustworthy!

## License

Both the frontend and contracts are MIT licensed. You can use, modify, and distribute freely.

---

## Need Help?

- **GitHub Issues**: [biubiu.tools](https://github.com/atshelchin/biubiu.tools/issues)
- **Contracts Repo**: [biubiu-contracts](https://github.com/atshelchin/biubiu-contracts)
- **Twitter**: [@atshelchin](https://x.com/atshelchin)
