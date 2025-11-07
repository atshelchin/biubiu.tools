// Step 1 - Input Source Configuration
import Step1InputSidebar from './step1-input-sidebar.svelte';
import Step1InputContent from './step1-input-content.svelte';
import Step1InputFooter from './step1-input-footer.svelte';

// Step 2 - HD Path Configuration
import Step2HdpathSidebar from './step2-hdpath-sidebar.svelte';
import Step2HdpathContent from './step2-hdpath-content.svelte';
import Step2HdpathFooter from './step2-hdpath-footer.svelte';

// Step 3 - Generation Configuration
import Step3GenerateSidebar from './step3-generate-sidebar.svelte';
import Step3GenerateContent from './step3-generate-content.svelte';
import Step3GenerateFooter from './step3-generate-footer.svelte';

// Step 4 - Results and Export
import Step4ResultsSidebar from './step4-results-sidebar.svelte';
import Step4ResultsContent from './step4-results-content.svelte';
import Step4ResultsFooter from './step4-results-footer.svelte';

// Assembled step components mapping
export const stepComponents = {
	sidebar: [Step1InputSidebar, Step2HdpathSidebar, Step3GenerateSidebar, Step4ResultsSidebar],
	content: [Step1InputContent, Step2HdpathContent, Step3GenerateContent, Step4ResultsContent],
	footer: [Step1InputFooter, Step2HdpathFooter, Step3GenerateFooter, Step4ResultsFooter]
} as const;

// Individual exports for backward compatibility
export {
	Step1InputSidebar,
	Step1InputContent,
	Step1InputFooter,
	Step2HdpathSidebar,
	Step2HdpathContent,
	Step2HdpathFooter,
	Step3GenerateSidebar,
	Step3GenerateContent,
	Step3GenerateFooter,
	Step4ResultsSidebar,
	Step4ResultsContent,
	Step4ResultsFooter
};
