import { Injectable } from '@nestjs/common';
import { ClientsService } from 'src/entities/clients/clients.service';
import { CompletedSleepModeService } from 'src/entities/completed-sleep-mode/completed-sleep-mode.service';
import { STATUS_PLAYED_SLEEP_MODE } from 'src/entities/completed-sleep-mode/const';
import { CompletedSleepMode } from 'src/entities/completed-sleep-mode/schema/completed-sleep-mode.schema';
import { DevicesService } from 'src/entities/devices/devices.service';
import { UsersService } from 'src/entities/users/users.service';

@Injectable()
export class RealTimeSleepModeService {
  constructor(
    private deviceService: DevicesService,
    private cs: ClientsService,
    private us: UsersService,
    private csms: CompletedSleepModeService,
  ) {}

  async startSleepMode(
    activeSleepMode: CompletedSleepMode,
  ): Promise<CompletedSleepMode> {
    activeSleepMode.status = STATUS_PLAYED_SLEEP_MODE.ACTIVE;
    return await this.csms.update(activeSleepMode._id, activeSleepMode);
  }

  async completeSleepMode(
    activeSleepMode: CompletedSleepMode,
  ): Promise<CompletedSleepMode> {
    return await this.csms.finishSleepMode(activeSleepMode);
  }

  async stopSleepMode(
    activeSleepMode: CompletedSleepMode,
  ): Promise<CompletedSleepMode> {
    activeSleepMode.status = STATUS_PLAYED_SLEEP_MODE.STOPPED;
    return await this.csms.update(activeSleepMode._id, activeSleepMode);
  }
}
