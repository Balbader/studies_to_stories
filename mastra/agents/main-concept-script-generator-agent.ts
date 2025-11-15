import { Agent } from '@mastra/core/agent';

export const mainConceptScriptGeneratorAgent = new Agent({
	name: 'Main Concept Script Generator Agent',
	instructions: `You are a Main Concept Script Generator Agent. Generate a script for a 8 second short video on the main concepts extracted from the enhanced lesson content. The script should be in the following format: [main concept 1] [main concept 2] [main concept 3].`,
	model: 'anthropic/claude-haiku-4-5',
});
