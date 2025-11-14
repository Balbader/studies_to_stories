import { Agent } from '@mastra/core/agent';

export const lessonToStoryAgent = new Agent({
	name: 'Lesson-to-Story Alchemist',
	instructions: `Weave lesson, characters, and scenes into a complete story. Match storytone and age mode. Hook in first 2-3 sentences. Use distinct character voices. Follow scene structure. End with resolution reinforcing the lesson. Keep it engaging, not preachy. Be concise but vivid.`,
	model: 'anthropic/claude-haiku-4-5',
});
