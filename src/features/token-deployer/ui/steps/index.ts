// Step 1 - Connect Wallet
import Step1ConnectSidebar from './step1-connect-sidebar.svelte';
import Step1ConnectContent from './step1-connect-content.svelte';
import Step1ConnectFooter from './step1-connect-footer.svelte';

// Step 2 - Check Dependencies
import Step2CheckDepsSidebar from './step2-check-deps-sidebar.svelte';
import Step2CheckDepsContent from './step2-check-deps-content.svelte';
import Step2CheckDepsFooter from './step2-check-deps-footer.svelte';

// Step 3 - Basic Token Info
import Step3ConfigSidebar from './step3-config-sidebar.svelte';
import Step3ConfigContent from './step3-config-content.svelte';
import Step3ConfigFooter from './step3-config-footer.svelte';

// Step 4 - Review & Deploy
import Step4DeploySidebar from './step4-deploy-sidebar.svelte';
import Step4DeployContent from './step4-deploy-content.svelte';
import Step4DeployFooter from './step4-deploy-footer.svelte';

// Assembled step components mapping
export const stepComponents = {
	sidebar: [Step1ConnectSidebar, Step2CheckDepsSidebar, Step3ConfigSidebar, Step4DeploySidebar],
	content: [Step1ConnectContent, Step2CheckDepsContent, Step3ConfigContent, Step4DeployContent],
	footer: [Step1ConnectFooter, Step2CheckDepsFooter, Step3ConfigFooter, Step4DeployFooter]
} as const;

// Individual exports for backward compatibility
export {
	Step1ConnectSidebar,
	Step1ConnectContent,
	Step1ConnectFooter,
	Step2CheckDepsSidebar,
	Step2CheckDepsContent,
	Step2CheckDepsFooter,
	Step3ConfigSidebar,
	Step3ConfigContent,
	Step3ConfigFooter,
	Step4DeploySidebar,
	Step4DeployContent,
	Step4DeployFooter
};
