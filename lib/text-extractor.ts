// @ts-ignore - pdf-parse doesn't have proper TypeScript exports
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export interface ExtractedTextData {
	fileName: string;
	fileType: 'pdf' | 'docx' | 'doc';
	text: string;
	extractedAt: string;
	metadata?: Record<string, any>;
}

/**
 * Extracts text from a PDF file
 */
async function extractTextFromPDF(file: File): Promise<ExtractedTextData> {
	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	const pdfData = await pdfParse(buffer);

	return {
		fileName: file.name,
		fileType: 'pdf',
		text: pdfData.text,
		extractedAt: new Date().toISOString(),
		metadata: {
			pageCount: pdfData.numpages,
			info: pdfData.info,
		},
	};
}

/**
 * Extracts text from a DOCX file
 */
async function extractTextFromDOCX(file: File): Promise<ExtractedTextData> {
	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	const result = await mammoth.extractRawText({ buffer });

	return {
		fileName: file.name,
		fileType: 'docx',
		text: result.value,
		extractedAt: new Date().toISOString(),
		metadata:
			result.messages.length > 0
				? { warnings: result.messages }
				: undefined,
	};
}

/**
 * Extracts text from a document file (PDF or DOCX)
 * @param file - The file to extract text from
 * @returns Extracted text data in JSON format
 */
export async function extractTextFromDocument(
	file: File,
): Promise<ExtractedTextData> {
	const fileExtension = file.name
		.substring(file.name.lastIndexOf('.'))
		.toLowerCase();

	switch (fileExtension) {
		case '.pdf':
			return extractTextFromPDF(file);
		case '.docx':
			return extractTextFromDOCX(file);
		case '.doc':
			// Note: .doc files (old Word format) are not directly supported by mammoth
			// You may need to convert them to .docx first or use a different library
			throw new Error(
				'.doc files are not supported. Please convert to .docx format.',
			);
		default:
			throw new Error(
				`Unsupported file type: ${fileExtension}. Only .pdf and .docx are supported.`,
			);
	}
}

/**
 * Extracts text from multiple documents
 * @param files - Array of files to extract text from
 * @returns Array of extracted text data in JSON format
 */
export async function extractTextFromDocuments(
	files: File[],
): Promise<ExtractedTextData[]> {
	const results = await Promise.all(
		files.map((file) => extractTextFromDocument(file)),
	);
	return results;
}
