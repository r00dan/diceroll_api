import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { nanoid } from 'nanoid';
import { Model } from 'mongoose';

import {
  ChatMessageParam,
  Story,
  StoryDocument,
  StoryOption,
} from './story.schema';
import { CreateStoryDto } from './dto/create-story.dto';
import { AiService } from 'core/ai/ai.service';

export interface StoryType {
  response: string;
  options: StoryOption[];
  is_ended: boolean;
}

@Injectable()
export class StoryService {
  constructor(
    @InjectModel(Story.name)
    private readonly storyModel: Model<StoryDocument>,
    private readonly aiService: AiService,
  ) {}

  public async create(dto: CreateStoryDto) {
    const story = await this.storyModel.create({
      ...dto,
      id: nanoid(),
      created_at: new Date(),
      updated_at: new Date(),
    });

    return story.save({ validateBeforeSave: true, checkKeys: true });
  }

  public async getList(user_id: string) {
    return await this.storyModel.find({ owner_id: user_id }).exec();
  }

  public async getOne(id: string) {
    return await this.storyModel.findOne({ id }).exec();
  }

  public async addChunk(id: string, tokens: number, chunk: ChatMessageParam) {
    const story = await this.storyModel.findOne({ id }).exec();
    const newContent = [...story.content, chunk];

    await story.updateOne({ content: newContent, tokens }, { new: true });
  }

  public async generate(story_id: string) {
    const generatedStory = await this.aiService.generateStory();
    const tokens = generatedStory.response.usage.total_tokens;
    const message = generatedStory.response.choices[0].message;
    const parsed = this.parseMessage(message.content);

    // const image = await this.aiService.generateImage(parsed.response);
    // console.log({ image });

    await this.addChunk(story_id, tokens, {
      chunk_id: nanoid(),
      parsed_response: parsed.response,
      parsed_options: parsed.options,
      image_url: '', //image.data[0].url,
      ...message,
    });

    return generatedStory;
  }

  public async continue(story_id: string, selected_option: number) {
    const story = await this.getOne(story_id);
    let content = [];
    let generatedStory;

    if (story.content.length) {
      content = [
        ...story.content.map(({ role, content }) => ({ role, content })),
      ];
      generatedStory = await this.aiService.continueStory(
        content,
        selected_option,
      );
      const tokens = generatedStory.response.usage.total_tokens;
      const message = generatedStory.response.choices[0].message;
      const parsed = this.parseMessage(message.content);

      // const image = await this.aiService.generateImage(parsed.response);
      // console.log({ image: JSON.stringify(image, null, 2) });

      await this.addChunk(story_id, tokens, {
        chunk_id: nanoid(),
        roll: generatedStory.rollResult,
        parsed_response: parsed.response,
        parsed_options: parsed.options,
        image_url: '', //image.data[0].url,
        ...message,
      });
    }

    return generatedStory;
  }

  public async end(story_id: string, selected_option: number) {
    const story = await this.getOne(story_id);
    let content = [];
    let generatedStory;

    if (story.content.length) {
      content = [
        ...story.content.map(({ role, content }) => ({ role, content })),
      ];
      generatedStory = await this.aiService.endStory(content, selected_option);

      const tokens = generatedStory.response.usage.total_tokens;
      const message = generatedStory.response.choices[0].message;
      const parsed = this.parseMessage(message.content);

      // const image = await this.aiService.generateImage(parsed.response);
      // console.log({ image });

      await this.addChunk(story_id, tokens, {
        chunk_id: nanoid(),
        roll: generatedStory.rollResult,
        parsed_response: parsed.response,
        parsed_options: parsed.options,
        image_url: '', //image.data[0].url,
        ...message,
      });

      if (parsed.is_ended) {
        await this.endStory(story_id);
      }
    }

    return generatedStory;
  }

  private parseMessage(msg: any): StoryType {
    console.log(msg);
    const modified = msg
      .replace('```json', '')
      .replace(/[\n\r]/g, '')
      // .replace(/[\\\n\r]/g, '')
      .replace('```', '');
    const data = JSON.parse(modified);

    return { ...data };
  }

  private async endStory(id: string) {
    const story = await this.storyModel.findOne({ id }).exec();

    await story.updateOne({ is_ended: true }, { new: true });
  }
}
