import { IsBoolean } from 'class-validator';

export class TokenEconomyDto {
  @IsBoolean()
  giveChildPointsForAnything: boolean;
  @IsBoolean()
  behaviorTrackerIntegration: boolean;
  @IsBoolean()
  puzzlesForLearnersToComplete: boolean;
  @IsBoolean()
  beautifulPuzzles: boolean;
  @IsBoolean()
  createCustomRewardsToEarn: boolean;
}
