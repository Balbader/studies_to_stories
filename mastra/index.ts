import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { lessonEnhancerAgent } from './agents/lesson-enhancer-agent';

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
