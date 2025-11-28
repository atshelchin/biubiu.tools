#!/usr/bin/env bun

import { createWalletClient, createPublicClient, http, parseEther, type Address, type Chain } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

/**
 * Batch ETH transfer script
 * Usage: bun run batch-transfer <addresses-file> <amount-per-address> <rpc-url>
 *
 * Private key will be prompted via stdin
 * Chain ID will be automatically detected from RPC
 */

async function main() {
	const args = process.argv.slice(2);

	if (args.length < 3) {
		console.error('Usage: bun run batch-transfer <addresses-file> <amount-per-address-in-ETH> <rpc-url>');
		console.error('Example: bun run batch-transfer addresses.txt 0.01 https://eth.llamarpc.com');
		console.error('Example: bun run batch-transfer addresses.txt 0.01 https://rpc.ankr.com/eth');
		process.exit(1);
	}

	const [addressesFile, amountStr, rpcUrl] = args;

	// Read private key from stdin
	console.log('Enter private key (with or without 0x prefix):');
	const privateKeyInput = prompt('Private Key:');

	if (!privateKeyInput) {
		console.error('Private key is required');
		process.exit(1);
	}

	const privateKey = privateKeyInput.startsWith('0x')
		? privateKeyInput as `0x${string}`
		: `0x${privateKeyInput}` as `0x${string}`;

	// Parse amount
	const amount = parseFloat(amountStr);
	if (isNaN(amount) || amount <= 0) {
		console.error('Invalid amount. Must be a positive number.');
		process.exit(1);
	}

	// Read addresses from file
	let addresses: Address[];
	try {
		// Resolve file path relative to current working directory
		const filePath = resolve(process.cwd(), addressesFile);

		if (!existsSync(filePath)) {
			console.error(`File not found: ${filePath}`);
			console.error(`Current working directory: ${process.cwd()}`);
			process.exit(1);
		}

		const fileContent = readFileSync(filePath, 'utf-8');
		addresses = fileContent
			.split('\n')
			.map(line => line.trim())
			.filter(line => line.length > 0 && line.startsWith('0x'))
			.map(addr => addr as Address);

		if (addresses.length === 0) {
			console.error('No valid addresses found in file');
			process.exit(1);
		}

		console.log(`Found ${addresses.length} addresses from ${filePath}`);
	} catch (error) {
		console.error('Error reading addresses file:', error instanceof Error ? error.message : String(error));
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
		console.error('Failed to get chain ID from RPC:', error instanceof Error ? error.message : String(error));
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

	console.log(`\nSending from: ${account.address}`);
	console.log(`Amount per address: ${amount} ETH`);
	console.log(`Total addresses: ${addresses.length}`);
	console.log(`Total amount needed: ${amount * addresses.length} ETH (plus gas)\n`);

	// Confirm before proceeding
	const confirm = prompt('Proceed with transfers? (yes/no):');
	if (confirm?.toLowerCase() !== 'yes') {
		console.log('Cancelled');
		process.exit(0);
	}

	// Send transfers
	const results = [];
	for (let i = 0; i < addresses.length; i++) {
		const toAddress = addresses[i];
		console.log(`\n[${i + 1}/${addresses.length}] Sending ${amount} ETH to ${toAddress}...`);

		try {
			const hash = await client.sendTransaction({
				to: toAddress,
				value: parseEther(amount.toString())
			});

			console.log(`✓ Transaction sent: ${hash}`);
			results.push({ address: toAddress, success: true, hash });
		} catch (error) {
			console.error(`✗ Failed:`, error instanceof Error ? error.message : String(error));
			results.push({ address: toAddress, success: false, error: error instanceof Error ? error.message : String(error) });
		}
	}

	// Summary
	console.log('\n--- Summary ---');
	const successful = results.filter(r => r.success).length;
	const failed = results.filter(r => !r.success).length;

	console.log(`Successful: ${successful}`);
	console.log(`Failed: ${failed}`);

	if (failed > 0) {
		console.log('\nFailed addresses:');
		results.filter(r => !r.success).forEach(r => {
			console.log(`  ${r.address}`);
		});
	}
}

main().catch(error => {
	console.error('Fatal error:', error);
	process.exit(1);
});
