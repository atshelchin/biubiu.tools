/**
 * Token Sweep Task Executor
 *
 * 执行 Token 归集子任务（每个批次）
 */

import type { ExecutionContext } from '@shelchin/task-manager';
import type { Address } from 'viem';

export interface SweepSubTaskData {
	name: string;
	tokenId: string;
	tokenSymbol: string;
	tokenAddress?: Address;
	tokenDecimals: number;
	walletAddresses: Address[];
	targetAddress: Address;
	batchNumber: number;
	totalBatches: number;
	isNative: boolean;
	network: string;
}

export interface SweepResult {
	wallet: Address;
	hash?: string;
	success: boolean;
	error?: string;
	amount?: string;
}

/**
 * 执行单个归集批次
 */
export async function executeSweepSubTask(ctx: ExecutionContext<SweepSubTaskData>) {
	const data = ctx.data;

	try {
		// 检查是否暂停
		if (ctx.isPaused()) {
			await ctx.pauseTask('用户暂停');
			return;
		}

		// 更新进度：准备阶段
		await ctx.progress(5);

		// 执行归集逻辑
		const results: SweepResult[] = [];
		const totalWallets = data.walletAddresses.length;

		for (let i = 0; i < totalWallets; i++) {
			const wallet = data.walletAddresses[i];

			// 检查是否暂停
			if (ctx.isPaused()) {
				await ctx.pauseTask('用户暂停');
				return;
			}

			// 更新进度
			const progressPct = 5 + Math.floor((i / totalWallets) * 90);
			await ctx.progress(progressPct);

			try {
				// TODO: 实现实际的转账逻辑
				// 这里需要根据 transactionMode 使用不同的签名方式
				// - 'wallet': 使用已连接的钱包签名
				// - 'temporary': 使用临时钱包签名
				// - 'private-key': 使用导入的私钥签名

				// 模拟转账（实际实现需要调用合约）
				const hash = await simulateTransfer({
					from: wallet,
					to: data.targetAddress,
					tokenAddress: data.tokenAddress,
					isNative: data.isNative
				});

				results.push({
					wallet,
					hash,
					success: true,
					amount: '0' // TODO: 实际金额
				});
			} catch (error) {
				// 记录失败，但继续处理下一个钱包
				results.push({
					wallet,
					error: error instanceof Error ? error.message : String(error),
					success: false
				});
			}
		}

		// 检查结果
		const successCount = results.filter((r) => r.success).length;
		const failCount = results.filter((r) => !r.success).length;

		if (successCount === 0) {
			await ctx.fail(`所有 ${totalWallets} 个钱包转账均失败`);
		} else {
			await ctx.progress(100);
			await ctx.complete({
				results,
				successCount,
				failCount,
				totalCount: totalWallets
			});
		}
	} catch (error) {
		await ctx.fail(error instanceof Error ? error.message : String(error));
	}
}

/**
 * 模拟转账（临时实现）
 * TODO: 替换为实际的转账逻辑
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function simulateTransfer(_params: {
	from: Address;
	to: Address;
	tokenAddress?: Address;
	isNative: boolean;
}): Promise<string> {
	// 模拟网络延迟
	await new Promise((resolve) => setTimeout(resolve, 100));

	// 模拟 10% 失败率
	if (Math.random() < 0.1) {
		throw new Error('转账失败：余额不足');
	}

	// 返回模拟的交易哈希
	return `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`;
}
