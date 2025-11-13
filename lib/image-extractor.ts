// Import polyfills FIRST before any pdf-parse imports
import './pdf-polyfills';

import mammoth from 'mammoth';

export interface ExtractedImage {
	imageData: Buffer;
	mimeType: string;
	pageNumber?: number;
	position?: string;
}

/**
 * Extracts images from a PDF file
 * Note: PDF image extraction is complex and may not work in all environments
 * For now, we return an empty array and rely on text-based context
 */
export async function extractImagesFromPDF(
	file: File,
): Promise<ExtractedImage[]> {
	// PDF image extraction requires complex parsing
	// For now, we'll rely on the text context to describe images
	// This can be enhanced later with proper PDF image extraction libraries
	return [];
}

/**
 * Extracts images from a DOCX file
 */
export async function extractImagesFromDOCX(
	file: File,
): Promise<ExtractedImage[]> {
	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	try {
		// Use type assertion since mammoth types may not include images.extractRaw
		// but the method exists at runtime in mammoth 1.11.0+
		const result = await (mammoth.images as any).extractRaw({ buffer });
		const images: ExtractedImage[] = [];

		for (const image of result) {
			if (image.buffer) {
				images.push({
					imageData: image.buffer,
					mimeType: image.contentType || 'image/png',
				});
			}
		}

		return images;
	} catch (error) {
		console.warn('Error extracting images from DOCX:', error);
		// Return empty array if image extraction fails
		return [];
	}
}

/**
 * Extracts images from a document file
 */
export async function extractImagesFromDocument(
	file: File,
): Promise<ExtractedImage[]> {
	const fileExtension = file.name
		.substring(file.name.lastIndexOf('.'))
		.toLowerCase();

	switch (fileExtension) {
		case '.pdf':
			return extractImagesFromPDF(file);
		case '.docx':
			return extractImagesFromDOCX(file);
		case '.doc':
			// .doc files don't support image extraction easily
			return [];
		default:
			return [];
	}
}
