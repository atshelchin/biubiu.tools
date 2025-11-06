<script lang="ts" module>
	let baseZIndex = 1000;
	let currentZIndex = baseZIndex;

	export function getNextZIndex(): number {
		currentZIndex += 10;
		return currentZIndex;
	}
</script>

<script lang="ts">
	import { X } from '@lucide/svelte';

	interface Props {
		open: boolean;
		onClose: () => void;
		title?: string;
		maxWidth?: string;
		children?: import('svelte').Snippet;
		footer?: import('svelte').Snippet;
	}

	let { open = false, onClose, title, maxWidth = '400px', children, footer }: Props = $props();

	let zIndex = $state(baseZIndex);

	// Prevent body scroll when modal is open
	$effect(() => {
		if (open) {
			// Get next z-index when modal opens to ensure it's on top
			zIndex = getNextZIndex();

			const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
			document.body.style.overflow = 'hidden';
			document.body.style.paddingRight = `${scrollbarWidth}px`;
		} else {
			document.body.style.overflow = '';
			document.body.style.paddingRight = '';
		}

		return () => {
			document.body.style.overflow = '';
			document.body.style.paddingRight = '';
		};
	});
</script>

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="modal-overlay" style="z-index: {zIndex}" onclick={onClose}>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="modal-content" style="max-width: {maxWidth}" onclick={(e) => e.stopPropagation()}>
			{#if title}
				<div class="modal-header">
					<h3>{title}</h3>
					<button class="close-button" onclick={onClose} type="button">
						<X size={20} />
					</button>
				</div>
			{/if}
			<div class="modal-body">
				{@render children?.()}
			</div>
			{#if footer}
				<div class="modal-footer">
					{@render footer?.()}
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		backdrop-filter: blur(4px);
	}

	.modal-content {
		background: var(--color-card);
		border-radius: var(--radius-xl);
		padding: var(--space-6);
		width: 90%;
		box-shadow: var(--shadow-2xl);
		border: 1px solid var(--color-border);
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-4);
	}

	.modal-header h3 {
		margin: 0;
		font-size: var(--text-xl);
		font-weight: var(--font-bold);
		color: var(--color-foreground);
	}

	.close-button {
		background: none;
		border: none;
		cursor: pointer;
		color: var(--color-muted-foreground);
		padding: 0;
		width: var(--space-8);
		height: var(--space-8);
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-md);
		transition: all 0.2s;
	}

	.close-button:hover {
		background: var(--color-muted);
		color: var(--color-foreground);
	}

	.modal-body {
		width: 100%;
	}

	.modal-footer {
		margin-top: var(--space-4);
		padding-top: var(--space-4);
		border-top: 1px solid var(--color-border);
	}

	@media (max-width: 768px) {
		.modal-content {
			width: 95%;
			padding: var(--space-4);
		}
	}
</style>
