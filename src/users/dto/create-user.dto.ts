import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2, {
    message: 'User name should be at least 2 characters',
  })
  @MaxLength(30, {
    message: 'User name should be no more than 30 characters',
  })
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  avatar?: 'https://i.pravatar.cc/300';

  @IsString()
  @MinLength(2, {
    message: 'About should be at least 2 characters',
  })
  @MaxLength(200, {
    message: 'About should be no more than 200 characters',
  })
  @IsOptional()
  about?: string;
}
