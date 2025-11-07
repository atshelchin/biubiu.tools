// Step 1: Connect Wallet
import Step1ConnectSidebar from './step1-connect-sidebar.svelte';
import Step1ConnectContent from './step1-connect-content.svelte';
import Step1ConnectFooter from './step1-connect-footer.svelte';

// Step 2: Configure Contract
import Step2ConfigureSidebar from './step2-configure-sidebar.svelte';
import Step2ConfigureContent from './step2-configure-content.svelte';
import Step2ConfigureFooter from './step2-configure-footer.svelte';

// Step 3: Set Time Range
import Step3TimeRangeSidebar from './step3-timerange-sidebar.svelte';
import Step3TimeRangeContent from './step3-timerange-content.svelte';
import Step3TimeRangeFooter from './step3-timerange-footer.svelte';

// Step 4: Scan Events
import Step4ScanSidebar from './step4-scan-sidebar.svelte';
import Step4ScanContent from './step4-scan-content.svelte';
import Step4ScanFooter from './step4-scan-footer.svelte';

// Step 5: View Results
import Step5ResultsSidebar from './step5-results-sidebar.svelte';
import Step5ResultsContent from './step5-results-content.svelte';
import Step5ResultsFooter from './step5-results-footer.svelte';

export const stepComponents = {
	sidebar: [
		Step1ConnectSidebar,
		Step2ConfigureSidebar,
		Step3TimeRangeSidebar,
		Step4ScanSidebar,
		Step5ResultsSidebar
	],
	content: [
		Step1ConnectContent,
		Step2ConfigureContent,
		Step3TimeRangeContent,
		Step4ScanContent,
		Step5ResultsContent
	],
	footer: [
		Step1ConnectFooter,
		Step2ConfigureFooter,
		Step3TimeRangeFooter,
		Step4ScanFooter,
		Step5ResultsFooter
	]
} as const;

export {
	Step1ConnectSidebar,
	Step1ConnectContent,
	Step1ConnectFooter,
	Step2ConfigureSidebar,
	Step2ConfigureContent,
	Step2ConfigureFooter,
	Step3TimeRangeSidebar,
	Step3TimeRangeContent,
	Step3TimeRangeFooter,
	Step4ScanSidebar,
	Step4ScanContent,
	Step4ScanFooter,
	Step5ResultsSidebar,
	Step5ResultsContent,
	Step5ResultsFooter
};
