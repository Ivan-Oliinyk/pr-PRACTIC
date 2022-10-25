import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/entities/users/users.module';
import { RedisModule } from 'src/redis/redis.module';
import { SharedModule } from 'src/shared/shared.module';
import { AacFoldersModule } from '../aac/aac-folders/aac-folders.module';
import { AacPlayedModule } from '../aac/aac-played/aac-played.module';
import { AacWordsModule } from '../aac/aac-words/aac-words.module';
import { AdminConfigModule } from '../admin-config/admin-config.module';
import { AppVersionsModule } from '../app-versions/app-versions.module';
import { BehaviorTrainingsModule } from '../behavior-trainings/behavior-trainings.module';
import { BehaviorModule } from '../behavior/behavior.module';
import { ChecklistsModule } from '../checklists/checklists.module';
import { ClientsModule } from '../clients/clients.module';
import { CompletedChecklistsModule } from '../completed-checklists/completed-checklists.module';
import { CompletedQuizletModule } from '../completed-quizlet/completed-quizlet.module';
import { CompletedRemindersModule } from '../completed-reminders/completed-reminders.module';
import { CompletedTrainingsModule } from '../completed-trainings/completed-trainings.module';
import { GameConfigsModule } from '../game-configs/game-configs.module';
import { ImagesModule } from '../images/images.module';
import { LabWordsModule } from '../lab-words/lab-words.module';
import { PlayedRoutineModule } from '../played-routine/played-routine.module';
import { PollyModule } from '../polly/polly.module';
import { PuzzlesModule } from '../puzzles/puzzles.module';
import { QuizletModule } from '../quizlet/quizlet.module';
import { RedeemedRewardsModule } from '../redeemed-rewards/redeemed-rewards.module';
import { RemindersModule } from '../reminders/reminders.module';
import { RewardsModule } from '../rewards/rewards.module';
import { RoutinesModule } from '../routines/routines.module';
import { SafetyFeatureModule } from '../safety-features/safety-feature.module';
import { SleepModeModule } from '../sleep-mode/sleep-mode.module';
import { SoundsModule } from '../sounds/sounds.module';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';
import { Device, DeviceSchema } from './schemas';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
    RedisModule,
    UsersModule,
    PlayedRoutineModule,
    ImagesModule,
    CompletedQuizletModule,
    QuizletModule,
    AppVersionsModule,
    CompletedTrainingsModule,
    BehaviorTrainingsModule,
    SoundsModule,
    forwardRef(() => ClientsModule),
    forwardRef(() => RoutinesModule),
    forwardRef(() => RewardsModule),
    forwardRef(() => RedeemedRewardsModule),
    forwardRef(() => BehaviorModule),
    forwardRef(() => AacWordsModule),
    forwardRef(() => AacFoldersModule),
    forwardRef(() => SharedModule),
    forwardRef(() => AacPlayedModule),
    SafetyFeatureModule,
    PuzzlesModule,
    AdminConfigModule,
    RemindersModule,
    CompletedRemindersModule,
    ChecklistsModule,
    CompletedChecklistsModule,
    SleepModeModule,
    PollyModule,
    GameConfigsModule,
    LabWordsModule,
  ],
  controllers: [DevicesController],
  providers: [DevicesService],
  exports: [DevicesService],
})
export class DevicesModule {}
