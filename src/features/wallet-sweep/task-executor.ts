/**
 * Token Sweep Task Executor
 *
 * 执行 Token 归集子任务（每个批次）
 */

import type { TaskExecutionContext } from '$lib/task-manager';
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
export async function executeSweepSubTask(ctx: TaskExecutionContext) {
	const data = ctx.subTask.data as unknown as SweepSubTaskData;

	try {
		// 检查是否暂停
		if (ctx.isPaused()) {
			await ctx.pauseTask('user', '用户暂停');
			return;
		}

		// 检查 Gas 余额（针对临时钱包模式）
		if (ctx.checkGasBalance) {
			const hasGas = await ctx.checkGasBalance();
			if (!hasGas) {
				await ctx.pauseTask('insufficient_gas', 'Gas 余额不足，请充值后继续');
				return;
			}
		}

		// 更新进度：准备阶段
		await ctx.updateProgress(5, '准备批次交易...');

		// 执行归集逻辑
		const results: SweepResult[] = [];
		const totalWallets = data.walletAddresses.length;

		// 从任务状态中获取已处理的索引（用于恢复）
		const startIndex = (ctx.task.state.lastProcessedIndex as number) || 0;

		for (let i = startIndex; i < totalWallets; i++) {
			const wallet = data.walletAddresses[i];

			// 检查是否暂停
			if (ctx.isPaused()) {
				// 保存当前进度
				await ctx.updateTaskState({
					lastProcessedIndex: i,
					processedResults: results
				});
				await ctx.pauseTask('user', '用户暂停');
				return;
			}

			// 更新进度
			const progress = 5 + Math.floor((i / totalWallets) * 90);
			await ctx.updateProgress(progress, `处理钱包 ${i + 1}/${totalWallets}...`);

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

			// 每处理 10 个钱包，保存一次进度
			if ((i + 1) % 10 === 0) {
				await ctx.updateTaskState({
					lastProcessedIndex: i,
					processedResults: results
				});
			}
		}

		// 检查结果
		const successCount = results.filter((r) => r.success).length;
		const failCount = results.filter((r) => !r.success).length;

		if (successCount === 0) {
			await ctx.failSubTask(`所有 ${totalWallets} 个钱包转账均失败`);
		} else {
			await ctx.updateProgress(100, `完成：${successCount} 成功，${failCount} 失败`);
			await ctx.completeSubTask({
				results,
				successCount,
				failCount,
				totalCount: totalWallets
			});
		}
	} catch (error) {
		await ctx.failSubTask(error instanceof Error ? error.message : String(error));
	}
}

/**
 * 模拟转账（临时实现）
 * TODO: 替换为实际的转账逻辑
 */
async function simulateTransfer(params: {
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
