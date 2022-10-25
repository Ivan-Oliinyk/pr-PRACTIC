import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as BB from 'bluebird';
import { isEmpty, omit } from 'lodash';
import { Model, Types } from 'mongoose';
import { InjectEventEmitter } from 'nest-emitter';
import { User } from 'src/entities/users/schema';
import { UsersService } from 'src/entities/users/users.service';
import { LIBRARY_TYPES } from 'src/shared/const';
import { REMINDER_SOUNDS } from 'src/shared/const/reminder-sounds';
import { REORDERING_ACTION } from 'src/shared/const/reordering.action';
import { GoallyEventEmitter } from 'src/shared/events/const';
import { ClientsService } from '../clients/clients.service';
import { CreateChildReminderDto } from './dto/CreateChildReminder.dto';
import { CreateReminderDto } from './dto/CreateReminder.dto';
import { ReorderReminder } from './dto/ReorderReminder';
import { UpdateReminderDto } from './dto/UpdateReminder.dto';
import { Reminder } from './schema/reminder.schema';

@Injectable()
export class RemindersService {
  constructor(
    @InjectModel(Reminder.name) private ReminderModel: Model<Reminder>,
    private us: UsersService,
    @Inject(forwardRef(() => ClientsService))
    private cs: ClientsService,
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
  ) {}

  findById = reminderId => {
    return this.ReminderModel.findById(reminderId);
  };

  async create(reminderData: CreateReminderDto, user: User) {
    const reminder = new this.ReminderModel(reminderData);
    reminder.createdBy = user._id;
    reminder.libraryType = LIBRARY_TYPES.ADULT;
    reminder.ordering = 0;
    const key = 'minutesBefore';
    const uniqNotifications = [
      ...new Map(
        reminderData.notifications.map(item => [item[key], item]),
      ).values(),
    ];

    if (new Set(uniqNotifications).size !== reminderData.notifications.length)
      throw new BadRequestException(
        `reminder notifications minutes before must have unique elements`,
      );

    await this.ReminderModel.updateMany(
      {
        ordering: { $gte: reminder.ordering },
        createdBy: reminder.createdBy,
        libraryType: LIBRARY_TYPES.ADULT,
      },
      { $inc: { ordering: 1 } },
    );
    const savedReminder = await reminder.save();
    this.emitter.emit('ReminderCreated', savedReminder);
    return savedReminder;
  }
  async createForChild(reminderData: CreateChildReminderDto, user: User) {
    const parentReminder = await this.ReminderModel.findById(
      reminderData.parentReminderId,
    ).lean();
    if (!parentReminder)
      throw new NotFoundException(
        `Reminder with id ${reminderData.parentReminderId} not found `,
      );

    //if devices are not provided, use all the client devices
    if (isEmpty(parentReminder.devices)) {
      const devices = (
        await this.cs.getAllDevicesByClientId(reminderData.clientId)
      ).map(e => e._id);
      parentReminder.devices = devices;
    }

    const newReward = omit(
      {
        ...parentReminder,
        ...reminderData,
        createdBy: user._id,
        clientId: reminderData.clientId,
        libraryType: LIBRARY_TYPES.CHILD,
        ordering: 0,
        ctaOrdering: 0,
      },
      '_id',
      'createdAt',
      'updatedAt',
    );

    const reminder = new this.ReminderModel(newReward);

    await this.ReminderModel.updateMany(
      { ordering: { $gte: reminder.ordering }, clientId: reminder.clientId },
      { $inc: { ordering: 1 } },
    );
    if (reminder.libraryType == LIBRARY_TYPES.CHILD && reminder.clientId) {
      await this.cs.updateAllCtaOrderings(
        1,
        reminder.ctaOrdering,
        reminder.clientId,
      );
    }
    const savedReminder = await reminder.save();
    this.emitter.emit('ReminderCreatedForTheChild', savedReminder);
    return savedReminder;
  }

  async reorderChildLibrary(data: ReorderReminder) {
    const reminder = await this.ReminderModel.findById(data.reminderId);
    if (!reminder)
      throw new NotFoundException(`reward ${data.reminderId},  not found`);
    const reminderCount = await this.ReminderModel.count({
      clientId: reminder.clientId,
    });

    if (data.action == REORDERING_ACTION.DOWN) {
      if (reminder.ordering == reminderCount - 1) {
        await this.ReminderModel.updateMany(
          { ordering: { $gte: 0 }, clientId: reminder.clientId },
          { $inc: { ordering: 1 } },
        );
        reminder.ordering = 0;
      } else {
        reminder.ordering += 1;

        await this.ReminderModel.findOneAndUpdate(
          { ordering: reminder.ordering, clientId: reminder.clientId },
          { $inc: { ordering: -1 } },
        );
      }
    } else {
      if (reminder.ordering == 0) {
        await this.ReminderModel.updateMany(
          { ordering: { $lte: reminderCount }, clientId: reminder.clientId },
          { $inc: { ordering: -1 } },
        );
        reminder.ordering = reminderCount - 1;
      } else {
        reminder.ordering -= 1;
        await this.ReminderModel.findOneAndUpdate(
          { ordering: reminder.ordering, clientId: reminder.clientId },
          { $inc: { ordering: 1 } },
        );
      }
    }

    const savedReminder = await reminder.save();
    this.emitter.emit('ReminderReordered', savedReminder);
    return savedReminder;
  }

  async getUserReminders(user: User) {
    return this.ReminderModel.find({
      createdBy: user._id,
      libraryType: LIBRARY_TYPES.ADULT,
    }).sort('ordering');
  }
  async getUserRemindersForChild(clientId: Types.ObjectId) {
    const client = await this.cs.findById(clientId);
    const reminders = this.findClientReminder(client._id);
    return reminders;
  }

  async getById(reminderId: Types.ObjectId): Promise<Reminder> {
    const reminder = await this.ReminderModel.findById(reminderId);
    if (!reminder)
      throw new NotFoundException(`reminder with id ${reminderId} not found`);

    return reminder;
  }
  async update(
    reminderId: Types.ObjectId,
    reminderData: UpdateReminderDto,
    user: User,
  ) {
    const reminder = await this.getById(reminderId);
    const updatedReminder = await this.ReminderModel.findByIdAndUpdate(
      reminder._id,
      reminderData,
      {
        new: true,
      },
    );
    this.emitter.emit('ReminderUpdated', updatedReminder);
    return updatedReminder;
  }
  async delete(reminderId: Types.ObjectId, user: User) {
    const reminder = await this.getById(reminderId);
    await reminder.remove();
    const query = reminder.clientId
      ? { ordering: { $gte: reminder.ordering }, clientId: reminder.clientId }
      : {
          ordering: { $gte: reminder.ordering },
          createdBy: reminder.createdBy,
          libraryType: LIBRARY_TYPES.ADULT,
        };
    if (reminder.libraryType == LIBRARY_TYPES.CHILD && reminder.clientId) {
      await this.cs.updateAllCtaOrderings(
        -1,
        reminder.ctaOrdering,
        reminder.clientId,
      );
    }
    await this.ReminderModel.updateMany(query, { $inc: { ordering: -1 } });
    this.emitter.emit('ReminderDeleted', reminder);
    return;
  }

  async findClientReminder(clientId): Promise<Reminder[]> {
    const reminders = await this.ReminderModel.find({
      clientId,
      libraryType: LIBRARY_TYPES.CHILD,
    }).sort('ordering');
    return reminders;
  }

  //MOBILE
  async getClientRemindersByDeviceId(deviceId: Types.ObjectId) {
    const client = await this.cs.getClientByDevice(deviceId);
    if (!client)
      throw new BadRequestException('Child not connected to that device');
    const reminders = await this.findClientReminder(client._id);

    return reminders;
  }
  async getClientReminderByDeviceAndId(
    deviceId: Types.ObjectId,
    reminderId: Types.ObjectId,
  ) {
    const client = await this.cs.getClientByDevice(deviceId);
    if (!client)
      throw new BadRequestException('Child not connected to that device');
    const reminder = await this.ReminderModel.findOne({
      clientId: client._id,
      _id: reminderId,
    });
    if (!reminder)
      throw new NotFoundException(
        `Reminder with Id ${reminderId} does not exists for this client`,
      );
    return reminder;
  }

  getNotificationSounds() {
    return REMINDER_SOUNDS;
  }

  async getSchedules(clientId: Types.ObjectId) {
    const reminders = await this.ReminderModel.find(
      {
        clientId,
        libraryType: LIBRARY_TYPES.CHILD,
        schedule: { $ne: null },
      },
      {
        _id: 1,
        name: 1,
        schedule: 1,
        duration: 1,
      },
    );
    return reminders;
  }

  async addDevicesFields() {
    const total = await this.ReminderModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await BB.mapSeries(new Array(arrayLength), async (elem, index) => {
        const routines = await this.ReminderModel.find({})
          .limit(series)
          .skip(series * index);
        await BB.mapSeries(routines, async routine => {
          await this.addDevicesField(routine);
        });
      });
      return { success: true };
    } catch (e) {
      return {
        success: false,
        error: e,
      };
    }
  }

  async addDevicesField(reminder: Reminder) {
    if (reminder.libraryType == LIBRARY_TYPES.CHILD && reminder.clientId) {
      const devices = (
        await this.cs.getAllDevicesByClientId(reminder.clientId)
      ).map(e => e._id);
      reminder.devices = devices;
    }
    const savedReminder = await this.ReminderModel.findByIdAndUpdate(
      reminder._id,
      reminder,
      { new: true },
    );
    return savedReminder;
  }

  async addCtaOrderings() {
    const total = await this.ReminderModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await BB.mapSeries(new Array(arrayLength), async (elem, index) => {
        const reminders = await this.ReminderModel.find({})
          .limit(series)
          .skip(series * index);
        await BB.mapSeries(reminders, async reminder => {
          await this.addCtaOrdering(reminder);
        });
      });
      return { success: true };
    } catch (e) {
      return {
        success: false,
        error: e,
      };
    }
  }

  async addCtaOrdering(reminder: Reminder): Promise<Reminder> {
    if (typeof reminder.ordering !== 'number') return reminder;
    reminder.ctaOrdering = reminder.ordering * 3 + 2;
    const updatedReminder = await this.ReminderModel.findByIdAndUpdate(
      reminder._id,
      reminder,
      { new: true },
    );
    return updatedReminder;
  }

  async updateCtaOrdering(
    steps: number,
    updateCtaOrderFrom: number,
    clientId: Types.ObjectId,
  ) {
    const query = {
      libraryType: LIBRARY_TYPES.CHILD,
      clientId,
      ctaOrdering: { $gte: updateCtaOrderFrom },
    };
    await this.ReminderModel.updateMany(query, {
      $inc: { ctaOrdering: steps },
    });
  }

  async updatePartial(_id: Types.ObjectId, reminder: Partial<Reminder>) {
    const updatedReminder = await this.ReminderModel.findByIdAndUpdate(
      _id,
      reminder,
      { new: true },
    );
    return updatedReminder;
  }

  async addDeviceInClientReminders(
    clientId: Types.ObjectId,
    deviceId: Types.ObjectId,
  ) {
    const reminders = await this.ReminderModel.find({ clientId });
    await BB.mapSeries(reminders, async reminder => {
      await this.addDeviceInReminder(reminder._id, deviceId);
    });
  }

  addDeviceInReminder(reminderId: Types.ObjectId, deviceId: Types.ObjectId) {
    return this.ReminderModel.findByIdAndUpdate(
      reminderId,
      {
        $addToSet: { devices: deviceId },
      },
      { new: true },
    );
  }
}
