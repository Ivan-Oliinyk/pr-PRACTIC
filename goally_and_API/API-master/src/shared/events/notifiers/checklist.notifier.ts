import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectEventEmitter } from 'nest-emitter';
import { Checklist } from 'src/entities/checklists/schema/checklist.schema';
import { CompletedChecklist } from 'src/entities/completed-checklists/schema/completed-checklist.schema';
import { CHECKLIST_NOTIFICATIONS } from 'src/socket/const';
import { SocketBase } from 'src/socket/socket-base.gateway';
import { GoallyEventEmitter } from '../const';
@Injectable()
export class ChecklistNotifier implements OnModuleInit {
  constructor(
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
    private baseSocket: SocketBase,
  ) {}

  onModuleInit() {
    this.emitter.on(
      'ChecklistCreated',
      async checklist => await this.onChecklistCreated(checklist),
    );
    this.emitter.on(
      'ChecklistCreatedForTheChild',
      async checklist => await this.onChecklistCreatedForTheChild(checklist),
    );
    this.emitter.on(
      'ChecklistUpdated',
      async checklist => await this.onChecklistUpdated(checklist),
    );
    this.emitter.on(
      'ChecklistDeleted',
      async checklist => await this.onChecklistDeleted(checklist),
    );

    // this.emitter.on(
    //   'ChecklistHistoryRemoved',
    //   async Checklist => await this.onCompletedChecklistRemoved(Checklist),
    // );

    this.emitter.on(
      'ChecklistHistoryCreated',
      async checklist => await this.onCompletedChecklistCreated(checklist),
    );

    this.emitter.on(
      'ChecklistReordered',
      async checklist => await this.ChecklistLibraryChanged(checklist),
    );
  }
  onCompletedChecklistCreated(checklist) {
    this.onCompletedChecklistChanged(checklist, 'CREATED');
  }
  // onCompletedChecklistRemoved(Checklist) {
  //   this.onCompletedChecklistChanged(Checklist, 'REMOVED');
  // }

  private async onChecklistCreated(checklist) {
    this.onChecklistLibraryChanged(checklist, 'CREATED');
  }

  private async onChecklistCreatedForTheChild(checklist) {
    this.onChecklistLibraryChanged(checklist, 'CREATED');
  }

  private async onChecklistUpdated(checklist) {
    this.onChecklistLibraryChanged(checklist, 'UPDATED');
  }

  private async onChecklistDeleted(checklist) {
    this.onChecklistLibraryChanged(checklist, 'DELETED');
  }
  async ChecklistLibraryChanged(checklist) {
    this.onChecklistLibraryChanged(checklist, 'REORDERED');
  }

  onChecklistLibraryChanged(checklist: Checklist, action) {
    const body = {
      checklistId: checklist._id,
      clientId: checklist.clientId,
      action,
      checklist,
    };
    if (checklist.clientId) {
      this.baseSocket.notifyAllParentsAndDeviceByClientId(
        checklist.clientId,
        CHECKLIST_NOTIFICATIONS.CHILD_LIBRARY_CHANGED,
        body,
      );
    } else {
      this.baseSocket.sendToAllUserConnectedSession(
        checklist.createdBy,
        CHECKLIST_NOTIFICATIONS.PARENT_LIBRARY_CHANGED,
        body,
      );
    }
  }
  onCompletedChecklistChanged(checklist: CompletedChecklist, action) {
    const body = {
      checklistId: checklist._id,
      clientId: checklist.clientId,
      action,
      checklist,
    };
    this.baseSocket.notifyAllParentsAndDeviceByClientId(
      checklist.clientId,
      CHECKLIST_NOTIFICATIONS.CHECKLIST_HISTORY_CHANGED,
      body,
    );
  }
}
