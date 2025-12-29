/**
 * Delegated Distribution Executor composable
 * Handles the execution flow of token distribution in delegated mode
 * User signs an EIP-712 authorization, then anyone can execute batches
 */
import type { Address } from 'viem';
import { encodeFunctionData, parseUnits, type TypedData, type TypedDataDomain } from 'viem';
import type {
	DistributionConfig,
	DistributionAuth,
	DelegatedSession,
	DelegatedBatch,
	TokenTypeEnum
} from '../types/distribution';
import { TOKEN_TYPE_ENUM } from '../types/distribution';
import { step5State, type TransactionResult } from '../stores/step5-state.svelte';
import {
	buildDistributionMerkleTree,
	flattenBatchProof,
	type MerkleRecipient
} from '../utils/merkle-tree';
import { calculateTotalAmount } from '../utils/distribution-builder';

// TokenDistribution contract ABI (relevant functions only)
const TOKEN_DISTRIBUTION_ABI = [
	{
		type: 'function',
		name: 'distributeDelegated',
		inputs: [
			{
				name: 'auth',
				type: 'tuple',
				components: [
					{ name: 'uuid', type: 'bytes32' },
					{ name: 'token', type: 'address' },
					{ name: 'tokenType', type: 'uint8' },
					{ name: 'tokenId', type: 'uint256' },
					{ name: 'totalAmount', type: 'uint256' },
					{ name: 'totalBatches', type: 'uint256' },
					{ name: 'merkleRoot', type: 'bytes32' },
					{ name: 'deadline', type: 'uint256' }
				]
			},
			{ name: 'signature', type: 'bytes' },
			{ name: 'batchId', type: 'uint256' },
			{
				name: 'recipients',
				type: 'tuple[]',
				components: [
					{ name: 'to', type: 'address' },
					{ name: 'value', type: 'uint256' }
				]
			},
			{ name: 'proofs', type: 'bytes32[]' },
			{ name: 'proofLengths', type: 'uint8[]' }
		],
		outputs: [
			{ name: 'totalDistributed', type: 'uint256' },
			{
				name: 'failed',
				type: 'tuple[]',
				components: [
					{ name: 'to', type: 'address' },
					{ name: 'value', type: 'uint256' },
					{ name: 'reason', type: 'bytes' }
				]
			}
		],
		stateMutability: 'payable'
	},
	{
		type: 'function',
		name: 'DOMAIN_SEPARATOR',
		inputs: [],
		outputs: [{ name: '', type: 'bytes32' }],
		stateMutability: 'view'
	},
	{
		type: 'function',
		name: 'batchExecuted',
		inputs: [
			{ name: 'uuid', type: 'bytes32' },
			{ name: 'batchId', type: 'uint256' }
		],
		outputs: [{ name: '', type: 'bool' }],
		stateMutability: 'view'
	},
	{
		type: 'function',
		name: 'NON_MEMBER_FEE',
		inputs: [],
		outputs: [{ name: '', type: 'uint256' }],
		stateMutability: 'view'
	}
] as const;

// EIP-712 type definitions for DistributionAuth
const DISTRIBUTION_AUTH_TYPES = {
	DistributionAuth: [
		{ name: 'uuid', type: 'bytes32' },
		{ name: 'token', type: 'address' },
		{ name: 'tokenType', type: 'uint8' },
		{ name: 'tokenId', type: 'uint256' },
		{ name: 'totalAmount', type: 'uint256' },
		{ name: 'totalBatches', type: 'uint256' },
		{ name: 'merkleRoot', type: 'bytes32' },
		{ name: 'deadline', type: 'uint256' }
	]
} as const satisfies TypedData;

// Default batch size (contract MAX_BATCH_SIZE is 200)
const DEFAULT_BATCH_SIZE = 100;

// Default deadline duration (1 hour)
const DEFAULT_DEADLINE_DURATION = 60 * 60;

interface UseDelegatedExecutorOptions {
	getContractAddress?: () => Address;
	getSignTypedData: () => (params: {
		domain: TypedDataDomain;
		types: TypedData;
		primaryType: string;
		message: Record<string, unknown>;
	}) => Promise<`0x${string}`>;
	getSendTransaction: () => (params: {
		to: Address;
		value: bigint;
		data: `0x${string}`;
		gas?: bigint;
	}) => Promise<`0x${string}`>;
	getWaitForTransaction: () => (hash: `0x${string}`) => Promise<{ status: 'success' | 'reverted' }>;
	getReadContract?: () => <T>(params: {
		address: Address;
		abi: typeof TOKEN_DISTRIBUTION_ABI;
		functionName: string;
		args?: readonly unknown[];
	}) => Promise<T>;
}

export function useDelegatedExecutor(options: UseDelegatedExecutorOptions) {
	const {
		getContractAddress,
		getSignTypedData,
		getSendTransaction,
		getWaitForTransaction,
		getReadContract
	} = options;

	// Local state
	let session = $state<DelegatedSession | null>(null);
	let isAuthorizing = $state(false);
	let isExecuting = $state(false);
	let shouldStop = $state(false);
	let currentBatchIndex = $state(0);

	/**
	 * Generate a unique UUID for the distribution session
	 */
	function generateUUID(): `0x${string}` {
		const array = new Uint8Array(32);
		crypto.getRandomValues(array);
		return ('0x' +
			Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('')) as `0x${string}`;
	}

	/**
	 * Get token type enum from config
	 */
	function getTokenTypeEnum(config: DistributionConfig): TokenTypeEnum {
		switch (config.token.type) {
			case 'native':
				return TOKEN_TYPE_ENUM.WETH;
			case 'erc20':
				return TOKEN_TYPE_ENUM.ERC20;
			case 'erc721':
				return TOKEN_TYPE_ENUM.ERC721;
			case 'erc1155':
				return TOKEN_TYPE_ENUM.ERC1155;
			default:
				return TOKEN_TYPE_ENUM.ERC20;
		}
	}

	/**
	 * Get token address from config (WETH address for native)
	 */
	function getTokenAddress(config: DistributionConfig, wethAddress: Address): Address {
		if (config.token.type === 'native') {
			return wethAddress;
		}
		return 'address' in config.token ? (config.token.address as Address) : wethAddress;
	}

	/**
	 * Convert recipients to merkle format
	 */
	function toMerkleRecipients(config: DistributionConfig): MerkleRecipient[] {
		const decimals = config.token.decimals;

		return config.recipients.map((r) => {
			let value: bigint;

			if (config.token.type === 'erc721') {
				// For ERC721, value is 1 (transfer one NFT)
				value = BigInt(1);
			} else if (config.token.type === 'erc1155') {
				// For ERC1155, use tokenAmount or default to 1
				value = r.tokenAmount ? BigInt(r.tokenAmount) : BigInt(1);
			} else {
				// For fungible tokens, parse amount
				const amount =
					config.amountMode === 'equal' ? config.amountPerRecipient || '0' : r.amount || '0';
				value = parseUnits(amount, decimals);
			}

			return {
				to: r.address,
				value
			};
		});
	}

	/**
	 * Authorize distribution (sign EIP-712 message)
	 * Creates the session with merkle tree and signature
	 */
	async function authorize(
		config: DistributionConfig,
		options?: {
			batchSize?: number;
			deadlineSeconds?: number;
			wethAddress?: Address;
		}
	): Promise<{ success: boolean; error?: string }> {
		const batchSize = options?.batchSize ?? DEFAULT_BATCH_SIZE;
		const deadlineSeconds = options?.deadlineSeconds ?? DEFAULT_DEADLINE_DURATION;
		const wethAddress = options?.wethAddress ?? ('0x0' as Address);

		isAuthorizing = true;

		try {
			if (!getContractAddress) {
				return { success: false, error: 'Contract address getter not configured' };
			}
			const contractAddress = getContractAddress();
			const signTypedData = getSignTypedData();

			// Convert recipients to merkle format
			const merkleRecipients = toMerkleRecipients(config);

			// Build merkle tree
			const merkleTree = buildDistributionMerkleTree(merkleRecipients, batchSize);

			// Calculate total amount
			const totalAmountStr = calculateTotalAmount(config);
			const totalAmount = parseUnits(totalAmountStr, config.token.decimals);

			// Generate auth data
			const uuid = generateUUID();
			const deadline = BigInt(Math.floor(Date.now() / 1000) + deadlineSeconds);
			const tokenType = getTokenTypeEnum(config);
			const tokenAddress = getTokenAddress(config, wethAddress);
			const tokenId =
				config.token.type === 'erc721' || config.token.type === 'erc1155'
					? (config.recipients[0]?.tokenId ?? BigInt(0))
					: BigInt(0);

			const auth: DistributionAuth = {
				uuid,
				token: tokenAddress,
				tokenType,
				tokenId,
				totalAmount,
				totalBatches: BigInt(merkleTree.totalBatches),
				merkleRoot: merkleTree.root,
				deadline
			};

			// Get domain separator from contract
			const domain: TypedDataDomain = {
				name: 'TokenDistribution',
				version: '1',
				chainId: BigInt(config.chainId),
				verifyingContract: contractAddress
			};

			// Sign the authorization
			const signature = await signTypedData({
				domain,
				types: DISTRIBUTION_AUTH_TYPES,
				primaryType: 'DistributionAuth',
				message: {
					uuid: auth.uuid,
					token: auth.token,
					tokenType: auth.tokenType,
					tokenId: auth.tokenId,
					totalAmount: auth.totalAmount,
					totalBatches: auth.totalBatches,
					merkleRoot: auth.merkleRoot,
					deadline: auth.deadline
				}
			});

			// Create batches from merkle tree
			const batches: DelegatedBatch[] = merkleTree.batches.map((b) => ({
				batchId: b.batchId,
				recipients: b.recipients.map((r) => ({ to: r.to, value: r.value })),
				proof: b.proof,
				status: 'pending' as const
			}));

			// Create session
			session = {
				sessionId: uuid.slice(0, 18),
				auth,
				signature,
				batches,
				createdAt: Date.now(),
				expiresAt: Number(deadline) * 1000,
				status: 'pending'
			};

			// Initialize step5 state
			step5State.initSession(batches.length);
			step5State.updateProgress(0, 'preparing', 'Authorization signed, ready to execute');

			return { success: true };
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);

			if (errorMessage.includes('rejected') || errorMessage.includes('denied')) {
				step5State.pause('Authorization rejected by user');
				return { success: false, error: 'Authorization rejected by user' };
			}

			step5State.setError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			isAuthorizing = false;
		}
	}

	/**
	 * Execute a single batch
	 */
	async function executeBatch(
		batchIndex: number,
		options?: { fee?: bigint }
	): Promise<{ success: boolean; error?: string }> {
		if (!session) {
			return { success: false, error: 'No active session' };
		}

		const batch = session.batches[batchIndex];
		if (!batch) {
			return { success: false, error: 'Invalid batch index' };
		}

		if (batch.status === 'completed') {
			return { success: true };
		}

		if (!getContractAddress) {
			return { success: false, error: 'Contract address getter not configured' };
		}
		const contractAddress = getContractAddress();
		const sendTransaction = getSendTransaction();
		const waitForTransaction = getWaitForTransaction();

		try {
			// Update batch status
			batch.status = 'executing';
			session = { ...session, batches: [...session.batches] };

			// Get proof data
			const { proofs, proofLengths } = flattenBatchProof({
				batchId: batch.batchId,
				recipients: batch.recipients,
				leaf: '0x' as `0x${string}`, // Not needed for execution
				proof: batch.proof
			});

			// Encode function call
			const data = encodeFunctionData({
				abi: TOKEN_DISTRIBUTION_ABI,
				functionName: 'distributeDelegated',
				args: [
					{
						uuid: session.auth.uuid,
						token: session.auth.token,
						tokenType: session.auth.tokenType,
						tokenId: session.auth.tokenId,
						totalAmount: session.auth.totalAmount,
						totalBatches: session.auth.totalBatches,
						merkleRoot: session.auth.merkleRoot,
						deadline: session.auth.deadline
					},
					session.signature,
					BigInt(batch.batchId),
					batch.recipients,
					proofs,
					proofLengths
				]
			});

			// Send transaction
			const hash = await sendTransaction({
				to: contractAddress,
				value: options?.fee ?? BigInt(0),
				data
			});

			batch.txHash = hash;

			// Update progress
			step5State.updateProgress(
				batchIndex,
				'executing',
				`Batch ${batchIndex + 1}/${session.batches.length} sent, waiting for confirmation...`
			);

			// Wait for confirmation
			const receipt = await waitForTransaction(hash);

			if (receipt.status === 'success') {
				batch.status = 'completed';

				// Record results for all recipients in batch
				for (const recipient of batch.recipients) {
					const result: TransactionResult = {
						recipientAddress: recipient.to,
						amount: recipient.value.toString(),
						success: true,
						hash,
						timestamp: Date.now()
					};
					step5State.addResult(result);
				}
			} else {
				batch.status = 'failed';
				batch.error = 'Transaction reverted';

				// Record failures
				for (const recipient of batch.recipients) {
					const result: TransactionResult = {
						recipientAddress: recipient.to,
						amount: recipient.value.toString(),
						success: false,
						error: 'Transaction reverted',
						timestamp: Date.now()
					};
					step5State.addResult(result);
				}
			}

			// Update session
			session = { ...session, batches: [...session.batches] };

			// Check if all batches are completed
			const allCompleted = session.batches.every((b) => b.status === 'completed');
			if (allCompleted) {
				session.status = 'completed';
				step5State.complete();
			} else {
				session.status = 'partial';
			}

			return { success: batch.status === 'completed' };
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			batch.status = 'failed';
			batch.error = errorMessage;
			session = { ...session, batches: [...session.batches] };

			// Record failures for all recipients in batch
			for (const recipient of batch.recipients) {
				const result: TransactionResult = {
					recipientAddress: recipient.to,
					amount: recipient.value.toString(),
					success: false,
					error: errorMessage,
					timestamp: Date.now()
				};
				step5State.addResult(result);
			}

			if (errorMessage.includes('rejected') || errorMessage.includes('denied')) {
				step5State.pause('Transaction rejected by user');
				return { success: false, error: 'Transaction rejected by user' };
			}

			return { success: false, error: errorMessage };
		}
	}

	/**
	 * Execute all pending batches
	 */
	async function executeAll(options?: {
		startFromBatch?: number;
		batchDelay?: number;
		fee?: bigint;
	}): Promise<{ success: boolean; error?: string }> {
		if (!session) {
			return { success: false, error: 'No active session' };
		}

		const startBatch = options?.startFromBatch ?? 0;
		const batchDelay = options?.batchDelay ?? 1000;

		isExecuting = true;
		shouldStop = false;
		currentBatchIndex = startBatch;

		try {
			for (let i = startBatch; i < session.batches.length; i++) {
				if (shouldStop) {
					step5State.pause('Execution paused by user');
					return { success: false, error: 'Execution paused' };
				}

				currentBatchIndex = i;

				step5State.updateProgress(
					i,
					'executing',
					`Executing batch ${i + 1}/${session.batches.length}...`
				);

				const result = await executeBatch(i, { fee: options?.fee });

				if (!result.success && result.error?.includes('rejected')) {
					return result;
				}

				// Delay between batches
				if (i < session.batches.length - 1 && batchDelay > 0) {
					await new Promise((resolve) => setTimeout(resolve, batchDelay));
				}
			}

			return { success: true };
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			step5State.setError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			isExecuting = false;
		}
	}

	/**
	 * Stop execution
	 */
	function stop() {
		shouldStop = true;
	}

	/**
	 * Check if a batch is already executed on-chain
	 */
	async function isBatchExecuted(batchId: number): Promise<boolean> {
		if (!session) return false;
		if (!getReadContract || !getContractAddress) return false;

		const readContract = getReadContract();
		const contractAddress = getContractAddress();

		try {
			const executed = await readContract<boolean>({
				address: contractAddress,
				abi: TOKEN_DISTRIBUTION_ABI,
				functionName: 'batchExecuted',
				args: [session.auth.uuid, BigInt(batchId)]
			});
			return executed;
		} catch {
			return false;
		}
	}

	/**
	 * Sync batch status with on-chain state
	 */
	async function syncBatchStatus(): Promise<void> {
		if (!session) return;

		for (const batch of session.batches) {
			if (batch.status !== 'completed') {
				const executed = await isBatchExecuted(batch.batchId);
				if (executed) {
					batch.status = 'completed';
				}
			}
		}

		session = { ...session, batches: [...session.batches] };

		// Update session status
		const allCompleted = session.batches.every((b) => b.status === 'completed');
		if (allCompleted) {
			session.status = 'completed';
		}
	}

	/**
	 * Get non-member fee from contract
	 */
	async function getNonMemberFee(): Promise<bigint> {
		if (!getReadContract || !getContractAddress) return BigInt(0);

		const readContract = getReadContract();
		const contractAddress = getContractAddress();

		try {
			const fee = await readContract<bigint>({
				address: contractAddress,
				abi: TOKEN_DISTRIBUTION_ABI,
				functionName: 'NON_MEMBER_FEE',
				args: []
			});
			return fee;
		} catch {
			return BigInt(0);
		}
	}

	/**
	 * Export session for sharing
	 */
	function exportSession(): string | null {
		if (!session) return null;
		return JSON.stringify(session, (_, v) => (typeof v === 'bigint' ? v.toString() : v));
	}

	/**
	 * Import session from exported data (string) or StoredSession object
	 */
	function importSession(
		data: string | { session: DelegatedSession; meta?: unknown; results?: unknown[] }
	): boolean {
		try {
			let parsed: DelegatedSession;

			if (typeof data === 'string') {
				parsed = JSON.parse(data, (key, value) => {
					// Convert bigint strings back to bigint for known fields
					if (
						typeof value === 'string' &&
						[
							'tokenId',
							'totalAmount',
							'totalBatches',
							'deadline',
							'value',
							'createdAt',
							'expiresAt'
						].includes(key)
					) {
						return BigInt(value);
					}
					return value;
				}) as DelegatedSession;
			} else {
				// It's a StoredSession object
				parsed = data.session;
			}

			// Validate session
			if (!parsed.auth || !parsed.signature || !parsed.batches) {
				return false;
			}

			// Check expiry
			if (Date.now() > parsed.expiresAt) {
				parsed.status = 'expired';
			}

			session = parsed;

			// Initialize step5 state
			const completedBatchCount = parsed.batches.filter((b) => b.status === 'completed').length;
			step5State.initSession(parsed.batches.length);
			if (completedBatchCount > 0) {
				step5State.updateProgress(
					completedBatchCount,
					parsed.status === 'completed' ? 'completed' : 'paused',
					`${completedBatchCount}/${parsed.batches.length} batches completed`
				);
			}

			return true;
		} catch {
			return false;
		}
	}

	/**
	 * Reset state
	 */
	function reset() {
		session = null;
		isAuthorizing = false;
		isExecuting = false;
		shouldStop = false;
		currentBatchIndex = 0;
		step5State.reset();
	}

	return {
		// State
		get session() {
			return session;
		},
		get isAuthorizing() {
			return isAuthorizing;
		},
		get isExecuting() {
			return isExecuting;
		},
		get currentBatchIndex() {
			return currentBatchIndex;
		},
		get progress() {
			return step5State.progress;
		},
		get results() {
			return step5State.results;
		},
		get summary() {
			return step5State.summary;
		},
		get canResume() {
			return (
				session !== null &&
				session.status !== 'completed' &&
				session.status !== 'expired' &&
				!isExecuting
			);
		},
		get isPaused() {
			return step5State.isPaused;
		},
		get errorMessage() {
			return step5State.errorMessage;
		},
		get completedBatches() {
			if (!session) return 0;
			return session.batches.filter((b) => b.status === 'completed').length;
		},
		get pendingBatches() {
			if (!session) return 0;
			return session.batches.filter((b) => b.status === 'pending').length;
		},

		// Methods
		authorize,
		executeBatch,
		executeAll,
		stop,
		isBatchExecuted,
		syncBatchStatus,
		getNonMemberFee,
		exportSession,
		importSession,
		reset
	};
}

export type DelegatedExecutorInstance = ReturnType<typeof useDelegatedExecutor>;
