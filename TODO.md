# Token Sweep 待完成任务

## 1. TemporaryWalletManager i18n 支持

### 需要添加的翻译键

在 `src/i18n/locales/en.json` 和 `zh.json` 的 `tools.token_sweep` 下添加：

```json
"temporary_wallet": {
  "title": "Temporary Wallet",
  "create_description": "Create a random temporary wallet to automate batch transactions...",
  "warning_title": "Important:",
  "create_button": "Create Temporary Wallet",
  "creating": "Creating...",
  "wallet_ready": "Wallet Ready",
  "address_label": "Address",
  "balance_label": "Balance (Current Network)",
  "loading": "Loading...",
  "private_key_label": "Private Key",
  "show_private_key": "Show Private Key",
  "hide_private_key": "Hide Private Key",
  ...
}
```

完整翻译内容见：`/tmp/temporary_wallet_i18n.json` (英文) 和 `/tmp/temporary_wallet_i18n_zh.json` (中文)

### 需要修改的文件

- `src/features/token-sweep/ui/components/temporary-wallet-manager.svelte`
  - 添加 `import { useI18n } from '@shelchin/i18n/svelte'`
  - 替换所有硬编码文本为 `i18n.t('tools.token_sweep.temporary_wallet.xxx')`

## 2. 修复余额过滤逻辑

### 当前问题
`onlyWithBalance` 过滤逻辑使用 `step4State.getWalletsWithBalance()`，它只检查钱包是否有**任何**代币的余额。

### 期望行为
只跳过**所有选中代币余额都为 0** 的钱包。

### 修改方案

1. 在 `step5-confirm-sweep-content.svelte` 中创建新的过滤函数：

```typescript
// 过滤出至少有一个选中代币余额的钱包
function getWalletsWithSelectedTokenBalance() {
  return importedWallets.filter((wallet) => {
    if (!wallet.balances) return false;

    // 检查是否至少有一个选中的代币有余额
    return selectedTokenIds.some((tokenId) => {
      const isNative = tokenId.endsWith(':native');
      const balance = isNative
        ? wallet.balances?.native
        : wallet.balances?.tokens?.[tokenId];

      return balance && balance !== '0';
    });
  });
}
```

2. 更新使用处：
```typescript
const walletsToSweep = onlyWithBalance
  ? getWalletsWithSelectedTokenBalance()
  : importedWallets;
```

## 3. Step4 必须扫描余额才能进入 Step5

### 修改文件
- `src/features/token-sweep/ui/steps/step4-import-wallets-footer.svelte`

### 修改方案

```typescript
let canContinue = $derived(
  walletCount > 0 &&
  selectedTokenCount > 0 &&
  hasScanned  // 添加此条件：必须已扫描余额
);
```

添加提示信息：
- 如果 `!hasScanned`，显示 "Please scan wallet balances before continuing"
- 禁用 Continue 按钮直到扫描完成

## 已完成的工作 ✅

1. ✅ 批量 ERC20 转账脚本
2. ✅ TokenBalanceDisplay 可复用组件
3. ✅ Step4 代币余额统计改进
4. ✅ Step5 使用连接钱包作为目标地址
5. ✅ Step5 sidebar 添加代币余额统计
6. ✅ 移除 Connected wallet 模式
7. ✅ 修复 balance 存储精度问题

## 提交记录

```
189d406 feat: add ERC20 batch transfer script and improve token balance display
74b57dd refactor: simplify token sweep step5 UI and use connected wallet as target
be94148 feat: add token balance statistics to step5 sidebar
4ec3ae6 refactor: remove connected wallet mode, only support temporary wallet
```
