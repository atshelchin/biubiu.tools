// Step 1 - Connect Wallet
import Step1ConnectSidebar from './step1-connect-sidebar.svelte';
import Step1ConnectContent from './step1-connect-content.svelte';
import Step1ConnectFooter from './step1-connect-footer.svelte';

// Step 2 - Select NFT Standard
import Step2SelectStandardSidebar from './step2-select-standard-sidebar.svelte';
import Step2SelectStandardContent from './step2-select-standard-content.svelte';
import Step2SelectStandardFooter from './step2-select-standard-footer.svelte';

// Step 3 - Configure NFT Basics
import Step3ConfigureBasicsSidebar from './step3-configure-basics-sidebar.svelte';
import Step3ConfigureBasicsContent from './step3-configure-basics-content.svelte';
import Step3ConfigureBasicsFooter from './step3-configure-basics-footer.svelte';

// Step 4 - Configure Advanced Settings
import Step4ConfigureSettingsSidebar from './step4-configure-settings-sidebar.svelte';
import Step4ConfigureSettingsContent from './step4-configure-settings-content.svelte';
import Step4ConfigureSettingsFooter from './step4-configure-settings-footer.svelte';

// Step 5 - Review & Deploy
import Step5ReviewDeploySidebar from './step5-review-deploy-sidebar.svelte';
import Step5ReviewDeployContent from './step5-review-deploy-content.svelte';
import Step5ReviewDeployFooter from './step5-review-deploy-footer.svelte';

// Assembled step components mapping
export const stepComponents = {
	sidebar: [
		Step1ConnectSidebar,
		Step2SelectStandardSidebar,
		Step3ConfigureBasicsSidebar,
		Step4ConfigureSettingsSidebar,
		Step5ReviewDeploySidebar
	],
	content: [
		Step1ConnectContent,
		Step2SelectStandardContent,
		Step3ConfigureBasicsContent,
		Step4ConfigureSettingsContent,
		Step5ReviewDeployContent
	],
	footer: [
		Step1ConnectFooter,
		Step2SelectStandardFooter,
		Step3ConfigureBasicsFooter,
		Step4ConfigureSettingsFooter,
		Step5ReviewDeployFooter
	]
} as const;

// Individual exports for backward compatibility
export {
	Step1ConnectSidebar,
	Step1ConnectContent,
	Step1ConnectFooter,
	Step2SelectStandardSidebar,
	Step2SelectStandardContent,
	Step2SelectStandardFooter,
	Step3ConfigureBasicsSidebar,
	Step3ConfigureBasicsContent,
	Step3ConfigureBasicsFooter,
	Step4ConfigureSettingsSidebar,
	Step4ConfigureSettingsContent,
	Step4ConfigureSettingsFooter,
	Step5ReviewDeploySidebar,
	Step5ReviewDeployContent,
	Step5ReviewDeployFooter
};
