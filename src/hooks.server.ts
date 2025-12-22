import type { Handle } from '@sveltejs/kit';

// Blocked countries list (ISO 3166-1 alpha-2 codes)
const BLOCKED_COUNTRIES = new Set([
	'CN', // China (Mainland)
	'RU', // Russia
	'KP', // North Korea
	'IR', // Iran
	'SY', // Syria
	'CU' // Cuba
	// Note: Crimea is part of UA but identified via cf-ipcountry as UA
	// Cloudflare doesn't have a separate code for Crimea
]);

export const handle: Handle = async ({ event, resolve }) => {
	// Get country from Cloudflare header
	const country = event.request.headers.get('cf-ipcountry');

	// Check if country is blocked
	if (country && BLOCKED_COUNTRIES.has(country)) {
		// Return a 451 (Unavailable For Legal Reasons) with custom page
		return new Response(getBlockedPageHTML(), {
			status: 451,
			headers: {
				'Content-Type': 'text/html; charset=utf-8',
				'Cache-Control': 'no-store'
			}
		});
	}

	return resolve(event);
};

function getBlockedPageHTML(): string {
	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Service Unavailable</title>
	<style>
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}

		body {
			min-height: 100vh;
			display: flex;
			align-items: center;
			justify-content: center;
			background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
			color: #e2e8f0;
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
		}

		.icon {
			width: 60px;
			height: 60px;
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
</head>
<body>
	<div class="container">
		<div class="icon-container">
			<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<circle cx="12" cy="12" r="10"></circle>
				<path d="M4.93 4.93l14.14 14.14"></path>
			</svg>
		</div>
		<h1>Service Unavailable</h1>
		<div class="divider"></div>
		<p class="message">
			We're sorry, but this service is not available in your region due to regulatory restrictions.
		</p>
		<span class="error-code">Error 451 · Region Restricted</span>
	</div>
</body>
</html>`;
}
