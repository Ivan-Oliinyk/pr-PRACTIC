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
import { ReorderBehavior } from './dto';
import { CreateBehavior } from './dto/CreateBehavior';
import { CreateBehaviorChild } from './dto/CreateBehaviorChild';
import {
  BehaviorOrderDto,
  UpdateBehaviorOrdersDto,
} from './dto/UpdateBehaviorOrder.dto';
import { predefinedBehaviors } from './predefinedData';
import { Behavior } from './schema/behavior.schema';

@Injectable()
export class BehaviorService {
  constructor(
    @InjectModel(Behavior.name) private BehaviorModel: Model<Behavior>,
    private cs: ClientsService,
    private us: UsersService,
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
  ) {}

  async create(behaviorData: CreateBehavior, user: User): Promise<Behavior> {
    const behavior = new this.BehaviorModel(behaviorData);
    behavior.createdBy = user._id;
    behavior.ordering = 0;
    await this.BehaviorModel.updateMany(
      {
        ordering: { $gte: behavior.ordering },
        createdBy: behavior.createdBy,
        libraryType: LIBRARY_TYPES.ADULT,
      },
      { $inc: { ordering: 1 } },
    );
    const savedBehavior = await behavior.save();
    this.emitter.emit('BehaviorCreated', savedBehavior);
    this.emitter.emit('CreateLog', {
      action: ACTION_TYPE.CREATE,
      entity: LOGS_TYPE.BEHAVIORS,
      user: user._id,
      client: savedBehavior.clientId,
      meta: { behavior: savedBehavior },
    });
    return savedBehavior;
  }

  async createForChild(
    behaviorData: CreateBehaviorChild,
    user: User,
  ): Promise<Behavior> {
    const parentBehavior = await this.BehaviorModel.findById(
      behaviorData.parentBehaviorId,
    ).lean();
    if (!parentBehavior)
      throw new NotFoundException(
        `behavior ${behaviorData.parentBehaviorId} not found `,
      );

    const newBehavior = omit(
      {
        ...parentBehavior,
        ...behaviorData,
        createdBy: user._id,
        libraryType: LIBRARY_TYPES.CHILD,
        ordering: 0,
      },
      '_id',
      'createdAt',
      'updatedAt',
    );

    const behavior = new this.BehaviorModel(newBehavior);

    await this.BehaviorModel.updateMany(
      { ordering: { $gte: behavior.ordering }, clientId: behavior.clientId },
      { $inc: { ordering: 1 } },
    );
    const savedBehavior = await behavior.save();
    this.emitter.emit('BehaviorCreatedForTheChild', savedBehavior);
    this.emitter.emit('CreateLog', {
      action: ACTION_TYPE.CREATE,
      entity: LOGS_TYPE.BEHAVIORS,
      user: user._id,
      client: savedBehavior.clientId,
      meta: { behavior: savedBehavior },
    });
    return savedBehavior;
  }

  async update(
    behaviorData: Partial<Behavior>,
    behaviorId: Types.ObjectId,
    user: User,
  ): Promise<Behavior> {
    const behavior = await this.BehaviorModel.findById(behaviorId);
    const savedBehavior = await this.BehaviorModel.findByIdAndUpdate(
      behaviorId,
      behaviorData,
      { new: true },
    );
    this.emitter.emit('BehaviorUpdated', savedBehavior);
    this.emitter.emit('CreateLog', {
      action: ACTION_TYPE.UPDATE,
      entity: LOGS_TYPE.BEHAVIORS,
      user: user._id,
      client: savedBehavior.clientId,
      meta: { oldBehavior: behavior, newBehavior: savedBehavior },
    });
    return savedBehavior;
  }

  updateOrder = (user: User) => async (behaviorData: BehaviorOrderDto) => {
    const behavior = await this.BehaviorModel.findById(behaviorData._id);
    if (behavior.ordering !== behaviorData.ordering) {
      const updatedBehavior = await this.BehaviorModel.findByIdAndUpdate(
        behavior._id,
        behaviorData,
        {
          new: true,
        },
      );

      this.emitter.emit('BehaviorLibraryReordered', updatedBehavior);
      this.emitter.emit('CreateLog', {
        action: ACTION_TYPE.UPDATE,
        entity: LOGS_TYPE.BEHAVIORS,
        user: user._id,
        client: behavior.clientId,
        meta: { oldBehavior: behavior, newBehavior: updatedBehavior },
      });
      return updatedBehavior;
    } else return behavior;
  };
  async updateOrderings(
    clientId: Types.ObjectId,
    body: UpdateBehaviorOrdersDto,
    user: User,
  ) {
    const query = clientId
      ? { clientId: clientId }
      : {
          createdBy: user._id,
          libraryType: LIBRARY_TYPES.ADULT,
        };
    const behaviorCount = await this.BehaviorModel.count(query);
    if (!behaviorCount)
      throw new BadRequestException(
        `Cannot find any behaviors for clientId ${clientId}`,
      );
    if (behaviorCount !== body.behaviors.length)
      throw new BadRequestException(
        `behaviors array size must be equal to ${behaviorCount}`,
      );

    validateOrdering(behaviorCount, body.behaviors);
    const updatedBehaviors = Promise.all(
      body.behaviors.map(this.updateOrder(user)),
    );
    return updatedBehaviors;
  }

  async findById(behaviorId: Types.ObjectId): Promise<Behavior> {
    const behavior = await this.BehaviorModel.findById(behaviorId);
    return behavior;
  }
  async getUserBehaviors(user: User): Promise<Behavior[]> {
    const behaviors = await this.BehaviorModel.find({
      createdBy: user._id,
      libraryType: LIBRARY_TYPES.ADULT,
    }).sort('ordering');
    return behaviors;
  }

  async deleteById(behaviorId: Types.ObjectId, user: User): Promise<void> {
    const behavior = await this.findById(behaviorId);
    if (!behavior)
      throw new NotFoundException(`Behavior with id ${behaviorId} not found`);
    await behavior.remove();
    const query = behavior.clientId
      ? { ordering: { $gte: behavior.ordering }, clientId: behavior.clientId }
      : {
          ordering: { $gte: behavior.ordering },
          createdBy: behavior.createdBy,
          libraryType: LIBRARY_TYPES.ADULT,
        };
    await this.BehaviorModel.updateMany(query, { $inc: { ordering: -1 } });
    this.emitter.emit('BehaviorDeleted', behavior);
    this.emitter.emit('CreateLog', {
      action: ACTION_TYPE.DELETE,
      entity: LOGS_TYPE.BEHAVIORS,
      user: user._id,
      client: behavior.clientId,
      meta: { behavior },
    });
  }
  async getChildLibrary(clientId: Types.ObjectId, user: User) {
    const client = await this.cs.findById(clientId);
    const behaviors = this.findClientBehavior(client._id);
    return behaviors;
  }
  findClientBehavior(clientId) {
    return this.BehaviorModel.find({ clientId }).sort('ordering');
  }
  async getClientBehaviorsByDeviceId(deviceId: Types.ObjectId) {
    const client = await this.cs.getClientByDevice(deviceId);
    if (!client)
      throw new BadRequestException('Child not connected to that device');
    const behaviors = await this.findClientBehavior(client._id);

    return behaviors;
  }
  async getClientBehaviorByDeviceIdAndId(
    deviceId: Types.ObjectId,
    behaviorId: Types.ObjectId,
  ) {
    const client = await this.cs.getClientByDevice(deviceId);
    if (!client)
      throw new BadRequestException('Child not connected to that device');

    const behavior = await this.findById(behaviorId);
    if (!behavior)
      throw new NotFoundException(
        `behavior with id ${behaviorId}  doest not exist for the device with id ${deviceId}`,
      );
    return behavior;
  }
  async reorderChildLibrary(data: ReorderBehavior) {
    const behavior = await this.BehaviorModel.findById(data.behaviorId);
    if (!behavior)
      throw new NotFoundException(`behavior ${data.behaviorId},  not found`);
    const behaviorCount = await this.BehaviorModel.count({
      clientId: behavior.clientId,
    });

    if (data.action == REORDERING_ACTION.DOWN) {
      if (behavior.ordering == behaviorCount - 1) {
        await this.BehaviorModel.updateMany(
          { ordering: { $gte: 0 }, clientId: behavior.clientId },
          { $inc: { ordering: 1 } },
        );
        behavior.ordering = 0;
      } else {
        behavior.ordering += 1;

        await this.BehaviorModel.findOneAndUpdate(
          { ordering: behavior.ordering, clientId: behavior.clientId },
          { $inc: { ordering: -1 } },
        );
      }
    } else {
      if (behavior.ordering == 0) {
        await this.BehaviorModel.updateMany(
          { ordering: { $lte: behaviorCount }, clientId: behavior.clientId },
          { $inc: { ordering: -1 } },
        );
        behavior.ordering = behaviorCount - 1;
      } else {
        behavior.ordering -= 1;
        await this.BehaviorModel.findOneAndUpdate(
          { ordering: behavior.ordering, clientId: behavior.clientId },
          { $inc: { ordering: 1 } },
        );
      }
    }

    const savedBehavior = await behavior.save();
    this.emitter.emit('BehaviorLibraryReordered', savedBehavior);
  }

  async createPredefinedBehaviors(user: User) {
    const behaviors = await BB.mapSeries(
      predefinedBehaviors,
      async behaviorData => {
        const behavior = await this.create(behaviorData, user._id);
        return behavior;
      },
    );
    return behaviors;
  }

  async removeNewBehaviors() {
    const predefinedBehaviorName = predefinedBehaviors.map(e => e.name);
    return this.BehaviorModel.remove({ name: { $in: predefinedBehaviorName } });
  }

  async removeNewBehaviorsInAdultLibrary() {
    const predefinedBehaviorName = predefinedBehaviors.map(e => e.name);
    return this.BehaviorModel.remove({
      name: { $in: predefinedBehaviorName },
      libraryType: LIBRARY_TYPES.ADULT,
    });
  }

  async addNewBehaviors() {
    const total = await this.us.UserModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await BB.mapSeries(new Array(arrayLength), async (elem, index) => {
        const users = await this.us.UserModel.find({})
          .limit(series)
          .skip(series * index);
        await BB.mapSeries(users, async user => {
          await this.createPredefinedBehaviors(user);
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
    const adultBehaviors = this.getUserBehaviors(user);
    let ordering = 0;
    const behaviors = await BB.mapSeries(
      adultBehaviors,
      async adultBehavior => {
        adultBehavior.ordering = ordering;
        ordering++;
        const behavior = await this.BehaviorModel.findByIdAndUpdate(
          adultBehavior._id,
          adultBehavior,
          { new: true },
        );
        return behavior;
      },
    );
    return behaviors;
  }
}
