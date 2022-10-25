import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { PROMPTS_OPTIONS, STATUS_PLAYED_ROUTINE } from '../const';

export class SaveCompletedRoutine {
  @IsIn([
    STATUS_PLAYED_ROUTINE.COMPLETED,
    STATUS_PLAYED_ROUTINE.FINISHED,
    STATUS_PLAYED_ROUTINE.NOT_COMPLETED,
  ])
  status: string;

  @IsOptional()
  @IsIn(Object.values(PROMPTS_OPTIONS))
  additionalPrompts: string;

  @IsOptional()
  @Min(1)
  @Max(4)
  @IsNumber()
  indepedenceLevel: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  whatWorkedWell: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  whatNeedsImprov: string;
}
