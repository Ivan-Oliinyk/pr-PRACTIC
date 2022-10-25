import { UsePipes } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { DevicesService } from 'src/entities/devices/devices.service';
import { UsersService } from 'src/entities/users/users.service';
import { AuthenticatedSocket } from './adapter/socket-redis.adapter';
import { SOCKET_ACTIONS } from './const';
import { AddDeviceDto } from './dto/AddDevice';
import { AddParentDto } from './dto/AddParentDto';
import { SocketValidationPipe } from './filterts';
import { SocketBase } from './socket-base.gateway';

@UsePipes(new SocketValidationPipe())
@WebSocketGateway(null, { transports: ['websocket'] })
export class AddDeviceGateway {
  @WebSocketServer()
  server: Server;
  constructor(
    private deviceService: DevicesService,
    private us: UsersService,
    private socketBase: SocketBase,
  ) {}
  @SubscribeMessage('hello')
  async onHello(socket, body) {
    console.log(body);
  }
  @SubscribeMessage(SOCKET_ACTIONS.ADD_DEVICE)
  async onAddDevice(
    @MessageBody() body: AddDeviceDto,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    try {
      const result = await this.deviceService.addParentRequest(
        this.server,
        client.user,
        body.code,
      );

      return result;
    } catch (e) {
      throw new WsException(e.message);
    }
  }
  @SubscribeMessage(SOCKET_ACTIONS.ADD_PARENT)
  async onAddParent(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() body: AddParentDto,
  ) {
    try {
      const deviceId = client.device._id;
      const code = client.device.code;
      const user = await this.us.findById(body.parentId);
      await this.socketBase.sendToAllUserConnectedSession(
        user._id,
        SOCKET_ACTIONS.DEVICE_ADDED,
        { deviceId, code },
      );
      return user;
    } catch (e) {
      throw new WsException(e.message);
    }
  }
}
