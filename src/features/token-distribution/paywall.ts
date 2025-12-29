/**
 * Token Distribution (Batch Transfer) Paywall Rule
 *
 * - Members: unlimited free access
 * - Non-members: 10 addresses per day free, then pay per use
 */

import { createHybridRule } from '$lib/paywall';

export const batchTransferPaywall = createHybridRule('batch-transfer', {
	freeQuota: {
		daily: 10,
		countBy: 'items'
	},
	perUseFee: 0.003, // 0.003 ETH per address
	feeInContract: true
});
