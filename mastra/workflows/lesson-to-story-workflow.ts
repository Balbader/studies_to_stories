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

		let prompt = `Create compelling characters for a story based on this lesson.\n\n`;

		if (lessonTitle) {
			prompt += `Lesson Title: ${lessonTitle}\n`;
		}

		prompt += `Lesson Content:\n${lessonContent}\n\n`;

		prompt += `Storytone: ${storytone}\n`;
		prompt += `Age Mode: ${ageMode}\n`;

		if (language) {
			prompt += `Language: ${language}\n`;
		}

		prompt += `\nGenerate 2-4 memorable characters that embody different aspects of this lesson. Consider the storytone and age mode when designing their personalities and complexity.`;

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

		let prompt = `Design compelling scenes for a story based on this lesson and these characters.\n\n`;

		if (lessonTitle) {
			prompt += `Lesson Title: ${lessonTitle}\n`;
		}

		prompt += `Lesson Content:\n${lessonContent}\n\n`;

		prompt += `Characters:\n${characters}\n\n`;

		prompt += `Storytone: ${storytone}\n`;
		prompt += `Age Mode: ${ageMode}\n`;

		if (language) {
			prompt += `Language: ${language}\n`;
		}

		prompt += `\nGenerate 3-5 key scenes that form a cohesive narrative arc. Consider the storytone when designing scene atmosphere and the age mode when determining complexity.`;

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

		let prompt = `Create a complete, engaging story based on the following:\n\n`;

		if (lessonTitle) {
			prompt += `Lesson Title: ${lessonTitle}\n`;
		}

		prompt += `Lesson Content:\n${lessonContent}\n\n`;

		prompt += `Characters:\n${characters}\n\n`;

		prompt += `Scene Outlines:\n${scenes}\n\n`;

		prompt += `Storytone: ${storytone}\n`;
		prompt += `Age Mode: ${ageMode}\n`;

		if (language) {
			prompt += `Language: ${language}\n`;
		}

		prompt += `\nWrite a complete story that weaves together the lesson, characters, and scenes. Maintain the storytone throughout and ensure the content and complexity match the age mode. The story should be engaging, memorable, and subtly convey the lesson without being preachy.`;

		const result = await lessonToStoryAgent.generate(prompt);

		return {
			story: result.text,
			characters,
			scenes,
		};
	},
});

// Create the multi-agent workflow: Lesson → Characters → Scene → Story
// We need to manually chain the steps by transforming the output of each step
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
			id: 'merge-characters',
			description: 'Merge characters into workflow data',
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
			id: 'merge-scenes',
			description: 'Merge scenes into workflow data',
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
