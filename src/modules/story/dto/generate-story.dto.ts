import { IsString } from 'class-validator';

export class GenerateStoryDto {
  @IsString()
  story_id: string;
}
