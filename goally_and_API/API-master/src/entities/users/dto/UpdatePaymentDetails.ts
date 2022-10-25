import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { AttachSubscription } from './AttachSubscription';

export class UpdatePaymentDetails {
  @IsOptional()
  paymentMethod: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AttachSubscription)
  subscription: AttachSubscription;
}
