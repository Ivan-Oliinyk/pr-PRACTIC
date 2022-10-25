import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as BB from 'bluebird';
import * as moment from 'moment';
import { Model, Types } from 'mongoose';
import { InjectEventEmitter } from 'nest-emitter';
import { GoallyEventEmitter } from 'src/shared/events/const';
import { ClientsService } from '../clients/clients.service';
import { Device } from '../devices/schemas';
import { SleepModeService } from '../sleep-mode/sleep-mode.service';
import { User } from '../users/schema';
import { STATUS_PLAYED_SLEEP_MODE } from './const';
import { CreateCompletedSleepMode } from './dto/CreateCompletedSleepMode.dto';
import { SaveOfflineCompletedSleepMode } from './dto/CreateCompletedSleepModeOffline.dto';
import { CompletedSleepMode } from './schema/completed-sleep-mode.schema';

@Injectable()
export class CompletedSleepModeService {
  constructor(
    @InjectModel(CompletedSleepMode.name)
    private CompletedSleepMode: Model<CompletedSleepMode>,
    private sleepModeService: SleepModeService,
    @Inject(forwardRef(() => ClientsService))
    private clientsService: ClientsService,
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
  ) {}

  async getFinishedLibrary(user: User, daysBefore: number) {
    const clients = await BB.map(user.clients, this.clientsService.findById);
    const sleepModesByClients = await BB.map(clients, async client => {
      const sleepModesHistory = await this.getFinishedSleepModeByChildId(
        client._id,
        daysBefore,
      );
      return { client, sleepModesHistory };
    });
    return sleepModesByClients;
  }

  async getFinishedSleepModeByChildId(
    clientId: Types.ObjectId,
    daysBefore: number,
  ) {
    const dateBefore = moment().subtract(daysBefore, 'days');
    const sleepModes = await this.CompletedSleepMode.find({
      clientId: clientId,
      $or: [
        {
          status: STATUS_PLAYED_SLEEP_MODE.COMPLETED,
        },
      ],
      finishedAt: {
        $gte: dateBefore.toDate(),
      },
    }).sort({ finishedAt: 'desc' });
    return sleepModes;
  }

  async updateOffline(
    _id: Types.ObjectId,
    body: SaveOfflineCompletedSleepMode,
    device: Device,
  ) {
    const sleepMode = await this.sleepModeService.SleepModeModel.findById(_id);
    const activeSleepMode = await this.CompletedSleepMode.findById({ _id });
    if (!activeSleepMode)
      throw new BadRequestException(
        `sleep mode does not exists with id ${_id}`,
      );

    const savedSleepMode = await this.CompletedSleepMode.findByIdAndUpdate(
      _id,
      { ...body, offlinePlayed: true, sleepMode },
      {
        new: true,
      },
    );
    if (body.status === STATUS_PLAYED_SLEEP_MODE.COMPLETED)
      await this.updatePointsAndPuzzles(savedSleepMode);
    return savedSleepMode;
  }

  async saveOffline(body: SaveOfflineCompletedSleepMode, device: Device) {
    const sleepMode = new this.CompletedSleepMode(body);
    sleepMode.offlinePlayed = true;
    sleepMode.clientId = device.client._id;
    const savedSleepMode = await sleepMode.save();
    if (body.status === STATUS_PLAYED_SLEEP_MODE.COMPLETED)
      await this.updatePointsAndPuzzles(savedSleepMode);
    return savedSleepMode;
  }

  async startSleepMode(
    body: CreateCompletedSleepMode,
    initiator: string,
    playedDevice: Types.ObjectId,
  ) {
    const sleepMode = await this.sleepModeService.SleepModeModel.findById(
      body.sleepModeId,
    ).lean();
    if (!sleepMode)
      throw new BadRequestException(
        `sleep mode not found with id ${body.sleepModeId}`,
      );
    console.log(sleepMode._id, 'sleepMode');

    const completedSleepMode = {
      sleepModeId: sleepMode._id,
      startedAt: new Date(),
      clientId: sleepMode.clientId,
      initiator,
      status: STATUS_PLAYED_SLEEP_MODE.ACTIVE,
      finishedAt: null,
      sleepMode: sleepMode,
      playedDevice,
    };
    const savedSleepMode = new this.CompletedSleepMode(completedSleepMode);
    return savedSleepMode.save();
  }

  async getActiveSleepModesByClientId(clientId: Types.ObjectId) {
    const completedSleepModes = await this.CompletedSleepMode.find({
      clientId,
      status: {
        $in: [STATUS_PLAYED_SLEEP_MODE.ACTIVE],
      },
    }).sort('-createdAt');
    return completedSleepModes;
  }

  async stopAllActiveSleepModeForClient(clientId: Types.ObjectId) {
    const sleepModes = await this.CompletedSleepMode.updateMany(
      {
        clientId,
        status: STATUS_PLAYED_SLEEP_MODE.ACTIVE,
      },
      {
        status: STATUS_PLAYED_SLEEP_MODE.STOPPED,
      },
      { multi: true },
    );
    return sleepModes;
  }

  async getActiveSleepModeByDeviceId(deviceId: Types.ObjectId) {
    const client = await this.clientsService.getClientByDevice(deviceId);
    if (!client) throw new Error(`client not found device ${deviceId}`);
    return this.getActiveSleepModeByClientId(client._id);
  }

  async getActiveSleepModeByClientId(clientId: Types.ObjectId) {
    const completedSleepMode = await this.CompletedSleepMode.findOne({
      clientId,
      status: {
        $in: [STATUS_PLAYED_SLEEP_MODE.ACTIVE],
      },
    }).sort('-createdAt');
    return completedSleepMode;
  }

  async getActiveSleepModeByClientIdV2(clientId: Types.ObjectId) {
    const completedSleepMode = await this.CompletedSleepMode.findOne({
      clientId,
      status: {
        $in: [STATUS_PLAYED_SLEEP_MODE.ACTIVE],
      },
    }).sort('-createdAt');
    return { completedSleepMode, clientId };
  }

  update(_id: Types.ObjectId, updateData: Partial<CompletedSleepMode>) {
    return this.CompletedSleepMode.findByIdAndUpdate(_id, updateData, {
      new: true,
    });
  }

  async finishSleepMode(activeSleepMode: CompletedSleepMode) {
    activeSleepMode.status = STATUS_PLAYED_SLEEP_MODE.COMPLETED;
    activeSleepMode.finishedAt = new Date();
    const savedSleepMode = await this.update(
      activeSleepMode._id,
      activeSleepMode,
    );
    await this.updatePointsAndPuzzles(savedSleepMode);
    return savedSleepMode;
  }

  private async updatePointsAndPuzzles(activeSleepMode: CompletedSleepMode) {
    await activeSleepMode.save();
    this.emitter.emit('SleepModeHistoryCreated', activeSleepMode);
  }

  async getActiveSleepModeById(sleepModeId: Types.ObjectId) {
    const completedSleepMode = await this.CompletedSleepMode.findOne({
      _id: sleepModeId,
      status: {
        $in: [STATUS_PLAYED_SLEEP_MODE.ACTIVE],
      },
    });
    return completedSleepMode;
  }

  deleteById(_id: Types.ObjectId) {
    return this.CompletedSleepMode.findByIdAndRemove(_id);
  }

  async updateSleepModeStatus() {
    try {
      //todo - check sleep mode total duration and add 4 hours to it
      const twelveHoursBefore = moment().subtract(12, 'hours');
      const stuckedActiveSleepModes = await this.CompletedSleepMode.find({
        status: {
          $in: [STATUS_PLAYED_SLEEP_MODE.ACTIVE],
        },
        createdAt: {
          $lte: twelveHoursBefore.toDate(),
        },
      }).sort('-createdAt');
      this.updateStatusToNotCompleted(stuckedActiveSleepModes);
    } catch (e) {
      return;
    }
  }

  async updateStatusToNotCompleted(activeSleepModes: CompletedSleepMode[]) {
    await BB.mapSeries(activeSleepModes, async activeSleepMode => {
      activeSleepMode.status = STATUS_PLAYED_SLEEP_MODE.STOPPED;
      activeSleepMode.save();
    });
  }
}
