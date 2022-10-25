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
import { LIBRARY_TYPES } from 'src/shared/const';
import { CHECKLIST_TYPE } from 'src/shared/const/checklist-type';
import { REORDERING_ACTION } from 'src/shared/const/reordering.action';
import { TYPES } from 'src/shared/const/routine-type';
import { GoallyEventEmitter } from 'src/shared/events/const';
import { PdfService } from '../../shared/pdf/pdf.service';
import { ClientsService } from '../clients/clients.service';
import { User } from '../users/schema';
import { CreateChecklistDto } from './dto/CreateChecklist.dto';
import { CreateChildChecklistDto } from './dto/CreateChildChecklist.dto';
import { ReorderChecklistDto } from './dto/ReorderChecklist.dto';
import { UpdateChecklistDto } from './dto/UpdateChecklist.dto';
import { Checklist } from './schema/checklist.schema';
@Injectable()
export class ChecklistsService {
  constructor(
    @InjectModel(Checklist.name) public ChecklistModel: Model<Checklist>,
    @Inject(forwardRef(() => ClientsService))
    private cs: ClientsService,
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
    @Inject(forwardRef(() => PdfService))
    private pdfService: PdfService,
  ) {}

  async create(checklistData: CreateChecklistDto, user: User) {
    if (checklistData.type == CHECKLIST_TYPE.MANUAL) {
      checklistData.schedule = null;
    }

    const key = 'ordering';
    const uniqActivities = [
      ...new Map(
        checklistData.activities.map(item => [item[key], item]),
      ).values(),
    ];

    if (new Set(uniqActivities).size !== checklistData.activities.length)
      throw new BadRequestException(
        `checklists activities ordering must have unique order`,
      );

    const checklist = new this.ChecklistModel(checklistData);
    checklist.createdBy = user._id;
    checklist.libraryType = LIBRARY_TYPES.ADULT;
    checklist.ordering = 0;
    await this.ChecklistModel.updateMany(
      {
        ordering: { $gte: checklist.ordering },
        createdBy: checklist.createdBy,
        libraryType: LIBRARY_TYPES.ADULT,
      },
      { $inc: { ordering: 1 } },
    );
    const savedChecklist = await checklist.save();
    this.emitter.emit('ChecklistCreated', savedChecklist);
    return savedChecklist;
  }

  async createChildChecklist(
    checklistData: CreateChildChecklistDto,
    user: User,
  ) {
    const parentChecklist = await this.ChecklistModel.findById(
      checklistData.parentChecklistId,
    ).lean();
    if (!parentChecklist)
      throw new NotFoundException(
        `Checklist ${checklistData.parentChecklistId} not found `,
      );

    //if devices are not provided, use all the client devices
    if (isEmpty(parentChecklist.devices)) {
      const devices = (
        await this.cs.getAllDevicesByClientId(checklistData.clientId)
      ).map(e => e._id);
      parentChecklist.devices = devices;
    }

    const newChecklist = omit(
      {
        ...parentChecklist,
        createdBy: user._id,
        clientId: checklistData.clientId,
        libraryType: LIBRARY_TYPES.CHILD,
        ordering: 0,
        ctaOrdering: 0,
      },
      '_id',
      'createdAt',
      'updatedAt',
    );

    const checklist = new this.ChecklistModel(newChecklist);
    await this.ChecklistModel.updateMany(
      { ordering: { $gte: checklist.ordering }, clientId: checklist.clientId },
      { $inc: { ordering: 1 } },
    );
    await this.cs.updateAllCtaOrderings(
      1,
      checklist.ctaOrdering,
      checklist.clientId,
    );
    const checklistFromDb = await checklist.save();
    this.emitter.emit('ChecklistCreatedForTheChild', checklistFromDb);
    return checklistFromDb;
  }

  async getById(_id: Types.ObjectId, createdBy: User): Promise<Checklist> {
    const checklist = await this.ChecklistModel.findById(_id);
    if (!checklist)
      throw new NotFoundException(
        `checklist with id ${_id}, for user ${createdBy._id} not found`,
      );

    return checklist;
  }

  async update(
    checklistId: Types.ObjectId,
    checklistData: UpdateChecklistDto,
    user: User,
  ) {
    if (checklistData.type == CHECKLIST_TYPE.MANUAL) {
      checklistData.schedule = null;
    }
    const checklist = await this.getById(checklistId, user);
    const updatedChecklist = await this.ChecklistModel.findByIdAndUpdate(
      checklist._id,
      checklistData,
      {
        new: true,
      },
    );

    this.emitter.emit('ChecklistUpdated', updatedChecklist);
    return updatedChecklist;
  }

  async delete(checklistId: Types.ObjectId, user: User) {
    const checklist = await this.getById(checklistId, user);
    await checklist.remove();
    const query = checklist.clientId
      ? { ordering: { $gte: checklist.ordering }, clientId: checklist.clientId }
      : {
          ordering: { $gte: checklist.ordering },
          createdBy: checklist.createdBy,
          libraryType: LIBRARY_TYPES.ADULT,
        };
    await this.ChecklistModel.updateMany(query, { $inc: { ordering: -1 } });
    if (checklist.libraryType == LIBRARY_TYPES.CHILD && checklist.clientId) {
      await this.cs.updateAllCtaOrderings(
        -1,
        checklist.ctaOrdering,
        checklist.clientId,
      );
    }
    this.emitter.emit('ChecklistDeleted', checklist);
    return;
  }
  async deleteChecklistActivity(
    checklistId: Types.ObjectId,
    activityId: Types.ObjectId,
    user: User,
  ) {
    const checklistData = await this.getById(checklistId, user);
    checklistData.activities = checklistData.activities.filter(
      activity => activity._id.toString() !== activityId.toString(),
    );
    const updatedChecklist = await this.update(
      checklistId,
      checklistData,
      user,
    );
    return updatedChecklist;
  }

  async getUserChecklists(user: User) {
    const checklists = await this.ChecklistModel.find({
      createdBy: user._id,
      libraryType: LIBRARY_TYPES.ADULT,
    })
      .sort('ordering')
      .lean();

    return checklists;
  }
  async getUserChecklistsForChild(clientId: Types.ObjectId) {
    const client = await this.cs.findById(clientId);
    const checklists = this.findClientChecklists(client._id);
    return checklists;
  }
  async findClientChecklists(clientId): Promise<Checklist[]> {
    const checklists = await this.ChecklistModel.find({
      clientId,
    }).sort('ordering');
    return checklists;
  }

  async reorderChildLibrary(data: ReorderChecklistDto) {
    const checklist = await this.ChecklistModel.findById(data.checklistId);
    const checklistCount = await this.ChecklistModel.count({
      clientId: checklist.clientId,
    });

    if (data.action == REORDERING_ACTION.DOWN) {
      if (checklist.ordering == checklistCount - 1) {
        await this.ChecklistModel.updateMany(
          { ordering: { $gte: 0 }, clientId: checklist.clientId },
          { $inc: { ordering: 1 } },
        );
        checklist.ordering = 0;
      } else {
        checklist.ordering += 1;

        await this.ChecklistModel.findOneAndUpdate(
          { ordering: checklist.ordering, clientId: checklist.clientId },
          { $inc: { ordering: -1 } },
        );
      }
    } else {
      if (checklist.ordering == 0) {
        await this.ChecklistModel.updateMany(
          { ordering: { $lte: checklistCount }, clientId: checklist.clientId },
          { $inc: { ordering: -1 } },
        );
        checklist.ordering = checklistCount - 1;
      } else {
        checklist.ordering -= 1;
        await this.ChecklistModel.findOneAndUpdate(
          { ordering: checklist.ordering, clientId: checklist.clientId },
          { $inc: { ordering: 1 } },
        );
      }
    }

    const savedChecklist = await checklist.save();
    this.emitter.emit('ChecklistReordered', savedChecklist);
    return savedChecklist;
  }

  //MOBILE
  async getClientChecklistsByDeviceId(deviceId: Types.ObjectId) {
    const client = await this.cs.getClientByDevice(deviceId);
    if (!client)
      throw new BadRequestException('Child not connected to that device');
    const checklists = await this.findClientChecklists(client._id);

    return checklists;
  }
  async getClientChecklistByDeviceAndId(
    deviceId: Types.ObjectId,
    checklistId: Types.ObjectId,
  ) {
    const client = await this.cs.getClientByDevice(deviceId);
    if (!client)
      throw new BadRequestException('Child not connected to that device');
    const checklist = await this.ChecklistModel.findOne({
      clientId: client._id,
      _id: checklistId,
    });
    if (!checklist)
      throw new BadRequestException(
        `device id ${deviceId} does not have checklist Id ${checklistId}`,
      );
    return checklist;
  }

  async getSchedules(clientId: Types.ObjectId) {
    const checklists = await this.ChecklistModel.find(
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
    return checklists;
  }

  async addDevicesFields() {
    const total = await this.ChecklistModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await BB.mapSeries(new Array(arrayLength), async (elem, index) => {
        const routines = await this.ChecklistModel.find({})
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

  async addDevicesField(checklist: Checklist) {
    if (checklist.libraryType == LIBRARY_TYPES.CHILD && checklist.clientId) {
      const devices = (
        await this.cs.getAllDevicesByClientId(checklist.clientId)
      ).map(e => e._id);
      checklist.devices = devices;
    }
    const savedChecklist = await this.ChecklistModel.findByIdAndUpdate(
      checklist._id,
      checklist,
      { new: true },
    );
    return savedChecklist;
  }

  async addCtaOrderings() {
    const total = await this.ChecklistModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await BB.mapSeries(new Array(arrayLength), async (elem, index) => {
        const checklists = await this.ChecklistModel.find({})
          .limit(series)
          .skip(series * index);
        await BB.mapSeries(checklists, async checklist => {
          await this.addCtaOrdering(checklist);
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

  async addCtaOrdering(checklist: Checklist): Promise<Checklist> {
    if (typeof checklist.ordering !== 'number') return checklist;
    checklist.ctaOrdering = checklist.ordering * 3 + 1;
    const updatedChecklist = await this.ChecklistModel.findByIdAndUpdate(
      checklist._id,
      checklist,
      { new: true },
    );
    return updatedChecklist;
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
    await this.ChecklistModel.updateMany(query, {
      $inc: { ctaOrdering: steps },
    });
  }

  async updatePartial(_id: Types.ObjectId, checklist: Partial<Checklist>) {
    const updatedChecklist = await this.ChecklistModel.findByIdAndUpdate(
      _id,
      checklist,
      { new: true },
    );
    return updatedChecklist;
  }

  async emailPdf(email: string, checklistId: Types.ObjectId) {
    const checklist = await this.ChecklistModel.findById(checklistId);
    if (!checklist)
      throw new NotFoundException(`checklist ${checklistId} does not exists`);
    try {
      const activitiesList = checklist.activities.map(activity => {
        return {
          name: activity.name,
          duration: null,
          imgURL: null,
          _id: activity._id,
        };
      });
      const pdfPath = await this.pdfService.generatePdf(
        checklist.name,
        TYPES.CHECKLIST,
        null,
        checklist.schedule,
        activitiesList,
      );
      const pdfUrl = await this.pdfService.uploadPdfToS3(pdfPath);
      const emailRes = await this.pdfService.emailPdf(email, pdfUrl);
      return { success: true, pdfUrl };
    } catch (e) {
      return { success: false, error: e };
    }
  }

  async addDeviceInClientChecklists(
    clientId: Types.ObjectId,
    deviceId: Types.ObjectId,
  ) {
    const checklists = await this.ChecklistModel.find({ clientId });
    await BB.mapSeries(checklists, async checklist => {
      await this.addDeviceInChecklist(checklist._id, deviceId);
    });
  }

  addDeviceInChecklist(checklistId: Types.ObjectId, deviceId: Types.ObjectId) {
    return this.ChecklistModel.findByIdAndUpdate(
      checklistId,
      {
        $addToSet: { devices: deviceId },
      },
      { new: true },
    );
  }

  async reArrangeChecklistsOrdering() {
    const checklists = await this.ChecklistModel.find({});
    await BB.mapSeries(checklists, async checklist => {
      await this.reArrangeChecklistOrdering(checklist);
    });

    return { success: true };
  }

  async reArrangeChecklistOrdering(checklist: Checklist) {
    checklist.activities.forEach((activity, index) => {
      activity.ordering = index;
    });
    const updatedChecklist = await this.ChecklistModel.findByIdAndUpdate(
      checklist._id,
      checklist,
      { new: true },
    );
  }
}
