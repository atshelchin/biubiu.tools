<script lang="ts">
	/**
	 * FormState Demo Page
	 * A comprehensive demo showcasing all features of the @shelchin/formstate package
	 */
	import { useI18n } from '@shelchin/i18n';
	import { FileText, Shield, Zap, Code, Layers, List } from '@lucide/svelte';
	import { PackageDemoLayout, DemoSection, CodeBlock } from '$lib/components/package-demo';

	// Demo components
	import BasicUsageDemo from '$lib/components/package-demo/demos/formstate/basic-usage-demo.svelte';
	import TypedFormDemo from '$lib/components/package-demo/demos/formstate/typed-form-demo.svelte';
	import ValidatorsDemo from '$lib/components/package-demo/demos/formstate/validators-demo.svelte';
	import SubmitDemo from '$lib/components/package-demo/demos/formstate/submit-demo.svelte';
	import ArrayFieldsDemo from '$lib/components/package-demo/demos/formstate/array-fields-demo.svelte';
	import WatchDemo from '$lib/components/package-demo/demos/formstate/watch-demo.svelte';
	import DirtyTrackingDemo from '$lib/components/package-demo/demos/formstate/dirty-tracking-demo.svelte';
	import ZodDemo from '$lib/components/package-demo/demos/formstate/zod-demo.svelte';
	import TransformersDemo from '$lib/components/package-demo/demos/formstate/transformers-demo.svelte';
	import HeadlessDemo from '$lib/components/package-demo/demos/formstate/headless-demo.svelte';
	import AdvancedValidationDemo from '$lib/components/package-demo/demos/formstate/advanced-validation-demo.svelte';

	const i18n = useI18n();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const t = (key: string) => i18n.t(`routes/packages/formstate.${key}` as any);

	const features = [
		{ icon: Code, text: t('features.type_safe') },
		{ icon: Shield, text: t('features.validators') },
		{ icon: Zap, text: t('features.zod_integration') },
		{ icon: Layers, text: t('features.reactive') },
		{ icon: FileText, text: t('features.headless') },
		{ icon: List, text: t('features.array_fields') }
	];

	const installationCode = `npm install @shelchin/formstate
# or
bun add @shelchin/formstate`;

	const zodInstallCode = `# For Zod validation support
npm install zod
# or
bun add zod`;
</script>

<svelte:head>
	<title>{t('title')} | BiuBiu Tools</title>
	<meta name="description" content={t('description')} />
</svelte:head>

<PackageDemoLayout
	packageName="@shelchin/formstate"
	title={t('title')}
	subtitle={t('subtitle')}
	description={t('description')}
	{features}
	heroIcon={FileText}
>
	<!-- Demo 1: Basic Usage -->
	<BasicUsageDemo {t} />

	<!-- Demo 2: Type-Safe Forms -->
	<TypedFormDemo {t} />

	<!-- Demo 3: Built-in Validators -->
	<ValidatorsDemo {t} />

	<!-- Demo 4: Form Submission -->
	<SubmitDemo {t} />

	<!-- Demo 5: Array Fields -->
	<ArrayFieldsDemo {t} />

	<!-- Demo 6: Watch API -->
	<WatchDemo {t} />



	<!-- Demo 8: Zod Integration -->
	<ZodDemo {t} />

		<!-- Demo 7: Dirty Tracking -->
	<DirtyTrackingDemo {t} />

	<!-- Demo 9: Input Transformers -->
	<TransformersDemo {t} />

	<!-- Demo 10: Headless Components -->
	<HeadlessDemo {t} />

	<!-- Demo 11: Advanced Validation -->
	<AdvancedValidationDemo {t} />

	<!-- Installation Section -->
	<DemoSection title={t('code.installation')}>
		<div class="install-codes">
			<CodeBlock title="npm / bun" code={installationCode} language="bash" />
			<CodeBlock title="Zod (optional)" code={zodInstallCode} language="bash" />
		</div>
	</DemoSection>
</PackageDemoLayout>

<style>
	.install-codes {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-4);
	}

	@media (max-width: 768px) {
		.install-codes {
			grid-template-columns: 1fr;
		}
	}
</style>
