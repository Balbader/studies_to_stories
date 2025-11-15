import { NextRequest, NextResponse } from 'next/server';
import { sendScriptsToN8N, type ScriptsPayload } from '../../../lib/n8n-sender';

export async function GET(request: NextRequest) {
	try {
		// Get scripts data from query parameter
		const scriptsParam = request.nextUrl.searchParams.get('scripts');

		if (!scriptsParam) {
			return NextResponse.json(
				{ error: 'Invalid request: scripts parameter is required' },
				{ status: 400 },
			);
		}

		let body: ScriptsPayload;
		try {
			body = JSON.parse(
				decodeURIComponent(scriptsParam),
			) as ScriptsPayload;
		} catch (error) {
			return NextResponse.json(
				{ error: 'Invalid scripts parameter: must be valid JSON' },
				{ status: 400 },
			);
		}

		if (!body.scripts || !Array.isArray(body.scripts)) {
			return NextResponse.json(
				{ error: 'Invalid payload: scripts array is required' },
				{ status: 400 },
			);
		}

		// Use the shared function to send scripts to n8n
		const results = await sendScriptsToN8N(body.scripts);

		return NextResponse.json({
			success: true,
			totalScripts: body.scripts.length,
			results,
		});
	} catch (error) {
		console.error('Error processing scripts:', error);
		return NextResponse.json(
			{
				error: 'Failed to process scripts',
				message:
					error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}
