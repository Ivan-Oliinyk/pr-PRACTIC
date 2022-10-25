import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as BB from 'bluebird';
import { omit } from 'lodash';
import { Model, Types } from 'mongoose';
import { InjectEventEmitter } from 'nest-emitter';
import { User } from 'src/entities/users/schema';
import { LIBRARY_TYPES } from 'src/shared/const';
import { REORDERING_ACTION } from 'src/shared/const/reordering.action';
import { GoallyEventEmitter } from 'src/shared/events/const';
import { validateOrdering } from 'src/shared/validation/OrderingValidation';
import { ACTION_TYPE, LOGS_TYPE } from '../app-logs/schema/app-logs.schema';
import { ClientsService } from '../clients/clients.service';
import { UsersService } from '../users/users.service';
import { CreateBehaviorTraining } from './dto/CreateBehaviorTraining';
import { CreateBehaviorTrainingChild } from './dto/CreateBehaviorTrainingChild';
import { ReorderBehaviorTraining } from './dto/RecorderBehaviorTraining';
import {
  BehaviorTrainingOrderDto,
  UpdateBehaviorTrainingOrdersDto,
} from './dto/UpdateBehaviorTrainingOrder.dto';
import { BehaviorTraining } from './schema/behavior-training.schema';

@Injectable()
export class BehaviorTrainingsService {
  constructor(
    @InjectModel(BehaviorTraining.name)
    private BehaviorTrainingModel: Model<BehaviorTraining>,
    private cs: ClientsService,
    private us: UsersService,
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
  ) {}

  async create(
    behaviorTrainingData: CreateBehaviorTraining,
    user: User,
  ): Promise<BehaviorTraining> {
    behaviorTrainingData.segments = behaviorTrainingData.segments.map(e => ({
      ...e,
      createdBy: user._id,
    }));
    const behaviorTraining = new this.BehaviorTrainingModel(
      behaviorTrainingData,
    );
    behaviorTraining.segmentSize = behaviorTraining.segments.length;
    behaviorTraining.createdBy = user._id;
    behaviorTraining.ordering = 0;
    await this.BehaviorTrainingModel.updateMany(
      {
        ordering: { $gte: behaviorTraining.ordering },
        createdBy: behaviorTraining.createdBy,
        libraryType: LIBRARY_TYPES.ADULT,
      },
      { $inc: { ordering: 1 } },
    );
    const savedBehaviorTraining = await behaviorTraining.save();
    this.emitter.emit('BehaviorTrainingCreated', savedBehaviorTraining);
    this.emitter.emit('CreateLog', {
      action: ACTION_TYPE.CREATE,
      entity: LOGS_TYPE.BEHAVIOR_TRAININGS,
      user: user._id,
      client: savedBehaviorTraining.clientId,
      meta: { behaviorTraining: savedBehaviorTraining },
    });
    return savedBehaviorTraining;
  }

  async createForChild(
    behaviorTrainingData: CreateBehaviorTrainingChild,
    user: User,
  ): Promise<BehaviorTraining> {
    const parentBehavior = await this.BehaviorTrainingModel.findById(
      behaviorTrainingData.parentBehaviorTrainingId,
    ).lean();
    if (!behaviorTrainingData)
      throw new NotFoundException(
        `behavior training ${behaviorTrainingData.parentBehaviorTrainingId} not found `,
      );

    const newBehaviorTraining = omit(
      {
        ...parentBehavior,
        ...behaviorTrainingData,
        createdBy: user._id,
        libraryType: LIBRARY_TYPES.CHILD,
        ordering: 0,
      },
      '_id',
      'createdAt',
      'updatedAt',
    );

    const newSegments = parentBehavior.segments.map(segment => {
      return omit(
        {
          ...segment,
          clientId: behaviorTrainingData.clientId,
        },
        '_id',
        'createdAt',
        'updatedAt',
      );
    });

    console.log('newSegments', newSegments);
    newBehaviorTraining.segments = newSegments;
    const behaviorTraining = new this.BehaviorTrainingModel(
      newBehaviorTraining,
    );

    await this.BehaviorTrainingModel.updateMany(
      {
        ordering: { $gte: behaviorTraining.ordering },
        clientId: behaviorTraining.clientId,
      },
      { $inc: { ordering: 1 } },
    );
    const savedBehaviorTraining = await behaviorTraining.save();
    this.emitter.emit(
      'BehaviorTrainingCreatedForTheChild',
      savedBehaviorTraining,
    );
    this.emitter.emit('CreateLog', {
      action: ACTION_TYPE.CREATE,
      entity: LOGS_TYPE.BEHAVIOR_TRAININGS,
      user: user._id,
      client: savedBehaviorTraining.clientId,
      meta: { behaviorTraining: savedBehaviorTraining },
    });
    return savedBehaviorTraining;
  }

  async reorderChildLibrary(data: ReorderBehaviorTraining) {
    const behaviorTraining = await this.BehaviorTrainingModel.findById(
      data.behaviorTrainingId,
    );
    if (!behaviorTraining)
      throw new NotFoundException(
        `behavior ${data.behaviorTrainingId},  not found`,
      );
    const behaviorTrainingCount = await this.BehaviorTrainingModel.count({
      clientId: behaviorTraining.clientId,
    });

    if (data.action == REORDERING_ACTION.DOWN) {
      if (behaviorTraining.ordering == behaviorTrainingCount - 1) {
        await this.BehaviorTrainingModel.updateMany(
          { ordering: { $gte: 0 }, clientId: behaviorTraining.clientId },
          { $inc: { ordering: 1 } },
        );
        behaviorTraining.ordering = 0;
      } else {
        behaviorTraining.ordering += 1;

        await this.BehaviorTrainingModel.findOneAndUpdate(
          {
            ordering: behaviorTraining.ordering,
            clientId: behaviorTraining.clientId,
          },
          { $inc: { ordering: -1 } },
        );
      }
    } else {
      if (behaviorTraining.ordering == 0) {
        await this.BehaviorTrainingModel.updateMany(
          {
            ordering: { $lte: behaviorTrainingCount },
            clientId: behaviorTraining.clientId,
          },
          { $inc: { ordering: -1 } },
        );
        behaviorTraining.ordering = behaviorTrainingCount - 1;
      } else {
        behaviorTraining.ordering -= 1;
        await this.BehaviorTrainingModel.findOneAndUpdate(
          {
            ordering: behaviorTraining.ordering,
            clientId: behaviorTraining.clientId,
          },
          { $inc: { ordering: 1 } },
        );
      }
    }

    const savedBehaviorTraining = await behaviorTraining.save();
    this.emitter.emit(
      'BehaviorTrainingLibraryReordered',
      savedBehaviorTraining,
    );
  }

  async getUserBehaviorTrainings(user: User): Promise<BehaviorTraining[]> {
    const behaviorTrainings = await this.BehaviorTrainingModel.find({
      createdBy: user._id,
      libraryType: LIBRARY_TYPES.ADULT,
    }).sort('ordering');
    return behaviorTrainings;
  }

  async getChildLibrary(clientId: Types.ObjectId, user: User) {
    const client = await this.cs.findById(clientId);
    const behaviorTrainings = this.findClientBehavior(client._id);
    return behaviorTrainings;
  }
  findClientBehavior(clientId) {
    return this.BehaviorTrainingModel.find({ clientId }).sort('ordering');
  }

  async findById(behaviorId: Types.ObjectId): Promise<BehaviorTraining> {
    const behavior = await this.BehaviorTrainingModel.findById(behaviorId);
    return behavior;
  }

  async update(
    behaviorTrainingData: Partial<BehaviorTraining>,
    behaviorTrainingId: Types.ObjectId,
    user: User,
  ): Promise<BehaviorTraining> {
    const behaviorTraining = await this.BehaviorTrainingModel.findById(
      behaviorTrainingId,
    );
    behaviorTrainingData.segments = behaviorTrainingData.segments.map(e => ({
      ...e,
      createdBy: behaviorTrainingData.createdBy || user._id,
      clientId: behaviorTraining.clientId || behaviorTrainingData.clientId,
    }));
    behaviorTrainingData.segmentSize = behaviorTrainingData.segments.length;
    const savedBehaviorTraining = await this.BehaviorTrainingModel.findByIdAndUpdate(
      behaviorTrainingId,
      behaviorTrainingData,
      { new: true },
    );
    this.emitter.emit('BehaviorTrainingUpdated', savedBehaviorTraining);
    this.emitter.emit('CreateLog', {
      action: ACTION_TYPE.UPDATE,
      entity: LOGS_TYPE.BEHAVIOR_TRAININGS,
      user: user._id,
      client: savedBehaviorTraining.clientId,
      meta: {
        oldBehaviorTraining: behaviorTraining,
        newBehaviorTraining: savedBehaviorTraining,
      },
    });
    return savedBehaviorTraining;
  }

  updateOrder = (user: User) => async (
    behaviorTrainingData: BehaviorTrainingOrderDto,
  ) => {
    const behaviorTraining = await this.BehaviorTrainingModel.findById(
      behaviorTrainingData._id,
    );
    if (behaviorTraining.ordering !== behaviorTrainingData.ordering) {
      const updatedBehaviorTraining = await this.BehaviorTrainingModel.findByIdAndUpdate(
        behaviorTraining._id,
        behaviorTrainingData,
        {
          new: true,
        },
      );
      this.emitter.emit(
        'BehaviorTrainingLibraryReordered',
        updatedBehaviorTraining,
      );
      this.emitter.emit('CreateLog', {
        action: ACTION_TYPE.UPDATE,
        entity: LOGS_TYPE.BEHAVIOR_TRAININGS,
        user: user._id,
        client: behaviorTraining.clientId,
        meta: {
          oldBehaviorTraining: behaviorTraining,
          newBehaviorTraining: updatedBehaviorTraining,
        },
      });
      return updatedBehaviorTraining;
    } else return behaviorTraining;
  };
  async updateOrderings(
    clientId: Types.ObjectId,
    body: UpdateBehaviorTrainingOrdersDto,
    user: User,
  ) {
    const query = clientId
      ? { clientId: clientId }
      : {
          createdBy: user._id,
          libraryType: LIBRARY_TYPES.ADULT,
        };
    const behaviorTrainingCount = await this.BehaviorTrainingModel.count(query);
    if (!behaviorTrainingCount)
      throw new BadRequestException(
        `Cannot find any behavior trainings for clientId ${clientId}`,
      );
    if (behaviorTrainingCount !== body.behaviorTrainings.length)
      throw new BadRequestException(
        `behavior trainings array size must be equal to ${behaviorTrainingCount}`,
      );

    validateOrdering(behaviorTrainingCount, body.behaviorTrainings);
    const updatedBehaviors = Promise.all(
      body.behaviorTrainings.map(this.updateOrder(user)),
    );
    return updatedBehaviors;
  }

  async deleteById(
    behaviorTrainingId: Types.ObjectId,
    user: User,
  ): Promise<void> {
    const behaviorTraining = await this.findById(behaviorTrainingId);
    if (!behaviorTraining)
      throw new NotFoundException(
        `Behavior with id ${behaviorTrainingId} not found`,
      );
    await behaviorTraining.remove();
    const query = behaviorTraining.clientId
      ? {
          ordering: { $gte: behaviorTraining.ordering },
          clientId: behaviorTraining.clientId,
        }
      : {
          ordering: { $gte: behaviorTraining.ordering },
          createdBy: behaviorTraining.createdBy,
          libraryType: LIBRARY_TYPES.ADULT,
        };
    await this.BehaviorTrainingModel.updateMany(query, {
      $inc: { ordering: -1 },
    });
    this.emitter.emit('BehaviorTrainingDeleted', behaviorTraining);
    this.emitter.emit('CreateLog', {
      action: ACTION_TYPE.DELETE,
      entity: LOGS_TYPE.BEHAVIOR_TRAININGS,
      user: user._id,
      client: behaviorTraining.clientId,
      meta: { behaviorTraining },
    });
  }

  async getClientBehaviorTrainingsByDeviceId(deviceId) {
    const client = await this.cs.getClientByDevice(deviceId);
    if (!client)
      throw new BadRequestException('Child not connected to that device');
    const behaviorTrainings = this.findClientBehavior(client._id);
    return behaviorTrainings;
  }

  async getClientBehaviorTrainingsByDeviceIdAndId(
    deviceId: Types.ObjectId,
    behaviorTrainingId: Types.ObjectId,
  ) {
    const client = await this.cs.getClientByDevice(deviceId);
    if (!client)
      throw new BadRequestException('Child not connected to that device');
    const behaviorTraining = await this.findById(behaviorTrainingId);
    if (!behaviorTraining)
      throw new NotFoundException(
        `Behavior Training with id ${behaviorTrainingId}  doest not exist for the device with id ${deviceId}`,
      );
    return behaviorTraining;
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
    const adultBehaviorTrainings = this.getUserBehaviorTrainings(user);
    let ordering = 0;
    const behaviorTrainings = await BB.mapSeries(
      adultBehaviorTrainings,
      async adultBehaviorTraining => {
        adultBehaviorTraining.ordering = ordering;
        ordering++;
        const behaviorTraining = await this.BehaviorTrainingModel.findByIdAndUpdate(
          adultBehaviorTraining._id,
          adultBehaviorTraining,
          { new: true },
        );
        return behaviorTraining;
      },
    );
    return behaviorTrainings;
  }
}
