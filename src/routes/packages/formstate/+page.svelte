<script lang="ts">
	/**
	 * FormState Demo Page
	 * A comprehensive demo showcasing all features of the @shelchin/formstate package
	 * Demos are organized by difficulty: Beginner -> Intermediate -> Advanced
	 */
	import { useI18n } from '@shelchin/i18n';
	import { FileText, Shield, Zap, Code, Layers, List } from '@lucide/svelte';
	import { PackageDemoLayout, DemoSection, CodeBlock } from '$lib/components/package-demo';

	// Demo components - Beginner Level
	import BasicUsageDemo from '$lib/components/package-demo/demos/formstate/basic-usage-demo.svelte';
	import TypedFormDemo from '$lib/components/package-demo/demos/formstate/typed-form-demo.svelte';
	import ValidatorsDemo from '$lib/components/package-demo/demos/formstate/validators-demo.svelte';
	import SubmitDemo from '$lib/components/package-demo/demos/formstate/submit-demo.svelte';
	import TransformersDemo from '$lib/components/package-demo/demos/formstate/transformers-demo.svelte';

	// Demo components - Intermediate Level
	import ArrayFieldsDemo from '$lib/components/package-demo/demos/formstate/array-fields-demo.svelte';
	import WatchDemo from '$lib/components/package-demo/demos/formstate/watch-demo.svelte';
	import ZodDemo from '$lib/components/package-demo/demos/formstate/zod-demo.svelte';
	import DirtyTrackingDemo from '$lib/components/package-demo/demos/formstate/dirty-tracking-demo.svelte';
	import HeadlessDemo from '$lib/components/package-demo/demos/formstate/headless-demo.svelte';
	import AdvancedValidationDemo from '$lib/components/package-demo/demos/formstate/advanced-validation-demo.svelte';
	import FieldDependenciesDemo from '$lib/components/package-demo/demos/formstate/field-dependencies-demo.svelte';
	import FormPersistenceDemo from '$lib/components/package-demo/demos/formstate/form-persistence-demo.svelte';
	import ConditionalFieldsDemo from '$lib/components/package-demo/demos/formstate/conditional-fields-demo.svelte';

	// Demo components - Advanced Level
	import MultiStepDemo from '$lib/components/package-demo/demos/formstate/multi-step-demo.svelte';
	import SchemaFormDemo from '$lib/components/package-demo/demos/formstate/schema-form-demo.svelte';
	import AbiFormDemo from '$lib/components/package-demo/demos/formstate/abi-form-demo.svelte';
	import NestedAbiFormDemo from '$lib/components/package-demo/demos/formstate/nested-abi-form-demo.svelte';

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
	<!-- ========== BEGINNER LEVEL ========== -->

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

	<!-- Demo 7: Zod Integration -->
	<ZodDemo {t} />

	<!-- Demo 8: Dirty Tracking -->
	<DirtyTrackingDemo {t} />

	<!-- Demo 9: Input Transformers -->
	<TransformersDemo {t} />

	<!-- ========== INTERMEDIATE LEVEL ========== -->

	<!-- Demo 10: Headless Components -->
	<HeadlessDemo {t} />

	<!-- Demo 11: Advanced Validation -->
	<AdvancedValidationDemo {t} />

	<!-- Demo 12: Field Dependencies -->
	<FieldDependenciesDemo {t} />

	<!-- Demo 13: Form Persistence -->
	<FormPersistenceDemo {t} />

	<!-- Demo 14: Conditional Fields -->
	<ConditionalFieldsDemo {t} />

	<!-- ========== ADVANCED LEVEL ========== -->

	<!-- Demo 15: Multi-Step Form -->
	<MultiStepDemo {t} />

	<!-- Demo 16: Schema-Driven Form -->
	<SchemaFormDemo {t} />

	<!-- Demo 17: Solidity ABI Form -->
	<AbiFormDemo {t} />

	<!-- Demo 18: Nested ABI Form -->
	<NestedAbiFormDemo {t} />

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
