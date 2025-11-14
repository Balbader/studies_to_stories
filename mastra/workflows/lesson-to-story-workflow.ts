import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { mastra } from '../index';
import { characterAgent } from '../agents/character-agent';
import { sceneAgent } from '../agents/scene-agent';
import { lessonToStoryAgent } from '../agents/lesson-to-story-agent';

// Define storytone type
export const storytoneOptions = [
	'dark',
	'humorous',
	'poetic',
	'epic',
	'adventure',
	'mystery',
	'slice-of-life',
] as const;

// Define age mode type
export const ageModeOptions = ['children', 'ya', 'adult'] as const;

// Define input schema for the workflow
const workflowInputSchema = z.object({
	lessonTitle: z.string().optional(),
	lessonContent: z.string(),
	storytone: z.enum(storytoneOptions).default('humorous'),
	ageMode: z.enum(ageModeOptions).default('ya'),
	language: z.string().optional(),
});

// Define intermediate schemas
const characterOutputSchema = z.object({
	characters: z.string(),
});

const sceneOutputSchema = z.object({
	scenes: z.string(),
});

// Define output schema for the workflow
const workflowOutputSchema = z.object({
	story: z.string(),
	characters: z.string(),
	scenes: z.string(),
});

// Step 1: Create Characters
const createCharactersStep = createStep({
	id: 'create-characters',
	description: 'Create characters from lesson content',
	inputSchema: workflowInputSchema,
	outputSchema: characterOutputSchema,
	execute: async ({ inputData }) => {
		const { lessonTitle, lessonContent, storytone, ageMode, language } =
			inputData;

		let prompt = `Create 2-3 characters for a story.\n\n`;

		if (lessonTitle) {
			prompt += `Title: ${lessonTitle}\n`;
		}

		prompt += `Lesson: ${lessonContent}\n`;
		prompt += `Tone: ${storytone}, Age: ${ageMode}`;

		if (language) {
			prompt += `, Lang: ${language}`;
		}

		prompt += `\n\nGenerate characters matching tone and age.`;

		const result = await characterAgent.generate(prompt);

		return {
			characters: result.text,
		};
	},
});

// Step 2: Create Scenes (accepts characters from previous step)
const createScenesStep = createStep({
	id: 'create-scenes',
	description: 'Create scenes from lesson and characters',
	inputSchema: z.object({
		lessonTitle: z.string().optional(),
		lessonContent: z.string(),
		storytone: z.enum(storytoneOptions),
		ageMode: z.enum(ageModeOptions),
		language: z.string().optional(),
		characters: z.string(),
	}),
	outputSchema: sceneOutputSchema.extend({
		characters: z.string(), // Pass through characters
	}),
	execute: async ({ inputData }) => {
		const {
			lessonTitle,
			lessonContent,
			storytone,
			ageMode,
			language,
			characters,
		} = inputData;

		let prompt = `Design 3 scenes.\n\n`;

		if (lessonTitle) {
			prompt += `Title: ${lessonTitle}\n`;
		}

		prompt += `Lesson: ${lessonContent}\n`;
		prompt += `Characters: ${characters}\n`;
		prompt += `Tone: ${storytone}, Age: ${ageMode}`;

		if (language) {
			prompt += `, Lang: ${language}`;
		}

		prompt += `\n\nGenerate 3 scenes forming a narrative arc.`;

		const result = await sceneAgent.generate(prompt);

		return {
			scenes: result.text,
			characters, // Pass through characters
		};
	},
});

// Step 3: Create Final Story (accepts all previous data)
const createStoryStep = createStep({
	id: 'create-story',
	description: 'Create final story from lesson, characters, and scenes',
	inputSchema: z.object({
		lessonTitle: z.string().optional(),
		lessonContent: z.string(),
		storytone: z.enum(storytoneOptions),
		ageMode: z.enum(ageModeOptions),
		language: z.string().optional(),
		characters: z.string(),
		scenes: z.string(),
	}),
	outputSchema: workflowOutputSchema,
	execute: async ({ inputData }) => {
		const {
			lessonTitle,
			lessonContent,
			storytone,
			ageMode,
			language,
			characters,
			scenes,
		} = inputData;

		let prompt = `Write a complete story.\n\n`;

		if (lessonTitle) {
			prompt += `Title: ${lessonTitle}\n`;
		}

		prompt += `Lesson: ${lessonContent}\n`;
		prompt += `Characters: ${characters}\n`;
		prompt += `Scenes: ${scenes}\n`;
		prompt += `Tone: ${storytone}, Age: ${ageMode}`;

		if (language) {
			prompt += `, Lang: ${language}`;
		}

		prompt += `\n\nWeave into an engaging story matching tone and age. Convey lesson subtly.`;

		const result = await lessonToStoryAgent.generate(prompt);

		return {
			story: result.text,
			characters,
			scenes,
		};
	},
});

// Create the multi-agent workflow: Lesson → Characters → Scene → Story
// Optimized: Removed unnecessary merge steps and streamlined data flow
export const lessonToStoryWorkflow = createWorkflow({
	mastra,
	id: 'lesson-to-story-workflow',
	description:
		'Multi-agent workflow to transform lessons into stories: Lesson → Characters → Scene → Story',
	inputSchema: workflowInputSchema,
	outputSchema: workflowOutputSchema,
})
	.then(createCharactersStep)
	.then(
		createStep({
			id: 'prepare-scenes',
			description: 'Prepare data for scene creation',
			inputSchema: workflowInputSchema.extend({
				characters: z.string(),
			}),
			outputSchema: z.object({
				lessonTitle: z.string().optional(),
				lessonContent: z.string(),
				storytone: z.enum(storytoneOptions),
				ageMode: z.enum(ageModeOptions),
				language: z.string().optional(),
				characters: z.string(),
			}),
			execute: async ({ inputData }) => inputData,
		}),
	)
	.then(createScenesStep)
	.then(
		createStep({
			id: 'prepare-story',
			description: 'Prepare data for story creation',
			inputSchema: z.object({
				lessonTitle: z.string().optional(),
				lessonContent: z.string(),
				storytone: z.enum(storytoneOptions),
				ageMode: z.enum(ageModeOptions),
				language: z.string().optional(),
				characters: z.string(),
				scenes: z.string(),
			}),
			outputSchema: z.object({
				lessonTitle: z.string().optional(),
				lessonContent: z.string(),
				storytone: z.enum(storytoneOptions),
				ageMode: z.enum(ageModeOptions),
				language: z.string().optional(),
				characters: z.string(),
				scenes: z.string(),
			}),
			execute: async ({ inputData }) => inputData,
		}),
	)
	.then(createStoryStep)
	.commit();
