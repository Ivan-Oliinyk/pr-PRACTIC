import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CompletedChecklistsService } from '../completed-checklists/completed-checklists.service';
import { CompletedSleepModeService } from '../completed-sleep-mode/completed-sleep-mode.service';
import { InvitationService } from '../invitation/invitation.service';
import { PlayedRoutineService } from '../played-routine/played-routine.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class CronJobsService {
  constructor(
    private prs: PlayedRoutineService,
    private ccs: CompletedChecklistsService,
    private subscription: SubscriptionService,
    private us: UsersService,
    private readonly csms: CompletedSleepModeService,
    private readonly is: InvitationService,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async updateStatus() {
    this.prs.updateRoutinesStatus();
    this.ccs.updateChecklistsStatus();
    this.csms.updateSleepModeStatus();
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async postToShippo() {
    this.subscription.postReferralSubsToShippo();
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async sendCoachingSms() {
    this.us.sendCoachingSms();
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async deleteInviatationsAfter30Days() {
    this.is.deleteInviatationsAfter30Days();
  }
}
