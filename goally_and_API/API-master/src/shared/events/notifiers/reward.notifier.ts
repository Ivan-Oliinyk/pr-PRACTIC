import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectEventEmitter } from 'nest-emitter';
import { RedeemedReward } from 'src/entities/redeemed-rewards/schema/redeemed-reward.schema';
import { Reward } from 'src/entities/rewards/schema/reward.schema';
import { REWARD_NOTIFICATIONS } from 'src/socket/const';
import { SocketBase } from 'src/socket/socket-base.gateway';
import { GoallyEventEmitter } from '../const';
@Injectable()
export class RewardNotifier implements OnModuleInit {
  constructor(
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
    private baseSocket: SocketBase,
  ) {}

  onModuleInit() {
    this.emitter.on(
      'RewardCreated',
      async reward => await this.onRewardCreated(reward),
    );
    this.emitter.on(
      'RewardCreatedForTheChild',
      async reward => await this.onRewardCreatedForTheChild(reward),
    );
    this.emitter.on(
      'RewardUpdated',
      async reward => await this.onRewardUpdated(reward),
    );
    this.emitter.on(
      'RewardDeleted',
      async reward => await this.onRewardDeleted(reward),
    );

    this.emitter.on(
      'RedeemedRewardRemoved',
      async reward => await this.onRedeemedRewardRemoved(reward),
    );

    this.emitter.on(
      'RedeemedRewardCreated',
      async reward => await this.onRedeemedRewardCreated(reward),
    );

    this.emitter.on(
      'RewardLibraryReordered',
      async reward => await this.rewardLibraryChanged(reward),
    );
  }
  async rewardLibraryChanged(reward) {
    this.onRewardLibraryChanged(reward, 'REORDERED');
  }
  onRedeemedRewardCreated(reward) {
    this.onRedeemedRewardChanged(reward, 'CREATED');
  }
  onRedeemedRewardRemoved(reward) {
    this.onRedeemedRewardChanged(reward, 'REMOVED');
  }

  private async onRewardCreated(reward) {
    this.onRewardLibraryChanged(reward, 'CREATED');
  }

  private async onRewardCreatedForTheChild(reward) {
    this.onRewardLibraryChanged(reward, 'CREATED');
  }

  private async onRewardUpdated(reward) {
    this.onRewardLibraryChanged(reward, 'UPDATED');
  }

  private async onRewardDeleted(reward) {
    this.onRewardLibraryChanged(reward, 'DELETED');
  }
  onRewardLibraryChanged(reward: Reward, action) {
    const body = {
      rewardId: reward._id,
      clientId: reward.clientId,
      action,
      reward,
    };
    if (reward.clientId) {
      this.baseSocket.notifyAllParentsAndDeviceByClientId(
        reward.clientId,
        REWARD_NOTIFICATIONS.CHILD_LIBRARY_CHANGED,
        body,
      );
    } else {
      this.baseSocket.sendToAllUserConnectedSession(
        reward.createdBy,
        REWARD_NOTIFICATIONS.PARENT_LIBRARY_CHANGED,
        body,
      );
    }
  }
  onRedeemedRewardChanged(reward: RedeemedReward, action) {
    const body = {
      rewardId: reward._id,
      clientId: reward.clientId,
      action,
      reward,
    };
    this.baseSocket.notifyAllParentsAndDeviceByClientId(
      reward.clientId,
      REWARD_NOTIFICATIONS.REDEEMED_REWARDS_CHANGED,
      body,
    );
  }
}
