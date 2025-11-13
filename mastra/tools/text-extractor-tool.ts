import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import {
	extractTextFromDocument,
	type ExtractedTextData,
} from '@/lib/text-extractor';

export const textExtractorTool = createTool({
	id: 'text-extractor',
	description:
		'Extract text from a document file (PDF or DOCX) and return it in JSON format',
	inputSchema: z.object({
		document: z.instanceof(File),
	}),
	outputSchema: z.object({
		extractedData: z.object({
			fileName: z.string(),
			fileType: z.enum(['pdf', 'docx', 'doc']),
			text: z.string(),
			extractedAt: z.string(),
			metadata: z.record(z.string(), z.any()).optional(),
		}),
	}),
	execute: async ({ context }) => {
		const file = context.document as File;
		// @ts-ignore - TypeScript incorrectly infers function signature
		const extractedData: ExtractedTextData =
			await extractTextFromDocument(file);
		return { extractedData };
	},
});
