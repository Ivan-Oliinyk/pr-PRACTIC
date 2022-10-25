import { IsNotEmpty, IsUUID, Matches } from 'class-validator';
import { Match } from 'src/shared/validation/';
import { passwordRegex } from 'src/shared/validation/regexp';

export class ResetPwdDto {
  @IsNotEmpty()
  @Matches(passwordRegex)
  password: string;

  @IsNotEmpty()
  @Match('password')
  @Matches(passwordRegex)
  passwordConfirmation: string;

  @IsNotEmpty()
  @IsUUID()
  resetToken: string;
}
