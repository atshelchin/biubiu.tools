<script lang="ts">
	import SimpleCodeEditor from '$lib/components/widgets/SimpleCodeEditor.svelte';
	import VirtualList from '$lib/components/ui/virtual-list.svelte';
	import { AlertCircle, Search } from '@lucide/svelte';
	import { slide } from 'svelte/transition';
	import { useI18n } from '@shelchin/i18n/svelte';
	import { EditorView } from 'codemirror';
	import { Decoration, type DecorationSet } from '@codemirror/view';
	import { StateField, StateEffect } from '@codemirror/state';
	import { validatePrivateKey } from '@/features/token-sweep/utils/wallet-import';

	interface InvalidKey {
		key: string; // The invalid private key string
		reason?: string; // Optional error reason
	}

	interface Props {
		value: string;
		placeholder?: string;
		rows?: number;
		invalidKeys?: InvalidKey[];
	}

	let { value = $bindable(''), placeholder = '', rows = 20, invalidKeys = [] }: Props = $props();

	const i18n = useI18n();
	let editorView: EditorView | null = $state(null);

	// Track currently displayed invalid keys (filtered from props based on current editor content)
	let displayedInvalidKeys = $state<InvalidKey[]>([]);

	// Watch for changes in value and invalidKeys to update displayed errors
	$effect(() => {
		// Get current lines in editor
		const currentLines = value
			.split('\n')
			.map((line) => line.trim())
			.filter(Boolean);

		// Start with original invalid keys
		const updatedInvalidKeys: InvalidKey[] = [];

		// Check each original invalid key
		invalidKeys.forEach((invalidKey) => {
			const trimmedKey = invalidKey.key.trim();
			// Check if this key still exists in the editor (exact match)
			const stillExists = currentLines.some((line) => line === trimmedKey);

			if (stillExists) {
				// Still exists, check if it's still invalid
				const isStillInvalid = !validatePrivateKey(trimmedKey);
				if (isStillInvalid) {
					updatedInvalidKeys.push(invalidKey);
				}
				// If valid now, don't add to list (error fixed)
			}
			// If doesn't exist, it was deleted or modified to something else
		});

		// Check for NEW invalid keys that weren't in original invalidKeys
		currentLines.forEach((line) => {
			// If this line is invalid and not already in our list
			const isInvalid = !validatePrivateKey(line);
			const alreadyTracked = updatedInvalidKeys.some((k) => k.key.trim() === line);

			if (isInvalid && !alreadyTracked) {
				// This is a newly created invalid key (user typed something wrong)
				updatedInvalidKeys.push({ key: line });
			}
		});

		displayedInvalidKeys = updatedInvalidKeys;
	});

	// Auto-highlight all error lines when displayedInvalidKeys or value changes
	$effect(() => {
		if (!editorView) return;

		if (displayedInvalidKeys.length === 0) {
			// Clear all highlights if no errors
			editorView.dispatch({
				effects: highlightEffect.of([])
			});
			return;
		}

		// Find positions of all error lines
		const lines = value.split('\n');
		const errorPositions: number[] = [];

		displayedInvalidKeys.forEach((invalidKey) => {
			const lineIndex = lines.findIndex((line) => line.trim() === invalidKey.key.trim());
			if (lineIndex !== -1) {
				let pos = 0;
				for (let i = 0; i < lineIndex; i++) {
					pos += lines[i].length + 1; // +1 for newline
				}
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
					const decs = positions.map((pos) =>
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
			alert(i18n.t('tools.token_sweep.step4.content.private_key.error_key_not_found'));
			return;
		}

		const lines = value.split('\n');
		const lineIndex = lines.findIndex((line) => line.trim() === key.trim());

		if (lineIndex === -1) {
			alert(i18n.t('tools.token_sweep.step4.content.private_key.error_key_not_found'));
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
	<SimpleCodeEditor bind:value {placeholder} {rows} onViewReady={handleViewReady} />

	{#if displayedInvalidKeys && displayedInvalidKeys.length > 0}
		<div class="error-panel" transition:slide>
			<div class="error-header">
				<AlertCircle size={18} />
				<span
					>{i18n.t('tools.token_sweep.step4.content.private_key.invalid_keys_found', {
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
								title={i18n.t('tools.token_sweep.step4.content.private_key.locate_key')}
							>
								<Search size={16} />
								{i18n.t('tools.token_sweep.step4.content.private_key.locate')}
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
								title={i18n.t('tools.token_sweep.step4.content.private_key.locate_key')}
							>
								<Search size={16} />
								{i18n.t('tools.token_sweep.step4.content.private_key.locate')}
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
