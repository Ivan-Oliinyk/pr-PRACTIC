import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsIn,
  IsOptional,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { USER_TYPES } from 'src/shared/const';
import { IsUniqArrayOfIds } from 'src/shared/validation';
import { namePattern } from 'src/shared/validation/regexp';

export class InvitationValidation {
  @IsEmail()
  email: string;

  @IsIn(Object.values(USER_TYPES))
  type: string;

  @IsOptional()
  @Matches(namePattern)
  @MinLength(1)
  firstName: string;

  @IsOptional()
  @Matches(namePattern)
  @MinLength(1)
  lastName: string;
}

export class CreateInvitationDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(4)
  @IsUniqArrayOfIds()
  @Type(() => InvitationValidation)
  invitations: InvitationValidation[];

  @IsArray()
  @IsUniqArrayOfIds()
  assignedClients: string[];
}
