import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { Types } from 'mongoose';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';
import { urlRegex } from 'src/shared/validation/regexp';

export class CreatePuzzleDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  clientId: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  @Matches(urlRegex, { message: 'puzzle url is invalid' })
  puzzleUrl: string;
}
