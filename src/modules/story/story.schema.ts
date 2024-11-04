import { Prop, Schema, SchemaFactory, ModelDefinition } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import OpenAI from 'openai';

export interface StoryOptionRoll {
  roll_range: string;
  result: string;
}

export interface StoryOption {
  text: string;
  rolls: StoryOptionRoll[];
}

export interface ContentChunkParams {
  chunk_id?: string;
  roll?: number;
  parsed_response?: string;
  parsed_options?: StoryOption[];
  image_url?: string;
}

export type ChatMessageParam =
  OpenAI.Chat.Completions.ChatCompletionMessageParam & ContentChunkParams;

@Schema()
export class Story {
  @Prop({ required: true })
  id: string;

  @Prop()
  owner_id: string;

  @Prop({
    type: Array<ChatMessageParam>,
    default: [],
  })
  content: ChatMessageParam[];

  @Prop({ default: 0 })
  tokens: number;

  @Prop({ default: false })
  is_ended: boolean;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export type StoryDocument = HydratedDocument<Story>;
export const StorySchema = SchemaFactory.createForClass(Story);
export const StoryModel: ModelDefinition = {
  name: Story.name,
  schema: StorySchema,
};
