<script lang="ts">
	/**
	 * TagsInput - 标签输入组件
	 * 支持添加、删除标签，提供建议列表
	 */
	interface Props {
		value?: string[];
		placeholder?: string;
		suggestions?: string[];
		maxTags?: number;
		onInput?: (value: string[]) => void;
		onBlur?: () => void;
	}

	let {
		value = [],
		placeholder = 'Type and press Enter',
		suggestions = [],
		maxTags = 10,
		onInput,
		onBlur
	}: Props = $props();

	let inputValue = $state('');
	let showSuggestions = $state(false);

	// 过滤建议列表
	const filteredSuggestions = $derived.by(() => {
		if (!inputValue || !showSuggestions) return [];
		return suggestions.filter(
			(s) => s.toLowerCase().includes(inputValue.toLowerCase()) && !value.includes(s)
		);
	});

	function addTag(tag: string) {
		const trimmed = tag.trim();
		if (!trimmed || value.includes(trimmed) || value.length >= maxTags) return;

		const newTags = [...value, trimmed];
		if (onInput) {
			onInput(newTags);
		}
		inputValue = '';
		showSuggestions = false;
	}

	function removeTag(index: number) {
		const newTags = value.filter((_, i) => i !== index);
		if (onInput) {
			onInput(newTags);
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			addTag(inputValue);
		} else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
			removeTag(value.length - 1);
		}
	}

	function handleInputChange(e: Event) {
		const target = e.currentTarget as HTMLInputElement;
		inputValue = target.value;
		showSuggestions = true;
	}
</script>

<div class="tags-input">
	<div class="tags-container">
		{#each value as tag, index (tag)}
			<span class="tag">
				{tag}
				<button type="button" class="tag-remove" onclick={() => removeTag(index)}>×</button>
			</span>
		{/each}

		<input
			type="text"
			class="tag-input"
			value={inputValue}
			placeholder={value.length === 0 ? placeholder : ''}
			disabled={value.length >= maxTags}
			oninput={handleInputChange}
			onkeydown={handleKeyDown}
			onblur={() => {
				setTimeout(() => {
					showSuggestions = false;
					if (onBlur) onBlur();
				}, 200);
			}}
			onfocus={() => (showSuggestions = true)}
		/>
	</div>

	{#if filteredSuggestions.length > 0}
		<div class="suggestions">
			{#each filteredSuggestions as suggestion}
				<button type="button" class="suggestion-item" onclick={() => addTag(suggestion)}>
					{suggestion}
				</button>
			{/each}
		</div>
	{/if}

	{#if value.length >= maxTags}
		<p class="max-tags-message">Maximum {maxTags} tags reached</p>
	{/if}
</div>

<style>
	.tags-input {
		position: relative;
	}

	.tags-container {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		padding: 0.75rem;
		border: 2px solid #d1d5db;
		border-radius: 0.5rem;
		min-height: 50px;
		transition: all 0.2s;
	}

	.tags-container:focus-within {
		border-color: #667eea;
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	.tag {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.25rem 0.5rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		font-weight: 500;
		animation: tagAppear 0.2s ease-out;
	}

	@keyframes tagAppear {
		from {
			opacity: 0;
			transform: scale(0.8);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	.tag-remove {
		background: none;
		border: none;
		color: white;
		font-size: 1.25rem;
		line-height: 1;
		cursor: pointer;
		padding: 0 0.25rem;
		opacity: 0.8;
		transition: opacity 0.2s;
	}

	.tag-remove:hover {
		opacity: 1;
	}

	.tag-input {
		flex: 1;
		min-width: 120px;
		border: none;
		outline: none;
		font-size: 1rem;
		padding: 0.25rem;
	}

	.tag-input:disabled {
		background: transparent;
		cursor: not-allowed;
	}

	.suggestions {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		margin-top: 0.25rem;
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		max-height: 200px;
		overflow-y: auto;
		z-index: 10;
	}

	.suggestion-item {
		display: block;
		width: 100%;
		padding: 0.75rem 1rem;
		border: none;
		background: none;
		text-align: left;
		cursor: pointer;
		font-size: 0.875rem;
		transition: background 0.2s;
	}

	.suggestion-item:hover {
		background: #f3f4f6;
	}

	.max-tags-message {
		margin-top: 0.5rem;
		font-size: 0.875rem;
		color: #f59e0b;
	}
</style>
