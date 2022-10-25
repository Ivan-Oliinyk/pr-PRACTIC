import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DevicesModule } from 'src/entities/devices/devices.module';
import { UsersModule } from 'src/entities/users/users.module';
import { GoallyEventEmitter } from 'src/shared/events/const';
import { AdminConfigModule } from '../admin-config/admin-config.module';
import { ChecklistsModule } from '../checklists/checklists.module';
import { ClientFeatureAccessModule } from '../client-feature-access/client-feature-access.module';
import { GameConfigsModule } from '../game-configs/game-configs.module';
import { InvitationModule } from '../invitation/invitation.module';
import { LabWordsModule } from '../lab-words/lab-words.module';
import { PuzzlesModule } from '../puzzles/puzzles.module';
import { ReferralsModule } from '../referrals/referrals.module';
import { RemindersModule } from '../reminders/reminders.module';
import { RewardsModule } from '../rewards/rewards.module';
import { RoutinesModule } from '../routines/routines.module';
import { SoundsModule } from '../sounds/sounds.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { Client, ClientSchema } from './schema/client.schema';
const ClientSchemaProvider = {
  provide: Client.name,
};
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Client.name,
        imports: [],
        useFactory: (emitter: GoallyEventEmitter): typeof ClientSchema => {
          ClientSchema.post('findOneAndUpdate', function(doc) {
            emitter.emit('BalanceChanged', {
              newBalance: doc.points,
              clientId: doc._id,
            });
            emitter.emit('ClientChanged', {
              client: doc._id,
            });
          });
          ClientSchema.post<Client>('save', function(doc) {
            emitter.emit('ClientChanged', {
              client: doc._id,
            });
            emitter.emit('DeviceConnectedToTheChild', {
              client: doc,
            });
          });
          ClientSchema.post('update', function(doc) {
            emitter.emit('ClientChanged', {
              client: doc._id,
            });
          });

          return ClientSchema;
        },
        inject: ['__event_emitter__'],
      },
    ]),
    forwardRef(() => UsersModule),
    forwardRef(() => DevicesModule),
    forwardRef(() => SubscriptionModule),
    forwardRef(() => SoundsModule),
    forwardRef(() => RoutinesModule),
    forwardRef(() => RewardsModule),
    InvitationModule,
    ClientFeatureAccessModule,
    PuzzlesModule,
    AdminConfigModule,
    ReferralsModule,
    ConfigModule,
    forwardRef(() => DevicesModule),
    GameConfigsModule,
    forwardRef(() => RemindersModule),
    forwardRef(() => ChecklistsModule),
    LabWordsModule,
  ],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
