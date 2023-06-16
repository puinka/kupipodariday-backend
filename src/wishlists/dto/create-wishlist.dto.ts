import {
  IsArray,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateWishlistDto {
  @Length(1, 250)
  @IsString()
  name: string;

  @MaxLength(1024)
  @IsString()
  @IsOptional()
  description: string;

  @IsUrl()
  @IsString()
  image: string;

  @IsArray()
  itemsId: number[];
}
