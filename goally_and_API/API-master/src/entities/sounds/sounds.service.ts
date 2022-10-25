import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as BB from 'bluebird';
import { Model, Types } from 'mongoose';
import { InjectEventEmitter } from 'nest-emitter';
import { User } from 'src/entities/users/schema';
import { NEURAL_VOICE_NAMES } from 'src/shared/const/client-voices';
import { GoallyEventEmitter } from 'src/shared/events/const';
import { ACTION_TYPE, LOGS_TYPE } from '../app-logs/schema/app-logs.schema';
import { ClientsService } from '../clients/clients.service';
import { Client } from '../clients/schema/client.schema';
import { defaultSound, newSounds } from './predefinedData/default-sound';
import { Sound } from './schema/sound.schema';
@Injectable()
export class SoundsService {
  constructor(
    @InjectModel(Sound.name) private SoundModel: Model<Sound>,
    @Inject(forwardRef(() => ClientsService))
    private cs: ClientsService,
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
  ) {}

  async getClientSound(clientId: Types.ObjectId, user: User) {
    const sound = await this.SoundModel.findOne({ clientId });
    return sound;
  }

  async getClientSoundByDeviceId(deviceId) {
    const client = await this.cs.getClientByDevice(deviceId);
    if (!client)
      throw new BadRequestException('Child not connected to that device');
    const sounds = this.getClientSound(client._id, null);
    return sounds;
  }

  async update(
    soundData: Partial<Sound>,
    soundId: Types.ObjectId,
    user: User,
  ): Promise<Sound> {
    const sound = await this.SoundModel.findById(soundId);
    if (!sound) {
      throw new BadRequestException(`provided id ${soundId} is incorrect`);
    }
    const savedSound = await this.SoundModel.findByIdAndUpdate(
      soundId,
      soundData,
      { new: true },
    );
    this.emitter.emit('SoundUpdated', savedSound);
    if (user)
      this.emitter.emit('CreateLog', {
        action: ACTION_TYPE.UPDATE,
        entity: LOGS_TYPE.SOUNDS,
        user: user._id,
        client: savedSound.clientId,
        meta: { oldSound: sound, newSound: savedSound },
      });
    return savedSound;
  }

  async updateClientSoundByDeviceId(
    soundData: Partial<Sound>,
    soundId: Types.ObjectId,
    deviceId,
  ) {
    const client = await this.cs.getClientByDevice(deviceId);
    if (!client)
      throw new BadRequestException('Child not connected to that device');
    return this.update(soundData, soundId, null);
  }

  async createClientSounds() {
    const total = await this.cs.ClientModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await BB.mapSeries(new Array(arrayLength), async (elem, index) => {
        const clients = await this.cs.ClientModel.find({})
          .limit(series)
          .skip(series * index);
        await BB.mapSeries(clients, async client => {
          await this.createPredefinedSounds(client);
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

  async createPredefinedSounds(client: Client) {
    const defSound = defaultSound;

    const sound = new this.SoundModel(defSound);
    sound.clientId = client._id;
    const savedSound = await sound.save();
    return savedSound;
  }

  async updateGeneralSounds() {
    const total = await this.SoundModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await BB.mapSeries(new Array(arrayLength), async (elem, index) => {
        const sounds = await this.SoundModel.find({})
          .limit(series)
          .skip(series * index);
        await BB.mapSeries(sounds, async sound => {
          await this.updateGeneralSound(sound);
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

  async updateGeneralSound(existingSound: Sound) {
    existingSound.generalNew = defaultSound.generalNew;
    const sound = new this.SoundModel(existingSound);
    const savedSound = await sound.save();
    return savedSound;
  }

  voices(user: User) {
    return NEURAL_VOICE_NAMES;
  }

  async getClientSoundObject(clientId: Types.ObjectId) {
    const sound = await this.SoundModel.findOne({ clientId }).lean();
    return sound;
  }

  async addNewSounds() {
    const total = await this.SoundModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await BB.mapSeries(new Array(arrayLength), async (elem, index) => {
        const sounds = await this.SoundModel.find({})
          .limit(series)
          .skip(series * index);
        await BB.mapSeries(sounds, async sound => {
          await this.addNewSound(sound);
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

  async addNewSound(existingSound: Sound) {
    if (existingSound && existingSound.visualScdedule) {
      existingSound.visualScdedule.forEach(element => {
        element.audioList.push(...newSounds);
      });
    }
    if (existingSound && existingSound.timer) {
      existingSound.timer.forEach(element => {
        element.audioList.push(...newSounds);
      });
    }
    if (existingSound && existingSound.reward) {
      existingSound.reward.forEach(element => {
        element.audioList.push(...newSounds);
      });
    }
    if (existingSound && existingSound.behavior) {
      existingSound.behavior.forEach(element => {
        element.audioList.push(...newSounds);
      });
    }
    if (existingSound && existingSound.puzzle) {
      existingSound.puzzle.forEach(element => {
        element.audioList.push(...newSounds);
      });
    }

    const sound = new this.SoundModel(existingSound);
    const savedSound = await sound.save();
    return savedSound;
  }
}
