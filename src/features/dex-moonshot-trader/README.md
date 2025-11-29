# Moonshot DEX Trader

A functional trading interface for Moonshot tokens built with SvelteKit.

## Features Implemented

### 1. Smart Contract Integration

- **Moonshot Token ABI**: Complete contract interface including view and trade functions
- **Moonshot Factory ABI**: Factory contract interface for executing trades
- **Dynamic Factory Detection**: Automatically fetches factory address from token contract (no hardcoded addresses)

### 2. Token Validation

- Enter any Moonshot token address
- Automatically validates if it's a valid Moonshot token
- Fetches token information:
  - Name, symbol, decimals
  - User balance
  - Total supply
  - Market cap
  - Trading curve progress
  - Trading status

### 3. Real Trading Functions

- **Buy Exact In**: Spend exact amount of ETH to buy tokens
- **Sell Exact In**: Sell exact amount of tokens for ETH
- Real-time price quotes with:
  - Expected output amount
  - Trading fees
  - Price impact calculation
  - Slippage protection

### 4. User Experience

- Real-time balance updates
- Loading states for quotes and transactions
- Error handling with clear messages
- Transaction confirmation tracking
- Automatic balance refresh after trades

## Architecture

### Contract Services

- `services/moonshot-service.ts`: Main service for interacting with Moonshot contracts
  - Quote calculation (getBuyQuoteExactIn, getSellQuoteExactIn)
  - Trade execution (buyExactIn, sellExactIn)
  - Automatic token approval handling
  - Price impact calculation

### Type System

- `types/moonshot.ts`: Moonshot-specific types
- `types/token.ts`: General token types
- `types/trade.ts`: Trading types

### State Management

- `stores/app-state.svelte.ts`: Global app state using Svelte 5 runes
  - Network and wallet info
  - Token information (basic + Moonshot-specific)
  - Factory address
  - Trade settings (slippage, amounts)

## Usage

1. **Connect Wallet** (Step 1)
   - Select network
   - Connect wallet via WalletConnect or Injected provider

2. **Enter Token Address** (Step 2)
   - Input Moonshot token contract address
   - Click "Validate Token"
   - System automatically:
     - Checks if it's a valid Moonshot token
     - Fetches factory address from contract
     - Loads all token information
     - Displays market cap and curve progress

3. **Trade** (Step 3)
   - Switch between Buy and Sell tabs
   - Enter amount
   - View real-time quote with:
     - Expected output
     - Fees
     - Price impact
     - Minimum received (with slippage)
   - Execute trade
   - Wait for confirmation

## Technical Details

### Network RPC Structure

The implementation uses the correct network structure from the connect store:

```typescript
{
  rpcEndpoints: [
    { url: 'https://...', isPrimary: true },
    ...
  ]
}
```

### Factory Address Discovery

Instead of hardcoding factory addresses per chain, the system:

1. Reads the `factory()` function from the token contract
2. Uses that address for all trading operations
3. Validates that the factory address is not zero

### Multicall Optimization (Future Enhancement)

Currently, token validation makes multiple RPC calls. Consider implementing:

- Multicall3 aggregation
- Batch all read calls into a single request
- Faster validation with less network overhead

### Error Handling

- Network errors
- Invalid token addresses
- Non-Moonshot tokens
- Insufficient balance
- Failed transactions
- Wallet not connected

## Key Files

- `contracts/moonshot-abi.ts` - Contract ABIs
- `services/moonshot-service.ts` - Main trading service
- `ui/steps/step2-token-content.svelte` - Token validation UI
- `ui/steps/step3-trade-content.svelte` - Trading UI
- `stores/app-state.svelte.ts` - Global state

## Future Enhancements

1. **Multicall3 Integration**: Batch RPC calls for faster token validation
2. **Buy/Sell Exact Out**: Add exactOut trading modes
3. **Transaction History**: Track past trades
4. **Chart Integration**: Show price charts
5. **Gas Estimation**: Display estimated gas costs
6. **Advanced Orders**: Limit orders, stop-loss, etc.
7. **Multi-token Support**: Save and switch between tokens
8. **Price Alerts**: Notify on price targets

## Security Notes

⚠️ Always verify:

- Token contract address
- Transaction details before signing
- Slippage settings
- You have enough balance + gas

Never share your private keys or seed phrase!
