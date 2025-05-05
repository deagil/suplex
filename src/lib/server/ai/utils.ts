import { generateText, type Message } from 'ai';
import { myProvider } from './models';
import { AIInternalError } from '$lib/errors/ai';

export async function generateTitleFromUserMessage({
  message
}: {
  message: Message;
}): Promise<string> {
  try {
    const result = await generateText({
      model: myProvider.languageModel('title-model'),
      system: `\n
          - you will generate a short title based on the first message a user begins a conversation with
          - ensure it is not more than 25 characters long
          - the title should be a summary of the user's message
          - do not use quotes or colons`,
      prompt: JSON.stringify(message)
    });
    return result.text;
  } catch (e) {
    throw new AIInternalError({ cause: e });
  }
}
