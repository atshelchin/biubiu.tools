/**
 * Wallet Sweep Paywall Rule
 *
 * - Members: free (no transaction fee)
 * - Non-members: 0.005 ETH per transaction (collected in contract)
 */

import { createPayPerUseRule } from '$lib/paywall';

export const walletSweepPaywall = createPayPerUseRule(
	'wallet-sweep',
	0.005, // 0.005 ETH per transaction
	{
		feeInContract: true
	}
);
