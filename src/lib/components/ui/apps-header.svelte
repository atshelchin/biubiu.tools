<script lang="ts">
	import { HouseIcon } from '@lucide/svelte';
	import { useI18n } from '@shelchin/i18n/svelte';

	const i18n = useI18n();
	const t = $derived(i18n.t);
</script>

<div class="header">
	<div class="brand-group">
		<img src="/logo.svg" alt="BiuBiu" class="logo" />
		<span class="brand-name">biubiu.tools</span>
	</div>
	<a href="/" class="home-link" title={t('common.back_to_home')}>
		<HouseIcon size={20} />
	</a>
</div>

<style>
	.header {
		margin-bottom: var(--space-3);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	@media (max-width: 768px) {
		.header {
			margin-bottom: var(--space-1);
		}
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

	.home-link {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-muted-foreground);
		text-decoration: none;
		padding: var(--space-2);
		border-radius: var(--radius-md);
		transition: all 0.2s ease;
	}

	.home-link:hover {
		color: var(--color-primary);
	}
</style>
