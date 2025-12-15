/**
 * Token Sweep Task Executor - Tree Structure Version
 *
 * 执行 Token 归集叶子任务（每个批次）
 */

import type { TaskExecutionContext, TaskExecutorRegistry } from '$lib/task-manager/types.v2';
import type { Address } from 'viem';

/**
 * 批次执行数据
 */
export interface SweepBatchData extends Record<string, unknown> {
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

/**
 * 归集结果
 */
export interface SweepResult {
	wallet: Address;
	hash?: string;
	success: boolean;
	error?: string;
	amount?: string;
}

/**
 * Token Sweep 执行器注册表
 */
export const tokenSweepExecutors: TaskExecutorRegistry = {
	/**
	 * 执行单个批次的归集
	 */
	sweepBatch: async (ctx: TaskExecutionContext) => {
		const data = ctx.task.executionData as unknown as SweepBatchData;

		try {
			// 检查是否暂停
			if (ctx.isPaused()) {
				await ctx.pauseRoot('user', '用户暂停');
				return;
			}

			// 检查 Gas 余额（针对临时钱包模式）
			if (ctx.checkGasBalance) {
				const hasGas = await ctx.checkGasBalance();
				if (!hasGas) {
					await ctx.pauseRoot('insufficient_gas', 'Gas 余额不足，请充值后继续');
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
					await ctx.pauseRoot('user', '用户暂停');
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
				await ctx.failTask(`所有 ${totalWallets} 个钱包转账均失败`);
			} else {
				await ctx.updateProgress(100, `完成：${successCount} 成功，${failCount} 失败`);
				await ctx.completeTask({
					results,
					successCount,
					failCount,
					totalCount: totalWallets
				});
			}
		} catch (error) {
			await ctx.failTask(error instanceof Error ? error.message : String(error));
		}
	}
};

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

/**
 * 构建 Token Sweep 任务树
 *
 * 帮助函数，用于从归集配置创建任务树
 */
export interface TokenSweepConfig {
	network: string;
	targetAddress: Address;
	tokens: {
		id: string;
		symbol: string;
		address?: Address;
		decimals: number;
		isNative: boolean;
		wallets: Address[];
	}[];
	batchSize?: number;
}

export function buildTokenSweepTaskTree(config: TokenSweepConfig) {
	const batchSize = config.batchSize || 100;

	return {
		type: 'wallet-sweep' as const,
		name: `归集 ${config.tokens.length} 个代币`,
		config: {
			network: config.network,
			targetAddress: config.targetAddress
		},

		// 为每个代币创建一个子任务
		children: config.tokens.map((token) => {
			// 计算批次数
			const batchCount = Math.ceil(token.wallets.length / batchSize);
			const batches = [];

			// 为每个批次创建一个叶子任务
			for (let i = 0; i < batchCount; i++) {
				const start = i * batchSize;
				const end = Math.min((i + 1) * batchSize, token.wallets.length);
				const batchWallets = token.wallets.slice(start, end);

				batches.push({
					type: 'batch' as const,
					name: `批次 ${i + 1} (钱包 ${start + 1}-${end})`,
					executionData: {
						tokenId: token.id,
						tokenSymbol: token.symbol,
						tokenAddress: token.address,
						tokenDecimals: token.decimals,
						walletAddresses: batchWallets,
						targetAddress: config.targetAddress,
						batchNumber: i + 1,
						totalBatches: batchCount,
						isNative: token.isNative,
						network: config.network
					} as SweepBatchData,
					executor: 'sweepBatch',
					maxAttempts: 3
				});
			}

			return {
				type: 'token' as const,
				name: `${token.symbol} 归集 (${token.wallets.length} 个钱包)`,
				children: batches
			};
		})
	};
}
