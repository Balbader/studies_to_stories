import { Agent } from '@mastra/core/agent';

export const lessonEnhancerAgent = new Agent({
	name: 'Lesson Enhancer Agent',

	instructions: `You are a Lesson Enhancer Agent. Enhance lesson content to be clearer, more engaging, and practical. Add real-world examples, metaphors, and activities. Maintain original meaning. If content mentions images/visuals, describe them contextually. Be concise and educational.`,

	// Use a real model that is available in the ai-sdk/Mastra provider
	model: 'anthropic/claude-haiku-4-5',
});
