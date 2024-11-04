import { IsEmail, IsString } from 'class-validator';

export class CreateStoryDto {
  @IsString()
  owner_id: string;
}
