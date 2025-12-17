/**
 * Excel Export Utility for Token Balance Reports
 *
 * Generates an Excel workbook with multiple sheets,
 * each representing a token's balance distribution sorted by balance descending.
 */

import * as XLSX from 'xlsx';
import type { TokenStats } from '@/features/wallet-sweep/composables/use-token-stats.svelte';
import type { ImportedWallet } from '@/features/wallet-sweep/types/wallet';

interface WalletBalanceRow {
	Address: string;
	Balance: string;
	DerivationPath?: string;
}

/**
 * Format balance from smallest unit to human-readable format
 */
function formatBalance(balance: string, decimals: number): string {
	try {
		const balanceValue = BigInt(balance);
		const divisor = BigInt(10 ** decimals);
		const integerPart = balanceValue / divisor;
		const fractionalPart = balanceValue % divisor;

		if (fractionalPart === 0n) {
			return integerPart.toString();
		}

		const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
		// Remove trailing zeros
		const trimmedFractional = fractionalStr.replace(/0+$/, '');

		return `${integerPart}.${trimmedFractional}`;
	} catch {
		return balance;
	}
}

/**
 * Get balance for a specific token from wallet
 */
function getWalletTokenBalance(wallet: ImportedWallet, tokenId: string): string | undefined {
	if (!wallet.balances) return undefined;

	const isNative = tokenId.endsWith(':native');
	if (isNative) {
		return wallet.balances.native;
	}

	return wallet.balances.tokens?.[tokenId];
}

/**
 * Generate Excel workbook with token balance distribution
 *
 * @param stats - Token statistics array
 * @param wallets - Imported wallets with balances
 * @param networkName - Name of the network (for filename)
 * @returns void - triggers browser download
 */
export function exportTokenBalanceReport(
	stats: TokenStats[],
	wallets: ImportedWallet[],
	networkName: string = 'Network'
): void {
	// Create workbook
	const workbook = XLSX.utils.book_new();

	// Create a sheet for each token
	stats.forEach((stat) => {
		// Collect wallet balances for this token
		const walletBalances: Array<{
			address: string;
			balance: bigint;
			derivationPath?: string;
		}> = [];

		wallets.forEach((wallet) => {
			const balance = getWalletTokenBalance(wallet, stat.tokenId);
			if (balance && balance !== '0') {
				try {
					walletBalances.push({
						address: wallet.address,
						balance: BigInt(balance),
						derivationPath: wallet.derivationPath
					});
				} catch {
					// Skip invalid balance values
				}
			}
		});

		// Sort by balance descending
		walletBalances.sort((a, b) => {
			if (a.balance > b.balance) return -1;
			if (a.balance < b.balance) return 1;
			return 0;
		});

		// Convert to row data
		const rows: WalletBalanceRow[] = walletBalances.map((wb) => ({
			Address: wb.address,
			Balance: formatBalance(wb.balance.toString(), stat.decimals),
			...(wb.derivationPath ? { DerivationPath: wb.derivationPath } : {})
		}));

		// Create worksheet
		const worksheet = XLSX.utils.json_to_sheet(rows);

		// Set column widths
		worksheet['!cols'] = [
			{ wch: 44 }, // Address column
			{ wch: 20 }, // Balance column
			{ wch: 30 } // DerivationPath column
		];

		// Sanitize sheet name (Excel has 31 char limit and special char restrictions)
		let sheetName = stat.symbol;
		// Remove invalid characters
		sheetName = sheetName.replace(/[\\/*?[\]:]/g, '_');
		// Truncate to 31 characters
		if (sheetName.length > 31) {
			sheetName = sheetName.slice(0, 31);
		}

		// Add worksheet to workbook
		XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
	});

	// Generate filename with timestamp
	const timestamp = new Date().toISOString().slice(0, 10);
	const filename = `${networkName}_Token_Balances_${timestamp}.xlsx`;

	// Trigger download
	XLSX.writeFile(workbook, filename);
}

/**
 * Export summary sheet with all tokens overview
 */
export function exportTokenSummaryReport(
	stats: TokenStats[],
	wallets: ImportedWallet[],
	networkName: string = 'Network'
): void {
	// Create workbook
	const workbook = XLSX.utils.book_new();

	// Create summary sheet first
	const summaryRows = stats.map((stat) => ({
		Token: stat.symbol,
		'Contract Address': stat.address || 'Native',
		'Total Balance': formatBalance(stat.totalBalance.toString(), stat.decimals),
		'Wallet Count': stat.addressCount
	}));

	const summarySheet = XLSX.utils.json_to_sheet(summaryRows);
	summarySheet['!cols'] = [
		{ wch: 15 }, // Token
		{ wch: 44 }, // Contract Address
		{ wch: 25 }, // Total Balance
		{ wch: 15 } // Wallet Count
	];
	XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

	// Create detail sheets for each token
	stats.forEach((stat) => {
		const walletBalances: Array<{
			address: string;
			balance: bigint;
			derivationPath?: string;
		}> = [];

		wallets.forEach((wallet) => {
			const balance = getWalletTokenBalance(wallet, stat.tokenId);
			if (balance && balance !== '0') {
				try {
					walletBalances.push({
						address: wallet.address,
						balance: BigInt(balance),
						derivationPath: wallet.derivationPath
					});
				} catch {
					// Skip invalid balance values
				}
			}
		});

		walletBalances.sort((a, b) => {
			if (a.balance > b.balance) return -1;
			if (a.balance < b.balance) return 1;
			return 0;
		});

		const rows: WalletBalanceRow[] = walletBalances.map((wb) => ({
			Address: wb.address,
			Balance: formatBalance(wb.balance.toString(), stat.decimals),
			...(wb.derivationPath ? { DerivationPath: wb.derivationPath } : {})
		}));

		const worksheet = XLSX.utils.json_to_sheet(rows);
		worksheet['!cols'] = [{ wch: 44 }, { wch: 20 }, { wch: 30 }];

		let sheetName = stat.symbol;
		sheetName = sheetName.replace(/[\\/*?[\]:]/g, '_');
		if (sheetName.length > 31) {
			sheetName = sheetName.slice(0, 31);
		}

		XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
	});

	const timestamp = new Date().toISOString().slice(0, 10);
	const filename = `${networkName}_Token_Report_${timestamp}.xlsx`;

	XLSX.writeFile(workbook, filename);
}
