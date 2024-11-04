import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';

import { Command, commands } from './commands';
import { getRandomInt } from 'utils/getRandomInt';

enum ChatModel {
  GPT_4O = 'gpt-4o',
  GPT_4O_MINI = 'gpt-4o-mini',
}

enum ImageModel {
  DALLE_2 = 'dall-e-2',
  DALLE_3 = 'dall-e-3',
}

const TEMPERATURE = 1; // 0-1

@Injectable()
export class AiService {
  private readonly ai: OpenAI;
  private readonly images: OpenAI.Images;
  private readonly imageModel = ImageModel.DALLE_3;
  private readonly chatModel = ChatModel.GPT_4O_MINI;

  constructor() {
    this.ai = new OpenAI({
      apiKey: process.env.AI_API_KEY,
    });
    this.images = this.ai.images;
  }

  public async generateStory() {
    const response = await this.ai.chat.completions.create({
      model: this.chatModel,
      messages: [
        { role: 'system', content: commands[Command.INITIAL] },
        { role: 'user', content: commands[Command.CREATE_STORY] },
      ],
      max_tokens: 1000,
      temperature: TEMPERATURE,
    });

    return { response };
  }

  public async continueStory(
    prevMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
    selectedOption: number,
    shouldRoll: boolean = true,
  ) {
    console.log({
      prevMessages: prevMessages.length,
      shouldRoll,
    });

    const rollResult = getRandomInt(1, 20);
    const userContent = `I selected option #${selectedOption}${shouldRoll ? ` and selected suboption with roll: ${rollResult} inside.` : '.'}${commands[Command.CONTINUE_STORY]}`;
    const response = await this.ai.chat.completions.create({
      model: this.chatModel,
      messages: [
        { role: 'system', content: commands[Command.INITIAL] },
        ...prevMessages,
        {
          role: 'user',
          content: userContent,
        },
      ],
      // max_tokens: 500,
      temperature: TEMPERATURE,
    });

    console.log(userContent);

    return {
      response,
      rollResult,
    };
  }

  public async endStory(
    prevMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
    selectedOption: number,
    shouldRoll: boolean = true,
  ) {
    console.log({
      prevMessages: prevMessages.length,
      shouldRoll,
    });

    const rollResult = getRandomInt(1, 20);
    const response = await this.ai.chat.completions.create({
      model: this.chatModel,
      messages: [
        { role: 'system', content: commands[Command.INITIAL] },
        ...prevMessages,
        {
          role: 'user',
          content: `I selected ${selectedOption}${shouldRoll ? `I rolled ${rollResult}.` : '.'}${commands[Command.END_STORY]}`,
        },
      ],
      // max_tokens: 500,
      temperature: TEMPERATURE,
    });

    return {
      response,
      rollResult,
    };
  }

  public async generateImage(story: string) {
    const rule =
      'Generate image based on this story (do not use story text into an image):';
    const promptMaxSize = 1_000;
    const availablePromptSize = promptMaxSize - rule.length;
    return await this.images.generate({
      model: this.imageModel,
      prompt: `${rule}${story.length > availablePromptSize ? story.slice(0, availablePromptSize - 1) : story}`,
      quality: 'standard',
      size: '1024x1024',
      response_format: 'url',
    });
  }
}
