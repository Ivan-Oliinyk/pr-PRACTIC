import { IsEmail } from 'class-validator';

export class ForgotPwdDto {
  @IsEmail()
  email: string;
}
