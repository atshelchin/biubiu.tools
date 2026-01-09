<script lang="ts">
	/**
	 * Watch API Demo
	 * Demonstrates real-time field change reactions.
	 */
	import { useTypedFormState } from '@shelchin/formstate';
	import { Eye, Clock, Trash2 } from '@lucide/svelte';
	import {
		DemoSection,
		DemoContent,
		CodeBlock,
		InputGroup,
		ActionButtons,
		DemoButton
	} from '$lib/components/package-demo';

	interface Props {
		t: (key: string) => string;
	}

	let { t }: Props = $props();

	interface WatchForm {
		source: string;
		derived: string;
	}

	const form = useTypedFormState<WatchForm>({
		initialValues: {
			source: '',
			derived: ''
		}
	});

	// Watch log entries
	let watchLog = $state<Array<{ time: string; oldValue: string; newValue: string }>>([]);

	// Setup watch on mount
	const unwatch = form.watch('source', (newValue, oldValue) => {
		// Update derived field (uppercase)
		form.setValue('derived', String(newValue).toUpperCase());

		// Add to log
		const now = new Date();
		const time = now.toLocaleTimeString('en-US', {
			hour12: false,
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		});
		watchLog = [
			{ time, oldValue: String(oldValue), newValue: String(newValue) },
			...watchLog.slice(0, 9) // Keep last 10 entries
		];
	});

	function clearLog() {
		watchLog = [];
	}

	const charCount = $derived(form.getValue('source').length);

	const codeExample = `import { useTypedFormState } from '@shelchin/formstate';

interface WatchForm {
  source: string;
  derived: string;
}

const form = useTypedFormState<WatchForm>({
  initialValues: { source: '', derived: '' }
});

// Watch a single field
const unwatch = form.watch('source', (newValue, oldValue) => {
  console.log(\`Changed from "\${oldValue}" to "\${newValue}"\`);

  // Auto-update derived field
  form.setValue('derived', newValue.toUpperCase());
});

// Watch multiple fields
const unwatchMultiple = form.watch(
  ['firstName', 'lastName'],
  (values) => {
    console.log('Name changed:', values);
  }
);

// Cleanup when done
unwatch();
unwatchMultiple();`;
</script>

<DemoSection title={t('demo.watch.title')} description={t('demo.watch.description')}>
	<DemoContent>
		{#snippet panel()}
			<InputGroup label={t('demo.watch.source_field')} id="watch-source">
				<input
					id="watch-source"
					type="text"
					value={form.getValue('source')}
					oninput={(e) => form.setValue('source', e.currentTarget.value)}
					placeholder={t('demo.watch.source_placeholder')}
				/>
			</InputGroup>

			<InputGroup label={t('demo.watch.derived_field')} id="watch-derived">
				<input
					id="watch-derived"
					type="text"
					value={form.getValue('derived')}
					readonly
					class="readonly-input"
				/>
			</InputGroup>

			<div class="char-count">
				<span class="char-label">{t('demo.watch.char_count')}:</span>
				<span class="char-value">{charCount}</span>
			</div>

			<ActionButtons>
				<DemoButton variant="outline" icon={Trash2} onclick={clearLog}>Clear Log</DemoButton>
			</ActionButtons>
		{/snippet}

		{#snippet result()}
			<div class="result-panel">
				<div class="result-section">
					<div class="section-header">
						<Eye size={16} />
						<h4>{t('demo.watch.watch_log')}</h4>
					</div>
				</div>

				<div class="watch-log">
					{#if watchLog.length === 0}
						<div class="empty-log">
							{t('demo.watch.no_changes')}
						</div>
					{:else}
						{#each watchLog as entry, index (index)}
							<div class="log-entry">
								<div class="log-time">
									<Clock size={12} />
									<span>{entry.time}</span>
								</div>
								<div class="log-content">
									<span class="old-value">"{entry.oldValue}"</span>
									<span class="arrow">→</span>
									<span class="new-value">"{entry.newValue}"</span>
								</div>
							</div>
						{/each}
					{/if}
				</div>
			</div>
		{/snippet}
	</DemoContent>

	<CodeBlock title="Watch API" code={codeExample} />
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
		margin: 0;
	}

	.section-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		color: var(--color-primary);
	}

	.char-count {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
	}

	.char-label {
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
	}

	.char-value {
		font-size: var(--text-lg);
		font-weight: 600;
		color: var(--color-primary);
	}

	.watch-log {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		max-height: 300px;
		overflow-y: auto;
	}

	.empty-log {
		padding: var(--space-6);
		text-align: center;
		color: var(--color-muted-foreground);
		font-size: var(--text-sm);
		background: var(--color-panel-0);
		border: 1px dashed var(--color-border);
		border-radius: var(--radius);
	}

	.log-entry {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		padding: var(--space-2) var(--space-3);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		animation: fadeIn 0.3s ease;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.log-time {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
	}

	.log-content {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
		font-size: var(--text-xs);
	}

	.old-value {
		color: var(--color-danger);
	}

	.arrow {
		color: var(--color-muted-foreground);
	}

	.new-value {
		color: var(--color-success);
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

	input.readonly-input {
		background: var(--color-panel-0);
		color: var(--color-success);
		cursor: default;
	}
</style>
