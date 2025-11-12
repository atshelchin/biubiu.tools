<script lang="ts">
	/**
	 * RichTextEditor - 简易富文本编辑器
	 * 支持基本的文本格式化
	 */
	interface Props {
		value?: string;
		placeholder?: string;
		minHeight?: string;
		onInput?: (value: string) => void;
		onBlur?: () => void;
	}

	let {
		value = '',
		placeholder = 'Start typing...',
		minHeight = '150px',
		onInput,
		onBlur
	}: Props = $props();

	let editorRef: HTMLDivElement | undefined = $state();

	// 格式化命令
	function execCommand(command: string, value: string | null = null) {
		document.execCommand(command, false, value ?? undefined);
		updateContent();
	}

	function updateContent() {
		if (editorRef && onInput) {
			onInput(editorRef.innerHTML);
		}
	}

	// 初始化内容
	$effect(() => {
		if (editorRef && !editorRef.innerHTML) {
			editorRef.innerHTML = value;
		}
	});
</script>

<div class="rich-editor">
	<div class="toolbar">
		<button
			type="button"
			class="toolbar-btn"
			onclick={() => execCommand('bold')}
			title="Bold (Ctrl+B)"
		>
			<strong>B</strong>
		</button>

		<button
			type="button"
			class="toolbar-btn"
			onclick={() => execCommand('italic')}
			title="Italic (Ctrl+I)"
		>
			<em>I</em>
		</button>

		<button
			type="button"
			class="toolbar-btn"
			onclick={() => execCommand('underline')}
			title="Underline (Ctrl+U)"
		>
			<u>U</u>
		</button>

		<div class="toolbar-separator"></div>

		<button
			type="button"
			class="toolbar-btn"
			onclick={() => execCommand('insertUnorderedList')}
			title="Bullet List"
		>
			•••
		</button>

		<button
			type="button"
			class="toolbar-btn"
			onclick={() => execCommand('insertOrderedList')}
			title="Numbered List"
		>
			1.2.3
		</button>

		<div class="toolbar-separator"></div>

		<button
			type="button"
			class="toolbar-btn"
			onclick={() => execCommand('formatBlock', 'h2')}
			title="Heading"
		>
			H
		</button>

		<button
			type="button"
			class="toolbar-btn"
			onclick={() => execCommand('formatBlock', 'p')}
			title="Paragraph"
		>
			P
		</button>

		<div class="toolbar-separator"></div>

		<button
			type="button"
			class="toolbar-btn"
			onclick={() => execCommand('removeFormat')}
			title="Clear Formatting"
		>
			✗
		</button>
	</div>

	<div
		bind:this={editorRef}
		class="editor-content"
		contenteditable="true"
		style="min-height: {minHeight}"
		data-placeholder={placeholder}
		oninput={updateContent}
		onblur={onBlur}
	></div>
</div>

<style>
	.rich-editor {
		border: 2px solid #d1d5db;
		border-radius: 0.5rem;
		overflow: hidden;
		transition: all 0.2s;
	}

	.rich-editor:focus-within {
		border-color: #667eea;
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	.toolbar {
		display: flex;
		gap: 0.25rem;
		padding: 0.5rem;
		background: #f9fafb;
		border-bottom: 1px solid #e5e7eb;
		flex-wrap: wrap;
	}

	.toolbar-btn {
		padding: 0.5rem 0.75rem;
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 0.375rem;
		cursor: pointer;
		font-size: 0.875rem;
		transition: all 0.2s;
		min-width: 36px;
	}

	.toolbar-btn:hover {
		background: #f3f4f6;
		border-color: #667eea;
	}

	.toolbar-btn:active {
		background: #e5e7eb;
	}

	.toolbar-separator {
		width: 1px;
		background: #e5e7eb;
		margin: 0.25rem 0.5rem;
	}

	.editor-content {
		padding: 1rem;
		outline: none;
		font-size: 1rem;
		line-height: 1.6;
		overflow-y: auto;
		max-height: 400px;
	}

	.editor-content:empty::before {
		content: attr(data-placeholder);
		color: #9ca3af;
	}

	/* 富文本内容样式 */
	.editor-content :global(strong) {
		font-weight: 600;
	}

	.editor-content :global(em) {
		font-style: italic;
	}

	.editor-content :global(u) {
		text-decoration: underline;
	}

	.editor-content :global(h2) {
		font-size: 1.5rem;
		font-weight: 700;
		margin: 1rem 0 0.5rem 0;
	}

	.editor-content :global(p) {
		margin: 0.5rem 0;
	}

	.editor-content :global(ul),
	.editor-content :global(ol) {
		margin: 0.5rem 0;
		padding-left: 2rem;
	}

	.editor-content :global(li) {
		margin: 0.25rem 0;
	}
</style>
