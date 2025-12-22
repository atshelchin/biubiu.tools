<script lang="ts">
	import { useGeoBlock } from '$lib/stores/geo-block.svelte.js';
	import { Ban } from '@lucide/svelte';

	const geoBlock = useGeoBlock();
</script>

{#if geoBlock.isBlocked}
	<div class="geo-block-overlay">
		<div class="container">
			<div class="icon-container">
				<Ban size={60} strokeWidth={1.5} />
			</div>

			<h1>Service Unavailable</h1>

			<div class="divider"></div>

			<p class="message">
				We're sorry, but this service is not available in your region due to regulatory
				restrictions.
			</p>

			<span class="error-code">Error 451 · Region Restricted</span>
		</div>
	</div>
{/if}

<style>
	.geo-block-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 99999;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
		padding: 20px;
	}

	.container {
		text-align: center;
		max-width: 500px;
		animation: fadeIn 0.6s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.icon-container {
		width: 120px;
		height: 120px;
		margin: 0 auto 32px;
		background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.05));
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2px solid rgba(239, 68, 68, 0.3);
		color: #ef4444;
	}

	h1 {
		font-size: 28px;
		font-weight: 700;
		margin-bottom: 16px;
		background: linear-gradient(135deg, #f8fafc, #cbd5e1);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.message {
		font-size: 16px;
		line-height: 1.7;
		color: #94a3b8;
		margin-bottom: 32px;
	}

	.divider {
		width: 60px;
		height: 3px;
		background: linear-gradient(90deg, #ef4444, #f97316);
		margin: 0 auto 32px;
		border-radius: 2px;
	}

	.error-code {
		font-size: 13px;
		color: #64748b;
		font-family: 'SF Mono', Monaco, 'Courier New', monospace;
		padding: 8px 16px;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 6px;
		display: inline-block;
	}
</style>
