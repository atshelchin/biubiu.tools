// Step 1: Connect Wallet
import Step1ConnectSidebar from './step1-connect-sidebar.svelte';
import Step1ConnectContent from './step1-connect-content.svelte';
import Step1ConnectFooter from './step1-connect-footer.svelte';

// Step 2: Configure
import Step2ConfigSidebar from './step2-config-sidebar.svelte';
import Step2ConfigContent from './step2-config-content.svelte';
import Step2ConfigFooter from './step2-config-footer.svelte';

// Step 3: Scan
import Step3ConfigSidebar from './step3-config-sidebar.svelte';
import Step3ConfigContent from './step3-config-content.svelte';
import Step3ConfigFooter from './step3-config-footer.svelte';

// Step 4: Results
import Step4ConfigSidebar from './step4-config-sidebar.svelte';
import Step4ConfigContent from './step4-config-content.svelte';
import Step4ConfigFooter from './step4-config-footer.svelte';

// Assembled step components mapping
export const stepComponents = {
	sidebar: [Step1ConnectSidebar, Step2ConfigSidebar, Step3ConfigSidebar, Step4ConfigSidebar],
	content: [Step1ConnectContent, Step2ConfigContent, Step3ConfigContent, Step4ConfigContent],
	footer: [Step1ConnectFooter, Step2ConfigFooter, Step3ConfigFooter, Step4ConfigFooter]
} as const;
