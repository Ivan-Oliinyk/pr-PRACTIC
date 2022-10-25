import { Injectable, OnModuleInit } from '@nestjs/common';
import { Types } from 'mongoose';
import { InjectEventEmitter } from 'nest-emitter';
import { Reminder } from 'src/entities/reminders/schema/reminder.schema';
import { REMINDER_ACTIONS } from 'src/socket/const/actions';
import { SocketBase } from 'src/socket/socket-base.gateway';
import { GoallyEventEmitter } from '../const';

@Injectable()
export class ActiveReminderNotifier implements OnModuleInit {
  constructor(
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
    private baseSocket: SocketBase,
  ) {}

  onModuleInit() {
    this.emitter.on(
      'ActiveReminderChangedNotifyWebPortal',
      async msg => await this.onActiveReminderChangedNotifyWebPortal(msg),
    );
    this.emitter.on(
      'ActiveReminderChangedNotifyDevice',
      async msg => await this.onActiveReminderChangedNotifyDevice(msg),
    );
  }
  async onActiveReminderChangedNotifyWebPortal(msg: {
    reminder: Reminder;
    clientId: Types.ObjectId;
  }) {
    console.log('onActiveReminderChangedNotifyWebPortal');

    console.log(msg);
    await this.baseSocket.sendToAllParentConnectedToClient(
      msg.clientId,
      REMINDER_ACTIONS.ACTIVE_REMINDER_CHANGED,
      { clientId: msg.clientId, activeReminder: msg.reminder },
    );
  }
  async onActiveReminderChangedNotifyDevice(msg: {
    reminder: Reminder;
    clientId: Types.ObjectId;
    socketId?: string;
  }) {
    console.log('onActiveReminderChangedNotifyDevice');

    console.log(JSON.stringify(msg, null, 4));
    if (!msg.socketId)
      msg.socketId = await this.baseSocket.getDeviceSocketByClientId(
        msg.clientId,
      );

    await this.baseSocket.sendToSocketId(
      msg.socketId,
      REMINDER_ACTIONS.ACTIVE_REMINDER_CHANGED,
      {
        activeReminder: msg.reminder,
      },
    );
  }
}
