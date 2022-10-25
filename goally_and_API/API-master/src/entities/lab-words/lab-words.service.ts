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
import { EnvironmentVariables } from 'src/config';
import { ClientsService } from '../clients/clients.service';
import { defaultLabWords } from './predefinedData/default-lab-words';
import { LabWord } from './schema/lab-word.schema';

@Injectable()
export class LabWordsService {
  bucket: string;

  constructor(
    @InjectModel(LabWord.name) private LabWordModel: Model<LabWord>,
    @Inject(forwardRef(() => ClientsService))
    private cs: ClientsService,
    private config: ConfigService<EnvironmentVariables>,
  ) {
    this.bucket = this.config.get('AWS_BUCKET');
  }

  async getClientLabWords(clientId: Types.ObjectId) {
    const labWords = await this.LabWordModel.find({ clientId });
    if (!labWords || labWords.length == 0) {
      throw new BadRequestException(
        `Lab Words does not exist for client: ${clientId}`,
      );
    }
    return labWords;
  }

  async addLabWords() {
    const total = await this.cs.ClientModel.count({});
    const series = 10;
    const arrayLength = total;
    try {
      await BB.mapSeries(new Array(arrayLength), async (elem, index) => {
        const clients = await this.cs.ClientModel.find({})
          .limit(series)
          .skip(series * index);
        await BB.mapSeries(clients, async client => {
          await this.createPredefinedLabWords(client._id);
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

  async createPredefinedLabWords(clientId: Types.ObjectId) {
    await this.LabWordModel.deleteMany({ clientId });

    defaultLabWords.forEach(async labWord => {
      const newLabWord = new this.LabWordModel(labWord);
      newLabWord.clientId = clientId;
      newLabWord.imgUrl = `${this.getBucket()}${labWord.imgUrl}`;
      newLabWord.bgImgUrl = `${this.getBucket()}${labWord.bgImgUrl}`;
      newLabWord.video1 = `${this.getBucket()}${labWord.video1}`;
      newLabWord.video2 = `${this.getBucket()}${labWord.video2}`;
      newLabWord.video3 = `${this.getBucket()}${labWord.video3}`;
      newLabWord.video4 = `${this.getBucket()}${labWord.video4}`;
      newLabWord.video5 = `${this.getBucket()}${labWord.video5}`;
      if (newLabWord.video6)
        newLabWord.video6 = `${this.getBucket()}${labWord.video6}`;

      await newLabWord.save();
    });
  }

  getBucket() {
    return `https://${this.bucket}.s3.amazonaws.com/`;
  }
}
