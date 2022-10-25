import { BadRequestException } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';
import { IsDefined, IsMongoId, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';

export class CreateBehaviorChild {
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  clientId: Types.ObjectId;

  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  parentBehaviorId: Types.ObjectId;
}
