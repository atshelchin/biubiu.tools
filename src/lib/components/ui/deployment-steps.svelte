<script lang="ts">
	interface Step {
		title: string;
		description: string;
	}

	interface Props {
		/** Array of deployment steps to display */
		steps: Step[];
		/** Optional heading text */
		heading?: string;
	}

	let { steps, heading = 'Deployment Steps:' }: Props = $props();
</script>

<div class="deployment-steps">
	<h4>{heading}</h4>
	<ol>
		{#each steps as step (step.title)}
			<li>
				<strong>{step.title}</strong>
				<p>{step.description}</p>
			</li>
		{/each}
	</ol>
</div>

<style>
	.deployment-steps {
		width: 100%;
		background: var(--gray-200);
		padding: var(--space-4);
		border-radius: var(--radius-lg);
	}

	:global([data-theme='dark']) .deployment-steps {
		background: var(--gray-900);
	}

	h4 {
		text-align: left;
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-800);
		margin: 0 0 var(--space-3) 0;
	}

	:global([data-theme='dark']) h4 {
		color: var(--gray-200);
	}

	ol {
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: var(--space-2-5);
	}

	li {
		text-align: left;
		position: relative;
		padding-left: var(--space-7);
		color: var(--gray-700);
	}

	li::before {
		content: counter(list-item);
		position: absolute;
		left: 0;
		top: 2px;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: var(--gray-300);
		color: var(--gray-700);
		font-weight: var(--font-bold);
		font-size: var(--text-sm);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	:global([data-theme='dark']) li::before {
		background: var(--gray-700);
		color: var(--gray-300);
	}

	:global([data-theme='dark']) li {
		color: var(--gray-300);
	}

	strong {
		font-weight: var(--font-semibold);
		color: var(--gray-900);
		display: block;
		margin-bottom: var(--space-1);
		font-size: var(--text-sm);
	}

	:global([data-theme='dark']) strong {
		color: var(--gray-100);
	}

	p {
		margin: 0;
		font-size: var(--text-sm);
		color: var(--gray-600);
		line-height: 1.5;
		opacity: 0.9;
	}

	:global([data-theme='dark']) p {
		color: var(--gray-400);
	}

	/* Mobile responsive */
	@media (max-width: 640px) {
		.deployment-steps {
			padding: var(--space-3);
		}

		h4 {
			font-size: var(--text-sm);
			margin-bottom: var(--space-2-5);
		}

		ol {
			gap: var(--space-2);
		}

		li {
			padding-left: var(--space-6);
		}

		li::before {
			width: 20px;
			height: 20px;
			font-size: 12px;
		}

		strong {
			font-size: 13px;
		}

		p {
			font-size: 12px;
		}
	}
</style>
