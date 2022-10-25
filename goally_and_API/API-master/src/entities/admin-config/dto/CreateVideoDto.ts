import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import { urlRegex } from 'src/shared/validation/regexp';

export class CreateVideoDto {
  @IsString()
  @IsNotEmpty()
  appName: string;

  @IsNumber()
  @Min(1)
  fileSize: number;

  @IsNotEmpty()
  @IsString()
  @Matches(urlRegex, { message: 'url is invalid' })
  url: string;

  @IsOptional()
  updatedAt: Date;
}
