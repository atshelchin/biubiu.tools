<script lang="ts">
	/**
	 * Playlist Demo
	 * Demonstrates a music playlist with sortable tracks
	 */
	import { dragSortable } from '@shelchin/drag-sortable';
	import { Play, Pause, GripVertical, Music2 } from '@lucide/svelte';
	import { DemoSection, DemoContent } from '$lib/components/package-demo';

	interface Props {
		t: (key: string) => string;
	}

	let { t }: Props = $props();

	interface Track {
		id: number;
		title: string;
		artist: string;
		duration: string;
		cover: string;
	}

	const initialTracks: Track[] = [
		{
			id: 1,
			title: 'track_1',
			artist: 'artist_1',
			duration: '3:42',
			cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop'
		},
		{
			id: 2,
			title: 'track_2',
			artist: 'artist_2',
			duration: '4:15',
			cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=100&h=100&fit=crop'
		},
		{
			id: 3,
			title: 'track_3',
			artist: 'artist_3',
			duration: '3:28',
			cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop'
		},
		{
			id: 4,
			title: 'track_4',
			artist: 'artist_4',
			duration: '5:01',
			cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&h=100&fit=crop'
		},
		{
			id: 5,
			title: 'track_5',
			artist: 'artist_5',
			duration: '3:56',
			cover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=100&h=100&fit=crop'
		}
	];

	let tracks = $state<Track[]>([...initialTracks]);
	let currentTrack = $state<number | null>(1);
	let isPlaying = $state(false);

	function handleSort(from: number, to: number) {
		const item = tracks.splice(from, 1)[0];
		tracks.splice(to, 0, item);
	}

	function togglePlay(trackId: number) {
		if (currentTrack === trackId) {
			isPlaying = !isPlaying;
		} else {
			currentTrack = trackId;
			isPlaying = true;
		}
	}
</script>

<DemoSection title={t('demo.playlist.title')} description={t('demo.playlist.description')}>
	<DemoContent fullWidth>
		<div class="playlist-container">
			<!-- Now Playing -->
			{#if currentTrack}
				{@const current = tracks.find((t) => t.id === currentTrack)}
				{#if current}
					<div class="now-playing">
						<div class="np-cover">
							<img src={current.cover} alt={t(`demo.playlist.${current.title}`)} />
							{#if isPlaying}
								<div class="np-visualizer">
									<span></span>
									<span></span>
									<span></span>
									<span></span>
								</div>
							{/if}
						</div>
						<div class="np-info">
							<span class="np-label">{t('demo.playlist.now_playing')}</span>
							<h3 class="np-title">{t(`demo.playlist.${current.title}`)}</h3>
							<span class="np-artist">{t(`demo.playlist.${current.artist}`)}</span>
						</div>
						<button class="np-play-btn" onclick={() => togglePlay(current.id)}>
							{#if isPlaying}
								<Pause size={24} />
							{:else}
								<Play size={24} />
							{/if}
						</button>
					</div>
				{/if}
			{/if}

			<!-- Playlist -->
			<div class="playlist-header">
				<Music2 size={18} />
				<span>{t('demo.playlist.up_next')}</span>
			</div>

			<div class="track-list" use:dragSortable={{ onSort: handleSort, handle: '.track-handle' }}>
				{#each tracks as track, index (track.id)}
					<div
						class="track-item"
						class:active={currentTrack === track.id}
						class:playing={currentTrack === track.id && isPlaying}
					>
						<button class="track-handle" aria-label="Drag to reorder">
							<GripVertical size={16} />
						</button>

						<span class="track-number">{index + 1}</span>

						<div class="track-cover">
							<img src={track.cover} alt={t(`demo.playlist.${track.title}`)} />
						</div>

						<div class="track-info">
							<span class="track-title">{t(`demo.playlist.${track.title}`)}</span>
							<span class="track-artist">{t(`demo.playlist.${track.artist}`)}</span>
						</div>

						<span class="track-duration">{track.duration}</span>

						<button class="track-play" onclick={() => togglePlay(track.id)}>
							{#if currentTrack === track.id && isPlaying}
								<Pause size={16} />
							{:else}
								<Play size={16} />
							{/if}
						</button>
					</div>
				{/each}
			</div>
		</div>
	</DemoContent>
</DemoSection>

<style>
	.playlist-container {
		background: linear-gradient(180deg, var(--color-panel-1) 0%, var(--color-background) 100%);
		border-radius: var(--radius-xl);
		padding: var(--space-6);
	}

	/* Now Playing */
	.now-playing {
		display: flex;
		align-items: center;
		gap: var(--space-5);
		padding: var(--space-6);
		background: linear-gradient(135deg, var(--color-primary) 0%, #7c3aed 100%);
		border-radius: var(--radius-xl);
		margin-bottom: var(--space-6);
		color: white;
	}

	.np-cover {
		position: relative;
		width: 80px;
		height: 80px;
		border-radius: var(--radius-lg);
		overflow: hidden;
		flex-shrink: 0;
	}

	.np-cover img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.np-visualizer {
		position: absolute;
		bottom: 8px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 3px;
		align-items: flex-end;
		height: 20px;
	}

	.np-visualizer span {
		width: 4px;
		background: white;
		border-radius: 2px;
		animation: visualizer 0.5s ease-in-out infinite alternate;
	}

	.np-visualizer span:nth-child(1) {
		animation-delay: 0s;
		height: 8px;
	}
	.np-visualizer span:nth-child(2) {
		animation-delay: 0.1s;
		height: 16px;
	}
	.np-visualizer span:nth-child(3) {
		animation-delay: 0.2s;
		height: 12px;
	}
	.np-visualizer span:nth-child(4) {
		animation-delay: 0.3s;
		height: 20px;
	}

	@keyframes visualizer {
		from {
			height: 4px;
		}
		to {
			height: 20px;
		}
	}

	.np-info {
		flex: 1;
	}

	.np-label {
		font-size: var(--text-xs);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		opacity: 0.8;
	}

	.np-title {
		font-size: var(--text-xl);
		font-weight: 700;
		margin: var(--space-1) 0;
	}

	.np-artist {
		font-size: var(--text-sm);
		opacity: 0.9;
	}

	.np-play-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 56px;
		height: 56px;
		border: none;
		border-radius: 50%;
		background: white;
		color: var(--color-primary);
		cursor: pointer;
		transition: transform 150ms ease;
	}

	.np-play-btn:hover {
		transform: scale(1.05);
	}

	/* Playlist */
	.playlist-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-weight: 600;
		color: var(--color-foreground);
		margin-bottom: var(--space-4);
	}

	.track-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.track-item {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		background: var(--color-card);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		transition: all 200ms ease;
	}

	.track-item:hover {
		border-color: var(--color-primary);
		background: var(--color-panel-1);
	}

	.track-item.active {
		border-color: var(--color-primary);
		background: linear-gradient(90deg, rgba(102, 126, 234, 0.1) 0%, transparent 100%);
	}

	.track-handle {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-1);
		background: none;
		border: none;
		color: var(--color-muted-foreground);
		cursor: grab;
		border-radius: var(--radius);
		transition: all 150ms ease;
	}

	.track-handle:hover {
		background: var(--color-panel-2);
		color: var(--color-foreground);
	}

	.track-handle:active {
		cursor: grabbing;
	}

	.track-number {
		width: 24px;
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
		text-align: center;
	}

	.track-item.playing .track-number {
		color: var(--color-primary);
		font-weight: 600;
	}

	.track-cover {
		width: 48px;
		height: 48px;
		border-radius: var(--radius);
		overflow: hidden;
		flex-shrink: 0;
	}

	.track-cover img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.track-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	.track-title {
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--color-foreground);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.track-item.active .track-title {
		color: var(--color-primary);
	}

	.track-artist {
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.track-duration {
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
		font-family: var(--font-mono);
	}

	.track-play {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border: none;
		border-radius: 50%;
		background: var(--color-panel-2);
		color: var(--color-foreground);
		cursor: pointer;
		opacity: 0;
		transition: all 150ms ease;
	}

	.track-item:hover .track-play,
	.track-item.active .track-play {
		opacity: 1;
	}

	.track-play:hover {
		background: var(--color-primary);
		color: white;
	}

	.track-item.playing .track-play {
		background: var(--color-primary);
		color: white;
		opacity: 1;
	}

	@media (max-width: 640px) {
		.now-playing {
			flex-direction: column;
			text-align: center;
			padding: var(--space-5);
		}

		.np-cover {
			width: 120px;
			height: 120px;
		}

		.track-number {
			display: none;
		}

		.track-duration {
			display: none;
		}
	}
</style>
