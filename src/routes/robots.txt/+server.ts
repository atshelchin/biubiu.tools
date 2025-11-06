import type { RequestHandler } from './$types';

const site = 'https://biubiu.tools';

export const GET: RequestHandler = () => {
	const robots = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

Sitemap: ${site}/sitemap.xml
`;

	return new Response(robots, {
		headers: {
			'Content-Type': 'text/plain',
			'Cache-Control': 'max-age=86400, s-maxage=86400'
		}
	});
};
