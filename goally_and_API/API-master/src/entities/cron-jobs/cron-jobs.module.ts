import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CompletedChecklistsModule } from '../completed-checklists/completed-checklists.module';
import { CompletedSleepModeModule } from '../completed-sleep-mode/completed-sleep-mode.module';
import { InvitationModule } from '../invitation/invitation.module';
import { PlayedRoutineModule } from '../played-routine/played-routine.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { UsersModule } from '../users/users.module';
import { CronJobsService } from './cron-jobs.service';

@Module({
  imports: [
    PlayedRoutineModule,
    CompletedChecklistsModule,
    ScheduleModule.forRoot(),
    SubscriptionModule,
    UsersModule,
    CompletedSleepModeModule,
    InvitationModule,
  ],
  providers: [CronJobsService],
  exports: [CronJobsService],
})
export class CronJobsModule {}
