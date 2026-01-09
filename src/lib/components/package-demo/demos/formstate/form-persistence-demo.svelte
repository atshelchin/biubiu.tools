<script lang="ts">
	/**
	 * Form Persistence Demo
	 * Demonstrates localStorage auto-save, serialize/deserialize, and export/import.
	 */
	import { useFormState, Validators } from '@shelchin/formstate';
	import { Save, Download, Upload, RotateCcw, Database, AlertCircle, X } from '@lucide/svelte';
	import {
		DemoSection,
		DemoContent,
		CodeBlock,
		InputGroup,
		ActionButtons,
		DemoButton
	} from '$lib/components/package-demo';
	import { onMount } from 'svelte';

	interface Props {
		t: (key: string) => string;
	}

	let { t }: Props = $props();

	const STORAGE_KEY = 'formstate-persistence-demo';

	const form = useFormState({
		fields: {
			projectName: {
				defaultValue: '',
				validator: Validators.required(t('demo.persistence.required')),
				validateOnChange: true
			},
			description: {
				defaultValue: '',
				validateOnChange: true
			},
			priority: {
				defaultValue: 'medium',
				validateOnChange: true
			},
			tags: {
				defaultValue: '',
				validateOnChange: true
			}
		}
	});

	let lastSaved = $state<string | null>(null);
	let autoSaveEnabled = $state(true);
	let saveTimeout: ReturnType<typeof setTimeout> | null = null;
	let importError = $state<string | null>(null);

	// Load saved data on mount
	onMount(() => {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved) {
			try {
				const data = JSON.parse(saved);
				if (data.values) {
					form.setValues(data.values, false);
					lastSaved = data.timestamp;
				}
			} catch {
				// Invalid saved data, ignore
			}
		}

		return () => {
			if (saveTimeout) clearTimeout(saveTimeout);
		};
	});

	// Auto-save with debounce
	function scheduleAutoSave() {
		if (!autoSaveEnabled) return;

		if (saveTimeout) clearTimeout(saveTimeout);
		saveTimeout = setTimeout(() => {
			saveToStorage();
		}, 1000);
	}

	function saveToStorage() {
		const data = {
			values: form.values,
			timestamp: new Date().toLocaleTimeString()
		};
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
		lastSaved = data.timestamp;
	}

	function clearStorage() {
		localStorage.removeItem(STORAGE_KEY);
		form.reset();
		lastSaved = null;
	}

	function exportToFile() {
		const data = {
			values: form.values,
			exportedAt: new Date().toISOString()
		};
		const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'form-data.json';
		a.click();
		URL.revokeObjectURL(url);
	}

	function importFromFile() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.json';
		input.onchange = async (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (!file) return;

			importError = null;
			try {
				const text = await file.text();
				const data = JSON.parse(text);
				if (data.values) {
					form.setValues(data.values, false);
					saveToStorage();
				}
			} catch {
				importError = t('demo.persistence.import_error');
			}
		};
		input.click();
	}

	function clearImportError() {
		importError = null;
	}

	// Watch for changes and auto-save
	$effect(() => {
		// Access form.values to track changes
		const _ = JSON.stringify(form.values);
		scheduleAutoSave();
	});

	const codeExample = `import { useFormState } from '@shelchin/formstate';
import { onMount } from 'svelte';

const STORAGE_KEY = 'my-form-data';

const form = useFormState({
  fields: {
    projectName: { defaultValue: '' },
    description: { defaultValue: '' },
    priority: { defaultValue: 'medium' }
  }
});

// Load saved data on mount
onMount(() => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const data = JSON.parse(saved);
    form.setValues(data.values, false);
  }
});

// Auto-save with debounce
let saveTimeout;
function scheduleAutoSave() {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    const data = { values: form.values };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, 1000);
}

// Watch for changes
$effect(() => {
  const _ = JSON.stringify(form.values);
  scheduleAutoSave();
});

// Export to file
function exportToFile() {
  const blob = new Blob([JSON.stringify({ values: form.values }, null, 2)]);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'form-data.json';
  a.click();
}

// Import from file
async function importFromFile(file: File) {
  const text = await file.text();
  const data = JSON.parse(text);
  form.setValues(data.values, false);
}`;
</script>

<DemoSection title={t('demo.persistence.title')} description={t('demo.persistence.description')}>
	<DemoContent>
		{#snippet panel()}
			<div class="auto-save-toggle">
				<label class="toggle-label">
					<input type="checkbox" bind:checked={autoSaveEnabled} />
					<span>{t('demo.persistence.auto_save')}</span>
				</label>
				{#if lastSaved}
					<span class="last-saved">
						<Database size={12} />
						{t('demo.persistence.last_saved')}: {lastSaved}
					</span>
				{/if}
			</div>

			<InputGroup label={t('demo.persistence.project_name')} id="persist-name">
				<input
					id="persist-name"
					type="text"
					value={form.values.projectName}
					oninput={(e) => form.setValue('projectName', e.currentTarget.value)}
					placeholder={t('demo.persistence.project_placeholder')}
					class:has-error={form.errors.projectName}
				/>
				{#if form.errors.projectName}
					<span class="field-error">{form.errors.projectName}</span>
				{/if}
			</InputGroup>

			<InputGroup label={t('demo.persistence.description')} id="persist-desc">
				<textarea
					id="persist-desc"
					value={form.values.description}
					oninput={(e) => form.setValue('description', e.currentTarget.value)}
					placeholder={t('demo.persistence.description_placeholder')}
					rows="3"
				></textarea>
			</InputGroup>

			<InputGroup label={t('demo.persistence.priority')} id="persist-priority">
				<select
					id="persist-priority"
					value={form.values.priority}
					onchange={(e) => form.setValue('priority', e.currentTarget.value)}
				>
					<option value="low">{t('demo.persistence.priority_low')}</option>
					<option value="medium">{t('demo.persistence.priority_medium')}</option>
					<option value="high">{t('demo.persistence.priority_high')}</option>
				</select>
			</InputGroup>

			<InputGroup label={t('demo.persistence.tags')} id="persist-tags">
				<input
					id="persist-tags"
					type="text"
					value={form.values.tags}
					oninput={(e) => form.setValue('tags', e.currentTarget.value)}
					placeholder={t('demo.persistence.tags_placeholder')}
				/>
			</InputGroup>

			<ActionButtons>
				<DemoButton variant="secondary" icon={Save} onclick={saveToStorage}>
					{t('demo.persistence.save_now')}
				</DemoButton>
				<DemoButton variant="secondary" icon={RotateCcw} onclick={clearStorage}>
					{t('demo.persistence.clear')}
				</DemoButton>
			</ActionButtons>
		{/snippet}

		{#snippet result()}
			<div class="result-panel">
				{#if importError}
					<div class="import-error">
						<div class="error-content">
							<AlertCircle size={16} />
							<span>{importError}</span>
						</div>
						<button class="btn-dismiss" onclick={clearImportError} title={t('actions.dismiss')}>
							<X size={14} />
						</button>
					</div>
				{/if}

				<h4>{t('demo.persistence.export_import')}</h4>
				<div class="export-import-buttons">
					<DemoButton variant="primary" icon={Download} onclick={exportToFile}>
						{t('demo.persistence.export')}
					</DemoButton>
					<DemoButton variant="secondary" icon={Upload} onclick={importFromFile}>
						{t('demo.persistence.import')}
					</DemoButton>
				</div>

				<div class="current-data">
					<h4>{t('demo.persistence.current_data')}</h4>
					<pre>{JSON.stringify(form.values, null, 2)}</pre>
				</div>

				<div class="info-box">
					<p>{t('demo.persistence.info')}</p>
				</div>
			</div>
		{/snippet}
	</DemoContent>

	<CodeBlock title={t('code.persistence')} code={codeExample} />
</DemoSection>

<style>
	.auto-save-toggle {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-3);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		margin-bottom: var(--space-4);
	}

	.toggle-label {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
		color: var(--color-foreground);
		cursor: pointer;
	}

	.toggle-label input {
		width: auto;
	}

	.last-saved {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
	}

	.result-panel {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.result-panel h4 {
		margin: 0;
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-foreground);
	}

	.export-import-buttons {
		display: flex;
		gap: var(--space-2);
	}

	.current-data {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.current-data pre {
		margin: 0;
		padding: var(--space-3);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
		font-size: var(--text-xs);
		color: var(--color-foreground);
		overflow-x: auto;
	}

	.info-box {
		padding: var(--space-3);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
	}

	.info-box p {
		margin: 0;
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
	}

	input,
	textarea,
	select {
		width: 100%;
		padding: var(--space-2) var(--space-3);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		background: var(--color-input);
		color: var(--color-foreground);
		font-size: var(--text-sm);
		transition: border-color 0.2s;
	}

	textarea {
		resize: vertical;
		font-family: inherit;
	}

	input:focus,
	textarea:focus,
	select:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	input.has-error {
		border-color: var(--color-danger);
	}

	.field-error {
		display: block;
		font-size: var(--text-xs);
		color: var(--color-danger);
		margin-top: var(--space-1);
	}

	.import-error {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-3);
		background: color-mix(in srgb, var(--color-danger) 10%, transparent);
		border: 1px solid var(--color-danger);
		border-radius: var(--radius);
		margin-bottom: var(--space-4);
	}

	.error-content {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		color: var(--color-danger);
		font-size: var(--text-sm);
	}

	.btn-dismiss {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-1);
		background: transparent;
		border: none;
		color: var(--color-danger);
		cursor: pointer;
		transition: opacity 0.2s;
	}

	.btn-dismiss:hover {
		opacity: 0.7;
	}
</style>
