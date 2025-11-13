'use server';

import { lessonEnhancerWorkflow } from '../../mastra/workflows/lesson-enhancer-workflow';

export async function enhanceLesson(formData: FormData) {
	// Check for API key before proceeding
	if (!process.env.ANTHROPIC_API_KEY) {
		throw new Error(
			'ANTHROPIC_API_KEY is not set. Please add it to your .env.local file.',
		);
	}

	const lessonTitle = formData.get('lessonTitle')?.toString();
	const lessonContent = formData.get('lessonContent')?.toString();
	const level = formData.get('level')?.toString();
	const language = formData.get('language')?.toString();

	if (!lessonContent) {
		throw new Error('Lesson content is required');
	}

	try {
		const run = await lessonEnhancerWorkflow.createRunAsync();
		const result = await run.start({
			inputData: {
				lessonTitle,
				lessonContent,
				level,
				language,
			},
		});

		if (result.status !== 'success') {
			const errorMessage =
				result.status === 'failed'
					? result.error instanceof Error
						? result.error.message
						: String(result.error)
					: `Workflow status: ${result.status}`;

			// Provide more helpful error messages
			if (errorMessage.includes('API') || errorMessage.includes('api')) {
				throw new Error(
					`API Error: ${errorMessage}. Please check that your ANTHROPIC_API_KEY is valid and set correctly.`,
				);
			}

			throw new Error(`Workflow failed: ${errorMessage}`);
		}

		// The workflow output is in result.result
		return result.result.text;
	} catch (error) {
		// Re-throw with more context if it's an API key related error
		if (error instanceof Error) {
			if (
				error.message.includes('API') ||
				error.message.includes('api') ||
				error.message.includes('401') ||
				error.message.includes('403')
			) {
				throw new Error(
					`Authentication failed: ${error.message}. Please verify your ANTHROPIC_API_KEY is correct.`,
				);
			}
			throw error;
		}
		throw new Error(`Unexpected error: ${String(error)}`);
	}
}
