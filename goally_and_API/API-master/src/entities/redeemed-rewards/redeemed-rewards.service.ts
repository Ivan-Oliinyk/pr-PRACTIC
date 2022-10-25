import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model, PaginateModel, Types } from 'mongoose';
import { InjectEventEmitter } from 'nest-emitter';
import { ClientsService } from 'src/entities/clients/clients.service';
import { GoallyEventEmitter } from 'src/shared/events/const';
import { Device } from '../devices/schemas';
import { RewardsService } from '../rewards/rewards.service';
import { User } from '../users/schema';
import { ChildRedeemReward } from './dto/ChildRedeemReward.dto';
import { CreateRedeemReward } from './dto/CreateChildReddemReward.dto';
import { RedeemedReward } from './schema/redeemed-reward.schema';
import * as BB from 'bluebird';

@Injectable()
export class RedeemRewardsService {
  constructor(
    @InjectModel(RedeemedReward.name)
    private RedeemedRewardModel: PaginateModel<RedeemedReward>,
    private cs: ClientsService,
    private rs: RewardsService,
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
  ) {}

  async create(rewardData: CreateRedeemReward, user: User) {
    return this.giveReward(rewardData.clientId, rewardData.rewardId, user);
  }
  async giveReward(
    clientId: Types.ObjectId,
    rewardId: Types.ObjectId,
    user?: User,
  ) {
    const [client, reward] = await Promise.all([
      this.cs.findById(clientId),
      this.rs.findById(rewardId),
    ]);
    if (!reward) throw new NotFoundException(`reward ${rewardId} not found `);
    if (client.points < reward.points)
      throw new BadRequestException(
        `Sorry you don't have enough points :( ${client.points}`,
      );
    const isUserGiveReward = user;

    const redeemedReward = {
      name: reward.name,
      usedPoints: reward.points,
      rewardId: reward._id,
      createdBy: isUserGiveReward ? user._id : null,
      awardedBy: isUserGiveReward ? user.firstName + ' ' + user.lastName : null,
      clientId: clientId,
      imgURL: reward.imgURL,
    };
    const points = client.points - redeemedReward.usedPoints;
    await this.cs.update(
      clientId,
      {
        points,
      },
      null,
    );

    const redeemed = new this.RedeemedRewardModel(redeemedReward);
    const redeemedFromDb = await redeemed.save();
    this.emitter.emit('RedeemedRewardCreated', redeemedFromDb);
    return { ...redeemedFromDb.toObject(), newBalance: points };
  }
  childRedeemRewardByDeviceId(data: ChildRedeemReward, device: Device) {
    return this.giveReward(device.client._id, data.rewardId, null);
  }
  async deleteById(redeemedRewardId: Types.ObjectId, user: User) {
    const redeemed = await this.RedeemedRewardModel.findById(redeemedRewardId);

    if (!redeemed)
      throw new NotFoundException(
        `Redeemed Reward with id ${redeemedRewardId} not found`,
      );
    console.log(redeemed.clientId);
    const clientId = (user.clients as Types.ObjectId[]).find(e =>
      redeemed.clientId.equals(e),
    );
    if (!clientId) throw new NotFoundException(`You cant do that`);

    const client = await this.cs.findById(redeemed.clientId);
    const points = client.points + redeemed.usedPoints;
    await this.cs.update(client._id, { points }, null);

    await redeemed.remove();
    this.emitter.emit('RedeemedRewardRemoved', redeemed);
    return { newBalance: points };
  }

  async getChildRedeemRewards(
    clientId: Types.ObjectId,
    user: User,
    daysBefore: number,
  ) {
    const dateBefore = moment().subtract(daysBefore, 'days');
    const client = await this.cs.findById(clientId);
    if (!client) throw new NotFoundException(`Client not found ${clientId}`);

    const redeemedReward = await this.RedeemedRewardModel.find({
      clientId,
      createdAt: {
        $gte: dateBefore.toDate(),
      },
    }).sort('-createdAt');
    return redeemedReward;
  }

  async getAllRedeemRewards(user: User, daysBefore: number) {
    const clients = await BB.map(user.clients, this.cs.findById);
    const rewardsByClients = await BB.map(clients, async client => {
      const rewardsHistory = await this.getChildRedeemRewards(
        client._id,
        user,
        daysBefore,
      );
      return { client, rewardsHistory };
    });
    return rewardsByClients;
  }

  async getChildRedeemRewardsByDeviceId(deviceId: string) {
    const client = await this.cs.getClientByDevice(deviceId);
    if (!client)
      throw new NotFoundException(`Client for device ${deviceId} not found`);
    const redeemedReward = await this.RedeemedRewardModel.find({
      clientId: client._id,
    });
    return redeemedReward;
  }

  async getRedeemedRewardsDataForReport(
    clientId: Types.ObjectId,
    from: string,
    to: string,
  ) {
    const fromMoment = moment(from);
    const toMoment = moment(to)
      .set('hour', 23)
      .set('minute', 59);
    const filter = {
      clientId: clientId,
      createdAt: {
        $gte: fromMoment.toDate(),
        $lte: toMoment.toDate(),
      },
    };
    const rewards = await this.RedeemedRewardModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$rewardId',
          name: { $addToSet: '$name' },
          imgURL: { $last: '$imgURL' },
          frequency: { $sum: 1 },
        },
      },
      { $sort: { frequency: -1, _id: -1 } },
    ]);
    return rewards;
  }
  async getRedeemedRewardDataForReport(
    clientId: Types.ObjectId,
    rewardId: Types.ObjectId,
    from: string,
    to: string,
    page: number,
  ) {
    const fromMoment = moment(from);
    const toMoment = moment(to)
      .set('hour', 23)
      .set('minute', 59);
    const filter = {
      clientId: clientId,
      rewardId: rewardId,
      createdAt: {
        $gte: fromMoment.toDate(),
        $lte: toMoment.toDate(),
      },
    };
    const rewards = await this.RedeemedRewardModel.paginate(filter, {
      page,
      populate: {
        path: 'createdBy',
        model: 'User',
        select: ['firstName', 'lastName', ' -_id'].join(' '),
      },
      sort: '-createdAt',
    });
    const rewardName = await this.RedeemedRewardModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$rewardId',
          name: { $addToSet: '$name' },
        },
      },
    ]);
    return { rewards, rewardName };
  }
}
