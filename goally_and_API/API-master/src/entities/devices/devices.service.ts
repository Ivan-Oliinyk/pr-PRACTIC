import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as BB from 'bluebird';
import * as moment from 'moment';
import { Model, Types } from 'mongoose';
import { InjectEventEmitter } from 'nest-emitter';
import { Server } from 'socket.io';
import { User } from 'src/entities/users/schema';
import { UsersService } from 'src/entities/users/users.service';
import { RedisService } from 'src/redis/redis.service';
import { GoallyEventEmitter } from 'src/shared/events/const';
import { FCM_CLIENT_EVENTS } from 'src/shared/fcm/const';
import { FcmService } from 'src/shared/fcm/fcm.service';
import { SOCKET_ACTIONS } from 'src/socket/const';
import { ClientsService } from '../clients/clients.service';
import { GameConfigsService } from '../game-configs/game-configs.service';
import { ImagesService } from '../images/images.service';
import { LabWordsService } from '../lab-words/lab-words.service';
import { PollyService } from '../polly/polly.service';
import { PuzzlesService } from '../puzzles/puzzles.service';
import { SleepModeService } from '../sleep-mode/sleep-mode.service';
import {
  CompletePuzzleDto,
  InitDeviceDto,
  MigratePuzzleDto,
  UpdatePuzzleDto,
} from './dto';
import { Device } from './schemas';
@Injectable()
export class DevicesService {
  constructor(
    @InjectModel(Device.name) public DeviceModel: Model<Device>,
    @Inject(forwardRef(() => RedisService)) private redisService: RedisService,
    private userService: UsersService,
    @Inject(forwardRef(() => ClientsService))
    private cs: ClientsService,
    private imageService: ImagesService,
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
    @Inject(forwardRef(() => FcmService))
    private fcmService: FcmService,
    private ps: PuzzlesService,
    private sm: SleepModeService,
    private pollyService: PollyService,
    private gs: GameConfigsService,
    private lws: LabWordsService,
  ) {}

  async init(deviceData: InitDeviceDto) {
    console.log(deviceData);
    let device;
    device = await this.findByUniqId(deviceData.uniqIdentifier);
    // if Device exists update
    if (device) {
      device = await this.update(deviceData);
      device = await this.findByUniqId(deviceData.uniqIdentifier);
    } // else create new one
    else {
      device = await this.create(deviceData);
    }

    return device;
  }
  async create(deviceData: InitDeviceDto) {
    const deviceModel = new this.DeviceModel(deviceData);
    const device = await deviceModel.save();
    return { ...device.toObject(), childConnected: false };
  }
  async update(deviceData: Partial<Device>) {
    return this.DeviceModel.findOneAndUpdate(
      { uniqIdentifier: deviceData.uniqIdentifier },
      deviceData,
      { new: true },
    );
  }
  async findByUniqId(uniqIdentifier: string): Promise<Device> {
    const device = await this.find({
      uniqIdentifier,
    });
    if (!device) return null;
    const client = await this.cs.getClientByDevice(device._id);
    device.client = client;
    return device;
  }

  async isExist(
    code: string,
  ): Promise<{ isExist: boolean; isChildConnected?: boolean }> {
    code = code.replace('-', '').toUpperCase();
    const device = await this.DeviceModel.findOne({ code });
    if (!device) return { isExist: false };
    const client = await this.cs.getClientByDevice(device._id);
    return { isExist: Boolean(device), isChildConnected: Boolean(client) };
  }
  async updateDevice(deviceId: Types.ObjectId, deviceData: Partial<Device>) {
    return this.DeviceModel.findByIdAndUpdate(deviceId, deviceData, {
      new: true,
    });
  }
  async find(deviceQuery: any = {}): Promise<Device> {
    const device = (await this.DeviceModel.findOne(
      deviceQuery,
    ).lean()) as Device;
    if (!device) return null;
    const client = await this.cs.getClientByDevice(device._id);
    device.childConnected = Boolean(client);
    return device;
  }

  async findById(id: Types.ObjectId) {
    return this.DeviceModel.findById(id);
  }

  async addParentRequest(socketServer: Server, user: User, code: string) {
    code = code.replace('-', '').toUpperCase();

    const device = await this.find({ code });
    console.log(device);
    if (!device) throw new Error(`Device with code ${code} not found `);
    const deviceSocketId = await this.redisService.getDeviceSocket(
      device.uniqIdentifier,
    );
    if (!deviceSocketId) await this.sendOfflineFcm(device, user);
    // if (!deviceSocketId) throw new Error('Device might be offline');
    else
      socketServer
        .to(deviceSocketId)
        .emit(SOCKET_ACTIONS.PARENT_REQUEST_TO_ADD, {
          parentId: user._id,
          parentFullName: `${user.firstName} ${user.lastName}`,
        });
  }

  async sendOfflineFcm(device: Device, user: User) {
    try {
      const response = await this.fcmService.sendDataMessage(device.fcmToken, {
        [FCM_CLIENT_EVENTS.ADD_DEVICE]: JSON.stringify({
          parentId: user._id.toString(),
          parentFullName: `${user.firstName} ${user.lastName}`,
        }),
      });
      return {
        error: 'Device in sleep mode 💤 we are waking him up 😃!',
        meta: response,
      };
    } catch (e) {
      throw new Error('Device might be offline');
    }
  }

  async completePuzzle(device: Device, body: CompletePuzzleDto) {
    //TODO: change to basicPuzzle depends on plan
    const isExist = this.imageService.puzzlesPremium.find(
      e => e.name === body.puzzleName,
    );
    if (!isExist)
      throw new NotFoundException(`${body.puzzleName} is invalid puzzle name`);
    const client = await this.cs.findById(device.client._id);

    const isAlreadyCompleted = client.puzzles.find(
      e => e.name === body.puzzleName,
    );
    if (isAlreadyCompleted)
      throw new BadRequestException(`${body.puzzleName} already completed`);

    client.puzzles.unshift({
      name: body.puzzleName,
      piecesNumber: body.puzzlePieces,
      completedAt: new Date(),
    });
    return client.save();
  }

  async getPuzzles(device: Device) {
    const puzzles = await this.ps.getPuzzlesByDeviceId(device._id);
    return puzzles;
  }

  async updatePuzzleProgress(
    device: Device,
    puzzleId: Types.ObjectId,
    body: UpdatePuzzleDto,
  ) {
    body.completedPieces.map(progress => {
      if (progress < 0 || progress > 15)
        throw new BadRequestException(
          `puzzle progress is not allowed to update for ${progress}`,
        );
    });
    if (new Set(body.completedPieces).size !== body.completedPieces.length)
      throw new BadRequestException(
        `puzzle progress must have unique elements`,
      );

    const { oldPuzzle, newPuzzle } = await this.ps.updatePuzzleProgress(
      device.client._id,
      puzzleId,
      body,
    );
    const client = await this.cs.findById(device.client._id);
    client.puzzlePieces =
      client.puzzlePieces +
      oldPuzzle.completedPieces.length -
      body.completedPieces.length;
    if (client.puzzlePieces < 0) client.puzzlePieces = 0;
    client.save();
    return newPuzzle;
  }

  async migratePuzzleProgress(device: Device, body: MigratePuzzleDto) {
    const puzzles = await BB.map(body.puzzleProgress, async element => {
      element.completedPieces.map(progress => {
        if (progress < 0 || progress > 15)
          throw new BadRequestException(
            `puzzle progress is not allowed to update for ${progress}`,
          );
      });
      if (
        new Set(element.completedPieces).size !== element.completedPieces.length
      )
        throw new BadRequestException(
          `puzzle progress must have unique elements`,
        );

      const puzzle = await this.ps.migratePuzzleProgress(
        device.client._id,
        element.puzzleName,
        element.completedPieces,
      );
      return puzzle;
    });

    const client = await this.cs.findById(device.client._id);
    client.puzzlePieces = body.totalPieces;
    client.save();
    return puzzles;
  }

  async setConnectionStatus(device: Device, isConnected: boolean) {
    //update device connection status
    const deviceFromDB = await this.findByUniqId(device.uniqIdentifier);
    if (!deviceFromDB) return;
    deviceFromDB.isConnected = isConnected;
    deviceFromDB.wifiConnected = isConnected;
    this.update(deviceFromDB);
    // if (deviceFromDB.client)
    //   this.emitter.emit('WpClientChanged', deviceFromDB.client._id);
  }

  async getVersions() {
    const versions = await this.DeviceModel.aggregate([
      {
        $group: {
          _id: '$appVersion',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 100 },
    ]);
    return versions;
  }

  async getClientsByDevice(device: Device) {
    const fullDevice = await this.DeviceModel.findById(device._id).populate({
      path: 'clients',
      model: 'Client',
    });
    return fullDevice.clients;
  }

  async switchClientByDevice(device: Device, switchedClientId: Types.ObjectId) {
    if (!device.activeClientId)
      throw new BadRequestException(`Current device is not active`);
    if (device.activeClientId.toString() == switchedClientId.toString())
      throw new BadRequestException(`Switched client is already active`);

    return this.DeviceModel.findByIdAndUpdate(
      device._id,
      {
        activeClientId: switchedClientId,
      },
      { new: true },
    );
  }

  async getSleepModeByDevice(device: Device) {
    const sleepMode = await this.sm.getClientSleepMode(device.client._id);
    return sleepMode;
  }

  async addClientToDevice(
    clientId: Types.ObjectId,
    deviceId: Types.ObjectId,
    deviceName?: string,
  ) {
    let device;
    if (deviceName) {
      device = await this.DeviceModel.findByIdAndUpdate(
        deviceId,
        {
          $addToSet: {
            clients: clientId,
          },
          deviceName,
        },
        { new: true },
      );
    } else {
      device = await this.DeviceModel.findByIdAndUpdate(
        deviceId,
        {
          $addToSet: {
            clients: clientId,
          },
        },
        { new: true },
      );
    }
    return device;
  }

  async removeClientFromDevice(
    clientId: Types.ObjectId,
    deviceId: Types.ObjectId,
  ) {
    const device = await this.DeviceModel.findByIdAndUpdate(
      deviceId,
      {
        $pull: {
          clients: clientId,
        },
      },
      { new: true },
    );
    return device;
  }

  async addActiveClientToDevice(
    clientId: Types.ObjectId,
    deviceId: Types.ObjectId,
  ) {
    const device = await this.DeviceModel.findByIdAndUpdate(
      deviceId,
      {
        activeClientId: clientId,
      },
      { new: true },
    );
    return device;
  }

  async removeActiveClientFromDevice(deviceId: Types.ObjectId) {
    const device = await this.DeviceModel.findByIdAndUpdate(
      deviceId,
      {
        $unset: {
          activeClientId: 1,
        },
      },
      { new: true },
    );
    return device;
  }

  async removeAllClientsFromDevice(deviceId: Types.ObjectId) {
    const device = await this.DeviceModel.findByIdAndUpdate(
      deviceId,
      {
        $unset: {
          clients: 1,
        },
      },
      { new: true },
    );
    return device;
  }

  async addUserToDevice(userId: Types.ObjectId, deviceId: Types.ObjectId) {
    const device = await this.DeviceModel.findByIdAndUpdate(
      deviceId,
      {
        userId,
      },
      { new: true },
    );
    return device;
  }

  async removeUserFromDevice(deviceId: Types.ObjectId) {
    const device = await this.DeviceModel.findByIdAndUpdate(
      deviceId,
      {
        $unset: {
          userId: 1,
        },
      },
      { new: true },
    );
    return device;
  }

  // async getDeviceByActiveClientId(activeClientId: Types.ObjectId) {
  //   const device = await this.DeviceModel.findOne({
  //     activeClientId,
  //   });
  //   return device;
  // }

  async addClientsAndUserFields() {
    const total = await this.DeviceModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await BB.mapSeries(new Array(arrayLength), async (elem, index) => {
        const devices = await this.DeviceModel.find({})
          .limit(series)
          .skip(series * index);
        await BB.mapSeries(devices, async device => {
          await this.addClientsAndUserField(device);
        });
      });
      return { success: true };
    } catch (e) {
      return {
        success: false,
        error: e,
      };
    }
  }

  async addClientsAndUserField(device: Device) {
    const client = await this.cs.getClientByDeviceForMigration(device._id);
    if (client) {
      device.activeClientId = client._id;
      device.clients.push(client._id);
      const users = await this.userService.findByClientIdForMigration(
        client._id,
      );
      if (users && users.length > 0) {
        if (users.length > 1) {
          const subscription = await this.cs.getClientBillingInfo(client._id);
          if (subscription && subscription.payer)
            device.userId = subscription.payer._id;
        }
        if (!device.userId) device.userId = users[0]._id;
      }
      const savedDevice = await new this.DeviceModel(device).save();
      return savedDevice;
    }
  }

  async getSentenceMp3(
    device: Device,
    sentence: string,
    isAacSentense: boolean,
  ) {
    const client = await this.cs.getClientByDevice(device._id);
    if (!client)
      throw new BadRequestException('Child not connected to that device');

    let text = '';
    let voiceId = '';

    if (isAacSentense) {
      if (!client.aacConfig.voiceId)
        throw new BadRequestException(
          'Voice id does not exists for this client',
        );
      voiceId = client.aacConfig.voiceId;
      text = `<speak><prosody rate="${client.aacConfig.speechSpeed}%">${sentence}</prosody></speak>`;
    } else {
      voiceId = 'Matthew'; //await this.cs.getDefaultVoiceId(client);
      text = `<speak><prosody volume="loud" rate="75%"><amazon:domain name="news">${sentence}</amazon:domain></prosody></speak>`;
    }

    const mp3 = await this.pollyService.getSentenceMp3(voiceId, text);
    return mp3;
  }

  async getDeviceByClientIdAndUserId(
    clientId: Types.ObjectId,
    userId: Types.ObjectId,
  ) {
    const device = await this.DeviceModel.findOne({
      clients: { $in: [clientId] },
      userId,
    });
    return device;
  }

  async getDevicesByClientIdAndUserId(
    clientId: Types.ObjectId,
    userId: Types.ObjectId,
  ) {
    const devices = await this.DeviceModel.find({
      clients: { $in: [clientId] },
      userId,
    });
    return devices;
  }

  async getActiveDevicesByClientId(clientId: Types.ObjectId) {
    const devices = await this.DeviceModel.find({ activeClientId: clientId });
    return devices;
  }

  async getAllDevicesByClientId(clientId: Types.ObjectId) {
    const devices = await this.DeviceModel.find({
      clients: { $in: [clientId] },
    });
    return devices;
  }

  async getGameConfigByDevice(device: Device) {
    if (!device.client)
      throw new BadRequestException('Device is not connected to client');
    const gameConfig = await this.gs.getClientGameConfig(device.client._id);
    return gameConfig;
  }

  async syncUserAppLogs(code: string) {
    const device = await this.DeviceModel.findOne({ code });
    if (!device) throw new BadRequestException('Device not found');
    // if (!device.isConnected)
    //   throw new BadRequestException('Device is not connected to internet');
    const client = await this.cs.getClientByDevice(device._id);
    if (!client) throw new BadRequestException('Client not found');
    this.emitter.emit('SyncUserAppLogs', client._id);
  }

  async updatePoints(device: Device, minutesPlayed: number) {
    if (!device.client)
      throw new BadRequestException('Device is not connected to client');
    const client = await this.cs.getClientByDevice(device._id);

    const gameConfig = await this.gs.getClientGameConfig(device.client._id);

    //deduct points if enablePtsToPlay is true
    if (gameConfig.enablePtsToPlay) {
      let ptsToDeductFor1Min = gameConfig.ptsFor15Mins / 15;
      ptsToDeductFor1Min =
        Math.round((ptsToDeductFor1Min + Number.EPSILON) * 100) / 100;
      const ptsToDeduct = Math.round(minutesPlayed * ptsToDeductFor1Min);
      console.log('ptsToDeduct', ptsToDeduct);

      if (ptsToDeduct > client.points) client.points = 0;
      else client.points = client.points - ptsToDeduct;
    }
    // update points in client
    const updatedClient = await this.cs.update(
      device.client._id,
      client,
      device.userId,
    );
    return updatedClient;
  }

  getTimeByTimeZone() {
    const utcTime = moment()
      .utc()
      .format('yyyy-MM-DDTHH:mm:ss.SSSZ');

    const utcMilliSec = moment().valueOf();

    return { utcTime, utcMilliSec: utcMilliSec };
  }

  async aacUpdateTalkerVolume(device: Device, talkerVolume: number) {
    if (!device.client)
      throw new BadRequestException('Device is not connected to client');
    const client = await this.cs.getClientByDevice(device._id);

    if (client.aacConfig) {
      client.aacConfig.talkerVolume = talkerVolume;
      return await this.cs.ClientModel.findByIdAndUpdate(client._id, client, {
        new: true,
      });
    }

    return { success: false };
  }

  async getLabWords(device: Device) {
    if (!device.client)
      throw new BadRequestException('Device is not connected to client');
    return this.lws.getClientLabWords(device.client._id);
  }

  async resetPuzzle(device, puzzleId) {
    if (!device.client)
      throw new BadRequestException('Device is not connected to client');

    return this.ps.resetPuzzle({ clientId: device.client._id, puzzleId });
  }

  async reValidateDevicesGameProcessings() {
    const total = await this.DeviceModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await BB.mapSeries(new Array(arrayLength), async (elem, index) => {
        const devices = await this.DeviceModel.find({})
          .limit(series)
          .skip(series * index);
        await BB.mapSeries(devices, async device => {
          if (device.memorySize) {
            await this.gs.reValidateDevicesGameProcessing(
              device._id,
              device.memorySize,
            );
          }
        });
      });
      return { success: true };
    } catch (e) {
      return {
        success: false,
        error: e,
      };
    }
  }

  async addBrightnessLevelFields() {
    const total = await this.DeviceModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await BB.mapSeries(new Array(arrayLength), async (elem, index) => {
        const devices = await this.DeviceModel.find({})
          .limit(series)
          .skip(series * index);
        await BB.mapSeries(devices, async device => {
          await this.addBrightnessLevelField(device);
        });
      });
      return { success: true };
    } catch (e) {
      return {
        success: false,
        error: e,
      };
    }
  }

  async addBrightnessLevelField(device: Device) {
    device.brightnessLevel = 50;
    return device.save();
  }
}
