import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule } from '../clients/clients.module';
import { RewardsModule } from '../rewards/rewards.module';
import { RedeemRewardsController } from './redeemed-rewards.controller';
import { RedeemRewardsService } from './redeemed-rewards.service';
import {
  RedeemedReward,
  RedeemedRewardSchema,
} from './schema/redeemed-reward.schema';

@Module({
  imports: [
    forwardRef(() => ClientsModule),
    RewardsModule,
    MongooseModule.forFeature([
      { name: RedeemedReward.name, schema: RedeemedRewardSchema },
    ]),
  ],
  controllers: [RedeemRewardsController],
  providers: [RedeemRewardsService],
  exports: [RedeemRewardsService],
})
export class RedeemedRewardsModule {}
