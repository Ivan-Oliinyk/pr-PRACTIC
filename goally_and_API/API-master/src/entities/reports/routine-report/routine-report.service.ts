import { Injectable } from '@nestjs/common';
import { forEach, groupBy, map, uniq } from 'lodash';
import * as moment from 'moment';
import { Types } from 'mongoose';
import { InjectEventEmitter } from 'nest-emitter';
import {
  ACTION_TYPE,
  LOGS_TYPE,
} from 'src/entities/app-logs/schema/app-logs.schema';
import { GoallyEventEmitter } from 'src/shared/events/const';
import { PlayedRoutineService } from '../../played-routine/played-routine.service';
import { PlayedRoutine } from '../../played-routine/schema/played-routine.schema';
import { User } from '../../users/schema';
@Injectable()
export class RoutineReportService {
  constructor(
    private playedRoutineService: PlayedRoutineService,
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
  ) {}
  async getCompletedRoutinesReport(
    user: User,
    clientId: Types.ObjectId,
    from: string,
    to: string,
  ) {
    const routines = await this.playedRoutineService.getFinishedRoutinesDataForReport(
      clientId,
      from,
      to,
    );
    const groupedRoutines = groupBy(routines, 'routineId');
    const formatted = [];
    forEach(groupedRoutines, (playedRoutines, routineId) => {
      const frequency = playedRoutines.length;

      const {
        totalPlannedDuration,
        totalSpentTimePerRoutine,
        onTimeCount,
      } = this.calculateTimeForRoutines(playedRoutines);
      const routineName = uniq(playedRoutines.map(e => e.routine.name)); // maybe switch
      const imgURL = uniq(playedRoutines.map(e => e.routine.imgURL)).pop(); // maybe switch

      formatted.push({
        frequency,
        averageDuration: totalSpentTimePerRoutine / frequency,
        planedDuration: totalPlannedDuration / frequency,
        totalSpentTimePerRoutine,
        totalPlannedDuration,
        onTimeCount,
        routineName,
        routineId,
        imgURL,
      });
    });
    this.emitter.emit('CreateLog', {
      action: ACTION_TYPE.READ,
      entity: LOGS_TYPE.REPORTS,
      client: clientId,
      user: user._id,
      meta: {
        reportName: 'Completed Routines Reports',
        from,
        to,
      },
    });
    return formatted;
  }
  async getCompletedRoutineReportChart(
    user: User,
    clientId: Types.ObjectId,
    routineId: Types.ObjectId,
    from: string,
    to: string,
  ) {
    const routines = await this.playedRoutineService.getFinishedRoutineDataForReport(
      clientId,
      routineId,
      from,
      to,
    );
    const formattedRoutine = routines.map(e => {
      const spentTimeByRoutine = this.calculateSpentTimeForRoutine(e);
      const finishedAt = e.finishedAt;
      const promptLevel = e.additionalPrompts;
      const status = e.status;

      return {
        ...spentTimeByRoutine,
        finishedAt,
        promptLevel,
        status,
        playedRoutineId: e._id,
        routineName: e.routine.name,
      };
    });
    const report = {
      routinesNames: uniq(map(formattedRoutine, e => e.routineName)),
      routines: formattedRoutine,
    };
    this.emitter.emit('CreateLog', {
      action: ACTION_TYPE.READ,
      entity: LOGS_TYPE.REPORTS,
      client: clientId,
      user: user._id,
      meta: {
        reportName: 'Completed Routine Reports',
        name: report.routinesNames,
        from,
        to,
      },
    });
    return report;
  }
  async getCompletedRoutineReportTable(
    user: User,
    clientId: Types.ObjectId,
    playedRoutineId: Types.ObjectId,
  ) {
    const playedRoutine = await this.playedRoutineService.getPlayedRoutineById(
      playedRoutineId,
    );
    const formattedActivity = playedRoutine.activities.map(e => {
      return {
        name: e.name,
        spentTime: this.calculateSpentTimeByActivity(e),
        hasBeenSkipped: e.hasBeenSkipped || false,
        hasBeenPaused: e.hasBeenPaused || false,
        status: e.status,
        imgURL: e.imgURL,
        started: e.timeRanges[0]?.startedAt || 'N/A',
      };
    });
    const report = {
      routineName: playedRoutine.routine.name,
      totalSpentTimePerRoutine: this.calculateSpentTimeForRoutine(playedRoutine)
        .timeSpentByWholeRoutine,

      activities: formattedActivity,
    };
    this.emitter.emit('CreateLog', {
      action: ACTION_TYPE.READ,
      entity: LOGS_TYPE.REPORTS,
      client: clientId,
      user: user._id,
      meta: {
        reportName: 'Detailed Completed Routine Reports',
        name: report.routineName,
      },
    });
    return report;
  }
  calculateSpentTimeForRoutine(playedRoutine: PlayedRoutine) {
    const {
      timeSpentByWholeRoutine,
      activitySpentTime,
    } = playedRoutine.activities.reduce(
      (acc, activity) => {
        const timeSpentByActivity = this.calculateSpentTimeByActivity(activity);
        acc.timeSpentByWholeRoutine += timeSpentByActivity;
        acc.activitySpentTime.push({
          timeSpentByActivity,
          id: activity._id,
          name: activity.name,
          timeRanges: activity.timeRanges,
        });
        return acc;
      },
      { timeSpentByWholeRoutine: 0, activitySpentTime: [] },
    );
    return { timeSpentByWholeRoutine, activitySpentTime };
  }
  // calculateSpentTimeByActivity(activity): number {
  //   const spentTime = activity.timeRanges.reduce((acc, time) => {
  //     const startedAt = moment(time.startedAt);
  //     const finishedAt = time.finishedAt
  //       ? moment(time.finishedAt)
  //       : moment(new Date());
  //     const duration = moment.duration(finishedAt.diff(startedAt));
  //     return acc + duration.asMinutes();
  //   }, 0);
  //   console.log(spentTime);
  //   return spentTime;
  // }
  calculateSpentTimeByActivity(activity): number {
    const spentTime = activity.timeRanges.reduce((acc, time) => {
      if (time.startedAt && time.finishedAt) {
        const startedAt = moment(time.startedAt);
        const finishedAt = moment(time.finishedAt);
        const duration = moment.duration(finishedAt.diff(startedAt));
        return acc + duration.asMinutes();
      } else {
        return acc;
      }
    }, 0);
    console.log(spentTime);
    return spentTime;
  }
  calculateTimeForRoutines(playedRoutines: PlayedRoutine[]) {
    return playedRoutines.reduce(
      (acc, playedRoutine) => {
        const maxCompletionTime = playedRoutine.activities.reduce(
          (acc, e) => e.maxCompletionTime + acc,
          0,
        );
        const { timeSpentByWholeRoutine } = this.calculateSpentTimeForRoutine(
          playedRoutine,
        );
        acc.totalPlannedDuration += maxCompletionTime;
        acc.totalSpentTimePerRoutine += timeSpentByWholeRoutine;
        if (maxCompletionTime >= timeSpentByWholeRoutine) acc.onTimeCount += 1;
        return acc;
      },
      {
        totalPlannedDuration: 0,
        totalSpentTimePerRoutine: 0,
        onTimeCount: 0,
      },
    );
  }
}
