import { lessonEnhancerAgent } from '@/mastra/agents/lesson-enhancer-agent';

/**
 * Describes images found in a lesson document based on surrounding text context
 * This creates contextual descriptions that integrate with the lesson content
 */
export async function describeImagesInContext(
	surroundingText: string,
	imageCount: number,
): Promise<string> {
	if (imageCount === 0) {
		return '';
	}

	const prompt = `You are analyzing a lesson document that contains ${imageCount} image${imageCount > 1 ? 's' : ''}. Based on the surrounding text context, create detailed paragraph descriptions for what these images likely show and how they relate to the lesson content.

Lesson content context:
${surroundingText.substring(0, 2000)}

Please provide ${imageCount} clear, educational paragraph${imageCount > 1 ? 's' : ''} that:
1. Describe what is shown in each image based on the lesson context
2. Explain how each image relates to and enhances the lesson content
3. Integrate naturally with the educational material
4. Use specific details from the lesson to make the descriptions relevant

Format: Provide each image description as a separate paragraph, clearly indicating which image it describes (e.g., "The first image shows..." or "This diagram illustrates..."). Make the descriptions educational and directly tied to the lesson material.`;

	try {
		const result = await lessonEnhancerAgent.generate(prompt);
		return result.text;
	} catch (error) {
		console.error('Error describing images:', error);
		return `[${imageCount} image${imageCount > 1 ? 's' : ''} related to the lesson material]`;
	}
}

/**
 * Processes images and adds contextual descriptions to text
 * Creates descriptions based on the lesson content context
 */
export async function addImageDescriptionsToText(
	text: string,
	images: Array<{ imageData: Buffer; mimeType: string; position?: string }>,
): Promise<string> {
	if (images.length === 0) {
		return text;
	}

	try {
		// Generate contextual descriptions for all images based on the lesson text
		const imageDescriptions = await describeImagesInContext(
			text,
			images.length,
		);

		// Add image descriptions to the text
		// Insert them in a way that flows with the lesson content
		const imageSection = `\n\n[Visual Content Descriptions]\n\n${imageDescriptions}`;

		return text + imageSection;
	} catch (error) {
		console.error('Error adding image descriptions:', error);
		// Return text with a simple placeholder if description fails
		return (
			text +
			`\n\n[Note: This document contains ${images.length} image${images.length > 1 ? 's' : ''} that relate to the lesson content]`
		);
	}
}
