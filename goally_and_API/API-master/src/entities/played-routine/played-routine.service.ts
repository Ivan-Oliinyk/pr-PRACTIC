import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as BB from 'bluebird';
import { omit } from 'lodash';
import * as moment from 'moment';
import { Model, Types } from 'mongoose';
import * as PaginateModel from 'mongoose-aggregate-paginate-v2';
import { InjectEventEmitter } from 'nest-emitter';
import { COMPLETED_ROUTINE_SEARCH_FIELDS } from 'src/shared/const/stat-search-fields';
import { COMPLETED_ROUTINE_SORT_FIELDS } from 'src/shared/const/stat-sort-fields';
import { GoallyEventEmitter } from 'src/shared/events/const';
import { ActivitiesService } from '../activities/activities.service';
import { ClientsService } from '../clients/clients.service';
import { Device } from '../devices/schemas';
import { RoutinesService } from '../routines/routines.service';
import { User } from '../users/schema';
import {
  PROMPTS_OPTIONS,
  STATUS_PLAYED_ACTIVITY,
  STATUS_PLAYED_ROUTINE,
} from './const';
import { CreatePlayedRoutine } from './dto/CreatePlayedRoutine.dto';
import { SaveOfflinePlayedRoutine } from './dto/CreatePlayedRoutineOffline.dto';
import { SaveCompletedRoutine } from './dto/SaveCompletedRoutine.dto';
import { PlayedRoutine } from './schema/played-routine.schema';

@Injectable()
export class PlayedRoutineService {
  async getFinishedLibrary(user: User, daysBefore: number) {
    const clients = await BB.map(user.clients, this.cs.findById);
    const routinesByClients = await BB.map(clients, async client => {
      const routinesHistory = await this.getFinishedRoutineByChildId(
        client._id,
        daysBefore,
      );
      return { client, routinesHistory };
    });
    return routinesByClients;
  }
  constructor(
    @InjectModel(PlayedRoutine.name)
    private PlayedRoutine: Model<PlayedRoutine>,
    @Inject(forwardRef(() => RoutinesService))
    private rs: RoutinesService,
    private as: ActivitiesService,
    private cs: ClientsService,
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
    @InjectModel(PlayedRoutine.name)
    private PaginatedModel: PaginateModel<PlayedRoutine>,
  ) {}
  async routineShowWelcomeScreen(
    body: CreatePlayedRoutine,
    initiator: string,
    playedDevice: Types.ObjectId,
  ) {
    const routine = await this.rs.RoutineModel.findById(body.routineId).lean();
    console.log(routine._id, 'routine');
    const activities = routine.activities;
    console.log(activities.length, 'activities');

    const activityForPlayed = activities
      .sort(e => e.ordering)
      .map(e => {
        return {
          ...e,
          timeRanges: [],
          status: STATUS_PLAYED_ACTIVITY.NOT_STARTED,
        };
      });

    const playedRoutineDto = {
      routineId: routine._id,
      startedAtWebPortal: new Date(),
      startedAtDevice: new Date(),
      clientId: routine.clientId,
      initiator,
      status: STATUS_PLAYED_ROUTINE.SHOW_WELCOME_SCREEN,
      finishedAt: null,
      activities: activityForPlayed,
      routine: omit(routine, 'activities'),
      playedDevice,
    };
    const playedRoutine = new this.PlayedRoutine(playedRoutineDto);

    return playedRoutine.save();
  }

  getPromptsOptions() {
    return Object.values(PROMPTS_OPTIONS);
  }
  async startFromDevice(body: CreatePlayedRoutine, initiator: string) {
    const routine = await this.rs.RoutineModel.findById(body.routineId).lean();
    console.log(routine._id, 'routine');
    const activities = routine.activities;
    console.log(activities.length, 'activities');

    const activityForPlayed = activities
      .sort(e => e.ordering)
      .map(e => {
        return {
          ...e,
          timeRanges: [],
          status: STATUS_PLAYED_ACTIVITY.NOT_STARTED,
        };
      });
    activityForPlayed[0].status = STATUS_PLAYED_ROUTINE.ACTIVE;
    activityForPlayed[0].timeRanges = [
      {
        startedAt: new Date(),
        finishedAt: null,
      },
    ];

    const playedRoutineDto = {
      routineId: routine._id,
      startedAtWebPortal: new Date(),
      startedAtDevice: null,
      clientId: routine.clientId,
      initiator,
      status: STATUS_PLAYED_ROUTINE.ACTIVE,
      finishedAt: null,
      activities: activityForPlayed,
      routine: omit(routine, 'activities'),
    };
    const playedRoutine = new this.PlayedRoutine(playedRoutineDto);

    return playedRoutine.save();
  }
  async getPlayedRoutineByRoutineId(routineId: Types.ObjectId) {
    const playedRoutine = await this.PlayedRoutine.findOne({
      routineId,
      status: {
        $in: [
          STATUS_PLAYED_ROUTINE.ACTIVE,
          STATUS_PLAYED_ROUTINE.PAUSED,
          STATUS_PLAYED_ROUTINE.STARTED_WP,
          STATUS_PLAYED_ROUTINE.SHOW_WELCOME_SCREEN,
        ],
      },
    });
    return playedRoutine;
  }
  async getPlayedRoutineById(_id: Types.ObjectId) {
    const playedRoutine = await this.PlayedRoutine.findById(_id);
    return playedRoutine;
  }
  async getPlayedRoutineByClientId(clientId: Types.ObjectId) {
    const playedRoutine = await this.PlayedRoutine.findOne({
      clientId,
      status: {
        $in: [
          STATUS_PLAYED_ROUTINE.ACTIVE,
          STATUS_PLAYED_ROUTINE.SHOW_WELCOME_SCREEN,
          STATUS_PLAYED_ROUTINE.PAUSED,
          STATUS_PLAYED_ROUTINE.STARTED_WP,
        ],
      },
    }).sort('-createdAt');
    return playedRoutine;
  }
  async getPlayedRoutineByClientIdV2(clientId: Types.ObjectId) {
    const playedRoutine = await this.PlayedRoutine.findOne({
      clientId,
      status: {
        $in: [
          STATUS_PLAYED_ROUTINE.ACTIVE,
          STATUS_PLAYED_ROUTINE.SHOW_WELCOME_SCREEN,
          STATUS_PLAYED_ROUTINE.PAUSED,
          STATUS_PLAYED_ROUTINE.STARTED_WP,
        ],
      },
    }).sort('-createdAt');
    return { playedRoutine, clientId };
  }
  async getPlayedRoutinesByClientId(clientId: Types.ObjectId) {
    const playedRoutine = await this.PlayedRoutine.find({
      clientId,
      status: {
        $in: [
          STATUS_PLAYED_ROUTINE.ACTIVE,
          STATUS_PLAYED_ROUTINE.SHOW_WELCOME_SCREEN,
          STATUS_PLAYED_ROUTINE.PAUSED,
          STATUS_PLAYED_ROUTINE.STARTED_WP,
        ],
      },
    }).sort('-createdAt');
    return playedRoutine;
  }

  async getPlayedRoutineByDeviceId(deviceId: Types.ObjectId) {
    const client = await this.cs.getClientByDevice(deviceId);
    if (!client) throw new Error(`client not found device ${deviceId}`);
    return this.getPlayedRoutineByClientId(client._id);
  }

  getIndexOfActivity(activeRoutine: PlayedRoutine, activityId) {
    const activityIndex = activeRoutine.activities.findIndex(
      e => e._id.toString() == activityId.toString(),
    );
    console.log(activityIndex);
    if (activityIndex !== -1) return activityIndex;
    else
      throw new Error(
        `activity ${activityId} does not exist in routine ${activeRoutine._id}`,
      );
  }
  getActivityById(activeRoutine: PlayedRoutine, activityId) {
    const activityIndex = this.getIndexOfActivity(activeRoutine, activityId);
    return activeRoutine.activities[activityIndex];
  }

  update(_id: Types.ObjectId, updateData: Partial<PlayedRoutine>) {
    return this.PlayedRoutine.findByIdAndUpdate(_id, updateData, { new: true });
  }

  deleteById(_id: Types.ObjectId) {
    return this.PlayedRoutine.findByIdAndRemove(_id);
  }

  finishLastTimeRange(activity) {
    if (!activity.timeRanges.length) return activity.timeRanges;
    const lastTimeRangeIndex = activity.timeRanges.length - 1;
    const timeRange = activity.timeRanges[lastTimeRangeIndex];

    timeRange.finishedAt = new Date();
    timeRange.startedAt = timeRange.startedAt || new Date();
    return activity.timeRanges;
  }
  activityCreateNewTimeRange(activity) {
    activity.timeRanges.push({
      startedAt: new Date(),
      finishedAt: null,
    });
    return activity.timeRanges;
  }

  async getFinishedRoutineByChildId(
    clientId: Types.ObjectId,
    daysBefore: number,
  ) {
    const dateBefore = moment().subtract(daysBefore, 'days');
    const routines = await this.PlayedRoutine.find({
      clientId: clientId,
      $or: [
        {
          status: STATUS_PLAYED_ROUTINE.FINISHED,
        },
        {
          status: STATUS_PLAYED_ROUTINE.COMPLETED,
        },
        {
          status: STATUS_PLAYED_ROUTINE.NOT_COMPLETED,
        },
      ],
      finishedAt: {
        $gte: dateBefore.toDate(),
      },
    })
      .populate({
        path: 'savedBy',
        model: 'User',
        select: ['firstName', 'lastName', ' -_id'].join(' '),
      })
      .sort({ finishedAt: 'desc' });
    return routines;
  }
  async savePlayed(
    playedRoutineId: Types.ObjectId,
    routineData: SaveCompletedRoutine,
    user: User,
  ) {
    const routine = await this.PlayedRoutine.findOne({
      _id: playedRoutineId,
    });
    if (!routine)
      throw new NotFoundException(
        `played routine  with ${playedRoutineId} not found or already saved :)`,
      );
    routine.status = routineData.status;
    routine.additionalPrompts = routineData.additionalPrompts;
    routine.indepedenceLevel = routineData.indepedenceLevel;
    routine.whatWorkedWell = routineData.whatWorkedWell;
    routine.whatNeedsImprov = routineData.whatNeedsImprov;

    //CTA is using indepedenceLevel while CTP is using additionalPrompts
    if (routineData.additionalPrompts) {
      // coming from CTP
      routine.indepedenceLevel = this.getLevelFromPrompts(
        routineData.additionalPrompts,
      );
    } else if (routineData.indepedenceLevel) {
      // coming from CTA
      routine.additionalPrompts = this.getPromptsFromLevel(
        routineData.indepedenceLevel,
      );
    }
    routine.parentSaved = true;
    routine.savedBy = user._id;

    const savedRoutine = await routine.save();
    this.emitter.emit('RoutineHistoryEdited', savedRoutine);
    return savedRoutine;
  }

  async savePlayedOffline(
    routineData: SaveOfflinePlayedRoutine,
    device: Device,
  ) {
    const routine = new this.PlayedRoutine(routineData);
    routine.offlinePlayed = true;
    routine.clientId = device.client._id;
    const savedRoutine = await routine.save();
    if (routineData.status === STATUS_PLAYED_ROUTINE.FINISHED)
      await this.updatePoints(savedRoutine);
    await this.stopWelcomeScreenRoutine(device._id);
    return savedRoutine;
  }
  async stopWelcomeScreenRoutine(deviceId: Types.ObjectId) {
    const client = await this.cs.getClientByDevice(deviceId);
    if (!client) throw new Error(`client not found device ${deviceId}`);
    const routines = await this.PlayedRoutine.updateMany(
      {
        clientId: client._id,
        status: STATUS_PLAYED_ROUTINE.SHOW_WELCOME_SCREEN,
      },
      {
        status: STATUS_PLAYED_ROUTINE.STOPPED,
      },
      { multi: true },
    );
    const currentlyPlayed = await this.getPlayedRoutineByDeviceId(deviceId);
    this.emitter.emit('ActiveRoutineChangedNotifyWebPortal', {
      routine: currentlyPlayed,
      clientId: client._id,
    });
    this.emitter.emit('ActiveRoutineChangedNotifyDevice', {
      routine: currentlyPlayed,
      clientId: client._id,
    });
  }

  async stopAllActiveRoutine(deviceId: Types.ObjectId) {
    const client = await this.cs.getClientByDevice(deviceId);
    if (!client) throw new Error(`client not found device ${deviceId}`);
    const routines = await this.stopAllActiveRoutineForClient(client._id);
    console.log('stopped routines ', routines.modifiedCount);
  }

  async stopAllActiveRoutineForClient(clientId: Types.ObjectId) {
    const routines = await this.PlayedRoutine.updateMany(
      {
        clientId,
        status: STATUS_PLAYED_ROUTINE.ACTIVE,
      },
      {
        status: STATUS_PLAYED_ROUTINE.STOPPED,
      },
      { multi: true },
    );
    return routines;
  }
  async updatePlayedOffline(
    _id: Types.ObjectId,
    routineData: SaveOfflinePlayedRoutine,
    device: Device,
  ) {
    const playedRoutine = await this.PlayedRoutine.findById({ _id });
    if (!playedRoutine)
      throw new BadRequestException(`routine does not exists with id ${_id}`);

    const savedRoutine = await this.PlayedRoutine.findByIdAndUpdate(
      _id,
      { ...routineData, offlinePlayed: true },
      {
        new: true,
      },
    );
    console.log('updatePlayedRoutine', playedRoutine);
    if (routineData.status === STATUS_PLAYED_ROUTINE.FINISHED)
      if (
        !(
          playedRoutine.status == STATUS_PLAYED_ROUTINE.FINISHED ||
          playedRoutine.status == STATUS_PLAYED_ROUTINE.COMPLETED
        )
      )
        await this.updatePoints(savedRoutine);
    await this.stopWelcomeScreenRoutine(device._id);

    return savedRoutine;
  }
  async finishRoutine(activeRoutine: PlayedRoutine) {
    activeRoutine.status = STATUS_PLAYED_ROUTINE.FINISHED;
    activeRoutine.finishedAt = new Date();
    const savedRoutine = await this.update(activeRoutine._id, activeRoutine);
    await this.updatePoints(savedRoutine);
    return savedRoutine;
  }
  private async updatePoints(activeRoutine: PlayedRoutine) {
    const maxCompletionTime = activeRoutine.activities.reduce(
      (acc, e) => e.maxCompletionTime + acc,
      0,
    );
    activeRoutine.maxCompletionTime = maxCompletionTime;
    const totalSpentTime = activeRoutine.activities.reduce((acc, activity) => {
      const timeSpentByActivity = activity.timeRanges.reduce((acc, time) => {
        const startedAt = moment(time.startedAt);
        const finishedAt = time.finishedAt
          ? moment(time.finishedAt)
          : moment(new Date());
        const duration = moment.duration(finishedAt.diff(startedAt));
        return acc + duration.asMinutes();
      }, 0);
      return acc + timeSpentByActivity;
    }, 0);
    activeRoutine.totalSpentTime =
      Math.round((totalSpentTime + Number.EPSILON) * 100) / 100;
    const client = await this.cs.findById(activeRoutine.clientId);
    console.log(client);
    const finishedOnTime = maxCompletionTime >= totalSpentTime;
    const earnedPoints = finishedOnTime
      ? activeRoutine.routine.numberOfPointsOnTime
      : activeRoutine.routine.numberOfPointsLate;
    const points = client.points + earnedPoints;

    activeRoutine.finishedOnTime = finishedOnTime;
    activeRoutine.earnedPoints = earnedPoints;

    const fieldsToUpdate = { points };
    //add puzzle pieces in client
    // if (client.puzzlePieces > -1) {
    const earnedPuzzles = finishedOnTime
      ? activeRoutine.routine.numberOfPuzzlesOnTime || 0
      : activeRoutine.routine.numberOfPuzzlesLate || 0;

    const puzzlePieces = client.puzzlePieces + earnedPuzzles;
    Object.assign(fieldsToUpdate, { puzzlePieces });
    activeRoutine.earnedPuzzlePieces = earnedPuzzles;
    // }
    if (activeRoutine.routine.allowIncentivize) {
      await this.cs.update(client._id, fieldsToUpdate, null);
    } else {
      activeRoutine.earnedPoints = 0;
      activeRoutine.earnedPuzzlePieces = 0;
    }
    await activeRoutine.save();
    this.emitter.emit('ActiveRoutineChangedNotifyWebPortal', {
      routine: activeRoutine,
      clientId: client._id,
    });
    this.emitter.emit('RoutineHistoryNewAdded', activeRoutine);
  }
  async getFinishedRoutinesDataForReport(
    clientId: Types.ObjectId,
    from: string,
    to: string,
  ) {
    const fromMoment = moment(from);
    const toMoment = moment(to)
      .set('hour', 23)
      .set('minute', 59);

    const routines = await this.PlayedRoutine.find({
      clientId,
      $or: [
        {
          status: STATUS_PLAYED_ROUTINE.FINISHED,
        },
        {
          status: STATUS_PLAYED_ROUTINE.COMPLETED,
        },
        {
          status: STATUS_PLAYED_ROUTINE.NOT_COMPLETED,
        },
      ],
      finishedAt: {
        $gte: fromMoment.toDate(),
        $lte: toMoment.toDate(),
      },
    });
    return routines;
  }
  async getFinishedRoutineDataForReport(
    clientId: Types.ObjectId,
    routineId: Types.ObjectId,

    from: string,
    to: string,
  ) {
    const fromMoment = moment(from);
    const toMoment = moment(to)
      .set('hour', 23)
      .set('minute', 59);

    const routines = await this.PlayedRoutine.find({
      clientId,
      routineId,
      $or: [
        {
          status: STATUS_PLAYED_ROUTINE.FINISHED,
        },
        {
          status: STATUS_PLAYED_ROUTINE.COMPLETED,
        },
        {
          status: STATUS_PLAYED_ROUTINE.NOT_COMPLETED,
        },
      ],
      finishedAt: {
        $gte: fromMoment.toDate(),
        $lte: toMoment.toDate(),
      },
    }).sort('-finishedAt');
    return routines;
  }

  async updateRoutinesStatus() {
    try {
      const twoHoursBefore = moment().subtract(2, 'hours');
      const stuckedAtWelcomeRoutines = await this.PlayedRoutine.find({
        status: {
          $in: [
            STATUS_PLAYED_ROUTINE.SHOW_WELCOME_SCREEN,
            STATUS_PLAYED_ROUTINE.STARTED_WP,
          ],
        },
        createdAt: {
          $lte: twoHoursBefore.toDate(),
        },
      }).sort('-createdAt');
      this.updateStatusToNotCompleted(stuckedAtWelcomeRoutines);

      const fourHoursBefore = moment().subtract(4, 'hours');
      const stuckedActivePausedRoutines = await this.PlayedRoutine.find({
        status: {
          $in: [STATUS_PLAYED_ROUTINE.ACTIVE, STATUS_PLAYED_ROUTINE.PAUSED],
        },
        createdAt: {
          $lte: fourHoursBefore.toDate(),
        },
      }).sort('-createdAt');
      this.updateStatusToNotCompleted(stuckedActivePausedRoutines);
    } catch (e) {
      return;
    }
  }

  async updateStatusToNotCompleted(activeRoutines: PlayedRoutine[]) {
    await BB.mapSeries(activeRoutines, async activeRoutine => {
      activeRoutine.status = STATUS_PLAYED_ROUTINE.NOT_COMPLETED;
      activeRoutine.save();
    });
  }

  async getAllCompletedRoutines(
    from: string,
    to: string,
    field: string,
    text: string,
    sortBy: string = COMPLETED_ROUTINE_SORT_FIELDS.CREATED_AT_DESC,
    page = 1,
    limit = 10,
  ) {
    if (!from)
      from = moment()
        .subtract(1, 'months')
        .format('YYYY-MM-DD');

    const fromMoment = moment(from);
    const toMoment = moment(to)
      .set('hour', 23)
      .set('minute', 59);

    switch (field) {
      case COMPLETED_ROUTINE_SEARCH_FIELDS.ROUTINE_NAME:
        field = 'routine.name';
        break;
      case COMPLETED_ROUTINE_SEARCH_FIELDS.DEVICE_ID:
        field = 'devices.code';
        break;
    }

    const selectedFields = {
      _id: 1,
      routineName: '$routine.name',
      activities: 1,
      startedAtWebPortal: 1,
      startedAtDevice: 1,
      status: 1,
      finishedAt: 1,
      createdAt: 1,
      deviceId: { $arrayElemAt: ['$devices.code', 0] },
    };

    const clientsLookup = {
      from: 'clients',
      localField: 'clientId',
      foreignField: '_id',
      as: 'clients',
    };

    const devicesLookup = {
      from: 'devices',
      localField: 'clients.device',
      foreignField: '_id',
      as: 'devices',
    };

    const matchCriteria = {
      createdAt: {
        $gte: fromMoment.toDate(),
        $lte: toMoment.toDate(),
      },
      $or: [
        {
          status: STATUS_PLAYED_ROUTINE.FINISHED,
        },
        {
          status: STATUS_PLAYED_ROUTINE.COMPLETED,
        },
        {
          status: STATUS_PLAYED_ROUTINE.ACTIVE,
        },
        {
          status: STATUS_PLAYED_ROUTINE.PAUSED,
        },
        {
          status: STATUS_PLAYED_ROUTINE.SHOW_WELCOME_SCREEN,
        },
      ],
    };

    if (field && text)
      Object.assign(matchCriteria, {
        [field]: {
          $regex: `.*${text}.*`,
          $options: 'i',
        },
      });

    const aggregateQuery = this.PaginatedModel.aggregate([
      {
        $lookup: clientsLookup,
      },
      {
        $lookup: devicesLookup,
      },
      {
        $match: matchCriteria,
      },
      // {
      //   $project: selectedFields,
      // },
    ]);
    const routines = await this.PaginatedModel.aggregatePaginate(
      aggregateQuery,
      {
        page,
        limit,
        sort: sortBy,
      },
    );

    return routines;
  }

  getLevelFromPrompts(prompt: string): number {
    let level = 0;
    if (
      prompt.includes(PROMPTS_OPTIONS.NONE) ||
      prompt.includes(PROMPTS_OPTIONS.VERBAL)
    ) {
      level = 1;
    } else if (prompt.includes(PROMPTS_OPTIONS.GESTURE)) {
      level = 2;
    } else if (prompt.includes(PROMPTS_OPTIONS.MODEL)) {
      level = 3;
    } else if (
      prompt.includes(PROMPTS_OPTIONS.PHYSICAL_PARTIAL) ||
      prompt.includes(PROMPTS_OPTIONS.PHYSICAL_FULL)
    ) {
      level = 4;
    }
    return level;
  }

  getPromptsFromLevel(level: number): string {
    let promptOptions = PROMPTS_OPTIONS.NONE;
    if (level == 1) {
      promptOptions = PROMPTS_OPTIONS.VERBAL;
    } else if (level == 2) {
      promptOptions = PROMPTS_OPTIONS.MODEL;
    } else if (level == 3) {
      promptOptions = PROMPTS_OPTIONS.GESTURE;
    } else if (level == 4) {
      promptOptions = PROMPTS_OPTIONS.PHYSICAL_PARTIAL;
    }
    return promptOptions;
  }

  async addIndepndtLevelFields() {
    const total = await this.PlayedRoutine.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await BB.mapSeries(new Array(arrayLength), async (elem, index) => {
        const routines = await this.PlayedRoutine.find({})
          .limit(series)
          .skip(series * index);
        await BB.mapSeries(routines, async routine => {
          await this.addIndepndtLevelField(routine);
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

  async addIndepndtLevelField(playedRoutine: PlayedRoutine) {
    if (playedRoutine.additionalPrompts) {
      playedRoutine.indepedenceLevel = this.getLevelFromPrompts(
        playedRoutine.additionalPrompts,
      );
      const saveRoutine = await this.PlayedRoutine.findByIdAndUpdate(
        playedRoutine._id,
        playedRoutine,
        { new: true },
      );
      return saveRoutine;
    }
  }

  async getLastMonthRoutines() {
    const from = moment()
      .subtract(1, 'months')
      .format('YYYY-MM-DD');
    const to = moment().format('YYYY-MM-DD');
    const routines = await this.PlayedRoutine.find({
      createdAt: {
        $gte: from,
        $lte: to,
      },
    }).distinct('clientId');
    return { totalCount: routines.length, routines };
  }
}
