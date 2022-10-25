import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class AacVolumeDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  talkerVolume: number;
}
