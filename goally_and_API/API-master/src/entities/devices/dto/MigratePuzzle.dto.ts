import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class PuzzleProgress {
  @IsString()
  @IsNotEmpty()
  puzzleName: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(16)
  completedPieces: number[];
}

export class MigratePuzzleDto {
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  totalPieces: number;

  @IsArray()
  // @ArrayNotEmpty()
  // @ArrayMinSize(0)
  @ValidateNested({ each: true })
  @Type(() => PuzzleProgress)
  puzzleProgress: PuzzleProgress[];
}
