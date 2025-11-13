import { NextRequest, NextResponse } from 'next/server';
import {
	extractTextFromDocuments,
	type ExtractedTextData,
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

		// Return the extracted data in JSON format
		return NextResponse.json({
			success: true,
			data: extractedData,
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
