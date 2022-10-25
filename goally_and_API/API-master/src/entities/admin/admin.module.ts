import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { SharedModule } from 'src/shared/shared.module';
import { AacFoldersModule } from '../aac/aac-folders/aac-folders.module';
import { AacSheetsModule } from '../aac/aac-sheets/aac-sheets.module';
import { AacWordsModule } from '../aac/aac-words/aac-words.module';
import { AdminSessionModule } from '../admin-session/admin-session.module';
import { AppLogsModule } from '../app-logs/app-logs.module';
import { BehaviorTrainingsModule } from '../behavior-trainings/behavior-trainings.module';
import { BehaviorModule } from '../behavior/behavior.module';
import { ChecklistsModule } from '../checklists/checklists.module';
import { ClientFeatureAccessModule } from '../client-feature-access/client-feature-access.module';
import { ClientsModule } from '../clients/clients.module';
import { DevicesModule } from '../devices/devices.module';
import { GameConfigsModule } from '../game-configs/game-configs.module';
import { LabWordsModule } from '../lab-words/lab-words.module';
import { PlayedRoutineModule } from '../played-routine/played-routine.module';
import { QuizletModule } from '../quizlet/quizlet.module';
import { ReferralsModule } from '../referrals/referrals.module';
import { RemindersModule } from '../reminders/reminders.module';
import { RewardsModule } from '../rewards/rewards.module';
import { RoutinesModule } from '../routines/routines.module';
import { SleepModeModule } from '../sleep-mode/sleep-mode.module';
import { SoundsModule } from '../sounds/sounds.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { UsersModule } from '../users/users.module';
import { VisualAidsModule } from '../visual-aids/visual-aids.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Admin, AdminSchema } from './schema/admin.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    AdminSessionModule,
    UsersModule,
    DevicesModule,
    ClientsModule,
    AppLogsModule,
    ClientFeatureAccessModule,
    SharedModule,
    RoutinesModule,
    RewardsModule,
    BehaviorModule,
    QuizletModule,
    SoundsModule,
    BehaviorTrainingsModule,
    PlayedRoutineModule,
    AacSheetsModule,
    VisualAidsModule,
    AacWordsModule,
    AacFoldersModule,
    ReferralsModule,
    SubscriptionModule,
    SleepModeModule,
    GameConfigsModule,
    ChecklistsModule,
    RemindersModule,
    LabWordsModule,
    AuthModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
