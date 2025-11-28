# Scripts

## Batch ETH Transfer

批量转账脚本，使用 viem 将 ETH 从一个钱包发送到多个地址。

### 使用方法

```bash
bun run batch-transfer <地址文件> <每个地址的金额(ETH)> <RPC URL>
```

### 参数说明

- `<地址文件>`: 包含接收地址的文本文件，每行一个地址（如 `addresses.txt`）
- `<每个地址的金额>`: 每个地址接收的 ETH 数量（如 `0.01`）
- `<RPC URL>`: 以太坊 RPC 端点 URL（如 `https://eth.llamarpc.com`）

脚本会自动从 RPC 检测 Chain ID，私钥通过命令行交互式输入。

### 示例

```bash
# 创建地址文件
cat > addresses.txt << EOF
0x1234567890123456789012345678901234567890
0xabcdefabcdefabcdefabcdefabcdefabcdefabcd
0x0000000000000000000000000000000000000001
EOF

# 执行批量转账（以太坊主网）
bun run batch-transfer addresses.txt 0.01 https://eth.llamarpc.com

# 执行批量转账（其他网络）
bun run batch-transfer addresses.txt 0.1 https://rpc.ankr.com/polygon

# 2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6
bun run batch-transfer ./scripts/addresses.txt 0.1 http://localhost:8545

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
