# biubiu.tools 🚀

强大的 Web3 工具包，专为以太坊生态系统设计，提供批量操作和多钱包管理工具。采用现代化 Web 技术构建，带来最佳用户体验。

[English](README.md) | [中文](README.zh.md)

## ✨ 特性

- **🔄 批量操作**：高效处理多个交易
- **💰 代币归集**：轻松从多个钱包收集代币
- **🎁 空投工具**：高效分发代币到多个地址
- **👛 多钱包管理**：无缝管理多个钱包
- **⛓️ 多链支持**：支持不同的区块链网络
- **🌍 国际化**：完整支持中英文
- **🎨 主题系统**：精美的亮色和暗色主题
- **📱 响应式设计**：所有设备上的完美体验

## 🚀 快速开始

### 环境要求

- Node.js 18+
- Bun（推荐）或 npm/yarn

### 安装

```bash
# 克隆仓库
git clone https://github.com/atshelchin/biubiu.tools.git
cd biubiu.tools

# 安装依赖
bun install
# 或
npm install
```

### 开发

```bash
# 启动开发服务器
bun run dev
# 或
npm run dev

# 打开 http://localhost:5173
```

### 构建

```bash
# 生产构建
bun run build
# 或
npm run build

# 预览生产构建
bun run preview
```

## 🛠️ 技术栈

- **框架**: [SvelteKit 2.0](https://kit.svelte.dev/) 配合 [Svelte 5](https://svelte.dev/)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **样式**: 自定义设计令牌系统（无 Tailwind）
- **部署**: [Cloudflare Pages](https://pages.cloudflare.com/)
- **构建工具**: [Vite](https://vitejs.dev/)
- **包管理器**: [Bun](https://bun.sh/)

## 📂 项目结构

```
biubiu.tools/
├── src/
│   ├── routes/          # SvelteKit 路由
│   ├── lib/
│   │   ├── components/  # 可复用组件
│   │   │   ├── ui/      # UI 组件
│   │   │   └── widgets/ # 小部件组件
│   │   └── stores/      # Svelte 状态管理
│   ├── features/        # 功能模块
│   ├── i18n/           # 国际化
│   ├── utils/          # 工具函数
│   └── design-tokens.css # 设计系统令牌
├── static/             # 静态资源
├── tests/              # 测试文件
└── wrangler.jsonc      # Cloudflare 配置
```

## 🎨 设计系统

项目使用自定义设计令牌系统，提供：

- **CSS 变量**：一致的颜色、间距、排版
- **主题支持**：自动亮/暗模式切换
- **无障碍**：高对比度模式和字体缩放
- **响应式**：移动优先的设计方法

## 🌐 国际化

应用支持多语言：

- 英语 (en)
- 中文 (zh)

语言偏好会自动检测并持久保存。

## 🍴 自托管 / Fork

想要运行自己的实例？很简单：

```bash
bun install
VITE_SELF_HOSTED=true bun run build
```

详情请查看 [Fork 指南](docs/FORK_GUIDE.zh.md)（[English](docs/FORK_GUIDE.md)）。

## 🤝 贡献

欢迎贡献！请随时提交 Pull Request。

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

## 🔗 链接

- **网站**: [https://biubiu.tools](https://biubiu.tools)
- **GitHub**: [https://github.com/atshelchin/biubiu.tools](https://github.com/atshelchin/biubiu.tools)
- **Twitter**: [@atshelchin](https://x.com/atshelchin)

## 📧 联系方式

如有问题和支持需求，请在 GitHub 上开启 issue 或在 Twitter 上联系我们。

---

由 biubiu.tools 团队用 ❤️ 构建
