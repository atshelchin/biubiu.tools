/**
 * TokenSweep contract execution with EIP-7702
 * Handles batch token sweeping using the TokenSweep contract
 */
import { type Address, type Hex, type PublicClient, encodeFunctionData, parseEther } from 'viem';
import type { ImportedWallet } from '../types/wallet';
import type { ERC20Token, NativeToken } from '$lib/types/token';
import TokenSweepABI from '../../../../static/contracts/TokenSweep.json';
import {
	TOKEN_SWEEP_CONTRACT,
	batchSignAuthorizations,
	generateDrainSignatures,
	toViemAuthorizationList
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
 * Convert address to hex string format (lowercase with 0x prefix)
 * Matches contract's _toHexString(address) function
 */
function toHexString(address: Address): string {
	return address.toLowerCase();
}

/**
 * Generate signature for the overall multicall authorization
 * This signature authorizes the batch operation
 * Must match the contract's _verifyAuthorization() expected message format
 */
async function generateMulticallSignature(
	signer: ImportedWallet,
	config: TokenSweepConfig
): Promise<Hex> {
	// Create human-readable message matching contract's _verifyAuthorization()
	// Format from contract:
	// "TokenSweep Authorization\n\n"
	// "I authorize wallet:\n"
	// _toHexString(caller)
	// "\n\nto call multicall on my behalf\n\n"
	// "Recipient address:\n"
	// _toHexString(recipient)
	// "\n\nChain ID: "
	// _toString(block.chainid)
	const message =
		'TokenSweep Authorization\n\n' +
		'I authorize wallet:\n' +
		toHexString(signer.address) +
		'\n\nto call multicall on my behalf\n\n' +
		'Recipient address:\n' +
		toHexString(config.targetAddress) +
		'\n\nChain ID: ' +
		config.chainId.toString();

	// Sign the message (viem will handle the keccak256 hashing)
	const signature = await signer.signMessage(message);

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
		// Get actual nonces from blockchain
		const signedAuths = await batchSignAuthorizations(
			publicClient,
			config.wallets,
			TOKEN_SWEEP_CONTRACT,
			config.chainId
		);

		// 4. Generate drain signatures for each wallet
		// Each wallet signs the drainToAddress parameters
		const walletSignatures = await generateDrainSignatures(
			config.wallets,
			config.chainId,
			config.targetAddress,
			tokenAddresses,
			deadline
		);

		// 5. Convert to viem's authorizationList format for EIP-7702 transaction
		const authorizationList = toViemAuthorizationList(signedAuths);

		// 6. Generate overall multicall signature
		// This authorizes the entire batch operation
		const multicallSignature = await generateMulticallSignature(signer, config);

		// 7. Encode the multicall function call
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

		// 8. Calculate required value (NON_MEMBER_FEE if not premium member)
		// For now, we always send the fee. The contract will refund if user is premium.
		const NON_MEMBER_FEE = parseEther('0.005'); // 0.005 ETH

		// 9. Send transaction with EIP-7702 authorizationList
		// The authorizationList allows EOA wallets to temporarily delegate their code to TokenSweep
		const txHash = await signer.sendTransaction({
			to: TOKEN_SWEEP_CONTRACT,
			data,
			value: NON_MEMBER_FEE,
			gas: BigInt(5000000), // High gas limit for batch operation
			authorizationList // EIP-7702 authorizations for wallet code delegation
		});

		// 10. Wait for confirmation
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
