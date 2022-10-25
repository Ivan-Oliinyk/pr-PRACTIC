import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class UpdateMagicPlayMinsDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(1440)
  magicPlayMins: number;
}
