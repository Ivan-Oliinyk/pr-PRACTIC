import { BadRequestException, Injectable } from '@nestjs/common';
import { map, orderBy } from 'lodash';
import { ClientsService } from 'src/entities/clients/clients.service';
import { DevicesService } from 'src/entities/devices/devices.service';
import {
  STATUS_PLAYED_ACTIVITY,
  STATUS_PLAYED_ROUTINE,
} from 'src/entities/played-routine/const';
import { PlayedRoutineService } from 'src/entities/played-routine/played-routine.service';
import { PlayedRoutine } from 'src/entities/played-routine/schema/played-routine.schema';
import { UsersService } from 'src/entities/users/users.service';

@Injectable()
export class RealTimeRoutineService {
  constructor(
    private deviceService: DevicesService,
    private cs: ClientsService,
    private us: UsersService,
    private playedRoutineService: PlayedRoutineService,
  ) {}
  async startRoutineAfterWelcomeScreen(
    activeRoutine: PlayedRoutine,
  ): Promise<PlayedRoutine> {
    if (activeRoutine.status !== STATUS_PLAYED_ROUTINE.SHOW_WELCOME_SCREEN) {
      throw new Error(`You can run routine only after welcome screen`);
    }
    activeRoutine.activities[0].status = STATUS_PLAYED_ACTIVITY.ACTIVE;
    activeRoutine.activities[0].timeRanges = [
      {
        startedAt: new Date(),
        finishedAt: null,
      },
    ];
    activeRoutine.status = STATUS_PLAYED_ROUTINE.ACTIVE;
    return await this.playedRoutineService.update(
      activeRoutine._id,
      activeRoutine,
    );
  }
  async startRoutine(activeRoutine: PlayedRoutine): Promise<PlayedRoutine> {
    const activity = activeRoutine.activities.find(
      e => e.status == STATUS_PLAYED_ACTIVITY.PAUSED,
    );
    return this.playActivity(activeRoutine, activity._id);
  }
  async pauseRoutine(activeRoutine: PlayedRoutine): Promise<PlayedRoutine> {
    const activity = activeRoutine.activities.find(
      e => e.status == STATUS_PLAYED_ACTIVITY.ACTIVE,
    );
    return this.pauseActivity(activeRoutine, activity._id);
  }
  async stopRoutine(activeRoutine: PlayedRoutine): Promise<PlayedRoutine> {
    const activity = activeRoutine.activities.find(
      e =>
        e.status == STATUS_PLAYED_ACTIVITY.ACTIVE ||
        e.status == STATUS_PLAYED_ACTIVITY.NOT_STARTED ||
        e.status == STATUS_PLAYED_ACTIVITY.PAUSED,
    );

    return this.stopActivity(activeRoutine, activity._id);
  }

  async playActivity(
    activeRoutine: PlayedRoutine,
    activityId,
  ): Promise<PlayedRoutine> {
    const activityIndex = this.playedRoutineService.getIndexOfActivity(
      activeRoutine,
      activityId,
    );
    const activity = activeRoutine.activities[activityIndex];
    if (
      ![
        STATUS_PLAYED_ACTIVITY.PAUSED,
        STATUS_PLAYED_ACTIVITY.NOT_STARTED,
      ].includes(activity.status)
    )
      throw new Error(`activity with id ${activityId} already played`);

    activity.timeRanges = this.playedRoutineService.activityCreateNewTimeRange(
      activity,
    );
    activity.status = STATUS_PLAYED_ACTIVITY.ACTIVE;
    activeRoutine.status = STATUS_PLAYED_ROUTINE.ACTIVE;

    return await this.playedRoutineService.update(
      activeRoutine._id,
      activeRoutine,
    );
  }
  async pauseActivity(
    activeRoutine: PlayedRoutine,
    activityId,
  ): Promise<PlayedRoutine> {
    const activityIndex = this.playedRoutineService.getIndexOfActivity(
      activeRoutine,
      activityId,
    );
    const activity = activeRoutine.activities[activityIndex];
    activity.timeRanges = this.playedRoutineService.finishLastTimeRange(
      activity,
    );

    activity.status = STATUS_PLAYED_ACTIVITY.PAUSED;
    activity.hasBeenPaused = true;
    activeRoutine.status = STATUS_PLAYED_ROUTINE.PAUSED;

    return await this.playedRoutineService.update(
      activeRoutine._id,
      activeRoutine,
    );
  }
  async skipActivity(
    activeRoutine: PlayedRoutine,
    activityId,
  ): Promise<PlayedRoutine> {
    const activityIndex = this.playedRoutineService.getIndexOfActivity(
      activeRoutine,
      activityId,
    );
    if (activityIndex === activeRoutine.activities.length - 1)
      throw new BadRequestException(`Last activity can not be pushed.`);
    console.log('activityIndex', activityIndex);
    const activity = activeRoutine.activities[activityIndex];

    activity.timeRanges = this.playedRoutineService.finishLastTimeRange(
      activity,
    );

    activity.status = STATUS_PLAYED_ACTIVITY.SKIPPED;
    activity.hasBeenSkipped = true;

    activeRoutine.status = STATUS_PLAYED_ROUTINE.ACTIVE;

    const nextActivity = activeRoutine.activities[activityIndex + 1];
    nextActivity.status = STATUS_PLAYED_ACTIVITY.ACTIVE;

    nextActivity.timeRanges = this.playedRoutineService.activityCreateNewTimeRange(
      nextActivity,
    );

    //order the activities in ascending order based on value of ordering field and remove the skipped activity
    activeRoutine.activities = orderBy(
      activeRoutine.activities.filter(
        e => e._id.toString() != activityId.toString(),
      ),
      'ordering',
    );

    activeRoutine.activities.splice(activityIndex + 1, 0, activity); //add the skipped activity, next to currently active activity

    //assign value to ordering field based on activity location in the array, it actually resets the ordering values, keeping in account the skipped activity new location
    activeRoutine.activities = map(
      activeRoutine.activities,
      (activity, index) => {
        activity.ordering = index;
        return activity;
      },
    );

    return await this.playedRoutineService.update(
      activeRoutine._id,
      activeRoutine,
    );
  }

  async cancelActivity(
    activeRoutine: PlayedRoutine,
    activityId,
  ): Promise<PlayedRoutine> {
    const activityIndex = this.playedRoutineService.getIndexOfActivity(
      activeRoutine,
      activityId,
    );
    console.log('activityIndex', activityIndex);
    const activity = activeRoutine.activities[activityIndex];

    activity.timeRanges = this.playedRoutineService.finishLastTimeRange(
      activity,
    );
    console.log('activityIndex', activity.timeRanges);
    activity.status = STATUS_PLAYED_ACTIVITY.CANCELED;

    //If last activity complete routine
    if (activityIndex == activeRoutine.activities.length - 1) {
      return await this.playedRoutineService.finishRoutine(activeRoutine);
    } else {
      activeRoutine.status = STATUS_PLAYED_ROUTINE.ACTIVE;
      const nextActivity = activeRoutine.activities[activityIndex + 1];
      nextActivity.status = STATUS_PLAYED_ACTIVITY.ACTIVE;
      nextActivity.timeRanges = this.playedRoutineService.activityCreateNewTimeRange(
        nextActivity,
      );
    }
    return await this.playedRoutineService.update(
      activeRoutine._id,
      activeRoutine,
    );
  }
  async completeActivity(
    activeRoutine: PlayedRoutine,
    activityId,
  ): Promise<PlayedRoutine> {
    const activityIndex = this.playedRoutineService.getIndexOfActivity(
      activeRoutine,
      activityId,
    );
    const activity = activeRoutine.activities[activityIndex];
    activity.timeRanges = this.playedRoutineService.finishLastTimeRange(
      activity,
    );

    activity.status = STATUS_PLAYED_ACTIVITY.COMPLETED;
    //If last activity complete routine
    if (activityIndex == activeRoutine.activities.length - 1) {
      return await this.playedRoutineService.finishRoutine(activeRoutine);
    } else {
      activeRoutine.status = STATUS_PLAYED_ROUTINE.ACTIVE;
      //start next activity
      const nextActivity = activeRoutine.activities[activityIndex + 1];
      nextActivity.status = STATUS_PLAYED_ACTIVITY.ACTIVE;

      nextActivity.timeRanges = this.playedRoutineService.activityCreateNewTimeRange(
        nextActivity,
      );
    }

    return await this.playedRoutineService.update(
      activeRoutine._id,
      activeRoutine,
    );
  }

  async stopActivity(
    activeRoutine: PlayedRoutine,
    activityId,
  ): Promise<PlayedRoutine> {
    const activityIndex = this.playedRoutineService.getIndexOfActivity(
      activeRoutine,
      activityId,
    );
    const activity = activeRoutine.activities[activityIndex];
    activity.timeRanges = this.playedRoutineService.finishLastTimeRange(
      activity,
    );

    activity.status = STATUS_PLAYED_ACTIVITY.STOPPED;
    activeRoutine.status = STATUS_PLAYED_ROUTINE.STOPPED;

    console.log(activity._id, activity.status);
    return await this.playedRoutineService.update(
      activeRoutine._id,
      activeRoutine,
    );
  }

  async addOneMinToActivity(activeRoutine: PlayedRoutine, activityId) {
    const activityIndex = this.playedRoutineService.getIndexOfActivity(
      activeRoutine,
      activityId,
    );
    const activity = activeRoutine.activities[activityIndex];
    activity.maxCompletionTime += 1;

    return await this.playedRoutineService.update(
      activeRoutine._id,
      activeRoutine,
    );
  }

  async startActivityNow(activeRoutine: PlayedRoutine, toBeStartedActivityId) {
    //skip current activity and start activity which id is given in request. If the activity is extreme next just call skip.

    const toBeStartedActivity = activeRoutine.activities.find(
      activity => activity._id.toString() == toBeStartedActivityId.toString(),
    );
    if (!toBeStartedActivity)
      throw new BadRequestException(
        `Activity with id ${toBeStartedActivityId} not found.`,
      );
    const toBeStartedActivityIndex = activeRoutine.activities.indexOf(
      toBeStartedActivity,
    );
    //verify if the operation is permissible for the activity
    this.checkActivityStatus(toBeStartedActivity);

    //related to the currently active activity
    const currentlyActiveActivity = activeRoutine.activities.find(
      activity => activity.status == STATUS_PLAYED_ACTIVITY.ACTIVE,
    );
    if (!currentlyActiveActivity)
      throw new BadRequestException('No active activity found');

    const currentlyActiveActivityIndex = activeRoutine.activities.findIndex(
      activity => activity.status == STATUS_PLAYED_ACTIVITY.ACTIVE,
    );

    currentlyActiveActivity.timeRanges = this.playedRoutineService.finishLastTimeRange(
      currentlyActiveActivity,
    );

    currentlyActiveActivity.status = STATUS_PLAYED_ACTIVITY.SKIPPED;
    currentlyActiveActivity.hasBeenSkipped = true;
    currentlyActiveActivity.ordering = currentlyActiveActivityIndex + 1;

    //related to the to be started activity
    toBeStartedActivity.status = STATUS_PLAYED_ACTIVITY.ACTIVE;
    toBeStartedActivity.timeRanges = this.playedRoutineService.activityCreateNewTimeRange(
      toBeStartedActivity,
    );
    toBeStartedActivity.ordering = currentlyActiveActivityIndex;
    //place the to be started activity at position of the currently active activity
    activeRoutine.activities[
      currentlyActiveActivityIndex
    ] = toBeStartedActivity;

    //move the currently active activity to the next position;
    const currentlyNextActivityIndex = currentlyActiveActivityIndex + 1;
    const currentlyNextActivity =
      activeRoutine.activities[currentlyNextActivityIndex];

    activeRoutine.activities[
      currentlyNextActivityIndex
    ] = currentlyActiveActivity;

    //move rest of the activities one step down
    let movingBubble = currentlyNextActivity;
    for (
      let i = currentlyNextActivityIndex + 1;
      i < toBeStartedActivityIndex + 1;
      i++
    ) {
      const temp = activeRoutine.activities[i];
      activeRoutine.activities[i] = movingBubble;
      activeRoutine.activities[i].ordering = i;
      movingBubble = temp;
    }

    return await this.playedRoutineService.update(
      activeRoutine._id,
      activeRoutine,
    );
  }

  async startActivityNext(activeRoutine: PlayedRoutine, toBeNextActivityId) {
    //swap order of activity which is next to currently playing queue with the activity id is given in request. if the activity is already extreme next do nothing.

    //get the activity details
    const toBeNextActivity = activeRoutine.activities.find(
      activity => activity._id.toString() === toBeNextActivityId.toString(),
    );
    if (!toBeNextActivity)
      throw new BadRequestException(
        `Activity with id ${toBeNextActivityId} not found.`,
      );
    const toBeNextActivityIndex = activeRoutine.activities.indexOf(
      toBeNextActivity,
    );

    //verify if the operation is permissible for the activity
    this.checkActivityStatus(toBeNextActivity);

    //get the currently active activity
    const currentlyActiveActivity = activeRoutine.activities.find(
      activity => activity.status == STATUS_PLAYED_ACTIVITY.ACTIVE,
    );
    if (!currentlyActiveActivity)
      throw new BadRequestException('No active activity found');

    //get activity index next to the currently active activity
    const currentlyNextActivityIndex =
      activeRoutine.activities.findIndex(
        activity =>
          activity._id.toString() === currentlyActiveActivity._id.toString(),
      ) + 1;
    if (toBeNextActivityIndex == currentlyNextActivityIndex) {
      //no need to swap
      return activeRoutine;
    }
    const currentlyNextActivity =
      activeRoutine.activities[currentlyNextActivityIndex];

    //placed the toBeNextActivity in the location of next activity of currently active activity
    toBeNextActivity.ordering = currentlyNextActivityIndex;
    activeRoutine.activities[currentlyNextActivityIndex] = toBeNextActivity;

    //move rest of the activities one step down
    let movingBubble = currentlyNextActivity;
    for (
      let i = currentlyNextActivityIndex + 1;
      i < toBeNextActivityIndex + 1;
      i++
    ) {
      const temp = activeRoutine.activities[i];
      activeRoutine.activities[i] = movingBubble;
      activeRoutine.activities[i].ordering = i;
      movingBubble = temp;
    }

    return await this.playedRoutineService.update(
      activeRoutine._id,
      activeRoutine,
    );
  }

  async skipActivityInAdvance(
    activeRoutine: PlayedRoutine,
    toBeRemovedActivityId,
  ): Promise<PlayedRoutine> {
    //get the activity details
    const toBeRemovedActivity = activeRoutine.activities.find(activity => {
      if (activity._id.toString() === toBeRemovedActivityId.toString()) {
        return activity;
      }
    });
    if (!toBeRemovedActivity)
      throw new BadRequestException(
        `Activity with id ${toBeRemovedActivityId} not found.`,
      );
    //verify if the activity is permissable to be removed
    this.checkActivityStatus(toBeRemovedActivity);

    activeRoutine.activities = activeRoutine.activities
      //remove the activity from the list
      .filter(activity => {
        if (activity._id.toString() !== toBeRemovedActivityId.toString()) {
          return activity;
        }
      })
      //and update ordering of the remaining activities
      .map((activity, index) => {
        activity.ordering = index;
        return activity;
      });

    return await this.playedRoutineService.update(
      activeRoutine._id,
      activeRoutine,
    );
  }
  private checkActivityStatus(activity) {
    if (!activity) {
      throw new Error('Activity not found');
    }
    if (
      !(
        activity.status == STATUS_PLAYED_ACTIVITY.NOT_STARTED ||
        activity.status == STATUS_PLAYED_ACTIVITY.SKIPPED
      )
    ) {
      throw new BadRequestException(
        `Only allowed for activities with status NOT_STARTED or SKIPPED.`,
      );
    }
  }
}
