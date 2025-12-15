# Token Sweep - End-to-End Testing Guide

## 📋 Overview

This guide provides comprehensive testing scenarios for the Token Sweep feature, covering all 5 steps from wallet connection to sweep execution.

## 🎯 Testing Objectives

1. Verify complete user flow (Steps 1-5)
2. Test all feature combinations
3. Validate error handling
4. Check UI/UX responsiveness
5. Verify state management across steps

## 🔧 Prerequisites

### Development Environment

```bash
# Ensure dev server is running
bun run dev

# Open browser to http://localhost:5174/apps/token-sweep
```

### Test Wallet Setup

**Option 1: MetaMask with Test Network**

- Install MetaMask extension
- Add Sepolia testnet
- Get test ETH from faucet: https://sepoliafaucet.com/

**Option 2: Use Test Mnemonic**

```
Test Mnemonic (DO NOT use on mainnet):
test test test test test test test test test test test junk

Derives standard Ethereum addresses (m/44'/60'/0'/0/x)
```

## 📝 Test Scenarios

---

## Test Suite 1: Happy Path - Complete Flow

### Test 1.1: Basic Single Wallet Sweep

**Objective**: Complete minimal sweep flow

**Steps**:

1. **Step 1: Connect Wallet**
   - Open http://localhost:5174/apps/token-sweep
   - Click network card (e.g., "Sepolia")
   - Connect MetaMask
   - Verify: Green checkmark on network card
   - Click "Continue to Configuration"

2. **Step 2: Configure**
   - Wait for dependency check
   - If CREATE2 proxy not deployed:
     - Click "Deploy CREATE2 Proxy"
     - Follow deployment steps
   - Verify: All dependencies show ✅
   - Click "Continue to Token Selection"

3. **Step 3: Select Tokens**
   - Click "ETH" token card
   - Verify: Card highlighted with checkmark
   - Sidebar shows: "Selected Tokens: 1"
   - Click "Continue to Import Wallets"

4. **Step 4: Import Wallets**
   - Select "Mnemonic" method
   - Enter test mnemonic:
     ```
     test test test test test test test test test test test junk
     ```
   - Set range: 0 to 4 (5 wallets)
   - Click "🔍 Generate Address List"
   - Verify: 5 wallets appear in list
   - Click "🔍 Scan Balances"
   - Wait for scan completion
   - Verify: "With Balance: X" appears
   - Click "Continue to Confirm"

5. **Step 5: Confirm Sweep**
   - Enter target address (your main wallet)
   - Review summary:
     - Selected Tokens: 1 (ETH)
     - Total Wallets: 5
   - Click "📊 Estimate Cost"
   - Verify: Cost estimate appears
   - Click "Execute Sweep 🚀"
   - Confirm dialog
   - Watch progress:
     - Progress bar updates
     - Batch/wallet counters update
     - Results appear
   - Verify: Simulation message displayed

**Expected Results**:

- ✅ All steps complete without errors
- ✅ State persists between steps (can go back/forward)
- ✅ Progress tracking shows 0% → 100%
- ✅ Simulation message appears (no actual transactions)

**Pass Criteria**:

- [ ] No console errors
- [ ] All UI elements render correctly
- [ ] Navigation works (back/forward buttons)
- [ ] Progress tracking displays properly
- [ ] Simulation completes successfully

---

### Test 1.2: Multiple Wallets, Multiple Tokens

**Objective**: Test with realistic configuration

**Configuration**:

- Network: Sepolia
- Wallets: 20 (indices 0-19)
- Tokens: ETH + USDT + USDC (if available on Sepolia)
- Filter: Only wallets with balance

**Steps**:

1. Connect to Sepolia
2. Check dependencies
3. Select 3 tokens (ETH + 2 ERC20s)
4. Import 20 wallets from mnemonic (0-19)
5. Scan balances (watch progress 0-100%)
6. Enable "Only wallets with balance" checkbox
7. Enter target address
8. Estimate cost
9. Execute sweep

**Expected Results**:

- ✅ Batch shows: 1/1 (< 100 wallets)
- ✅ Only wallets with balance are processed
- ✅ Multiple transactions per wallet (up to 3)
- ✅ Cost estimate shows 3x transactions per wallet

**Pass Criteria**:

- [ ] Balance scan completes for all 20 wallets
- [ ] Filter correctly shows only wallets with balance
- [ ] Transaction count matches (wallets × tokens)
- [ ] No performance issues with 20 wallets

---

## Test Suite 2: Batch Processing

### Test 2.1: Large Batch (150+ Wallets)

**Objective**: Verify batch processing logic

**Configuration**:

- Wallets: 150 (indices 0-149)
- Tokens: 2 (ETH + USDT)
- Expected batches: 2 (100 + 50)

**Steps**:

1. Import 150 wallets (0-149)
2. Skip balance scan (test all wallets)
3. Select 2 tokens
4. Execute sweep
5. Watch batch progression

**Expected Results**:

- ✅ Batch display shows: "2 batches"
- ✅ Batch breakdown:
  - Batch 1: 100 wallets
  - Batch 2: 50 wallets
- ✅ Progress shows "Batch 1/2" → "Batch 2/2"
- ✅ Total transactions: 300 (150 × 2)

**Pass Criteria**:

- [ ] Batch split correctly (100 + 50)
- [ ] Progress updates per batch
- [ ] No memory issues with 150 wallets
- [ ] UI remains responsive

---

### Test 2.2: Maximum Batch Size (200 Wallets)

**Objective**: Test upper limits

**Configuration**:

- Wallets: 200 (0-199)
- Tokens: 3
- Expected batches: 2 (100 + 100)

**Expected Results**:

- ✅ Handles 200 wallets smoothly
- ✅ Cost estimate calculates correctly (600 transactions)
- ✅ Progress tracking works for large numbers

**Pass Criteria**:

- [ ] No performance degradation
- [ ] Memory usage acceptable
- [ ] UI remains smooth

---

## Test Suite 3: Error Handling

### Test 3.1: Invalid Inputs

**Test Cases**:

1. **Invalid Target Address**

   ```
   Input: "0x123" (too short)
   Expected: "Invalid target address" error
   ```

2. **No Tokens Selected**

   ```
   Action: Try to continue from Step 3 without selecting tokens
   Expected: Cannot continue, hint message shows
   ```

3. **No Wallets Imported**

   ```
   Action: Try to continue from Step 4 without importing wallets
   Expected: Cannot continue, hint message shows
   ```

4. **Invalid Mnemonic**

   ```
   Input: "invalid words here"
   Expected: "Invalid mnemonic phrase" error
   ```

5. **Invalid Private Key**
   ```
   Input: "0xINVALID"
   Expected: Error message, invalid keys skipped
   ```

**Pass Criteria**:

- [ ] All validation errors show appropriate messages
- [ ] No unhandled exceptions
- [ ] User can correct errors and retry
- [ ] Error messages are clear and actionable

---

### Test 3.2: Network Issues

**Test Cases**:

1. **Disconnect Wallet Mid-Flow**
   - Complete Step 1-2
   - Disconnect wallet in MetaMask
   - Try to continue
   - Expected: Error message, prompts to reconnect

2. **Switch Network Mid-Flow**
   - Start on Sepolia
   - Switch to different network in MetaMask
   - Try to continue
   - Expected: Warning about network mismatch

3. **RPC Timeout**
   - Use slow/unreliable RPC
   - Start balance scan
   - Expected: Timeout error with retry option

**Pass Criteria**:

- [ ] Network disconnection handled gracefully
- [ ] Network mismatch detected
- [ ] Clear instructions for resolution
- [ ] Can recover without page reload

---

### Test 3.3: Balance Scan Errors

**Test Cases**:

1. **No Tokens Selected Before Scan**

   ```
   Action: Import wallets, click "Scan Balances" without selecting tokens
   Expected: "Please select tokens in Step 3 first"
   ```

2. **No Wallets to Scan**

   ```
   Action: Click "Scan Balances" with 0 wallets
   Expected: "No wallets to scan"
   ```

3. **Scan with Only Zero-Balance Wallets**
   ```
   Setup: Import wallets with no funds
   Action: Scan, enable "Only with balance", try to sweep
   Expected: "No wallets with balance to sweep" error
   ```

**Pass Criteria**:

- [ ] Pre-scan validation works
- [ ] Post-scan state updates correctly
- [ ] Filter logic works with zero balances
- [ ] Clear error messages

---

## Test Suite 4: State Management

### Test 4.1: Navigation Persistence

**Objective**: Verify state persists across navigation

**Steps**:

1. Complete Step 1-3
2. Select 3 tokens
3. Go back to Step 2
4. Go forward to Step 3
5. Verify: 3 tokens still selected
6. Continue to Step 4
7. Import 10 wallets
8. Go back to Step 3
9. Deselect 1 token
10. Go forward to Step 4
11. Verify: 10 wallets still imported
12. Verify: Token count shows 2 in summary

**Expected Results**:

- ✅ Token selection persists
- ✅ Wallet imports persist
- ✅ Changes in previous steps reflect in later steps
- ✅ No data loss during navigation

**Pass Criteria**:

- [ ] State persists across all steps
- [ ] Changes propagate correctly
- [ ] No stale data displayed
- [ ] Back/forward navigation works smoothly

---

### Test 4.2: Browser Refresh

**Objective**: Test localStorage persistence

**Steps**:

1. Complete Steps 1-3, select tokens
2. Refresh browser (F5)
3. Navigate back to Step 3
4. Verify: Tokens NOT selected (session state lost - expected)

**Current Behavior**:

- State resets on refresh (module-level state)
- localStorage used for custom tokens only

**Future Enhancement**:

- Could implement full state persistence if needed

**Pass Criteria**:

- [ ] App loads correctly after refresh
- [ ] No console errors
- [ ] User can restart flow

---

## Test Suite 5: UI/UX

### Test 5.1: Responsive Design

**Test Viewports**:

1. Desktop (1920x1080)
2. Laptop (1366x768)
3. Tablet (768x1024)
4. Mobile (375x667) - if supported

**Elements to Check**:

- [ ] Token grid layout adapts
- [ ] Wallet list scrollable
- [ ] Progress bars visible
- [ ] Buttons accessible
- [ ] Text readable (no overflow)

---

### Test 5.2: Visual Feedback

**Test Cases**:

1. **Loading States**
   - [ ] Dependency check shows spinner
   - [ ] Balance scan shows progress bar
   - [ ] Sweep execution shows "Sweeping..." state
   - [ ] Buttons disabled during operations

2. **Success States**
   - [ ] Green checkmarks for completed steps
   - [ ] Success messages clear
   - [ ] Progress completes to 100%

3. **Error States**
   - [ ] Red error banners visible
   - [ ] Error icons displayed
   - [ ] Error messages readable

4. **Interactive States**
   - [ ] Hover effects on cards/buttons
   - [ ] Selected state clearly visible
   - [ ] Disabled state distinguishable

---

### Test 5.3: Accessibility (a11y)

**Basic Checks**:

1. **Keyboard Navigation**
   - [ ] Can tab through all interactive elements
   - [ ] Enter/Space activate buttons
   - [ ] Focus indicators visible

2. **Screen Reader** (if available)
   - [ ] Form labels present
   - [ ] Button purposes clear
   - [ ] Status messages announced

3. **Color Contrast**
   - [ ] Text readable on backgrounds
   - [ ] Error messages stand out
   - [ ] Success messages visible

---

## Test Suite 6: Performance

### Test 6.1: Balance Scanning Performance

**Test Configurations**:

| Wallets | Tokens | Expected Time | Acceptable? |
| ------- | ------ | ------------- | ----------- |
| 1       | 1      | < 1s          | ✅          |
| 10      | 3      | 3-5s          | ✅          |
| 50      | 3      | 15-25s        | ✅          |
| 100     | 5      | 30-60s        | ✅          |

**Metrics to Track**:

- [ ] RPC call count
- [ ] Time to completion
- [ ] UI responsiveness during scan
- [ ] Memory usage

---

### Test 6.2: Sweep Execution Performance

**Simulation Times**:

| Wallets | Tokens | Expected Time |
| ------- | ------ | ------------- |
| 1       | 1      | < 1s          |
| 10      | 3      | 2-3s          |
| 100     | 3      | 10-15s        |

**Note**: Actual execution would be much slower due to blockchain confirmation times.

---

## Test Suite 7: Edge Cases

### Test 7.1: Boundary Values

1. **Minimum Configuration**
   - 1 wallet, 1 token
   - Expected: Works correctly

2. **Maximum Configuration**
   - 200 wallets, 5 tokens
   - Expected: 1000 transactions calculated

3. **Empty States**
   - 0 tokens selected (blocked)
   - 0 wallets imported (blocked)
   - 0 balance found (warning)

---

### Test 7.2: Special Characters

**Target Address**:

- Lowercase: `0xabcdef...`
- Uppercase: `0xABCDEF...`
- Mixed: `0xAbCdEf...`
- All valid formats accepted

**Mnemonic**:

- Extra spaces: `test test test ...` (trimmed)
- Line breaks: handled correctly
- Special chars: rejected with error

---

### Test 7.3: Concurrent Operations

**Test Case**: Try to start balance scan while one is in progress

**Expected**: Button disabled, cannot start duplicate scan

**Test Case**: Try to execute sweep while estimating

**Expected**: Button disabled during estimate

---

## 🐛 Known Issues / Limitations

### Current Limitations

1. **Simulation Only**
   - Transactions not actually executed
   - Private key access not implemented
   - Shows simulation message instead

2. **Balance Scan RPC Dependent**
   - Speed depends on RPC endpoint
   - May timeout on slow networks
   - No retry mechanism for failed calls

3. **No Transaction History**
   - Results not persisted
   - Lost on page refresh
   - No export functionality

4. **Single Network at a Time**
   - Cannot sweep across multiple networks
   - Must complete one network, then switch

---

## ✅ Test Completion Checklist

### Essential Tests (Must Pass)

- [ ] Test 1.1: Basic single wallet sweep
- [ ] Test 1.2: Multiple wallets and tokens
- [ ] Test 2.1: Batch processing (150 wallets)
- [ ] Test 3.1: All invalid input cases
- [ ] Test 4.1: Navigation persistence
- [ ] Test 5.2: Visual feedback states

### Recommended Tests

- [ ] Test 2.2: Maximum batch (200 wallets)
- [ ] Test 3.2: Network issues
- [ ] Test 3.3: Balance scan errors
- [ ] Test 5.1: Responsive design
- [ ] Test 6.1: Balance scan performance

### Optional Tests

- [ ] Test 5.3: Accessibility
- [ ] Test 6.2: Execution performance
- [ ] Test 7.1-7.3: Edge cases

---

## 📊 Test Report Template

```markdown
# Test Report: Token Sweep Feature

**Date**: YYYY-MM-DD
**Tester**: [Name]
**Environment**: Development / Staging / Production
**Browser**: Chrome / Firefox / Safari [Version]
**Network**: Sepolia / Mainnet

## Test Results

| Test Suite | Test Case | Status  | Notes |
| ---------- | --------- | ------- | ----- |
| Suite 1    | Test 1.1  | ✅ Pass |       |
| Suite 1    | Test 1.2  | ⚠️ Warn | Slow  |
| Suite 2    | Test 2.1  | ❌ Fail | Error |

## Issues Found

1. **Issue #1**: [Description]
   - Severity: Critical / High / Medium / Low
   - Steps to Reproduce: [...]
   - Expected: [...]
   - Actual: [...]

2. **Issue #2**: [...]

## Performance Metrics

- Balance Scan (10 wallets, 3 tokens): 4.2s
- Sweep Execution (10 wallets, 3 tokens): 2.8s
- Memory Usage Peak: 120MB

## Recommendations

- [...]

## Sign-off

- [ ] All critical tests passed
- [ ] No blocking issues
- [ ] Ready for [next phase]
```

---

## 🚀 Testing Tips

1. **Use Browser DevTools**
   - Console: Check for errors
   - Network: Monitor RPC calls
   - Performance: Track memory/CPU

2. **Test in Incognito Mode**
   - Ensures clean state
   - No extension interference
   - Fresh localStorage

3. **Use Test Networks Only**
   - Never test on mainnet
   - Use Sepolia/Goerli for ETH
   - Get free test tokens from faucets

4. **Document Everything**
   - Screenshot errors
   - Copy console logs
   - Record timings
   - Note configuration

---

## 📞 Support

If you encounter issues during testing:

1. Check browser console for errors
2. Verify network connection
3. Confirm wallet is connected
4. Try refreshing the page
5. Clear browser cache if needed

For development issues:

```bash
# Check linting
bun run lint

# Check types
bun run check

# Restart dev server
bun run dev
```

---

**Ready to start testing!** 🧪

Use this guide to systematically verify all functionality before deployment.
