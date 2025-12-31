import type { ToolDetail } from '../../types';

export const remixDetail: ToolDetail = {
	about: {
		overview: `Remix is the browser-based IDE for Solidity development. No installation needed—open remix.ethereum.org and start writing smart contracts immediately. Perfect for learning and quick prototyping.

The IDE includes a Solidity compiler, debugger, static analysis, and deployment tools. Connect your wallet to deploy directly to any network. Plugins extend functionality further.

Remix is how most people write their first smart contract. Used in tutorials, workshops, and for quick tests. While serious projects use Foundry/Hardhat locally, Remix remains invaluable for learning and experimentation.`,
		features: [
			{ title: 'Browser-Based', description: 'No installation' },
			{ title: 'Compiler', description: 'Built-in Solidity' },
			{ title: 'Debugger', description: 'Step through code' },
			{ title: 'Deploy Tools', description: 'Direct deployment' },
			{ title: 'Plugins', description: 'Extensible' },
			{ title: 'Free', description: 'Open source' }
		],
		useCases: [
			{ title: 'Learning', description: 'First smart contracts' },
			{ title: 'Prototyping', description: 'Quick experiments' },
			{ title: 'Debugging', description: 'Transaction analysis' },
			{ title: 'Workshops', description: 'Teaching tool' },
			{ title: 'Quick Deploy', description: 'Fast deployment' }
		]
	},
	faqs: [
		{
			question: 'What is Remix?',
			answer: `Remix is a browser-based IDE for Solidity smart contracts. It includes compiler, debugger, and deployment tools. Open remix.ethereum.org and start coding immediately—no setup required.`
		},
		{
			question: 'Should I use Remix or Hardhat/Foundry?',
			answer: `Remix for learning and quick prototyping—zero setup. Hardhat/Foundry for serious projects—better testing, version control, team workflows. Many use Remix for experiments, local tools for production.`
		},
		{
			question: 'Can I deploy from Remix?',
			answer: `Yes. Connect MetaMask or other wallets and deploy to any EVM network directly. Great for testnets and quick mainnet deploys. For production, consider deployment scripts for reproducibility.`
		},
		{
			question: 'Is my code saved?',
			answer: `By default, code is in browser storage—can be lost. Use workspaces with GitHub integration or download files regularly. For important work, use local IDE with version control.`
		},
		{
			question: 'What are Remix plugins?',
			answer: `Plugins extend Remix functionality: Slither for security analysis, Sourcify for verification, IPFS for storage. The plugin system makes Remix highly customizable. Check the plugin manager.`
		}
	],
	cta: {
		ready: 'Ready to write smart contracts?',
		button: 'Open Remix',
		note: 'Browser-based IDE'
	}
};
