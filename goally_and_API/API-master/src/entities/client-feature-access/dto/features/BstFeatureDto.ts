import { IsBoolean } from 'class-validator';

export class BstFeatureDto {
  @IsBoolean()
  customSocialStoryCreation: boolean;
  @IsBoolean()
  gamifiedFeedback: boolean;
  @IsBoolean()
  scriptRehearsalsForHome: boolean;
}
