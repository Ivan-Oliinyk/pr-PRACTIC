import { Injectable, OnModuleInit } from '@nestjs/common';
import { Types } from 'mongoose';
import { InjectEventEmitter } from 'nest-emitter';
import { CompletedSleepMode } from 'src/entities/completed-sleep-mode/schema/completed-sleep-mode.schema';
import { SLEEP_MODE_ACTIONS } from 'src/socket/const';
import { SocketBase } from 'src/socket/socket-base.gateway';
import { GoallyEventEmitter } from '../const';

@Injectable()
export class ActiveSleepModeNotifier implements OnModuleInit {
  constructor(
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
    private baseSocket: SocketBase,
  ) {}

  onModuleInit() {
    this.emitter.on(
      'ActiveSleepModeChangedNotifyWebPortal',
      async msg => await this.onActiveSleepModeChangedNotifyWebPortal(msg),
    );
    this.emitter.on(
      'ActiveSleepModeChangedNotifyDevice',
      async msg => await this.onActiveSleepModeChangedNotifyDevice(msg),
    );
  }

  async onActiveSleepModeChangedNotifyWebPortal(msg: {
    sleepMode: CompletedSleepMode;
    clientId: Types.ObjectId;
  }) {
    console.log('onActiveSleepModeChangedNotifyWebPortal');

    console.log(msg);
    await this.baseSocket.sendToAllParentConnectedToClient(
      msg.clientId,
      SLEEP_MODE_ACTIONS.ACTIVE_SLEEP_MODE_CHANGED,
      { clientId: msg.clientId, activeSleepMode: msg.sleepMode },
    );
  }
  async onActiveSleepModeChangedNotifyDevice(msg: {
    sleepMode: CompletedSleepMode;
    clientId: Types.ObjectId;
    socketId?: string;
  }) {
    console.log('onActiveSleepModeChangedNotifyDevice');

    console.log(JSON.stringify(msg, null, 4));
    if (!msg.socketId)
      msg.socketId = await this.baseSocket.getDeviceSocketByClientId(
        msg.clientId,
      );

    await this.baseSocket.sendToSocketId(
      msg.socketId,
      SLEEP_MODE_ACTIONS.ACTIVE_SLEEP_MODE_CHANGED,
      {
        activeSleepMode: msg.sleepMode,
      },
    );
  }
}
