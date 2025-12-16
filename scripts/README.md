# Scripts

## Batch ETH Transfer

批量转账脚本，使用 viem 将 ETH 从一个钱包发送到多个地址。

### 使用方法

```bash
bun run batch-transfer <地址文件> <每个地址的金额(ETH)> <RPC URL>
```

### 参数说明

- `<地址文件>`: 包含接收地址的文本文件，每行一个地址（如 `./scripts/addresses.txt`）
- `<每个地址的金额>`: 每个地址接收的 ETH 数量（如 `0.01`）
- `<RPC URL>`: 以太坊 RPC 端点 URL（如 `https://eth.llamarpc.com`）

脚本会自动从 RPC 检测 Chain ID，私钥通过命令行交互式输入。

### 示例

```bash
# 创建地址文件
cat > ./scripts/addresses.txt << EOF
0x1234567890123456789012345678901234567890
0xabcdefabcdefabcdefabcdefabcdefabcdefabcd
0x0000000000000000000000000000000000000001
EOF

# 执行批量转账（以太坊主网）
bun run batch-transfer ./scripts/addresses.txt 0.01 https://eth.llamarpc.com

# 执行批量转账（其他网络）
bun run batch-transfer ./scripts/addresses.txt 0.1 https://rpc.ankr.com/polygon
```

### 功能特性

- ✅ 自动从 RPC 检测 Chain ID
- ✅ 私钥安全输入（不在命令行参数中暴露）
- ✅ 交互式确认发送前显示详情
- ✅ 详细的交易结果报告
- ✅ 错误处理和失败地址追踪

### 注意事项

1. 确保钱包有足够的 ETH 支付转账金额和 gas 费用
2. 地址文件中的地址必须以 `0x` 开头
3. 私钥支持带或不带 `0x` 前缀
4. 脚本会逐个发送交易，请耐心等待
5. 失败的交易会在最后的汇总中列出

---

## Batch ERC20 Token Transfer

批量 ERC20 代币转账脚本，使用 viem 将 ERC20 代币从一个钱包发送到多个地址。

### 使用方法

```bash
bun run batch-transfer-erc20 <地址文件> <每个地址的金额> <代币合约地址> <RPC URL>
```

### 参数说明

- `<地址文件>`: 包含接收地址的文本文件，每行一个地址（如 `./scripts/addresses.txt`）
- `<每个地址的金额>`: 每个地址接收的代币数量（按代币的实际单位，如 `100` 表示 100 USDC）
- `<代币合约地址>`: ERC20 代币合约地址（如 USDC: `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`）
- `<RPC URL>`: 以太坊 RPC 端点 URL（如 `https://eth.llamarpc.com`）

脚本会自动：

- 从 RPC 检测 Chain ID
- 从代币合约获取 decimals 和 symbol
- 检查发送地址的代币余额
- 私钥通过命令行交互式输入

### 示例

```bash
# 批量发送 USDC（以太坊主网）
bun run batch-transfer-erc20 ./scripts/addresses.txt 100 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 https://eth.llamarpc.com

# 批量发送 USDT（以太坊主网）
bun run batch-transfer-erc20 ./scripts/addresses.txt 50 0xdAC17F958D2ee523a2206206994597C13D831ec7 https://eth.llamarpc.com

# 批量发送代币（Polygon）
bun run batch-transfer-erc20 ./scripts/addresses.txt 10 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174 https://rpc.ankr.com/polygon
```

### 常用代币合约地址

**以太坊主网：**

- USDC: `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`
- USDT: `0xdAC17F958D2ee523a2206206994597C13D831ec7`
- DAI: `0x6B175474E89094C44Da98b954EedeAC495271d0F`

**Polygon:**

- USDC: `0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174`
- USDT: `0xc2132D05D31c914a87C6611C10748AEb04B58e8F`

### 功能特性

- ✅ 自动从 RPC 检测 Chain ID
- ✅ 自动获取代币 decimals 和 symbol
- ✅ 自动检查代币余额是否足够
- ✅ 私钥安全输入（不在命令行参数中暴露）
- ✅ 交互式确认发送前显示详情
- ✅ 详细的交易结果报告
- ✅ 错误处理和失败地址追踪

### 注意事项

1. 确保钱包有足够的代币余额
2. 确保钱包有足够的原生代币（ETH/MATIC 等）支付 gas 费用
3. 代币金额按代币的实际单位输入（脚本会自动处理 decimals）
4. 地址文件中的地址必须以 `0x` 开头
5. 私钥支持带或不带 `0x` 前缀
6. 脚本会逐个发送交易，请耐心等待
7. 失败的交易会在最后的汇总中列出
