import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Polly, S3 } from 'aws-sdk';
import * as BB from 'bluebird';
import * as fs from 'fs';
import { reject } from 'lodash';
import { EnvironmentVariables } from 'src/config';
import { VOICE_NAMES } from 'src/shared/const/aac-voices';
import { User } from '../users/schema';

@Injectable()
export class PollyService {
  s3: S3;
  polly: Polly;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  region: string;

  constructor(private config: ConfigService<EnvironmentVariables>) {
    this.accessKeyId = this.config.get('AWS_ACCESS_KEY');
    this.secretAccessKey = this.config.get('AWS_SECRET_KEY');
    this.bucket = this.config.get('AWS_BUCKET');
    this.region = this.config.get('AWS_REGION');
    this.s3 = new S3({
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
    });
    this.polly = new Polly({
      region: this.region,
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
    });
  }

  async getSentenceMp3(voiceId: string, text: string) {
    const engine = this.getEngineByVoiceId(voiceId);
    const s3Params = {
      Engine: engine,
      OutputFormat: 'mp3',
      Text: text,
      TextType: 'ssml',
      VoiceId: voiceId,
      SampleRate: '24000',
    };

    try {
      return new Promise(async (res, rej) => {
        this.polly.synthesizeSpeech(s3Params, (err, data) => {
          if (err) {
            console.log(err.code);
            rej(err);
          } else if (data) {
            if (data.AudioStream instanceof Buffer) {
              res(data.AudioStream);
            }
          }
        });
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  }

  async initSpeechFile(
    voices: { voiceId: string }[],
    text: string,
    isAacMp3 = true,
  ) {
    let location = '';
    if (isAacMp3) location = 'aac/sounds';
    else location = 'activities/sounds';

    const links = await BB.mapSeries(voices, async voice => {
      const engine = this.getEngineByVoiceId(voice.voiceId);

      const s3Params = {
        Engine: engine,
        OutputFormat: 'mp3',
        Text: text,
        TextType: 'text',
        VoiceId: voice.voiceId,
        SampleRate: '24000',
      };

      const resFile = await this.generateSpeechFile(s3Params);
      if (resFile) {
        const link = await this.uploadToS3(
          resFile,
          `${location}/${s3Params.VoiceId.toLowerCase()}/${s3Params.Text}.${
            s3Params.OutputFormat
          }`,
          'audio/mp3',
        );
        if (link) await this.deleteFile(resFile);

        return link;
      }
      return;
    });
    return links;
  }

  private async generateSpeechFile(s3Params) {
    try {
      return new Promise(async (res, rej) => {
        const filePath = `./static/uploads/${s3Params.VoiceId}_${s3Params.Text}.${s3Params.OutputFormat}`;
        this.polly.synthesizeSpeech(s3Params, (err, data) => {
          if (err) {
            console.log(err.code);
            rej(err);
          } else if (data) {
            if (data.AudioStream instanceof Buffer) {
              fs.writeFile(filePath, data.AudioStream, function(err) {
                if (err) {
                  console.log(err);
                  rej(err);
                }
                res(filePath);
              });
            }
          }
        });
      });
    } catch (e) {
      console.log(e);
    }
  }

  private async uploadToS3(localPath, uploadPath, type) {
    const fileContent = await this.readFile(localPath);
    const params = {
      Bucket: this.bucket,
      Key: uploadPath,
      Body: fileContent,
      ACL: 'public-read-write',
      ContentType: type,
    };
    return new Promise(async (res, rej) => {
      this.s3.upload(params, function(err, data) {
        if (err) {
          console.log(err);
          rej(err);
        }
        res(data.Location);
      });
    });
  }

  private readFile(path) {
    return new Promise((res, rej) => {
      fs.readFile(path, (err, data) => {
        if (err) rej(err);
        res(data);
      });
    });
  }
  private deleteFile(path) {
    fs.unlink(path, err => {
      if (err) {
        throw err;
      }
      console.log(`${path} has been deleted`);
    });
  }

  async getAacVoices(user: User) {
    const voices = await BB.map(VOICE_NAMES, async voice => {
      return { ...voice, url: this.getLink(voice.voiceId) };
    });
    return voices;
  }

  getLink(voiceId: string) {
    return `https://${
      this.bucket
    }.s3.amazonaws.com/aac/sounds/${voiceId.toLowerCase()}/sample/${voiceId.toLowerCase()}.mp3`;
  }

  getEngineByVoiceId(voiceId: string): string {
    const voice = VOICE_NAMES.find(o => o.voiceId === voiceId);
    if (!voice)
      throw new BadRequestException(`voice id ${voiceId} does not exists`);

    return voice.engine;
  }
}
