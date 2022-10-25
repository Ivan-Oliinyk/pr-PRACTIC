import { IsBoolean } from 'class-validator';

export class DedicatedTimerDto {
  @IsBoolean()
  eliminateExpensiveMechanicalTimers: boolean;
  @IsBoolean()
  timersLonger: boolean;
}
