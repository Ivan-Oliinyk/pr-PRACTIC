import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { AttachSubscription } from './AttachSubscription';
import { Types } from 'mongoose';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';
export class OnboardingPaymentDetails {
  @IsOptional()
  paymentMethod: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AttachSubscription)
  subscription: AttachSubscription;

  @IsInt()
  quantity: number;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested()
  @Type(() => ClientForOnboarding)
  clients: ClientForOnboarding[];
}

class ClientForOnboarding {
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  clientId: Types.ObjectId;

  @IsOptional()
  meta: any;
}
