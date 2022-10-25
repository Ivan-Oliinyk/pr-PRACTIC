import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { urlRegex } from 'src/shared/validation/regexp';

export class CreateFolder {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Matches(urlRegex, { message: 'imageUrl is invalid' })
  imgUrl: string;
}
