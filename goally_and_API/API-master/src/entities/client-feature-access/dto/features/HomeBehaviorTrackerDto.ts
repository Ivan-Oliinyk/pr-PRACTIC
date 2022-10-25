import { IsBoolean } from 'class-validator';

export class HomeBehaviorTrackerDto {
  @IsBoolean()
  streamlinedParentRecording: boolean;
  @IsBoolean()
  promptingHierarchyForParents: boolean;
  @IsBoolean()
  quizletsToQueryAnyKnowledge: boolean;
  @IsBoolean()
  reportingSuiteToTrackProgress: boolean;
}
