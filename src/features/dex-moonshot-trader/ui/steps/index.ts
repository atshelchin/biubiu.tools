// Step 1 - Connect Wallet
import Step1ConnectSidebar from './step1-connect-sidebar.svelte';
import Step1ConnectContent from './step1-connect-content.svelte';
import Step1ConnectFooter from './step1-connect-footer.svelte';

// Step 2 - Token Input
import Step2TokenSidebar from './step2-token-sidebar.svelte';
import Step2TokenContent from './step2-token-content.svelte';
import Step2TokenFooter from './step2-token-footer.svelte';

// Step 3 - Trade
import Step3TradeSidebar from './step3-trade-sidebar.svelte';
import Step3TradeContent from './step3-trade-content.svelte';
import Step3TradeFooter from './step3-trade-footer.svelte';

// Assembled step components mapping
export const stepComponents = {
	sidebar: [Step1ConnectSidebar, Step2TokenSidebar, Step3TradeSidebar],
	content: [Step1ConnectContent, Step2TokenContent, Step3TradeContent],
	footer: [Step1ConnectFooter, Step2TokenFooter, Step3TradeFooter]
} as const;

// Individual exports for backward compatibility
export {
	Step1ConnectSidebar,
	Step1ConnectContent,
	Step1ConnectFooter,
	Step2TokenSidebar,
	Step2TokenContent,
	Step2TokenFooter,
	Step3TradeSidebar,
	Step3TradeContent,
	Step3TradeFooter
};
