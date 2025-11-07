// Step 1: Connect Wallet
import Step1ConnectSidebar from './step1-sidebar.svelte';
import Step1ConnectContent from './step1-content.svelte';
import Step1ConnectFooter from './step1-footer.svelte';

// Step 2: Configure Contract
import Step2ConfigureSidebar from './step2-sidebar.svelte';
import Step2ConfigureContent from './step2-content.svelte';
import Step2ConfigureFooter from './step2-footer.svelte';

// Step 3: Set Time Range
import Step3TimeRangeSidebar from './step3-sidebar.svelte';
import Step3TimeRangeContent from './step3-content.svelte';
import Step3TimeRangeFooter from './step3-footer.svelte';

// Step 4: Scan Events
import Step4ScanSidebar from './step4-sidebar.svelte';
import Step4ScanContent from './step4-content.svelte';
import Step4ScanFooter from './step4-footer.svelte';

// Step 5: View Results
import Step5ResultsSidebar from './step5-sidebar.svelte';
import Step5ResultsContent from './step5-content.svelte';
import Step5ResultsFooter from './step5-footer.svelte';

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
