// Step 1 - Connect Wallet
import Step1ConnectSidebar from './step1-connect-sidebar.svelte';
import Step1ConnectContent from './step1-connect-content.svelte';
import Step1ConnectFooter from './step1-connect-footer.svelte';

// Step 2 - Configure Source Wallet
import Step2ConfigureSidebar from './step2-configure-sidebar.svelte';
import Step2ConfigureContent from './step2-configure-content.svelte';
import Step2ConfigureFooter from './step2-configure-footer.svelte';

// Step 3 - Select Token & Amount
import Step3SelectTokensSidebar from './step3-select-tokens-sidebar.svelte';
import Step3SelectTokensContent from './step3-select-tokens-content.svelte';
import Step3SelectTokensFooter from './step3-select-tokens-footer.svelte';

// Step 4 - Import Recipients
import Step4ImportWalletsSidebar from './step4-import-wallets-sidebar.svelte';
import Step4ImportWalletsContent from './step4-import-wallets-content.svelte';
import Step4ImportWalletsFooter from './step4-import-wallets-footer.svelte';

// Step 5 - Review & Execute Distribution
import Step5ConfirmDistributionSidebar from './step5-confirm-distribution-sidebar.svelte';
import Step5ConfirmDistributionContent from './step5-confirm-distribution-content.svelte';
import Step5ConfirmDistributionFooter from './step5-confirm-distribution-footer.svelte';

// Assembled step components mapping
export const stepComponents = {
	sidebar: [
		Step1ConnectSidebar,
		Step2ConfigureSidebar,
		Step3SelectTokensSidebar,
		Step4ImportWalletsSidebar,
		Step5ConfirmDistributionSidebar
	],
	content: [
		Step1ConnectContent,
		Step2ConfigureContent,
		Step3SelectTokensContent,
		Step4ImportWalletsContent,
		Step5ConfirmDistributionContent
	],
	footer: [
		Step1ConnectFooter,
		Step2ConfigureFooter,
		Step3SelectTokensFooter,
		Step4ImportWalletsFooter,
		Step5ConfirmDistributionFooter
	]
} as const;

// Individual exports for backward compatibility
export {
	Step1ConnectSidebar,
	Step1ConnectContent,
	Step1ConnectFooter,
	Step2ConfigureSidebar,
	Step2ConfigureContent,
	Step2ConfigureFooter,
	Step3SelectTokensSidebar,
	Step3SelectTokensContent,
	Step3SelectTokensFooter,
	Step4ImportWalletsSidebar,
	Step4ImportWalletsContent,
	Step4ImportWalletsFooter,
	Step5ConfirmDistributionSidebar,
	Step5ConfirmDistributionContent,
	Step5ConfirmDistributionFooter
};
