// Step 1: Connect Wallet
import Step1ConnectSidebar from './step1-connect-sidebar.svelte';
import Step1ConnectContent from './step1-connect-content.svelte';
import Step1ConnectFooter from './step1-connect-footer.svelte';

// Step 2: Dependency Check
import Step2ConfigureSidebar from './step2-configure-sidebar.svelte';
import Step2ConfigureContent from './step2-configure-content.svelte';
import Step2ConfigureFooter from './step2-configure-footer.svelte';

// Step 3: Select Tokens
import Step3TokensSidebar from './step3-tokens-sidebar.svelte';
import Step3TokensContent from './step3-tokens-content.svelte';
import Step3TokensFooter from './step3-tokens-footer.svelte';

// Step 4: Import Wallets
import Step4WalletsSidebar from './step4-wallets-sidebar.svelte';
import Step4WalletsContent from './step4-wallets-content.svelte';
import Step4WalletsFooter from './step4-wallets-footer.svelte';

// Step 5: Scan & Results
import Step5ScanResultsSidebar from './step5-scan-results-sidebar.svelte';
import Step5ScanResultsContent from './step5-scan-results-content.svelte';
import Step5ScanResultsFooter from './step5-scan-results-footer.svelte';

// Assembled step components mapping
export const stepComponents = {
	sidebar: [
		Step1ConnectSidebar,
		Step2ConfigureSidebar,
		Step3TokensSidebar,
		Step4WalletsSidebar,
		Step5ScanResultsSidebar
	],
	content: [
		Step1ConnectContent,
		Step2ConfigureContent,
		Step3TokensContent,
		Step4WalletsContent,
		Step5ScanResultsContent
	],
	footer: [
		Step1ConnectFooter,
		Step2ConfigureFooter,
		Step3TokensFooter,
		Step4WalletsFooter,
		Step5ScanResultsFooter
	]
} as const;
