import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ActivityDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  ordering: number;
}
