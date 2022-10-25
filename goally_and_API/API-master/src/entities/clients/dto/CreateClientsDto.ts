import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { timezones } from 'src/shared/const';
import { namePattern } from 'src/shared/validation/regexp';

export class OnboardingClientsDto {
  @IsNotEmpty()
  @Matches(namePattern)
  @MinLength(1)
  firstName: string;

  @IsNotEmpty()
  @Matches(namePattern)
  @MinLength(1)
  lastName: string;

  @IsNotEmpty()
  @IsIn(timezones.map(e => e.value))
  timezone: string;

  @IsOptional()
  meta: any;
}
export class CreateOnboardingClientsDto {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OnboardingClientsDto)
  clients: OnboardingClientsDto[];
}
