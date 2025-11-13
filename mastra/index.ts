import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { lessonEnhancerAgent } from './agents/lesson-enhancer-agent';

// Ensure API key is available - AI SDK will read from process.env.ANTHROPIC_API_KEY
if (!process.env.ANTHROPIC_API_KEY) {
	console.error(
		'❌ ANTHROPIC_API_KEY is not set in environment variables. Please set it in your .env.local file.',
	);
}

export const mastra = new Mastra({
	agents: { lessonEnhancerAgent },
	logger: new PinoLogger({
		name: 'Mastra',
		level: 'info',
	}),
	observability: {
		// Enables DefaultExporter and CloudExporter for AI tracing
		default: { enabled: true },
	},
});
