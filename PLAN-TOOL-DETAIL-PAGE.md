# Chain Tools 工具详情页实现计划

## 项目目标

为每个 Web3 工具创建高质量的独立介绍页面，目标：

1. **SEO 优化**：增加 2200+ 可收录页面，获取长尾搜索流量
2. **用户价值**：让用户在跳转前充分了解工具，建立信任
3. **内容质量**：通过 Web Search 获取真实、详细的工具信息

## URL 结构

```
/apps/chain-tools/tool/[toolId]
例如：/apps/chain-tools/tool/uniswap
```

## 渐进式实现策略

### 第一批：50 个热门工具（手动创建高质量内容）

选取标准：

- `isFeatured: true` 的工具（约 30-40 个）
- 各分类代表性工具补充至 50 个

### 内容追踪机制

创建 `src/features/chain-tools/data/tool-details/` 目录：

- 每个已创建详情的工具有独立文件
- `index.ts` 导出已完成工具的 ID 列表
- 未完成的工具点击卡片仍直接跳转外链

---

## 数据结构设计

### 新增类型定义 (`types.ts`)

```typescript
/**
 * 工具详情页扩展数据
 */
export interface ToolDetail {
	id: string; // 对应 ExternalTool.id

	// 核心内容
	overview: string; // 工具概述（2-3 段）
	features: string[]; // 主要功能列表（5-8 项）

	// 使用场景
	useCases: string[]; // 典型使用场景（3-5 项）

	// 补充信息
	founded?: string; // 成立时间
	team?: string; // 团队信息
	funding?: string; // 融资情况

	// 社交链接
	socialLinks?: {
		twitter?: string;
		discord?: string;
		telegram?: string;
		github?: string;
		docs?: string;
	};

	// FAQ
	faqs: Array<{
		question: string;
		answer: string;
	}>;

	// 相关工具推荐
	relatedTools: string[]; // 工具 ID 列表

	// 元数据
	lastUpdated: string; // 最后更新日期
}
```

---

## 页面结构设计

### 视觉布局

```
┌─────────────────────────────────────────────────────────────┐
│  [面包屑导航]  Chain Tools > DeFi > Uniswap                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  HERO SECTION                                        │   │
│  │                                                       │   │
│  │  [Icon]  Uniswap                   [访问官网 →]      │   │
│  │          ─────────────                                │   │
│  │          Leading decentralized exchange...           │   │
│  │                                                       │   │
│  │  [Ethereum] [Polygon] [Arbitrum] ...                 │   │
│  │                                                       │   │
│  │  [DeFi Badge]  [swap] [dex] [amm] [liquidity]       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  OVERVIEW SECTION                                    │   │
│  │                                                       │   │
│  │  📖 About Uniswap                                    │   │
│  │  ─────────────────                                    │   │
│  │  Uniswap is the largest decentralized exchange...   │   │
│  │  (2-3 paragraphs of detailed introduction)          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  KEY FEATURES                                        │   │
│  │                                                       │   │
│  │  ✓ Automated Market Maker (AMM)                     │   │
│  │  ✓ Permissionless token swaps                       │   │
│  │  ✓ Liquidity provision with LP rewards             │   │
│  │  ✓ Multi-chain support                              │   │
│  │  ✓ ...                                               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  USE CASES                                           │   │
│  │                                                       │   │
│  │  • Token swapping with minimal slippage             │   │
│  │  • Providing liquidity to earn trading fees         │   │
│  │  • ...                                               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  PROJECT INFO                                        │   │
│  │                                                       │   │
│  │  Founded: 2018  |  Team: Uniswap Labs              │   │
│  │  Funding: $176M Series B                            │   │
│  │                                                       │   │
│  │  [Twitter] [Discord] [GitHub] [Docs]                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  RELATED TOOLS                                       │   │
│  │                                                       │   │
│  │  [SushiSwap] [1inch] [Curve] [PancakeSwap]         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  FREQUENTLY ASKED QUESTIONS                          │   │
│  │                                                       │   │
│  │  ▼ What is Uniswap?                                 │   │
│  │  ▼ How to use Uniswap?                              │   │
│  │  ▼ What are Uniswap fees?                           │   │
│  │  ▼ Is Uniswap safe?                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  CTA SECTION                                         │   │
│  │                                                       │   │
│  │     Ready to try Uniswap?                           │   │
│  │     [       Visit Uniswap →       ]                 │   │
│  │                                                       │   │
│  │     Last updated: 2024-01-15                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 文件结构

```
src/
├── routes/apps/chain-tools/
│   ├── tool/
│   │   └── [toolId]/
│   │       ├── +page.svelte          # 详情页组件
│   │       └── +page.server.ts       # SEO + 数据加载
│   └── ...existing files
│
├── features/chain-tools/
│   ├── components/
│   │   ├── tool-detail-hero.svelte       # Hero 区域
│   │   ├── tool-detail-overview.svelte   # 概述区域
│   │   ├── tool-detail-features.svelte   # 功能列表
│   │   ├── tool-detail-use-cases.svelte  # 使用场景
│   │   ├── tool-detail-info.svelte       # 项目信息
│   │   ├── tool-detail-related.svelte    # 相关工具
│   │   └── tool-detail-cta.svelte        # CTA 区域
│   │
│   ├── data/
│   │   └── tool-details/
│   │       ├── index.ts              # 导出所有详情 + 完成状态
│   │       ├── uniswap.ts            # Uniswap 详情
│   │       ├── aave.ts               # Aave 详情
│   │       └── ...                   # 其他工具
│   │
│   └── types.ts                      # 新增 ToolDetail 类型
│
└── i18n/locales/
    └── [locale]/routes/
        └── chain-tools-detail.json   # 详情页翻译
```

---

## SEO 策略

### Meta Tags

```typescript
// +page.server.ts
const title = `${tool.name} - ${categoryName} Tool Review & Guide | BiuBiu Tools`;
const description = `Learn about ${tool.name}: ${detail.overview.slice(0, 150)}... Discover features, use cases, and how to get started.`;
const keywords = [
	tool.name,
	`${tool.name} review`,
	`${tool.name} guide`,
	`${tool.name} tutorial`,
	`what is ${tool.name}`,
	`how to use ${tool.name}`,
	...tool.tags,
	categoryName
].join(', ');
```

### 结构化数据

1. **SoftwareApplication** - 工具基本信息
2. **FAQPage** - FAQ 内容
3. **BreadcrumbList** - 面包屑导航
4. **WebPage** - 页面信息

---

## 实现步骤

### Phase 1: 基础架构（本次实现）

1. [ ] 创建 `ToolDetail` 类型定义
2. [ ] 创建路由 `/apps/chain-tools/tool/[toolId]`
3. [ ] 创建详情页组件（+page.svelte, +page.server.ts）
4. [ ] 创建子组件（hero, overview, features 等）
5. [ ] 创建 `tool-details/` 数据目录和索引
6. [ ] 修改 `external-tool-card.svelte` 支持跳转详情页
7. [ ] 创建翻译文件 `chain-tools-detail.json`
8. [ ] 更新 sitemap 生成脚本

### Phase 2: 内容创建（后续迭代）

1. [ ] 使用 Web Search 获取工具信息
2. [ ] 创建第一批 50 个工具的详情内容
3. [ ] 翻译到其他语言

---

## 卡片点击行为变更

### 修改前

```svelte
<a href={tool.url} target="_blank" rel="noopener noreferrer">
```

### 修改后

```svelte
{#if hasDetailPage(tool.id)}
  <a href={`/apps/chain-tools/tool/${tool.id}`}>
{:else}
  <a href={tool.url} target="_blank" rel="noopener noreferrer">
{/if}
```

---

## 第一批 50 个工具候选

### DeFi (15)

- uniswap, aave, curve, lido, compound, makerdao, 1inch, sushiswap, balancer, yearn, convex, gmx, dydx, pancakeswap, synthetix

### NFT (8)

- opensea, blur, magic-eden, rarible, foundation, zora, manifold, nftx

### Analytics (5)

- dune, defillama, nansen, arkham, glassnode

### Security (5)

- certik, slowmist, immunefi, chainalysis, forta

### Bridge (4)

- stargate, layerzero, wormhole, across

### Wallet (5)

- metamask, rainbow, rabby, ledger, trezor

### Explorer (4)

- etherscan, blockscout, dexscreener, dextools

### Dev (4)

- hardhat, foundry, remix, tenderly

---

## 内容质量标准

每个工具详情页必须包含：

1. **概述**：2-3 段详细介绍，不少于 200 字
2. **功能列表**：5-8 个核心功能
3. **使用场景**：3-5 个实际应用场景
4. **FAQ**：4-6 个常见问题
5. **相关工具**：4-6 个同类工具推荐
6. **社交链接**：官网、Twitter、Discord 等

---

## 成功指标

1. Google 在 30 天内收录新页面
2. 详情页平均停留时间 > 60 秒
3. 从详情页到官网的点击率 > 30%
4. 搜索引擎长尾词排名提升
