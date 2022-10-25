import { Injectable, OnModuleInit } from '@nestjs/common';
import { Types } from 'mongoose';
import { InjectEventEmitter } from 'nest-emitter';
import { AppLogsService } from 'src/entities/app-logs/app-logs.service';
import {
  ACTION_TYPE,
  LOGS_TYPE,
} from 'src/entities/app-logs/schema/app-logs.schema';
import { DEVICE_SERVICE_ACTION } from 'src/socket/const';
import { SocketBase } from 'src/socket/socket-base.gateway';
import { GoallyEventEmitter } from '../const';

@Injectable()
export class LogsNotifier implements OnModuleInit {
  constructor(
    private logsService: AppLogsService,
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
    private baseSocket: SocketBase,
  ) {}

  onModuleInit() {
    this.emitter.on('CreateLog', async msg => await this.onCreateLog(msg));
    this.emitter.on(
      'SyncUserAppLogs',
      async cliendId => await this.onSyncUserAppLogs(cliendId),
    );
  }

  async onCreateLog(data: {
    action: ACTION_TYPE;
    entity: LOGS_TYPE;
    user: Types.ObjectId;
    client: Types.ObjectId | null;
    meta: any;
  }) {
    const log = await this.logsService.create(data);
    console.log(log);
  }
  onSyncUserAppLogs(clientId: string) {
    const body = {
      clientId,
    };
    this.baseSocket.notifyAllParentsAndDeviceByClientId(
      clientId,
      DEVICE_SERVICE_ACTION.EVENT_DEVICE_LOGS_SYNC,
      body,
    );
  }
}
