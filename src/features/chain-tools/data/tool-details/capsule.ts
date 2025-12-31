import type { ToolDetail } from '../../types';

export const capsuleDetail: ToolDetail = {
	about: {
		overview: `Capsule provides embedded wallet infrastructure using MPC. They enable apps to create wallets for users via social login while maintaining true non-custody through distributed key shares.

The focus is on security and compliance—Capsule targets enterprises and regulated environments. Their MPC approach means no single party ever holds a complete private key.

Capsule differentiates on security posture: SOC 2 compliance, enterprise support, and integration with existing identity systems. Built for companies with serious security requirements.`,
		features: [
			{ title: 'MPC Wallets', description: 'Distributed keys' },
			{ title: 'Social Login', description: 'Easy onboarding' },
			{ title: 'SOC 2', description: 'Compliance ready' },
			{ title: 'Enterprise', description: 'B2B focus' },
			{ title: 'Non-Custodial', description: 'True ownership' },
			{ title: 'Identity Integration', description: 'SSO support' }
		],
		useCases: [
			{ title: 'Enterprise Apps', description: 'Compliant wallets' },
			{ title: 'Fintech', description: 'Regulated environment' },
			{ title: 'B2B Products', description: 'White-label' },
			{ title: 'Consumer Apps', description: 'Secure onboarding' },
			{ title: 'Institutions', description: 'Enterprise needs' }
		]
	},
	faqs: [
		{
			question: 'What is Capsule?',
			answer: `Capsule provides MPC wallet infrastructure. Apps create wallets for users via social login, but keys are distributed—no single party has full control. Non-custodial embedded wallets.`
		},
		{
			question: 'What makes Capsule enterprise-grade?',
			answer: `SOC 2 compliance, enterprise support, identity system integration, and security-first architecture. Built for companies with compliance requirements and security teams.`
		},
		{
			question: 'How does MPC work here?',
			answer: `Private keys are split into shares across multiple parties (user, Capsule, backup). Signatures are computed collaboratively. No party can sign alone—true non-custody.`
		},
		{
			question: 'Capsule vs Web3Auth?',
			answer: `Both use MPC for embedded wallets. Capsule emphasizes enterprise features and compliance. Web3Auth has broader consumer focus. Choose based on your security requirements.`
		},
		{
			question: 'Is there a developer tier?',
			answer: `Yes, they have developer access for building and testing. Production usage has enterprise pricing. Contact them for specific plans and compliance needs.`
		}
	],
	cta: {
		ready: 'Ready for enterprise MPC?',
		button: 'Contact Capsule',
		note: 'Enterprise wallet infrastructure'
	}
};
