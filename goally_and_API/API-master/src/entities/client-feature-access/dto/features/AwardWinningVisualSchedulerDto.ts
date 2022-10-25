import { IsBoolean } from 'class-validator';

export class AwardWinningVisualSchedulerDto {
  @IsBoolean()
  awardWinningVisualScheduler: boolean;
  @IsBoolean()
  dedicatedMobileAppForLearners: boolean;
  @IsBoolean()
  winPointsForRoutineCompletion: boolean;
  @IsBoolean()
  startTimeAutomation: boolean;
  @IsBoolean()
  uploadCustomImagesForVisualAids: boolean;
  @IsBoolean()
  uploadCustomVideoToModelBehavior: boolean;
  @IsBoolean()
  uploadAudioRecordingsForAuditoryPrompts: boolean;
}
