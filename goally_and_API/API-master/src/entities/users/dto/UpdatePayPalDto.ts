import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdatePayPalDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  payPalId: string;
}
