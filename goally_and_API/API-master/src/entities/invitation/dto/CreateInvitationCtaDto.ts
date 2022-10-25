import { Transform } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Types } from 'mongoose';
import { USER_TYPES } from 'src/shared/const';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';
import { namePattern } from 'src/shared/validation/regexp';

export class CreateInvitationCtaDto {
  @IsOptional()
  @IsPhoneNumber(null)
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(USER_TYPES))
  type: string;

  @IsNotEmpty()
  @IsString()
  @Matches(namePattern)
  @MinLength(1)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Matches(namePattern)
  @MinLength(1)
  lastName: string;

  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  assignedClient: Types.ObjectId;
}
