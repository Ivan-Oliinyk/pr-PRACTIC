import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as BB from 'bluebird';
import { omit } from 'lodash';
import * as moment from 'moment';
import { Model, Types } from 'mongoose';
import { InjectEventEmitter } from 'nest-emitter';
import { LIBRARY_TYPES } from 'src/shared/const';
import { GoallyEventEmitter } from 'src/shared/events/const';
import { ChecklistsService } from '../checklists/checklists.service';
import { ClientsService } from '../clients/clients.service';
import { Device } from '../devices/schemas';
import { User } from '../users/schema';
import { STATUS_PLAYED_ACTIVITY, STATUS_PLAYED_CHECKLIST } from './const';
import { CreateCompletedChecklist } from './dto/CreateCompletedChecklist.dto';
import { SaveOfflineCompletedChecklist } from './dto/CreateCompletedChecklistOffline.dto';
import { CompletedChecklist } from './schema/completed-checklist.schema';

@Injectable()
export class CompletedChecklistsService {
  constructor(
    @InjectModel(CompletedChecklist.name)
    private CompletedChecklist: Model<CompletedChecklist>,
    private checklistsService: ChecklistsService,
    @Inject(forwardRef(() => ClientsService))
    private clientsService: ClientsService,
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
  ) {}

  async getFinishedLibrary(user: User, daysBefore: number) {
    const clients = await BB.map(user.clients, this.clientsService.findById);
    const checklistsByClients = await BB.map(clients, async client => {
      const checklistsHistory = await this.getFinishedChecklistByChildId(
        client._id,
        daysBefore,
      );
      return { client, checklistsHistory };
    });
    return checklistsByClients;
  }

  async getFinishedChecklistByChildId(
    clientId: Types.ObjectId,
    daysBefore: number,
  ) {
    const dateBefore = moment().subtract(daysBefore, 'days');
    const checklists = await this.CompletedChecklist.find({
      clientId: clientId,
      $or: [
        {
          status: STATUS_PLAYED_CHECKLIST.COMPLETED,
        },
      ],
      finishedAt: {
        $gte: dateBefore.toDate(),
      },
    }).sort({ finishedAt: 'desc' });
    return checklists;
  }

  async updateOffline(
    _id: Types.ObjectId,
    body: SaveOfflineCompletedChecklist,
    device: Device,
  ) {
    const completedChecklist = await this.CompletedChecklist.findById({ _id });
    if (!completedChecklist)
      throw new BadRequestException(`checklist does not exists with id ${_id}`);

    const savedChecklist = await this.CompletedChecklist.findByIdAndUpdate(
      _id,
      { ...body, offlinePlayed: true },
      {
        new: true,
      },
    );
    if (
      body.status === STATUS_PLAYED_CHECKLIST.COMPLETED &&
      completedChecklist.status != STATUS_PLAYED_CHECKLIST.COMPLETED
    )
      await this.updatePointsAndPuzzles(savedChecklist);
    await this.stopWelcomeScreenChecklist(device._id);

    return savedChecklist;
  }

  async saveOffline(body: SaveOfflineCompletedChecklist, device: Device) {
    const checklist = new this.CompletedChecklist(body);
    checklist.offlinePlayed = true;
    checklist.clientId = device.client._id;
    checklist.checklist.libraryType = LIBRARY_TYPES.CHILD;
    const savedChecklist = await checklist.save();
    if (body.status === STATUS_PLAYED_CHECKLIST.COMPLETED)
      await this.updatePointsAndPuzzles(savedChecklist);
    await this.stopWelcomeScreenChecklist(device._id);
    return savedChecklist;
  }

  async saveWelcomeScreenChecklist(
    body: CreateCompletedChecklist,
    initiator: string,
    playedDevice: Types.ObjectId,
  ) {
    const checklist = await this.checklistsService.ChecklistModel.findById(
      body.checklistId,
    ).lean();
    console.log(checklist._id, 'checklist');
    const activities = checklist.activities;
    console.log(activities.length, 'activities');

    const activityForPlayed = activities
      .sort(e => e.ordering)
      .map(e => {
        return {
          ...e,
          status: STATUS_PLAYED_ACTIVITY.NOT_STARTED,
        };
      });

    const completedChecklistDto = {
      checklistId: checklist._id,
      startedAt: new Date(),
      clientId: checklist.clientId,
      initiator,
      status: STATUS_PLAYED_CHECKLIST.SHOW_WELCOME_SCREEN,
      finishedAt: null,
      activities: activityForPlayed,
      checklist: omit(checklist, 'activities'),
      playedDevice,
    };
    const completedChecklist = new this.CompletedChecklist(
      completedChecklistDto,
    );

    return completedChecklist.save();
  }

  async getActiveChecklistsByClientId(clientId: Types.ObjectId) {
    const completedChecklists = await this.CompletedChecklist.find({
      clientId,
      status: {
        $in: [
          STATUS_PLAYED_CHECKLIST.ACTIVE,
          STATUS_PLAYED_CHECKLIST.SHOW_WELCOME_SCREEN,
          STATUS_PLAYED_CHECKLIST.STARTED_WP,
        ],
      },
    }).sort('-createdAt');
    return completedChecklists;
  }

  async stopAllActiveChecklistForClient(clientId: Types.ObjectId) {
    const checklists = await this.CompletedChecklist.updateMany(
      {
        clientId,
        status: STATUS_PLAYED_CHECKLIST.ACTIVE,
      },
      {
        status: STATUS_PLAYED_CHECKLIST.STOPPED,
      },
      { multi: true },
    );
    return checklists;
  }

  async getActiveChecklistByDeviceId(deviceId: Types.ObjectId) {
    const client = await this.clientsService.getClientByDevice(deviceId);
    if (!client) throw new Error(`client not found device ${deviceId}`);
    return this.getActiveChecklistByClientId(client._id);
  }

  async getActiveChecklistByClientId(clientId: Types.ObjectId) {
    const completedChecklist = await this.CompletedChecklist.findOne({
      clientId,
      status: {
        $in: [
          STATUS_PLAYED_CHECKLIST.ACTIVE,
          STATUS_PLAYED_CHECKLIST.SHOW_WELCOME_SCREEN,
          STATUS_PLAYED_CHECKLIST.STARTED_WP,
        ],
      },
    }).sort('-createdAt');
    return completedChecklist;
  }

  async getActiveChecklistByClientIdV2(clientId: Types.ObjectId) {
    const completedChecklist = await this.CompletedChecklist.findOne({
      clientId,
      status: {
        $in: [
          STATUS_PLAYED_CHECKLIST.ACTIVE,
          STATUS_PLAYED_CHECKLIST.SHOW_WELCOME_SCREEN,
          STATUS_PLAYED_CHECKLIST.STARTED_WP,
        ],
      },
    }).sort('-createdAt');
    return { completedChecklist, clientId };
  }

  async stopWelcomeScreenChecklist(deviceId: Types.ObjectId) {
    const client = await this.clientsService.getClientByDevice(deviceId);
    if (!client) throw new Error(`client not found device ${deviceId}`);
    const checklist = await this.CompletedChecklist.updateMany(
      {
        clientId: client._id,
        status: STATUS_PLAYED_CHECKLIST.SHOW_WELCOME_SCREEN,
      },
      {
        status: STATUS_PLAYED_CHECKLIST.STOPPED,
      },
      { multi: true },
    );
    const currentlyPlayed = await this.getActiveChecklistByDeviceId(deviceId);
    this.emitter.emit('ActiveChecklistChangedNotifyWebPortal', {
      checklist: currentlyPlayed,
      clientId: client._id,
    });
    this.emitter.emit('ActiveChecklistChangedNotifyDevice', {
      checklist: currentlyPlayed,
      clientId: client._id,
    });
  }

  update(_id: Types.ObjectId, updateData: Partial<CompletedChecklist>) {
    return this.CompletedChecklist.findByIdAndUpdate(_id, updateData, {
      new: true,
    });
  }

  async finishChecklist(activeChecklist: CompletedChecklist) {
    activeChecklist.status = STATUS_PLAYED_CHECKLIST.COMPLETED;
    activeChecklist.finishedAt = new Date();
    const savedChecklist = await this.update(
      activeChecklist._id,
      activeChecklist,
    );
    await this.updatePointsAndPuzzles(savedChecklist);
    return savedChecklist;
  }

  private async updatePointsAndPuzzles(activeChecklist: CompletedChecklist) {
    const totalSpentTime = moment
      .duration(
        moment(activeChecklist.finishedAt).diff(
          moment(activeChecklist.startedAt),
        ),
      )
      .asMinutes();
    activeChecklist.totalSpentTime =
      Math.round((totalSpentTime + Number.EPSILON) * 100) / 100;
    const client = await this.clientsService.findById(activeChecklist.clientId);
    console.log(client);
    const finishedOnTime = activeChecklist.checklist.duration >= totalSpentTime;
    const earnedPoints = finishedOnTime
      ? activeChecklist.checklist.numberOfPointsOnTime
      : activeChecklist.checklist.numberOfPointsLate;
    const points = client.points + earnedPoints;

    activeChecklist.finishedOnTime = finishedOnTime;
    activeChecklist.earnedPoints = earnedPoints;

    const fieldsToUpdate = { points };
    const earnedPuzzles = finishedOnTime
      ? activeChecklist.checklist.numberOfPuzzlesOnTime || 0
      : activeChecklist.checklist.numberOfPuzzlesLate || 0;

    const puzzlePieces = client.puzzlePieces + earnedPuzzles;
    Object.assign(fieldsToUpdate, { puzzlePieces });
    activeChecklist.earnedPuzzlePieces = earnedPuzzles;

    if (activeChecklist.checklist.allowIncentivize) {
      await this.clientsService.update(client._id, fieldsToUpdate, null);
    } else {
      activeChecklist.earnedPoints = 0;
      activeChecklist.earnedPuzzlePieces = 0;
    }
    await activeChecklist.save();
    this.emitter.emit('ChecklistHistoryCreated', activeChecklist);
  }

  async getActiveChecklistById(checklistId: Types.ObjectId) {
    const checklist = await this.CompletedChecklist.findOne({
      _id: checklistId,
      status: {
        $in: [
          STATUS_PLAYED_CHECKLIST.ACTIVE,
          STATUS_PLAYED_CHECKLIST.STARTED_WP,
          STATUS_PLAYED_CHECKLIST.SHOW_WELCOME_SCREEN,
        ],
      },
    });
    return checklist;
  }

  deleteById(_id: Types.ObjectId) {
    return this.CompletedChecklist.findByIdAndRemove(_id);
  }

  async updateChecklistsStatus() {
    try {
      const twoHoursBefore = moment().subtract(2, 'hours');
      const stuckedAtWelcomeChecklists = await this.CompletedChecklist.find({
        status: {
          $in: [
            STATUS_PLAYED_CHECKLIST.SHOW_WELCOME_SCREEN,
            STATUS_PLAYED_CHECKLIST.STARTED_WP,
          ],
        },
        createdAt: {
          $lte: twoHoursBefore.toDate(),
        },
      }).sort('-createdAt');
      this.updateStatusToNotCompleted(stuckedAtWelcomeChecklists);

      const fourHoursBefore = moment().subtract(4, 'hours');
      const stuckedActiveChecklists = await this.CompletedChecklist.find({
        status: {
          $in: [STATUS_PLAYED_CHECKLIST.ACTIVE],
        },
        createdAt: {
          $lte: fourHoursBefore.toDate(),
        },
      }).sort('-createdAt');
      this.updateStatusToNotCompleted(stuckedActiveChecklists);
    } catch (e) {
      return;
    }
  }

  async updateStatusToNotCompleted(activeChecklists: CompletedChecklist[]) {
    await BB.mapSeries(activeChecklists, async activeChecklist => {
      activeChecklist.status = STATUS_PLAYED_CHECKLIST.STOPPED;
      activeChecklist.save();
    });
  }
}
