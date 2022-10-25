import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DevicesService } from 'src/entities/devices/devices.service';
import { Device } from 'src/entities/devices/schemas/device.schema';
import { REDIS_CLIENT } from './const';
import { RedisClient } from './redis.provider';

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClient,
    @Inject(forwardRef(() => DevicesService)) private ds: DevicesService,
  ) {
    //TODO: dobule check that
    this.redisClient.flushdb().then(() => console.log('REDIS CLEARED'));
  }
  private set(key, value): Promise<string> {
    return this.redisClient.set(key, JSON.stringify(value));
  }
  private async get(key): Promise<any> {
    const value = await this.redisClient.get(key);
    return JSON.parse(value);
  }

  async setUserSocket(token: string, socketId: string) {
    const sockets = (await this.getUserSockets(token)) || [];
    sockets.push(socketId);

    return this.set(`session_${token}`, sockets);
  }
  async getUserSockets(token: string): Promise<string[] | null> {
    const sockets = await this.get(`session_${token}`);
    if (!sockets) return [];
    const parsedSockets = sockets;
    if (Array.isArray(parsedSockets)) return parsedSockets;
    else [parsedSockets];
  }
  async removeUserSocket(token: string, socketId: string) {
    const sockets = await this.getUserSockets(token);
    const refreshedSockets = sockets.filter(e => e != socketId);

    return this.set(`session_${token}`, refreshedSockets);
  }

  setDeviceSocket(deviceUniqID, socketId) {
    return this.set(`device_${deviceUniqID}`, socketId);
  }
  getDeviceSocket(deviceUniqID): Promise<string | null> {
    return this.get(`device_${deviceUniqID}`);
  }
  removeDeviceSocket(deviceUniqID) {
    return this.set(`device_${deviceUniqID}`, null);
  }
  setConnectionStatus(device: Device, isConnected: boolean) {
    //update device connection status
    this.ds.setConnectionStatus(device, isConnected);
  }
}
