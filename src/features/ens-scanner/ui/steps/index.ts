// Step 1: Connect Wallet
import Step1ConnectSidebar from './step1-connect-sidebar.svelte';
import Step1ConnectContent from './step1-connect-content.svelte';
import Step1ConnectFooter from './step1-connect-footer.svelte';

// Step 2: Generate/Import Names
import Step2NamesSidebar from './step2-names-sidebar.svelte';
import Step2NamesContent from './step2-names-content.svelte';
import Step2NamesFooter from './step2-names-footer.svelte';

// Step 3: Scan Names
import Step3ScanSidebar from './step3-scan-sidebar.svelte';
import Step3ScanContent from './step3-scan-content.svelte';
import Step3ScanFooter from './step3-scan-footer.svelte';

// Step 4: View Results
import Step4ResultsSidebar from './step4-results-sidebar.svelte';
import Step4ResultsContent from './step4-results-content.svelte';
import Step4ResultsFooter from './step4-results-footer.svelte';

// Assembled step components mapping
export const stepComponents = {
	sidebar: [Step1ConnectSidebar, Step2NamesSidebar, Step3ScanSidebar, Step4ResultsSidebar],
	content: [Step1ConnectContent, Step2NamesContent, Step3ScanContent, Step4ResultsContent],
	footer: [Step1ConnectFooter, Step2NamesFooter, Step3ScanFooter, Step4ResultsFooter]
} as const;
