import { Module } from '@nestjs/common';
import { CompletedQuizletModule } from '../completed-quizlet/completed-quizlet.module';
import { PlayedRoutineModule } from '../played-routine/played-routine.module';
import { RecordedBehaviorsModule } from '../recorded-behaviors/recorded-behaviors.module';
import { RedeemedRewardsModule } from '../redeemed-rewards/redeemed-rewards.module';

import { BehaviorReportService } from './behavior-report/behavior-report.service';
import { QuizletReportService } from './quizlet-report/quizlet-report.service';
import { ReportsController } from './reports.controller';
import { RewardReportService } from './reward-report/reward-report.service';
import { RoutineReportService } from './routine-report/routine-report.service';

@Module({
  imports: [
    PlayedRoutineModule,
    RedeemedRewardsModule,
    CompletedQuizletModule,
    RecordedBehaviorsModule,
  ],
  controllers: [ReportsController],
  providers: [
    BehaviorReportService,
    QuizletReportService,
    RewardReportService,
    RoutineReportService,
  ],
  exports: [
    BehaviorReportService,
    QuizletReportService,
    RewardReportService,
    RoutineReportService,
  ],
})
export class ReportsModule {}
