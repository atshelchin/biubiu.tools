# CodeEditor Component Documentation

## Overview

A high-performance, feature-rich code editor component built on CodeMirror 6 for Svelte 5 applications.

## Features

### Core Features

- 🎨 **Theming**: Light/Dark mode support
- 🚀 **Performance**: Auto-switching between standard and minimal modes
- 📝 **Language Support**: JavaScript, TypeScript, JSON, HTML, CSS, Markdown
- ⌨️ **Key Bindings**: Vim, Emacs modes available
- 📏 **Line Limits**: Configurable maximum lines with overflow handling
- 🔍 **Search & Replace**: Built-in search functionality
- ↩️ **History**: Undo/Redo support
- 🎯 **Selection**: Multiple cursors and selections
- 📦 **Extensible**: Custom extensions and key bindings

### Performance Features

- **Auto Performance Mode**: Automatically switches to minimal mode for large files
- **Lazy Loading**: Language support loaded on demand
- **Debounced Updates**: Configurable debounce for change events
- **Memory Efficient**: Proper cleanup on component destroy

## Installation

```bash
# Install dependencies
bun add codemirror @codemirror/state @codemirror/view @codemirror/commands

# Optional language support
bun add @codemirror/lang-javascript @codemirror/lang-json @codemirror/lang-html @codemirror/lang-css @codemirror/lang-markdown

# Optional editor modes
bun add @replit/codemirror-vim @replit/codemirror-emacs
```

## Basic Usage

```svelte
<script>
	import CodeEditor from '$lib/components/widgets/CodeEditor.svelte';

	let editor;

	function handleChange(value) {
		console.log('Content changed:', value);
	}
</script>

<CodeEditor
	bind:this={editor}
	initialValue="// Hello World"
	language="javascript"
	theme="dark"
	onChange={handleChange}
/>
```

## Advanced Usage

### With All Options

```svelte
<script>
	import CodeEditor from '$lib/components/widgets/CodeEditor.svelte';

	let editor;

	const editorConfig = {
		// Content
		initialValue: 'const greeting = "Hello World";',
		placeholder: 'Enter your code here...',

		// Appearance
		theme: 'dark',
		height: '500px',
		minHeight: '200px',
		maxHeight: '80vh',
		fontSize: '16px',
		fontFamily: 'Fira Code',

		// Features
		language: 'javascript',
		lineNumbers: true,
		lineWrapping: true,
		readonly: false,
		tabSize: 4,
		insertSpaces: true,

		// Performance
		maxLines: 50000,
		autoPerformanceMode: true,
		performanceThreshold: 10000,

		// Editor modes
		vimMode: false,
		emacsMode: false,

		// Events
		onBlur: (value) => console.log('Blurred:', value),
		onFocus: (value) => console.log('Focused:', value),
		onChange: (value) => console.log('Changed:', value),
		changeDebounceMs: 500,
		onSelectionChange: ({ from, to, text }) => {
			console.log(`Selected: "${text}" (${from}-${to})`);
		},
		onCursorChange: ({ line, column }) => {
			console.log(`Cursor at line ${line}, column ${column}`);
		},
		onMaxLinesExceeded: (count) => {
			alert(`Too many lines! (${count})`);
		}
	};
</script>

<CodeEditor bind:this={editor} {...editorConfig} />
```

### Using the API

```svelte
<script>
	import CodeEditor from '$lib/components/widgets/CodeEditor.svelte';

	let editor;

	// Get/Set content
	function getContent() {
		const content = editor.getValue();
		console.log(content);
	}

	function setContent() {
		editor.setValue('New content');
	}

	// Selection management
	function getSelection() {
		const selected = editor.getSelection();
		console.log('Selected text:', selected);
	}

	function replaceSelection() {
		editor.replaceSelection('REPLACED');
	}

	// Cursor management
	function getCursor() {
		const pos = editor.getCursorPosition();
		console.log(`Line: ${pos.line}, Column: ${pos.column}`);
	}

	function setCursor() {
		editor.setCursorPosition(10, 5);
	}

	// Editor actions
	function performActions() {
		editor.focus();
		editor.insertText('// Inserted text\n');
		editor.undo();
		editor.redo();

		const stats = editor.getStats();
		console.log(`Lines: ${stats.lines}, Words: ${stats.words}`);
	}

	// Search and replace
	function searchReplace() {
		editor.search('oldText', { caseSensitive: true });
		editor.replace('oldText', 'newText', true); // Replace all
	}
</script>

<CodeEditor bind:this={editor} />

<button on:click={getContent}>Get Content</button>
<button on:click={setContent}>Set Content</button>
<button on:click={performActions}>Perform Actions</button>
```

### Custom Extensions

```svelte
<script>
	import CodeEditor from '$lib/components/widgets/CodeEditor.svelte';
	import { keymap } from '@codemirror/view';

	// Custom key bindings
	const customKeyBindings = [
		{
			key: 'Ctrl-s',
			run: (view) => {
				console.log('Save triggered!');
				return true;
			}
		}
	];

	// Custom extensions
	const customExtensions = [
		keymap.of(customKeyBindings)
		// Add more CodeMirror extensions here
	];
</script>

<CodeEditor extensions={customExtensions} keyBindings={customKeyBindings} />
```

### Performance Optimization

```svelte
<script>
	import CodeEditor from '$lib/components/widgets/CodeEditor.svelte';

	// For handling large files
	const largeFileConfig = {
		// Auto-switch to minimal mode for files > 10k lines
		autoPerformanceMode: true,
		performanceThreshold: 10000,

		// Or force minimal mode
		useMinimalSetup: true,

		// Limit maximum lines
		maxLines: 2000000,

		// Increase debounce for large files
		changeDebounceMs: 1000,

		// Use onBlur instead of onChange for very large files
		onBlur: (value) => {
			// Process value only when user leaves editor
		}
	};
</script>

<CodeEditor {...largeFileConfig} />
```

## TypeScript Support

The component exports comprehensive TypeScript types:

```typescript
import type {
	EditorAPI,
	EditorOptions,
	EditorEvents,
	EditorTheme,
	EditorLanguage
} from '$lib/components/widgets/CodeEditor.svelte';

// Use typed configuration
const config: EditorOptions & EditorEvents = {
	language: 'typescript',
	theme: 'dark',
	onChange: (value: string) => {
		// Type-safe event handler
	}
};

// Type-safe API usage
let editorRef: EditorAPI;
const stats = editorRef.getStats();
```

## Performance Considerations

1. **Large Files**: The component automatically switches to minimal mode for files over 10,000 lines
2. **Memory Management**: Always destroy the editor when done to prevent memory leaks
3. **Change Events**: Use `onBlur` instead of `onChange` for very large files
4. **Debouncing**: Adjust `changeDebounceMs` based on file size
5. **Line Limits**: Set `maxLines` to prevent browser crashes with huge inputs

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

MIT

## Credits

Built with [CodeMirror 6](https://codemirror.net/)
