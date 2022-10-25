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
import { Model, Types } from 'mongoose';
import { InjectEventEmitter } from 'nest-emitter';
import { ClientsService } from 'src/entities/clients/clients.service';
import { User } from 'src/entities/users/schema';
import { LIBRARY_TYPES } from 'src/shared/const';
import { REORDERING_ACTION } from 'src/shared/const/reordering.action';
import { GoallyEventEmitter } from 'src/shared/events/const';
import { validateOrdering } from 'src/shared/validation/OrderingValidation';
import { ACTION_TYPE, LOGS_TYPE } from '../app-logs/schema/app-logs.schema';
import { UsersService } from '../users/users.service';
import {
  CreateChildRewardDto,
  CreateReward,
  ReorderReward,
  UpdateReward,
} from './dto';
import {
  RewardOrderDto,
  UpdateRewardOrdersDto,
} from './dto/UpdateRewardOrder.dto';
import { predefinedRewards } from './predefinedData';
import { Reward } from './schema/reward.schema';

@Injectable()
export class RewardsService {
  constructor(
    @InjectModel(Reward.name) private RewardModel: Model<Reward>,
    @Inject(forwardRef(() => ClientsService))
    private cs: ClientsService,
    private us: UsersService,
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
  ) {}

  async create(rewardData: CreateReward, user: User) {
    const reward = new this.RewardModel({
      ...rewardData,
      createdBy: user._id,
    });
    reward.ordering = 0;
    await this.RewardModel.updateMany(
      {
        ordering: { $gte: reward.ordering },
        createdBy: reward.createdBy,
        libraryType: LIBRARY_TYPES.ADULT,
      },
      { $inc: { ordering: 1 } },
    );
    const savedReward = await reward.save();
    this.emitter.emit('RewardCreated', savedReward);
    if (rewardData.assetSetting) {
      this.emitter.emit('AssetShared', savedReward.imgURL);
    }
    this.emitter.emit('CreateLog', {
      action: ACTION_TYPE.CREATE,
      entity: LOGS_TYPE.REWARDS,
      user: user._id,
      client: reward.clientId,
      meta: { reward: savedReward },
    });
    return savedReward;
  }
  async createForChild(rewardData: CreateChildRewardDto, user: User) {
    const parentReward = await this.RewardModel.findById(
      rewardData.parentRewardId,
    ).lean();
    if (!parentReward)
      throw new NotFoundException(
        `Reward ${rewardData.parentRewardId} not found `,
      );

    const newReward = omit(
      {
        ...parentReward,
        ...rewardData,
        createdBy: user._id,
        clientId: rewardData.clientId,
        libraryType: LIBRARY_TYPES.CHILD,
        ordering: 0,
      },
      '_id',
      'createdAt',
      'updatedAt',
    );

    const reward = new this.RewardModel(newReward);

    await this.RewardModel.updateMany(
      { ordering: { $gte: reward.ordering }, clientId: reward.clientId },
      { $inc: { ordering: 1 } },
    );
    const savedReward = await reward.save();
    this.emitter.emit('RewardCreatedForTheChild', savedReward);
    this.emitter.emit('CreateLog', {
      action: ACTION_TYPE.CREATE,
      entity: LOGS_TYPE.REWARDS,
      user: user._id,
      client: savedReward.clientId,
      meta: { reward: savedReward },
    });
    return savedReward;
  }
  async reorderChildLibrary(data: ReorderReward) {
    const reward = await this.RewardModel.findById(data.rewardId);
    if (!reward)
      throw new NotFoundException(`reward ${data.rewardId},  not found`);
    const rewardCount = await this.RewardModel.count({
      clientId: reward.clientId,
    });

    if (data.action == REORDERING_ACTION.DOWN) {
      if (reward.ordering == rewardCount - 1) {
        await this.RewardModel.updateMany(
          { ordering: { $gte: 0 }, clientId: reward.clientId },
          { $inc: { ordering: 1 } },
        );
        reward.ordering = 0;
      } else {
        reward.ordering += 1;

        await this.RewardModel.findOneAndUpdate(
          { ordering: reward.ordering, clientId: reward.clientId },
          { $inc: { ordering: -1 } },
        );
      }
    } else {
      if (reward.ordering == 0) {
        await this.RewardModel.updateMany(
          { ordering: { $lte: rewardCount }, clientId: reward.clientId },
          { $inc: { ordering: -1 } },
        );
        reward.ordering = rewardCount - 1;
      } else {
        reward.ordering -= 1;
        await this.RewardModel.findOneAndUpdate(
          { ordering: reward.ordering, clientId: reward.clientId },
          { $inc: { ordering: 1 } },
        );
      }
    }

    const savedReward = await reward.save();
    this.emitter.emit('RewardLibraryReordered', savedReward);
    return savedReward;
  }
  async update(rewardId: Types.ObjectId, rewardData: UpdateReward, user: User) {
    const reward = await this.getByIdWithCreatedBy(rewardId, user);
    const savedReward = await this.RewardModel.findByIdAndUpdate(
      reward._id,
      rewardData,
      {
        new: true,
      },
    );
    this.emitter.emit('RewardUpdated', savedReward);
    if (rewardData.assetSetting) {
      this.emitter.emit('AssetShared', savedReward.imgURL);
    }
    this.emitter.emit('CreateLog', {
      action: ACTION_TYPE.UPDATE,
      entity: LOGS_TYPE.REWARDS,
      user: user._id,
      client: savedReward.clientId,
      meta: { oldReward: reward, newReward: savedReward },
    });
    return savedReward;
  }

  updateOrder = (user: User) => async (rewardData: RewardOrderDto) => {
    const reward = await this.getByIdWithCreatedBy(rewardData._id, user);
    if (reward.ordering !== rewardData.ordering) {
      const updatedReward = await this.RewardModel.findByIdAndUpdate(
        reward._id,
        rewardData,
        {
          new: true,
        },
      );

      this.emitter.emit('RewardLibraryReordered', updatedReward);
      this.emitter.emit('CreateLog', {
        action: ACTION_TYPE.UPDATE,
        entity: LOGS_TYPE.REWARDS,
        user: user._id,
        client: reward.clientId,
        meta: { oldReward: reward, newReward: updatedReward },
      });
      return updatedReward;
    } else return reward;
  };
  async updateOrderings(
    clientId: Types.ObjectId,
    body: UpdateRewardOrdersDto,
    user: User,
  ) {
    const query = clientId
      ? { clientId: clientId }
      : {
          createdBy: user._id,
          libraryType: LIBRARY_TYPES.ADULT,
        };
    const rewardCount = await this.RewardModel.count(query);
    if (!rewardCount)
      throw new BadRequestException(
        `Cannot find any rewards for clientId ${clientId}`,
      );
    if (rewardCount !== body.rewards.length)
      throw new BadRequestException(
        `rewards array size must be equal to ${rewardCount}`,
      );

    validateOrdering(rewardCount, body.rewards);
    const updatedRewards = Promise.all(
      body.rewards.map(this.updateOrder(user)),
    );
    return updatedRewards;
  }

  async delete(rewardId: Types.ObjectId, user: User) {
    const reward = await this.getByIdWithCreatedBy(rewardId, user);
    await reward.remove();
    const query = reward.clientId
      ? { ordering: { $gte: reward.ordering }, clientId: reward.clientId }
      : {
          ordering: { $gte: reward.ordering },
          createdBy: reward.createdBy,
          libraryType: LIBRARY_TYPES.ADULT,
        };
    await this.RewardModel.updateMany(query, { $inc: { ordering: -1 } });
    this.emitter.emit('RewardDeleted', reward);
    this.emitter.emit('CreateLog', {
      action: ACTION_TYPE.DELETE,
      entity: LOGS_TYPE.REWARDS,
      user: user._id,
      client: reward.clientId,
      meta: { reward },
    });
    return;
  }
  async getByIdWithCreatedBy(
    _id: Types.ObjectId,
    createdBy: User,
  ): Promise<Reward> {
    const reward = await this.RewardModel.findOne({
      _id,
    });
    if (!reward)
      throw new NotFoundException(
        `reward ${_id}, for user ${createdBy._id} not found`,
      );
    return reward;
  }
  getUserRewardsLibrary(createdBy: User) {
    return this.RewardModel.find({
      createdBy: createdBy._id,
      libraryType: LIBRARY_TYPES.ADULT,
    }).sort('ordering');
  }

  async getUserRewardsForChild(clientId: Types.ObjectId, user: User) {
    const client = await this.cs.findById(clientId);
    const rewards = this.findClientReward(client._id);
    return rewards;
  }
  async findClientReward(clientId: Types.ObjectId): Promise<Reward[]> {
    const rewards = await this.RewardModel.find({
      clientId,
      libraryType: LIBRARY_TYPES.CHILD,
    }).sort('ordering');
    return rewards;
  }
  async getClientRewardsByDeviceId(deviceId) {
    const client = await this.cs.getClientByDevice(deviceId);
    if (!client)
      throw new BadRequestException('Child not connected to that device');
    const rewards = this.findClientReward(client._id);
    return rewards;
  }
  findById(rewardId: Types.ObjectId) {
    return this.RewardModel.findById(rewardId);
  }
  async getClientRewardByDeviceIdAndId(
    deviceId: Types.ObjectId,
    rewardId: Types.ObjectId,
  ) {
    const client = await this.cs.getClientByDevice(deviceId);
    if (!client)
      throw new BadRequestException('Child not connected to that device');
    const reward = await this.findById(rewardId);
    if (!reward)
      throw new NotFoundException(
        `Reward with id ${rewardId}  doest not exist for the device with id ${deviceId}`,
      );
    return reward;
  }

  async createPredefinedRewards(user: User) {
    const rewards = await BB.mapSeries(predefinedRewards, async rewardData => {
      const reward = await this.create(rewardData, user._id);
      return reward;
    });
    return rewards;
  }

  async removeNewRewards() {
    const predefinedRewardName = predefinedRewards.map(e => e.name);
    return this.RewardModel.remove({ name: { $in: predefinedRewardName } });
  }

  async removeNewRewardsInAdultLibrary() {
    const predefinedRewardName = predefinedRewards.map(e => e.name);
    return this.RewardModel.remove({
      name: { $in: predefinedRewardName },
      libraryType: LIBRARY_TYPES.ADULT,
    });
  }

  async addNewRewards() {
    const total = await this.us.UserModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await BB.mapSeries(new Array(arrayLength), async (elem, index) => {
        const users = await this.us.UserModel.find({})
          .limit(series)
          .skip(series * index);
        await BB.mapSeries(users, async user => {
          await this.createPredefinedRewards(user);
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
    const adultRewards = this.getUserRewardsLibrary(user);
    let ordering = 0;
    const rewards = await BB.mapSeries(adultRewards, async adultReward => {
      adultReward.ordering = ordering;
      ordering++;
      const reward = await this.RewardModel.findByIdAndUpdate(
        adultReward._id,
        adultReward,
        { new: true },
      );
      return reward;
    });
    return rewards;
  }

  async createAdminReward(rewardData: CreateReward) {
    const reward = new this.RewardModel(rewardData);
    reward.libraryType = LIBRARY_TYPES.GLOBAL;
    reward.ordering = 0;
    await this.RewardModel.updateMany(
      {
        ordering: { $gte: reward.ordering },
        libraryType: LIBRARY_TYPES.GLOBAL,
      },
      { $inc: { ordering: 1 } },
    );
    const savedReward = await reward.save();
    return savedReward;
  }

  async getActiveAdminRewards() {
    const rewards = await this.RewardModel.find({
      libraryType: LIBRARY_TYPES.GLOBAL,
      isVisibleToAudience: true,
    })
      .sort({ isMarkedHot: -1, name: 1 })
      .lean();

    return rewards;
  }

  async getInActiveAdminRewards() {
    const rewards = await this.RewardModel.find({
      libraryType: LIBRARY_TYPES.GLOBAL,
      isVisibleToAudience: false,
      addOnUserCreation: false,
      addOnClientCreation: false,
    })
      .sort({ name: 1 })
      .lean();

    return rewards;
  }

  async updateAdminReward(rewardId: Types.ObjectId, rewardData: UpdateReward) {
    const reward = await this.RewardModel.findById(rewardId);
    if (!reward)
      throw new BadRequestException(`Cannot find any reward by Id ${rewardId}`);
    if (rewardData.addOnUserCreation && !reward.isVisibleToAudience)
      throw new BadRequestException(
        `${rewardId} cannot move to user template until active`,
      );
    if (
      rewardData.addOnClientCreation &&
      (!reward.addOnUserCreation || !reward.isVisibleToAudience)
    )
      throw new BadRequestException(
        `${rewardId} cannot move to client template until active and part of user template`,
      );

    const updatedReward = await this.RewardModel.findByIdAndUpdate(
      reward._id,
      rewardData,
      {
        new: true,
      },
    );
    return updatedReward;
  }

  async getUserAdminRewards() {
    const rewards = await this.RewardModel.find({
      libraryType: LIBRARY_TYPES.GLOBAL,
      isVisibleToAudience: true,
      addOnUserCreation: true,
    })
      .sort({ name: 1 })
      .lean();

    return rewards;
  }

  async getClientAdminRewards() {
    const rewards = await this.RewardModel.find({
      libraryType: LIBRARY_TYPES.GLOBAL,
      isVisibleToAudience: true,
      addOnUserCreation: true,
      addOnClientCreation: true,
    })
      .sort({ name: 1 })
      .lean();

    return rewards;
  }

  async deleteAdminReward(rewardId: Types.ObjectId) {
    const reward = await this.RewardModel.findById(rewardId);
    if (!reward)
      throw new BadRequestException(`Cannot find any reward by Id ${rewardId}`);
    await reward.remove();
    const query = {
      ordering: { $gte: reward.ordering },
      libraryType: LIBRARY_TYPES.GLOBAL,
    };
    await this.RewardModel.updateMany(query, { $inc: { ordering: -1 } });
    return;
  }

  async createAdminActiveRewards() {
    const rewards = await BB.mapSeries(predefinedRewards, async rewardData => {
      const reward = await this.createAdminReward({ ...rewardData });
      return reward;
    });
    return rewards;
  }

  async createAdminUserRewards(user: User) {
    const adminUserRewards = await this.getUserAdminRewards();

    const rewards = await BB.mapSeries(adminUserRewards, async rewardData => {
      const newReward = omit(
        {
          ...rewardData,
        },
        '_id',
        'createdAt',
        'updatedAt',
      );

      const reward = await this.create(
        { ...newReward, assetSetting: true },
        user._id,
      );
      return reward;
    });
    return rewards;
  }

  async createAdminClientRewards(user: User, clientId: Types.ObjectId) {
    const adminUserRewards = await this.getClientAdminRewards();

    const rewards = await BB.mapSeries(adminUserRewards, async rewardData => {
      const reward = await this.createForChild(
        { parentRewardId: rewardData._id, clientId },
        user,
      );
      return reward;
    });
    return rewards;
  }
}
