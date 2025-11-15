import { NextRequest, NextResponse } from 'next/server';

const N8N_WEBHOOK_URL =
	'https://n8n.srv1088518.hstgr.cloud/webhook-test/c098efaf-0689-4d48-ad8b-5774c30e151c';

interface ConceptScript {
	conceptName: string;
	script: string;
	wordCount?: number;
	estimatedDuration?: string;
	visualCues?: string[];
}

interface ScriptsPayload {
	scripts: ConceptScript[];
}

export async function POST(request: NextRequest) {
	try {
		const body = (await request.json()) as ScriptsPayload;

		if (!body.scripts || !Array.isArray(body.scripts)) {
			return NextResponse.json(
				{ error: 'Invalid payload: scripts array is required' },
				{ status: 400 },
			);
		}

		const results = [];

		// Send each script to n8n
		for (const scriptData of body.scripts) {
			try {
				// Format the script data into n8n's expected prompt format
				// n8n's AI Agent expects a user prompt that will generate:
				// 1. A detailed video prompt (900-1800 chars)
				// 2. A short caption with hashtags (max 12 words)
				// 3. A YouTube Short title (max 100 chars)
				// 4. A description (up to 2000 chars)
				const visualCuesText = scriptData.visualCues
					? scriptData.visualCues.join(', ')
					: '';

				const n8nPrompt = `<user>
Generate a fast, surreal cinematic video idea based on this educational concept script.

Concept: ${scriptData.conceptName}
Script: ${scriptData.script}
${visualCuesText ? `Visual Cues: ${visualCuesText}` : ''}

Provide:
1. A highly detailed video prompt (min. 900 – max. 1800 characters) that visualizes this educational concept in a surreal, cinematic way.
2. A short hypnotic caption (max. 12 words) with hashtags.
3. A YouTube Short title (max. 100 characters).
4. A description (humorous, keyword-rich, up to 2000 characters).
</user>`;

				const response = await fetch(N8N_WEBHOOK_URL, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						conceptName: scriptData.conceptName,
						script: scriptData.script,
						wordCount: scriptData.wordCount,
						estimatedDuration: scriptData.estimatedDuration,
						visualCues: scriptData.visualCues,
						// Include the formatted prompt for n8n's AI Agent
						text: n8nPrompt,
					}),
				});

				if (!response.ok) {
					throw new Error(
						`n8n webhook returned ${response.status}: ${response.statusText}`,
					);
				}

				const data = await response.json();
				results.push({
					conceptName: scriptData.conceptName,
					success: true,
					response: data,
				});
			} catch (error) {
				console.error(
					`Error sending script for concept "${scriptData.conceptName}":`,
					error,
				);
				results.push({
					conceptName: scriptData.conceptName,
					success: false,
					error:
						error instanceof Error
							? error.message
							: 'Unknown error',
				});
			}
		}

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

export async function GET(request: NextRequest) {
	try {
		const response = await fetch(N8N_WEBHOOK_URL);
		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error('Error fetching from n8n webhook:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch from n8n webhook' },
			{ status: 500 },
		);
	}
}
