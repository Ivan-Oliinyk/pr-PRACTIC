import { IsIn } from 'class-validator';
import { ROUTINE_FOLDERS } from 'src/shared/const/routine-type';

export class GetActiveRoutineDto {
  @IsIn([
    ROUTINE_FOLDERS.BEHAVIOR_THERAPY,
    ROUTINE_FOLDERS.DAILY_ROUTINES,
    ROUTINE_FOLDERS.FUN,
    ROUTINE_FOLDERS.OCCUPATIONAL_THERAPY,
    ROUTINE_FOLDERS.SCHOOL,
    ROUTINE_FOLDERS.SPEECH_THERAPY,
  ])
  routineFolder?: string;
}
