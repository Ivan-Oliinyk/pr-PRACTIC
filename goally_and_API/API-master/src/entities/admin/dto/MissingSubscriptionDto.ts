import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MissingSubscriptionDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  invoiceNumber: string;

  @IsNotEmpty()
  @IsString()
  subscriptionId: string;
}
