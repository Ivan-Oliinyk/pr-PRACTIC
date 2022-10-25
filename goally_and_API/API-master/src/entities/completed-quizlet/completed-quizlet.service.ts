import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { intersection, isEqual, sortBy } from 'lodash';
import * as moment from 'moment';
import { PaginateModel, Types } from 'mongoose';
import { InjectEventEmitter } from 'nest-emitter';
import { QUIZLET_CORRECT_TYPE } from 'src/shared/const';
import { GoallyEventEmitter } from 'src/shared/events/const';
import { ClientsService } from '../clients/clients.service';
import { Device } from '../devices/schemas';
import { QuizletService } from '../quizlet/quizlet.service';
import { User } from '../users/schema';
import { ChildCompleteQuizlet } from './dto/ChildCompleteQuizlet.dto';
import { CompletedQuizlet } from './schema/completed-quizlet.schema';
import * as BB from 'bluebird';

@Injectable()
export class CompletedQuizletService {
  constructor(
    @InjectModel(CompletedQuizlet.name)
    private CompletedQuizletModel: PaginateModel<CompletedQuizlet>,
    private cs: ClientsService,
    private qs: QuizletService,
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
  ) {}
  async getChildCompletedQuiz(
    clientId: Types.ObjectId,
    user: User,
    daysBefore: number,
  ) {
    const dateBefore = moment().subtract(daysBefore, 'days');
    const completedQuizlets = await this.CompletedQuizletModel.find({
      clientId,
      createdAt: {
        $gte: dateBefore.toDate(),
      },
    }).sort('-createdAt');
    return completedQuizlets;
  }


  async getAllCompletedQuiz(user: User, daysBefore: number) {
    const clients = await BB.map(user.clients, this.cs.findById);
    const completedQuizletsByClients = await BB.map(clients, async client => {
      const completedQuizlets = await this.getChildCompletedQuiz(
        client._id,
        user,
        daysBefore,
      );
      return { client, completedQuizlets };
    });
    return completedQuizletsByClients;
  }

  async complete(data: ChildCompleteQuizlet, device: Device) {
    const quizlet = await this.qs.findById(data.quizletId);
    if (!quizlet)
      throw new BadRequestException(`quizlet not found ${data.quizletId}`);
    if (
      quizlet.isCorrectType === QUIZLET_CORRECT_TYPE.ONE &&
      data.clientAnswers.length > 1
    )
      throw new BadRequestException(
        `quizlet can have only one correct answer `,
      );
    let isCorrect = false;
    const correctAnswers = quizlet.answers
      .filter(e => e.correct)
      .map(e => e._id.toString());
    const clientAnswers = data.clientAnswers.map(e => e.toString());

    if (quizlet.isCorrectType === QUIZLET_CORRECT_TYPE.ONE) {
      isCorrect =
        clientAnswers.length ===
        intersection(clientAnswers, correctAnswers).length;
    } else {
      isCorrect = isEqual(sortBy(correctAnswers), sortBy(clientAnswers));
    }
    //TODO: maybe change to offline
    const preparedQuizlet = {
      question: quizlet.question,
      answers: quizlet.answers,
      clientAnswers: data.clientAnswers,
      clientId: device.client._id,
      quizletId: quizlet._id,
      createdBy: quizlet.createdBy,
      isCorrectType: quizlet.isCorrectType,
      isCorrect,
    };

    quizlet.lastCompleted = new Date();
    await quizlet.save();
    const competedQuizlet = new this.CompletedQuizletModel(preparedQuizlet);
    const savedCompletedQuizlet = await competedQuizlet.save();
    this.emitter.emit('CompletedQuizletCreated', savedCompletedQuizlet);
    return savedCompletedQuizlet;
  }
  async getCompletedQuizletReportTable(
    clientId: Types.ObjectId,
    quizletId: Types.ObjectId,
    from: string,
    to: string,
    page: number,
  ) {
    const fromMoment = moment(from);
    const toMoment = moment(to)
      .set('hour', 23)
      .set('minute', 59);
    const filter = {
      clientId: clientId,
      quizletId: quizletId,
      createdAt: {
        $gte: fromMoment.toDate(),
        $lte: toMoment.toDate(),
      },
    };
    const quizlets = await this.CompletedQuizletModel.paginate(filter, {
      page,
      sort: '-createdAt',
    });
    const quizletNames = await this.CompletedQuizletModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$quizletId',
          question: { $addToSet: '$question' },
        },
      },
    ]);
    return { quizlets, quizletNames };
  }
  getCompletedQuizletReports(
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

    const data = this.CompletedQuizletModel.aggregate([
      { $match: filter },
      {
        $project: {
          isCorrect: '$isCorrect',
          question: '$question',
          quizletId: '$quizletId',
        },
      },
      {
        $group: {
          _id: '$quizletId',
          question: { $addToSet: '$question' },
          frequency: { $sum: 1 },
          totalCorrect: {
            $sum: { $cond: [{ $eq: ['$isCorrect', true] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: '$_id',
          question: '$question',
          frequency: '$frequency',
          accuracy: {
            $multiply: [100, { $divide: ['$totalCorrect', '$frequency'] }],
          },
        },
      },
      { $sort: { frequency: -1, _id: -1 } },
    ]);

    return data;
  }
}
