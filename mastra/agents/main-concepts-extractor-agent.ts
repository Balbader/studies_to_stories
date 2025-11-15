import { Agent } from '@mastra/core/agent';

export const mainConceptsExtractorAgent = new Agent({
	name: 'Main Concepts Extractor Agent',

	instructions: `
		You are a Main Concepts Extractor Agent.,

		Your task is to:
		1. Analyze the enhanced lesson content carefully
		2. Identify the key concepts, topics, and important ideas
		3. Return a JSON object with the following structure:
		{
			"concepts": [
				{
					"name": "Concept Name",
					"description": "Brief description of the concept",
					"importance": "high|medium|low"
				}
			]
		}

		Important requirements:
		- Extract 3-7 main concepts depending on the lesson complexity
		- Each concept should have a clear name and concise description
		- Rank concepts by importance (high, medium, low)
		- Return ONLY valid JSON, no additional text or markdown formatting
		- Ensure the JSON is properly formatted and parseable
	`,
	model: 'anthropic/claude-haiku-4-5',
});
