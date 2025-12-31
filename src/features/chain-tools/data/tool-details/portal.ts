import type { ToolDetail } from '../../types';

export const portalDetail: ToolDetail = {
	about: {
		overview: `Portal provides MPC wallet infrastructure for enterprises. Their technology enables wallet creation at scale while keeping keys distributed—no single point of compromise.

Portal focuses on B2B use cases: exchanges, custodians, and companies needing wallet infrastructure. They handle the cryptographic complexity while you build your product.

The platform includes policy engines for transaction controls and recovery mechanisms for key management. Enterprise-grade security with developer-friendly APIs.`,
		features: [
			{ title: 'MPC Security', description: 'Distributed keys' },
			{ title: 'Enterprise', description: 'B2B infrastructure' },
			{ title: 'Policy Engine', description: 'Transaction rules' },
			{ title: 'Recovery', description: 'Key backup' },
			{ title: 'Multi-Chain', description: 'Many networks' },
			{ title: 'API-First', description: 'Developer friendly' }
		],
		useCases: [
			{ title: 'Exchanges', description: 'Wallet infrastructure' },
			{ title: 'Custodians', description: 'Secure custody' },
			{ title: 'Fintechs', description: 'Embedded wallets' },
			{ title: 'B2B Platforms', description: 'White-label' },
			{ title: 'Institutions', description: 'Enterprise security' }
		]
	},
	faqs: [
		{
			question: 'What is Portal?',
			answer: `Portal provides MPC wallet infrastructure for enterprises. Create wallets at scale with distributed key management. No single party has complete keys—secure by design.`
		},
		{
			question: 'Who uses Portal?',
			answer: `Exchanges, custodians, and fintechs needing wallet infrastructure. B2B focus—Portal powers other companies' wallet products rather than serving end users directly.`
		},
		{
			question: 'What is the policy engine?',
			answer: `Set rules for transactions: spending limits, approved destinations, required approvals. Enforce security policies at the infrastructure level before signing.`
		},
		{
			question: 'Portal vs Turnkey?',
			answer: `Both provide key infrastructure for enterprises. Portal uses MPC; Turnkey uses secure enclaves. Different security architectures, similar use cases. Evaluate based on your requirements.`
		},
		{
			question: 'Enterprise pricing?',
			answer: `Portal has enterprise pricing based on usage and support needs. Contact their sales team for specific quotes. They work with companies at various scales.`
		}
	],
	cta: {
		ready: 'Ready for MPC infrastructure?',
		button: 'Contact Portal',
		note: 'Enterprise MPC wallets'
	}
};
