import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectEventEmitter } from 'nest-emitter';
import { BALANCE_NOTIFICATIONS } from 'src/socket/const';
import { SocketBase } from 'src/socket/socket-base.gateway';
import { GoallyEventEmitter } from '../const';

@Injectable()
export class BalanceNotifier implements OnModuleInit {
  constructor(
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
    private baseSocket: SocketBase,
  ) {}

  onModuleInit() {
    this.emitter.on(
      'BalanceChanged',
      async msg => await this.onBalanceChanged(msg),
    );
  }
  onBalanceChanged(msg: { newBalance: number; clientId: string }) {
    const action = msg;
    console.log('BALANCE UPDATED ', msg.clientId, 'BALANCE', msg.newBalance);
    this.baseSocket.sendToDeviceByClientId(
      msg.clientId,
      BALANCE_NOTIFICATIONS.BALANCE_CHANGED,
      action,
    );
    this.baseSocket.sendToAllParentConnectedToClient(
      msg.clientId,
      BALANCE_NOTIFICATIONS.BALANCE_CHANGED,
      action,
    );
  }
}
