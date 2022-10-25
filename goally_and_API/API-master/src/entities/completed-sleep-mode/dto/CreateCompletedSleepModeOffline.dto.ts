import { Transform } from 'class-transformer';
import { IsDateString, IsIn } from 'class-validator';
import { Types } from 'mongoose';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';
import { INITIATOR, STATUS_PLAYED_SLEEP_MODE } from '../const';

export class SaveOfflineCompletedSleepMode {
  // @IsNotEmptyObject()
  // @ValidateNested()
  // @Type(() => InnerChecklist)
  // sleepMode: SleepMode;

  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  sleepModeId: Types.ObjectId;

  @IsIn(Object.values(INITIATOR))
  initiator: string;

  @IsIn(Object.keys(STATUS_PLAYED_SLEEP_MODE))
  status: string;

  @IsDateString()
  finishedAt: Date;

  @IsDateString()
  startedAt: Date;
}
