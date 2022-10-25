import { IsString } from 'class-validator';

export class AddDeviceDto {
  @IsString()
  code: string;
}
