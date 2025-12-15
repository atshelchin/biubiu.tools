// Step 1 - Connect Wallet
import Step1ConnectSidebar from './step1-connect-sidebar.svelte';
import Step1ConnectContent from './step1-connect-content.svelte';
import Step1ConnectFooter from './step1-connect-footer.svelte';

// Step 2 - Configure/Check Dependencies
import Step2ConfigureSidebar from './step2-configure-sidebar.svelte';
import Step2ConfigureContent from './step2-configure-content.svelte';
import Step2ConfigureFooter from './step2-configure-footer.svelte';

// Step 3 - Select Tokens
import Step3SelectTokensSidebar from './step3-select-tokens-sidebar.svelte';
import Step3SelectTokensContent from './step3-select-tokens-content.svelte';
import Step3SelectTokensFooter from './step3-select-tokens-footer.svelte';

// Step 4 - Import Wallets
import Step4ImportWalletsSidebar from './step4-import-wallets-sidebar.svelte';
import Step4ImportWalletsContent from './step4-import-wallets-content.svelte';
import Step4ImportWalletsFooter from './step4-import-wallets-footer.svelte';

// Step 5 - Confirm & Execute Sweep
import Step5ConfirmSweepSidebar from './step5-confirm-sweep-sidebar.svelte';
import Step5ConfirmSweepContent from './step5-confirm-sweep-content.svelte';
import Step5ConfirmSweepFooter from './step5-confirm-sweep-footer.svelte';

// 组装好的步骤组件映射
export const stepComponents = {
	sidebar: [
		Step1ConnectSidebar,
		Step2ConfigureSidebar,
		Step3SelectTokensSidebar,
		Step4ImportWalletsSidebar,
		Step5ConfirmSweepSidebar
	],
	content: [
		Step1ConnectContent,
		Step2ConfigureContent,
		Step3SelectTokensContent,
		Step4ImportWalletsContent,
		Step5ConfirmSweepContent
	],
	footer: [
		Step1ConnectFooter,
		Step2ConfigureFooter,
		Step3SelectTokensFooter,
		Step4ImportWalletsFooter,
		Step5ConfirmSweepFooter
	]
} as const;

// 也可以单独导出，保持向后兼容
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
	Step5ConfirmSweepSidebar,
	Step5ConfirmSweepContent,
	Step5ConfirmSweepFooter
};
