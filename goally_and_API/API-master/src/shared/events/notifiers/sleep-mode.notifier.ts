import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectEventEmitter } from 'nest-emitter';
import { CompletedSleepMode } from 'src/entities/completed-sleep-mode/schema/completed-sleep-mode.schema';
import { SleepMode } from 'src/entities/sleep-mode/schema/sleep-mode.schema';
import { SLEEP_MODE_NOTIFICATIONS } from 'src/socket/const';
import { SocketBase } from 'src/socket/socket-base.gateway';
import { GoallyEventEmitter } from '../const';
@Injectable()
export class SleepModeNotifier implements OnModuleInit {
  constructor(
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
    private baseSocket: SocketBase,
  ) {}

  onModuleInit() {
    this.emitter.on(
      'SleepModeCreated',
      async sleepMode => await this.onSleepModeCreated(sleepMode),
    );
    this.emitter.on(
      'SleepModeUpdated',
      async sleepMode => await this.onSleepModeUpdated(sleepMode),
    );
    this.emitter.on(
      'SleepModeHistoryCreated',
      async sleepMode => await this.onCompletedSleepModeCreated(sleepMode),
    );
  }

  private async onSleepModeCreated(sleepMode) {
    this.onSleepModeChanged(sleepMode, 'CREATED');
  }

  private async onSleepModeUpdated(sleepMode) {
    this.onSleepModeChanged(sleepMode, 'UPDATED');
  }

  private async onCompletedSleepModeCreated(sleepMode) {
    this.onCompletedSleepModeChanged(sleepMode, 'CREATED');
  }

  onSleepModeChanged(sleepMode: SleepMode, action) {
    const body = {
      sleepModeId: sleepMode._id,
      clientId: sleepMode.clientId,
      action,
      sleepMode,
    };
    if (sleepMode.clientId) {
      this.baseSocket.notifyAllParentsAndDeviceByClientId(
        sleepMode.clientId,
        SLEEP_MODE_NOTIFICATIONS.CLIENT_SLEEP_MODE_CHANGED,
        body,
      );
    }
  }

  onCompletedSleepModeChanged(sleepMode: CompletedSleepMode, action) {
    const body = {
      sleepModeId: sleepMode._id,
      clientId: sleepMode.clientId,
      action,
      sleepMode,
    };
    this.baseSocket.notifyAllParentsAndDeviceByClientId(
      sleepMode.clientId,
      SLEEP_MODE_NOTIFICATIONS.SLEEP_MODE_HISTORY_CHANGED,
      body,
    );
  }
}
