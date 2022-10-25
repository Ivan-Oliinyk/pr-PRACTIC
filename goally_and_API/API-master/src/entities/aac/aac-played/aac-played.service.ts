import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { omit } from 'lodash';
import { Model, Types } from 'mongoose';
import { InjectEventEmitter } from 'nest-emitter';
import { ClientsService } from 'src/entities/clients/clients.service';
import { Device } from 'src/entities/devices/schemas';
import { User } from 'src/entities/users/schema';
import { GoallyEventEmitter } from 'src/shared/events/const';
import { AacWordsService } from '../aac-words/aac-words.service';
import { ChildAacPlayedWord } from './dto/ChildAacPlayedWord.dto';
import { AacPlayedWord } from './schema/aac-played-word.schema';

@Injectable()
export class AacPlayedService {
  constructor(
    @InjectModel(AacPlayedWord.name)
    private AacPlayedWordModel: Model<AacPlayedWord>,
    private cs: ClientsService,
    private aacWordsService: AacWordsService,
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
  ) {}

  async createAacPlayed(
    clientId: Types.ObjectId,
    wordId: Types.ObjectId,
    user?: User,
  ) {
    const client = await this.cs.findById(clientId);
    if (!client) throw new NotFoundException(`Client ${clientId} not found `);

    const aacWord = await this.aacWordsService.findWordByIdAndClientId(
      wordId,
      clientId,
    );
    if (!aacWord) throw new NotFoundException(`Word ${wordId} not found `);
    const points = client.points + client.aacConfig.aacPoints;
    await this.cs.update(
      clientId,
      {
        points,
      },
      null,
    );

    const aacPlayed = omit(
      {
        ...aacWord,
      },
      '_id',
      'createdAt',
      'updatedAt',
    );
    const aacPlayedWord = new this.AacPlayedWordModel(aacPlayed);
    const aacPlayedWordFromDb = await aacPlayedWord.save();
    this.emitter.emit('AacPlayedWordCreated', aacPlayedWordFromDb);
    return aacPlayedWordFromDb;
  }
  childAacPlayedByDeviceId(data: ChildAacPlayedWord, device: Device) {
    const aacPlayedWord = this.createAacPlayed(
      device.client._id,
      data.wordId,
      null,
    );
    return aacPlayedWord;
  }
}
