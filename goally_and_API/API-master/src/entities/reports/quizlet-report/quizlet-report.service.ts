import { Injectable } from '@nestjs/common';
import { CompletedQuizletService } from 'src/entities/completed-quizlet/completed-quizlet.service';
import { User } from 'src/entities/users/schema';
import { Types } from 'mongoose';
import { GoallyEventEmitter } from 'src/shared/events/const';
import { InjectEventEmitter } from 'nest-emitter';
import {
  ACTION_TYPE,
  LOGS_TYPE,
} from 'src/entities/app-logs/schema/app-logs.schema';
@Injectable()
export class QuizletReportService {
  constructor(
    private completedQuizlet: CompletedQuizletService,
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
  ) {}
  async getCompletedQuizletReportTable(
    user: User,
    clientId: Types.ObjectId,
    quizletId: Types.ObjectId,
    from: string,
    to: string,
    page: number,
  ) {
    const data = await this.completedQuizlet.getCompletedQuizletReportTable(
      clientId,
      quizletId,
      from,
      to,
      page,
    );
    this.emitter.emit('CreateLog', {
      action: ACTION_TYPE.READ,
      entity: LOGS_TYPE.REPORTS,
      client: clientId,
      user: user._id,
      meta: {
        reportName: 'Detailed Completed Quizlet Report',
        name: data.quizletNames,
        from,
        to,
      },
    });
    return data;
  }
  async getCompletedQuizletReports(
    user: User,
    clientId: Types.ObjectId,
    from: string,
    to: string,
  ) {
    const data = await this.completedQuizlet.getCompletedQuizletReports(
      clientId,
      from,
      to,
    );
    this.emitter.emit('CreateLog', {
      action: ACTION_TYPE.READ,
      entity: LOGS_TYPE.REPORTS,
      client: clientId,
      user: user._id,
      meta: {
        reportName: 'Completed Quizlets Report',
        from,
        to,
      },
    });
    return data;
  }
}
