import type { WalletClient, PublicClient, Address, Hex } from 'viem';
import { encodeDeployData, encodePacked, keccak256, parseAbi } from 'viem';
import { CREATE2_PROXY_ADDRESS } from './dependency-checker';

/**
 * Calculate CREATE2 deterministic contract address
 * @param salt - Salt for deterministic deployment
 * @param initCode - Contract bytecode + constructor args
 * @returns Predicted contract address
 */
export function calculateCreate2Address(salt: Hex, initCode: Hex): Address {
	// CREATE2 address formula: keccak256(0xff ++ address ++ salt ++ keccak256(init_code))[12:]
	const hash = keccak256(
		encodePacked(
			['bytes1', 'address', 'bytes32', 'bytes32'],
			['0xff', CREATE2_PROXY_ADDRESS, salt, keccak256(initCode)]
		)
	);

	return `0x${hash.slice(-40)}` as Address;
}

/**
 * Parse ABI (supports JSON or human-readable format)
 */
export function parseAbiInput(abiInput: string): unknown[] {
	try {
		// Try JSON format first
		const parsed = JSON.parse(abiInput);
		if (Array.isArray(parsed)) {
			return parsed;
		}
		throw new Error('ABI must be an array');
	} catch {
		// Try human-readable format
		try {
			return parseAbi([abiInput]);
		} catch (error) {
			throw new Error(
				`Invalid ABI format: ${error instanceof Error ? error.message : String(error)}`
			);
		}
	}
}

/**
 * Encode constructor arguments
 */
export function encodeConstructorArgs(abi: unknown[], bytecode: Hex, args: unknown[]): Hex {
	try {
		return encodeDeployData({
			abi,
			bytecode,
			args
		});
	} catch (error) {
		throw new Error(
			`Failed to encode constructor args: ${error instanceof Error ? error.message : String(error)}`
		);
	}
}

/**
 * Deploy contract via CREATE2 Proxy
 */
export async function deployViaCreate2(
	walletClient: WalletClient,
	publicClient: PublicClient,
	bytecode: Hex,
	abi: unknown[],
	constructorArgs: unknown[],
	salt: Hex
): Promise<{ contractAddress: Address; transactionHash: Hex }> {
	// 1. Encode init code (bytecode + constructor args)
	const initCode = encodeConstructorArgs(abi, bytecode, constructorArgs);

	// 2. Calculate predicted address
	const predictedAddress = calculateCreate2Address(salt, initCode);

	// 3. Deploy via CREATE2 Proxy
	// The proxy expects: function deploy(bytes memory code, uint256 salt)
	const hash = await walletClient.sendTransaction({
		to: CREATE2_PROXY_ADDRESS,
		data: encodePacked(['bytes', 'bytes32'], [initCode, salt]),
		chain: walletClient.chain,
		account: walletClient.account!
	});

	// 4. Wait for transaction confirmation
	await publicClient.waitForTransactionReceipt({ hash });

	return {
		contractAddress: predictedAddress,
		transactionHash: hash
	};
}
