import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { UserFromReq } from 'src/shared/decorators';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { ParseObjectIdPipe } from 'src/shared/pipes/ObjectId.pipe';
import { User } from '../users/schema';
import { BehaviorReportService } from './behavior-report/behavior-report.service';
import { QuizletReportService } from './quizlet-report/quizlet-report.service';
import { RewardReportService } from './reward-report/reward-report.service';
import { RoutineReportService } from './routine-report/routine-report.service';

@UseGuards(AuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(
    private routineReportService: RoutineReportService,
    private rewardReportService: RewardReportService,
    private behaviorService: BehaviorReportService,
    private quizletService: QuizletReportService,
  ) {}
  @Get('/completed-routine/:clientId/chart/:routineId')
  async getCompletedRoutineReport(
    @UserFromReq() user: User,
    @Param('clientId', ParseObjectIdPipe) clientId,
    @Param('routineId', ParseObjectIdPipe) routineId,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const data = await this.routineReportService.getCompletedRoutineReportChart(
      user,
      clientId as Types.ObjectId,
      routineId as Types.ObjectId,
      from,
      to,
    );
    return data;
  }
  @Get('/completed-routine/:clientId/table/:playedRoutineId')
  async getCompletedRoutinesReportTable(
    @UserFromReq() user: User,
    @Param('clientId', ParseObjectIdPipe) clientId,
    @Param('playedRoutineId', ParseObjectIdPipe) playedRoutineId,
  ) {
    const data = await this.routineReportService.getCompletedRoutineReportTable(
      user,
      clientId as Types.ObjectId,
      playedRoutineId as Types.ObjectId,
    );
    return data;
  }
  @Get('/completed-routine/:clientId')
  async getCompletedRoutinesReportChart(
    @UserFromReq() user: User,
    @Param('clientId', ParseObjectIdPipe) clientId,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const data = await this.routineReportService.getCompletedRoutinesReport(
      user,
      clientId as Types.ObjectId,
      from,
      to,
    );
    return data;
  }

  @Get('/redeemed-reward/:clientId/table/:rewardId')
  async getRedeemedRewardReport(
    @UserFromReq() user: User,
    @Param('clientId', ParseObjectIdPipe) clientId,
    @Param('rewardId', ParseObjectIdPipe) rewardId,
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    const data = await this.rewardReportService.getRedeemedRewardReport(
      user,
      clientId as Types.ObjectId,
      rewardId as Types.ObjectId,
      from,
      to,
      page,
    );
    return data;
  }
  @Get('/redeemed-reward/:clientId/')
  async getRedeemedRewardsReport(
    @UserFromReq() user: User,
    @Param('clientId', ParseObjectIdPipe) clientId,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const data = await this.rewardReportService.getRedeemedRewardsReport(
      user,
      clientId as Types.ObjectId,
      from,
      to,
    );
    return data;
  }
  @Get('/recorded-behavior/:clientId/chart/:behaviorId')
  async getRecordedBehaviorsReportChart(
    @UserFromReq() user: User,
    @Param('clientId', ParseObjectIdPipe) clientId,
    @Param('behaviorId', ParseObjectIdPipe) behaviorId,

    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const data = await this.behaviorService.getRecordedBehaviorsReportChart(
      user,
      clientId as Types.ObjectId,
      behaviorId as Types.ObjectId,
      from,
      to,
    );
    return data;
  }

  @Get('/recorded-behavior/:clientId/')
  async getRecordedBehaviorsReports(
    @UserFromReq() user: User,
    @Param('clientId', ParseObjectIdPipe) clientId,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const data = await this.behaviorService.getRecordedBehaviorsReports(
      user,
      clientId as Types.ObjectId,
      from,
      to,
    );
    return data;
  }

  @Get('/completed-quizlet/:clientId/table/:quizletId')
  async getCompletedQuizletReportsTable(
    @UserFromReq() user: User,
    @Param('clientId', ParseObjectIdPipe) clientId,
    @Param('quizletId', ParseObjectIdPipe) quizletId,
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    const data = await this.quizletService.getCompletedQuizletReportTable(
      user,
      clientId as Types.ObjectId,
      quizletId,
      from,
      to,
      page,
    );
    return data;
  }
  @Get('/completed-quizlet/:clientId/')
  async getCompletedQuizletReports(
    @UserFromReq() user: User,
    @Param('clientId', ParseObjectIdPipe) clientId,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const data = await this.quizletService.getCompletedQuizletReports(
      user,
      clientId as Types.ObjectId,
      from,
      to,
    );
    return data;
  }
}
