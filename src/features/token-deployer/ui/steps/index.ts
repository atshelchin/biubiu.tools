// Step 1 - Connect Wallet
import Step1ConnectSidebar from './step1-connect-sidebar.svelte';
import Step1ConnectContent from './step1-connect-content.svelte';
import Step1ConnectFooter from './step1-connect-footer.svelte';

// Step 2 - Basic Token Info
import Step2ConfigSidebar from './step2-config-sidebar.svelte';
import Step2ConfigContent from './step2-config-content.svelte';
import Step2ConfigFooter from './step2-config-footer.svelte';

// Step 3 - Advanced Parameters
import Step3ParamsSidebar from './step3-params-sidebar.svelte';
import Step3ParamsContent from './step3-params-content.svelte';
import Step3ParamsFooter from './step3-params-footer.svelte';

// Step 4 - Review & Deploy
import Step4DeploySidebar from './step4-deploy-sidebar.svelte';
import Step4DeployContent from './step4-deploy-content.svelte';
import Step4DeployFooter from './step4-deploy-footer.svelte';

// Assembled step components mapping
export const stepComponents = {
	sidebar: [Step1ConnectSidebar, Step2ConfigSidebar, Step3ParamsSidebar, Step4DeploySidebar],
	content: [Step1ConnectContent, Step2ConfigContent, Step3ParamsContent, Step4DeployContent],
	footer: [Step1ConnectFooter, Step2ConfigFooter, Step3ParamsFooter, Step4DeployFooter]
} as const;

// Individual exports for backward compatibility
export {
	Step1ConnectSidebar,
	Step1ConnectContent,
	Step1ConnectFooter,
	Step2ConfigSidebar,
	Step2ConfigContent,
	Step2ConfigFooter,
	Step3ParamsSidebar,
	Step3ParamsContent,
	Step3ParamsFooter,
	Step4DeploySidebar,
	Step4DeployContent,
	Step4DeployFooter
};
