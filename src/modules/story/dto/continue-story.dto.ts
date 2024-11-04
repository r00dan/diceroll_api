import { IsNumber, IsString } from 'class-validator';

export class ContinueStoryDto {
  @IsString()
  story_id: string;

  @IsNumber()
  selected_option: number;
}
