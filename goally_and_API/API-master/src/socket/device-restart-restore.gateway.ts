import { UsePipes } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { InjectEventEmitter } from 'nest-emitter';
import {
  ACTION_TYPE,
  LOGS_TYPE,
} from 'src/entities/app-logs/schema/app-logs.schema';
import { ClientsService } from 'src/entities/clients/clients.service';
import { UsersService } from 'src/entities/users/users.service';
import { GoallyEventEmitter } from 'src/shared/events/const';
import { AuthenticatedSocket } from './adapter/socket-redis.adapter';
import { DEVICE_SERVICE_ACTION } from './const';
import { DeviceServiceNotification } from './dto/DeviceServiceDto';
import { SocketValidationPipe } from './filterts';
import { SocketBase } from './socket-base.gateway';

@UsePipes(new SocketValidationPipe())
@WebSocketGateway(null, { transports: ['websocket'] })
export class DeviceServiceGateway {
  constructor(
    private us: UsersService,
    private baseSocket: SocketBase,
    private cs: ClientsService,
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
  ) {}

  @SubscribeMessage(DEVICE_SERVICE_ACTION.WP_DEVICE_RESET)
  async onWpDeviceReset(
    @MessageBody() body: DeviceServiceNotification,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    console.log('device reset');
    try {
      const socketId = await this.getSocketId(body);
      console.log('socketid is ', socketId);
      await this.cs.disconnectDeviceFromChild(
        body.clientId,
        socket.user,
        body.deviceId,
      );
      if (socketId) {
        await this.baseSocket.sendToSocketId(
          socketId,
          DEVICE_SERVICE_ACTION.DEVICE_RESET,
          {
            clientId: body.clientId,
          },
        );
      }

      this.emitter.emit('CreateLog', {
        entity: LOGS_TYPE.DEVICE,
        action: ACTION_TYPE.RESET,
        user: socket.user._id,
        client: body.clientId,
        meta: null,
      });
      return { status: 'Request sent' };
    } catch (e) {
      return { error: e.message };
    }
  }
  @SubscribeMessage(DEVICE_SERVICE_ACTION.WP_DEVICE_RESTART)
  async onWpDeviceRestart(
    @MessageBody() body: DeviceServiceNotification,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    try {
      const socketId = await this.getSocketId(body);
      if (socketId) {
        await this.baseSocket.sendToSocketId(
          socketId,
          DEVICE_SERVICE_ACTION.DEVICE_RESTART,
          {
            clientId: body.clientId,
          },
        );
      }
      this.emitter.emit('CreateLog', {
        entity: LOGS_TYPE.DEVICE,
        action: ACTION_TYPE.RESTART,
        user: socket.user._id,
        client: body.clientId,
        meta: null,
      });

      return { status: 'Request sent' };
    } catch (e) {
      return { error: e.message };
    }
  }

  @SubscribeMessage(DEVICE_SERVICE_ACTION.WP_CLIENT_RESET)
  async onWpClientReset(
    @MessageBody() body: DeviceServiceNotification,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    console.log('client reset');
    try {
      const socketId = await this.getSocketId(body);
      await this.cs.disconnectClient(body.clientId, socket.user);
      if (socketId) {
        await this.baseSocket.sendToSocketId(
          socketId,
          DEVICE_SERVICE_ACTION.DEVICE_RESET,
          {
            clientId: body.clientId,
          },
        );
      }
      return { status: 'Request sent' };
    } catch (e) {
      console.log(e);
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
}
