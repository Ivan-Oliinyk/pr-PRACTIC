import { IsNotEmpty, IsString } from 'class-validator';

export class Reason {
  @IsNotEmpty()
  @IsString()
  reason: string;
}
export const MIN_REASONS = 1;
export const MAX_REASONS = 3;
