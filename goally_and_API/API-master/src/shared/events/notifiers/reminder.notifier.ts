import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectEventEmitter } from 'nest-emitter';
import { CompletedReminder } from 'src/entities/completed-reminders/schema/completed-reminder.schema';
import { Reminder } from 'src/entities/reminders/schema/reminder.schema';
import { REMINDER_NOTIFICATIONS } from 'src/socket/const';
import { SocketBase } from 'src/socket/socket-base.gateway';
import { GoallyEventEmitter } from '../const';
@Injectable()
export class ReminderNotifier implements OnModuleInit {
  constructor(
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
    private baseSocket: SocketBase,
  ) {}

  onModuleInit() {
    this.emitter.on(
      'ReminderCreated',
      async reminder => await this.onReminderCreated(reminder),
    );
    this.emitter.on(
      'ReminderCreatedForTheChild',
      async reminder => await this.onReminderCreatedForTheChild(reminder),
    );
    this.emitter.on(
      'ReminderUpdated',
      async reminder => await this.onReminderUpdated(reminder),
    );
    this.emitter.on(
      'ReminderDeleted',
      async reminder => await this.onReminderDeleted(reminder),
    );

    this.emitter.on(
      'ReminderHistoryRemoved',
      async reminder => await this.onCompletedReminderRemoved(reminder),
    );

    this.emitter.on(
      'ReminderHistoryCreated',
      async reminder => await this.onCompletedReminderCreated(reminder),
    );

    this.emitter.on(
      'ReminderReordered',
      async reminder => await this.reminderLibraryChanged(reminder),
    );
  }
  onCompletedReminderCreated(reminder) {
    this.onCompletedReminderChanged(reminder, 'CREATED');
  }
  onCompletedReminderRemoved(reminder) {
    this.onCompletedReminderChanged(reminder, 'REMOVED');
  }

  private async onReminderCreated(reminder) {
    this.onReminderLibraryChanged(reminder, 'CREATED');
  }

  private async onReminderCreatedForTheChild(reminder) {
    this.onReminderLibraryChanged(reminder, 'CREATED');
  }

  private async onReminderUpdated(reminder) {
    this.onReminderLibraryChanged(reminder, 'UPDATED');
  }

  private async onReminderDeleted(reminder) {
    this.onReminderLibraryChanged(reminder, 'DELETED');
  }
  async reminderLibraryChanged(reminder) {
    this.onReminderLibraryChanged(reminder, 'REORDERED');
  }
  onReminderLibraryChanged(reminder: Reminder, action) {
    const body = {
      reminderId: reminder._id,
      clientId: reminder.clientId,
      action,
      reminder,
    };
    if (reminder.clientId) {
      this.baseSocket.notifyAllParentsAndDeviceByClientId(
        reminder.clientId,
        REMINDER_NOTIFICATIONS.CHILD_LIBRARY_CHANGED,
        body,
      );
    } else {
      this.baseSocket.sendToAllUserConnectedSession(
        reminder.createdBy,
        REMINDER_NOTIFICATIONS.PARENT_LIBRARY_CHANGED,
        body,
      );
    }
  }
  onCompletedReminderChanged(reminder: CompletedReminder, action) {
    const body = {
      reminderId: reminder._id,
      clientId: reminder.clientId,
      action,
      reminder,
    };
    this.baseSocket.notifyAllParentsAndDeviceByClientId(
      reminder.clientId,
      REMINDER_NOTIFICATIONS.REMINDER_HISTORY_CHANGED,
      body,
    );
  }
}
