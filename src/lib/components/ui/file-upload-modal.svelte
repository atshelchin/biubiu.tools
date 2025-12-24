<script lang="ts">
	import { Upload, File as FileIcon, X } from '@lucide/svelte';
	import { useI18n } from '@shelchin/i18n';
	import { SvelteMap, SvelteSet } from 'svelte/reactivity';
	import Modal from './modal.svelte';

	interface Props {
		open: boolean;
		columnCount?: number; // 需要选择几列（0=纯文本，1+=表格列选择）
		columnLabels?: string[]; // 列标签，如 ['Address', 'Amount']
		onClose: () => void;
		onConfirm: (content: string) => void;
	}

	let { open, columnCount = 0, columnLabels = [], onClose, onConfirm }: Props = $props();

	const i18n = useI18n();

	// File upload state
	let isDragging = $state(false);
	let uploadedFile = $state<File | null>(null);
	let fileContent = $state('');
	let isProcessing = $state(false);
	let error = $state('');
	let parseMode = $state<'text' | 'table'>('text'); // 解析模式选择

	// Table data state
	let tableHeaders = $state<string[]>([]);
	let tableRows = $state<string[][]>([]);
	let selectedColumns = new SvelteMap<number, number>(); // columnIndex -> position (1, 2, 3...)

	// Preview limit
	const PREVIEW_ROWS = 10;

	// Reset state when modal opens/closes
	$effect(() => {
		if (!open) {
			resetState();
		}
	});

	function resetState() {
		uploadedFile = null;
		fileContent = '';
		isProcessing = false;
		error = '';
		parseMode = 'text';
		tableHeaders = [];
		tableRows = [];
		selectedColumns = new SvelteMap();
		isDragging = false;
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
	}

	async function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;

		const files = e.dataTransfer?.files;
		if (files && files.length > 0) {
			await processFile(files[0]);
		}
	}

	async function handleFileInput(e: Event) {
		const input = e.target as HTMLInputElement;
		const files = input.files;
		if (files && files.length > 0) {
			await processFile(files[0]);
		}
	}

	async function processFile(file: File) {
		uploadedFile = file;
		isProcessing = true;
		error = '';

		try {
			const ext = file.name.split('.').pop()?.toLowerCase();

			if (ext === 'txt') {
				await processTextFile(file);
			} else if (ext === 'csv') {
				await processCsvFile(file);
			} else if (ext === 'xlsx' || ext === 'xls') {
				await processExcelFile(file);
			} else {
				error = i18n.t('components.file_upload.error_unsupported_format');
			}
		} catch (err) {
			error = err instanceof Error ? err.message : String(err);
		} finally {
			isProcessing = false;
		}
	}

	async function processTextFile(file: File) {
		const text = await file.text();
		fileContent = text;

		const lines = text.split('\n').filter((line) => line.trim());
		if (lines.length === 0) {
			throw new Error(i18n.t('components.file_upload.error_empty_file'));
		}

		// Parse as table if user selected table mode OR if multi-column selection is required
		if (parseMode === 'table' || columnCount >= 2) {
			await parseAsTable(text);
		}
	}

	async function parseAsTable(text: string) {
		const lines = text.split('\n').filter((line) => line.trim());

		// Detect delimiter (try common ones: comma, tab, space, pipe)
		const delimiters = [',', '\t', ' ', '|', ';'];
		let bestDelimiter = ',';
		let maxColumns = 0;

		for (const delimiter of delimiters) {
			const firstLineColumns = lines[0].split(delimiter).length;
			if (firstLineColumns > maxColumns) {
				maxColumns = firstLineColumns;
				bestDelimiter = delimiter;
			}
		}

		// Use papaparse for reliable parsing
		const Papa = await import('papaparse');
		const result = Papa.parse(text, {
			delimiter: bestDelimiter,
			skipEmptyLines: true
		});

		if (result.data.length > 0) {
			const firstRow = result.data[0] as string[];

			// Check if first row looks like a header (contains non-numeric strings)
			const hasHeader = firstRow.some(
				(cell) => cell && isNaN(Number(cell)) && cell.trim().length > 0
			);

			if (hasHeader) {
				// First row is header
				tableHeaders = firstRow.map((h) => String(h || ''));
				tableRows = result.data.slice(1, PREVIEW_ROWS + 1) as string[][];
			} else {
				// No header, generate column names
				tableHeaders = firstRow.map((_cell, i) =>
					i18n.t('components.file_upload.generated_column', { index: i + 1 })
				);
				tableRows = result.data.slice(0, PREVIEW_ROWS) as string[][];
			}

			// Update fileContent for proper export
			fileContent = result.data.map((row) => (Array.isArray(row) ? row.join(',') : row)).join('\n');
		}
	}

	async function processCsvFile(file: File) {
		// Dynamic import to avoid bundling if not used
		const Papa = await import('papaparse');

		const text = await file.text();
		fileContent = text;

		// Only parse as table if user selected table mode OR if columnCount > 0 (table mode required)
		if (parseMode === 'table' || columnCount > 0) {
			const result = Papa.parse(text, {
				header: true,
				skipEmptyLines: true
			});

			if (result.errors.length > 0) {
				throw new Error(result.errors[0].message);
			}

			tableHeaders = result.meta.fields || [];
			tableRows = (result.data as Record<string, string>[])
				.slice(0, PREVIEW_ROWS)
				.map((row) => tableHeaders.map((header) => row[header] || ''));

			// Full data for export
			fileContent = Papa.unparse(result.data);
		}
	}

	async function processExcelFile(file: File) {
		// Dynamic import
		const XLSX = await import('xlsx');

		const arrayBuffer = await file.arrayBuffer();
		const workbook = XLSX.read(arrayBuffer, { type: 'array' });

		// Get first sheet
		const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
		const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as string[][];

		if (jsonData.length === 0) {
			throw new Error(i18n.t('components.file_upload.error_empty_file'));
		}

		// Only parse as table if user selected table mode OR if columnCount > 0 (table mode required)
		if (parseMode === 'table' || columnCount > 0) {
			const firstRow = jsonData[0];
			// Check if first row looks like a header
			const hasHeader = firstRow.some(
				(cell) => cell && isNaN(Number(cell)) && String(cell).trim().length > 0
			);

			if (hasHeader) {
				tableHeaders = firstRow.map((h) => String(h || ''));
				tableRows = jsonData.slice(1, PREVIEW_ROWS + 1);
			} else {
				// Generate column names
				tableHeaders = firstRow.map((_cell, i) =>
					i18n.t('components.file_upload.generated_column', { index: i + 1 })
				);
				tableRows = jsonData.slice(0, PREVIEW_ROWS);
			}
		}

		// Full data for export (always store as CSV format)
		const fullData = jsonData.slice(1);
		fileContent = fullData.map((row) => row.join(',')).join('\n');
	}

	async function handleParseModeChange(mode: 'text' | 'table') {
		parseMode = mode;
		tableHeaders = [];
		tableRows = [];
		selectedColumns = new SvelteMap();

		if (uploadedFile && mode === 'table') {
			// Re-process file in table mode
			isProcessing = true;
			try {
				const ext = uploadedFile.name.split('.').pop()?.toLowerCase();
				if (ext === 'txt') {
					await parseAsTable(fileContent);
				} else if (ext === 'csv') {
					await processCsvFile(uploadedFile);
				} else if (ext === 'xlsx' || ext === 'xls') {
					await processExcelFile(uploadedFile);
				}
			} catch (err) {
				error = err instanceof Error ? err.message : String(err);
			} finally {
				isProcessing = false;
			}
		}
	}

	function handleColumnClick(columnIndex: number) {
		const currentPosition = selectedColumns.get(columnIndex);

		if (currentPosition !== undefined) {
			// Column already has a label - cycle to next available or remove
			// First, collect all positions assigned to OTHER columns
			const otherColumnsPositions = new SvelteSet<number>();
			for (const [colIdx, pos] of selectedColumns.entries()) {
				if (colIdx !== columnIndex) {
					otherColumnsPositions.add(pos);
				}
			}

			// Find next available position (not assigned to other columns)
			let nextPosition = currentPosition + 1;
			while (nextPosition <= columnCount && otherColumnsPositions.has(nextPosition)) {
				nextPosition++;
			}

			if (nextPosition > columnCount) {
				// No more available positions - remove label
				selectedColumns.delete(columnIndex);
			} else {
				// Cycle to next available position
				selectedColumns.set(columnIndex, nextPosition);
			}
		} else {
			// Column has no label - find next available position
			const assignedPositions = new Set(selectedColumns.values());
			let nextAvailable = 1;

			// Find the first unassigned position
			for (let i = 1; i <= columnCount; i++) {
				if (!assignedPositions.has(i)) {
					nextAvailable = i;
					break;
				}
			}

			// Check if all positions are assigned
			if (assignedPositions.size >= columnCount) {
				// All labels are assigned - show warning
				error = i18n.t('components.file_upload.error_all_labels_assigned');
				setTimeout(() => {
					error = '';
				}, 3000);
				return;
			}

			// Assign the next available position
			selectedColumns.set(columnIndex, nextAvailable);
		}
	}

	function getColumnPosition(columnIndex: number): number | null {
		const pos = selectedColumns.get(columnIndex);
		return pos !== undefined ? pos : null;
	}

	function isPositionAssigned(position: number): boolean {
		for (const pos of selectedColumns.values()) {
			if (pos === position) return true;
		}
		return false;
	}

	function generateOutputContent(): string {
		if (parseMode === 'text') {
			// Pure text mode
			return fileContent;
		}

		// Table mode - extract selected columns
		const positions: number[] = [];
		for (let i = 1; i <= columnCount; i++) {
			positions.push(i);
		}

		// Build column index array in order
		const columnIndices: number[] = [];
		for (const pos of positions) {
			let foundColumnIndex = -1;
			for (const [colIdx, colPos] of selectedColumns.entries()) {
				if (colPos === pos) {
					foundColumnIndex = colIdx;
					break;
				}
			}
			if (foundColumnIndex === -1) {
				return ''; // Not all positions filled
			}
			columnIndices.push(foundColumnIndex);
		}

		// Parse full file content and extract columns
		const lines = fileContent.split('\n').filter((line) => line.trim());
		const outputLines: string[] = [];

		for (const line of lines) {
			const cells = line.split(',').map((c) => c.trim());
			const selectedCells = columnIndices.map((idx) => cells[idx] || '');
			outputLines.push(selectedCells.join(','));
		}

		return outputLines.join('\n');
	}

	function handleConfirm() {
		const output = generateOutputContent();
		if (!output) {
			error = i18n.t('components.file_upload.error_incomplete_selection');
			return;
		}
		onConfirm(output);
		onClose();
	}

	function formatFileSize(bytes: number): string {
		if (bytes < 1024) return bytes + ' B';
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
		return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
	}

	let canConfirm = $derived.by(() => {
		if (!uploadedFile) return false;
		// Text mode - no column selection required
		if (columnCount === 0 || parseMode === 'text') return true;
		// Table mode - all columns must be selected
		if (selectedColumns.size !== columnCount) return false;
		// Check all positions are filled
		for (let i = 1; i <= columnCount; i++) {
			if (!isPositionAssigned(i)) return false;
		}
		return true;
	});
</script>

<Modal {open} {onClose} title={i18n.t('components.file_upload.title')} maxWidth="800px">
	<div class="upload-container">
		{#if !uploadedFile}
			<!-- Upload area -->
			<div
				class="upload-area {isDragging ? 'dragging' : ''}"
				ondragover={handleDragOver}
				ondragleave={handleDragLeave}
				ondrop={handleDrop}
				role="region"
				aria-label="File upload area"
			>
				<Upload size={48} />
				<p class="upload-text">{i18n.t('components.file_upload.drop_file')}</p>
				<p class="upload-hint">{i18n.t('components.file_upload.supported_formats')}</p>
				<label class="upload-button">
					{i18n.t('components.file_upload.choose_file')}
					<input type="file" accept=".txt,.csv,.xlsx,.xls" onchange={handleFileInput} />
				</label>
			</div>
		{:else}
			<!-- File info -->
			<div class="file-info">
				<div class="file-icon">
					<FileIcon size={24} />
				</div>
				<div class="file-details">
					<div class="file-name">{uploadedFile.name}</div>
					<div class="file-size">{formatFileSize(uploadedFile.size)}</div>
				</div>
				<button
					class="file-remove"
					onclick={resetState}
					title={i18n.t('components.file_upload.remove_file')}
				>
					<X size={16} />
				</button>
			</div>

			{#if error}
				<div class="error-message">{error}</div>
			{/if}

			<!-- Parse Mode Switcher (only for TXT files or when columnCount=0) -->

			<div class="mode-switcher">
				<button
					class="mode-btn {parseMode === 'text' ? 'active' : ''}"
					onclick={() => handleParseModeChange('text')}
				>
					{i18n.t('components.file_upload.mode_text')}
				</button>
				<button
					class="mode-btn {parseMode === 'table' ? 'active' : ''}"
					onclick={() => handleParseModeChange('table')}
				>
					{i18n.t('components.file_upload.mode_table')}
				</button>
			</div>

			{#if isProcessing}
				<div class="processing">{i18n.t('components.file_upload.processing')}</div>
			{:else if tableHeaders.length > 0 && parseMode === 'table'}
				<!-- Table preview with column selection -->
				<div class="table-section">
					<div class="section-title">{i18n.t('components.file_upload.preview_title')}</div>

					<!-- Column selection hint -->
					<div class="column-selection-info">
						{#if columnCount === 1 && columnLabels.length > 0}
							{i18n.t('components.file_upload.select_single_column_hint', {
								label: columnLabels[0]
							})}
						{:else}
							{i18n.t('components.file_upload.select_columns_hint_click', { count: columnCount })}
						{/if}
					</div>

					<div class="table-wrapper">
						<table class="preview-table">
							<thead>
								<tr>
									{#each tableHeaders as header, colIndex (colIndex)}
										{@const currentPosition = getColumnPosition(colIndex)}
										{@const getTooltip = () => {
											if (columnCount === 1 && columnLabels.length > 0) {
												// 单列选择模式
												if (currentPosition) {
													return i18n.t('components.file_upload.click_to_deselect');
												} else {
													// 检查是否有其他列已选择
													const hasSelection = selectedColumns.size > 0;
													return hasSelection
														? i18n.t('components.file_upload.click_to_change')
														: i18n.t('components.file_upload.click_to_select', {
																label: columnLabels[0]
															});
												}
											} else {
												// 多列选择模式
												return currentPosition
													? `${i18n.t('components.file_upload.click_to_cycle')} (${columnLabels[currentPosition - 1] || currentPosition})`
													: i18n.t('components.file_upload.click_to_select', {
															label: columnLabels[0] || '1'
														});
											}
										}}
										<th
											class="clickable {currentPosition ? 'has-selection' : ''}"
											onclick={() => handleColumnClick(colIndex)}
											title={getTooltip()}
										>
											<div class="header-cell">
												<div class="header-title">
													<span class="header-text">{header}</span>
													{#if currentPosition}
														<span class="column-stamp">
															{columnLabels[currentPosition - 1] || currentPosition}
														</span>
													{/if}
												</div>
											</div>
										</th>
									{/each}
								</tr>
							</thead>
							<tbody>
								{#each tableRows as row, rowIndex (rowIndex)}
									<tr>
										{#each row as cell, colIndex (colIndex)}
											{@const position = getColumnPosition(colIndex)}
											<td class={position ? 'selected-col' : ''}>
												{#if position}
													<span class="position-badge">{position}</span>
												{/if}
												{cell}
											</td>
										{/each}
									</tr>
								{/each}
							</tbody>
						</table>
					</div>

					{#if tableRows.length === PREVIEW_ROWS}
						<div class="preview-note">
							{i18n.t('components.file_upload.showing_first_rows', { count: PREVIEW_ROWS })}
						</div>
					{/if}
				</div>
			{:else if fileContent}
				<!-- Text preview -->
				<div class="text-preview">
					<div class="section-title">{i18n.t('components.file_upload.preview_title')}</div>
					<pre>{fileContent.substring(0, 1000)}{fileContent.length > 1000 ? '...' : ''}</pre>
				</div>
			{/if}
		{/if}
	</div>

	{#snippet footer()}
		<div class="modal-footer">
			<button class="btn-secondary" onclick={onClose}>
				{i18n.t('components.file_upload.cancel')}
			</button>
			<button class="btn-primary" onclick={handleConfirm} disabled={!canConfirm}>
				{i18n.t('components.file_upload.confirm')}
			</button>
		</div>
	{/snippet}
</Modal>

<style>
	.upload-container {
		min-height: 300px;
	}

	.upload-area {
		border: 2px dashed var(--color-border);
		border-radius: var(--radius-lg);
		padding: var(--space-8);
		text-align: center;
		transition: all 0.2s;
		background: var(--color-muted);
	}

	.upload-area.dragging {
		border-color: var(--color-primary);
		background: rgba(59, 130, 246, 0.05);
	}

	.upload-area :global(svg) {
		color: var(--color-muted-foreground);
		margin-bottom: var(--space-4);
	}

	.upload-text {
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		color: var(--color-foreground);
		margin: 0 0 var(--space-2) 0;
	}

	.upload-hint {
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
		margin: 0 0 var(--space-4) 0;
	}

	.upload-button {
		display: inline-block;
		padding: var(--space-2) var(--space-4);
		background: var(--color-primary);
		color: white;
		border-radius: var(--radius-md);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: opacity 0.2s;
	}

	.upload-button:hover {
		opacity: 0.9;
	}

	.upload-button input {
		display: none;
	}

	.file-info {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3);
		background: var(--color-muted);
		border-radius: var(--radius-md);
		margin-bottom: var(--space-4);
	}

	.file-icon {
		color: var(--color-primary);
	}

	.file-details {
		flex: 1;
	}

	.file-name {
		font-weight: var(--font-medium);
		color: var(--color-foreground);
	}

	.file-size {
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
	}

	.file-remove {
		background: none;
		border: none;
		cursor: pointer;
		color: var(--color-muted-foreground);
		padding: var(--space-1);
		border-radius: var(--radius-sm);
		transition: all 0.2s;
	}

	.file-remove:hover {
		background: var(--color-accent);
		color: var(--color-foreground);
	}

	.error-message {
		padding: var(--space-3);
		background: rgba(239, 68, 68, 0.1);
		border: 1px solid rgb(239, 68, 68);
		border-radius: var(--radius-md);
		color: rgb(239, 68, 68);
		margin-bottom: var(--space-4);
	}

	.mode-switcher {
		display: flex;
		gap: var(--space-2);
		padding: var(--space-3);
		background: var(--color-muted);
		border-radius: var(--radius-md);
		margin-bottom: var(--space-4);
	}

	.mode-btn {
		flex: 1;
		padding: var(--space-2) var(--space-3);
		background: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-foreground);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.mode-btn:hover {
		border-color: var(--color-primary);
		background: rgba(59, 130, 246, 0.05);
	}

	.mode-btn.active {
		background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
		color: white;
		border-color: transparent;
		box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
	}

	:global([data-theme='dark']) .mode-btn {
		background: var(--gray-800);
		border-color: var(--gray-700);
	}

	:global([data-theme='dark']) .mode-btn:hover {
		background: var(--gray-700);
	}

	.processing {
		text-align: center;
		padding: var(--space-4);
		color: var(--color-muted-foreground);
	}

	.table-section {
		margin-top: var(--space-4);
	}

	.section-title {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--color-foreground);
		margin-bottom: var(--space-3);
	}

	.column-selection-info {
		padding: var(--space-2);
		background: rgba(59, 130, 246, 0.1);
		border-left: 3px solid var(--color-primary);
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
		color: var(--color-primary);
		margin-bottom: var(--space-3);
	}

	.table-wrapper {
		overflow-x: auto;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
	}

	.preview-table {
		width: 100%;
		border-collapse: collapse;
		font-size: var(--text-sm);
	}

	.preview-table th,
	.preview-table td {
		padding: var(--space-2);
		text-align: left;
		border-bottom: 1px solid var(--color-border);
		transition: all 0.2s ease;
	}

	.preview-table tbody tr:hover td {
		background: var(--color-accent);
	}

	.preview-table tbody tr:hover td.selected-col {
		background: linear-gradient(to bottom, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.2));
	}

	.preview-table th {
		background: var(--color-muted);
		font-weight: var(--font-semibold);
		position: sticky;
		top: 0;
		z-index: 10;
		transition: all 0.3s ease;
	}

	.preview-table th.clickable {
		cursor: pointer;
		user-select: none;
		position: relative;
	}

	.preview-table th.clickable::after {
		content: '';
		position: absolute;
		inset: 0;
		background: var(--color-primary);
		opacity: 0;
		transition: opacity 0.15s ease;
		pointer-events: none;
	}

	.preview-table th.clickable:hover::after {
		opacity: 0.08;
	}

	.preview-table th.clickable:active::after {
		opacity: 0.15;
	}

	.preview-table th.clickable:hover {
		background: var(--color-accent);
	}

	.preview-table th.has-selection {
		background: linear-gradient(to bottom, rgba(59, 130, 246, 0.08), rgba(59, 130, 246, 0.12));
		border-top: 3px solid var(--color-primary);
	}

	.preview-table th.clickable.has-selection:hover {
		background: linear-gradient(to bottom, rgba(59, 130, 246, 0.12), rgba(59, 130, 246, 0.16));
	}

	.preview-table th.clickable.has-selection:active {
		background: linear-gradient(to bottom, rgba(59, 130, 246, 0.16), rgba(59, 130, 246, 0.2));
	}

	.header-cell {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		min-width: 100px;
		padding: var(--space-1);
	}

	.header-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-2);
	}

	.header-text {
		font-weight: var(--font-semibold);
		color: var(--color-foreground);
		font-size: var(--text-sm);
		flex: 1;
	}

	.column-stamp {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 28px;
		height: 26px;
		padding: 0 var(--space-2);
		background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
		color: white;
		border-radius: 13px;
		font-size: 13px;
		font-weight: var(--font-bold);
		box-shadow:
			0 2px 6px rgba(59, 130, 246, 0.4),
			inset 0 1px 0 rgba(255, 255, 255, 0.3);
		letter-spacing: -0.2px;
		animation: stamp-appear 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
	}

	@keyframes stamp-appear {
		from {
			opacity: 0;
			transform: scale(0.3) rotate(-10deg);
		}
		to {
			opacity: 1;
			transform: scale(1) rotate(0deg);
		}
	}

	:global([data-theme='dark']) .preview-table th.has-selection {
		background: linear-gradient(to bottom, rgba(59, 130, 246, 0.12), rgba(59, 130, 246, 0.18));
		border-top-color: #60a5fa;
	}

	.preview-table td.selected-col {
		background: linear-gradient(to bottom, rgba(16, 185, 129, 0.08), rgba(16, 185, 129, 0.12));
		font-weight: var(--font-medium);
		position: relative;
		border-left: 2px solid #10b981;
		border-right: 2px solid #10b981;
	}

	.preview-table tr:first-child td.selected-col {
		border-top: 2px solid #10b981;
	}

	.preview-table tr:last-child td.selected-col {
		border-bottom: 2px solid #10b981;
	}

	.position-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 18px;
		height: 18px;
		padding: 0 4px;
		background: linear-gradient(135deg, #10b981 0%, #059669 100%);
		color: white;
		border-radius: 9px;
		font-size: 11px;
		font-weight: var(--font-bold);
		margin-right: 6px;
		box-shadow:
			0 1px 3px rgba(16, 185, 129, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.3);
		letter-spacing: -0.2px;
	}

	:global([data-theme='dark']) .preview-table td.selected-col {
		background: linear-gradient(to bottom, rgba(16, 185, 129, 0.12), rgba(16, 185, 129, 0.16));
		border-left-color: #34d399;
		border-right-color: #34d399;
	}

	:global([data-theme='dark']) .preview-table tr:first-child td.selected-col {
		border-top-color: #34d399;
	}

	:global([data-theme='dark']) .preview-table tr:last-child td.selected-col {
		border-bottom-color: #34d399;
	}

	.preview-note {
		padding: var(--space-2);
		text-align: center;
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
	}

	.text-preview {
		margin-top: var(--space-4);
	}

	.text-preview pre {
		padding: var(--space-3);
		background: var(--color-muted);
		border-radius: var(--radius-md);
		overflow: auto;
		max-height: 400px;
		font-size: var(--text-sm);
		font-family: var(--font-mono);
	}

	.modal-footer {
		display: flex;
		gap: var(--space-2);
		justify-content: flex-end;
	}

	.btn-secondary,
	.btn-primary {
		padding: var(--space-2) var(--space-4);
		border-radius: var(--radius-md);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-secondary {
		background: var(--color-muted);
		border: 1px solid var(--color-border);
		color: var(--color-foreground);
	}

	.btn-secondary:hover {
		background: var(--color-accent);
	}

	.btn-primary {
		background: var(--color-primary);
		border: 1px solid var(--color-primary);
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		opacity: 0.9;
	}

	.btn-primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
