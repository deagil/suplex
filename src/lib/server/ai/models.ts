import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
// import { createGroq } from '@ai-sdk/groq';
import { customProvider, extractReasoningMiddleware, wrapLanguageModel } from 'ai';
import { PRIVATE_OPENAI_KEY } from '$env/static/private';

const openai = createOpenAI({ apiKey: PRIVATE_OPENAI_KEY });

// export const myProvider = customProvider({
// 	languageModels: {
// 		'chat-model': openai('gpt-4o-mini'),
// 		'chat-model-reasoning': wrapLanguageModel({
// 			model: groq('gpt-o3-mini'),
// 			middleware: extractReasoningMiddleware({ tagName: 'think' })
// 		}),
// 	},
// 	imageModels: {
// 		'small-model': openai.image('grok-2-image')
// 	}
// });

export const myProvider = customProvider({
	languageModels: {
		'title-model': openai('gpt-4o-mini'),
		'chat-model': openai('gpt-4o-mini'),
		'chat-model-reasoning': wrapLanguageModel({
			model: openai('gpt-o3-mini'),
			middleware: extractReasoningMiddleware({ tagName: 'think' })
		}),
	},
	// imageModels: {
	// 	'vercel-image': openai.image('dalle-2')
	// }
});

// export async function POST({ request }) {
// 	const { messages } = await request.json();

// 	const result = streamText({
// 		model: openai('gpt-4o-mini'),
// 		messages,
// 	});

// 	return result.toDataStreamResponse();
// }

