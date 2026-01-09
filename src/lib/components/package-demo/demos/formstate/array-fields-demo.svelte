<script lang="ts">
	/**
	 * Array Fields Demo
	 * Demonstrates dynamic array field management.
	 */
	import { useTypedFormState } from '@shelchin/formstate';
	import { Plus, Trash2, ChevronUp, ChevronDown, List } from '@lucide/svelte';
	import {
		DemoSection,
		DemoContent,
		CodeBlock,
		InputGroup,
		ActionButtons,
		DemoButton,
		IconButton
	} from '$lib/components/package-demo';

	interface Props {
		t: (key: string) => string;
	}

	let { t }: Props = $props();

	interface FormWithArrays {
		tags: string[];
		addresses: Array<{
			street: string;
			city: string;
		}>;
	}

	const form = useTypedFormState<FormWithArrays>({
		initialValues: {
			tags: ['svelte', 'typescript'],
			addresses: [{ street: '123 Main St', city: 'New York' }]
		}
	});

	function addTag() {
		form.pushArrayItem('tags', '');
	}

	function removeTag(index: number) {
		form.removeArrayItem('tags', index);
	}

	function addAddress() {
		form.pushArrayItem('addresses', { street: '', city: '' });
	}

	function removeAddress(index: number) {
		form.removeArrayItem('addresses', index);
	}

	function moveAddressUp(index: number) {
		if (index > 0) {
			form.moveArrayItem('addresses', index, index - 1);
		}
	}

	function moveAddressDown(index: number) {
		const addresses = form.getArrayValue('addresses');
		if (index < addresses.length - 1) {
			form.moveArrayItem('addresses', index, index + 1);
		}
	}

	const codeExample = `import { useTypedFormState } from '@shelchin/formstate';

interface FormWithArrays {
  tags: string[];
  addresses: Array<{
    street: string;
    city: string;
  }>;
}

const form = useTypedFormState<FormWithArrays>({
  initialValues: {
    tags: ['svelte', 'typescript'],
    addresses: [{ street: '123 Main St', city: 'NYC' }]
  }
});

// Array operations
form.pushArrayItem('tags', 'new-tag');     // Add item
form.removeArrayItem('tags', 0);           // Remove by index
form.insertArrayItem('tags', 1, 'middle'); // Insert at index
form.moveArrayItem('addresses', 0, 1);     // Move item

// Get array value
const tags = form.getArrayValue('tags');
const addresses = form.getArrayValue('addresses');`;
</script>

<DemoSection title={t('demo.array.title')} description={t('demo.array.description')}>
	<DemoContent>
		{#snippet panel()}
			<!-- Tags Array -->
			<div class="array-section">
				<div class="array-header">
					<span class="array-label">{t('demo.array.tags')}</span>
					<DemoButton variant="outline" icon={Plus} onclick={addTag} size="sm">
						{t('demo.array.add_tag')}
					</DemoButton>
				</div>
				<div class="tags-list">
					{#each form.getArrayValue('tags') as tag, index (index)}
						<div class="tag-item">
							<input
								type="text"
								value={tag}
								oninput={(e) =>
									form.setValue(`tags.${index}` as `tags.${number}`, e.currentTarget.value)}
								placeholder="Tag..."
							/>
							<IconButton
								icon={Trash2}
								iconSize={14}
								variant="danger"
								onclick={() => removeTag(index)}
							/>
						</div>
					{/each}
					{#if form.getArrayValue('tags').length === 0}
						<div class="empty-array">No tags. Click "Add Tag" to add one.</div>
					{/if}
				</div>
			</div>

			<!-- Addresses Array -->
			<div class="array-section">
				<div class="array-header">
					<span class="array-label">{t('demo.array.addresses')}</span>
					<DemoButton variant="outline" icon={Plus} onclick={addAddress} size="sm">
						{t('demo.array.add_address')}
					</DemoButton>
				</div>
				<div class="addresses-list">
					{#each form.getArrayValue('addresses') as address, index (index)}
						<div class="address-item">
							<div class="address-fields">
								<input
									type="text"
									value={address.street}
									oninput={(e) =>
										form.setValue(
											`addresses.${index}.street` as `addresses.${number}.street`,
											e.currentTarget.value
										)}
									placeholder={t('demo.array.street')}
								/>
								<input
									type="text"
									value={address.city}
									oninput={(e) =>
										form.setValue(
											`addresses.${index}.city` as `addresses.${number}.city`,
											e.currentTarget.value
										)}
									placeholder={t('demo.array.city')}
								/>
							</div>
							<div class="address-actions">
								<IconButton
									icon={ChevronUp}
									iconSize={14}
									onclick={() => moveAddressUp(index)}
									disabled={index === 0}
								/>
								<IconButton
									icon={ChevronDown}
									iconSize={14}
									onclick={() => moveAddressDown(index)}
									disabled={index === form.getArrayValue('addresses').length - 1}
								/>
								<IconButton
									icon={Trash2}
									iconSize={14}
									variant="danger"
									onclick={() => removeAddress(index)}
								/>
							</div>
						</div>
					{/each}
					{#if form.getArrayValue('addresses').length === 0}
						<div class="empty-array">No addresses. Click "Add Address" to add one.</div>
					{/if}
				</div>
			</div>
		{/snippet}

		{#snippet result()}
			<div class="result-panel">
				<div class="result-section">
					<div class="section-header">
						<List size={16} />
						<h4>{t('demo.array.array_state')}</h4>
					</div>
				</div>

				<div class="result-section">
					<h4>tags ({form.getArrayValue('tags').length} {t('demo.array.items_count')})</h4>
					<pre class="json-display">{JSON.stringify(form.getArrayValue('tags'), null, 2)}</pre>
				</div>

				<div class="result-section">
					<h4>
						addresses ({form.getArrayValue('addresses').length}
						{t('demo.array.items_count')})
					</h4>
					<pre class="json-display">{JSON.stringify(form.getArrayValue('addresses'), null, 2)}</pre>
				</div>

				<div class="result-section">
					<h4>form.values</h4>
					<pre class="json-display">{JSON.stringify(form.values, null, 2)}</pre>
				</div>
			</div>
		{/snippet}
	</DemoContent>

	<CodeBlock title="Array Operations" code={codeExample} />
</DemoSection>

<style>
	.result-panel {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.result-section h4 {
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-foreground);
		margin-bottom: var(--space-2);
		margin: 0;
	}

	.section-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-2);
		color: var(--color-primary);
	}

	.json-display {
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		padding: var(--space-3);
		font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
		font-size: var(--text-xs);
		color: var(--color-foreground);
		overflow-x: auto;
		margin: 0;
	}

	.array-section {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.array-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.array-label {
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-foreground);
	}

	.tags-list,
	.addresses-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.tag-item {
		display: flex;
		gap: var(--space-2);
	}

	.tag-item input {
		flex: 1;
	}

	.address-item {
		display: flex;
		gap: var(--space-3);
		padding: var(--space-3);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
	}

	.address-fields {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.address-actions {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.empty-array {
		padding: var(--space-4);
		text-align: center;
		color: var(--color-muted-foreground);
		font-size: var(--text-sm);
		background: var(--color-panel-0);
		border: 1px dashed var(--color-border);
		border-radius: var(--radius);
	}

	input {
		width: 100%;
		padding: var(--space-2) var(--space-3);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		background: var(--color-input);
		color: var(--color-foreground);
		font-size: var(--text-sm);
		transition: border-color 0.2s;
	}

	input:focus {
		outline: none;
		border-color: var(--color-primary);
	}
</style>
