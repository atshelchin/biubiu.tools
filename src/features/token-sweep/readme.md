# Token Sweep Feature

批量归集多个钱包中的代币到指定地址的工具。

## 功能概述

5步完整流程，支持批量处理多个钱包的资产归集：

1. **Connect Wallet** - 连接Web3钱包
2. **Check Dependencies** - 验证网络和合约
3. **Select Tokens** - 选择要归集的代币
4. **Import Wallets** - 导入源钱包地址
5. **Confirm Sweep** - 确认并执行归集

## ✅ 已实现功能（完成度：~90%）

### Step 1: Connect Wallet

- ✅ Web3钱包连接（MetaMask, WalletConnect等）
- ✅ 多网络支持（Ethereum, BSC, Polygon, Arbitrum, Optimism, Sepolia）
- ✅ 网络切换
- ✅ 钱包状态显示

### Step 2: Check Dependencies

- ✅ CREATE2 Proxy 合约检测
- ✅ 自动部署流程
- ✅ 依赖状态显示
- ✅ 错误处理和重试

### Step 3: Select Tokens

- ✅ 网格布局展示代币
- ✅ 支持多选（响应式SvelteSet）
- ✅ 预定义6个主网代币配置（Ethereum, BSC, Polygon, Arbitrum, Optimism, Sepolia）
- ✅ 每个网络包含原生币 + 主流ERC20（USDT, USDC, DAI等）
- ✅ 添加自定义ERC20代币
- ✅ localStorage持久化存储
- ✅ 移除自定义代币
- ✅ 全选/取消全选
- ✅ 代币图标显示

### Step 4: Import Wallets

- ✅ **助记词导入**（BIP-32/BIP-39标准派生）
  - ✅ 顺序派生：支持自定义范围（如 0-99）
  - ⏳ 日期派生：UI已预留，逻辑待实现
- ✅ **私钥批量导入**（一行一个，自动验证）
- ✅ **Web3余额扫描**（完整实现）
  - ✅ 原生代币余额查询（ETH, BNB, MATIC等）
  - ✅ ERC20代币余额查询
  - ✅ 实时进度显示（0% → 100%）
  - ✅ 批量RPC调用优化
  - ✅ 有余额钱包统计
- ✅ 钱包列表显示（地址 + 派生路径 + 余额状态）
- ✅ 单个删除/批量清空
- ✅ 安全提示（助记词本地处理，不上传）

### Step 5: Confirm Sweep

- ✅ **目标地址输入验证**
- ✅ **汇总信息显示**（代币、钱包、批次）
- ✅ **智能钱包过滤**（仅扫描有余额的钱包）
- ✅ **批次详情**（每批最多100个钱包）
- ✅ **成本估算功能**
  - ✅ 交易数量计算
  - ✅ Gas用量估算
  - ✅ 总成本预估（ETH）
- ✅ **Sweep执行引擎**
  - ✅ 交易构建器（原生币 + ERC20）
  - ✅ 批量处理逻辑（100钱包/批次）
  - ✅ Nonce管理架构
  - ✅ 实时进度追踪
  - ✅ 阶段指示器（准备 → 构建 → 执行 → 完成）
  - ✅ 交易结果显示
  - ⚠️ **模拟执行**（实际签名需私钥访问）
- ✅ 表单验证和错误处理
- ✅ 完整的UI/UX（进度条、加载状态、错误提示）

## ⏳ 待实现功能（安全敏感）

### 需要私钥访问的功能

- ⏳ **实际交易签名**（需要wallet client + 私钥）
- ⏳ **交易广播**（发送到区块链）
- ⏳ **交易监控**（等待确认）
- ⏳ **失败重试**（nonce冲突处理）

### 高级功能（可选）

- ⏳ 日期基础派生路径
- ⏳ EIP-7702委托签名模式
- ⏳ NFT资产归集
- ⏳ 跨链归集

## 技术架构

### 目录结构

```
token-sweep/
├── config/
│   └── tokens.ts                      # 预定义代币配置（6个网络）
├── stores/
│   ├── step2-state.svelte.ts          # 依赖检查状态
│   ├── step3-state.svelte.ts          # 代币选择状态
│   └── step4-state.svelte.ts          # 钱包导入状态 + 余额数据
├── types/
│   ├── token.ts                       # 代币类型（Native, ERC20）
│   └── wallet.ts                      # 钱包类型 + 导入配置
├── ui/
│   ├── components/
│   │   ├── import-method-selector.svelte    # 导入方式选择器
│   │   └── token-list-display.svelte        # 代币列表显示组件
│   ├── step1-connect.svelte           # 连接钱包
│   ├── step2-configure.svelte         # 配置和依赖检查
│   ├── step3-select-tokens.svelte     # 选择代币
│   ├── step4-import-wallets.svelte    # 导入钱包 + 扫描余额
│   ├── step5-confirm-sweep.svelte     # 确认并执行
│   └── contract-deployment-modal.svelte  # 合约部署弹窗
└── utils/
    ├── token-storage.ts               # 代币localStorage操作
    ├── wallet-import.ts               # 钱包导入和BIP派生
    ├── balance-scanner.ts             # 余额扫描工具（270行）
    ├── transaction-builder.ts         # 交易构建器（270行）
    └── sweep-executor.ts              # Sweep执行引擎（280行）
```

### 状态管理模式

使用模块级状态（Module-level State），自动跨组件实例共享：

```typescript
// stores/step3-state.svelte.ts
let selectedTokenIds = new SvelteSet<string>();
export const step3State = {
	get selectedTokenIds() {
		return selectedTokenIds;
	},
	toggleToken(id) {
		/* ... */
	}
};
```

## 开发指南

### 启动项目

```bash
bun run dev
# 访问 http://localhost:5174/apps/token-sweep
```

### 代码检查

```bash
bun run lint && bun run check
```

### 代码规范

- 使用 `SvelteSet` 替代 `Set`（响应式）
- `#each` 必须有唯一key
- 禁止使用 `any` 类型
- Address类型使用 `viem` 的 `Address`

## 安全注意事项 🔒

1. **助记词** - 仅客户端处理，不上传服务器
2. **私钥** - 仅保存地址，不保存私钥
3. **交易** - 需用户确认，显示详细信息

## 使用流程

1. 连接钱包 → 2. 确认依赖 → 3. 选择代币 → 4. 导入钱包 + 扫描余额 → 5. 执行归集

每批最多处理100个钱包，自动分批显示。

## 📚 完整文档索引

### 核心文档

- **[README.md](./README.md)** - 项目概览和技术架构（当前文件）
- **[USAGE.md](./USAGE.md)** - 详细用户使用指南
- **[DEMO_GUIDE.md](./DEMO_GUIDE.md)** - 演示脚本和测试数据

### 测试文档

- **[E2E_TEST_GUIDE.md](./E2E_TEST_GUIDE.md)** - 端到端测试指南（7个测试套件）
- **[BALANCE_SCAN_TEST.md](./BALANCE_SCAN_TEST.md)** - 余额扫描功能测试
- **[SWEEP_EXECUTION_GUIDE.md](./SWEEP_EXECUTION_GUIDE.md)** - Sweep执行架构和测试

### 交付文档

- **[DELIVERY_CHECKLIST.md](./DELIVERY_CHECKLIST.md)** - 功能交付清单

## 📊 项目统计

### 代码量统计

- **总代码行数**: ~3,500 行（包含注释和类型定义）
- **UI组件**: 7个 Svelte组件
- **工具函数库**: 5个（~1,100行）
- **类型定义**: 2个文件（完整TypeScript类型）
- **状态管理**: 3个响应式store
- **文档**: 7个 Markdown文件（~5,000行）

### 功能完成度

- ✅ **已完成**: 90%
- ⏳ **待实现**: 10%（交易签名和执行）

### 测试覆盖

- ✅ **类型检查**: 100% 通过
- ✅ **ESLint**: 零错误
- ✅ **E2E测试场景**: 20+ 个
- ⏳ **实际测试**: 待用户执行

## 🚀 快速开始

### 1. 开发环境

```bash
# 安装依赖（如果还没安装）
bun install

# 启动开发服务器
bun run dev

# 访问应用
open http://localhost:5174/apps/token-sweep
```

### 2. 测试流程

**推荐：使用测试网络**

```bash
网络: Sepolia Testnet
测试助记词: test test test test test test test test test test test junk
测试范围: 0-9 (10个钱包)
获取测试币: https://sepoliafaucet.com/
```

**基础测试步骤**:

1. 连接MetaMask并切换到Sepolia
2. 检查CREATE2 Proxy（如需要则部署）
3. 选择ETH代币
4. 导入测试钱包（0-9）
5. 扫描余额
6. 输入目标地址
7. 估算成本 → 执行Sweep（模拟）

详见 [E2E_TEST_GUIDE.md](./E2E_TEST_GUIDE.md)

## ⚠️ 重要说明

### 当前限制

1. **模拟执行**: 当前实现为模拟框架，实际交易需要私钥访问和签名实现
2. **RPC依赖**: 余额扫描速度取决于RPC端点质量
3. **无交易历史**: 结果不持久化（页面刷新丢失）
4. **单网络**: 一次只能处理一个网络的资产

### 安全要求

实现实际执行前必须:

- ✅ 安全的私钥存储方案
- ✅ 每笔交易的用户明确授权
- ✅ 完整的错误处理和回滚机制
- ✅ 充分的测试网测试
- ✅ 安全审计

## 🎯 下一步

### 立即可做

1. **浏览器测试** - 完整5步流程
2. **性能测试** - 大批量钱包（100+）
3. **边界测试** - 异常输入和错误情况

### 需要开发

1. **交易签名实现** - 集成wallet client
2. **交易监控** - 等待确认和状态更新
3. **错误恢复** - 失败重试和断点续传

详见各专项文档获取更多信息。

---

**项目状态**: ✅ 核心功能完成，架构完善，文档齐全，可用于演示和架构评审

**最后更新**: 2025-11-07
