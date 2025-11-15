'use server';

import { lessonEnhancerWorkflow } from '../../mastra/workflows/lesson-enhancer-workflow';
import { lessonToStoryWorkflow } from '../../mastra/workflows/lesson-to-story-workflow';

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

export async function createStory(formData: FormData) {
	// Check for API key before proceeding
	if (!process.env.ANTHROPIC_API_KEY) {
		throw new Error(
			'ANTHROPIC_API_KEY is not set. Please add it to your .env.local file.',
		);
	}

	const lessonTitle = formData.get('lessonTitle')?.toString();
	const lessonContent = formData.get('lessonContent')?.toString();
	const storytone = formData.get('storytone')?.toString() || 'humorous';
	const ageMode = formData.get('ageMode')?.toString() || 'ya';
	const characterVoice =
		formData.get('characterVoice')?.toString() || 'bradford';
	const language = formData.get('language')?.toString();

	if (!lessonContent) {
		throw new Error('Lesson content is required');
	}

	// Validate storytone
	const validStorytones = [
		'dark',
		'humorous',
		'poetic',
		'epic',
		'adventure',
		'mystery',
		'slice-of-life',
	] as const;
	if (
		!validStorytones.includes(storytone as (typeof validStorytones)[number])
	) {
		throw new Error(`Invalid storytone: ${storytone}`);
	}

	// Validate age mode
	const validAgeModes = ['children', 'ya', 'adult'] as const;
	if (!validAgeModes.includes(ageMode as (typeof validAgeModes)[number])) {
		throw new Error(`Invalid age mode: ${ageMode}`);
	}

	// Validate character voice
	const { CHARACTER_VOICES } = await import('@/lib/character-voices');
	const validCharacterVoices = CHARACTER_VOICES.map((v) => v.id);
	if (!validCharacterVoices.includes(characterVoice)) {
		throw new Error(`Invalid character voice: ${characterVoice}`);
	}

	try {
		const run = await lessonToStoryWorkflow.createRunAsync();
		const result = await run.start({
			inputData: {
				lessonTitle,
				lessonContent,
				storytone: storytone as (typeof validStorytones)[number],
				ageMode: ageMode as (typeof validAgeModes)[number],
				characterVoice,
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
		return {
			story: result.result.story,
			characters: result.result.characters,
			scenes: result.result.scenes,
			audioText: result.result.audioText,
			audioUrl: result.result.audioUrl,
		};
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
