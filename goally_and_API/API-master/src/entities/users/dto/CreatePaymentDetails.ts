import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, ValidateNested, IsString } from 'class-validator';
import { AttachSubscription } from './AttachSubscription';
import { Types } from 'mongoose';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';
export class CreatePaymentDetails {
  @IsOptional()
  paymentMethod: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AttachSubscription)
  subscription: AttachSubscription;

  @IsInt()
  quantity: number;

  @IsString()
  sku: string;
  
  @IsOptional()
  @IsString()
  color: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  clientId: Types.ObjectId;

  @IsOptional()
  metadata: any;
}
