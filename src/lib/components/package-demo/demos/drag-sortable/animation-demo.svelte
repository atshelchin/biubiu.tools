<script lang="ts">
	/**
	 * Animation Demo
	 * Demonstrates customizing animation duration
	 */
	import { dragSortable } from '@shelchin/drag-sortable';
	import { DemoSection, DemoContent, CodeBlock } from '$lib/components/package-demo';

	interface Props {
		t: (key: string) => string;
	}

	let { t }: Props = $props();

	let animationDuration = $state(200);

	const cards = [
		{ id: 1, name: 'card_1', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
		{ id: 2, name: 'card_2', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
		{ id: 3, name: 'card_3', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
		{ id: 4, name: 'card_4', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }
	];

	let items = $state([...cards]);

	function handleSort(from: number, to: number) {
		const item = items.splice(from, 1)[0];
		items.splice(to, 0, item);
	}

	const presets = [
		{ label: 'fast', value: 100 },
		{ label: 'normal', value: 200 },
		{ label: 'slow', value: 400 },
		{ label: 'very_slow', value: 600 }
	];

	const codeExample = `import { dragSortable } from '@shelchin/drag-sortable';

let duration = $state(400);
let items = $state([...]);

function handleSort(from: number, to: number) {
  const item = items.splice(from, 1)[0];
  items.splice(to, 0, item);
}

// In template - custom animation duration:
// <div use:dragSortable={{
//   onSort: handleSort,
//   animationDuration: duration
// }}>
//   {#each items as item (item.id)}
//     <div>{item.name}</div>
//   {/each}
// </div>`;
</script>

<DemoSection title={t('demo.animation.title')} description={t('demo.animation.description')}>
	<DemoContent>
		{#snippet panel()}
			<div class="duration-control">
				<label for="animation-duration">{t('demo.animation.duration')}</label>
				<div class="slider-row">
					<input
						id="animation-duration"
						type="range"
						min="50"
						max="800"
						step="50"
						bind:value={animationDuration}
					/>
					<span class="duration-value">{animationDuration}{t('demo.animation.ms')}</span>
				</div>
			</div>

			<div class="presets">
				{#each presets as preset (preset.value)}
					<button
						class="preset-btn"
						class:active={animationDuration === preset.value}
						onclick={() => (animationDuration = preset.value)}
					>
						{t(`demo.animation.${preset.label}`)}
					</button>
				{/each}
			</div>
		{/snippet}

		{#snippet result()}
			{#key animationDuration}
				<div class="animation-cards" use:dragSortable={{ onSort: handleSort, animationDuration }}>
					{#each items as item (item.id)}
						<div class="anim-card" style="background: {item.gradient}">
							<span class="card-text">{t(`demo.animation.${item.name}`)}</span>
							<span class="card-duration">{animationDuration}ms</span>
						</div>
					{/each}
				</div>
			{/key}
		{/snippet}
	</DemoContent>

	<CodeBlock title={t('code.custom_animation')} code={codeExample} />
</DemoSection>

<style>
	.duration-control {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.duration-control label {
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--color-foreground);
	}

	.slider-row {
		display: flex;
		align-items: center;
		gap: var(--space-4);
	}

	.slider-row input[type='range'] {
		flex: 1;
		height: 6px;
		border-radius: 3px;
		background: var(--color-panel-2);
		cursor: pointer;
		accent-color: var(--color-primary);
	}

	.duration-value {
		min-width: 60px;
		font-size: var(--text-lg);
		font-weight: 600;
		color: var(--color-primary);
		font-family: var(--font-mono);
	}

	.presets {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.preset-btn {
		padding: var(--space-2) var(--space-4);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-full);
		background: var(--color-card);
		color: var(--color-foreground);
		font-size: var(--text-sm);
		cursor: pointer;
		transition: all 150ms ease;
	}

	.preset-btn:hover {
		border-color: var(--color-primary);
	}

	.preset-btn.active {
		background: var(--color-primary);
		border-color: var(--color-primary);
		color: white;
	}

	.animation-cards {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.anim-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-6);
		border-radius: var(--radius-xl);
		color: white;
		cursor: grab;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
		transition:
			transform 200ms ease,
			box-shadow 200ms ease;
	}

	.anim-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
	}

	.anim-card:active {
		cursor: grabbing;
	}

	.card-text {
		font-size: var(--text-lg);
		font-weight: 600;
	}

	.card-duration {
		font-size: var(--text-sm);
		opacity: 0.8;
		font-family: var(--font-mono);
		background: rgba(255, 255, 255, 0.2);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius);
	}
</style>
