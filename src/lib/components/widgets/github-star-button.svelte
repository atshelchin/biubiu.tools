<script lang="ts">
	import { Star } from '@lucide/svelte';
	import { browser } from '$app/environment';

	const GITHUB_REPO = 'atshelchin/biubiu.tools';
	const GITHUB_URL = `https://github.com/${GITHUB_REPO}`;
	const CACHE_KEY = 'github-stars-cache';
	const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

	let starCount = $state<number | null>(null);
	let isLoading = $state(true);

	interface CacheData {
		count: number;
		timestamp: number;
	}

	function formatStarCount(count: number): string {
		if (count >= 1000000) {
			return `${(count / 1000000).toFixed(1)}M`;
		}
		if (count >= 1000) {
			return `${(count / 1000).toFixed(1)}k`;
		}
		return count.toString();
	}

	async function fetchStarCount(): Promise<number | null> {
		try {
			const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}`);
			if (!response.ok) return null;
			const data = await response.json();
			return data.stargazers_count ?? null;
		} catch {
			return null;
		}
	}

	function loadFromCache(): number | null {
		if (!browser) return null;
		try {
			const cached = localStorage.getItem(CACHE_KEY);
			if (!cached) return null;
			const data: CacheData = JSON.parse(cached);
			if (Date.now() - data.timestamp > CACHE_DURATION_MS) {
				localStorage.removeItem(CACHE_KEY);
				return null;
			}
			return data.count;
		} catch {
			return null;
		}
	}

	function saveToCache(count: number): void {
		if (!browser) return;
		try {
			const data: CacheData = { count, timestamp: Date.now() };
			localStorage.setItem(CACHE_KEY, JSON.stringify(data));
		} catch {
			// Ignore cache errors
		}
	}

	$effect(() => {
		if (!browser) return;

		// Try cache first
		const cached = loadFromCache();
		if (cached !== null) {
			starCount = cached;
			isLoading = false;
			// Still fetch in background to update cache
			fetchStarCount().then((count) => {
				if (count !== null) {
					starCount = count;
					saveToCache(count);
				}
			});
			return;
		}

		// Fetch from API
		fetchStarCount().then((count) => {
			starCount = count;
			isLoading = false;
			if (count !== null) {
				saveToCache(count);
			}
		});
	});
</script>

<a
	href={GITHUB_URL}
	target="_blank"
	rel="noopener noreferrer"
	class="github-star-button"
	aria-label="Star on GitHub"
>
	<div class="button-content">
		<svg class="github-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path
				d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
			/>
		</svg>
		<span class="star-text">Star</span>
	</div>
	{#if starCount !== null}
		<div class="divider"></div>
		<div class="star-count">
			<Star size={14} class="star-icon" />
			<span>{formatStarCount(starCount)}</span>
		</div>
	{:else if isLoading}
		<div class="divider"></div>
		<div class="star-count loading">
			<span class="loading-dot"></span>
		</div>
	{/if}
</a>

<style>
	.github-star-button {
		display: inline-flex;
		align-items: center;
		height: 2rem;
		background: linear-gradient(180deg, #fafbfc 0%, #eff3f6 90%);
		border: 1px solid rgba(27, 31, 36, 0.15);
		border-radius: 6px;
		color: #24292f;
		font-size: 12px;
		font-weight: 600;
		font-family:
			-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
		box-shadow: 0 1px 0 rgba(27, 31, 36, 0.04);
		transition: all 0.2s ease;
		overflow: hidden;
		text-decoration: none;
	}

	.github-star-button:hover {
		background: linear-gradient(180deg, #f3f4f6 0%, #ebeff3 90%);
		border-color: rgba(27, 31, 36, 0.15);
	}

	.github-star-button:active {
		background: #edeff2;
		box-shadow: inset 0 1px 0 rgba(208, 215, 222, 0.2);
	}

	/* Dark mode - GitHub dark theme style */
	:global([data-theme='dark']) .github-star-button {
		background: linear-gradient(180deg, #21262d 0%, #1c2128 90%);
		border-color: rgba(240, 246, 252, 0.1);
		color: #c9d1d9;
		box-shadow: 0 0 transparent;
	}

	:global([data-theme='dark']) .github-star-button:hover {
		background: linear-gradient(180deg, #30363d 0%, #21262d 90%);
		border-color: #8b949e;
	}

	.button-content {
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 0 10px;
		height: 100%;
	}

	.github-icon {
		width: 16px;
		height: 16px;
		flex-shrink: 0;
	}

	.star-text {
		white-space: nowrap;
	}

	.divider {
		width: 1px;
		height: 100%;
		background: rgba(27, 31, 36, 0.15);
	}

	:global([data-theme='dark']) .divider {
		background: rgba(240, 246, 252, 0.1);
	}

	.star-count {
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 0 10px;
		height: 100%;
		background: transparent;
		font-weight: 600;
	}

	.star-count :global(.star-icon) {
		color: #e3b341;
	}

	:global([data-theme='dark']) .star-count :global(.star-icon) {
		color: #e3b341;
	}

	.star-count.loading {
		min-width: 2rem;
		justify-content: center;
	}

	.loading-dot {
		width: 4px;
		height: 4px;
		background: #57606a;
		border-radius: 50%;
		animation: pulse 1s ease-in-out infinite;
	}

	:global([data-theme='dark']) .loading-dot {
		background: #8b949e;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.4;
			transform: scale(0.8);
		}
		50% {
			opacity: 1;
			transform: scale(1);
		}
	}

	/* Mobile: slightly smaller */
	@media (max-width: 640px) {
		.github-star-button {
			height: 28px;
			font-size: 11px;
		}

		.button-content {
			padding: 0 8px;
		}

		.github-icon {
			width: 14px;
			height: 14px;
		}

		.star-count {
			padding: 0 8px;
		}

		.star-count :global(.star-icon) {
			width: 12px;
			height: 12px;
		}
	}
</style>
