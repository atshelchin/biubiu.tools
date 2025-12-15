<script lang="ts">
	import SimpleCodeEditor from '$lib/components/widgets/SimpleCodeEditor.svelte';
	import VirtualList from '$lib/components/ui/virtual-list.svelte';
	import { AlertCircle, Upload } from '@lucide/svelte';
	import { slide } from 'svelte/transition';
	import { useI18n } from '@shelchin/i18n/svelte';
	import { EditorView } from 'codemirror';
	import { Decoration, type DecorationSet } from '@codemirror/view';
	import { StateField, StateEffect } from '@codemirror/state';

	interface InvalidKey {
		key: string; // The invalid private key string
		reason?: string; // Optional error reason
	}

	interface Props {
		value: string;
		placeholder?: string;
		rows?: number;
		invalidKeys?: InvalidKey[];
		onUploadClick?: () => void;
	}

	let {
		value = $bindable(''),
		placeholder = '',
		rows = 20,
		invalidKeys = [],
		onUploadClick
	}: Props = $props();

	const i18n = useI18n();
	let editorView: EditorView | null = $state(null);

	// Simply display the invalid keys from parent (no real-time validation)
	let displayedInvalidKeys = $derived(invalidKeys);

	// Auto-highlight all error lines when displayedInvalidKeys changes
	$effect(() => {
		if (!editorView) return;

		if (displayedInvalidKeys.length === 0) {
			// Clear all highlights if no errors
			editorView.dispatch({
				effects: highlightEffect.of([])
			});
			return;
		}

		const doc = editorView.state.doc;

		// For very large documents (>10000 lines), disable highlighting to prevent UI freeze
		if (doc.lines > 10000) {
			console.warn(`⚠️ Error line highlighting disabled for ${doc.lines} lines (limit: 10000)`);
			return;
		}

		// Build a map of trimmed line text to line positions for efficient lookup
		// eslint-disable-next-line svelte/prefer-svelte-reactivity -- Not reactive state, just local computation
		const lineMap = new Map<string, number>();
		for (let i = 1; i <= doc.lines; i++) {
			const line = doc.line(i);
			const trimmed = line.text.trim();
			if (trimmed && !lineMap.has(trimmed)) {
				lineMap.set(trimmed, line.from);
			}
		}

		// Find positions using the map (O(1) lookup instead of O(n) search)
		const errorPositions: number[] = [];
		displayedInvalidKeys.forEach((invalidKey) => {
			const trimmedKey = invalidKey.key.trim();
			const pos = lineMap.get(trimmedKey);
			if (pos !== undefined) {
				errorPositions.push(pos);
			}
		});

		// Apply all highlights at once
		editorView.dispatch({
			effects: highlightEffect.of(errorPositions)
		});
	});

	// Effect to highlight error lines
	const highlightEffect = StateEffect.define<number[]>();

	// State field to manage highlighted lines
	const highlightField = StateField.define<DecorationSet>({
		create() {
			return Decoration.none;
		},
		update(decorations, tr) {
			decorations = decorations.map(tr.changes);
			for (const effect of tr.effects) {
				if (effect.is(highlightEffect)) {
					const positions = effect.value;
					// Sort positions to ensure decorations are in order
					const sortedPositions = [...positions].sort((a, b) => a - b);
					const decs = sortedPositions.map((pos) =>
						Decoration.line({
							attributes: { class: 'error-line' }
						}).range(pos)
					);
					decorations = Decoration.set(decs);
				}
			}
			return decorations;
		},
		provide: (f) => EditorView.decorations.from(f)
	});

	// Handle editor view ready
	function handleViewReady(view: EditorView) {
		editorView = view;
		// Add the highlight field extension
		editorView.dispatch({
			effects: StateEffect.appendConfig.of([highlightField])
		});
	}

	// Find and scroll to a key in the editor
	function jumpToKey(key: string) {
		if (!editorView) {
			alert(i18n.t('tools.wallet_sweep.step4.content.private_key.error_key_not_found'));
			return;
		}

		const lines = value.split('\n');
		const lineIndex = lines.findIndex((line) => line.trim() === key.trim());

		if (lineIndex === -1) {
			alert(i18n.t('tools.wallet_sweep.step4.content.private_key.error_key_not_found'));
			return;
		}

		// Calculate the position in the document
		let pos = 0;
		for (let i = 0; i < lineIndex; i++) {
			pos += lines[i].length + 1; // +1 for newline
		}

		// Find the end of the line
		const lineEnd = pos + lines[lineIndex].length;

		// Highlight and scroll to the line
		editorView.dispatch({
			selection: { anchor: pos, head: lineEnd },
			effects: [highlightEffect.of([pos]), EditorView.scrollIntoView(pos, { y: 'center' })]
		});

		// Focus the editor
		editorView.focus();
	}
</script>

<div class="editor-container">
	<div class="editor-wrapper">
		<SimpleCodeEditor bind:value {placeholder} {rows} onViewReady={handleViewReady} />
		{#if onUploadClick}
			<button
				class="btn-upload-float"
				onclick={onUploadClick}
				title={i18n.t('tools.wallet_sweep.step4.content.private_key.upload_file')}
			>
				<Upload size={16} />
			</button>
		{/if}
	</div>

	{#if displayedInvalidKeys && displayedInvalidKeys.length > 0}
		<div class="error-panel" transition:slide>
			<div class="error-header">
				<AlertCircle size={18} />
				<span
					>{i18n.t('tools.wallet_sweep.step4.content.private_key.invalid_keys_found', {
						count: displayedInvalidKeys.length
					})}</span
				>
			</div>

			{#if displayedInvalidKeys.length > 100}
				<!-- Use virtual scrolling for large lists -->
				<VirtualList items={displayedInvalidKeys} itemHeight={60} maxHeight={300}>
					{#snippet children(invalidKey: InvalidKey)}
						<div class="error-item">
							<div class="error-content">
								<code class="error-key"
									>{invalidKey.key.slice(0, 20)}...{invalidKey.key.slice(-10)}</code
								>
								{#if invalidKey.reason}
									<div class="error-reason">{invalidKey.reason}</div>
								{/if}
							</div>
							<button
								class="btn-locate"
								onclick={() => jumpToKey(invalidKey.key)}
								title={i18n.t('tools.wallet_sweep.step4.content.private_key.locate_key')}
							>
								<AlertCircle size={16} />
								{i18n.t('tools.wallet_sweep.step4.content.private_key.locate')}
							</button>
						</div>
					{/snippet}
				</VirtualList>
			{:else}
				<!-- Use regular list with animations for small lists -->
				<div class="error-list">
					{#each displayedInvalidKeys as invalidKey (invalidKey.key)}
						<div class="error-item" transition:slide={{ duration: 300 }}>
							<div class="error-content">
								<code class="error-key"
									>{invalidKey.key.slice(0, 20)}...{invalidKey.key.slice(-10)}</code
								>
								{#if invalidKey.reason}
									<div class="error-reason">{invalidKey.reason}</div>
								{/if}
							</div>
							<button
								class="btn-locate"
								onclick={() => jumpToKey(invalidKey.key)}
								title={i18n.t('tools.wallet_sweep.step4.content.private_key.locate_key')}
							>
								<AlertCircle size={16} />
								{i18n.t('tools.wallet_sweep.step4.content.private_key.locate')}
							</button>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.editor-container {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.editor-wrapper {
		position: relative;
	}

	.btn-upload-float {
		position: absolute;
		top: var(--space-2);
		right: var(--space-2);
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		padding: 0;
		background: var(--color-muted);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		color: var(--gray-500);
		cursor: pointer;
		opacity: 0.6;
		transition: all 0.2s;
		z-index: 10;
	}

	.btn-upload-float:hover {
		opacity: 1;
		background: var(--white);
		color: var(--color-primary);
		border-color: var(--color-primary);
		transform: scale(1.05);
	}

	:global([data-theme='dark']) .btn-upload-float {
		background: var(--gray-700);
		color: var(--gray-400);
	}

	:global([data-theme='dark']) .btn-upload-float:hover {
		background: var(--gray-600);
		color: var(--color-primary);
	}

	.error-panel {
		background: rgba(239, 68, 68, 0.05);
		border: 1px solid rgba(239, 68, 68, 0.2);
		border-radius: var(--radius-md);
		padding: var(--space-3);
	}

	:global([data-theme='dark']) .error-panel {
		background: rgba(239, 68, 68, 0.1);
		border-color: rgba(239, 68, 68, 0.3);
	}

	.error-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		color: rgb(220, 38, 38);
		font-weight: var(--font-semibold);
		font-size: var(--text-sm);
		margin-bottom: var(--space-3);
	}

	:global([data-theme='dark']) .error-header {
		color: rgb(248, 113, 113);
	}

	.error-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		max-height: 300px;
		overflow-y: auto;
	}

	.error-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		padding: var(--space-2);
		background: rgba(255, 255, 255, 0.6);
		border-radius: var(--radius-sm);
		border: 1px solid rgba(239, 68, 68, 0.15);
	}

	:global([data-theme='dark']) .error-item {
		background: rgba(0, 0, 0, 0.2);
		border-color: rgba(239, 68, 68, 0.2);
	}

	.error-content {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.error-key {
		font-family: monospace;
		font-size: var(--text-xs);
		color: var(--gray-700);
		background: rgba(0, 0, 0, 0.05);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-sm);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	:global([data-theme='dark']) .error-key {
		color: var(--gray-300);
		background: rgba(255, 255, 255, 0.05);
	}

	.error-reason {
		font-size: var(--text-xs);
		color: rgb(220, 38, 38);
	}

	:global([data-theme='dark']) .error-reason {
		color: rgb(248, 113, 113);
	}

	.btn-locate {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-1) var(--space-2);
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: var(--radius-sm);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.2s;
		flex-shrink: 0;
	}

	.btn-locate:hover {
		opacity: 0.9;
		transform: translateY(-1px);
	}

	/* Scrollbar styling for error list */
	.error-list::-webkit-scrollbar {
		width: 6px;
	}

	.error-list::-webkit-scrollbar-track {
		background: rgba(0, 0, 0, 0.05);
		border-radius: var(--radius-sm);
	}

	.error-list::-webkit-scrollbar-thumb {
		background: rgba(239, 68, 68, 0.3);
		border-radius: var(--radius-sm);
	}

	.error-list::-webkit-scrollbar-thumb:hover {
		background: rgba(239, 68, 68, 0.5);
	}

	/* Error line highlighting in CodeMirror */
	:global(.cm-line.error-line) {
		background: rgba(239, 68, 68, 0.15) !important;
		border-left: 3px solid rgb(239, 68, 68);
		padding-left: 9px !important;
		animation: highlight-flash 0.5s ease-in-out;
	}

	:global([data-theme='dark']) :global(.cm-line.error-line) {
		background: rgba(239, 68, 68, 0.2) !important;
	}

	@keyframes highlight-flash {
		0% {
			background: rgba(239, 68, 68, 0.4);
		}
		100% {
			background: rgba(239, 68, 68, 0.15);
		}
	}
</style>
