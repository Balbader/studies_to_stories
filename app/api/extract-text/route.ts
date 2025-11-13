// Import polyfills FIRST before any pdf-parse related imports
import '@/lib/pdf-polyfills';

import { NextRequest, NextResponse } from 'next/server';
import {
	extractTextFromDocuments,
	combineExtractedText,
	type ExtractedTextData,
	type CombinedTextData,
} from '@/lib/text-extractor';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const files = formData.getAll('files') as File[];

		if (!files || files.length === 0) {
			return NextResponse.json(
				{ error: 'No files provided' },
				{ status: 400 },
			);
		}

		// Extract text from all files
		const extractedData: ExtractedTextData[] =
			await extractTextFromDocuments(files);

		// Combine all extracted text into a single JSON object for the lesson agent
		const combinedData: CombinedTextData =
			combineExtractedText(extractedData);

		// Return both individual and combined data in JSON format
		return NextResponse.json({
			success: true,
			data: extractedData,
			combined: combinedData,
			count: extractedData.length,
		});
	} catch (error) {
		console.error('Error extracting text:', error);
		return NextResponse.json(
			{
				error: 'Failed to extract text from documents',
				message:
					error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}
