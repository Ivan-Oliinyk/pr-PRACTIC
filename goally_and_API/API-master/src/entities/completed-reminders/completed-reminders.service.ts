import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as BB from 'bluebird';
import { omit } from 'lodash';
import * as moment from 'moment';
import { Model, Types } from 'mongoose';
import { InjectEventEmitter } from 'nest-emitter';
import { GoallyEventEmitter } from 'src/shared/events/const';
import { ClientsService } from '../clients/clients.service';
import { Device } from '../devices/schemas';
import { RemindersService } from '../reminders/reminders.service';
import { User } from '../users/schema';
import { CompleteReminderDto } from './dto/CompleteReminder.dto';
import { CompletedReminder } from './schema/completed-reminder.schema';

@Injectable()
export class CompletedRemindersService {
  constructor(
    @InjectModel(CompletedReminder.name)
    private CompletedReminderModel: Model<CompletedReminder>,
    private cs: ClientsService,
    private rs: RemindersService,
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
  ) {}

  async markCompleted(reminderId: Types.ObjectId, user?: User) {
    const reminder = await this.rs.findById(reminderId).lean();
    if (!reminder)
      throw new NotFoundException(`reminder with ${reminderId} not found `);

    const newReminder = omit(
      {
        ...reminder,
      },
      '_id',
      'createdAt',
      'updatedAt',
    );

    const completedReminder = new this.CompletedReminderModel(newReminder);
    const completedReminderFromDb = await completedReminder.save();
    this.emitter.emit('ReminderHistoryCreated', completedReminderFromDb);
    return { ...completedReminderFromDb.toObject() };
  }
  childCompletedReminderByDeviceId(data: CompleteReminderDto, device: Device) {
    return this.markCompleted(data.reminderId, null);
  }

  async deleteById(completedReminderId: Types.ObjectId, user: User) {
    const completedReminder = await this.CompletedReminderModel.findById(
      completedReminderId,
    );

    if (!completedReminder)
      throw new NotFoundException(
        `Completed Reminder with id ${completedReminderId} not found`,
      );

    await completedReminder.remove();
    this.emitter.emit('ReminderHistoryRemoved', completedReminder);
    return completedReminder;
  }

  async getChildCompletedReminders(
    clientId: Types.ObjectId,
    user: User,
    daysBefore: number,
  ) {
    const dateBefore = moment().subtract(daysBefore, 'days');
    const client = await this.cs.findById(clientId);
    if (!client) throw new NotFoundException(`Client not found ${clientId}`);

    const completedReminders = await this.CompletedReminderModel.find({
      clientId,
      createdAt: {
        $gte: dateBefore.toDate(),
      },
    }).sort('-createdAt');
    return completedReminders;
  }

  async getAllCompletedReminders(user: User, daysBefore: number) {
    const clients = await BB.map(user.clients, this.cs.findById);
    const remindersByClients = await BB.map(clients, async client => {
      const remindersHistory = await this.getChildCompletedReminders(
        client._id,
        user,
        daysBefore,
      );
      return { client, remindersHistory };
    });
    return remindersByClients;
  }
}
