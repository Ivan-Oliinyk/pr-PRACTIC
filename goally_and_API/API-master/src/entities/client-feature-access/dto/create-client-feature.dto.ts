import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { AwardWinningVisualSchedulerDto } from './features/AwardWinningVisualSchedulerDto';
import { BstFeatureDto } from './features/BstFeatureDto';
import { DedicatedTimerDto } from './features/DedicatedTimerDto';
import { HomeBehaviorTrackerDto } from './features/HomeBehaviorTrackerDto';
import { TokenEconomyDto } from './features/TokenEconomyDto';

export class CreateClientFeatureAccessDto {
  @ValidateNested()
  @Type(() => AwardWinningVisualSchedulerDto)
  awardWinningVisualScheduler: AwardWinningVisualSchedulerDto;

  @ValidateNested()
  @Type(() => TokenEconomyDto)
  tokenEconomy: TokenEconomyDto;

  @ValidateNested()
  @Type(() => DedicatedTimerDto)
  dedicatedVisualTimer: DedicatedTimerDto;

  @ValidateNested()
  @Type(() => HomeBehaviorTrackerDto)
  homeBehaviorTracker: HomeBehaviorTrackerDto;

  @ValidateNested()
  @Type(() => BstFeatureDto)
  behaviorSkillsTraining: BstFeatureDto;
}
