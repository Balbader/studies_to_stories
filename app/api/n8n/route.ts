import { NextRequest, NextResponse } from 'next/server';

const N8N_WEBHOOK_URL =
	'https://n8n.srv1088518.hstgr.cloud/webhook/d097b5b1-0702-4333-b412-c04f3104029a';

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
