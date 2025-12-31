import type { ToolDetail } from '../../types';

export const llamanodesDetail: ToolDetail = {
	about: {
		overview: `Llama Nodes provides privacy-focused RPC endpoints for Ethereum. They don't log user data or IP addresses—a key differentiator from most RPC providers.

The service is free for most users with generous rate limits. Built by the Llama Corp team behind DefiLlama, they understand DeFi users' needs for privacy and reliability.

Llama Nodes is especially popular for users who want RPC access without surveillance. No signup required for basic access. A refreshingly simple approach to blockchain infrastructure.`,
		features: [
			{ title: 'Privacy-Focused', description: 'No logging' },
			{ title: 'Free', description: 'Generous limits' },
			{ title: 'No Signup', description: 'Instant access' },
			{ title: 'Reliable', description: 'Good uptime' },
			{ title: 'DefiLlama Team', description: 'Trusted builders' },
			{ title: 'Simple', description: 'No complexity' }
		],
		useCases: [
			{ title: 'Privacy', description: 'No-log RPC' },
			{ title: 'Free Access', description: 'No cost' },
			{ title: 'Quick Setup', description: 'Instant use' },
			{ title: 'Wallet Config', description: 'Custom RPC' },
			{ title: 'Development', description: 'Testing' }
		]
	},
	faqs: [
		{
			question: 'What is Llama Nodes?',
			answer: `Llama Nodes is a privacy-focused Ethereum RPC provider. They don't log user data or IP addresses. Free to use with generous rate limits. Built by the DefiLlama team.`
		},
		{
			question: 'Why privacy matters for RPC?',
			answer: `RPC providers see your transactions before they hit the chain. They can track your wallet, censor transactions, or sell data. Llama Nodes promises no logging—your activity stays private.`
		},
		{
			question: 'Is it really free?',
			answer: `Yes. Llama Nodes is free with generous rate limits for normal use. They fund it through other Llama Corp products. No premium tier—everyone gets the same service.`
		},
		{
			question: 'Which chains are supported?',
			answer: `Primarily Ethereum. Check their site for current chain support. They focus on quality over quantity—reliable service for supported chains rather than mediocre coverage everywhere.`
		},
		{
			question: 'How do I use it?',
			answer: `Just use their RPC URL in your wallet or dApp. No signup, no API key. eth.llamarpc.com for Ethereum. Add to MetaMask or use in your code directly.`
		}
	],
	cta: {
		ready: 'Ready for private RPC?',
		button: 'Use Llama Nodes',
		note: 'Privacy-focused RPC'
	}
};
