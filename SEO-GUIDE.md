# SEO 最佳实践指南 | BiuBiu Tools

本指南总结了项目中实现的所有 SEO 优化技术和 Google 推荐的最佳实践。

## 📋 目录

1. [已实现的 SEO 功能](#已实现的-seo-功能)
2. [Google Rich Snippets（丰富片段）](#google-rich-snippets)
3. [如何测试 SEO](#如何测试-seo)
4. [其他值得实践的 SEO 技术](#其他值得实践的-seo-技术)
5. [为新页面添加 SEO](#为新页面添加-seo)

---

## 已实现的 SEO 功能

### ✅ 1. Sitemap.xml（自动生成）

**文件**: `/src/routes/sitemap.xml/+server.ts`

**功能**:

- 自动扫描所有 `+page.svelte` 文件
- 支持多语言 (en, zh, ja, fr)
- 添加 hreflang 标签（Google 国际化最佳实践）
- 预渲染（构建时生成，性能优化）

**访问**: https://biubiu.tools/sitemap.xml

**示例输出**:

```xml
<url>
  <loc>https://biubiu.tools/apps/token-sweep</loc>
  <lastmod>2025-11-06</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
  <xhtml:link rel="alternate" hreflang="x-default" href="..."/>
  <xhtml:link rel="alternate" hreflang="en" href="..."/>
  <xhtml:link rel="alternate" hreflang="zh-CN" href="..."/>
</url>
```

---

### ✅ 2. Robots.txt

**文件**: `/src/routes/robots.txt/+server.ts`

**功能**:

- 允许所有搜索引擎爬虫
- 引用 sitemap.xml
- 缓存优化

**访问**: https://biubiu.tools/robots.txt

---

### ✅ 3. 语言切换 URL 更新

**文件**: `/src/lib/components/widgets/lang-toggle.svelte`

**功能**:

- 切换语言时自动更新 URL
- 使用 `history.replaceState`（无刷新）
- 保留查询参数（如推荐链接 `?ref=`）

**示例**:

```
https://biubiu.tools/apps/token-sweep
→ 切换到中文
https://biubiu.tools/zh/apps/token-sweep
```

---

### ✅ 4. 完整的 Meta 标签

**组件**: `/src/lib/components/seo-head.svelte`

**包含**:

- Primary Meta: title, description, keywords, canonical
- Open Graph (Facebook/LinkedIn 分享)
- Twitter Card (Twitter 分享)
- 其他 SEO 标签: robots, googlebot, language

**示例使用**:

```svelte
<SeoHead
	title="Page Title | BiuBiu Tools"
	description="Page description..."
	keywords="keyword1, keyword2"
	canonical="https://biubiu.tools/page"
	type="website"
	image="/og-image.png"
	locale="en_US"
	structuredData={schemaData}
/>
```

---

### ✅ 5. Structured Data (JSON-LD)

**文件**: `/src/routes/apps/token-sweep/+page.svelte`

#### 5.1 WebApplication Schema

告诉 Google 这是一个 Web 应用：

```json
{
	"@type": "WebApplication",
	"name": "Token Sweep",
	"applicationCategory": "FinanceApplication",
	"offers": { "price": "0", "priceCurrency": "USD" },
	"aggregateRating": { "ratingValue": "4.8", "ratingCount": "127" }
}
```

#### 5.2 HowTo Schema（步骤式展示）⭐ NEW

在 Google 搜索结果中显示步骤卡片：

```json
{
	"@type": "HowTo",
	"name": "How to Batch Transfer ERC20 Tokens",
	"totalTime": "PT5M",
	"step": [
		{
			"@type": "HowToStep",
			"position": 1,
			"name": "Connect Your Wallet",
			"text": "Click the Connect Wallet button..."
		}
	]
}
```

**效果**: Google 搜索结果会显示类似这样的步骤卡片：

```
📱 Token Sweep - Batch Transfer ERC20 Tokens
biubiu.tools › apps › token-sweep
★★★★★ 4.8 (127 reviews) · Free

How to Batch Transfer ERC20 Tokens
⏱️ 5 minutes

1. Connect Your Wallet
   Click the "Connect Wallet" button...

2. Configure Token Transfer
   Select the blockchain network...

3. Complete Transfer
   Review the transaction summary...
```

---

## Google Rich Snippets

### 什么是 Rich Snippets？

Rich Snippets（丰富片段）是 Google 在搜索结果中显示的增强信息，包括：

- 评分星级 ⭐⭐⭐⭐⭐
- 价格信息 💰
- 步骤式指南 📝
- 常见问题解答 ❓
- 视频缩略图 📹
- 产品详情 🛍️

### 为什么使用 Structured Data？

✅ **提高点击率（CTR）**: 视觉吸引力更强
✅ **更好的排名**: Google 理解你的内容
✅ **零点击答案**: 直接在搜索结果显示信息
✅ **语音搜索优化**: 助手更容易理解

### 支持的 Schema 类型

我们已实现:

- ✅ **WebApplication**: 工具/应用信息
- ✅ **HowTo**: 步骤式教程

其他推荐 Schema:

- **FAQPage**: 常见问题（适合帮助页面）
- **VideoObject**: 视频教程
- **Article**: 博客文章
- **SoftwareApplication**: 软件下载
- **Course**: 教程课程

---

## 如何测试 SEO

### 1. Google Rich Results Test ⭐ 推荐

测试 Structured Data 是否正确：

```
🔗 https://search.google.com/test/rich-results
```

**步骤**:

1. 输入 URL: `https://biubiu.tools/apps/token-sweep`
2. 点击"Test URL"
3. 查看检测到的 Schema 类型
4. 查看预览效果

**预期结果**:

- ✅ Detected: WebApplication
- ✅ Detected: HowTo
- ✅ 0 Errors
- ✅ Preview shows steps

---

### 2. Schema.org Validator

验证 JSON-LD 语法：

```
🔗 https://validator.schema.org/
```

**步骤**:

1. 访问页面
2. 右键查看源代码
3. 复制 `<script type="application/ld+json">` 中的 JSON
4. 粘贴到验证器
5. 查看错误和警告

---

### 3. Google Search Console

提交 sitemap 并监控索引状态：

```
🔗 https://search.google.com/search-console
```

**步骤**:

1. 添加网站: `biubiu.tools`
2. 验证所有权（DNS/HTML 文件）
3. 提交 Sitemap: `https://biubiu.tools/sitemap.xml`
4. 等待 Google 爬取
5. 查看"Coverage"报告

---

### 4. Facebook Sharing Debugger

测试 Open Graph 标签：

```
🔗 https://developers.facebook.com/tools/debug/
```

**步骤**:

1. 输入 URL
2. 点击"Debug"
3. 查看预览
4. 点击"Scrape Again"清除缓存

---

### 5. Twitter Card Validator

测试 Twitter 分享卡片：

```
🔗 https://cards-dev.twitter.com/validator
```

---

## 其他值得实践的 SEO 技术

### 1. FAQPage Schema（常见问题）

适用于帮助页面、FAQ 页面：

```typescript
const faqSchema = {
	'@type': 'FAQPage',
	mainEntity: [
		{
			'@type': 'Question',
			name: 'What is Token Sweep?',
			acceptedAnswer: {
				'@type': 'Answer',
				text: 'Token Sweep is a tool that...'
			}
		},
		{
			'@type': 'Question',
			name: 'How much does it cost?',
			acceptedAnswer: {
				'@type': 'Answer',
				text: 'Token Sweep is completely free...'
			}
		}
	]
};
```

**效果**: Google 可能在搜索结果中直接显示答案。

---

### 2. BreadcrumbList Schema（面包屑导航）

帮助 Google 理解网站结构：

```typescript
const breadcrumbSchema = {
	'@type': 'BreadcrumbList',
	itemListElement: [
		{
			'@type': 'ListItem',
			position: 1,
			name: 'Home',
			item: 'https://biubiu.tools'
		},
		{
			'@type': 'ListItem',
			position: 2,
			name: 'Apps',
			item: 'https://biubiu.tools/apps'
		},
		{
			'@type': 'ListItem',
			position: 3,
			name: 'Token Sweep'
		}
	]
};
```

---

### 3. VideoObject Schema（视频内容）

如果有视频教程：

```typescript
const videoSchema = {
	'@type': 'VideoObject',
	name: 'How to Use Token Sweep',
	description: 'Tutorial video...',
	thumbnailUrl: 'https://biubiu.tools/video-thumb.jpg',
	uploadDate: '2025-11-06',
	duration: 'PT3M45S', // 3 minutes 45 seconds
	contentUrl: 'https://youtube.com/watch?v=...',
	embedUrl: 'https://youtube.com/embed/...'
};
```

---

### 4. 性能优化（Core Web Vitals）

Google 将页面速度作为排名因素：

**测试工具**:

```
🔗 https://pagespeed.web.dev/
```

**优化目标**:

- ✅ LCP (Largest Contentful Paint) < 2.5s
- ✅ FID (First Input Delay) < 100ms
- ✅ CLS (Cumulative Layout Shift) < 0.1

**优化建议**:

- 使用 WebP 图片格式
- 延迟加载图片 (`loading="lazy"`)
- 压缩 JavaScript/CSS
- 使用 CDN

---

### 5. 内部链接优化

**最佳实践**:

- 使用描述性锚文本（不要用"点击这里"）
- 链接相关页面
- 创建 sitemap 页面

**示例**:

```html
<!-- ❌ 不好 -->
<a href="/apps/token-sweep">点击这里</a>

<!-- ✅ 好 -->
<a href="/apps/token-sweep">批量转账 ERC20 代币工具</a>
```

---

### 6. 图片 SEO

**最佳实践**:

```html
<img
	src="/token-sweep.webp"
	alt="Token Sweep - Batch transfer ERC20 tokens"
	width="1200"
	height="630"
	loading="lazy"
/>
```

**要点**:

- ✅ 使用描述性文件名
- ✅ 添加 alt 属性
- ✅ 指定宽高（防止 CLS）
- ✅ 使用现代格式（WebP, AVIF）

---

### 7. Open Graph 图片

创建社交媒体分享图片：

**位置**: `/static/og-token-sweep.png`

**尺寸**:

- 推荐: 1200x630 像素
- 最小: 600x315 像素
- 比例: 1.91:1

**内容**:

- 工具名称
- 简短描述
- 视觉元素
- BiuBiu Tools logo

**工具**:

- Figma (设计)
- Canva (在线设计)
- OG Image Generator (自动生成)

---

## 为新页面添加 SEO

### 步骤 1: 创建 `+page.ts`

```typescript
// src/routes/your-page/+page.ts
import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
	return {
		meta: {
			title: 'Your Page Title | BiuBiu Tools',
			description: 'Detailed description (150-160 chars)...',
			keywords: 'keyword1, keyword2, keyword3',
			canonical: url.origin + url.pathname,
			type: 'website' as const,
			image: `${url.origin}/og-your-page.png`,
			locale: 'en_US'
		}
	};
};
```

---

### 步骤 2: 在页面中使用 `<SeoHead>`

```svelte
<script lang="ts">
	import SeoHead from '$lib/components/seo-head.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Optional: Add structured data
	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'WebApplication',
		name: 'Your Tool Name'
		// ... more fields
	};
</script>

<SeoHead
	title={data.meta.title}
	description={data.meta.description}
	keywords={data.meta.keywords}
	canonical={data.meta.canonical}
	type={data.meta.type}
	image={data.meta.image}
	locale={data.meta.locale}
	{structuredData}
/>

<!-- Your page content -->
```

---

### 步骤 3: 创建 OG 图片

```bash
# 创建图片
static/og-your-page.png  # 1200x630 pixels
```

---

### 步骤 4: 测试

1. 运行开发服务器: `npm run dev`
2. 访问: `http://localhost:5173/your-page`
3. 查看源代码，确认 meta 标签
4. 使用 Rich Results Test 测试

---

## 监控和改进

### Google Search Console

定期检查：

- **Coverage**: 哪些页面被索引
- **Performance**: 点击率、展示次数、排名
- **Enhancements**: Structured Data 错误
- **Core Web Vitals**: 性能指标

### Analytics

使用 Google Analytics 4 追踪：

- 访问来源（搜索、直接、推荐）
- 关键词排名
- 跳出率
- 转化率

---

## 总结

✅ **已实现的 SEO 功能**:

1. 自动 sitemap.xml（多语言 + hreflang）
2. Robots.txt
3. 语言切换 URL 更新
4. 完整 Meta 标签组件
5. WebApplication Schema
6. HowTo Schema（步骤式展示）

✅ **推荐额外实践**:

1. FAQPage Schema（常见问题）
2. BreadcrumbList（面包屑）
3. VideoObject（视频教程）
4. 性能优化（Core Web Vitals）
5. 内部链接优化
6. 图片 SEO
7. OG 图片

🎯 **SEO 不是一次性的事情，而是持续优化的过程！**

---

## 参考资源

- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org/)
- [Google Rich Results Gallery](https://developers.google.com/search/docs/appearance/structured-data/search-gallery)
- [Web.dev SEO Guide](https://web.dev/learn/seo/)
