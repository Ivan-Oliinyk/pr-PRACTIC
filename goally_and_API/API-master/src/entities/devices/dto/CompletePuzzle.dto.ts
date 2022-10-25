import { IsInt, IsString } from 'class-validator';

export class CompletePuzzleDto {
  @IsString()
  puzzleName: string;

  @IsInt()
  puzzlePieces: number;
}
