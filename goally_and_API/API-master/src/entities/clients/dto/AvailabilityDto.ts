import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNotEmptyObject, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';
import { ScheduleDto } from 'src/entities/routines/dto/ScheduleDto';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';

export class AvailabilityDto {
  @IsNotEmpty()
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  clientId: Types.ObjectId;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => ScheduleDto)
  schedule: ScheduleDto;
}
