// Import polyfills FIRST before any pdf-parse imports
import './pdf-polyfills';

import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';
import path from 'path';
import type { ExtractedImage } from './image-extractor';

// Configure PDF.js worker for Node.js environment
if (typeof window === 'undefined') {
	const workerPath = path.join(
		process.cwd(),
		'node_modules',
		'pdfjs-dist',
		'legacy',
		'build',
		'pdf.worker.mjs',
	);
	PDFParse.setWorker(workerPath);
}

export interface ExtractedTextData {
	fileName: string;
	fileType: 'pdf' | 'docx' | 'doc';
	text: string;
	extractedAt: string;
	metadata?: Record<string, any>;
	images?: ExtractedImage[];
}

/**
 * Extracts text from a PDF file
 */
async function extractTextFromPDF(file: File): Promise<ExtractedTextData> {
	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	const pdfParser = new PDFParse({ data: buffer });
	const pdfData = await pdfParser.getText();

	// Skip image extraction for speed - images will be handled by context in enhancement
	// Set to undefined to skip the extra processing step
	const images: ExtractedImage[] | undefined = undefined;

	return {
		fileName: file.name,
		fileType: 'pdf',
		text: pdfData.text,
		extractedAt: new Date().toISOString(),
		metadata: {
			pageCount: pdfData.total,
		},
		images,
	};
}

/**
 * Extracts text from a DOCX file
 */
async function extractTextFromDOCX(file: File): Promise<ExtractedTextData> {
	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	const result = await mammoth.extractRawText({ buffer });

	// Skip image extraction for speed - images will be handled by context in enhancement
	// Set to undefined to skip the extra processing step
	const images: ExtractedImage[] | undefined = undefined;

	return {
		fileName: file.name,
		fileType: 'docx',
		text: result.value,
		extractedAt: new Date().toISOString(),
		metadata:
			result.messages.length > 0
				? { warnings: result.messages }
				: undefined,
		images,
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

/**
 * Combined text data structure for lesson agent
 */
export interface CombinedTextData {
	combinedText: string;
	sources: Array<{
		fileName: string;
		fileType: 'pdf' | 'docx' | 'doc';
		text: string;
		extractedAt: string;
		metadata?: Record<string, any>;
	}>;
	totalDocuments: number;
	totalCharacters: number;
	combinedAt: string;
}

/**
 * Combines all extracted text data into a single JSON object for the lesson agent
 * @param extractedData - Array of extracted text data from multiple documents
 * @returns Combined text data in JSON format
 */
export async function combineExtractedText(
	extractedData: ExtractedTextData[],
): Promise<CombinedTextData> {
	// Combine text first
	let combinedText = extractedData
		.map((data, index) => {
			const separator = index > 0 ? '\n\n---\n\n' : '';
			return `${separator}[Document: ${data.fileName}]\n\n${data.text}`;
		})
		.join('\n\n');

	// Process images and add descriptions
	const allImages: Array<{
		imageData: Buffer;
		mimeType: string;
		position?: string;
	}> = [];

	for (const data of extractedData) {
		if (data.images && data.images.length > 0) {
			allImages.push(...data.images);
		}
	}

	// Add image descriptions to the combined text (non-blocking for speed)
	// We'll add a simple note and let the enhancement agent handle it
	if (allImages.length > 0) {
		// Instead of generating descriptions here (which adds an extra AI call),
		// we'll add a note that the enhancement agent can use
		combinedText += `\n\n[Note: This document contains ${allImages.length} image${allImages.length > 1 ? 's' : ''} that should be described in context with the lesson content]`;
	}

	const totalCharacters = combinedText.length;

	return {
		combinedText,
		sources: extractedData.map((data) => ({
			fileName: data.fileName,
			fileType: data.fileType,
			text: data.text,
			extractedAt: data.extractedAt,
			metadata: data.metadata,
		})),
		totalDocuments: extractedData.length,
		totalCharacters,
		combinedAt: new Date().toISOString(),
	};
}
