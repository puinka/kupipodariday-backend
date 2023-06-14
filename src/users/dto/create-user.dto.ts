import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 30)
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  avatar?: 'https://i.pravatar.cc/300';

  @IsString()
  @Length(2, 200)
  @IsOptional()
  about?: string;
}
