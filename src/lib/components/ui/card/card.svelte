<script lang="ts">
	import { cva, type VariantProps } from 'class-variance-authority';
	import type { Snippet } from 'svelte';

	const cardVariants = cva('card', {
		variants: {
			variant: {
				default: '',
				elevated: 'card-elevated',
				bordered: 'card-bordered'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	});

	type $$Props = VariantProps<typeof cardVariants> & {
		class?: string;
		children: Snippet;
	};

	let { variant = 'default', class: className = '', children }: $$Props = $props();
</script>

<div class="{cardVariants({ variant })} {className}">
	{@render children()}
</div>

<style>
	.card {
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: var(--spacing-6);
		transition: all var(--duration-normal) var(--ease-smooth);
	}

	.card-elevated {
		box-shadow: var(--shadow-md);
	}

	.card-elevated:hover {
		box-shadow: var(--shadow-lg);
		transform: translateY(-2px);
	}

	.card-bordered {
		border-width: 2px;
		border-color: var(--color-brand-primary);
	}
</style>
