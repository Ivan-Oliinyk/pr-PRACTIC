import { WebSocketAdapter } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { WsException } from '@nestjs/websockets';
import Redis from 'ioredis';
import socketio from 'socket.io';
import * as redisIoAdapter from 'socket.io-redis';
import { DevicesService } from 'src/entities/devices/devices.service';
import { Device } from 'src/entities/devices/schemas';
import { SessionsService } from 'src/entities/sessions/sessions.service';
import { RedisService } from 'src/redis/redis.service';
import { InitWebSocketPushes } from '../services/initial-request.service';

export interface AuthenticatedSocket extends socketio.Socket {
  user: any;
  device: Device;
}
export class RedisIoAdapter extends IoAdapter implements WebSocketAdapter {
  constructor(
    app,
    private config: ConfigService,
    private ss: SessionsService,
    private ds: DevicesService,
    private redisService: RedisService,
    private initWsPushes: InitWebSocketPushes,
  ) {
    super(app);
    console.log('constructor', 'RedisIoAdapter');
  }

  createIOServer(port: number, options?: socketio.ServerOptions): any {
    options.pingInterval = 5000;
    options.pingTimeout = 3000;
    options.allowEIO3 = true;

    const server = super.createIOServer(port, options);

    const pubClient = new Redis({
      port: this.config.get('REDIS_PORT'),
      host: this.config.get('REDIS_HOST'),
      password: this.config.get('REDIS_PASSWORD'),
    });
    const subClient = pubClient.duplicate();
    const redisAdapter = redisIoAdapter.createAdapter({
      pubClient,
      subClient,
    });

    server.use(async (socket: AuthenticatedSocket, next) => {
      const uniqIdentifier = socket.handshake.query?.uniqIdentifier?.toString();
      const userToken = socket.handshake.query?.token?.toString();
      console.log('Trying to connect.......');
      try {
        switch (true) {
          case Boolean(uniqIdentifier):
            const device: Device = await this.ds.findByUniqId(uniqIdentifier);
            if (!device)
              throw new WsException('Device uniqId not found or invalid');
            socket.device = device;
            break;
          case Boolean(userToken): {
            const session = await this.ss.getByToken(userToken);

            if (!session) throw new WsException('Session not found or expired');
            socket.user = {
              ...session.user.toObject(),
              token: userToken,
            };
            break;
          }
          default:
            throw new WsException('Token or device id is missing');
        }
        if (socket.user) {
          console.log('CONNECTED_USER', socket.user._id);
          await this.redisService.setUserSocket(userToken, socket.id);

          this.initWsPushes.initialPushesRoutine(socket.user, socket.id);
          this.initWsPushes.initialPushesChecklist(socket.user, socket.id);
          this.initWsPushes.initialPushesSleepMode(socket.user, socket.id);
          socket.emit('ping', 'user-pong');
        }
        if (socket.device) {
          console.log('CONNECTED_DEVICE', uniqIdentifier);
          await this.redisService.setDeviceSocket(uniqIdentifier, socket.id);
          this.initWsPushes.initialDevicePushes(socket.device, socket.id);
          socket.emit('ping', 'device-pong');
          //update device connected status
          this.redisService.setConnectionStatus(socket.device, true);
        }
        return next();
      } catch (e) {
        next(e);
      }
    });

    server.adapter(redisAdapter);
    return server;
  }

  public bindClientConnect(
    server: socketio.Server,
    // eslint-disable-next-line @typescript-eslint/ban-types
    callback: Function,
  ): void {
    server.on('connection', async (socket: AuthenticatedSocket) => {
      if (socket.device || socket.user) {
        // console.log('connected', socket.id);
        // if (socket.device) {
        //   const deviceSocket = await this.redisService.getDeviceSocket(
        //     socket.device.uniqIdentifier,
        //   );
        //   if (!deviceSocket)
        callback(socket);
        // }
        // if (socket.user) {
        //   const userSockets = await this.redisService.getUserSockets(
        //     socket.user.token,
        //   );
        //   if (!userSockets.includes(socket.id)) callback(socket);
        // }
      }
    });
  }
  public async bindClientDisconnect(socket, callback) {
    if (socket.device || socket.user) {
      socket.on('disconnect', async () => {
        console.log('disconnect', socket.id);
        if (socket.device) {
          console.log('disconnect device', socket.device.uniqIdentifier);
          await this.redisService.removeDeviceSocket(
            socket.device.uniqIdentifier,
          );
          //update device disconnected status
          this.redisService.setConnectionStatus(socket.device, false);
        }
        if (socket.user) {
          console.log('disconnect user', socket.user.token);
          await this.redisService.removeUserSocket(
            socket.user.token,
            socket.id,
          );
        }
      });
      callback(socket);
    }
  }
}
