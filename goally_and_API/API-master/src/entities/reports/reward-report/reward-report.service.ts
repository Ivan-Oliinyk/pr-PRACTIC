import { Injectable } from '@nestjs/common';
import { RedeemRewardsService } from 'src/entities/redeemed-rewards/redeemed-rewards.service';
import { User } from 'src/entities/users/schema';
import { Types } from 'mongoose';
import { InjectEventEmitter } from 'nest-emitter';
import { GoallyEventEmitter } from 'src/shared/events/const';
import {
  ACTION_TYPE,
  LOGS_TYPE,
} from 'src/entities/app-logs/schema/app-logs.schema';
@Injectable()
export class RewardReportService {
  constructor(
    private redeemedRewardService: RedeemRewardsService,
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
  ) {}
  async getRedeemedRewardsReport(
    user: User,
    clientId: Types.ObjectId,
    from: string,
    to: string,
  ) {
    const rewards = await this.redeemedRewardService.getRedeemedRewardsDataForReport(
      clientId,
      from,
      to,
    );
    this.emitter.emit('CreateLog', {
      action: ACTION_TYPE.READ,
      entity: LOGS_TYPE.REPORTS,
      client: clientId,
      user: user._id,
      meta: {
        reportName: 'Redeemed Rewards Report',
        from,
        to,
      },
    });
    return rewards;
  }
  async getRedeemedRewardReport(
    user: User,
    clientId: Types.ObjectId,
    rewardId: Types.ObjectId,
    from: string,
    to: string,
    page: number,
  ) {
    const rewards = await this.redeemedRewardService.getRedeemedRewardDataForReport(
      clientId,
      rewardId,
      from,
      to,
      page,
    );
    this.emitter.emit('CreateLog', {
      action: ACTION_TYPE.READ,
      entity: LOGS_TYPE.REPORTS,
      client: clientId,
      user: user._id,
      meta: {
        reportName: 'Detailed Redeemed Reward Report',
        name: rewards.rewardName,
        from,
        to,
      },
    });
    return rewards;
  }
}
