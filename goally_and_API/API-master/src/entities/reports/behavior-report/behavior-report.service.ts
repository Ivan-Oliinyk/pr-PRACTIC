import { Injectable } from '@nestjs/common';
import { RecordedBehaviorsService } from 'src/entities/recorded-behaviors/recorded-behaviors.service';
import { User } from 'src/entities/users/schema';
import { Types } from 'mongoose';
import { GoallyEventEmitter } from 'src/shared/events/const';
import { InjectEventEmitter } from 'nest-emitter';
import {
  ACTION_TYPE,
  LOGS_TYPE,
} from 'src/entities/app-logs/schema/app-logs.schema';
@Injectable()
export class BehaviorReportService {
  constructor(
    private recordedBehaviorsService: RecordedBehaviorsService,
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
  ) {}
  async getRecordedBehaviorsReportChart(
    user: User,
    clientId: Types.ObjectId,
    behaviorId: Types.ObjectId,
    from: string,
    to: string,
  ) {
    const data = await this.recordedBehaviorsService.getRecordedBehaviorReportChart(
      clientId,
      behaviorId,
      from,
      to,
    );
    this.emitter.emit('CreateLog', {
      action: ACTION_TYPE.READ,
      entity: LOGS_TYPE.REPORTS,
      client: clientId,
      user: user._id,
      meta: {
        reportName: 'Detailed Recorded Behavior Report',
        name: data.behaviorNames,
        from,
        to,
      },
    });
    return data;
  }
  async getRecordedBehaviorsReports(
    user: User,
    clientId: Types.ObjectId,
    from: string,
    to: string,
  ) {
    const data = await this.recordedBehaviorsService.getRecordedBehaviorsReports(
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
        reportName: 'Recorded Behaviors Report',
        from,
        to,
      },
    });
    return data;
  }
}
