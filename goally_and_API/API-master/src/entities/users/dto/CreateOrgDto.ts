import { IsIn, IsNotEmpty } from 'class-validator';
import { STAFF_RANGE } from 'src/shared/const';

export class CreateOrgDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  state: string;

  @IsNotEmpty()
  postalCode: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  @IsIn(Object.values(STAFF_RANGE))
  numberOfStaff: string;
}
