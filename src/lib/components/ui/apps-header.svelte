<div class="header">
	<div class="brand-group">
		<img src="/logo.svg" alt="BiuBiu" class="logo" />
		<span class="brand-name">biubiu.tools</span>
	</div>
	<div class="membership-badge">💎 开通会员免手续费</div>
</div>

<style>
	.header {
		background: var(--color-card);
		border-radius: var(--radius-xl);
		padding: var(--space-5) var(--space-7);
		margin-bottom: var(--space-5);
		box-shadow: var(--shadow-lg);
		border: 1px solid var(--color-border);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.membership-badge {
		background: linear-gradient(135deg, var(--brand-300) 0%, var(--color-danger) 100%);
		color: var(--color-primary-foreground);
		padding: var(--space-2) var(--space-5);
		border-radius: var(--radius-full);
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: transform 0.2s;
	}

	/* Brand */
	.brand-group {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.logo {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: var(--radius-md);
	}

	.brand-name {
		font-size: var(--text-xl);
		font-weight: var(--font-bold);
		color: var(--color-foreground);
	}

	@media (max-width: 768px) {
		.header {
			padding: var(--space-3-5) var(--space-5);
			flex-direction: column;
			gap: var(--space-3);
			text-align: center;
		}
		.membership-badge {
			width: 100%;
			text-align: center;
		}
	}
</style>
