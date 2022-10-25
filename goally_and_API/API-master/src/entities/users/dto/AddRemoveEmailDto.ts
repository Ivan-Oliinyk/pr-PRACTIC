import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { EMAIL_ACTION } from 'src/shared/const/email-actions';

export class AddRemoveEmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(EMAIL_ACTION))
  action: string;
}
