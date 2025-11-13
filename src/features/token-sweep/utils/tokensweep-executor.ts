/**
 * TokenSweep contract execution with EIP-7702
 * Handles batch token sweeping using the TokenSweep contract
 */
import {
	type Address,
	type Hex,
	type PublicClient,
	encodeFunctionData,
	parseEther,
	keccak256,
	toHex,
	encodeAbiParameters
} from 'viem';
import type { ImportedWallet } from '../types/wallet';
import type { ERC20Token, NativeToken } from '$lib/types/token';
import TokenSweepABI from '../../../../static/contracts/TokenSweep.json';
import {
	TOKEN_SWEEP_CONTRACT,
	batchSignAuthorizations,
	authorizationsToWalletSignatures,
	type WalletSignature
} from './eip7702-auth';

export interface TokenSweepConfig {
	targetAddress: Address; // Recipient address
	wallets: ImportedWallet[]; // Wallets to sweep from
	tokens: (NativeToken | ERC20Token)[]; // Tokens to sweep
	chainId: number; // Chain ID
	referrer?: Address; // Optional referrer address
	deadline?: bigint; // Signature deadline (default: 1 hour from now)
}

export interface TokenSweepResult {
	success: boolean;
	transactionHash?: Hex;
	error?: string;
	walletsProcessed: number;
	tokensSwept: number;
}

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' as Address;

/**
 * Generate signature for the overall multicall authorization
 * This signature authorizes the batch operation
 */
async function generateMulticallSignature(
	signer: ImportedWallet,
	config: TokenSweepConfig,
	wallets: WalletSignature[],
	tokenAddresses: Address[],
	deadline: bigint
): Promise<Hex> {
	// Create a message hash for the multicall operation
	// Format: keccak256(abi.encode(chainId, recipient, tokens, deadline, referrer, wallets))
	const message = encodeAbiParameters(
		[
			{ name: 'chainId', type: 'uint256' },
			{ name: 'recipient', type: 'address' },
			{ name: 'tokens', type: 'address[]' },
			{ name: 'deadline', type: 'uint256' },
			{ name: 'referrer', type: 'address' },
			{
				name: 'wallets',
				type: 'tuple[]',
				components: [
					{ name: 'wallet', type: 'address' },
					{ name: 'signature', type: 'bytes' }
				]
			}
		],
		[
			BigInt(config.chainId),
			config.targetAddress,
			tokenAddresses,
			deadline,
			config.referrer || ZERO_ADDRESS,
			wallets
		]
	);

	const messageHash = keccak256(message);

	// Sign with the connected wallet (the one paying for gas and authorizing the batch)
	const signature = await signer.signMessage(messageHash);

	return signature as Hex;
}

/**
 * Execute token sweep using TokenSweep contract's multicall function
 *
 * Process:
 * 1. Generate EIP-7702 authorizations for each wallet
 * 2. Sign the overall multicall operation
 * 3. Call TokenSweep.multicall with all authorizations
 * 4. The contract uses EIP-7702 to execute drainToAddress on behalf of each wallet
 */
export async function executeTokenSweep(
	publicClient: PublicClient,
	signer: ImportedWallet,
	config: TokenSweepConfig
): Promise<TokenSweepResult> {
	try {
		// 1. Prepare token addresses
		// Native token is represented as zero address
		const tokenAddresses: Address[] = config.tokens.map((token) => {
			if (token.type === 'native') {
				return ZERO_ADDRESS;
			}
			return (token as ERC20Token).address;
		});

		// 2. Set deadline (default: 1 hour from now)
		const deadline = config.deadline || BigInt(Math.floor(Date.now() / 1000) + 3600);

		// 3. Generate EIP-7702 authorizations for all wallets
		// Each wallet authorizes TokenSweep contract to act on its behalf
		const signedAuths = await batchSignAuthorizations(
			config.wallets,
			TOKEN_SWEEP_CONTRACT,
			config.chainId
		);

		// 4. Convert to contract format
		const walletSignatures = authorizationsToWalletSignatures(config.wallets, signedAuths);

		// 5. Generate overall multicall signature
		// This authorizes the entire batch operation
		const multicallSignature = await generateMulticallSignature(
			signer,
			config,
			walletSignatures,
			tokenAddresses,
			deadline
		);

		// 6. Encode the multicall function call
		const data = encodeFunctionData({
			abi: TokenSweepABI.abi,
			functionName: 'multicall',
			args: [
				walletSignatures, // Array of { wallet, signature }
				config.targetAddress, // Recipient
				tokenAddresses, // Tokens to sweep
				deadline, // Deadline
				config.referrer || ZERO_ADDRESS, // Referrer
				multicallSignature // Overall signature
			]
		});

		// 7. Calculate required value (NON_MEMBER_FEE if not premium member)
		// For now, we always send the fee. The contract will refund if user is premium.
		const NON_MEMBER_FEE = parseEther('0.005'); // 0.005 ETH

		// 8. Send transaction
		const txHash = await signer.sendTransaction({
			to: TOKEN_SWEEP_CONTRACT,
			data,
			value: NON_MEMBER_FEE,
			gas: BigInt(5000000) // High gas limit for batch operation
		});

		// 9. Wait for confirmation
		const receipt = await publicClient.waitForTransactionReceipt({
			hash: txHash
		});

		if (receipt.status === 'success') {
			return {
				success: true,
				transactionHash: txHash,
				walletsProcessed: config.wallets.length,
				tokensSwept: tokenAddresses.length
			};
		} else {
			return {
				success: false,
				error: 'Transaction failed',
				walletsProcessed: 0,
				tokensSwept: 0
			};
		}
	} catch (error) {
		console.error('TokenSweep execution error:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error',
			walletsProcessed: 0,
			tokensSwept: 0
		};
	}
}

/**
 * Estimate gas and cost for TokenSweep operation
 */
export async function estimateTokenSweep(
	publicClient: PublicClient,
	config: TokenSweepConfig
): Promise<{
	estimatedGas: bigint;
	estimatedCost: bigint;
	membershipFee: bigint;
	totalCost: bigint;
}> {
	try {
		const NON_MEMBER_FEE = parseEther('0.005');

		// Rough gas estimation based on number of wallets and tokens
		// Each wallet operation costs approximately 100k gas
		// Each token transfer costs approximately 50k gas
		const baseGas = 200000n; // Base cost
		const perWalletGas = 100000n;
		const perTokenGas = 50000n;

		const estimatedGas =
			baseGas +
			BigInt(config.wallets.length) * perWalletGas +
			BigInt(config.tokens.length) * perTokenGas;

		const gasPrice = await publicClient.getGasPrice();
		const estimatedCost = estimatedGas * gasPrice;
		const totalCost = estimatedCost + NON_MEMBER_FEE;

		return {
			estimatedGas,
			estimatedCost,
			membershipFee: NON_MEMBER_FEE,
			totalCost
		};
	} catch (error) {
		console.error('Gas estimation error:', error);
		// Return default estimates
		return {
			estimatedGas: 1000000n,
			estimatedCost: parseEther('0.01'),
			membershipFee: parseEther('0.005'),
			totalCost: parseEther('0.015')
		};
	}
}
