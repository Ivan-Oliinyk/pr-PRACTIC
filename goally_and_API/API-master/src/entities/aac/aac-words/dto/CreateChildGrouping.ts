import { Transform } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';
import { Types } from 'mongoose';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';

export class CreateChildGrouping {
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  clientId: Types.ObjectId;

  @IsNumber()
  @Min(50)
  grouping: number;
}
