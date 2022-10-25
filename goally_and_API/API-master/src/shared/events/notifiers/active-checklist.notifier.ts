import { Injectable, OnModuleInit } from '@nestjs/common';
import { Types } from 'mongoose';
import { InjectEventEmitter } from 'nest-emitter';
import { CompletedChecklist } from 'src/entities/completed-checklists/schema/completed-checklist.schema';
import { CHECKLIST_ACTIONS } from 'src/socket/const';
import { SocketBase } from 'src/socket/socket-base.gateway';
import { GoallyEventEmitter } from '../const';

@Injectable()
export class ActiveChecklistNotifier implements OnModuleInit {
  constructor(
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
    private baseSocket: SocketBase,
  ) {}

  onModuleInit() {
    this.emitter.on(
      'ActiveChecklistChangedNotifyWebPortal',
      async msg => await this.onActiveChecklistChangedNotifyWebPortal(msg),
    );
    this.emitter.on(
      'ActiveChecklistChangedNotifyDevice',
      async msg => await this.onActiveChecklistChangedNotifyDevice(msg),
    );
  }

  async onActiveChecklistChangedNotifyWebPortal(msg: {
    checklist: CompletedChecklist;
    clientId: Types.ObjectId;
  }) {
    console.log('onActiveChecklistChangedNotifyWebPortal');

    console.log(msg);
    await this.baseSocket.sendToAllParentConnectedToClient(
      msg.clientId,
      CHECKLIST_ACTIONS.ACTIVE_CHECKLIST_CHANGED,
      { clientId: msg.clientId, activeChecklist: msg.checklist },
    );
  }
  async onActiveChecklistChangedNotifyDevice(msg: {
    checklist: CompletedChecklist;
    clientId: Types.ObjectId;
    socketId?: string;
  }) {
    console.log('onActiveChecklistChangedNotifyDevice');

    console.log(JSON.stringify(msg, null, 4));
    if (!msg.socketId)
      msg.socketId = await this.baseSocket.getDeviceSocketByClientId(
        msg.clientId,
      );

    await this.baseSocket.sendToSocketId(
      msg.socketId,
      CHECKLIST_ACTIONS.ACTIVE_CHECKLIST_CHANGED,
      {
        activeChecklist: msg.checklist,
      },
    );
  }
}
