import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';
import { urlRegex } from 'src/shared/validation/regexp';

export class VideoDto {
  @IsNumber()
  @Min(1)
  fileSize: number;

  @IsNotEmpty()
  @IsString()
  videoName: string;

  @IsNotEmpty()
  @IsString()
  @Matches(urlRegex, { message: 'url is invalid' })
  videoUrl: string;

  @IsNotEmpty()
  @IsString()
  @Matches(urlRegex, { message: 'url is invalid' })
  thumbnailUrl: string;
}

export class UpdateSleepAid {
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(6)
  @ValidateNested({ each: true })
  @Type(() => VideoDto)
  videos: VideoDto[];
}
