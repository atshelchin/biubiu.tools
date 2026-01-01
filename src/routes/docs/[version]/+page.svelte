<script lang="ts">
	import { useI18n } from '@shelchin/i18n';
	import { FileText } from '@lucide/svelte';

	const i18n = useI18n();
</script>

<div class="empty-state">
	<FileText size={48} />
	<h2>{i18n.t('common.docs.no_documents')}</h2>
	<p>{i18n.t('common.docs.no_documents_description')}</p>
</div>

<style>
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 60vh;
		text-align: center;
		padding: var(--space-8);
		color: var(--color-muted-foreground);
	}

	.empty-state h2 {
		margin-top: var(--space-4);
		color: var(--color-foreground);
	}

	.empty-state p {
		margin-top: var(--space-2);
		max-width: 400px;
	}
</style>
