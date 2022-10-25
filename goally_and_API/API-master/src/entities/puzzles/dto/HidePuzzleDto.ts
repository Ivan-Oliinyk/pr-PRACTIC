import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';

export class HidePuzzleDto {
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  puzzleId: Types.ObjectId;

  @IsBoolean()
  @IsNotEmpty()
  isHidden: boolean;
}
