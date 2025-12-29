// Step 1 - Connect Wallet
import Step1ConnectSidebar from './step1-connect-sidebar.svelte';
import Step1ConnectContent from './step1-connect-content.svelte';
import Step1ConnectFooter from './step1-connect-footer.svelte';

// Step 2 - Configure Contract
import Step2ContractSidebar from './step2-contract-sidebar.svelte';
import Step2ContractContent from './step2-contract-content.svelte';
import Step2ContractFooter from './step2-contract-footer.svelte';

// Step 3 - Execute Calls
import Step3ExecuteSidebar from './step3-execute-sidebar.svelte';
import Step3ExecuteContent from './step3-execute-content.svelte';
import Step3ExecuteFooter from './step3-execute-footer.svelte';

// Assembled step components mapping
export const stepComponents = {
	sidebar: [Step1ConnectSidebar, Step2ContractSidebar, Step3ExecuteSidebar],
	content: [Step1ConnectContent, Step2ContractContent, Step3ExecuteContent],
	footer: [Step1ConnectFooter, Step2ContractFooter, Step3ExecuteFooter]
} as const;

// Individual exports for backward compatibility
export {
	Step1ConnectSidebar,
	Step1ConnectContent,
	Step1ConnectFooter,
	Step2ContractSidebar,
	Step2ContractContent,
	Step2ContractFooter,
	Step3ExecuteSidebar,
	Step3ExecuteContent,
	Step3ExecuteFooter
};
