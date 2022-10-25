import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { STAFF_RANGE } from 'src/shared/const';

export class UpdateOrgDto {
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  country: string;

  @IsOptional()
  @IsNotEmpty()
  address: string;

  @IsOptional()
  @IsNotEmpty()
  city: string;

  @IsOptional()
  @IsNotEmpty()
  state: string;

  @IsOptional()
  @IsNotEmpty()
  postalCode: string;

  @IsOptional()
  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  @IsIn(Object.values(STAFF_RANGE))
  numberOfStaff: string;
}
