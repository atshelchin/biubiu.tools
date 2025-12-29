# New Step-Based Tool Development Guide

This guide explains how to create a new step-based blockchain tool using the shared component framework.

## Quick Start

Creating a new tool involves 4 main parts:

1. **Routes** - SvelteKit pages for the tool
2. **Features** - Tool-specific logic and state
3. **i18n** - Translations
4. **Using shared components** - Leverage pre-built step components

## Directory Structure

```
src/
├── routes/apps/{tool-name}/
│   ├── +page.svelte          # Main page component
│   └── +page.server.ts       # SSR data loading
├── features/{tool-name}/
│   ├── stores/               # State management
│   │   └── app-state.svelte.ts
│   ├── ui/
│   │   └── steps/            # Step components
│   │       ├── index.ts      # Step component exports
│   │       ├── step1-*.svelte
│   │       ├── step2-*.svelte
│   │       └── ...
│   └── types/
│       └── index.ts          # Type definitions
└── i18n/locales/
    ├── en/routes/{tool-name}.json
    └── zh/routes/{tool-name}.json
```

## Step 1: Create Route Files

### +page.server.ts

Use the `createStepAppPageLoad` factory for consistent SSR data loading:

```typescript
import { createStepAppPageLoad } from '$lib/utils/create-step-app-page-load';

export const load = createStepAppPageLoad({
	toolId: 'my-new-tool',
	stepCount: 4, // Number of steps
	featureCount: 3, // Optional: for feature flags
	isPremium: false // Optional: paywall status
});
```

### +page.svelte

```svelte
<script lang="ts">
	import StepBasedApp from '$lib/components/ui/step-based-app.svelte';
	import { createStepComponents } from '$lib/utils/create-step-components';

	// Auto-load step components using glob pattern
	const stepComponents = createStepComponents(
		import.meta.glob('./../../features/my-new-tool/ui/steps/*.svelte', { eager: true })
	);
</script>

<StepBasedApp {stepComponents} />
```

## Step 2: Create State Management

### stores/app-state.svelte.ts

```typescript
import { SvelteSet } from 'svelte/reactivity';

// Step 1 state (if needed beyond shared components)
// Usually ConnectWallet handles Step 1 state via connectStore

// Step 2 state example
class Step2State {
	selectedItems = $state<SvelteSet<string>>(new SvelteSet());

	get count() {
		return this.selectedItems.size;
	}

	addItem(id: string) {
		this.selectedItems.add(id);
	}

	reset() {
		this.selectedItems.clear();
	}
}

export const step2State = new Step2State();
```

## Step 3: Create Step Components

### Using Shared Components

For common steps, use the shared component library:

#### Step 1: Connect Wallet

```svelte
<!-- step1-connect-content.svelte -->
<script lang="ts">
	import { ConnectWalletContent } from '$lib/components/step/connect-wallet';
</script>

<ConnectWalletContent i18nPrefix="my-new-tool" />
```

```svelte
<!-- step1-connect-footer.svelte -->
<script lang="ts">
	import { ConnectWalletFooter } from '$lib/components/step/connect-wallet';
</script>

<ConnectWalletFooter i18nPrefix="my-new-tool" />
```

```svelte
<!-- step1-connect-sidebar.svelte -->
<script lang="ts">
	import { ConnectWalletSidebar } from '$lib/components/step/connect-wallet';
</script>

<ConnectWalletSidebar i18nPrefix="my-new-tool">
	<!-- Optional: custom content -->
	<div class="custom-hints">
		<p>Tool-specific information here</p>
	</div>
</ConnectWalletSidebar>
```

#### Step 2: Dependency Check (if needed)

```svelte
<!-- step2-check-content.svelte -->
<script lang="ts">
	import { DependencyCheckContent } from '$lib/components/step/dependency-check';
	import { myDependencyChecker } from '../stores/dependency-checker';
</script>

<DependencyCheckContent i18nPrefix="my-new-tool" dependencyChecker={myDependencyChecker} />
```

#### Token Selection Step

```svelte
<!-- step3-tokens-content.svelte -->
<script lang="ts">
	import { TokenSelectionContent } from '$lib/components/step/token-selection';
	import { step3State } from '../stores/step3-state.svelte';
	import { SvelteSet } from 'svelte/reactivity';

	function handleSelectionChange(newSelection: SvelteSet<string>) {
		step3State.selectedTokens = newSelection;
	}

	function handleTokenAdded(tokenId: string) {
		step3State.selectedTokens.add(tokenId);
	}

	function handleRemoveCustomToken(tokenId: string) {
		step3State.selectedTokens.delete(tokenId);
	}
</script>

<TokenSelectionContent
	i18nPrefix="my-new-tool"
	selectedTokenIds={step3State.selectedTokens}
	onSelectionChange={handleSelectionChange}
	onTokenAdded={handleTokenAdded}
	onRemoveCustomToken={handleRemoveCustomToken}
/>
```

### Creating Custom Step Components

For tool-specific steps:

```svelte
<!-- step4-custom-content.svelte -->
<script lang="ts">
	import StepContent from '$lib/components/step/step-content.svelte';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import { useI18n } from '@shelchin/i18n';

	const i18n = useI18n();
</script>

<StepContent>
	<StepContentHeader
		title={i18n.t('my-new-tool.step4.content.title')}
		description={i18n.t('my-new-tool.step4.content.description')}
	/>

	<!-- Your custom content here -->
</StepContent>
```

```svelte
<!-- step4-custom-footer.svelte -->
<script lang="ts">
	import { useStepManager } from '$lib/components/ui/step-context.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';
	import { step4State } from '../stores/step4-state.svelte';
	import { useI18n } from '@shelchin/i18n';

	const stepManager = useStepManager();
	const i18n = useI18n();

	const canContinue = $derived(step4State.isValid);

	function handleContinue() {
		if (canContinue) {
			stepManager.next();
		}
	}

	function handleBack() {
		stepManager.prev();
	}
</script>

<StepFooter
	showBack={true}
	onBack={handleBack}
	{canContinue}
	onContinue={handleContinue}
	hint={i18n.t('my-new-tool.step4.footer.hint')}
/>
```

### Step Component Index

Create an index file to export all step components:

```typescript
// ui/steps/index.ts
export { default as Step1ConnectContent } from './step1-connect-content.svelte';
export { default as Step1ConnectFooter } from './step1-connect-footer.svelte';
export { default as Step1ConnectSidebar } from './step1-connect-sidebar.svelte';
// ... more exports
```

## Step 4: Add i18n Translations

### en/routes/my-new-tool.json

```json
{
	"step1": {
		"content": {
			"title": "Connect Wallet",
			"description": "Connect your wallet to get started",
			"loading": "Loading..."
		},
		"footer": {
			"continue": "Continue",
			"hint": "Connect your wallet to continue"
		},
		"sidebar": {
			"title": "Connect Wallet",
			"description": "First, connect your wallet"
		}
	},
	"step2": {
		"content": {
			"title": "Step 2 Title",
			"description": "Step 2 description"
		}
	}
}
```

## Shared Components Reference

### ConnectWallet Components

| Component              | Props                                            | Description                             |
| ---------------------- | ------------------------------------------------ | --------------------------------------- |
| `ConnectWalletContent` | `i18nPrefix: string`                             | Main wallet connection UI               |
| `ConnectWalletFooter`  | `i18nPrefix: string`, `requiredChainId?: number` | Continue button, enabled when connected |
| `ConnectWalletSidebar` | `i18nPrefix?: string`, `children?: Snippet`      | Sidebar with optional custom content    |

### DependencyCheck Components

| Component                | Props                                                        | Description                   |
| ------------------------ | ------------------------------------------------------------ | ----------------------------- |
| `DependencyCheckContent` | `i18nPrefix: string`, `dependencyChecker: DependencyChecker` | Displays check results        |
| `DependencyCheckFooter`  | `i18nPrefix: string`, `dependencyChecker: DependencyChecker` | Continue when all checks pass |
| `DependencyCheckSidebar` | `i18nPrefix: string`, `dependencyChecker: DependencyChecker` | Shows check summary           |

### TokenSelection Components

| Component               | Props                                                       | Description                   |
| ----------------------- | ----------------------------------------------------------- | ----------------------------- |
| `TokenSelectionContent` | `i18nPrefix`, `selectedTokenIds`, `onSelectionChange`, etc. | Token multi-select UI         |
| `TokenSelectionFooter`  | `i18nPrefix: string`, `selectedCount: number`               | Continue when tokens selected |
| `TokenSelectionSidebar` | `i18nPrefix: string`, `selectedCount: number`               | Shows selection summary       |

## i18n Key Naming Convention

```
{tool-name}.step{N}.{area}.{key}

Areas:
- content: Main content area (title, description, etc.)
- footer: Footer area (continue, hint, etc.)
- sidebar: Sidebar area (title, description, etc.)

Examples:
- wallet-sweep.step1.content.title
- token-balance-scanner.step3.footer.hint
- contract-deployer.step2.sidebar.description
```

## Best Practices

1. **Use shared components** - Don't reinvent the wheel for common steps
2. **Keep state minimal** - Only store what's needed for the current step
3. **Use i18nPrefix pattern** - Consistent translation key naming
4. **Leverage $derived** - For computed values from state
5. **Test state modules** - Write unit tests for business logic
6. **Follow file naming** - `step{N}-{name}-{area}.svelte`

## Checklist

- [ ] Created route files (+page.svelte, +page.server.ts)
- [ ] Created state management stores
- [ ] Created step components (content, footer, sidebar)
- [ ] Added i18n translations (en + zh)
- [ ] Tested wallet connection flow
- [ ] Tested step navigation
- [ ] Verified build passes (`bun run check`)
