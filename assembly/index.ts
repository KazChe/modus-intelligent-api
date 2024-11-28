import { models } from "@hypermode/modus-sdk-as";
import {
  OpenAIChatModel,
  SystemMessage,
  UserMessage,
} from "@hypermode/modus-sdk-as/models/openai/chat";

export function generateExcuses(event: string): string {
  const modelName: string = "llm";
  const model = models.getModel<OpenAIChatModel>(modelName);

  const prompt = `Generate 2 absurd, sarcastic, over-the-top and dark excuses for why I can't attend "${event}". 
  Make them elaborate, ridiculous, and completely unbelievable. 
  Each excuse should be at least 2 sentences long.
  Format the response as a JSON array of strings, with each excuse as a separate element.`;

  const input = model.createInput([
    new SystemMessage(
      "You are a creative, dark and sarcastic excuse generator. Your excuses should be outlandish and humorous."
    ),
    new UserMessage(prompt),
  ]);

  // Set temperature higher for more creative responses
  input.temperature = 0.9;

  const response = model.invoke(input);
  return response.choices[0].message.content.trim();

  // return JSON.parse<string[]>(content);
}
