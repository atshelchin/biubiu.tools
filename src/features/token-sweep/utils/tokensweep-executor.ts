/**
 * TokenSweep contract execution with EIP-7702
 * Handles batch token sweeping using the TokenSweep contract
 */
import {
	type Address,
	type Hex,
	type PublicClient,
	type SignedAuthorizationList,
	encodeFunctionData,
	parseEther
} from 'viem';
import type { ImportedWallet } from '../types/wallet';
import type { ERC20Token, NativeToken } from '$lib/types/token';
import TokenSweepABI from '../../../../static/contracts/TokenSweep.json';
import {
	TOKEN_SWEEP_CONTRACT,
	batchSignAuthorizations,
	generateDrainSignatures,
	toViemAuthorizationList
} from './eip7702-auth';

/**
 * Signer interface for the wallet that pays gas and submits the transaction
 * This is NOT the imported wallets being swept - it's the connected wallet or temporary wallet
 */
export interface TransactionSigner {
	address: Address;
	signMessage: (message: string) => Promise<Hex>;
	sendTransaction: (tx: {
		to: Address;
		data: `0x${string}`;
		value: bigint;
		gas: bigint;
		authorizationList?: SignedAuthorizationList;
	}) => Promise<Hex>;
}

export interface TokenSweepConfig {
	targetAddress: Address; // Recipient address
	wallets: ImportedWallet[]; // Wallets to sweep from (imported private keys)
	tokens: (NativeToken | ERC20Token)[]; // Tokens to sweep
	chainId: number; // Chain ID
	referrer?: Address; // Optional referrer address
	deadline?: bigint; // Signature deadline (default: 1 hour from now)
	useTemporaryWallet?: boolean; // If true, requires multicall signature; if false, uses connected wallet
	onProgress?: (message: string, percentage: number) => void; // Progress callback for UI updates
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
	signer: TransactionSigner,
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
 * @param publicClient - Viem public client for blockchain queries
 * @param signer - The wallet that pays gas and submits the transaction (connected wallet or temporary wallet)
 * @param config - TokenSweep configuration including wallets to sweep, tokens, and target address
 *
 * Process:
 * 1. Generate EIP-7702 authorizations for each imported wallet
 * 2. Generate drain signatures for each imported wallet
 * 3. Sign the overall multicall operation with the signer wallet
 * 4. Call TokenSweep.multicall with all authorizations
 * 5. The contract uses EIP-7702 to execute drainToAddress on behalf of each wallet
 *
 * ⚠️ IMPORTANT: EIP-7702 Support Requirements
 * - Requires a network/RPC that supports EIP-7702 (Prague upgrade)
 * - Not supported on most public RPCs yet (as of 2024)
 * - Requires local testnet (Anvil/Hardhat) or dedicated EIP-7702 RPC
 * - Error "External EIP-7702 transactions are not supported" means network doesn't support it
 */
export async function executeTokenSweep(
	publicClient: PublicClient,
	signer: TransactionSigner,
	config: TokenSweepConfig
): Promise<TokenSweepResult> {
	try {
		console.log('🚀 Starting TokenSweep execution...');
		console.log('📊 Config:', {
			targetAddress: config.targetAddress,
			walletCount: config.wallets.length,
			tokenCount: config.tokens.length,
			chainId: config.chainId,
			useTemporaryWallet: config.useTemporaryWallet
		});

		// 1. Prepare token addresses
		// Native token is represented as zero address
		const tokenAddresses: Address[] = config.tokens.map((token) => {
			if (token.type === 'native') {
				return ZERO_ADDRESS;
			}
			return (token as ERC20Token).address;
		});
		console.log('📋 Token addresses:', tokenAddresses);

		// 2. Set deadline (default: 1 hour from now)
		const deadline = config.deadline || BigInt(Math.floor(Date.now() / 1000) + 3600);
		console.log('⏰ Deadline:', new Date(Number(deadline) * 1000).toLocaleString());

		// 3. Generate EIP-7702 authorizations for all wallets
		// Each wallet authorizes TokenSweep contract to act on its behalf
		// Get actual nonces from blockchain
		console.log('🔐 Generating EIP-7702 authorizations for', config.wallets.length, 'wallets...');
		config.onProgress?.('🔐 Generating EIP-7702 authorizations...', 15);

		const signedAuths = await batchSignAuthorizations(
			publicClient,
			config.wallets,
			TOKEN_SWEEP_CONTRACT,
			config.chainId
		);
		console.log('✅ Generated', signedAuths.length, 'EIP-7702 authorizations');

		// 4. Generate drain signatures for each wallet
		// Each wallet signs the drainToAddress parameters
		console.log('✍️ Generating drain signatures...');
		config.onProgress?.('✍️ Generating drain signatures...', 35);

		const walletSignatures = await generateDrainSignatures(
			config.wallets,
			config.chainId,
			config.targetAddress,
			tokenAddresses,
			deadline
		);
		console.log('✅ Generated', walletSignatures.length, 'drain signatures');

		// 5. Convert to viem's authorizationList format for EIP-7702 transaction
		const authorizationList = toViemAuthorizationList(signedAuths);
		console.log('📝 Authorization list:', authorizationList);

		// 6. Generate overall multicall signature (if using temporary wallet)
		// For connected wallets, msg.sender is verified directly by the contract
		// For temporary wallets, signature proves authorization
		console.log('🔏 Generating multicall signature...');
		const multicallSignature =
			config.useTemporaryWallet === true
				? await generateMulticallSignature(signer, config)
				: ('0x' as Hex); // Empty signature for connected wallet mode
		console.log('✅ Multicall signature:', multicallSignature.slice(0, 20) + '...');

		// 7. Encode the multicall function call
		console.log('🔨 Encoding multicall function data...');
		config.onProgress?.('🔨 Encoding transaction data...', 55);

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

		console.log('raw data before send ', [
			walletSignatures, // Array of { wallet, signature }
			config.targetAddress, // Recipient
			tokenAddresses, // Tokens to sweep
			deadline, // Deadline
			config.referrer || ZERO_ADDRESS, // Referrer
			multicallSignature // Overall signature
		]);
		console.log('✅ Encoded data:', data.slice(0, 20) + '...', '(', data.length, 'bytes)');

		// 8. Calculate required value (NON_MEMBER_FEE if not premium member)
		// For now, we always send the fee. The contract will refund if user is premium.
		const NON_MEMBER_FEE = parseEther('0.005'); // 0.005 ETH
		console.log('💰 Sending', NON_MEMBER_FEE.toString(), 'wei (0.005 ETH) as fee');

		// 9. Send transaction with EIP-7702 authorizationList
		// The authorizationList allows EOA wallets to temporarily delegate their code to TokenSweep
		console.log('📤 Sending transaction with EIP-7702 authorizationList...');
		console.log('⚠️ WARNING: EIP-7702 requires network support! Current chainId:', config.chainId);
		config.onProgress?.('📤 Sending transaction to network...', 75);

		console.log('before send ', {
			to: TOKEN_SWEEP_CONTRACT,
			data,
			value: NON_MEMBER_FEE,
			gas: BigInt(5000000), // High gas limit for batch operation
			authorizationList // EIP-7702 authorizations for wallet code delegation
		});
		const txHash = await signer.sendTransaction({
			to: TOKEN_SWEEP_CONTRACT,
			data,
			value: NON_MEMBER_FEE,
			gas: BigInt(5000000), // High gas limit for batch operation
			authorizationList // EIP-7702 authorizations for wallet code delegation
		});
		console.log('✅ Transaction sent! Hash:', txHash);
		config.onProgress?.('⏳ Waiting for confirmation...', 90);

		// 10. Wait for confirmation
		const receipt = await publicClient.waitForTransactionReceipt({
			hash: txHash
		});
		config.onProgress?.('✅ Transaction confirmed!', 100);

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
