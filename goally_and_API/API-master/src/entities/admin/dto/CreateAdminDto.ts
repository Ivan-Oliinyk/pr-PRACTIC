import { IsEmail, IsIn, IsNotEmpty } from 'class-validator';
import { ADMIN_ROLE_TYPES } from 'src/shared/const';

export class CreateAdminDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsIn(Object.values(ADMIN_ROLE_TYPES))
  role: string;
}
