/**
 * Token Balance Scanner Paywall Rule
 *
 * - Members: unlimited access
 * - Non-members: 1000 addresses per day free
 */

import { createMembershipOnlyRule } from '$lib/paywall';

export const balanceScannerPaywall = createMembershipOnlyRule(
	'balance-scanner',
	{
		daily: 1000,
		countBy: 'items'
	},
	{
		quotaExceededMessage: '今日免费额度已用完 (1000 地址/天)',
		message: '升级会员可无限扫描'
	}
);
