<script lang="ts">
	/**
	 * Cards Demo
	 * Demonstrates drag-sortable with rich card layouts
	 */
	import { dragSortable } from '@shelchin/drag-sortable';
	import { Eye, Heart } from '@lucide/svelte';
	import { DemoSection, DemoContent } from '$lib/components/package-demo';

	interface Props {
		t: (key: string) => string;
	}

	let { t }: Props = $props();

	interface Photo {
		id: number;
		name: string;
		image: string;
		views: number;
		likes: number;
	}

	const initialPhotos: Photo[] = [
		{
			id: 1,
			name: 'photo_1',
			image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
			views: 12400,
			likes: 892
		},
		{
			id: 2,
			name: 'photo_2',
			image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=300&fit=crop',
			views: 8700,
			likes: 654
		},
		{
			id: 3,
			name: 'photo_3',
			image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
			views: 15200,
			likes: 1203
		},
		{
			id: 4,
			name: 'photo_4',
			image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&h=300&fit=crop',
			views: 9800,
			likes: 756
		},
		{
			id: 5,
			name: 'photo_5',
			image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&h=300&fit=crop',
			views: 6300,
			likes: 423
		},
		{
			id: 6,
			name: 'photo_6',
			image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&h=300&fit=crop',
			views: 21000,
			likes: 1876
		}
	];

	let photos = $state<Photo[]>([...initialPhotos]);

	function handleSort(from: number, to: number) {
		const item = photos.splice(from, 1)[0];
		photos.splice(to, 0, item);
	}

	function formatNumber(num: number): string {
		if (num >= 1000) {
			return (num / 1000).toFixed(1) + 'k';
		}
		return num.toString();
	}
</script>

<DemoSection title={t('demo.cards.title')} description={t('demo.cards.description')}>
	<DemoContent fullWidth>
		<div class="photo-grid" use:dragSortable={{ onSort: handleSort }}>
			{#each photos as photo (photo.id)}
				<div class="photo-card">
					<div class="photo-image">
						<img src={photo.image} alt={t(`demo.cards.${photo.name}`)} loading="lazy" />
						<div class="photo-overlay">
							<span class="drag-indicator">Drag to reorder</span>
						</div>
					</div>
					<div class="photo-info">
						<h4 class="photo-title">{t(`demo.cards.${photo.name}`)}</h4>
						<div class="photo-stats">
							<span class="stat">
								<Eye size={14} />
								{formatNumber(photo.views)}
								{t('demo.cards.views')}
							</span>
							<span class="stat">
								<Heart size={14} />
								{formatNumber(photo.likes)}
								{t('demo.cards.likes')}
							</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</DemoContent>
</DemoSection>

<style>
	.photo-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: var(--space-6);
		padding: var(--space-4);
	}

	.photo-card {
		background: var(--color-card);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-xl);
		overflow: hidden;
		cursor: grab;
		transition: all 200ms ease;
	}

	.photo-card:hover {
		border-color: var(--color-primary);
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
		transform: translateY(-4px);
	}

	.photo-card:active {
		cursor: grabbing;
	}

	.photo-image {
		position: relative;
		aspect-ratio: 4/3;
		overflow: hidden;
	}

	.photo-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 300ms ease;
	}

	.photo-card:hover .photo-image img {
		transform: scale(1.05);
	}

	.photo-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, transparent 50%);
		display: flex;
		align-items: flex-end;
		justify-content: center;
		padding: var(--space-4);
		opacity: 0;
		transition: opacity 200ms ease;
	}

	.photo-card:hover .photo-overlay {
		opacity: 1;
	}

	.drag-indicator {
		background: rgba(255, 255, 255, 0.9);
		color: #333;
		padding: var(--space-2) var(--space-4);
		border-radius: var(--radius-full);
		font-size: var(--text-xs);
		font-weight: 500;
	}

	.photo-info {
		padding: var(--space-4);
	}

	.photo-title {
		font-size: var(--text-base);
		font-weight: 600;
		color: var(--color-foreground);
		margin: 0 0 var(--space-2) 0;
	}

	.photo-stats {
		display: flex;
		gap: var(--space-4);
	}

	.stat {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
	}

	.stat :global(svg) {
		opacity: 0.7;
	}

	@media (max-width: 640px) {
		.photo-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
