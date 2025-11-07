<script lang="ts" module>
	import { EditorView } from 'codemirror';
	import { EditorState, Compartment } from '@codemirror/state';
	import { keymap, placeholder as placeholderExtension } from '@codemirror/view';
	import { defaultKeymap } from '@codemirror/commands';

	/**
	 * Create CodeMirror action for use with Svelte's use: directive
	 */
	export function createCodeMirror(
		node: HTMLElement,
		options: {
			value?: string;
			placeholder?: string;
			rows?: number;
			onChange?: (value: string) => void;
			theme?: 'light' | 'dark';
		}
	) {
		let { value = '', placeholder = '', rows = 8, onChange, theme = 'light' } = options;

		const themeCompartment = new Compartment();

		// Calculate height based on rows (approximate)
		const lineHeight = 20; // pixels
		const padding = 24; // top + bottom padding
		const height = rows * lineHeight + padding;

		// Define theme colors based on current theme
		const getThemeExtension = (isDark: boolean) =>
			EditorView.theme({
				'&': {
					height: `${height}px`,
					fontSize: '14px',
					fontFamily: '"Courier New", monospace'
				},
				'.cm-content': {
					padding: '12px',
					caretColor: isDark ? 'var(--gray-100)' : 'var(--gray-900)'
				},
				'.cm-focused': {
					outline: 'none'
				},
				'.cm-scroller': {
					overflow: 'auto',
					fontFamily: '"Courier New", monospace'
				},
				'.cm-line': {
					padding: '0',
					lineHeight: '20px'
				},
				// Custom scrollbar styling to match textarea
				'.cm-scroller::-webkit-scrollbar': {
					width: '8px'
				},
				'.cm-scroller::-webkit-scrollbar-track': {
					background: isDark ? 'var(--gray-800)' : 'var(--gray-200)',
					borderRadius: 'var(--radius-md)'
				},
				'.cm-scroller::-webkit-scrollbar-thumb': {
					background: isDark ? 'var(--gray-600)' : 'var(--gray-400)',
					borderRadius: 'var(--radius-md)',
					transition: 'background 0.2s'
				},
				'.cm-scroller::-webkit-scrollbar-thumb:hover': {
					background: isDark ? 'var(--gray-500)' : 'var(--gray-500)'
				}
			});

		// Update listener
		const updateListener = EditorView.updateListener.of((update) => {
			if (update.docChanged && onChange) {
				onChange(update.state.doc.toString());
			}
		});

		// Minimal extensions for performance
		const extensions = [
			keymap.of(defaultKeymap),
			updateListener,
			EditorView.lineWrapping,
			placeholderExtension(placeholder),
			themeCompartment.of(getThemeExtension(theme === 'dark'))
		];

		const state = EditorState.create({
			doc: value,
			extensions
		});

		const view = new EditorView({
			state,
			parent: node
		});

		return {
			update(newOptions: typeof options) {
				// Update theme if changed
				if (newOptions.theme !== theme) {
					theme = newOptions.theme || 'light';
					view.dispatch({
						effects: themeCompartment.reconfigure(getThemeExtension(theme === 'dark'))
					});
				}

				// Update value if changed externally
				if (newOptions.value !== undefined && newOptions.value !== view.state.doc.toString()) {
					view.dispatch({
						changes: {
							from: 0,
							to: view.state.doc.length,
							insert: newOptions.value
						}
					});
				}
			},
			destroy() {
				view.destroy();
			}
		};
	}
</script>

<script lang="ts">
	import { useTheme } from '$lib/stores/theme.svelte';

	interface Props {
		value?: string;
		placeholder?: string;
		rows?: number;
		class?: string;
	}

	let { value = $bindable(''), placeholder = '', rows = 8, class: className = '' }: Props = $props();

	const themeStore = useTheme();
</script>

<div
	class="simple-code-editor {className}"
	use:createCodeMirror={{
		value,
		placeholder,
		rows,
		onChange: (newValue) => {
			value = newValue;
		},
		theme: themeStore.theme
	}}
></div>

<style>
	.simple-code-editor {
		width: 100%;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		background: var(--white);
		color: var(--gray-900);
		transition: all 0.2s;
	}

	.simple-code-editor :global(.cm-editor) {
		background: transparent;
		border: none;
	}

	.simple-code-editor :global(.cm-editor.cm-focused) {
		outline: none;
	}

	/* Focus state for container */
	.simple-code-editor:has(:global(.cm-focused)) {
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	/* Dark theme support */
	:global([data-theme='dark']) .simple-code-editor {
		background: var(--gray-700);
		color: var(--gray-100);
		border-color: var(--gray-600);
	}

	/* Ensure text color matches theme */
	:global([data-theme='dark']) .simple-code-editor :global(.cm-content) {
		color: var(--gray-100);
	}

	.simple-code-editor :global(.cm-content) {
		color: var(--gray-900);
	}
</style>
