import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import {
  IsMongoIdObj,
  IsTimeAmPm,
  TransformStringToObjectId,
} from 'src/shared/validation';
import { GameDto } from './Game.dto';

export class CreateGameConfigDto {
  @IsNotEmpty()
  @IsBoolean()
  enablePlayLimit: boolean;

  @IsNotEmpty()
  @IsDefined()
  @IsTimeAmPm()
  startTime: string;

  @IsNotEmpty()
  @IsDefined()
  @IsTimeAmPm()
  endTime: string;

  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @Min(0)
  maxPlayMins: number;

  @ValidateIf(o => o.enablePtsToPlay)
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @Min(1)
  ptsFor15Mins: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => GameDto)
  games: GameDto[];

  @IsNotEmpty()
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  clientId: Types.ObjectId;

  @IsNotEmpty()
  @IsBoolean()
  enablePtsToPlay: boolean;

  @IsOptional()
  @IsNumber()
  duration: number;
}
