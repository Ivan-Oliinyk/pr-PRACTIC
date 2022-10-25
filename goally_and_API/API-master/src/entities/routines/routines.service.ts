import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as BB from 'bluebird';
import { isEmpty, omit } from 'lodash';
import { Model, Types } from 'mongoose';
import { InjectEventEmitter } from 'nest-emitter';
import { ActivitiesService } from 'src/entities/activities/activities.service';
import { ClientsService } from 'src/entities/clients/clients.service';
import { User } from 'src/entities/users/schema';
import { UsersService } from 'src/entities/users/users.service';
import { LIBRARY_TYPES } from 'src/shared/const';
import { QUIZLET_TYPES } from 'src/shared/const/quizlet-types';
import { REMINDER_SOUNDS } from 'src/shared/const/reminder-sounds';
import { REORDERING_ACTION } from 'src/shared/const/reordering.action';
import { ROUTINES_TYPE, TYPES } from 'src/shared/const/routine-type';
import { GoallyEventEmitter } from 'src/shared/events/const';
import { validateOrdering } from 'src/shared/validation/OrderingValidation';
import { PdfService } from '../../shared/pdf/pdf.service';
import { CreateActivityDto } from '../activities/dto';
import { ACTION_TYPE, LOGS_TYPE } from '../app-logs/schema/app-logs.schema';
import { QuizletService } from '../quizlet/quizlet.service';
import {
  CreateChildRoutineDto,
  GetActiveRoutineDto,
  UpdateRoutineDto,
} from './dto';
import { CreateRoutineDto } from './dto/CreateRoutine.dto';
import { ReorderRoutineDto } from './dto/ReorderRoutine.dto';
import {
  RoutineOrderDto,
  UpdateRoutineOrdersDto,
} from './dto/UpdateRoutineOrder.dto';
import { predefinedRoutines } from './predefinedData';
import { Routine } from './schema/routine.schema';
@Injectable()
export class RoutinesService {
  constructor(
    @InjectModel(Routine.name) public RoutineModel: Model<Routine>,
    private us: UsersService,
    @Inject(forwardRef(() => ClientsService))
    private cs: ClientsService,
    private as: ActivitiesService,
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
    @Inject(forwardRef(() => PdfService))
    private pdfService: PdfService,
    @Inject(forwardRef(() => QuizletService))
    private qs: QuizletService,
  ) {}

  async create(routineData: CreateRoutineDto, user: User) {
    if (routineData.type == ROUTINES_TYPE.MANUAL) routineData.schedule = null;
    else routineData.lastSchedule = routineData.schedule;

    routineData.activities = routineData.activities.map(e => ({
      ...e,
      createdBy: user._id,
      libraryType: LIBRARY_TYPES.ADULT,
    }));

    const routine = new this.RoutineModel(routineData);
    routine.createdBy = user._id;
    routine.libraryType = LIBRARY_TYPES.ADULT;
    routine.ordering = 0;
    await this.RoutineModel.updateMany(
      {
        ordering: { $gte: routine.ordering },
        createdBy: routine.createdBy,
        libraryType: LIBRARY_TYPES.ADULT,
      },
      { $inc: { ordering: 1 } },
    );
    const savedRoutine = await routine.save();
    this.emitter.emit('RoutineCreated', savedRoutine);
    if (routineData.assetSetting) {
      this.emitter.emit('AssetShared', savedRoutine.imgURL);
    }
    this.emitter.emit('CreateLog', {
      action: ACTION_TYPE.CREATE,
      entity: LOGS_TYPE.ROUTINES,
      user: user._id,
      client: savedRoutine.clientId,
      meta: { routine: savedRoutine },
    });
    return savedRoutine;
  }

  async createChildRoutine(routineData: CreateChildRoutineDto, user: User) {
    const parentRoutine = await this.RoutineModel.findById(
      routineData.parentRoutineId,
    ).lean();
    if (!parentRoutine)
      throw new NotFoundException(
        `Routine ${routineData.parentRoutineId} not found `,
      );

    //if devices are not provided, use all the client devices
    if (isEmpty(parentRoutine.devices)) {
      const devices = (
        await this.cs.getAllDevicesByClientId(routineData.clientId)
      ).map(e => e._id);
      parentRoutine.devices = devices;
    }

    parentRoutine.activities = parentRoutine.activities.map(e => ({
      ...e,
      createdBy: user._id,
    }));
    const newRoutine = omit(
      {
        ...parentRoutine,
        createdBy: user._id,
        clientId: routineData.clientId,
        libraryType: LIBRARY_TYPES.CHILD,
        ordering: 0,
        ctaOrdering: 0,
        parentRoutineId: parentRoutine._id,
      },
      '_id',
      'createdAt',
      'updatedAt',
    );
    const newActivities = parentRoutine.activities.map(parentActivity => {
      return omit(
        {
          ...parentActivity,
          libraryType: LIBRARY_TYPES.CHILD,
          parentActivityId: parentActivity._id,
          clientId: routineData.clientId,
        },
        '_id',
        'createdAt',
        'updatedAt',
      );
    });

    console.log(newActivities);
    newRoutine.activities = newActivities;
    const routine = new this.RoutineModel(newRoutine);

    console.log('before save');
    await this.RoutineModel.updateMany(
      { ordering: { $gte: routine.ordering }, clientId: routine.clientId },
      { $inc: { ordering: 1 } },
    );
    if (routine.libraryType == LIBRARY_TYPES.CHILD && routine.clientId) {
      await this.cs.updateAllCtaOrderings(
        1,
        routine.ctaOrdering,
        routine.clientId,
      );
    }
    const routineFromDb = await routine.save();
    //add quizlet data to the routine
    await this.qs.addQuizletForRoutine(
      routineFromDb,
      routineData.clientId,
      user,
    );

    this.emitter.emit('RoutineCreatedForTheChild', routineFromDb);
    this.emitter.emit('CreateLog', {
      action: ACTION_TYPE.CREATE,
      entity: LOGS_TYPE.ROUTINES,
      user: user._id,
      client: routineFromDb.clientId,
      meta: { routine: routineFromDb },
    });
    return routineFromDb;
  }
  proceedActivity = (user: User) => (activity: CreateActivityDto) => {
    if (activity.assetSetting)
      this.emitter.emit('AssetShared', activity.imgURL);
    return {
      ...activity,
      createdBy: activity.createdBy || user._id,
    };
  };
  async update(
    routineId: Types.ObjectId,
    routineData: UpdateRoutineDto,
    user: User,
  ) {
    if (routineData.type == ROUTINES_TYPE.MANUAL) {
      routineData.lastSchedule = routineData.schedule;
      routineData.schedule = null;
    } else routineData.lastSchedule = routineData.schedule;

    const routine = await this.getByIdWithCreatedBy(routineId, user);
    routineData.activities = routineData.activities.map(
      this.proceedActivity(user),
    );

    const updatedRoutine = await this.RoutineModel.findByIdAndUpdate(
      routine._id,
      routineData,
      {
        new: true,
      },
    );

    this.emitter.emit('RoutineUpdated', updatedRoutine);
    if (routineData.assetSetting) {
      this.emitter.emit('AssetShared', updatedRoutine.imgURL);
    }
    this.emitter.emit('CreateLog', {
      action: ACTION_TYPE.UPDATE,
      entity: LOGS_TYPE.ROUTINES,
      user: user._id,
      client: routine.clientId,
      meta: { oldRoutine: routine, newRoutine: updatedRoutine },
    });
    return updatedRoutine;
  }
  updateOrder = (user: User) => async (routineData: RoutineOrderDto) => {
    const routine = await this.getByIdWithCreatedBy(routineData._id, user);
    if (routine.ordering !== routineData.ordering) {
      const updatedRoutine = await this.RoutineModel.findByIdAndUpdate(
        routine._id,
        routineData,
        {
          new: true,
        },
      );

      this.emitter.emit('RoutineLibraryReordered', updatedRoutine);
      this.emitter.emit('CreateLog', {
        action: ACTION_TYPE.UPDATE,
        entity: LOGS_TYPE.ROUTINES,
        user: user._id,
        client: routine.clientId,
        meta: { oldRoutine: routine, newRoutine: updatedRoutine },
      });
      return updatedRoutine;
    } else return routine;
  };
  async updateOrderings(
    clientId: Types.ObjectId,
    body: UpdateRoutineOrdersDto,
    user: User,
  ) {
    const query = clientId
      ? { clientId: clientId }
      : {
          createdBy: user._id,
          libraryType: LIBRARY_TYPES.ADULT,
        };
    const routineCount = await this.RoutineModel.count(query);
    if (!routineCount)
      throw new BadRequestException(
        `Cannot find any routines for clientId ${clientId}`,
      );
    if (routineCount !== body.routines.length)
      throw new BadRequestException(
        `routines array size must be equal to ${routineCount}`,
      );

    validateOrdering(routineCount, body.routines);
    const updatedRoutines = Promise.all(
      body.routines.map(this.updateOrder(user)),
    );
    return updatedRoutines;
  }
  async delete(routineId: Types.ObjectId, user: User) {
    const routine = await this.getByIdWithCreatedBy(routineId, user);
    await routine.remove();
    await this.as.deleteByRoutineId(routine._id);
    const query = routine.clientId
      ? { ordering: { $gte: routine.ordering }, clientId: routine.clientId }
      : {
          ordering: { $gte: routine.ordering },
          createdBy: routine.createdBy,
          libraryType: LIBRARY_TYPES.ADULT,
        };
    await this.RoutineModel.updateMany(query, { $inc: { ordering: -1 } });
    if (routine.libraryType == LIBRARY_TYPES.CHILD && routine.clientId) {
      await this.cs.updateAllCtaOrderings(
        1,
        routine.ctaOrdering,
        routine.clientId,
      );
    }
    this.emitter.emit('RoutineDeleted', routine);
    this.emitter.emit('CreateLog', {
      action: ACTION_TYPE.DELETE,
      entity: LOGS_TYPE.ROUTINES,
      user: user._id,
      client: routine.clientId,
      meta: { removeRoutine: routine },
    });
    return;
  }
  async getByIdWithCreatedBy(
    _id: Types.ObjectId,
    createdBy: User,
    includeActivity = false,
  ): Promise<Routine> {
    const routine = await this.RoutineModel.findOne({
      _id,
    });
    if (!routine)
      throw new NotFoundException(
        `routine ${_id}, for user ${createdBy._id} not found`,
      );

    return routine;
  }
  async getUserRoutines(user: User) {
    const routines = await this.RoutineModel.find({
      createdBy: user._id,
      libraryType: LIBRARY_TYPES.ADULT,
    })
      .sort('ordering')
      .lean();

    return routines;
  }
  async getUserRoutinesForChild(clientId: Types.ObjectId) {
    const client = await this.cs.findById(clientId);
    const routines = this.findClientRoutine(client._id);
    return routines;
  }
  async findClientRoutine(clientId): Promise<Routine[]> {
    const routines = await this.RoutineModel.find({
      clientId,
    }).sort('ordering');
    return routines;
  }

  async createPredefinedRoutines(user: User) {
    const routines = await BB.mapSeries(
      predefinedRoutines,
      async routineData => {
        routineData.activities = routineData.activities.map(e => ({
          ...e,
          createdBy: user._id,
        }));
        const routineName = routineData.subTitle
          ? routineData.name + ' ' + routineData.subTitle
          : routineData.name;
        const routine = await this.create(
          { ...routineData, name: routineName },
          user._id,
        );
        return routine;
      },
    );
    return routines;
  }

  async createAdminActiveRoutines() {
    const routines = await BB.mapSeries(
      predefinedRoutines,
      async routineData => {
        const routine = await this.createAdminRoutine({ ...routineData });
        return routine;
      },
    );
    return routines;
  }

  async createAdminUserRoutines(user: User) {
    const adminUserRoutines = await this.getUserAdminRoutines();

    const routines = await BB.mapSeries(
      adminUserRoutines,
      async routineData => {
        const activities: CreateActivityDto[] = routineData.activities.map(
          e => {
            return <CreateActivityDto>{
              ...e,
              createdBy: user.id,
            };
          },
        );

        const newRoutine = omit(
          {
            ...routineData,
            activities,
          },
          '_id',
          'createdAt',
          'updatedAt',
        );

        const routine = await this.create(newRoutine, user);
        return routine;
      },
    );
    return routines;
  }

  async createAdminClientRoutines(user: User, clientId: Types.ObjectId) {
    const adminUserRoutines = await this.getClientAdminRoutines();

    const routines = await BB.mapSeries(
      adminUserRoutines,
      async routineData => {
        const routine = await this.createChildRoutine(
          { parentRoutineId: routineData._id, clientId },
          user,
        );
        return routine;
      },
    );
    return routines;
  }

  async reorderChildLibrary(data: ReorderRoutineDto) {
    const routine = await this.RoutineModel.findById(data.routineId);
    const routineCount = await this.RoutineModel.count({
      clientId: routine.clientId,
    });

    if (data.action == REORDERING_ACTION.DOWN) {
      if (routine.ordering == routineCount - 1) {
        await this.RoutineModel.updateMany(
          { ordering: { $gte: 0 }, clientId: routine.clientId },
          { $inc: { ordering: 1 } },
        );
        routine.ordering = 0;
      } else {
        routine.ordering += 1;

        await this.RoutineModel.findOneAndUpdate(
          { ordering: routine.ordering, clientId: routine.clientId },
          { $inc: { ordering: -1 } },
        );
      }
    } else {
      if (routine.ordering == 0) {
        await this.RoutineModel.updateMany(
          { ordering: { $lte: routineCount }, clientId: routine.clientId },
          { $inc: { ordering: -1 } },
        );
        routine.ordering = routineCount - 1;
      } else {
        routine.ordering -= 1;
        await this.RoutineModel.findOneAndUpdate(
          { ordering: routine.ordering, clientId: routine.clientId },
          { $inc: { ordering: 1 } },
        );
      }
    }

    const savedRoutine = await routine.save();
    this.emitter.emit('RoutineLibraryReordered', savedRoutine);
    return savedRoutine;
  }
  //MOBILE
  async getClientRoutinesByDeviceId(deviceId: Types.ObjectId) {
    const client = await this.cs.getClientByDevice(deviceId);
    if (!client)
      throw new BadRequestException('Child not connected to that device');
    const routines = await this.findClientRoutine(client._id);

    return routines;
  }
  async getClientRoutineByDeviceAndId(
    deviceId: Types.ObjectId,
    routineId: Types.ObjectId,
  ) {
    const client = await this.cs.getClientByDevice(deviceId);
    if (!client)
      throw new BadRequestException('Child not connected to that device');
    const routine = await this.RoutineModel.findOne({
      clientId: client._id,
      _id: routineId,
    });
    return routine;
  }

  async migrateOldRoutineForNewCheckBox() {
    return this.RoutineModel.updateMany(
      {},
      {
        allowClientToCancel: false,
        allowToOverride: false,
        showOnLearnerApp: true,
      },
      { multi: true },
    );
  }

  async removeNewRoutines() {
    // const predefinedRoutineName = predefinedRoutines.map(e => e.name);
    const predefinedRoutineName = predefinedRoutines.map(
      e => e.name + ' ' + e.subTitle,
    );
    return this.RoutineModel.remove({ name: { $in: predefinedRoutineName } });
  }

  async removeOldRoutinesInAdultLibrary() {
    const oldRoutines = [
      { name: 'Make a Sandwich', imgURL: 'static/icons/Food/sandwich1.png' },
      {
        name: 'Get ready for school',
        imgURL: 'static/icons/Behaviors/behavior_2233.png',
      },
      {
        name: 'Choose which game to play',
        imgURL: 'static/icons/Rewards/game2.png',
      },
    ];
    const predefinedRoutineName = oldRoutines.map(e => e.name);
    const predefinedRoutineImg = oldRoutines.map(e => e.imgURL);
    return this.RoutineModel.remove({
      name: { $in: predefinedRoutineName },
      imgURL: { $in: predefinedRoutineImg },
      libraryType: LIBRARY_TYPES.ADULT,
    });
  }

  async removeNewRoutinesInAdultLibrary() {
    // const predefinedRoutineName = predefinedRoutines.map(e => e.name);
    const predefinedRoutineName = predefinedRoutines.map(
      e => e.name + ' ' + e.subTitle,
    );
    return this.RoutineModel.remove({
      name: { $in: predefinedRoutineName },
      libraryType: LIBRARY_TYPES.ADULT,
    });
  }

  async updateNewRoutinesInChildLibrary() {
    const predefinedRoutineNames = predefinedRoutines.map(e => {
      return { name: e.name, subTitle: e.subTitle };
    });
    try {
      await BB.mapSeries(
        predefinedRoutineNames,
        async predefinedRoutineName => {
          await this.RoutineModel.updateMany(
            {
              name: predefinedRoutineName.name,
              libraryType: LIBRARY_TYPES.CHILD,
            },
            {
              name:
                predefinedRoutineName.name +
                ' ' +
                predefinedRoutineName.subTitle,
            },
            { multi: true },
          );
        },
      );
      return { success: true };
    } catch (e) {
      return {
        success: false,
        error: e,
      };
    }
  }

  async addNewRoutines() {
    const total = await this.us.UserModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await BB.mapSeries(new Array(arrayLength), async (elem, index) => {
        const users = await this.us.UserModel.find({})
          .limit(series)
          .skip(series * index);
        await BB.mapSeries(users, async user => {
          await this.createPredefinedRoutines(user);
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

  async addAdultsLibOrdering() {
    const total = await this.us.UserModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await BB.mapSeries(new Array(arrayLength), async (elem, index) => {
        const users = await this.us.UserModel.find({})
          .limit(series)
          .skip(series * index);
        await BB.mapSeries(users, async user => {
          await this.addAdultLibOrdering(user);
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

  async addAdultLibOrdering(user: User) {
    const adultRoutines = this.getUserRoutines(user);
    let ordering = 0;
    const routines = await BB.mapSeries(adultRoutines, async adultRoutine => {
      adultRoutine.ordering = ordering;
      ordering++;
      const routine = await this.RoutineModel.findByIdAndUpdate(
        adultRoutine._id,
        adultRoutine,
        { new: true },
      );
      return routine;
    });
    return routines;
  }

  async createAdminRoutine(routineData: CreateRoutineDto) {
    if (routineData.type == ROUTINES_TYPE.MANUAL) {
      routineData.schedule = null;
    }
    const routine = new this.RoutineModel(routineData);
    routine.libraryType = LIBRARY_TYPES.GLOBAL;
    routine.ordering = 0;
    await this.RoutineModel.updateMany(
      {
        ordering: { $gte: routine.ordering },
        libraryType: LIBRARY_TYPES.GLOBAL,
      },
      { $inc: { ordering: 1 } },
    );
    const savedRoutine = await routine.save();
    return savedRoutine;
  }

  async getTemplateFolderActiveRoutines(data: GetActiveRoutineDto) {
    const routines = await this.RoutineModel.find({
      libraryType: LIBRARY_TYPES.GLOBAL,
      isVisibleToAudience: true,
      routineFolder: data.routineFolder,
    })
      .sort({ isMarkedHot: -1, name: 1 })
      .lean();

    return routines;
  }

  async getActiveAdminRoutines() {
    const routines = await this.RoutineModel.find({
      libraryType: LIBRARY_TYPES.GLOBAL,
      isVisibleToAudience: true,
    })
      .sort({ isMarkedHot: -1, name: 1 })
      .lean();

    return routines;
  }
  async getInActiveAdminRoutines() {
    const routines = await this.RoutineModel.find({
      libraryType: LIBRARY_TYPES.GLOBAL,
      isVisibleToAudience: false,
      addOnUserCreation: false,
      addOnClientCreation: false,
    })
      .sort({ name: 1 })
      .lean();

    return routines;
  }
  async getUserAdminRoutines() {
    const routines = await this.RoutineModel.find({
      libraryType: LIBRARY_TYPES.GLOBAL,
      isVisibleToAudience: true,
      addOnUserCreation: true,
    })
      .sort({ name: 1 })
      .lean();

    return routines;
  }
  async getClientAdminRoutines() {
    const routines = await this.RoutineModel.find({
      libraryType: LIBRARY_TYPES.GLOBAL,
      isVisibleToAudience: true,
      addOnUserCreation: true,
      addOnClientCreation: true,
    })
      .sort({ name: 1 })
      .lean();

    return routines;
  }
  async updateAdminRoutine(
    routineId: Types.ObjectId,
    routineData: UpdateRoutineDto,
  ) {
    if (routineData.type == ROUTINES_TYPE.MANUAL) {
      routineData.schedule = null;
    }
    const routine = await this.RoutineModel.findById(routineId);
    if (!routine)
      throw new BadRequestException(
        `Cannot find any routine by Id ${routineId}`,
      );
    if (routineData.addOnUserCreation && !routine.isVisibleToAudience)
      throw new BadRequestException(
        `${routineId} cannot move to user template until active`,
      );
    if (
      routineData.addOnClientCreation &&
      (!routine.addOnUserCreation || !routine.isVisibleToAudience)
    )
      throw new BadRequestException(
        `${routineId} cannot move to client template until active and part of user template`,
      );

    //make sure only one routine is marked as morning routine
    if (routineData.category == QUIZLET_TYPES.MORNING) {
      const existingMorningRoutine = await this.RoutineModel.findOne({
        category: QUIZLET_TYPES.MORNING,
        libraryType: LIBRARY_TYPES.GLOBAL,
        _id: { $ne: routineId },
      });
      if (existingMorningRoutine) {
        throw new BadRequestException(
          `There is already a routine ${existingMorningRoutine.name} marked as morning routine`,
        );
      }
    }
    //make sure only one routine is marked as bedtime routine
    if (routineData.category == QUIZLET_TYPES.BEDTIME) {
      const existingBedTimeRoutine = await this.RoutineModel.findOne({
        category: QUIZLET_TYPES.BEDTIME,
        libraryType: LIBRARY_TYPES.GLOBAL,
        _id: { $ne: routineId },
      });
      if (existingBedTimeRoutine) {
        throw new BadRequestException(
          `There is already a routine ${existingBedTimeRoutine.name} marked as bed time routine`,
        );
      }
    }

    const updatedRoutine = await this.RoutineModel.findByIdAndUpdate(
      routine._id,
      routineData,
      {
        new: true,
      },
    );
    return updatedRoutine;
  }
  async deleteAdminRoutine(routineId: Types.ObjectId) {
    const routine = await this.RoutineModel.findById(routineId);
    if (!routine)
      throw new BadRequestException(
        `Cannot find any routine by Id ${routineId}`,
      );
    await routine.remove();
    await this.as.deleteByRoutineId(routine._id);
    const query = {
      ordering: { $gte: routine.ordering },
      libraryType: LIBRARY_TYPES.GLOBAL,
    };
    await this.RoutineModel.updateMany(query, { $inc: { ordering: -1 } });
    return;
  }

  async getById(_id: Types.ObjectId): Promise<Routine> {
    const routine = await this.RoutineModel.findOne({
      _id,
    });
    if (!routine) throw new NotFoundException(`routine ${_id} not found`);

    return routine;
  }

  async addCreatedByForMissingActivities() {
    const routines = await this.RoutineModel.find({
      libraryType: LIBRARY_TYPES.CHILD,
    });

    let isUpdated = false;
    await BB.mapSeries(routines, async routineData => {
      isUpdated = false;
      routineData.activities.forEach(async activity => {
        if (
          !activity.createdBy &&
          activity.libraryType == LIBRARY_TYPES.CHILD
        ) {
          isUpdated = true;
          activity.createdBy = routineData.createdBy._id;
        }
      });

      if (isUpdated) {
        const updatedRoutine = await new this.RoutineModel(routineData).save();
        console.log('updatedRoutine', updatedRoutine);
      }
    });
  }

  async addShowTimerFields() {
    const total = await this.RoutineModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await BB.mapSeries(new Array(arrayLength), async (elem, index) => {
        const routines = await this.RoutineModel.find({})
          .limit(series)
          .skip(series * index);
        await BB.mapSeries(routines, async routine => {
          await this.addShowTimerField(routine);
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

  async addShowTimerField(routine: Routine) {
    routine.showTimer = true;
    const saveRoutine = await this.RoutineModel.findByIdAndUpdate(
      routine._id,
      routine,
      { new: true },
    );
    return saveRoutine;
  }

  async addAutoCompleteFields() {
    const total = await this.RoutineModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await BB.mapSeries(new Array(arrayLength), async (elem, index) => {
        const routines = await this.RoutineModel.find({})
          .limit(series)
          .skip(series * index);
        await BB.mapSeries(routines, async routine => {
          await this.addAutoCompleteField(routine);
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

  async addAutoCompleteField(routine: Routine) {
    routine.activities.forEach(activity => {
      activity.autoComplete = false;
    });
    const saveRoutine = await this.RoutineModel.findByIdAndUpdate(
      routine._id,
      routine,
      { new: true },
    );
    return saveRoutine;
  }

  async getSchedules(clientId: Types.ObjectId) {
    const routines = await this.RoutineModel.aggregate([
      {
        $match: {
          clientId,
          libraryType: LIBRARY_TYPES.CHILD,
          schedule: { $ne: null },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          schedule: 1,
          duration: {
            $sum: '$activities.maxCompletionTime',
          },
        },
      },
    ]);
    return routines;
  }

  async addDevicesFields() {
    const total = await this.RoutineModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await BB.mapSeries(new Array(arrayLength), async (elem, index) => {
        const routines = await this.RoutineModel.find({})
          .limit(series)
          .skip(series * index);
        await BB.mapSeries(routines, async routine => {
          await this.addDevicesField(routine);
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

  async addDevicesField(routine: Routine) {
    routine.enableEmotionalFeedback = true;
    if (routine.libraryType == LIBRARY_TYPES.CHILD && routine.clientId) {
      const devices = (
        await this.cs.getAllDevicesByClientId(routine.clientId)
      ).map(e => e._id);
      routine.devices = devices;
    }
    const saveRoutine = await this.RoutineModel.findByIdAndUpdate(
      routine._id,
      routine,
      { new: true },
    );
    return saveRoutine;
  }

  async emailPdf(email: string, routineId: Types.ObjectId) {
    const routine = await this.RoutineModel.findById(routineId);
    if (!routine)
      throw new NotFoundException(`routine ${routineId} does not exists`);
    try {
      const activitiesList = routine.activities.map(activity => {
        return {
          name: activity.name,
          duration: activity.maxCompletionTime,
          imgURL: activity.imgURL,
          _id: activity._id,
        };
      });

      const pdfPath = await this.pdfService.generatePdf(
        routine.name,
        TYPES.ROUTINE,
        routine.imgURL,
        routine.schedule,
        activitiesList,
      );
      const pdfUrl = await this.pdfService.uploadPdfToS3(pdfPath);
      const emailRes = await this.pdfService.emailPdf(email, pdfUrl);
      return { success: true, pdfUrl };
    } catch (e) {
      return { success: false, error: e };
    }
  }

  getNotificationSounds() {
    return REMINDER_SOUNDS;
  }

  async addCtaOrderings() {
    const total = await this.RoutineModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await BB.mapSeries(new Array(arrayLength), async (elem, index) => {
        const routines = await this.RoutineModel.find({})
          .limit(series)
          .skip(series * index);
        await BB.mapSeries(routines, async routine => {
          await this.addCtaOrdering(routine);
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

  async addCtaOrdering(routine: Routine): Promise<Routine> {
    if (typeof routine.ordering !== 'number') return routine;
    routine.ctaOrdering = routine.ordering * 3;
    const updatedRoutine = await this.RoutineModel.findByIdAndUpdate(
      routine._id,
      routine,
      { new: true },
    );
    return updatedRoutine;
  }

  async updateCtaOrdering(
    steps: number,
    keyCtaOrder: number,
    clientId: Types.ObjectId,
  ) {
    const query = {
      libraryType: LIBRARY_TYPES.CHILD,
      clientId,
      ctaOrdering: { $gte: keyCtaOrder },
    };
    await this.RoutineModel.updateMany(query, {
      $inc: { ctaOrdering: steps },
    });
  }
  async updatePartial(_id: Types.ObjectId, routine: Partial<Routine>) {
    const updatedRoutine = await this.RoutineModel.findByIdAndUpdate(
      _id,
      routine,
      { new: true },
    );
    return updatedRoutine;
  }

  async addCategory() {
    const morningRegex = { $regex: new RegExp('morning', 'i') };
    const nightRegex = { $regex: new RegExp('bedtime', 'i') };

    await this.RoutineModel.updateMany(
      {
        name: morningRegex,
      },
      { category: QUIZLET_TYPES.MORNING },
    );
    await this.RoutineModel.updateMany(
      {
        name: nightRegex,
      },
      { category: QUIZLET_TYPES.BEDTIME },
    );
  }

  async addDeviceInClientRoutines(
    clientId: Types.ObjectId,
    deviceId: Types.ObjectId,
  ) {
    const routines = await this.RoutineModel.find({ clientId });
    await BB.mapSeries(routines, async routine => {
      await this.addDeviceInRoutine(routine._id, deviceId);
    });
  }

  addDeviceInRoutine(routineId: Types.ObjectId, deviceId: Types.ObjectId) {
    return this.RoutineModel.findByIdAndUpdate(
      routineId,
      {
        $addToSet: { devices: deviceId },
      },
      { new: true },
    );
  }

  async reArrangeRoutinesOrdering() {
    const total = await this.RoutineModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await BB.mapSeries(new Array(arrayLength), async (elem, index) => {
        const routines = await this.RoutineModel.find({})
          .limit(series)
          .skip(series * index);
        await BB.mapSeries(routines, async routine => {
          await this.reArrangeRoutineOrdering(routine);
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

  async reArrangeRoutineOrdering(routine: Routine) {
    routine.activities.forEach((activity, index) => {
      activity.ordering = index;
    });
    const updatedRoutine = await this.RoutineModel.findByIdAndUpdate(
      routine._id,
      routine,
      { new: true },
    );
  }
}
