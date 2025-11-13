/**
 * EIP-7702 Authorization utilities for TokenSweep
 * https://eips.ethereum.org/EIPS/eip-7702
 */
import { type Address, type Hex, type PublicClient, keccak256, encodeAbiParameters } from 'viem';
import type { SignedAuthorizationList } from 'viem';
import type { ImportedWallet } from '../types/wallet';
import { walletKeysStore } from '../stores/wallet-keys-store.svelte';

export const TOKEN_SWEEP_CONTRACT = '0x28ab612a3a871EA203aDff9a7b0846C395529239' as Address;

/**
 * EIP-7702 Authorization tuple structure for viem
 */
export interface EIP7702AuthorizationTuple {
	chainId: number;
	address: Address; // Contract address to delegate to
	nonce: number; // Wallet nonce
	r: Hex;
	s: Hex;
	yParity: number;
}

/**
 * Sign EIP-7702 authorization using viem's native signAuthorization method
 * This properly creates the authorization signature according to EIP-7702
 */
export async function signAuthorization(
	wallet: ImportedWallet,
	contractAddress: Address,
	chainId: number,
	nonce: number
): Promise<EIP7702AuthorizationTuple> {
	// Get the viem account from stored private key
	const account = walletKeysStore.getAccount(wallet.address);

	// Use viem's native signAuthorization method
	const authorization = await account.signAuthorization({
		contractAddress,
		chainId,
		nonce
	});

	return {
		chainId,
		nonce: Number(authorization.nonce),
		address: contractAddress,
		r: authorization.r,
		s: authorization.s,
		yParity: authorization.yParity || 0
	};
}

/**
 * Batch sign authorizations for multiple wallets
 * Each wallet gets its actual nonce from the blockchain
 */
export async function batchSignAuthorizations(
	publicClient: PublicClient,
	wallets: ImportedWallet[],
	contractAddress: Address,
	chainId: number
): Promise<EIP7702AuthorizationTuple[]> {
	const authorizations: EIP7702AuthorizationTuple[] = [];

	for (const wallet of wallets) {
		// Get the actual nonce from the blockchain for this wallet
		const nonce = await publicClient.getTransactionCount({ address: wallet.address });

		const signedAuth = await signAuthorization(wallet, contractAddress, chainId, Number(nonce));
		authorizations.push(signedAuth);
	}

	return authorizations;
}

/**
 * Wallet signature structure for contract multicall
 * Format: { wallet: address, v: uint8, r: bytes32, s: bytes32 }
 */
export interface WalletSignature {
	wallet: Address;
	v: number;
	r: Hex;
	s: Hex;
}

/**
 * Generate drainToAddress signature for a single wallet
 * Signs: keccak256(abi.encode(chainId, address(this), recipient, tokens, deadline))
 */
async function generateDrainSignature(
	wallet: ImportedWallet,
	chainId: number,
	recipient: Address,
	tokens: Address[],
	deadline: bigint
): Promise<{ v: number; r: Hex; s: Hex }> {
	const account = walletKeysStore.getAccount(wallet.address);

	// Build message hash matching contract's _verifyDrainSignature
	// keccak256(abi.encode(chainId, address(this), recipient, tokens, deadline))
	const messageHash = keccak256(
		encodeAbiParameters(
			[
				{ type: 'uint256', name: 'chainId' },
				{ type: 'address', name: 'addressThis' },
				{ type: 'address', name: 'recipient' },
				{ type: 'address[]', name: 'tokens' },
				{ type: 'uint256', name: 'deadline' }
			],
			[BigInt(chainId), wallet.address, recipient, tokens, deadline]
		)
	);

	// Sign the message hash
	const signature = await account.signMessage({
		message: { raw: messageHash }
	});

	// Parse signature components
	const r = `0x${signature.slice(2, 66)}` as Hex;
	const s = `0x${signature.slice(66, 130)}` as Hex;
	const v = parseInt(signature.slice(130, 132), 16);

	return { v, r, s };
}

/**
 * Generate drainToAddress signatures for all wallets
 * Each wallet signs the drain operation parameters
 */
export async function generateDrainSignatures(
	wallets: ImportedWallet[],
	chainId: number,
	recipient: Address,
	tokens: Address[],
	deadline: bigint
): Promise<WalletSignature[]> {
	const signatures: WalletSignature[] = [];

	for (const wallet of wallets) {
		const { v, r, s } = await generateDrainSignature(wallet, chainId, recipient, tokens, deadline);

		signatures.push({
			wallet: wallet.address,
			v,
			r,
			s
		});
	}

	return signatures;
}

/**
 * Convert EIP-7702 authorization tuples to viem's SignedAuthorizationList format
 * This is used in the authorizationList field of sendTransaction for EIP-7702
 */
export function toViemAuthorizationList(
	authorizations: EIP7702AuthorizationTuple[]
): SignedAuthorizationList {
	return authorizations as SignedAuthorizationList;
}
