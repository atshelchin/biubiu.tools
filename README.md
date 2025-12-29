# biubiu.tools 🚀

A powerful Web3 toolkit for Ethereum ecosystem, providing batch operations and multi-wallet management tools. Built with modern web technologies for the best user experience.

[English](README.md) | [中文](README.zh.md)

## ✨ Features

- **🔄 Batch Operations**: Efficiently handle multiple transactions at once
- **💰 Token Collection**: Gather tokens from multiple wallets with ease
- **🎁 Airdrop Tools**: Distribute tokens to multiple addresses efficiently
- **👛 Multi-Wallet Management**: Manage multiple wallets seamlessly
- **⛓️ Multi-Chain Support**: Works across different blockchain networks
- **🌍 Internationalization**: Full support for English and Chinese
- **🎨 Theme System**: Beautiful light and dark themes
- **📱 Responsive Design**: Perfect experience on all devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Bun (recommended) or npm/yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/atshelchin/biubiu.tools.git
cd biubiu.tools

# Install dependencies
bun install
# or
npm install
```

### Development

```bash
# Start development server
bun run dev
# or
npm run dev

# Open http://localhost:5173
```

### Build

```bash
# Build for production
bun run build
# or
npm run build

# Preview production build
bun run preview
```

## 🛠️ Tech Stack

- **Framework**: [SvelteKit 2.0](https://kit.svelte.dev/) with [Svelte 5](https://svelte.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: Custom Design Token System (no Tailwind)
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Package Manager**: [Bun](https://bun.sh/)

## 📂 Project Structure

```
biubiu.tools/
├── src/
│   ├── routes/          # SvelteKit routes
│   ├── lib/
│   │   ├── components/  # Reusable components
│   │   │   ├── ui/      # UI components
│   │   │   └── widgets/ # Widget components
│   │   └── stores/      # Svelte stores
│   ├── features/        # Feature modules
│   ├── i18n/           # Internationalization
│   ├── utils/          # Utility functions
│   └── design-tokens.css # Design system tokens
├── static/             # Static assets
├── tests/              # Test files
└── wrangler.jsonc      # Cloudflare config
```

## 🎨 Design System

The project uses a custom design token system that provides:

- **CSS Variables**: Consistent colors, spacing, typography
- **Theme Support**: Automatic dark/light mode switching
- **Accessibility**: High contrast modes and font scaling
- **Responsive**: Mobile-first design approach

## 🌐 Internationalization

The app supports multiple languages:

- English (en)
- Chinese (zh)

Language preference is automatically detected and persisted.

## 🍴 Self-Hosting / Fork

Want to run your own instance? It's simple:

```bash
bun install
VITE_SELF_HOSTED=true bun run build
```

See [Fork Guide](docs/FORK_GUIDE.md) ([中文](docs/FORK_GUIDE.zh.md)) for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- **Website**: [https://biubiu.tools](https://biubiu.tools)
- **GitHub**: [https://github.com/atshelchin/biubiu.tools](https://github.com/atshelchin/biubiu.tools)
- **Twitter**: [@atshelchin](https://x.com/atshelchin)

## 📧 Contact

For questions and support, please open an issue on GitHub or contact us on Twitter.

---

Built with ❤️ by the biubiu.tools team
