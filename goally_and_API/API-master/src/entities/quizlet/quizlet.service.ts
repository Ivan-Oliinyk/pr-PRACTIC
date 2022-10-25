import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as BB from 'bluebird';
import { omit } from 'lodash';
import { LeanDocument, Model, Types } from 'mongoose';
import { InjectEventEmitter } from 'nest-emitter';
import { ClientsService } from 'src/entities/clients/clients.service';
import { User } from 'src/entities/users/schema';
import { LIBRARY_TYPES } from 'src/shared/const';
import { QUIZLET_TYPES } from 'src/shared/const/quizlet-types';
import { REORDERING_ACTION } from 'src/shared/const/reordering.action';
import { GoallyEventEmitter } from 'src/shared/events/const';
import { validateOrdering } from 'src/shared/validation/OrderingValidation';
import { Routine } from '../routines/schema/routine.schema';
import { UsersService } from '../users/users.service';
import {
  CreateChildQuizletDto,
  CreateQuizlet,
  ReorderQuizlet,
  UpdateQuizlet,
} from './dto';
import {
  QuizletOrderDto,
  UpdateQuizletOrdersDto,
} from './dto/UpdateQuizletOrder.dto';
import { predefinedQuizlets } from './predefinedData';
import { quizletBedTime } from './predefinedData/bedtime.quizlet';
import { quizletMorning } from './predefinedData/morning.quizlet';
import { quizletOther } from './predefinedData/other.quizlet';
import { Quizlet } from './schema/quizlet.schema';

@Injectable()
export class QuizletService {
  constructor(
    @InjectModel(Quizlet.name) private QuizletModel: Model<Quizlet>,
    @Inject(forwardRef(() => ClientsService))
    private cs: ClientsService,
    @Inject(forwardRef(() => UsersService))
    private us: UsersService,
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
  ) {}

  async create(quizletData: CreateQuizlet, user: User) {
    const quizlet = new this.QuizletModel({
      ...quizletData,
      createdBy: user._id,
    });
    quizlet.ordering = 0;
    await this.QuizletModel.updateMany(
      {
        ordering: { $gte: quizlet.ordering },
        createdBy: quizlet.createdBy,
        libraryType: LIBRARY_TYPES.ADULT,
      },
      { $inc: { ordering: 1 } },
    );
    const savedQuizlet = await quizlet.save();
    quizletData.answers.map(e =>
      e.assetSetting ? this.emitter.emit('AssetShared', e.imgURL) : null,
    );
    this.emitter.emit('QuizletCreated', savedQuizlet);
    return savedQuizlet;
  }
  async createForChild(quizletData: CreateChildQuizletDto, user: User) {
    const parentQuizlet = await this.QuizletModel.findById(
      quizletData.parentQuizletId,
    ).lean();
    quizletData.parentQuizletId;
    if (!parentQuizlet)
      throw new NotFoundException(
        `Quizlet ${quizletData.parentQuizletId} not found `,
      );

    const newQuizlet = omit(
      {
        ...parentQuizlet,
        ...quizletData,
        createdBy: user._id,
        parentQuizId: parentQuizlet._id,
        clientId: quizletData.clientId,
        libraryType: LIBRARY_TYPES.CHILD,
        ordering: 0,
      },
      '_id',
      'createdAt',
      'updatedAt',
    );

    const quizlet = new this.QuizletModel(newQuizlet);

    await this.QuizletModel.updateMany(
      { ordering: { $gte: quizlet.ordering }, clientId: quizlet.clientId },
      { $inc: { ordering: 1 } },
    );
    const savedQuizlet = await quizlet.save();
    this.emitter.emit('QuizletCreatedForTheChild', savedQuizlet);
    return savedQuizlet;
  }

  async update(
    quizletId: Types.ObjectId,
    quizletData: UpdateQuizlet,
    user: User,
  ) {
    const quizlet = await this.getByIdWithCreatedBy(quizletId, user);
    const savedQuizlet = await this.QuizletModel.findByIdAndUpdate(
      quizlet._id,
      quizletData,
      {
        new: true,
      },
    );
    this.emitter.emit('QuizletUpdated', savedQuizlet);
    quizletData.answers.map(e =>
      e.assetSetting ? this.emitter.emit('AssetShared', e.imgURL) : null,
    );
    return savedQuizlet;
  }

  updateOrder = (user: User) => async (quizletData: QuizletOrderDto) => {
    const quizlet = await this.getByIdWithCreatedBy(quizletData._id, user);
    if (quizlet.ordering !== quizletData.ordering) {
      const updatedQuizlet = await this.QuizletModel.findByIdAndUpdate(
        quizlet._id,
        quizletData,
        {
          new: true,
        },
      );

      this.emitter.emit('QuizletLibraryReordered', updatedQuizlet);
      return updatedQuizlet;
    } else return quizlet;
  };
  async updateOrderings(
    clientId: Types.ObjectId,
    body: UpdateQuizletOrdersDto,
    user: User,
  ) {
    const query = clientId
      ? { clientId: clientId }
      : {
          createdBy: user._id,
          libraryType: LIBRARY_TYPES.ADULT,
        };
    const quizletCount = await this.QuizletModel.count(query);
    if (!quizletCount)
      throw new BadRequestException(
        `Cannot find any quizlets for clientId ${clientId}`,
      );
    if (quizletCount !== body.quizlets.length)
      throw new BadRequestException(
        `quizlets array size must be equal to ${quizletCount}`,
      );

    validateOrdering(quizletCount, body.quizlets);
    const updatedQuizlets = Promise.all(
      body.quizlets.map(this.updateOrder(user)),
    );
    return updatedQuizlets;
  }

  async delete(quizletId: Types.ObjectId, user: User) {
    const quizlet = await this.getByIdWithCreatedBy(quizletId, user);
    await quizlet.remove();
    const query = quizlet.clientId
      ? { ordering: { $gte: quizlet.ordering }, clientId: quizlet.clientId }
      : {
          ordering: { $gte: quizlet.ordering },
          createdBy: quizlet.createdBy,
          libraryType: LIBRARY_TYPES.ADULT,
        };
    await this.QuizletModel.updateMany(query, { $inc: { ordering: -1 } });
    this.emitter.emit('QuizletDeleted', quizlet);
    return;
  }
  async getByIdWithCreatedBy(
    _id: Types.ObjectId,
    createdBy: User,
  ): Promise<Quizlet> {
    const quizlet = await this.QuizletModel.findOne({
      _id,
    });
    if (!quizlet)
      throw new NotFoundException(
        `quizlet ${_id}, for user ${createdBy._id} not found`,
      );
    return quizlet;
  }
  getUserQuizletLibrary(createdBy: User) {
    return this.QuizletModel.find({
      createdBy: createdBy._id,
      libraryType: LIBRARY_TYPES.ADULT,
    }).sort('ordering');
  }
  async getUserQuizletForChild(clientId: Types.ObjectId, user: User) {
    const client = await this.cs.findById(clientId);
    const quizlet = this.findClientQuizlet(client._id);
    return quizlet;
  }
  async findClientQuizlet(clientId: Types.ObjectId): Promise<Quizlet[]> {
    const quizlet = await this.QuizletModel.find({
      clientId,
      libraryType: LIBRARY_TYPES.CHILD,
    }).sort('ordering');
    return quizlet;
  }
  async getClientQuizletByDeviceId(deviceId) {
    const client = await this.cs.getClientByDevice(deviceId);
    if (!client)
      throw new BadRequestException('Child not connected to that device');
    const quizlet = this.findClientQuizlet(client._id);
    return quizlet;
  }
  findById(quizletId) {
    return this.QuizletModel.findById(quizletId);
  }
  async getClientQuizletByDeviceIdAndId(
    deviceId: Types.ObjectId,
    quizletId: string,
  ) {
    const client = await this.cs.getClientByDevice(deviceId);
    if (!client)
      throw new BadRequestException('Child not connected to that device');
    const quizlet = await this.findById(quizletId);
    if (!quizlet)
      throw new NotFoundException(
        `quizlet with id ${quizletId}  doest not exist for the device with id ${deviceId}`,
      );
    return quizlet;
  }
  async reorderChildLibrary(data: ReorderQuizlet) {
    const quizlet = await this.QuizletModel.findById(data.quizletId);
    if (!quizlet)
      throw new NotFoundException(`quizlet ${data.quizletId},  not found`);
    const quizletCount = await this.QuizletModel.count({
      clientId: quizlet.clientId,
    });

    if (data.action == REORDERING_ACTION.DOWN) {
      if (quizlet.ordering == quizletCount - 1) {
        await this.QuizletModel.updateMany(
          { ordering: { $gte: 0 }, clientId: quizlet.clientId },
          { $inc: { ordering: 1 } },
        );
        quizlet.ordering = 0;
      } else {
        quizlet.ordering += 1;

        await this.QuizletModel.findOneAndUpdate(
          { ordering: quizlet.ordering, clientId: quizlet.clientId },
          { $inc: { ordering: -1 } },
        );
      }
    } else {
      if (quizlet.ordering == 0) {
        await this.QuizletModel.updateMany(
          { ordering: { $lte: quizletCount }, clientId: quizlet.clientId },
          { $inc: { ordering: -1 } },
        );
        quizlet.ordering = quizletCount - 1;
      } else {
        quizlet.ordering -= 1;
        await this.QuizletModel.findOneAndUpdate(
          { ordering: quizlet.ordering, clientId: quizlet.clientId },
          { $inc: { ordering: 1 } },
        );
      }
    }

    const savedQuizlet = await quizlet.save();
    this.emitter.emit('QuizletLibraryReordered', savedQuizlet);
    return savedQuizlet;
  }

  async createPredefinedQuizlets(user: User) {
    const quizlets = await BB.mapSeries(
      predefinedQuizlets,
      async quizletData => {
        const quizlet = await this.create(quizletData, user._id);
        return quizlet;
      },
    );
    return quizlets;
  }

  async removeNewQuizlets() {
    const predefinedQuizletName = predefinedQuizlets.map(e => e.question);
    return this.QuizletModel.remove({
      question: { $in: predefinedQuizletName },
    });
  }

  async removeNewQuizletsInAdultLibrary() {
    const predefinedQuizletName = predefinedQuizlets.map(e => e.question);
    return this.QuizletModel.remove({
      question: { $in: predefinedQuizletName },
      libraryType: LIBRARY_TYPES.ADULT,
    });
  }

  async addNewQuizlets() {
    const total = await this.us.UserModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await BB.mapSeries(new Array(arrayLength), async (elem, index) => {
        const users = await this.us.UserModel.find({})
          .limit(series)
          .skip(series * index);
        await BB.mapSeries(users, async user => {
          await this.createPredefinedQuizlets(user);
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

  async addAdultsLibOrdering() {
    const total = await this.us.UserModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await BB.mapSeries(new Array(arrayLength), async (elem, index) => {
        const users = await this.us.UserModel.find({})
          .limit(series)
          .skip(series * index);
        await BB.mapSeries(users, async user => {
          await this.addAdultLibOrdering(user);
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

  async addAdultLibOrdering(user: User) {
    const adultQuizlets = this.getUserQuizletLibrary(user);
    let ordering = 0;
    const quizlets = await BB.mapSeries(adultQuizlets, async adultQuizlet => {
      adultQuizlet.ordering = ordering;
      ordering++;
      const quizlet = await this.QuizletModel.findByIdAndUpdate(
        adultQuizlet._id,
        adultQuizlet,
        { new: true },
      );
      return quizlet;
    });
    return quizlets;
  }

  async addQuizletForRoutine(
    routine: LeanDocument<Routine>,
    clientId: Types.ObjectId,
    user: User,
  ) {
    let quizlet: CreateQuizlet;
    if (
      routine.category == QUIZLET_TYPES.MORNING ||
      routine.name.toLowerCase().includes('morning')
    )
      quizlet = quizletMorning;
    else if (
      routine.category == QUIZLET_TYPES.BEDTIME ||
      routine.name.toLowerCase().includes('bedtime') ||
      routine.name.toLowerCase().includes('night')
    )
      quizlet = quizletBedTime;
    else quizlet = quizletOther;

    const quizletFromDB = await this.QuizletModel.findOne({
      type: quizlet.type,
      clientId,
    });
    if (quizletFromDB) {
      quizletFromDB.assignedRoutines.push(routine._id);
      return await this.update(quizletFromDB._id, quizletFromDB, user);
    }

    return await this.create(
      {
        ...quizlet,
        libraryType: LIBRARY_TYPES.CHILD,
        assignedRoutines: [routine._id],
        clientId,
      },
      user,
    );
  }

  async addQuizletsTypeFiled() {
    const total = await this.QuizletModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await BB.mapSeries(new Array(arrayLength), async (elem, index) => {
        const quizlets = await this.QuizletModel.find({})
          .limit(series)
          .skip(series * index);
        await BB.mapSeries(quizlets, async quizlet => {
          await this.addQuizletTypeFiled(quizlet);
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

  async addQuizletTypeFiled(quizlet: Quizlet) {
    quizlet.type = QUIZLET_TYPES.OTHER;
    quizlet.save();
  }
}
