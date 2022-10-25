import { UsePipes } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { InjectEventEmitter } from 'nest-emitter';
import { ClientsService } from 'src/entities/clients/clients.service';
import { CompletedSleepModeService } from 'src/entities/completed-sleep-mode/completed-sleep-mode.service';
import { INITIATOR } from 'src/entities/completed-sleep-mode/const';
import {
  CreateCompletedSleepMode,
  CreateCompletedSleepModeRequest,
} from 'src/entities/completed-sleep-mode/dto/CreateCompletedSleepMode.dto';
import { UsersService } from 'src/entities/users/users.service';
import { GoallyEventEmitter } from 'src/shared/events/const';
import { FCM_CLIENT_EVENTS } from 'src/shared/fcm/const';
import { FcmService } from 'src/shared/fcm/fcm.service';
import { AuthenticatedSocket } from './adapter/socket-redis.adapter';
import { SLEEP_MODE_ACTIONS } from './const';
import { SocketValidationPipe } from './filterts';
import { RealTimeSleepModeService } from './services/realtime-sleep-mode.service';
import { SocketBase } from './socket-base.gateway';

@UsePipes(new SocketValidationPipe())
@WebSocketGateway(null, { transports: ['websocket'] })
export class SleepModeGateway {
  constructor(
    private us: UsersService,
    private cs: ClientsService,
    private csms: CompletedSleepModeService,
    private baseSocket: SocketBase,
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
    private rtsms: RealTimeSleepModeService,
    private fcmService: FcmService,
  ) {}

  @SubscribeMessage(SLEEP_MODE_ACTIONS.WP_START_SLEEP_MODE)
  async onWpSleepModeStart(
    @MessageBody() body: CreateCompletedSleepModeRequest,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    try {
      const socketId = await this.getSocketId(body);
      const activeSleepModes = await this.csms.getActiveSleepModesByClientId(
        body.clientId,
      );
      if (activeSleepModes.length === 1)
        return {
          error: 'Another sleepMode is currently running',
          sleepModeId: activeSleepModes[0].sleepModeId,
        };
      if (activeSleepModes.length > 1) {
        await this.csms.stopAllActiveSleepModeForClient(body.clientId);
      }
      if (!socketId) {
        try {
          let response;
          if (body.deviceId)
            response = await this.fcmService.sendMessageToDevice(
              body.deviceId,
              { [FCM_CLIENT_EVENTS.START_SLEEP_MODE]: body.sleepModeId },
            );
          else
            response = await this.fcmService.sendMessageToClientDevice(
              body.clientId,
              { [FCM_CLIENT_EVENTS.START_SLEEP_MODE]: body.sleepModeId },
            );

          return {
            error: 'Device in sleep mode 💤 we are waking him up 😃!',
            meta: response,
          };
        } catch (e) {
          return {
            error: 'Device might be offline',
          };
        }
      }

      const activeSleepMode = await this.csms.startSleepMode(
        body,
        INITIATOR.USER,
        await this.getDeviceId(body),
      );

      this.emitter.emit('ActiveSleepModeChangedNotifyDevice', {
        sleepMode: activeSleepMode,
        clientId: body.clientId,
        socketId,
      });

      this.emitter.emit('ActiveSleepModeChangedNotifyWebPortal', {
        sleepMode: activeSleepMode,
        clientId: body.clientId,
      });

      return { activeSleepMode };
    } catch (e) {
      return { error: e.message };
    }
  }
  @SubscribeMessage(SLEEP_MODE_ACTIONS.DEVICE_START_SLEEP_MODE)
  async onDeviceStartSleepMode(
    @MessageBody() body: CreateCompletedSleepMode,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    try {
      const playedSleepMode = await this.csms.getActiveSleepModeByDeviceId(
        socket.device._id,
      );
      if (
        playedSleepMode &&
        playedSleepMode.sleepModeId.toString() !== body.sleepModeId.toString()
      ) {
        console.log(playedSleepMode.sleepModeId);
        console.log(body.sleepModeId);
        return {
          error: `You are trying to run sleepMode ${body.sleepModeId} but ${playedSleepMode?.sleepModeId} is playing now with status ${playedSleepMode?.status}`,
        };
      }

      const activeSleepMode = await this.csms.startSleepMode(
        body,
        INITIATOR.CLIENT,
        socket.device._id,
      );

      this.emitter.emit('ActiveSleepModeChangedNotifyWebPortal', {
        sleepMode: activeSleepMode,
        clientId: activeSleepMode.clientId,
      });

      return {
        activeSleepMode,
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  @SubscribeMessage(SLEEP_MODE_ACTIONS.DEVICE_COMPLETE_SLEEP_MODE)
  async onDeviceSleepModeComplete(
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    try {
      const playedSleepMode = await this.csms.getActiveSleepModeByDeviceId(
        socket.device._id,
      );

      if (!playedSleepMode) return { error: 'No sleepMode is playing' };

      const activeSleepMode = await this.rtsms.completeSleepMode(
        playedSleepMode,
      );

      this.emitter.emit('ActiveSleepModeChangedNotifyWebPortal', {
        sleepMode: activeSleepMode,
        clientId: activeSleepMode.clientId,
      });
      return {
        activeSleepMode,
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  @SubscribeMessage(SLEEP_MODE_ACTIONS.WP_STOP_SLEEP_MODE)
  async onWpSleepModeStop(
    @MessageBody() body: CreateCompletedSleepModeRequest,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    try {
      const socketId = await this.getSocketId(body);
      const playedSleepMode = await this.csms.getActiveSleepModeById(
        body.sleepModeId,
      );
      if (!playedSleepMode)
        return `SleepMode with id ${body.sleepModeId} not played`;
      const activeSleepMode = await this.rtsms.stopSleepMode(playedSleepMode);

      if (!socketId) {
        try {
          let response;
          if (body.deviceId)
            response = await this.fcmService.sendMessageToDevice(
              body.deviceId,
              { [FCM_CLIENT_EVENTS.STOP_SLEEP_MODE]: body.sleepModeId },
            );
          else
            response = await this.fcmService.sendMessageToClientDevice(
              body.clientId,
              { [FCM_CLIENT_EVENTS.STOP_SLEEP_MODE]: body.sleepModeId },
            );
        } catch (e) {
          return {
            error: 'Device might be offline',
          };
        }
      }

      socketId &&
        this.emitter.emit('ActiveSleepModeChangedNotifyDevice', {
          sleepMode: activeSleepMode,
          clientId: activeSleepMode.clientId,
          socketId,
        });

      this.emitter.emit('ActiveSleepModeChangedNotifyWebPortal', {
        sleepMode: activeSleepMode,
        clientId: activeSleepMode.clientId,
      });
      return {
        activeSleepMode,
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  @SubscribeMessage(SLEEP_MODE_ACTIONS.DEVICE_STOP_SLEEP_MODE)
  async onDeviceStopSleepMode(@ConnectedSocket() socket: AuthenticatedSocket) {
    try {
      const sleepMode = await this.csms.getActiveSleepModeByDeviceId(
        socket.device._id,
      );
      if (!sleepMode) return `Client does not have any active routine`;

      const activeSleepMode = await this.rtsms.stopSleepMode(sleepMode);

      this.emitter.emit('ActiveSleepModeChangedNotifyWebPortal', {
        sleepMode: activeSleepMode,
        clientId: activeSleepMode.clientId,
      });
      return {
        activeSleepMode,
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  private async getSocketId(body) {
    let socketId;
    if (body.deviceId)
      socketId = await this.baseSocket.getDeviceSocketByDeviceId(
        body.deviceId,
        body.clientId,
        false,
      );
    else
      socketId = await this.baseSocket.getDeviceSocketByClientId(
        body.clientId,
        false,
      );
    return socketId;
  }

  private async getDeviceId(body) {
    if (body.deviceId) return body.deviceId;
    else {
      const client = await this.cs.findById(body.clientId);
      return client.device;
    }
  }
}
