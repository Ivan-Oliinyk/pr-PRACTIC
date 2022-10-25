import { IsEmail, IsIn, IsOptional } from 'class-validator';
import { ADMIN_ROLE_TYPES } from 'src/shared/const';

export class UpdateAdminDto {
  @IsEmail()
  email: string;

  @IsOptional()
  password: string;

  @IsIn(Object.values(ADMIN_ROLE_TYPES))
  role: string;
}
