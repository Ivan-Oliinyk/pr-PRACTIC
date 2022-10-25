import { IsBoolean, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class BalloonConfigDto {
  @IsNotEmpty()
  @IsBoolean()
  poppingSound: boolean;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(10)
  speed: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(10)
  borderThickness: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(10)
  size: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(10)
  balloonsCount: number;
}
