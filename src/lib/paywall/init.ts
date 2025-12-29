/**
 * Paywall Initialization for BiuBiu Tools
 *
 * This file initializes the paywall package with app-specific configuration.
 * Import this file early in your app's lifecycle (e.g., in +layout.svelte).
 */

import type { Abi } from 'viem';
import { initPaywall } from '@shelchin/paywall';
import { BIUBIU_PREMIUM_CONTRACT, SELF_HOSTED_MODE } from './constants';
import BiuBiuPremiumABI from '../../../static/contracts/BiuBiuPremium.json';

// Initialize paywall with BiuBiu-specific configuration
initPaywall({
	contract: {
		address: BIUBIU_PREMIUM_CONTRACT,
		abi: BiuBiuPremiumABI.abi as Abi,
		functionName: 'getSubscriptionInfo'
	},
	cache: {
		membershipKeyPrefix: 'biubiu-membership',
		usageKeyPrefix: 'biubiu-usage',
		checksumSalt: 'biubiu-paywall-v1'
	},
	selfHostedMode: SELF_HOSTED_MODE
});

export { BIUBIU_PREMIUM_CONTRACT, SELF_HOSTED_MODE };
