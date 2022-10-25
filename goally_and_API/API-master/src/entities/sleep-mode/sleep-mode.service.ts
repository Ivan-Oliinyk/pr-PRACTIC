import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as BB from 'bluebird';
import { Model, Types } from 'mongoose';
import { InjectEventEmitter } from 'nest-emitter';
import { EnvironmentVariables } from 'src/config';
import { User } from 'src/entities/users/schema';
import { GoallyEventEmitter } from 'src/shared/events/const';
import { AdminConfigService } from '../admin-config/admin-config.service';
import { SleepModeDto } from './dto/sleep-mode.dto';
import { SleepMode } from './schema/sleep-mode.schema';

@Injectable()
export class SleepModeService {
  bucket: string;

  constructor(
    @InjectModel(SleepMode.name) public SleepModeModel: Model<SleepMode>,
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
    @Inject(forwardRef(() => AdminConfigService))
    private adminConfigService: AdminConfigService,
    private config: ConfigService<EnvironmentVariables>,
  ) {
    this.bucket = this.config.get('AWS_BUCKET');
  }

  async getClientSleepMode(clientId: Types.ObjectId) {
    const sleepMode = await this.SleepModeModel.findOne({ clientId: clientId });
    if (!sleepMode)
      throw new BadRequestException(
        `Sleep mode does not exist for clientId: ${clientId}`,
      );
    return sleepMode;
  }

  async update(
    sleepModeData: SleepModeDto,
    sleepModeId: Types.ObjectId,
    user: User,
  ): Promise<SleepMode> {
    const updatedSleepModeData = { ...sleepModeData, createdBy: user._id };
    const sleepMode = await this.SleepModeModel.findById(sleepModeId);
    if (!sleepMode) {
      throw new BadRequestException(`provided id ${sleepModeId} is incorrect`);
    }
    const savedSleepMode = await this.SleepModeModel.findByIdAndUpdate(
      sleepModeId,
      updatedSleepModeData,
      { new: true },
    );
    this.emitter.emit('SleepModeUpdated', savedSleepMode);
    return savedSleepMode;
  }

  async createClientSleepMode(sleepModeData: SleepModeDto, user: User) {
    const existingSleepMode = await this.SleepModeModel.findOne({
      clientId: sleepModeData.clientId,
    });
    if (existingSleepMode) {
      const savedSleepMode = await this.SleepModeModel.findByIdAndUpdate(
        existingSleepMode._id,
        sleepModeData,
        { new: true },
      );
      this.emitter.emit('SleepModeCreated', savedSleepMode);
      return savedSleepMode;
    } else {
      const sleepMode = { ...sleepModeData, createdBy: user._id };
      const newSleepMode = new this.SleepModeModel(sleepMode);
      const savedSleepMode = await newSleepMode.save();
      this.emitter.emit('SleepModeCreated', savedSleepMode);
      return savedSleepMode;
    }
  }

  async getSleepAids(user: User) {
    return this.adminConfigService.getSleepAids();
  }

  async getAudioCount(audioUrl: string) {
    const count = this.SleepModeModel.count({ audioUrl });
    return count;
  }

  async getVideoCount(videoUrl: string) {
    const count = this.SleepModeModel.count({ visualAidUrl: videoUrl });
    return count;
  }

  async updateWakeUpVideoFields() {
    const total = await this.SleepModeModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await BB.mapSeries(new Array(arrayLength), async (elem, index) => {
        const sleepModes = await this.SleepModeModel.find({})
          .limit(series)
          .skip(series * index);
        await BB.mapSeries(sleepModes, async sleepMode => {
          await this.updateWakeUpVideoField(sleepMode);
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

  async updateWakeUpVideoField(sleepMode: SleepMode) {
    if (sleepMode.isWakeUpCelebration) {
      sleepMode.wakeUpVideo = this.getWakeUpVideoURL();
      const savedClient = await new this.SleepModeModel(sleepMode).save();
      return savedClient;
    }
  }

  getWakeUpVideoURL() {
    return `https://${this.bucket}.s3.amazonaws.com/sleep_mode/videos/wake_up_animation.mp4`;
  }
}
