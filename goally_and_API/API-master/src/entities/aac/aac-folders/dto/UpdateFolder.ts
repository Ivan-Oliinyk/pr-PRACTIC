import { IsNotEmpty, IsString, Matches, IsOptional } from 'class-validator';
import { urlRegex } from 'src/shared/validation/regexp';

export class UpdateFolder {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Matches(urlRegex, { message: 'imageUrl is invalid' })
  imgUrl: string;
}
