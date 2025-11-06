<script lang="ts">
	import { clickOutside } from '$lib/utils/click-outside';

	interface Props {
		open: boolean;
		onClose: () => void;
		trigger?: HTMLElement;
		align?: 'left' | 'right' | 'center';
		children: import('svelte').Snippet;
	}

	let { open = $bindable(), onClose, trigger, align = 'left', children }: Props = $props();

	// Calculate dropdown position
	let dropdownPosition = $state<{ top: number; left: number; width: number } | null>(null);

	$effect(() => {
		if (open && trigger) {
			const rect = trigger.getBoundingClientRect();
			const dropdownWidth = Math.max(rect.width, 200); // Minimum 200px width

			let left = rect.left;
			if (align === 'right') {
				left = rect.right - dropdownWidth;
			} else if (align === 'center') {
				left = rect.left + rect.width / 2 - dropdownWidth / 2;
			}

			// Ensure dropdown stays within viewport
			const viewportWidth = window.innerWidth;
			if (left + dropdownWidth > viewportWidth - 16) {
				left = viewportWidth - dropdownWidth - 16;
			}
			if (left < 16) {
				left = 16;
			}

			dropdownPosition = {
				top: rect.bottom + 8,
				left,
				width: dropdownWidth
			};
		} else {
			dropdownPosition = null;
		}
	});

	function handleClickOutside() {
		if (open) {
			onClose();
		}
	}
</script>

{#if open && dropdownPosition}
	<div
		class="dropdown-overlay"
		use:clickOutside={handleClickOutside}
		style:top="{dropdownPosition.top}px"
		style:left="{dropdownPosition.left}px"
		style:width="{dropdownPosition.width}px"
	>
		<div class="dropdown-content">
			{@render children()}
		</div>
	</div>
{/if}

<style>
	.dropdown-overlay {
		position: fixed;
		z-index: 1000;
		animation: slideDown 0.15s ease-out;
	}

	.dropdown-content {
		background: var(--color-card);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-lg);
		padding: var(--space-2);
		max-height: 300px;
		overflow-y: auto;
	}

	/* Scrollbar styling */
	.dropdown-content::-webkit-scrollbar {
		width: 6px;
	}

	.dropdown-content::-webkit-scrollbar-track {
		background: var(--color-muted);
		border-radius: var(--radius-md);
	}

	.dropdown-content::-webkit-scrollbar-thumb {
		background: var(--color-border);
		border-radius: var(--radius-md);
	}

	.dropdown-content::-webkit-scrollbar-thumb:hover {
		background: var(--color-muted-foreground);
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Mobile responsive */
	@media (max-width: 768px) {
		.dropdown-overlay {
			left: var(--space-4) !important;
			right: var(--space-4);
			width: auto !important;
		}

		.dropdown-content {
			max-height: 60vh;
		}
	}
</style>
