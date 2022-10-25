import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import * as BB from 'bluebird';
import { flatMap } from 'lodash';
import { Server } from 'socket.io';
import { ClientsService } from 'src/entities/clients/clients.service';
import { DevicesService } from 'src/entities/devices/devices.service';
import { SessionsService } from 'src/entities/sessions/sessions.service';
import { UsersService } from 'src/entities/users/users.service';
import { RedisService } from 'src/redis/redis.service';
import { FcmService } from 'src/shared/fcm/fcm.service';

@WebSocketGateway(null, { transports: ['websocket'] })
export class SocketBase {
  @WebSocketServer()
  server: Server;
  constructor(
    private sessionService: SessionsService,
    private redisService: RedisService,
    private us: UsersService,
    private deviceService: DevicesService,
    private cs: ClientsService,
    private fcmService: FcmService,
  ) {}
  sendToSocketId(id, action, body) {
    console.log('send to ', id, action, body);
    this.server.to(id).emit(action, body);
  }

  async sendToAllParentConnectedToClient(clientId, action, body) {
    const users = await this.us.UserModel.find({ clients: clientId });
    console.log('send to users:', users.length);
    await Promise.all(
      users.map(e => {
        return this.sendToAllUserConnectedSession(e._id, action, body);
      }),
    );
    return true;
  }

  async sendToAllParentExpectMeByClientId(clientId, action, body) {
    const client = await this.cs.findById(clientId);
    const users = await this.us.UserModel.find({ clients: client._id });
    console.log('send to users:', users.length);
    await Promise.all(
      users.map(e => {
        return this.sendToAllUserConnectedSession(e._id, action, body);
      }),
    );
    return true;
  }

  async sendToAllUserConnectedSession(userId, action, body) {
    const sessions = await this.sessionService.getSessionsByUserId(userId);
    const socketIds = await this.getSocketIdsBySession(sessions);
    console.log('socketIds', socketIds);
    socketIds.forEach(socketId => {
      if (!socketId) return;
      console.log(`send to ${userId}: [socket: ${socketId}] `);
      this.sendToSocketId(socketId, action, body);
    });

    // if (!socketIds || socketIds.length == 0)
    this.fcmService.sendOfflineMessageToUser(userId, action, body);
  }
  async getSocketIdsBySession(sessions: string[]) {
    const socketIds = await Promise.all(
      sessions.map(e => {
        return this.redisService.getUserSockets(e);
      }),
    );
    return flatMap(socketIds).filter(e => e);
  }

  async getDeviceSocketByClientId(clientId, throwError = true) {
    const client = await this.cs.findById(clientId);
    if (!client) throw new Error(`client with ${clientId} not found`);
    if (!client.device)
      throw new Error(`client does not have connected device`);
    const device = await this.deviceService.findById(client.device);
    if (!device) throw new Error(`device for client ${clientId} not found`);
    //site license - check if client is active then proceed
    if (
      device.activeClientId &&
      device.activeClientId.toString() != clientId.toString()
    )
      throw new Error(`Switch to ${client.firstName}'s profile in device`);

    const socketId = await this.redisService.getDeviceSocket(
      device.uniqIdentifier,
    );
    if (!socketId && throwError) throw new Error(`Device might be offline`);
    return socketId;
  }
  async getDeviceSocketByDeviceId(deviceId, clientId, throwError = true) {
    const device = await this.deviceService.findById(deviceId);
    if (!device) throw new Error(`device not found`);
    if (
      device.activeClientId &&
      device.activeClientId.toString() != clientId.toString()
    )
      throw new Error(`Switch profile in device`);

    const socketId = await this.redisService.getDeviceSocket(
      device.uniqIdentifier,
    );
    if (!socketId && throwError) throw new Error(`Device might be offline`);
    return socketId;
  }

  async sendToDeviceByClientId(clientId, action, body) {
    // let socketId;
    // try {
    //   socketId = await this.getDeviceSocketByClientId(clientId, false);
    //   if (socketId) this.sendToSocketId(socketId, action, body);
    //   else this.fcmService.sendOfflineMessageToClient(clientId, action, body);
    // } catch (e) {
    //   console.log('socket error=>', e);
    // }

    //send to all attached devices
    const devices = await this.deviceService.getActiveDevicesByClientId(
      clientId,
    );
    await BB.map(devices, async device => {
      const socketId = await this.redisService.getDeviceSocket(
        device.uniqIdentifier,
      );
      if (socketId) this.sendToSocketId(socketId, action, body);
      else this.fcmService.sendOfflineMessageToDevice(device._id, action, body);
    });

    // const socketIds = await this.getSocketIdsByDevices(devices);
    // console.log('devices socketIds', socketIds);
    // socketIds
    //   .filter(socket => socket != socketId)
    //   .forEach(socketId => {
    //     if (socketId) this.sendToSocketId(socketId, action, body);
    //     else this.fcmService.sendOfflineMessageToClient(clientId, action, body);
    //   });
  }

  async notifyAllParentsAndDeviceByClientId(clientId, action, body) {
    this.sendToDeviceByClientId(clientId, action, body);
    this.sendToAllParentConnectedToClient(clientId, action, body);
  }

  // async getSocketIdsByDevices(devices) {
  //   const socketIds = await Promise.all(
  //     devices.map(device => {
  //       return this.redisService.getDeviceSocket(device.uniqIdentifier);
  //     }),
  //   );
  //   return flatMap(socketIds);
  // }
}
