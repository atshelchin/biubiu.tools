<script lang="ts">
	/**
	 * Paywall Demo Page
	 * A comprehensive demo showcasing all features of the @shelchin/paywall package
	 */
	import { useI18n } from '@shelchin/i18n';
	import { Shield, CreditCard, Users, Fingerprint, Server, Gauge } from '@lucide/svelte';
	import { PackageDemoLayout, DemoSection, CodeBlock } from '$lib/components/package-demo';

	// Demo components
	import IntroDemo from '$lib/components/package-demo/demos/paywall/intro-demo.svelte';
	import RulesDemo from '$lib/components/package-demo/demos/paywall/rules-demo.svelte';
	import MembershipDemo from '$lib/components/package-demo/demos/paywall/membership-demo.svelte';
	import UsageDemo from '$lib/components/package-demo/demos/paywall/usage-demo.svelte';
	import SecurityDemo from '$lib/components/package-demo/demos/paywall/security-demo.svelte';
	import SelfHostedDemo from '$lib/components/package-demo/demos/paywall/self-hosted-demo.svelte';
	import InteractiveDemo from '$lib/components/package-demo/demos/paywall/interactive-demo.svelte';

	const i18n = useI18n();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const t = (key: string) => i18n.t(`routes/packages/paywall.${key}` as any);

	const features = [
		{ icon: Users, text: t('features.membership') },
		{ icon: Gauge, text: t('features.usage_quota') },
		{ icon: Shield, text: t('features.security') },
		{ icon: CreditCard, text: t('features.rules') },
		{ icon: Fingerprint, text: t('features.caching') },
		{ icon: Server, text: t('features.self_hosted') }
	];

	const installationCode = `npm install @shelchin/paywall
# or
bun add @shelchin/paywall`;
</script>

<svelte:head>
	<title>{t('title')} | BiuBiu Tools</title>
	<meta name="description" content={t('description')} />
</svelte:head>

<PackageDemoLayout
	packageName="@shelchin/paywall"
	title={t('title')}
	subtitle={t('subtitle')}
	description={t('description')}
	{features}
	heroIcon={Shield}
>
	<!-- Demo 1: How It Works -->
	<IntroDemo {t} />

	<!-- Demo 2: Paywall Rules -->
	<RulesDemo {t} />

	<!-- Demo 3: Membership Store -->
	<MembershipDemo {t} />

	<!-- Demo 4: Usage Quota -->
	<UsageDemo {t} />

	<!-- Demo 5: Security Features -->
	<SecurityDemo {t} />

	<!-- Demo 6: Self-Hosted Mode -->
	<SelfHostedDemo {t} />

	<!-- Demo 7: Interactive Playground -->
	<InteractiveDemo {t} />

	<!-- Installation Section -->
	<DemoSection title={t('code.installation')}>
		<CodeBlock title="npm / bun" code={installationCode} language="bash" />
	</DemoSection>
</PackageDemoLayout>
