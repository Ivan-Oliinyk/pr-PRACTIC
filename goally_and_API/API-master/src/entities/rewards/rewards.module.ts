import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule } from 'src/entities/clients/clients.module';
import { DevicesModule } from 'src/entities/devices/devices.module';
import { GoallyEventEmitter } from 'src/shared/events/const';
import { UsersModule } from '../users/users.module';
import { RewardsController } from './rewards.controller';
import { RewardsService } from './rewards.service';
import { Reward, RewardSchema } from './schema/reward.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Reward.name,
        useFactory: (emitter: GoallyEventEmitter): typeof RewardSchema => {
          RewardSchema.post('findOneAndUpdate', function(doc) {
            console.log('Reward Updated');
          });

          RewardSchema.post<Reward>('save', function(doc) {
            console.log('Reward saved');
          });

          RewardSchema.post<Reward>(
            'remove',
            { document: true, query: false },
            function(doc) {
              console.log('Reward remove');
            },
          );

          return RewardSchema;
        },
        inject: ['__event_emitter__'],
      },
    ]),
    forwardRef(() => ClientsModule),
    UsersModule,
    forwardRef(() => DevicesModule),
  ],
  controllers: [RewardsController],
  providers: [RewardsService],
  exports: [RewardsService],
})
export class RewardsModule {}
