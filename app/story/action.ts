'use server';

import { lessonEnhancerWorkflow } from '../../mastra/workflows/lesson-enhancer-workflow';

export async function enhanceLesson(formData: FormData) {
	const lessonTitle = formData.get('lessonTitle')?.toString();
	const lessonContent = formData.get('lessonContent')?.toString();
	const level = formData.get('level')?.toString();
	const language = formData.get('language')?.toString();

	const run = await lessonEnhancerWorkflow.createRunAsync();
	const result = await run.start({
		inputData: {
			lessonTitle,
			lessonContent: lessonContent ?? '',
			level,
			language,
		},
	});

	if (result.status !== 'success') {
		throw new Error(
			result.status === 'failed'
				? `Workflow failed: ${result.error}`
				: `Workflow status: ${result.status}`,
		);
	}

	// The workflow output is in result.result
	return result.result.text;
}
