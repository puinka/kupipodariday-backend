import {
  IsNumber,
  IsOptional,
  IsPositive,
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

  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @Min(1)
  @IsPositive()
  price: number;

  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsOptional()
  raised: number;

  @IsNumber()
  @IsOptional()
  copied: number;

  @IsString()
  @Length(2, 200)
  description?: string;
}
