import { IsInt } from 'class-validator';

export class UpdateBillingCycleDto {
  @IsInt()
  newBillingPeriod: number;
}
