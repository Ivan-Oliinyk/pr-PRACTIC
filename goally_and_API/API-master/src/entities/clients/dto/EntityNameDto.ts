import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
} from 'class-validator';

export class EntityNameDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @Type(() => String)
  entityNames: string[];
}
