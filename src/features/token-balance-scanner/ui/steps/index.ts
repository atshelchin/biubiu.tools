import type { StepComponents } from '$lib/types/step-based-app';

// Step 1: Connect Wallet
import Step1ConnectSidebar from './step1-connect-sidebar.svelte';
import Step1ConnectContent from './step1-connect-content.svelte';
import Step1ConnectFooter from './step1-connect-footer.svelte';

// Step 2: Select Tokens
import Step2TokensSidebar from './step2-tokens-sidebar.svelte';
import Step2TokensContent from './step2-tokens-content.svelte';
import Step2TokensFooter from './step2-tokens-footer.svelte';

// Step 3: Import Wallets
import Step3WalletsSidebar from './step3-wallets-sidebar.svelte';
import Step3WalletsContent from './step3-wallets-content.svelte';
import Step3WalletsFooter from './step3-wallets-footer.svelte';

// Step 4: Scan Balances
import Step4ScanSidebar from './step4-scan-sidebar.svelte';
import Step4ScanContent from './step4-scan-content.svelte';
import Step4ScanFooter from './step4-scan-footer.svelte';

// Step 5: View Results
import Step5ResultsSidebar from './step5-results-sidebar.svelte';
import Step5ResultsContent from './step5-results-content.svelte';
import Step5ResultsFooter from './step5-results-footer.svelte';

export const stepComponents: StepComponents = {
	1: {
		sidebar: Step1ConnectSidebar,
		content: Step1ConnectContent,
		footer: Step1ConnectFooter
	},
	2: {
		sidebar: Step2TokensSidebar,
		content: Step2TokensContent,
		footer: Step2TokensFooter
	},
	3: {
		sidebar: Step3WalletsSidebar,
		content: Step3WalletsContent,
		footer: Step3WalletsFooter
	},
	4: {
		sidebar: Step4ScanSidebar,
		content: Step4ScanContent,
		footer: Step4ScanFooter
	},
	5: {
		sidebar: Step5ResultsSidebar,
		content: Step5ResultsContent,
		footer: Step5ResultsFooter
	}
};
