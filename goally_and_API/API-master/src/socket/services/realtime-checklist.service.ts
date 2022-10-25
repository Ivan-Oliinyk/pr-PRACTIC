import { BadRequestException, Injectable } from '@nestjs/common';
import { ClientsService } from 'src/entities/clients/clients.service';
import { CompletedChecklistsService } from 'src/entities/completed-checklists/completed-checklists.service';
import {
  STATUS_PLAYED_ACTIVITY,
  STATUS_PLAYED_CHECKLIST,
} from 'src/entities/completed-checklists/const';
import { CompletedChecklist } from 'src/entities/completed-checklists/schema/completed-checklist.schema';
import { DevicesService } from 'src/entities/devices/devices.service';
import { UsersService } from 'src/entities/users/users.service';

@Injectable()
export class RealTimeChecklistService {
  constructor(
    private deviceService: DevicesService,
    private cs: ClientsService,

    private us: UsersService,
    private ccs: CompletedChecklistsService,
  ) {}
  async startChecklistAfterWelcomeScreen(
    activeChecklist: CompletedChecklist,
  ): Promise<CompletedChecklist> {
    if (
      activeChecklist.status !== STATUS_PLAYED_CHECKLIST.SHOW_WELCOME_SCREEN
    ) {
      throw new Error(`You can run checklist only after welcome screen`);
    }
    activeChecklist.activities[0].status = STATUS_PLAYED_ACTIVITY.ACTIVE;
    activeChecklist.status = STATUS_PLAYED_CHECKLIST.ACTIVE;
    return await this.ccs.update(activeChecklist._id, activeChecklist);
  }
  async completeActivity(
    activeChecklist: CompletedChecklist,
    activityId,
  ): Promise<CompletedChecklist> {
    const activity = activeChecklist.activities.find(
      activity => activity._id.toString() === activityId.toString(),
    );
    if (!activity)
      throw new Error(
        `activity ${activityId} does not exist in checklist ${activeChecklist._id}`,
      );

    activity.status = STATUS_PLAYED_ACTIVITY.COMPLETED;

    const notCompletedActivity = activeChecklist.activities.find(
      activity => activity.status != STATUS_PLAYED_CHECKLIST.COMPLETED,
    );
    //If all activities completed then finish checklist
    if (!notCompletedActivity) {
      return await this.ccs.finishChecklist(activeChecklist);
    } else {
      activeChecklist.status = STATUS_PLAYED_CHECKLIST.ACTIVE;
      //start next non completed activity
      notCompletedActivity.status = STATUS_PLAYED_ACTIVITY.ACTIVE;
    }
    return await this.ccs.update(activeChecklist._id, activeChecklist);
  }

  async stopChecklist(
    activeRoutine: CompletedChecklist,
  ): Promise<CompletedChecklist> {
    activeRoutine.status = STATUS_PLAYED_CHECKLIST.STOPPED;
    return await this.ccs.update(activeRoutine._id, activeRoutine);
  }

  async startActivityNext(
    activeChecklist: CompletedChecklist,
    toBeNextActivityId,
  ) {
    const toBeNextActivity = activeChecklist.activities.find(
      activity => activity._id.toString() === toBeNextActivityId.toString(),
    );
    if (!toBeNextActivity)
      throw new BadRequestException(
        `Activity with id ${toBeNextActivityId} not found.`,
      );
    const toBeNextActivityIndex = activeChecklist.activities.indexOf(
      toBeNextActivity,
    );

    //verify if the operation is permissible for the activity
    this.checkActivityStatus(toBeNextActivity);

    //get the currently active activity
    const currentlyActiveActivity = activeChecklist.activities.find(
      activity => activity.status == STATUS_PLAYED_ACTIVITY.ACTIVE,
    );
    if (!currentlyActiveActivity)
      throw new BadRequestException('No active activity found');

    //get activity index next to the currently active activity
    const currentlyNextActivityIndex =
      activeChecklist.activities.findIndex(
        activity =>
          activity._id.toString() === currentlyActiveActivity._id.toString(),
      ) + 1;
    if (toBeNextActivityIndex == currentlyNextActivityIndex) {
      //no need to swap
      return activeChecklist;
    }
    const currentlyNextActivity =
      activeChecklist.activities[currentlyNextActivityIndex];

    //placed the toBeNextActivity in the location of next activity of currently active activity
    toBeNextActivity.ordering = currentlyNextActivityIndex;
    activeChecklist.activities[currentlyNextActivityIndex] = toBeNextActivity;

    //move rest of the activities one step down
    let movingBubble = currentlyNextActivity;
    for (
      let i = currentlyNextActivityIndex + 1;
      i < toBeNextActivityIndex + 1;
      i++
    ) {
      const temp = activeChecklist.activities[i];
      activeChecklist.activities[i] = movingBubble;
      activeChecklist.activities[i].ordering = i;
      movingBubble = temp;
    }

    return await this.ccs.update(activeChecklist._id, activeChecklist);
  }

  private checkActivityStatus(activity) {
    if (!activity) {
      throw new Error('Activity not found');
    }
    if (activity.status !== STATUS_PLAYED_ACTIVITY.NOT_STARTED) {
      throw new BadRequestException(
        `Only allowed for activities with status NOT_STARTED`,
      );
    }
  }
}
