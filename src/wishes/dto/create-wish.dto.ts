import {
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Min,
} from 'class-validator';

export class CreateWishDto {
  @IsString()
  @Length(2, 200)
  name: string;

  @IsString()
  @IsUrl()
  link: string;

  @IsString()
  @IsUrl()
  image: string;

  @IsNumber()
  @Min(1)
  price: number;

  @IsNumber()
  @IsOptional()
  raised?: 0;

  @IsNumber()
  @IsOptional()
  copied?: 0;

  @IsString()
  @Length(2, 200)
  description?: string;
}
