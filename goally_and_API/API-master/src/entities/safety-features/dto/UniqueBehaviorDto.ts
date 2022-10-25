import { IsNotEmpty, IsString } from 'class-validator';

export class UniqueBehaviorDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
export const MIN_UNIQUE_BEHAVIORS = 1;
