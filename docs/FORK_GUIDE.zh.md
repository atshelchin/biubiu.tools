# Fork 与自托管指南

本指南面向希望 fork biubiu.tools 并运行自己实例的开发者。

## 前置要求

开始之前，请确保你具备：

- Solidity 开发经验（Foundry 或 Hardhat）
- Node.js 18+ 和 Bun/npm
- 用于部署合约的 ETH
- 了解 CREATE2 确定性部署

## 架构概览

```
┌─────────────────────────────────────────────────────────────────┐
│                        biubiu.tools                             │
│                      (前端 - SvelteKit)                          │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      智能合约 (Solidity)                         │
├─────────────────────────────────────────────────────────────────┤
│  BiuBiuPremium   │  TokenSweep   │  TokenDistribution  │  ...  │
│  (会员系统)       │  (批量转账)    │  (空投分发)          │       │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
                    FEE_RECIPIENT (硬编码在合约中)
```

## 第一步：克隆并修改合约

### 1.1 克隆合约仓库

```bash
git clone https://github.com/atshelchin/biubiu-contracts.git
cd biubiu-contracts
```

### 1.2 修改收费地址

在所有合约中搜索收费地址并替换为你自己的地址：

```solidity
// 原始地址（请勿使用 - 这是官方 biubiu.tools 的地址）
address constant FEE_RECIPIENT = 0xd9eda338cafae29b18b4a92aa5f7c646ba9cdce9;

// 替换为你的地址
address constant FEE_RECIPIENT = 0x你的地址;
```

**需要检查的文件：**

- `src/BiuBiuPremium.sol`
- `src/TokenSweep.sol`
- `src/TokenDistribution.sol`

### 1.3（可选）修改费用金额

如果你想更改费用结构：

```solidity
// 在 TokenSweep.sol 中
uint256 constant NON_MEMBER_FEE = 0.005 ether; // 修改此值

// 在 BiuBiuPremium.sol 中
uint256 constant MONTHLY_PRICE = 0.01 ether;   // 修改这些
uint256 constant QUARTERLY_PRICE = 0.02 ether;
uint256 constant YEARLY_PRICE = 0.05 ether;
```

### 1.4 编译合约

```bash
# 使用 Foundry
forge build

# 输出：out/ 目录包含编译后的合约
```

## 第二步：部署合约

### 2.1 使用 CREATE2 部署（推荐）

CREATE2 部署确保在所有链上获得相同的合约地址。

```bash
# 部署到目标网络
forge script script/Deploy.s.sol --rpc-url $RPC_URL --broadcast --verify

# 或手动部署
forge create src/BiuBiuPremium.sol:BiuBiuPremium \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY
```

### 2.2 记录新的合约地址

部署后，记录所有合约地址：

```
BiuBiuPremium:     0x...
TokenSweep:        0x...
TokenDistribution: 0x...
TokenFactory:      0x...
NFTFactory:        0x...
WETH:              0x...
```

## 第三步：更新前端配置

### 3.1 克隆前端仓库

```bash
git clone https://github.com/atshelchin/biubiu.tools.git
cd biubiu.tools
bun install
```

### 3.2 更新合约地址

编辑 `src/lib/config/deployment-configs.ts`：

```typescript
// 将所有合约地址替换为你部署的地址

const BIUBIU_PREMIUM_DEPLOYMENT_CONFIG: ContractDeploymentConfig = {
	contractName: 'BiuBiuPremium',
	contractAddress: '0x你的BiuBiuPremium地址' as Address
	// ... 其他配置
};

const wallet_sweep_DEPLOYMENT_CONFIG: ContractDeploymentConfig = {
	contractName: 'TokenSweep',
	contractAddress: '0x你的TokenSweep地址' as Address
	// ... 其他配置
};

// ... 更新所有其他合约
```

### 3.3 更新收费接收地址

编辑 `src/lib/utils/contract-deployment.ts`：

```typescript
export const KNOWN_ADDRESSES = {
	CREATE2_DEPLOYER: '0x3fab184622dc19b6109349b94811493bf2a45362' as Address,
	CREATE2_PROXY: '0x4e59b44847b379578588920cA78FbF26c0B4956C' as Address,
	// 更新为你的地址
	FEE_RECIPIENT: '0x你的收费地址' as Address
} as const;
```

### 3.4（可选）设置零费用实现免费使用

如果你想完全免费，更新这些文件：

**`src/features/wallet-sweep/utils/tokensweep-executor.ts`：**

```typescript
// 第 261 行和第 332 行
const NON_MEMBER_FEE = parseEther('0'); // 免费！
```

**`src/features/wallet-sweep/types/fee.ts`：**

```typescript
export const SWEEP_FEE_PER_TRANSACTION = 0; // 免费！
```

### 3.5 更新合约字节码（如果修改了合约）

如果你修改了合约，需要更新字节码：

```typescript
// 在 deployment-configs.ts 中
bytecode: '0x你的新字节码...' as `0x${string}`,
```

或更新 `static/contracts/` 中的 JSON 文件：

- `TokenSweep.json`
- `BiuBiuPremium.json`
- `TokenDistribution.json`
- 等等

## 第四步：构建并部署前端

```bash
# 构建
bun run build

# 本地预览
bun run preview

# 部署到 Cloudflare Pages（或你喜欢的托管服务）
wrangler pages deploy .svelte-kit/cloudflare
```

## 文件参考表

| 用途           | 文件路径                                                 |
| -------------- | -------------------------------------------------------- |
| 合约地址配置   | `src/lib/config/deployment-configs.ts`                   |
| 收费地址       | `src/lib/utils/contract-deployment.ts`                   |
| Sweep 费用逻辑 | `src/features/wallet-sweep/utils/tokensweep-executor.ts` |
| 费用常量       | `src/features/wallet-sweep/types/fee.ts`                 |
| 合约 ABI       | `static/contracts/*.json`                                |
| 推荐系统       | `src/lib/utils/referral.ts`                              |

## 常见问题

### Q: 合约部署失败

**A:** 确保你有足够的 ETH 支付 gas，并且目标链上已部署 CREATE2 proxy。

### Q: 前端显示错误的合约地址

**A:** 清除浏览器缓存和 localStorage。应用会缓存一些区块链数据。

### Q: 交易失败显示 "fee mismatch"

**A:** 确保前端费用与合约费用一致。如果你修改了合约，需要同步更新前端常量。

## 安全注意事项

1. **审计你的修改** - 如果修改了合约逻辑，请进行安全审计
2. **先在测试网测试** - 在主网部署前务必在测试网验证
3. **保护好私钥** - 永远不要将私钥提交到 git
4. **监控你的合约** - 设置异常活动告警

## 回馈社区

如果你发现 bug 或做了改进，请考虑：

1. 在原仓库提交 issue
2. 提交 pull request
3. 分享你的部署供社区验证

你的贡献有助于提升整个生态的可信度！

## 许可证

前端和合约均采用 MIT 许可证。你可以自由使用、修改和分发。

---

## 需要帮助？

- **GitHub Issues**: [biubiu.tools](https://github.com/atshelchin/biubiu.tools/issues)
- **合约仓库**: [biubiu-contracts](https://github.com/atshelchin/biubiu-contracts)
- **Twitter**: [@atshelchin](https://x.com/atshelchin)
