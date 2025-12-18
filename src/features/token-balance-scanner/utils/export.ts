/**
 * Export utilities for token balance scan results
 * Supports CSV, JSON, and Excel formats
 */

import Papa from 'papaparse';
import type { AddressBalance, ScanSummary, TokenTotal } from '../types/scanner';
import type { TokenConfig } from '$lib/services/balance-scanner/types';
import { formatUnits } from 'viem';

/**
 * Export options
 */
export interface ExportOptions {
	/** Include addresses with zero balance */
	includeZeroBalance?: boolean;
	/** Network name for file naming */
	networkName?: string;
	/** Custom filename (without extension) */
	filename?: string;
}

/**
 * Flattened row for CSV/Excel export
 */
interface ExportRow {
	address: string;
	hasBalance: boolean;
	[tokenSymbol: string]: string | boolean;
}

/**
 * Format bigint balance for display
 */
function formatBalance(balance: bigint, decimals: number): string {
	return formatUnits(balance, decimals);
}

/**
 * Build token symbol map from configs
 */
function buildTokenMap(tokens: TokenConfig[]): Map<string, { symbol: string; decimals: number }> {
	const map = new Map<string, { symbol: string; decimals: number }>();
	for (const token of tokens) {
		map.set(token.id, {
			symbol: token.symbol || token.id,
			decimals: token.decimals
		});
	}
	return map;
}

/**
 * Convert results to flat row format for CSV/Excel
 */
function resultsToRows(
	results: AddressBalance[],
	tokens: TokenConfig[],
	options: ExportOptions = {}
): ExportRow[] {
	const { includeZeroBalance = true } = options;
	const tokenMap = buildTokenMap(tokens);

	const rows: ExportRow[] = [];

	for (const result of results) {
		// Skip zero balance if option is set
		if (!includeZeroBalance && !result.hasBalance) {
			continue;
		}

		const row: ExportRow = {
			address: result.address,
			hasBalance: result.hasBalance
		};

		// Add balance for each token
		for (const token of tokens) {
			const tokenInfo = tokenMap.get(token.id);
			const symbol = tokenInfo?.symbol || token.id;
			const decimals = tokenInfo?.decimals || 18;

			const balance = result.balances.find((b) => b.tokenId === token.id);
			row[symbol] = balance ? formatBalance(balance.balance, decimals) : '0';
		}

		rows.push(row);
	}

	return rows;
}

/**
 * Generate filename with timestamp
 */
function generateFilename(options: ExportOptions, format: string): string {
	const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
	const network = options.networkName || 'balances';
	const base = options.filename || `${network}_scan_${timestamp}`;
	return `${base}.${format}`;
}

/**
 * Trigger file download in browser
 */
function downloadFile(content: Blob, filename: string): void {
	const url = URL.createObjectURL(content);
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

// ============================================================================
// CSV Export
// ============================================================================

/**
 * Export results to CSV format
 */
export function exportToCSV(
	results: AddressBalance[],
	tokens: TokenConfig[],
	options: ExportOptions = {}
): void {
	const rows = resultsToRows(results, tokens, options);

	const csv = Papa.unparse(rows, {
		header: true,
		quotes: true
	});

	const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
	const filename = generateFilename(options, 'csv');
	downloadFile(blob, filename);
}

/**
 * Get CSV content as string (for preview or copy)
 */
export function getCSVContent(
	results: AddressBalance[],
	tokens: TokenConfig[],
	options: ExportOptions = {}
): string {
	const rows = resultsToRows(results, tokens, options);

	return Papa.unparse(rows, {
		header: true,
		quotes: true
	});
}

// ============================================================================
// JSON Export
// ============================================================================

/**
 * JSON export data structure
 */
interface JSONExportData {
	exportedAt: string;
	network: string;
	summary: {
		totalAddresses: number;
		addressesWithBalance: number;
		totalTokens: number;
		tokenTotals: Array<{
			symbol: string;
			tokenId: string;
			totalBalance: string;
			walletsWithBalance: number;
		}>;
	} | null;
	tokens: Array<{
		id: string;
		symbol: string;
		decimals: number;
		address?: string;
	}>;
	results: Array<{
		address: string;
		hasBalance: boolean;
		balances: Array<{
			tokenId: string;
			symbol: string;
			balance: string;
			formatted: string;
		}>;
	}>;
}

/**
 * Export results to JSON format
 */
export function exportToJSON(
	results: AddressBalance[],
	tokens: TokenConfig[],
	summary: ScanSummary | null,
	options: ExportOptions = {}
): void {
	const data = getJSONData(results, tokens, summary, options);
	const json = JSON.stringify(data, null, 2);

	const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
	const filename = generateFilename(options, 'json');
	downloadFile(blob, filename);
}

/**
 * Get JSON data structure (for preview or further processing)
 */
export function getJSONData(
	results: AddressBalance[],
	tokens: TokenConfig[],
	summary: ScanSummary | null,
	options: ExportOptions = {}
): JSONExportData {
	const { includeZeroBalance = true, networkName = 'Unknown' } = options;
	const tokenMap = buildTokenMap(tokens);

	const filteredResults = includeZeroBalance ? results : results.filter((r) => r.hasBalance);

	return {
		exportedAt: new Date().toISOString(),
		network: networkName,
		summary: summary
			? {
					totalAddresses: summary.totalWallets,
					addressesWithBalance: summary.walletsWithBalance,
					totalTokens: summary.totalTokens,
					tokenTotals: summary.tokenTotals.map((t) => ({
						symbol: t.symbol,
						tokenId: t.tokenId,
						totalBalance: t.formattedTotal,
						walletsWithBalance: t.walletsWithBalance
					}))
				}
			: null,
		tokens: tokens.map((t) => ({
			id: t.id,
			symbol: t.symbol || t.id,
			decimals: t.decimals,
			address: t.address
		})),
		results: filteredResults.map((r) => ({
			address: r.address,
			hasBalance: r.hasBalance,
			balances: r.balances.map((b) => {
				const tokenInfo = tokenMap.get(b.tokenId);
				return {
					tokenId: b.tokenId,
					symbol: tokenInfo?.symbol || b.tokenId,
					balance: b.balance.toString(),
					formatted: formatBalance(b.balance, tokenInfo?.decimals || 18)
				};
			})
		}))
	};
}

// ============================================================================
// Excel Export
// ============================================================================

/**
 * Export results to Excel format
 */
export async function exportToExcel(
	results: AddressBalance[],
	tokens: TokenConfig[],
	summary: ScanSummary | null,
	options: ExportOptions = {}
): Promise<void> {
	// Dynamic import to reduce initial bundle size
	const XLSX = await import('xlsx');

	const workbook = XLSX.utils.book_new();
	const tokenMap = buildTokenMap(tokens);

	// Sheet 1: Results
	const rows = resultsToRows(results, tokens, options);
	const resultsSheet = XLSX.utils.json_to_sheet(rows);

	// Auto-width columns
	const colWidths = Object.keys(rows[0] || {}).map((key) => ({
		wch: Math.max(key.length, 15)
	}));
	resultsSheet['!cols'] = colWidths;

	XLSX.utils.book_append_sheet(workbook, resultsSheet, 'Balances');

	// Sheet 2: Summary (if available)
	if (summary) {
		const summaryData = [
			['Token Balance Scan Summary'],
			[''],
			['Total Addresses', summary.totalWallets],
			['Addresses with Balance', summary.walletsWithBalance],
			['Total Tokens Scanned', summary.totalTokens],
			['Scan Duration (ms)', summary.scanDuration],
			['Success Count', summary.successCount],
			['Failure Count', summary.failureCount],
			[''],
			['Token Totals'],
			['Symbol', 'Token ID', 'Total Balance', 'Wallets with Balance']
		];

		for (const tokenTotal of summary.tokenTotals) {
			summaryData.push([
				tokenTotal.symbol,
				tokenTotal.tokenId,
				tokenTotal.formattedTotal,
				tokenTotal.walletsWithBalance
			] as (string | number)[]);
		}

		const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
		summarySheet['!cols'] = [{ wch: 25 }, { wch: 40 }, { wch: 25 }, { wch: 20 }];
		XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
	}

	// Sheet 3: Token Info
	const tokenData: (string | number)[][] = [
		['Token Information'],
		[''],
		['Symbol', 'Token ID', 'Decimals', 'Contract Address']
	];

	for (const token of tokens) {
		const info = tokenMap.get(token.id);
		tokenData.push([
			info?.symbol || token.id,
			token.id,
			token.decimals,
			token.address || 'Native Token'
		]);
	}

	const tokenSheet = XLSX.utils.aoa_to_sheet(tokenData);
	tokenSheet['!cols'] = [{ wch: 15 }, { wch: 50 }, { wch: 10 }, { wch: 50 }];
	XLSX.utils.book_append_sheet(workbook, tokenSheet, 'Tokens');

	// Generate Excel file
	const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
	const blob = new Blob([excelBuffer], {
		type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
	});

	const filename = generateFilename(options, 'xlsx');
	downloadFile(blob, filename);
}

// ============================================================================
// Export Summary for Quick Copy
// ============================================================================

/**
 * Generate a text summary for quick copy to clipboard
 */
export function generateTextSummary(
	summary: ScanSummary,
	tokenTotals: TokenTotal[],
	networkName: string
): string {
	const lines: string[] = [
		`Token Balance Scan Summary - ${networkName}`,
		`Scanned at: ${new Date().toLocaleString()}`,
		'',
		`Total Addresses: ${summary.totalWallets}`,
		`Addresses with Balance: ${summary.walletsWithBalance}`,
		`Tokens Scanned: ${summary.totalTokens}`,
		'',
		'Token Totals:'
	];

	for (const token of tokenTotals) {
		lines.push(
			`  ${token.symbol}: ${token.formattedTotal} (${token.walletsWithBalance} addresses)`
		);
	}

	lines.push('');
	lines.push(`Scan Duration: ${(summary.scanDuration / 1000).toFixed(1)}s`);
	lines.push(`Success: ${summary.successCount}, Failed: ${summary.failureCount}`);

	return lines.join('\n');
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		// Fallback for older browsers
		const textArea = document.createElement('textarea');
		textArea.value = text;
		textArea.style.position = 'fixed';
		textArea.style.left = '-9999px';
		document.body.appendChild(textArea);
		textArea.select();
		try {
			document.execCommand('copy');
			return true;
		} catch {
			return false;
		} finally {
			document.body.removeChild(textArea);
		}
	}
}
