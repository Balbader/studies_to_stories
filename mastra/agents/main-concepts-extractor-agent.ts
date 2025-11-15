import { Agent } from '@mastra/core/agent';

export const mainConceptsExtractorAgent = new Agent({
	name: 'Main Concepts Extractor Agent',
	instructions: `You are a Main Concepts Extractor Agent. Extract the main concepts from the enhanced lesson content.`,
	model: 'anthropic/claude-haiku-4-5',
});
