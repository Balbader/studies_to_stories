import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { mastra } from '../index';
import { lessonEnhancerAgent } from '../agents/lesson-enhancer-agent';

// Define input schema for the workflow
const workflowInputSchema = z.object({
	lessonTitle: z.string().optional(),
	lessonContent: z.string(),
	level: z.string().optional(),
	language: z.string().optional(),
});

// Define output schema for the workflow
const workflowOutputSchema = z.object({
	text: z.string(),
});

// Create a step that formats the input and calls the agent
const enhanceLessonStep = createStep({
	id: 'enhance-lesson',
	description: 'Enhance lesson content using the Lesson Enhancer Agent',
	inputSchema: workflowInputSchema,
	outputSchema: workflowOutputSchema,
	execute: async ({ inputData }) => {
		const { lessonTitle, lessonContent, level, language } = inputData;

		// Build an optimized, concise prompt for faster processing
		let prompt = '';

		if (lessonTitle) {
			prompt += `Title: ${lessonTitle}\n`;
		}

		if (level) {
			prompt += `Level: ${level}\n`;
		}

		if (language) {
			prompt += `Language: ${language}\n`;
		}

		prompt += `\nEnhance this lesson:\n${lessonContent}`;

		// Call the agent with the formatted prompt
		const result = await lessonEnhancerAgent.generate(prompt);

		return {
			text: result.text,
		};
	},
});

// Create the workflow and chain the step
export const lessonEnhancerWorkflow = createWorkflow({
	mastra,
	id: 'lesson-enhancer-workflow',
	description: 'Workflow to enhance lesson content using AI',
	inputSchema: workflowInputSchema,
	outputSchema: workflowOutputSchema,
})
	.then(enhanceLessonStep)
	.commit();
