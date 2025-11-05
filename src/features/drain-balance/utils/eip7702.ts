import { encodeFunctionData, keccak256, encodeAbiParameters, type Address, type Hex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import type { Network, Token, ExecutionResult } from '../types';

// 批量转账合约地址（需要根据网络部署）
const BATCH_DRAINER_ADDRESS = '0x9B4A25AE6aC6C5d5dc101dD69E6a66F59127891c' as Address;

// 批量转账合约 ABI
const BATCH_DRAINER_ABI = [
	{
		inputs: [
			{ internalType: 'address', name: 'recipient', type: 'address' },
			{ internalType: 'address[]', name: 'tokens', type: 'address[]' },
			{ internalType: 'uint256', name: 'deadline', type: 'uint256' },
			{ internalType: 'uint8', name: 'v', type: 'uint8' },
			{ internalType: 'bytes32', name: 'r', type: 'bytes32' },
			{ internalType: 'bytes32', name: 's', type: 'bytes32' }
		],
		name: 'drainToAddress',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				components: [
					{ internalType: 'address', name: 'wallet', type: 'address' },
					{ internalType: 'uint8', name: 'v', type: 'uint8' },
					{ internalType: 'bytes32', name: 'r', type: 'bytes32' },
					{ internalType: 'bytes32', name: 's', type: 'bytes32' }
				],
				internalType: 'struct Wallet[]',
				name: 'wallets',
				type: 'tuple[]'
			},
			{ internalType: 'address', name: 'recipient', type: 'address' },
			{ internalType: 'address[]', name: 'tokens', type: 'address[]' },
			{ internalType: 'uint256', name: 'deadline', type: 'uint256' }
		],
		name: 'multicall',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	}
] as const;

export interface TransactionBatch {
	batchId: number;
	privateKeys: string[];
	addresses: Address[];
	calldata: Hex;
	authorizations: Array<{
		chainId: bigint;
		address: Address;
		nonce: bigint;
		r: Hex;
		s: Hex;
		v: bigint;
	}>;
}

// 构造 EIP-7702 授权签名
async function createAuthorization(privateKey: string, chainId: number, nonce: bigint = 0n) {
	const account = privateKeyToAccount(privateKey as Hex);

	// 按照 EIP-7702 规范构造消息
	const message = keccak256(
		encodeAbiParameters(
			[
				{ type: 'uint64', name: 'chainId' },
				{ type: 'address', name: 'address' },
				{ type: 'uint64', name: 'nonce' }
			],
			[BigInt(chainId), BATCH_DRAINER_ADDRESS, nonce]
		)
	);

	// 使用账户签名消息
	const signature = await account.signMessage({
		message: { raw: message }
	});

	// 解析签名
	const { v, r, s } = parseSignature(signature);

	return {
		chainId: BigInt(chainId),
		address: BATCH_DRAINER_ADDRESS,
		nonce,
		r,
		s,
		v
	};
}

// 分批处理私钥（每批最多100个）
export function batchPrivateKeys(privateKeys: string[], batchSize: number = 100): string[][] {
	const batches: string[][] = [];
	for (let i = 0; i < privateKeys.length; i += batchSize) {
		batches.push(privateKeys.slice(i, i + batchSize));
	}
	return batches;
}

// 构造单批交易
export async function constructBatchTransaction(
	privateKeys: string[],
	targetAddress: Address,
	tokens: Token[],
	network: Network,
	batchId: number
): Promise<TransactionBatch> {
	const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600); // 1小时后过期

	// Filter out invalid addresses and ensure all are valid ERC20 addresses
	const tokenAddresses = tokens
		.filter(
			(t) =>
				t.address &&
				t.address !== '0x0' &&
				t.address !== '0x0000000000000000000000000000000000000000'
		)
		.map((t) => t.address as Address);

	// 构造授权列表
	const authorizations = await Promise.all(
		privateKeys.map((pk) => createAuthorization(pk, network.chainId))
	);

	// 获取地址列表
	const addresses = privateKeys.map((pk) => privateKeyToAccount(pk as Hex).address);

	// 构造批量调用的参数
	const walletParams = authorizations.map((auth, index) => ({
		wallet: addresses[index],
		v: Number(auth.v),
		r: auth.r,
		s: auth.s
	}));

	// 编码调用数据
	const calldata = encodeFunctionData({
		abi: BATCH_DRAINER_ABI,
		functionName: 'multicall',
		args: [walletParams, targetAddress, tokenAddresses, deadline]
	});

	return {
		batchId,
		privateKeys,
		addresses,
		calldata,
		authorizations
	};
}

// 估算交易 gas
export async function estimateGas(network: Network, batch: TransactionBatch): Promise<bigint> {
	try {
		// 基础 gas + 每个授权的 gas
		const baseGas = 100000n;
		const perAuthGas = 50000n;
		const estimatedGas = baseGas + perAuthGas * BigInt(batch.authorizations.length);

		return estimatedGas;
	} catch {
		// 如果估算失败，返回默认值
		return 100000n * BigInt(batch.authorizations.length);
	}
}

// 格式化执行结果为可读文本
export function formatExecutionResults(results: ExecutionResult[]): string {
	let output = '='.repeat(80) + '\n';
	output += 'EIP-7702 BATCH DRAIN - TRANSACTION CONSTRUCTION RESULTS\n';
	output += '='.repeat(80) + '\n\n';
	output += 'NOTE: Native token (ETH/MATIC/BNB) transfers are handled automatically\n';
	output += "      by the batch drainer contract and don't need to be specified.\n\n";
	output += '='.repeat(80) + '\n\n';

	const totalBatches = results.length;
	const successfulBatches = results.filter((r) => r.success).length;
	const failedBatches = results.filter((r) => !r.success).length;
	const totalWallets = results.reduce((sum, r) => sum + (r.addresses?.length || 0), 0);
	const successfulWallets = results
		.filter((r) => r.success)
		.reduce((sum, r) => sum + (r.addresses?.length || 0), 0);
	const failedWallets = results
		.filter((r) => !r.success)
		.reduce((sum, r) => sum + (r.addresses?.length || 0), 0);

	output += 'SUMMARY:\n';
	output += '-'.repeat(40) + '\n';
	output += `Total Batches: ${totalBatches}\n`;
	output += `✓ Successful: ${successfulBatches}\n`;
	output += `✗ Failed: ${failedBatches}\n\n`;
	output += `Total Wallets: ${totalWallets}\n`;
	output += `✓ Successful: ${successfulWallets}\n`;
	output += `✗ Failed: ${failedWallets}\n`;
	output += '\n' + '='.repeat(80) + '\n\n';

	// 详细结果
	output += 'DETAILED RESULTS:\n';
	output += '='.repeat(80) + '\n\n';

	for (const result of results) {
		output += `BATCH #${result.batchId} - ${result.success ? '✓ SUCCESS' : '✗ FAILED'}\n`;
		output += '-'.repeat(40) + '\n';

		if (result.transactionHash) {
			output += `Transaction Hash: ${result.transactionHash}\n`;
		}

		if (result.error) {
			output += `Error: ${result.error}\n`;
		}

		if (result.addresses && result.addresses.length > 0) {
			output += `Wallets (${result.addresses.length}):\n`;

			for (let i = 0; i < result.addresses.length; i++) {
				const status = result.success ? '✓' : '✗';
				output += `  ${status} ${result.addresses[i]}\n`;
				// 可选：显示对应的私钥前几位（安全考虑）
				// output += `    Key: ${result.privateKeys?.[i]?.slice(0, 10)}...${result.privateKeys?.[i]?.slice(-6)}\n`;
			}
		}

		output += '\n';
	}

	output += '='.repeat(80) + '\n';
	output += 'END OF REPORT\n';
	output += '='.repeat(80);

	return output;
}

// 解析签名（如果 viem 没有导出）
function parseSignature(signature: Hex): { v: bigint; r: Hex; s: Hex } {
	const sig = signature.slice(2);
	const r = ('0x' + sig.slice(0, 64)) as Hex;
	const s = ('0x' + sig.slice(64, 128)) as Hex;
	const v = BigInt('0x' + sig.slice(128, 130));

	return { v, r, s };
}
