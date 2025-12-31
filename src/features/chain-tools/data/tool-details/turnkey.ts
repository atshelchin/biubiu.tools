import type { ToolDetail } from '../../types';

export const turnkeyDetail: ToolDetail = {
	about: {
		overview: `Turnkey provides secure private key infrastructure for Web3. Their API-based system manages keys in secure enclaves—enabling wallet features without holding custody.

Built for developers who need programmatic key management: exchanges, institutions, and advanced dApps. Turnkey handles the HSM/enclave complexity while you focus on your application.

The approach is institutional-grade security with API accessibility. Create wallets, sign transactions, and implement policies—all through their API. Popular for B2B and infrastructure use cases.`,
		features: [
			{ title: 'Secure Enclaves', description: 'HSM-level security' },
			{ title: 'API Access', description: 'Programmatic' },
			{ title: 'Policy Engine', description: 'Signing rules' },
			{ title: 'Non-Custodial', description: 'You control' },
			{ title: 'Multi-Sig', description: 'Threshold signing' },
			{ title: 'Enterprise', description: 'B2B focus' }
		],
		useCases: [
			{ title: 'Exchanges', description: 'Hot wallet infra' },
			{ title: 'Institutions', description: 'Secure custody' },
			{ title: 'dApp Backends', description: 'Key management' },
			{ title: 'Embedded Wallets', description: 'Infrastructure' },
			{ title: 'Automation', description: 'Programmatic signing' }
		]
	},
	faqs: [
		{
			question: 'What is Turnkey?',
			answer: `Turnkey is private key infrastructure. They manage keys in secure enclaves, accessible via API. Create wallets, sign transactions, enforce policies—without building HSM infrastructure yourself.`
		},
		{
			question: 'How is it non-custodial?',
			answer: `Keys are in secure enclaves only you control. Turnkey can't access your keys—they provide infrastructure, not custody. You maintain control through your credentials.`
		},
		{
			question: 'Who uses Turnkey?',
			answer: `Exchanges, institutions, and developers needing programmatic key management. B2B focus—they power other services' wallet infrastructure rather than serving end users directly.`
		},
		{
			question: 'Turnkey vs AWS KMS?',
			answer: `AWS KMS is general-purpose. Turnkey is blockchain-specific—they understand transactions, policies, and Web3 needs. Purpose-built for crypto key management.`
		},
		{
			question: 'What are policies?',
			answer: `Signing policies control what can be signed: spending limits, allowed destinations, required approvals. Implement security rules at the infrastructure level.`
		}
	],
	cta: {
		ready: 'Ready for key infrastructure?',
		button: 'Explore Turnkey',
		note: 'Secure key management'
	}
};
