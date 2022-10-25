import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as BB from 'bluebird';
import * as moment from 'moment';
import { Model, Types } from 'mongoose';
import { InjectEventEmitter } from 'nest-emitter';
import { GoallyEventEmitter } from 'src/shared/events/const';
import { BehaviorService } from '../behavior/behavior.service';
import { ClientsService } from '../clients/clients.service';
import { User } from '../users/schema';
import { CreateRecordedBehavior } from './dto/CreateRecordedBehavior.dto';
import { RecordBehavior } from './dto/RecordBehaviorDto';
import { RecordedBehavior } from './schema/recorded-behavior.schema';

@Injectable()
export class RecordedBehaviorsService {
  constructor(
    @InjectModel(RecordedBehavior.name)
    private RecordedBehaviorModel: Model<RecordedBehavior>,
    private cs: ClientsService,
    private bs: BehaviorService,
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
  ) {}

  async create(createBehaviorData: CreateRecordedBehavior, user: User) {
    const clientId = (user.clients as Types.ObjectId[]).find(
      e => e == createBehaviorData.clientId,
    );
    if (!clientId)
      throw new NotFoundException(
        `Client ${createBehaviorData.clientId} not found `,
      );
    const [client, behavior] = await Promise.all([
      this.cs.findById(clientId),
      this.bs.findById(createBehaviorData.behaviorId),
    ]);
    if (!behavior)
      throw new NotFoundException(
        `behavior ${createBehaviorData.behaviorId} not found `,
      );
    if (client.points + behavior.points < 0)
      throw new BadRequestException(
        `Sorry you don't have enough points :( ${client.points}`,
      );
    const recordedBehavior = {
      clientId: client._id,
      behaviorId: behavior._id,
      name: behavior.name,
      usedPoints: behavior.points,
      createdBy: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    const points = client.points + recordedBehavior.usedPoints;

    await this.cs.update(
      clientId,
      {
        points,
      },
      null,
    );

    const recorded = new this.RecordedBehaviorModel(recordedBehavior);
    const recordedFromDb = await recorded.save();

    return { ...recordedFromDb.toObject(), newBalance: points };
  }

  async record(createBehaviorData: RecordBehavior, user: User) {
    const [client, behavior] = await Promise.all([
      this.cs.findById(createBehaviorData.clientId),
      this.bs.findById(createBehaviorData.behaviorId),
    ]);

    if (!behavior)
      throw new NotFoundException(
        `behavior ${createBehaviorData.behaviorId} not found `,
      );
    const recordedBehavior = {
      clientId: client._id,
      behaviorId: behavior._id,
      name: behavior.name,
      usedPoints: behavior.points,
      createdBy: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    let points = client.points + recordedBehavior.usedPoints;
    if (points < 0) points = 0;

    await this.cs.update(
      client._id,
      {
        points,
      },
      null,
    );

    const recorded = new this.RecordedBehaviorModel(recordedBehavior);
    const recordedFromDb = await recorded.save();
    this.emitter.emit('RecordedBehaviorCreated', recordedFromDb);
    return { ...recordedFromDb.toObject(), newBalance: points };
  }

  async deleteById(recordedBehaviorId: Types.ObjectId, user: User) {
    const recordedBehavior = await this.RecordedBehaviorModel.findById(
      recordedBehaviorId,
    );

    if (!recordedBehavior)
      throw new NotFoundException(
        `Recorded behavior with id ${recordedBehaviorId} not found`,
      );
    const clientId = (user.clients as Types.ObjectId[]).find(e =>
      recordedBehavior.clientId.equals(e),
    );
    if (!clientId) throw new NotFoundException(`You cant do that`);

    const client = await this.cs.findById(recordedBehavior.clientId);
    if (client.points < recordedBehavior.usedPoints)
      throw new BadRequestException(
        `Sorry you don't have enough points :( ${client.points}`,
      );
    const points = client.points - recordedBehavior.usedPoints;
    await this.cs.update(client._id, { points }, null);

    await recordedBehavior.remove();
    this.emitter.emit('RecordedBehaviorRemoved', recordedBehavior);
    return { newBalance: points };
  }
  async getChildRecordedBehavior(
    clientId: Types.ObjectId,
    user: User,
    daysBefore: number,
  ) {
    const dateBefore = moment().subtract(daysBefore, 'days');
    const behaviors = await this.RecordedBehaviorModel.find({
      clientId,
      createdAt: {
        $gte: dateBefore.toDate(),
      },
    }).sort('-createdAt');
    return behaviors;
  }

  async getAllRecordedBehaviors(user: User, daysBefore: number) {
    const clients = await BB.map(user.clients, this.cs.findById);
    const behaviorsByClients = await BB.map(clients, async client => {
      const behaviorsHistory = await this.getChildRecordedBehavior(
        client._id,
        user,
        daysBefore,
      );
      return { client, behaviorsHistory };
    });
    return behaviorsByClients;
  }

  async getRecordedBehaviorsReports(
    clientId: Types.ObjectId,
    from: string,
    to: string,
  ) {
    const fromMoment = moment(from);
    const toMoment = moment(to)
      .set('hour', 23)
      .set('minute', 59);
    const filter = {
      clientId,
      createdAt: {
        $gte: fromMoment.toDate(),
        $lte: toMoment.toDate(),
      },
    };
    const behaviors = await this.RecordedBehaviorModel.aggregate([
      { $match: filter },
      {
        $project: {
          behaviorId: '$behaviorId',
          types: {
            $cond: [{ $gte: ['$usedPoints', 0] }, 'Desired', 'Undesired'],
          },
          name: '$name',
        },
      },
      {
        $group: {
          _id: '$behaviorId',
          name: { $addToSet: '$name' },
          types: { $addToSet: '$types' },
          frequency: { $sum: 1 },
        },
      },
      { $sort: { frequency: -1, _id: -1 } },
    ]);
    return behaviors;
  }
  async getRecordedBehaviorReportChart(
    clientId: Types.ObjectId,
    behaviorId: Types.ObjectId,
    from: string,
    to: string,
  ) {
    const fromMoment = moment(from);
    const toMoment = moment(to)
      .set('hour', 23)
      .set('minute', 59);
    const filter = {
      clientId,
      behaviorId,
      createdAt: {
        $gte: fromMoment.toDate(),
        $lte: toMoment.toDate(),
      },
    };
    const behaviors = await this.RecordedBehaviorModel.aggregate([
      { $match: filter },
      {
        $project: {
          yearMonthDay: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          name: '$name',
        },
      },
      {
        $group: {
          _id: '$yearMonthDay',
          name: { $addToSet: '$name' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const behaviorNames = await this.RecordedBehaviorModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$behaviorId',
          name: { $addToSet: '$name' },
        },
      },
    ]);
    return { behaviorNames, behaviors };
  }
}
