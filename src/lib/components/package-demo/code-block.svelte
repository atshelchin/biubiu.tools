<script lang="ts">
	/**
	 * Code Block
	 * A code example block with copy functionality.
	 */
	import { Copy, Check } from '@lucide/svelte';

	interface Props {
		title: string;
		code: string;
		language?: string;
	}

	let { title, code, language = 'typescript' }: Props = $props();

	let copied = $state(false);

	async function copyCode() {
		await navigator.clipboard.writeText(code);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<div class="code-block" data-language={language}>
	<div class="code-header">
		<span>{title}</span>
		<button class="btn-copy" onclick={copyCode} type="button">
			{#if copied}
				<Check size={14} />
			{:else}
				<Copy size={14} />
			{/if}
		</button>
	</div>
	<pre><code>{code}</code></pre>
</div>

<style>
	.code-block {
		background: #1e1e1e;
		border-radius: var(--radius-lg);
		overflow: hidden;
	}

	.code-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-3) var(--space-4);
		background: #2d2d2d;
		border-bottom: 1px solid #3e3e3e;
	}

	.code-header span {
		font-size: var(--text-sm);
		color: #999;
	}

	.btn-copy {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		padding: 0;
		border: none;
		border-radius: var(--radius);
		background: transparent;
		color: #999;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-copy:hover {
		background: #3e3e3e;
		color: white;
	}

	.code-block pre {
		margin: 0;
		padding: var(--space-4);
		overflow-x: auto;
	}

	.code-block code {
		font-family: var(--font-family-mono);
		font-size: var(--text-sm);
		color: #d4d4d4;
		line-height: 1.6;
	}
</style>
