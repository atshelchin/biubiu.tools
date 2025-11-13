/**
 * EIP-7702 Authorization utilities for TokenSweep
 * https://eips.ethereum.org/EIPS/eip-7702
 */
import {
	type Address,
	type Hex,
	keccak256,
	encodeAbiParameters,
	parseAbiParameters,
	signatureToHex,
	hexToSignature,
	concat
} from 'viem';
import type { ImportedWallet } from '../types/wallet';
import { walletKeysStore } from '../stores/wallet-keys-store.svelte';

export const TOKEN_SWEEP_CONTRACT = '0x28ab612a3a871EA203aDff9a7b0846C395529239' as Address;

/**
 * EIP-7702 Authorization structure
 */
export interface EIP7702Authorization {
	chainId: bigint;
	address: Address; // Contract address to delegate to
	nonce: bigint; // Wallet nonce
}

/**
 * Signed authorization with signature
 */
export interface SignedAuthorization {
	authorization: EIP7702Authorization;
	signature: Hex;
}

/**
 * Generate EIP-7702 authorization hash
 * The authorization allows a wallet to temporarily delegate its code to a contract
 */
export function getAuthorizationHash(auth: EIP7702Authorization): Hex {
	// EIP-7702 magic = 0x05
	const magic = '0x05' as Hex;

	// Encode: magic || rlp([chainId, address, nonce])
	// For simplicity, we use ABI encoding instead of RLP
	const encoded = encodeAbiParameters(
		parseAbiParameters('uint256 chainId, address contractAddress, uint256 nonce'),
		[auth.chainId, auth.address, auth.nonce]
	);

	const data = concat([magic, encoded]);
	return keccak256(data);
}

/**
 * Sign EIP-7702 authorization
 * This signature proves the wallet owner authorizes the code delegation
 */
export async function signAuthorization(
	wallet: ImportedWallet,
	contractAddress: Address,
	chainId: number,
	nonce: bigint
): Promise<SignedAuthorization> {
	const authorization: EIP7702Authorization = {
		chainId: BigInt(chainId),
		address: contractAddress,
		nonce
	};

	const hash = getAuthorizationHash(authorization);

	// Sign the authorization hash with wallet's private key from the keys store
	const signature = await walletKeysStore.signMessage(wallet.address, hash);

	return {
		authorization,
		signature: signature as Hex
	};
}

/**
 * Batch sign authorizations for multiple wallets
 */
export async function batchSignAuthorizations(
	wallets: ImportedWallet[],
	contractAddress: Address,
	chainId: number,
	startNonce: bigint = 0n
): Promise<SignedAuthorization[]> {
	const authorizations: SignedAuthorization[] = [];

	for (let i = 0; i < wallets.length; i++) {
		const wallet = wallets[i];
		const nonce = startNonce + BigInt(i);

		const signedAuth = await signAuthorization(wallet, contractAddress, chainId, nonce);
		authorizations.push(signedAuth);
	}

	return authorizations;
}

/**
 * Convert signed authorization to contract format
 * Format: { wallet: address, signature: bytes }
 */
export interface WalletSignature {
	wallet: Address;
	signature: Hex;
}

export function authorizationToWalletSignature(
	walletAddress: Address,
	signedAuth: SignedAuthorization
): WalletSignature {
	return {
		wallet: walletAddress,
		signature: signedAuth.signature
	};
}

/**
 * Batch convert authorizations to wallet signatures for contract call
 */
export function authorizationsToWalletSignatures(
	wallets: ImportedWallet[],
	signedAuths: SignedAuthorization[]
): WalletSignature[] {
	return wallets.map((wallet, i) => ({
		wallet: wallet.address,
		signature: signedAuths[i].signature
	}));
}
