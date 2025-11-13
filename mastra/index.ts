import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { lessonEnhancerAgent } from './agents/lesson-enhancer-agent';

// Ensure API key is available - AI SDK will read from process.env.ANTHROPIC_API_KEY
if (!process.env.ANTHROPIC_API_KEY) {
	console.error(
		'❌ ANTHROPIC_API_KEY is not set in environment variables. Please set it in your .env.local file.',
	);
}

// Singleton pattern to prevent multiple initializations (important for Next.js hot reloading)
let mastraInstance: Mastra | null = null;

function getMastraInstance(): Mastra {
	if (!mastraInstance) {
		// Disable observability in development to avoid "already registered" errors during hot reloading
		// Enable it in production for better monitoring
		const isDevelopment = process.env.NODE_ENV === 'development';

		mastraInstance = new Mastra({
			agents: { lessonEnhancerAgent },
			logger: new PinoLogger({
				name: 'Mastra',
				level: 'info',
			}),
			// Only enable observability in production to avoid hot reload conflicts
			...(isDevelopment
				? {}
				: {
						observability: {
							default: { enabled: true },
						},
					}),
		});
	}
	return mastraInstance;
}

// Use a getter function instead of direct export to handle hot reloading better
export const mastra = getMastraInstance();
