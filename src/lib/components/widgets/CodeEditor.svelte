<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { EditorView, basicSetup } from 'codemirror';
	import { EditorState, Compartment } from '@codemirror/state';
	import { oneDark } from '@codemirror/theme-one-dark';
	import { keymap, placeholder as placeholderExtension } from '@codemirror/view';
	import { defaultKeymap } from '@codemirror/commands';

	interface Props {
		value?: string;
		placeholder?: string;
		readonly?: boolean;
		theme?: 'light' | 'dark';
		height?: string;
		onChange?: (value: string) => void;
		extensions?: any[];
	}

	let {
		value = $bindable(''),
		placeholder = '',
		readonly = false,
		theme = 'light',
		height = '200px',
		onChange,
		extensions = []
	}: Props = $props();

	let editorContainer: HTMLDivElement;
	let editorView: EditorView | undefined;
	let readOnlyCompartment = new Compartment();
	let themeCompartment = new Compartment();
	let previousTheme = theme;

	// Create editor instance
	function createEditor() {
		if (!editorContainer) return;

		const updateListener = EditorView.updateListener.of((update) => {
			if (update.docChanged) {
				const newValue = update.state.doc.toString();
				value = newValue;
				onChange?.(newValue);
			}
		});

		const baseExtensions = [
			basicSetup,
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
				}
			}),
			readOnlyCompartment.of(EditorState.readOnly.of(readonly)),
			placeholderExtension(placeholder || ''),
			themeCompartment.of(theme === 'dark' ? oneDark : []),
			...extensions
		];

		const state = EditorState.create({
			doc: value,
			extensions: baseExtensions
		});

		editorView = new EditorView({
			state,
			parent: editorContainer
		});
	}

	// Update editor value when prop changes
	$effect(() => {
		if (editorView && value !== editorView.state.doc.toString()) {
			editorView.dispatch({
				changes: {
					from: 0,
					to: editorView.state.doc.length,
					insert: value
				}
			});
		}
	});

	// Update readonly state
	$effect(() => {
		if (editorView) {
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