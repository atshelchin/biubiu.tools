<script lang="ts">
	import { ExternalLink, Shield } from '@lucide/svelte';
	import { useI18n } from '@shelchin/i18n';
	import type { SerializableExternalTool } from '../types';

	interface Props {
		tool: SerializableExternalTool;
		i18nPrefix: string;
	}

	let { tool, i18nPrefix }: Props = $props();

	const i18n = useI18n();

	// Get CTA text from translations
	const readyText = $derived(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		i18n.t(`${i18nPrefix}.cta.ready` as any, { defaultValue: 'Ready to get started?' })
	);
	const buttonText = $derived(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		i18n.t(`${i18nPrefix}.cta.button` as any, { defaultValue: `Open ${tool.name}` })
	);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const noteText = $derived(i18n.t(`${i18nPrefix}.cta.note` as any, { defaultValue: '' }));
</script>

<section class="cta-section" style="--tool-color: {tool.color}">
	<div class="cta-glow"></div>

	<div class="cta-content">
		<h2 class="cta-title">{readyText}</h2>

		<a href={tool.url} target="_blank" rel="noopener noreferrer" class="cta-button">
			<span>{buttonText}</span>
			<ExternalLink class="button-icon" />
		</a>

		{#if noteText}
			<p class="cta-note">
				<Shield class="note-icon" />
				<span>{noteText}</span>
			</p>
		{/if}
	</div>
</section>

<style>
	.cta-section {
		position: relative;
		margin-top: var(--space-10);
		padding: var(--space-10) var(--space-8);
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-xl);
		text-align: center;
		overflow: hidden;
	}

	:global(.light) .cta-section {
		background: var(--color-panel-2);
	}

	.cta-glow {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 400px;
		height: 200px;
		background: radial-gradient(ellipse at center, var(--tool-color), transparent 70%);
		opacity: 0.1;
		pointer-events: none;
	}

	.cta-content {
		position: relative;
		z-index: 1;
	}

	.cta-title {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--color-heading-1);
		margin: 0 0 var(--space-6) 0;
	}

	.cta-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		padding: var(--space-4) var(--space-8);
		background: var(--tool-color);
		border-radius: var(--radius-lg);
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: white;
		text-decoration: none;
		transition: all 0.2s ease;
		box-shadow: 0 4px 16px color-mix(in srgb, var(--tool-color) 40%, transparent);
	}

	.cta-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 24px color-mix(in srgb, var(--tool-color) 50%, transparent);
	}

	:global(.button-icon) {
		width: 20px;
		height: 20px;
	}

	.cta-note {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		margin: var(--space-5) 0 0 0;
		font-size: var(--text-sm);
		color: var(--color-description-3);
	}

	:global(.note-icon) {
		width: 14px;
		height: 14px;
		color: #22c55e;
	}

	/* Mobile */
	@media (max-width: 768px) {
		.cta-section {
			margin-top: var(--space-8);
			padding: var(--space-8) var(--space-5);
		}

		.cta-title {
			font-size: var(--text-xl);
			margin-bottom: var(--space-5);
		}

		.cta-button {
			width: 100%;
			padding: var(--space-4) var(--space-6);
			font-size: var(--text-base);
		}

		.cta-note {
			margin-top: var(--space-4);
			font-size: var(--text-xs);
		}
	}
</style>
