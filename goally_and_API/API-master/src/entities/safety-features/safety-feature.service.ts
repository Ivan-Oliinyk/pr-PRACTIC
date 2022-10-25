import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { InjectEventEmitter } from 'nest-emitter';
import { GoallyEventEmitter } from 'src/shared/events/const';
import { ClientsService } from '../clients/clients.service';
import { User } from '../users/schema';
import { CreateSafetyFeature } from './dto/CreateSafetyFeature';
import { SafetyFeature } from './schema/safety-feature.schema';
import { SAFETY_LEARNER_TYPES } from '../../shared/const/safety-learner-types';

@Injectable()
export class SafetyFeatureService {
  constructor(
    @InjectModel(SafetyFeature.name)
    private SafetyFeatureModel: Model<SafetyFeature>,
    @Inject(forwardRef(() => ClientsService))
    private cs: ClientsService,
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
  ) {}

  async create(safetyFeatureData: CreateSafetyFeature, user: User) {
    const priorities = safetyFeatureData.contacts.map(
      contact => contact.priority,
    );
    const duplicates = priorities.some(
      (item, idx) => priorities.indexOf(item) != idx,
    );

    if (duplicates) throw new BadRequestException('Priority are not unique');

    const existingSafety = await this.getClientSafety(
      safetyFeatureData.clientId,
    );
    if (existingSafety)
      throw new BadRequestException(
        `Safety feature already exists for client ${safetyFeatureData.clientId}`,
      );

    const safety = new this.SafetyFeatureModel({
      ...safetyFeatureData,
      createdBy: user._id,
    });
    const savedSafety = await safety.save();
    this.emitter.emit('SafetyCreated', savedSafety);
    return savedSafety;
  }

  async getSafety(clientId: Types.ObjectId, user: User) {
    const isClientIdExists = (user.clients as Types.ObjectId[]).includes(
      clientId,
    );
    if (!isClientIdExists)
      throw new NotFoundException(`Client ${clientId} not found in user`);

    const safety = await this.SafetyFeatureModel.findOne({ clientId });
    return safety;
  }

  async getLearnerTypes(user: User){
    return Object.values(SAFETY_LEARNER_TYPES);
  }

  async update(
    safetyFeatureData: CreateSafetyFeature,
    safetyFeatureId: Types.ObjectId,
    user: User,
  ): Promise<SafetyFeature> {
    const safety = await this.SafetyFeatureModel.findById(safetyFeatureId);
    if (!safety) {
      throw new BadRequestException(
        `provided id ${safetyFeatureId} is incorrect`,
      );
    }
    const savedSafety = await this.SafetyFeatureModel.findByIdAndUpdate(
      safetyFeatureId,
      safetyFeatureData,
      { new: true },
    );
    this.emitter.emit('SafetyUpdated', savedSafety);
    return savedSafety;
  }

  async getClientSafety(clientId: Types.ObjectId) {
    const safety = await this.SafetyFeatureModel.findOne({ clientId });
    return safety;
  }

  async getClientSafetyByDeviceId(deviceId) {
    const client = await this.cs.getClientByDevice(deviceId);
    if (!client)
      throw new BadRequestException('Child not connected to that device');
    const safety = await this.getClientSafety(client._id);
    if (!safety)
      throw new NotFoundException(
        `Client ${client._id} does not configured safety feature yet`,
      );
    return safety;
  }
}
