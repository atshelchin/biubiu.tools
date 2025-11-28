#!/usr/bin/env bun

import {
	createWalletClient,
	createPublicClient,
	http,
	parseUnits,
	type Address,
	type Chain
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// bun run batch-transfer-erc20 addresses.txt 1000 0x425bC230d8782ECbb66d9E18e06e4c1284611979 localhost:8545

/**
 * Batch ERC20 token transfer script
 * Usage: bun run batch-transfer-erc20 <addresses-file> <amount-per-address> <token-address> <rpc-url>
 *
 * Private key will be prompted via stdin
 * Token decimals will be automatically fetched from the contract
 */

// ERC20 ABI for transfer and decimals
const ERC20_ABI = [
	{
		constant: true,
		inputs: [],
		name: 'decimals',
		outputs: [{ name: '', type: 'uint8' }],
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'symbol',
		outputs: [{ name: '', type: 'string' }],
		type: 'function'
	},
	{
		constant: true,
		inputs: [{ name: '_owner', type: 'address' }],
		name: 'balanceOf',
		outputs: [{ name: 'balance', type: 'uint256' }],
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{ name: '_to', type: 'address' },
			{ name: '_value', type: 'uint256' }
		],
		name: 'transfer',
		outputs: [{ name: '', type: 'bool' }],
		type: 'function'
	}
] as const;

async function main() {
	const args = process.argv.slice(2);

	if (args.length < 4) {
		console.error(
			'Usage: bun run batch-transfer-erc20 <addresses-file> <amount-per-address> <token-address> <rpc-url>'
		);
		console.error(
			'Example: bun run batch-transfer-erc20 addresses.txt 100 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 https://eth.llamarpc.com'
		);
		process.exit(1);
	}

	const [addressesFile, amountStr, tokenAddress, rpcUrl] = args;

	// Validate token address
	if (!tokenAddress.startsWith('0x') || tokenAddress.length !== 42) {
		console.error('Invalid token address. Must be a valid Ethereum address (0x...)');
		process.exit(1);
	}

	// Read private key from stdin
	console.log('Enter private key (with or without 0x prefix):');
	const privateKeyInput = prompt('Private Key:');

	if (!privateKeyInput) {
		console.error('Private key is required');
		process.exit(1);
	}

	const privateKey = privateKeyInput.startsWith('0x')
		? (privateKeyInput as `0x${string}`)
		: (`0x${privateKeyInput}` as `0x${string}`);

	// Parse amount
	const amount = parseFloat(amountStr);
	if (isNaN(amount) || amount <= 0) {
		console.error('Invalid amount. Must be a positive number.');
		process.exit(1);
	}

	// Read addresses from file
	let addresses: Address[];
	try {
		const filePath = resolve(process.cwd(), addressesFile);

		if (!existsSync(filePath)) {
			console.error(`File not found: ${filePath}`);
			console.error(`Current working directory: ${process.cwd()}`);
			process.exit(1);
		}

		const fileContent = readFileSync(filePath, 'utf-8');
		addresses = fileContent
			.split('\n')
			.map((line) => line.trim())
			.filter((line) => line.length > 0 && line.startsWith('0x'))
			.map((addr) => addr as Address);

		if (addresses.length === 0) {
			console.error('No valid addresses found in file');
			process.exit(1);
		}

		console.log(`Found ${addresses.length} addresses from ${filePath}`);
	} catch (error) {
		console.error(
			'Error reading addresses file:',
			error instanceof Error ? error.message : String(error)
		);
		process.exit(1);
	}

	// Get chain ID from RPC
	console.log('\nConnecting to RPC and detecting chain ID...');
	const publicClient = createPublicClient({
		transport: http(rpcUrl)
	});

	let chainId: number;
	try {
		chainId = await publicClient.getChainId();
		console.log(`Detected chain ID: ${chainId}`);
	} catch (error) {
		console.error(
			'Failed to get chain ID from RPC:',
			error instanceof Error ? error.message : String(error)
		);
		process.exit(1);
	}

	// Get token info
	console.log('\nFetching token information...');
	let decimals: number;
	let symbol: string;
	let balance: bigint;

	try {
		const [decimalsResult, symbolResult] = await Promise.all([
			publicClient.readContract({
				address: tokenAddress as Address,
				abi: ERC20_ABI,
				functionName: 'decimals'
			}),
			publicClient.readContract({
				address: tokenAddress as Address,
				abi: ERC20_ABI,
				functionName: 'symbol'
			})
		]);

		decimals = decimalsResult;
		symbol = symbolResult;

		console.log(`Token: ${symbol}`);
		console.log(`Decimals: ${decimals}`);
	} catch (error) {
		console.error(
			'Failed to fetch token info. Make sure the token address is correct:',
			error instanceof Error ? error.message : String(error)
		);
		process.exit(1);
	}

	// Create account and wallet client
	const account = privateKeyToAccount(privateKey);

	// Create custom chain config
	const chain: Chain = {
		id: chainId,
		name: `Chain ${chainId}`,
		nativeCurrency: {
			name: 'Ether',
			symbol: 'ETH',
			decimals: 18
		},
		rpcUrls: {
			default: { http: [rpcUrl] },
			public: { http: [rpcUrl] }
		}
	};

	const client = createWalletClient({
		account,
		chain,
		transport: http(rpcUrl)
	});

	// Check balance
	try {
		balance = await publicClient.readContract({
			address: tokenAddress as Address,
			abi: ERC20_ABI,
			functionName: 'balanceOf',
			args: [account.address]
		});

		const balanceFormatted = Number(balance) / Math.pow(10, decimals);
		console.log(`Your ${symbol} balance: ${balanceFormatted}`);

		const totalNeeded = amount * addresses.length;
		if (balanceFormatted < totalNeeded) {
			console.error(
				`\nInsufficient balance! You need ${totalNeeded} ${symbol} but only have ${balanceFormatted} ${symbol}`
			);
			process.exit(1);
		}
	} catch (error) {
		console.error(
			'Failed to check token balance:',
			error instanceof Error ? error.message : String(error)
		);
		process.exit(1);
	}

	console.log(`\nSending from: ${account.address}`);
	console.log(`Token: ${symbol} (${tokenAddress})`);
	console.log(`Amount per address: ${amount} ${symbol}`);
	console.log(`Total addresses: ${addresses.length}`);
	console.log(`Total amount needed: ${amount * addresses.length} ${symbol}\n`);

	// Confirm before proceeding
	const confirm = prompt('Proceed with transfers? (yes/no):');
	if (confirm?.toLowerCase() !== 'yes') {
		console.log('Cancelled');
		process.exit(0);
	}

	// Calculate amount in token's smallest unit
	const amountInUnits = parseUnits(amount.toString(), decimals);

	// Send transfers
	const results = [];
	for (let i = 0; i < addresses.length; i++) {
		const toAddress = addresses[i];
		console.log(`\n[${i + 1}/${addresses.length}] Sending ${amount} ${symbol} to ${toAddress}...`);

		try {
			const hash = await client.writeContract({
				address: tokenAddress as Address,
				abi: ERC20_ABI,
				functionName: 'transfer',
				args: [toAddress, amountInUnits]
			});

			console.log(`✓ Transaction sent: ${hash}`);
			results.push({ address: toAddress, success: true, hash });
		} catch (error) {
			console.error(`✗ Failed:`, error instanceof Error ? error.message : String(error));
			results.push({
				address: toAddress,
				success: false,
				error: error instanceof Error ? error.message : String(error)
			});
		}
	}

	// Summary
	console.log('\n--- Summary ---');
	const successful = results.filter((r) => r.success).length;
	const failed = results.filter((r) => !r.success).length;

	console.log(`Successful: ${successful}`);
	console.log(`Failed: ${failed}`);

	if (failed > 0) {
		console.log('\nFailed addresses:');
		results
			.filter((r) => !r.success)
			.forEach((r) => {
				console.log(`  ${r.address}`);
			});
	}
}

main().catch((error) => {
	console.error('Fatal error:', error);
	process.exit(1);
});
