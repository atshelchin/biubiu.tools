# NFT Deployer (NFT部署器)

一个基于 StepBasedApp 架构的 NFT 智能合约部署工具，支持 ERC-721、ERC-721A 和 ERC-1155 标准。

## 功能特性

### 支持的 NFT 标准

- **ERC-721**: 标准 NFT，与所有市场兼容
- **ERC-721A**: Gas 优化版本，批量铸造可节省高达 50% Gas
- **ERC-1155**: 多代币标准，支持 NFT 和同质化代币

### 核心功能

1. **基础配置**
   - 集合名称和符号
   - 详细描述
   - 基础 URI（可选）

2. **高级设置**
   - 最大供应量限制
   - 铸造价格设置
   - 每个钱包最大铸造数量
   - EIP-2981 版税标准支持
   - 访问控制（所有者铸造、公开铸造、白名单）
   - 特殊功能（可暂停、可销毁、可揭示）

3. **多链支持**
   - Ethereum 主网
   - Polygon
   - Base
   - BSC
   - Arbitrum
   - Optimism

## 架构设计

### 目录结构

```
src/features/nft-deployer/
├── contracts/          # 合约 ABI 和字节码
│   ├── abis.ts        # ERC-721/721A/1155 ABI
│   └── bytecode.ts    # 字节码生成器
├── stores/            # 状态管理
│   ├── step2-state.svelte.ts      # NFT 标准选择
│   ├── step3-state.svelte.ts      # 基础配置
│   ├── step4-state.svelte.ts      # 高级设置
│   └── deployment-state.svelte.ts # 部署状态
├── types/             # TypeScript 类型定义
│   └── nft.ts
├── ui/
│   ├── components/    # 可复用组件
│   │   └── nft-standard-card.svelte
│   └── steps/         # 5 步骤组件
│       ├── step1-*.svelte  # 连接钱包
│       ├── step2-*.svelte  # 选择标准
│       ├── step3-*.svelte  # 基础配置
│       ├── step4-*.svelte  # 高级设置
│       ├── step5-*.svelte  # 审核部署
│       └── index.ts
└── utils/             # 工具函数
    ├── nft-standards.ts    # NFT 标准配置
    ├── contract-builder.ts # 配置构建器
    ├── deployment.ts       # 部署逻辑
    └── index.ts
```

### 状态管理

每个步骤都有独立的状态管理：

- **step2State**: 管理 NFT 标准选择
- **step3State**: 管理基础信息输入和验证
- **step4State**: 管理高级功能配置
- **deploymentState**: 管理部署进度和结果

### 部署流程

1. **配置验证**: 使用 `validateNFTConfig()` 验证所有配置
2. **Gas 估算**: 使用 `estimateDeploymentGas()` 估算部署成本
3. **合约部署**: 使用 `deployNFTContract()` 执行部署
4. **结果处理**: 返回合约地址、交易哈希等信息

## 使用方法

### 基础用法

访问 `/apps/nft-deployer` 路由，按照 5 步流程操作：

1. 连接钱包并选择网络
2. 选择 NFT 标准
3. 填写基础信息
4. 配置高级功能
5. 审核并部署

### 开发者使用

```typescript
// 导入工具函数
import { buildNFTConfig, validateNFTConfig, deployNFTContract } from '@/features/nft-deployer/utils';

// 构建配置
const config = buildNFTConfig(
  deployerAddress,
  chainId,
  'erc721a',
  basicInfo,
  advancedSettings
);

// 验证配置
const validation = validateNFTConfig(config);
if (!validation.isValid) {
  console.error(validation.errors);
  return;
}

// 部署合约
const result = await deployNFTContract(
  config,
  walletClient,
  publicClient,
  (progress, message) => {
    console.log(`${progress}%: ${message}`);
  }
);
```

## 技术栈

- **框架**: SvelteKit 2.0 + Svelte 5 (Runes)
- **类型检查**: TypeScript
- **区块链**: viem
- **国际化**: @shelchin/i18n
- **样式**: CSS Variables + CSS Grid/Flexbox

## 设计原则

1. **高内聚**: 每个步骤独立管理自己的状态
2. **可复用**: NFT 标准卡片等组件可在其他场景使用
3. **类型安全**: 全面的 TypeScript 类型定义
4. **用户体验**: 实时验证、进度提示、错误处理
5. **国际化**: 完整的中英文支持
6. **SEO 优化**: 结构化数据和元标签

## 未来改进

### 待实现功能

1. **真实合约部署**
   - 集成 OpenZeppelin 合约
   - 使用 solc 编译器
   - 动态字节码生成

2. **合约验证**
   - Etherscan API 集成
   - 自动源码验证

3. **高级功能**
   - 白名单管理界面
   - 批量空投功能
   - 铸造网站生成器

4. **元数据管理**
   - IPFS 集成
   - 元数据编辑器
   - 批量上传工具

### 技术债务

- [ ] 替换占位符字节码为真实编译输出
- [ ] 实现完整的 Gas 估算逻辑
- [ ] 添加更多的错误处理
- [ ] 增加单元测试覆盖率

## 贡献指南

1. 遵循项目的 TypeScript 规范
2. 运行 `bun run lint` 和 `bun run check` 确保代码质量
3. 添加新功能时更新 i18n 翻译
4. 保持组件的可复用性和高内聚性

## 许可证

与主项目相同
