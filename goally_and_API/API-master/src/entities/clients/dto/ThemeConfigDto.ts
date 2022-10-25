import { IsIn, IsOptional } from 'class-validator';
import { CLIENT_THEMES } from 'src/shared/const/client-themes';

export class ThemeConfigDto {
  @IsOptional()
  @IsIn(Object.values(CLIENT_THEMES))
  home: string;

  @IsOptional()
  @IsIn(Object.values(CLIENT_THEMES))
  onboarding: string;

  @IsOptional()
  @IsIn(Object.values(CLIENT_THEMES))
  setting: string;

  @IsOptional()
  @IsIn(Object.values(CLIENT_THEMES))
  daySchedule: string;

  @IsOptional()
  @IsIn(Object.values(CLIENT_THEMES))
  routine: string;

  @IsOptional()
  @IsIn(Object.values(CLIENT_THEMES))
  checklist: string;

  @IsOptional()
  @IsIn(Object.values(CLIENT_THEMES))
  reminder: string;

  @IsOptional()
  @IsIn(Object.values(CLIENT_THEMES))
  talker: string;

  @IsOptional()
  @IsIn(Object.values(CLIENT_THEMES))
  puzzle: string;

  @IsOptional()
  @IsIn(Object.values(CLIENT_THEMES))
  behavior: string;

  @IsOptional()
  @IsIn(Object.values(CLIENT_THEMES))
  reward: string;

  @IsOptional()
  @IsIn(Object.values(CLIENT_THEMES))
  weather: string;

  @IsOptional()
  @IsIn(Object.values(CLIENT_THEMES))
  timer: string;

  @IsOptional()
  @IsIn(Object.values(CLIENT_THEMES))
  wordLab: string;

  @IsOptional()
  @IsIn(Object.values(CLIENT_THEMES))
  balloon: string;

  @IsOptional()
  @IsIn(Object.values(CLIENT_THEMES))
  gameGarage: string;

  @IsOptional()
  @IsIn(Object.values(CLIENT_THEMES))
  help: string;

  @IsOptional()
  @IsIn(Object.values(CLIENT_THEMES))
  bst: string;
}
