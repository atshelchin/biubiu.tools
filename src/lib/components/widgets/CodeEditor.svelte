<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { EditorView, minimalSetup } from 'codemirror';
	import { EditorState, Compartment } from '@codemirror/state';
	import { oneDark } from '@codemirror/theme-one-dark';
	import {
		keymap,
		placeholder as placeholderExtension,
		lineNumbers,
		highlightActiveLineGutter,
		highlightSpecialChars,
		drawSelection,
		dropCursor,
		rectangularSelection,
		crosshairCursor,
		highlightActiveLine
	} from '@codemirror/view';
	import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
	import { bracketMatching, foldGutter, indentOnInput } from '@codemirror/language';
	import { closeBrackets } from '@codemirror/autocomplete';

	interface Props {
		initialValue?: string;
		placeholder?: string;
		readonly?: boolean;
		theme?: 'light' | 'dark';
		height?: string;
		onBlur?: (value: string) => void; // Only trigger on blur
		extensions?: any[];
		useMinimalSetup?: boolean; // For better performance with large files
		maxLines?: number; // Maximum allowed lines
		onMaxLinesExceeded?: (lineCount: number) => void;
	}

	let {
		initialValue = '',
		placeholder = '',
		readonly = false,
		theme = 'light',
		height = '200px',
		onBlur,
		extensions = [],
		useMinimalSetup = false,
		maxLines = 0, // 0 means no limit
		onMaxLinesExceeded
	}: Props = $props();

	let editorContainer: HTMLDivElement;
	let editorView: EditorView | undefined;
	let readOnlyCompartment = new Compartment();
	let themeCompartment = new Compartment();
	let previousTheme = theme;

	// Public API methods
	export function getValue(): string {
		return editorView?.state.doc.toString() || '';
	}

	export function setValue(newValue: string) {
		if (editorView) {
			editorView.dispatch({
				changes: {
					from: 0,
					to: editorView.state.doc.length,
					insert: newValue
				}
			});
		}
	}

	export function getLineCount(): number {
		return editorView?.state.doc.lines || 0;
	}

	export function focus() {
		editorView?.focus();
	}

	export function blur() {
		editorView?.contentDOM.blur();
	}

	// Create editor instance
	function createEditor() {
		if (!editorContainer) return;

		const updateListener = EditorView.updateListener.of((update) => {
			if (update.docChanged && maxLines > 0) {
				// Only check line count limit if maxLines is set
				const currentLineCount = update.state.doc.lines;
				if (currentLineCount > maxLines) {
					// Prevent the change if it exceeds max lines
					let content = update.state.doc.toString();
					const lines = content.split('\n');

					if (lines.length > maxLines) {
						// Truncate to max lines
						const truncatedLines = lines.slice(0, maxLines);
						const truncatedContent = truncatedLines.join('\n');

						// Notify about exceeded lines
						onMaxLinesExceeded?.(lines.length);

						// Reset to truncated content
						requestAnimationFrame(() => {
							if (editorView) {
								editorView.dispatch({
									changes: {
										from: 0,
										to: editorView.state.doc.length,
										insert: truncatedContent
									}
								});
							}
						});
					}
				}
			}

			// Handle blur event
			if (update.focusChanged && !update.view.hasFocus && onBlur) {
				onBlur(update.state.doc.toString());
			}
		});

		// Minimal extensions for performance with large files
		const minimalExtensions = [
			minimalSetup,
			keymap.of(defaultKeymap),
			updateListener,
			EditorView.theme({
				'&': {
					height: height,
					fontSize: '14px'
				},
				'.cm-content': {
					padding: '12px'
				},
				'.cm-focused': {
					outline: 'none'
				},
				'.cm-editor': {
					borderRadius: 'var(--radius-md)',
					border: '1px solid var(--color-panel-border-2)'
				},
				'.cm-editor.cm-focused': {
					borderColor: 'var(--color-primary)',
					boxShadow: '0 0 0 2px var(--color-ring)'
				},
				'.cm-scroller': {
					fontFamily: 'monospace'
				}
			}),
			EditorView.lineWrapping,
			readOnlyCompartment.of(EditorState.readOnly.of(readonly)),
			placeholderExtension(placeholder || ''),
			themeCompartment.of(theme === 'dark' ? oneDark : []),
			...extensions
		];

		// Standard extensions for normal use
		const standardExtensions = [
			lineNumbers(),
			highlightActiveLineGutter(),
			highlightSpecialChars(),
			history(),
			foldGutter(),
			drawSelection(),
			dropCursor(),
			EditorState.allowMultipleSelections.of(true),
			indentOnInput(),
			bracketMatching(),
			closeBrackets(),
			rectangularSelection(),
			crosshairCursor(),
			highlightActiveLine(),
			keymap.of([...defaultKeymap, ...historyKeymap]),
			updateListener,
			EditorView.theme({
				'&': {
					height: height,
					fontSize: '14px'
				},
				'.cm-content': {
					padding: '12px'
				},
				'.cm-focused': {
					outline: 'none'
				},
				'.cm-editor': {
					borderRadius: 'var(--radius-md)',
					border: '1px solid var(--color-panel-border-2)'
				},
				'.cm-editor.cm-focused': {
					borderColor: 'var(--color-primary)',
					boxShadow: '0 0 0 2px var(--color-ring)'
				}
			}),
			EditorView.lineWrapping,
			readOnlyCompartment.of(EditorState.readOnly.of(readonly)),
			placeholderExtension(placeholder || ''),
			themeCompartment.of(theme === 'dark' ? oneDark : []),
			...extensions
		];

		const baseExtensions = useMinimalSetup ? minimalExtensions : standardExtensions;

		const state = EditorState.create({
			doc: initialValue,
			extensions: baseExtensions
		});

		editorView = new EditorView({
			state,
			parent: editorContainer
		});
	}

	// Update readonly state
	$effect(() => {
		console.log('CodeEditor: readonly prop changed to', readonly);
		if (editorView) {
			console.log('CodeEditor: Applying readonly state to editor');
			editorView.dispatch({
				effects: readOnlyCompartment.reconfigure(EditorState.readOnly.of(readonly))
			});
		}
	});

	// Update theme dynamically when prop changes
	$effect(() => {
		if (theme !== previousTheme && editorView && themeCompartment) {
			console.log('CodeEditor: Theme changed from', previousTheme, 'to', theme);
			previousTheme = theme;

			// Force update the theme
			requestAnimationFrame(() => {
				editorView!.dispatch({
					effects: themeCompartment.reconfigure(theme === 'dark' ? oneDark : [])
				});
			});
		}
	});

	onMount(() => {
		createEditor();
	});

	onDestroy(() => {
		editorView?.destroy();
	});
</script>

<div bind:this={editorContainer} class="code-editor"></div>

<style>
	.code-editor {
		width: 100%;
		font-family: 'Fira Code', 'SF Mono', 'Monaco', 'Inconsolata', 'Courier New', monospace;
	}

	:global(.cm-editor) {
		background: var(--color-panel-1);
	}

	:global(.cm-gutters) {
		background: var(--color-panel-2);
		border-right: 1px solid var(--color-panel-border-1);
	}

	:global(.cm-activeLineGutter) {
		background: var(--color-panel-3);
	}

	:global(.cm-line) {
		padding-left: 4px;
		padding-right: 4px;
	}
</style>