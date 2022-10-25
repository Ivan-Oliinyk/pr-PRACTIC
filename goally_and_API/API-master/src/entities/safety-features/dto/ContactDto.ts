import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';
import { urlRegex } from 'src/shared/validation/regexp';

export class ContactDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @Matches(urlRegex, { message: 'imgURL is invalid' })
  imgURL: string;

  @IsNotEmpty()
  @IsString()
  relationship: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsNumber()
  priority: number;
}
export const MIN_CONTACTS = 1;
