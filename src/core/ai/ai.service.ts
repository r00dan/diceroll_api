import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';

@Injectable()
export class AiService {
  private readonly ai: OpenAI;

  constructor() {
    console.log('test');
    this.ai = new OpenAI({
      apiKey: process.env.AI_API_KEY,
    });

    // this.create();
  }

  public async create() {
    const completion = await this.ai.chat.completions.create({
      messages: [{ role: 'system', content: 'Who are you?' }],
      model: 'gpt-4o-mini',
    });

    console.log(completion);

    console.log(completion.choices[0]);
  }
}
