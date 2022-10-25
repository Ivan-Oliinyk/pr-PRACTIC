import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectEventEmitter } from 'nest-emitter';
import { Client } from 'src/entities/clients/schema/client.schema';
import { PlayedRoutine } from 'src/entities/played-routine/schema/played-routine.schema';
import { CLIENT_NOTIFICATIONS, ROUTINE_ACTIONS } from 'src/socket/const';
import { SocketBase } from 'src/socket/socket-base.gateway';
import { Types } from 'mongoose';
import { GoallyEventEmitter } from '../const';

@Injectable()
export class ActiveRoutineNotifier implements OnModuleInit {
  constructor(
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
    private baseSocket: SocketBase,
  ) {}

  onModuleInit() {
    this.emitter.on(
      'ActiveRoutineChangedNotifyWebPortal',
      async msg => await this.onActiveRoutineChangedNotifyWebPortal(msg),
    );
    this.emitter.on(
      'ActiveRoutineChangedNotifyDevice',
      async msg => await this.onActiveRoutineChangedNotifyDevice(msg),
    );
  }
  async onActiveRoutineChangedNotifyWebPortal(msg: {
    routine: PlayedRoutine;
    clientId: Types.ObjectId;
  }) {
    console.log('onActiveRoutineChangedNotifyWebPortal');

    console.log(msg);
    await this.baseSocket.sendToAllParentConnectedToClient(
      msg.clientId,
      ROUTINE_ACTIONS.ACTIVE_ROUTINE_CHANGED,
      { clientId: msg.clientId, activeRoutine: msg.routine },
    );
  }
  async onActiveRoutineChangedNotifyDevice(msg: {
    routine: PlayedRoutine;
    clientId: Types.ObjectId;
    socketId?: string;
  }) {
    console.log('onActiveRoutineChangedNotifyDevice');

    console.log(JSON.stringify(msg, null, 4));
    if (!msg.socketId)
      msg.socketId = await this.baseSocket.getDeviceSocketByClientId(
        msg.clientId,
      );

    await this.baseSocket.sendToSocketId(
      msg.socketId,
      ROUTINE_ACTIONS.ACTIVE_ROUTINE_CHANGED,
      {
        activeRoutine: msg.routine,
      },
    );
  }
}
