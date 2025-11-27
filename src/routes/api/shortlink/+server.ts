import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { url } = await request.json();

		if (!url || typeof url !== 'string') {
			return json(
				{
					success: false,
					error: 'Invalid URL parameter'
				},
				{ status: 400 }
			);
		}

		// Call sndra.link API - correct endpoint and parameter name
		const response = await fetch('https://sndra.link/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ link: url }) // Use "link" not "url"
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
		}

		const data = await response.json();

		// API returns { short: "https://sndra.link/r/abc123" }
		if (data.short) {
			return json({
				success: true,
				shortUrl: data.short
			});
		}

		return json({
			success: false,
			error: 'No short URL returned from service'
		});
	} catch (error) {
		console.error('Short link API error:', error);
		return json(
			{
				success: false,
				error: error instanceof Error ? error.message : 'Failed to create short link'
			},
			{ status: 500 }
		);
	}
};
