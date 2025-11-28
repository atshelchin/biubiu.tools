// Step 1 - Connect Wallet
import Step1ConnectSidebar from './step1-connect-sidebar.svelte';
import Step1ConnectContent from './step1-connect-content.svelte';
import Step1ConnectFooter from './step1-connect-footer.svelte';

// Step 2 - Check Dependencies
import Step2CheckDepsSidebar from './step2-check-deps-sidebar.svelte';
import Step2CheckDepsContent from './step2-check-deps-content.svelte';
import Step2CheckDepsFooter from './step2-check-deps-footer.svelte';

// Step 3 - Deploy Contract
import Step3DeploySidebar from './step3-deploy-sidebar.svelte';
import Step3DeployContent from './step3-deploy-content.svelte';
import Step3DeployFooter from './step3-deploy-footer.svelte';

// Assembled step components mapping
export const stepComponents = {
	sidebar: [Step1ConnectSidebar, Step2CheckDepsSidebar, Step3DeploySidebar],
	content: [Step1ConnectContent, Step2CheckDepsContent, Step3DeployContent],
	footer: [Step1ConnectFooter, Step2CheckDepsFooter, Step3DeployFooter]
} as const;

// Also export individually for backwards compatibility
export {
	Step1ConnectSidebar,
	Step1ConnectContent,
	Step1ConnectFooter,
	Step2CheckDepsSidebar,
	Step2CheckDepsContent,
	Step2CheckDepsFooter,
	Step3DeploySidebar,
	Step3DeployContent,
	Step3DeployFooter
};
