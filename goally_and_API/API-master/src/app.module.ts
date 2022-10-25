import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TerminusModule } from '@nestjs/terminus';
import { SentryModule } from '@ntegral/nestjs-sentry';
import { EventEmitter } from 'events';
import { NestEmitterModule } from 'nest-emitter';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { config } from './config';
import { AacPlayedModule } from './entities/aac/aac-played/aac-played.module';
import { AacSheetsModule } from './entities/aac/aac-sheets/aac-sheets.module';
import { AacWordsModule } from './entities/aac/aac-words/aac-words.module';
import { ActivitiesModule } from './entities/activities/activities.module';
import { AdminConfigModule } from './entities/admin-config/admin-config.module';
import { AdminSessionModule } from './entities/admin-session/admin-session.module';
import { AdminModule } from './entities/admin/admin.module';
import { AppLogsModule } from './entities/app-logs/app-logs.module';
import { AppVersionsModule } from './entities/app-versions/app-versions.module';
import { BehaviorTrainingsModule } from './entities/behavior-trainings/behavior-trainings.module';
import { TrainingSegmentsModule } from './entities/behavior-trainings/training-segments/training-segments.module';
import { BehaviorModule } from './entities/behavior/behavior.module';
import { ChecklistsModule } from './entities/checklists/checklists.module';
import { ClientFeatureAccessModule } from './entities/client-feature-access/client-feature-access.module';
import { ClientsModule } from './entities/clients/clients.module';
import { CompletedChecklistsModule } from './entities/completed-checklists/completed-checklists.module';
import { CompletedQuizletModule } from './entities/completed-quizlet/completed-quizlet.module';
import { CompletedRemindersModule } from './entities/completed-reminders/completed-reminders.module';
import { CompletedTrainingsModule } from './entities/completed-trainings/completed-trainings.module';
import { CronJobsModule } from './entities/cron-jobs/cron-jobs.module';
import { DevicesModule } from './entities/devices/devices.module';
import { GameConfigsModule } from './entities/game-configs/game-configs.module';
import { ImagesModule } from './entities/images/images.module';
import { InvitationModule } from './entities/invitation/invitation.module';
import { LabWordsModule } from './entities/lab-words/lab-words.module';
import { PlayedRoutineModule } from './entities/played-routine/played-routine.module';
import { PollyModule } from './entities/polly/polly.module';
import { QuizletModule } from './entities/quizlet/quizlet.module';
import { RecordedBehaviorsModule } from './entities/recorded-behaviors/recorded-behaviors.module';
import { RedeemedRewardsModule } from './entities/redeemed-rewards/redeemed-rewards.module';
import { ReferralsModule } from './entities/referrals/referrals.module';
import { RemindersModule } from './entities/reminders/reminders.module';
import { ReportsModule } from './entities/reports/reports.module';
import { RewardsModule } from './entities/rewards/rewards.module';
import { RoutinesModule } from './entities/routines/routines.module';
import { SafetyFeatureModule } from './entities/safety-features/safety-feature.module';
import { SessionsModule } from './entities/sessions/sessions.module';
import { SleepModeModule } from './entities/sleep-mode/sleep-mode.module';
import { SoundsModule } from './entities/sounds/sounds.module';
import { SubscriptionModule } from './entities/subscription/subscription.module';
import { UploadModule } from './entities/upload/upload.module';
import { UsersModule } from './entities/users/users.module';
import { VisualAidsModule } from './entities/visual-aids/visual-aids.module';
import { RedisModule } from './redis/redis.module';
import { RecurlyModule } from './shared/recurly/recurly.module';
import { SharedModule } from './shared/shared.module';
import { ShippoModule } from './shared/shippo/shippo.module';
import { SocketModule } from './socket/socket.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV == 'LOCAL' ? '.env.local' : '.env',
      load: [config],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
      serveRoot: '/static',
    }),
    MongooseModule.forRoot(config().DATABASE_URL, {
      // useCreateIndex: true,
      // useNewUrlParser: true,
      // useFindAndModify: false,
      // useUnifiedTopology: true,
    }),
    ...(process.env.NODE_ENV == 'PRODUCTION'
      ? [
          SentryModule.forRoot({
            dsn: config().SENTRY_DSN,
            environment: process.env.NODE_ENV,
            release: '0.0.3',
            tracesSampleRate: 0.01,
            ignoreErrors: ['^(?!FallbackExpectionFilter).*$'],
          }),
        ]
      : []),
    NestEmitterModule.forRoot(new EventEmitter()),
    UsersModule,
    RoutinesModule,
    DevicesModule,
    AuthModule,
    SessionsModule,
    SharedModule,
    TerminusModule,
    SocketModule,
    RedisModule,
    InvitationModule,
    ClientsModule,
    ActivitiesModule,
    UploadModule,
    ImagesModule,
    RewardsModule,
    BehaviorModule,
    RedeemedRewardsModule,
    RecordedBehaviorsModule,
    PlayedRoutineModule,
    QuizletModule,
    CompletedQuizletModule,
    SubscriptionModule,
    ReportsModule,
    AppVersionsModule,
    AppLogsModule,
    AdminModule,
    AdminSessionModule,
    ClientFeatureAccessModule,
    BehaviorTrainingsModule,
    TrainingSegmentsModule,
    CompletedTrainingsModule,
    SoundsModule,
    CronJobsModule,
    VisualAidsModule,
    AacWordsModule,
    AacSheetsModule,
    RecurlyModule,
    AacPlayedModule,
    SafetyFeatureModule,
    ReferralsModule,
    AdminConfigModule,
    RemindersModule,
    CompletedRemindersModule,
    ChecklistsModule,
    CompletedChecklistsModule,
    SleepModeModule,
    PollyModule,
    ShippoModule,
    GameConfigsModule,
    LabWordsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
