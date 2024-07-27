import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  google_id: string;

  @IsEmail()
  email: string;

  @IsString()
  full_name: string;

  @IsString()
  username: string;

  @IsString()
  avatar_url: string;
}
